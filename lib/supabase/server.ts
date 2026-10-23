import "server-only";

import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseConfig } from "./config";

async function getNextCookieMethods(): Promise<CookieMethodsServer> {
  const cookieStore = await cookies();

  return {
    getAll() {
      return cookieStore.getAll();
    },
    setAll(cookiesToSet) {
      try {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options);
        }
      } catch {
        // proxy.ts refreshes sessions, so Server Component cookie writes are safe to ignore.
      }
    },
  };
}

export async function createServerSupabaseClient(
  cookieMethods?: CookieMethodsServer,
) {
  const { supabaseUrl, supabasePublishableKey } = getSupabaseConfig();

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: cookieMethods ?? (await getNextCookieMethods()),
  });
}
