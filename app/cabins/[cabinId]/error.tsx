"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-lg text-center">
        <h2 className="mb-4 text-3xl font-medium text-accent-400">
          Couldn&apos;t load this cabin
        </h2>

        <p className="mb-8 text-lg leading-8 text-primary-200">
          Something went wrong while loading this cabin. Please try again.
        </p>

        <button
          type="button"
          onClick={reset}
          className="bg-accent-500 px-6 py-3 font-semibold text-primary-900 transition-colors hover:bg-accent-600"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
