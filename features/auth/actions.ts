"use server";

import { APIError } from "better-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { safeLocalRedirect } from "./safe-local-redirect";
import type { ActionState } from "@/lib/action-state";
import { auth } from "@/lib/auth";
import { signInSchema, signUpSchema } from "./schemas";

// These server actions validate auth form submissions before calling Better Auth.

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

function getCallbackUrl(next: string) {
  const baseURL = process.env.BETTER_AUTH_URL;

  if (!baseURL) {
    throw new Error("BETTER_AUTH_URL must be configured.");
  }

  return new URL(next, baseURL).toString();
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

  try {
    await auth.api.signInEmail({
      body: parsedCredentials.data,
    });
  } catch (error) {
    if (error instanceof APIError) {
      if (error.body?.code === "EMAIL_NOT_VERIFIED") {
        return {
          fieldErrors: {
            email: "Please confirm your email address before signing in.",
          },
        };
      }

      return { error: "The email or password is incorrect. Please try again." };
    }

    throw error;
  }

  redirect(safeLocalRedirect(formData.get("next")));
}

export async function signUpAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // Prepare a trusted redirect target before creating the account.
  // This lets email confirmation safely return the user to the app.
  const parsedCredentials = parseCredentials(formData, "signup");

  if (!parsedCredentials.success) {
    return parsedCredentials.state;
  }

  const next = safeLocalRedirect(formData.get("next"));

  try {
    await auth.api.signUpEmail({
      body: {
        ...parsedCredentials.data,
        name: "Guest",
        callbackURL: getCallbackUrl(next),
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      return {
        error:
          "We couldn't create your account with those details. Check your email and password, then try again.",
      };
    }

    throw error;
  }

  return {
    message:
      "If this email address can be registered, a confirmation email will arrive shortly. Confirm your address before signing in.",
  };
}

export async function signOutAction(
  _previousState: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  void _previousState;
  void _formData;

  try {
    await auth.api.signOut({
      headers: await headers(),
    });
  } catch (error) {
    if (error instanceof APIError) {
      return { error: "We couldn't sign you out. Please try again." };
    }

    throw error;
  }

  redirect("/");
}
