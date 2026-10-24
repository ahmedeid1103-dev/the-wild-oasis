import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Email confirmation failed",
};

export default function EmailConfirmationErrorPage() {
  return (
    <section className="mx-auto max-w-2xl">
      <h1 className="ui-page-title mb-3">
        We couldn&apos;t confirm your email
      </h1>
      <p className="mb-8 text-lg text-primary-200">
        The confirmation link may have expired or already been used. Open the
        link in the same browser you used to sign up, then try again.
      </p>
      <div className="flex flex-wrap gap-5">
        <Link
          href="/login"
          className="ui-button ui-button--primary"
        >
          Go to sign in
        </Link>
        <Link
          href="/signup"
          className="ui-button ui-button--secondary"
        >
          Create an account
        </Link>
      </div>
    </section>
  );
}
