"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { safeLocalRedirect } from "./safe-local-redirect";
import type { ActionState } from "@/lib/action-state";
import { getTrustedSiteOrigin } from "@/lib/site-origin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { signInSchema, signUpSchema } from "./schemas";

// These server actions are the single entry point for the auth forms.
// Each one validates the submitted form, calls Supabase, and redirects only after success.

function parseCredentials(formData: FormData, mode: "login" | "signup") {
  const credentials = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = (mode === "login" ? signInSchema : signUpSchema).safeParse(
    credentials,
  );

  if (!result.success) {
    const emailIssue = result.error.issues.find(
      (issue) => issue.path[0] === "email",
    );
    const passwordIssue = result.error.issues.find(
      (issue) => issue.path[0] === "password",
    );

    return {
      success: false as const,
      state: {
        fieldErrors: {
          ...(emailIssue ? { email: "Enter a valid email address." } : {}),
          ...(passwordIssue
            ? {
                password:
                  passwordIssue.code === "too_small"
                    ? mode === "signup"
                      ? "Choose a password with at least 8 characters."
                      : "Enter your password."
                    : "Password must be 128 characters or fewer.",
              }
            : {}),
        },
      },
    };
  }

  return { success: true as const, data: result.data };
}

async function getCallbackUrl(next: string) {
  // Signup email confirmations must redirect back into the app after the user verifies their address.
  // The browser origin is checked against the trusted site list before constructing this callback URL.
  const origin = (await headers()).get("origin");
  const siteOrigin = getTrustedSiteOrigin(origin);

  if (!siteOrigin) {
    return null;
  }

  return new URL(
    `/auth/callback?next=${encodeURIComponent(next)}`,
    siteOrigin,
  ).toString();
}

export async function signInAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // Login is intentionally strict: invalid credentials never trigger a redirect,
  // and any auth failure is surfaced as a user-friendly message.
  const parsedCredentials = parseCredentials(formData, "login");

  if (!parsedCredentials.success) {
    return parsedCredentials.state;
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword(
    parsedCredentials.data,
  );

  if (error) {
    if (error.code === "email_not_confirmed") {
      return {
        fieldErrors: {
          email: "Please confirm your email address before signing in.",
        },
      };
    }

    return {
      fieldErrors: {
        email:
          "Check that this is the email address registered to your account.",
        password: "Check your password and try again.",
      },
    };
  }

  redirect(safeLocalRedirect(formData.get("next")));
}

export async function signUpAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // Signup reaches Supabase only after validation and a trusted redirect target is prepared.
  // This ensures the email confirmation flow can safely send the user back to the app.
  const parsedCredentials = parseCredentials(formData, "signup");

  if (!parsedCredentials.success) {
    return parsedCredentials.state;
  }

  const next = safeLocalRedirect(formData.get("next"));
  const emailRedirectTo = await getCallbackUrl(next);

  if (!emailRedirectTo) {
    return {
      error: "We couldn't prepare the confirmation link. Please try again.",
    };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    ...parsedCredentials.data,
    options: { emailRedirectTo },
  });

  if (error) {
    return {
      error:
        "We couldn't create your account with those details. Check your email and password, then try again.",
    };
  }

  if (!data.session) {
    return {
      message:
        "If this email address can be registered, a confirmation email will arrive shortly. Confirm your address before signing in.",
    };
  }

  redirect(next);
}

export async function signOutAction(
  _previousState: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  // Local sign-out clears the browser session cookie without touching other Supabase scopes.
  void _previousState;
  void _formData;

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signOut({ scope: "local" });

  if (error) {
    return { error: "We couldn't sign you out. Please try again." };
  }

  redirect("/");
}
