import { type CookieMethodsServer, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { isUnauthenticatedAuthError } from "./lib/auth-errors";
import { createServerSupabaseClient } from "./lib/supabase/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const refreshedCookies = new Map<
    string,
    { name: string; value: string; options: CookieOptions }
  >();
  const supabaseHeaders = new Map<string, string>();
  const cookieMethods: CookieMethodsServer = {
    getAll() {
      return request.cookies.getAll();
    },
    setAll(cookiesToSet, headers) {
      for (const cookie of cookiesToSet) {
        request.cookies.set(cookie.name, cookie.value);
        refreshedCookies.set(cookie.name, cookie);
      }

      response = NextResponse.next({ request });

      for (const { name, value, options } of refreshedCookies.values()) {
        response.cookies.set(name, value, options);
      }

      for (const [name, value] of Object.entries(headers)) {
        supabaseHeaders.set(name, value);
      }

      for (const [name, value] of supabaseHeaders) {
        response.headers.set(name, value);
      }
    },
  };

  const supabase = await createServerSupabaseClient(cookieMethods);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAccountPath =
    pathname === "/account" || pathname.startsWith("/account/");
  const isUnauthenticated = error
    ? isUnauthenticatedAuthError(error)
    : !user;

  if (isAccountPath && !user && isUnauthenticated) {
    const next = `${pathname}${request.nextUrl.search}`;
    const redirectResponse = NextResponse.redirect(
      new URL(`/login?next=${encodeURIComponent(next)}`, request.url),
      307,
    );

    for (const { name, value, options } of refreshedCookies.values()) {
      redirectResponse.cookies.set(name, value, options);
    }

    for (const [name, value] of supabaseHeaders) {
      redirectResponse.headers.set(name, value);
    }

    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff2?)$).*)",
  ],
};
