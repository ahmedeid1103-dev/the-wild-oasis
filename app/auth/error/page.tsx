import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Email confirmation failed",
};

export default function EmailConfirmationErrorPage() {
  return (
    <section className="mx-auto max-w-2xl">
      <h1 className="mb-3 text-4xl font-medium text-accent-400">
        We couldn&apos;t confirm your email
      </h1>
      <p className="mb-8 text-lg text-primary-200">
        The confirmation link may have expired or already been used. Open the
        link in the same browser you used to sign up, then try again.
      </p>
      <div className="flex flex-wrap gap-5">
        <Link
          href="/login"
          className="inline-flex bg-accent-500 px-6 py-3 font-semibold text-primary-900 transition-colors hover:bg-accent-600"
        >
          Go to sign in
        </Link>
        <Link
          href="/signup"
          className="inline-flex border border-primary-700 px-6 py-3 font-semibold text-primary-100 transition-colors hover:border-primary-500"
        >
          Create an account
        </Link>
      </div>
    </section>
  );
}
