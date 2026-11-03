import "server-only";

import { cache } from "react";

import { createServerSupabaseClient } from "./server";

export const getCurrentUser = cache(async () => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;

  return {
    user: typeof userId === "string" ? { id: userId } : null,
    error,
  };
});
