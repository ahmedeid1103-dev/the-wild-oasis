import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { redirect } from "next/navigation";

import { isUnauthenticatedAuthError } from "@/lib/auth-errors";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getAccountGuest() {
  "use cache: private";
  cacheLife("minutes");

  const { user, error: authError } = await getCurrentUser();

  if (authError && isUnauthenticatedAuthError(authError)) {
    redirect("/login?next=%2Faccount");
  }

  if (authError) {
    throw authError;
  }

  if (!user) {
    redirect("/login?next=%2Faccount");
  }

  cacheTag(`account-profile-${user.id}`);

  const supabase = await createServerSupabaseClient();
  const { data: guest, error } = await supabase
    .from("guests")
    .select("id, fullName, email, nationality, nationalID, countryFlag")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return { guest };
}
