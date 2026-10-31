import "server-only";

import { Suspense } from "react";

import HeaderClient from "./HeaderClient";
import { getCurrentUser } from "@/lib/auth/current-user";

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
  const { user } = await getCurrentUser();
  return Boolean(user);
}
