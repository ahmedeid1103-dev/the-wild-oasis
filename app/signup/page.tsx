import type { Metadata } from "next";
import { Suspense } from "react";

import LoadingIndicator from "@/components/LoadingIndicator";
import AuthPageContent from "@/features/auth/components/AuthPageContent";

export const metadata: Metadata = {
  title: "Create an account",
};

type SignupPageProps = {
  searchParams: Promise<{ next?: string | string[] | undefined }>;
};

export default function SignupPage({ searchParams }: SignupPageProps) {
  return (
    <section className="mx-auto max-w-2xl">
      <h1 className="mb-3 text-4xl font-medium text-accent-400">
        Create an account
      </h1>
      <p className="mb-8 text-lg text-primary-200">
        Create an account with your email address and a password.
      </p>
      <Suspense
        fallback={
          <LoadingIndicator
            label="Loading account form..."
            className="text-primary-300"
          />
        }
      >
        <AuthPageContent mode="signup" searchParams={searchParams} />
      </Suspense>
    </section>
  );
}
