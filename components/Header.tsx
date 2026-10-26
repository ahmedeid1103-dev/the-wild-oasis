import "server-only";

import { Suspense } from "react";

import HeaderClient from "./HeaderClient";
import { isUnauthenticatedAuthError } from "@/lib/auth-errors";
import { getCurrentUser } from "@/lib/supabase/current-user";

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
  const { user, error } = await getCurrentUser();

  if (error && isUnauthenticatedAuthError(error)) {
    return false;
  }

  if (error) {
    throw error;
  }

  return Boolean(user);
}
