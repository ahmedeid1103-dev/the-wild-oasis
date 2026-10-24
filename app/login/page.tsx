import type { Metadata } from "next";
import { Suspense } from "react";

import LoadingIndicator from "@/components/LoadingIndicator";
import AuthPageContent from "@/features/auth/components/AuthPageContent";

export const metadata: Metadata = {
  title: "Sign in",
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string | string[] | undefined }>;
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <section className="mx-auto max-w-2xl">
      <h1 className="mb-3 text-4xl font-medium text-accent-400">Sign in</h1>
      <p className="mb-8 text-lg text-primary-200">
        Sign in with your email address and password.
      </p>
      <Suspense
        fallback={
          <LoadingIndicator
            label="Loading sign-in form..."
            className="text-primary-300"
          />
        }
      >
        <AuthPageContent mode="login" searchParams={searchParams} />
      </Suspense>
    </section>
  );
}
