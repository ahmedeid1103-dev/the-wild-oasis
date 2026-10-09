import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-lg text-center">
        <h1 className="mb-4 text-3xl font-medium text-accent-400">
          Cabin not found
        </h1>

        <p className="mb-8 text-lg leading-8 text-primary-200">
          We couldn&apos;t find the cabin you&apos;re looking for. It may have
          been removed or is no longer available.
        </p>

        <Link
          href="/cabins"
          className="inline-flex items-center gap-2 bg-accent-500 px-6 py-3 font-semibold text-primary-900 transition-colors hover:bg-accent-600"
        >
          <span aria-hidden="true">←</span>
          Back to cabins
        </Link>
      </div>
    </div>
  );
}
