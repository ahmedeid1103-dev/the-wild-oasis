import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/current-user";
import { getPostgresPool } from "@/lib/database";

export async function getAccountGuest() {
  "use cache: private";
  cacheLife("minutes");

  const { user } = await getCurrentUser();

  if (!user) {
    redirect("/login?next=%2Faccount");
  }

  cacheTag(`account-profile-${user.id}`);

  const { rows } = await getPostgresPool().query(
    `SELECT id, "fullName", email, nationality, "nationalID", "countryFlag",
            better_auth_user_id
     FROM public.guests
     WHERE better_auth_user_id = $1
     LIMIT 1`,
    [user.id],
  );

  return { guest: rows[0] ?? null };
}
