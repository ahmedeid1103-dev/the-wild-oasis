import { Suspense } from "react";
import { unstable_noStore } from "next/cache";

import HeaderClient from "./HeaderClient";
import { isUnauthenticatedAuthError } from "@/lib/auth-errors";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default function Header() {
  return (
    <Suspense fallback={<HeaderClient isSignedIn={false} />}>
      <AuthenticatedHeader />
    </Suspense>
  );
}

async function AuthenticatedHeader() {
  const isSignedIn = await getSignedInState();
  return <HeaderClient isSignedIn={isSignedIn} />;
}

async function getSignedInState() {
  unstable_noStore();

  const supabase = await createServerSupabaseClient();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error && isUnauthenticatedAuthError(error)) {
      return false;
    }

    return !error && Boolean(user);
  } catch {
    return false;
  }
}
