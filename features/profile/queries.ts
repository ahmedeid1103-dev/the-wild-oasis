import "server-only";

import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";

import { isUnauthenticatedAuthError } from "@/lib/auth-errors";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getAccountGuest() {
  unstable_noStore();

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError && isUnauthenticatedAuthError(authError)) {
    redirect("/login?next=%2Faccount");
  }

  if (authError) {
    throw authError;
  }

  if (!user) {
    redirect("/login?next=%2Faccount");
  }

  const { data: guest, error } = await supabase
    .from("guests")
    .select("id, fullName, email, nationality, nationalID, countryFlag")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return { guest, supabase };
}
