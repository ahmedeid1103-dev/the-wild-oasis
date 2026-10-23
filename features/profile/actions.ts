"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isUnauthenticatedAuthError } from "@/lib/auth-errors";
import type { ActionState } from "@/lib/action-state";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { guestProfileSchema } from "./schemas";

function getSaveError(code: string | undefined): string {
  if (code === "42501") {
    return "Profile saving is unavailable until the guest profile permissions migration has been applied.";
  }

  if (code === "23505") {
    return "A profile for your account already exists. Refresh the page and try again.";
  }

  return "We couldn't save your profile. Please try again.";
}

export async function saveProfileAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsedValues = guestProfileSchema.safeParse({
    fullName: formData.get("fullName"),
    nationality: formData.get("nationality"),
    nationalID: formData.get("nationalID"),
    countryFlag: formData.get("countryFlag"),
  });

  if (!parsedValues.success) {
    return {
      error: "Complete each field using the allowed length, then try again.",
    };
  }

  const values = parsedValues.data;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError && isUnauthenticatedAuthError(authError)) {
    redirect("/login?next=%2Faccount%2Fprofile");
  }

  if (authError) {
    throw authError;
  }

  if (!user) {
    redirect("/login?next=%2Faccount%2Fprofile");
  }

  if (!user.email) {
    return {
      error: "Your sign-in account needs an email address to create a profile.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("guests")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (profileError) {
    return { error: getSaveError(profileError.code) };
  }

  const result = profile
    ? await supabase
        .from("guests")
        .update(values)
        .eq("auth_user_id", user.id)
        .select("id")
        .maybeSingle()
    : await supabase
        .from("guests")
        .insert({
          ...values,
          auth_user_id: user.id,
          email: user.email,
        })
        .select("id")
        .single();

  if (result.error) {
    return { error: getSaveError(result.error.code) };
  }

  if (!result.data) {
    return {
      error: "Your profile could not be found. Refresh the page and try again.",
    };
  }

  revalidatePath("/account/profile");
  revalidatePath("/account");
  redirect("/account/profile");
}
