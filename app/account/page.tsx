import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { getAccountGuest } from "@/features/profile/queries";

export const metadata: Metadata = {
  title: "Guest area",
};

export default function Page() {
  return (
    <Suspense fallback={<p aria-busy="true">Loading your guest area...</p>}>
      <AccountPageContent />
    </Suspense>
  );
}

async function AccountPageContent() {
  const { guest } = await getAccountGuest();

  if (!guest) {
    return (
      <div>
        <h1 className="mb-5 text-4xl font-medium text-accent-400">
          Guest area
        </h1>

        <p className="mb-6 text-lg text-primary-200">
          You do not have a guest profile yet. Existing guest records are not
          linked automatically.
        </p>
        <Link
          href="/account/profile"
          className="text-accent-500 underline underline-offset-4 transition-colors hover:text-accent-400"
        >
          Create your profile
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-5 text-4xl font-medium text-accent-400">
        Welcome, {guest.fullName}
      </h1>

      <p className="mb-8 text-lg text-primary-200">
        Your guest account is linked and ready to use.
      </p>

      <div className="flex flex-wrap gap-5">
        <Link
          href="/account/profile"
          className="text-accent-500 underline underline-offset-4 transition-colors hover:text-accent-400"
        >
          View your profile
        </Link>
        <Link
          href="/account/reservations"
          className="text-accent-500 underline underline-offset-4 transition-colors hover:text-accent-400"
        >
          View your reservations
        </Link>
      </div>
    </div>
  );
}
