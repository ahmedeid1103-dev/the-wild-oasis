"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import type { ActionState } from "@/lib/action-state";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getPostgresPool } from "@/lib/database";
import { guestProfileSchema } from "./schemas";

function getSaveError(code: string | undefined): string | null {
  if (code === "42501") {
    return "Profile saving is unavailable until the database permissions are configured.";
  }

  if (code === "23505") {
    return "A profile for your account already exists. Refresh the page and try again.";
  }

  return null;
}

function getDatabaseErrorCode(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }

  return undefined;
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
  const { user } = await getCurrentUser();

  if (!user) {
    redirect("/login?next=%2Faccount%2Fprofile");
  }

  if (!user.email) {
    return {
      error: "Your sign-in account needs an email address to create a profile.",
    };
  }

  try {
    const result = await getPostgresPool().query<{ id: string | number }>(
      `INSERT INTO public.guests (
         "fullName", email, nationality, "nationalID", "countryFlag",
         better_auth_user_id
       )
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (better_auth_user_id) DO UPDATE
       SET "fullName" = EXCLUDED."fullName",
           nationality = EXCLUDED.nationality,
           "nationalID" = EXCLUDED."nationalID",
           "countryFlag" = EXCLUDED."countryFlag"
       RETURNING id`,
      [
        values.fullName,
        user.email,
        values.nationality,
        values.nationalID,
        values.countryFlag,
        user.id,
      ],
    );

    const guest = result.rows[0];

    if (!guest) {
      throw new Error("Saving the guest profile did not return its record.");
    }
  } catch (error) {
    const message = getSaveError(getDatabaseErrorCode(error));

    if (message) {
      return { error: message };
    }

    throw error;
  }

  updateTag(`account-profile-${user.id}`);
  updateTag(`account-reservations-${user.id}`);
  revalidatePath("/account/profile");
  revalidatePath("/account");
  redirect("/account/profile");
}
