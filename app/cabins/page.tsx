import type { Metadata } from "next";
import { Suspense } from "react";

import CabinBrowser from "@/features/cabins/components/CabinBrowser";
import { getCabins } from "@/features/cabins/queries";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "Cabins",
};

export default async function Page() {
  const cabins = await getCabins();
  const startingPrice = cabins.length
    ? Math.min(
        ...cabins.map((cabin) =>
          Math.max(cabin.regularPrice - cabin.discount, 0),
        ),
      )
    : null;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="relative mb-10 overflow-hidden border border-primary-800 bg-gradient-to-br from-primary-900 via-primary-950 to-primary-950 px-6 py-8 sm:mb-12 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-32 size-96 rounded-full border border-accent-500/10"
        />
        <div
          aria-hidden="true"
          className="absolute -right-12 -top-20 size-72 rounded-full border border-accent-500/10"
        />

        <div className="relative grid items-end gap-8 lg:grid-cols-[1fr_auto] lg:gap-12">
          <div className="max-w-2xl">
            <p className="ui-eyebrow mb-4">Stay close to what matters</p>
            <h1 className="ui-page-title max-w-xl text-primary-50">
              Find your own <span className="text-accent-300">wild escape.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-primary-300 sm:text-lg sm:leading-8">
              A collection of private cabins tucked into the Italian Dolomites.
              Wake to mountain air, spend the day outdoors, and settle in
              somewhere wonderfully your own.
            </p>
          </div>

          <div className="flex gap-8 border-t border-primary-700 pt-5 lg:min-w-52 lg:flex-col lg:gap-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div>
              <p className="text-2xl font-medium text-primary-50">
                01—{String(cabins.length).padStart(2, "0")}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-primary-400">
                Private cabins
              </p>
            </div>
            {startingPrice !== null && (
              <div>
                <p className="text-2xl font-medium text-primary-50">
                  ${startingPrice.toLocaleString("en-US")}
                  <span className="ml-1 text-sm font-normal text-primary-400">
                    / night
                  </span>
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-primary-400">
                  Stays from
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      <Suspense fallback={<Loading />}>
        <CabinBrowser cabins={cabins} />
      </Suspense>
    </div>
  );
}
