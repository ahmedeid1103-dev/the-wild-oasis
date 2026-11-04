import "server-only";

import { cacheLife } from "next/cache";

import { createServerSupabaseClient } from "./server";

export async function getCurrentUser() {
  "use cache: private";
  // Token validation reads the current time. Keep it in a private scope so
  // partial prefetching never evaluates it as static, shared content.
  cacheLife("minutes");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;

  return {
    user: typeof userId === "string" ? { id: userId } : null,
    error,
  };
}
