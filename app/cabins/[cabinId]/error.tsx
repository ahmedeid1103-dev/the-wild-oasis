"use client";

export default function Error({ retry }: { retry: () => void }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-lg text-center">
        <h2 className="ui-page-title mb-4">
          Couldn&apos;t load this cabin
        </h2>

        <p className="mb-8 text-lg leading-8 text-primary-200">
          Something went wrong while loading this cabin. Please try again.
        </p>

        <button
          type="button"
          onClick={retry}
          className="ui-button ui-button--primary"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
