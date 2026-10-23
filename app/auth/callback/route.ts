import { NextResponse, type NextRequest } from "next/server";

import { safeLocalRedirect } from "@/features/auth/safe-local-redirect";
import { getTrustedSiteOrigin } from "@/lib/site-origin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const siteOrigin = getTrustedSiteOrigin(request.nextUrl.origin);

  if (!siteOrigin) {
    return NextResponse.json(
      { error: "Unable to determine a trusted redirect origin." },
      { status: 400 },
    );
  }

  if (searchParams.has("error") || searchParams.has("error_description")) {
    return NextResponse.redirect(new URL("/auth/error", siteOrigin));
  }

  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/auth/error", siteOrigin));
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/auth/error", siteOrigin));
  }

  const next = safeLocalRedirect(searchParams.get("next"));
  return NextResponse.redirect(new URL(next, siteOrigin));
}
