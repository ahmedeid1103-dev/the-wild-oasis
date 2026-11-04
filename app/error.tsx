"use client";

import Link from "next/link";

export default function Error({ retry }: { retry: () => void }) {
  return (
    <section className="ui-card mx-auto max-w-xl p-6 text-center sm:p-10">
      <p className="ui-eyebrow mb-3">A little interruption</p>
      <h1 className="ui-page-title mb-4">We couldn&apos;t load this page</h1>
      <p className="mb-8 leading-7 text-content-muted">
        Please try again in a moment. If the problem continues, you can return
        to the homepage.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={retry} className="ui-button ui-button--primary">
          Try again
        </button>
        <Link href="/" className="ui-button ui-button--secondary">Back to home</Link>
      </div>
    </section>
  );
}
