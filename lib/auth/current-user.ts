import "server-only";

import { getSessionCookie } from "better-auth/cookies";
import { cache } from "react";
import { headers } from "next/headers";

import { getAuth } from "@/lib/auth";

export const getCurrentUser = cache(async () => {
  const requestHeaders = await headers();

  if (!getSessionCookie(requestHeaders)) {
    return { user: null };
  }

  const session = await getAuth().api.getSession({
    headers: requestHeaders,
  });

  return { user: session?.user ?? null };
});
