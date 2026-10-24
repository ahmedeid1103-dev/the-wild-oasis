import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";

import LoadingIndicator from "@/components/LoadingIndicator";
import AuthPageContent from "@/features/auth/components/AuthPageContent";
import bg from "@/public/bg.png";

export const metadata: Metadata = {
  title: "Sign in",
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string | string[] | undefined }>;
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <section className="mx-auto grid w-full max-w-5xl overflow-hidden border border-primary-800/80 bg-primary-900/50 shadow-2xl lg:grid-cols-[1fr_0.92fr]">
      <div className="relative isolate flex min-h-56 items-end overflow-hidden p-6 sm:min-h-72 sm:p-8 lg:min-h-[560px] lg:p-10">
        <Image
          src={bg}
          alt="A secluded cabin beside a mountain lake"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/55 to-primary-950/10" />
        <div className="relative z-10 max-w-md">
          <p className="ui-eyebrow mb-3 text-accent-200 sm:text-sm">
            Your mountain escape
          </p>
          <h2 className="mb-3 text-2xl font-medium leading-tight text-primary-50 sm:text-3xl">
            Come back to a slower kind of stay.
          </h2>
          <p className="text-sm leading-6 text-primary-200 sm:text-base sm:leading-7">
            Sign in to manage your reservations and plan your next time away.
          </p>
        </div>
      </div>

      <div className="flex min-w-0 items-center px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="mx-auto w-full max-w-md">
          <h1 className="ui-page-title mb-3">
            Sign in
          </h1>
          <p className="mb-7 text-base leading-7 text-primary-200 sm:mb-8 sm:text-lg">
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
        </div>
      </div>
    </section>
  );
}
