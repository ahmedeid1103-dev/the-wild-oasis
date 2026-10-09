import type { Metadata } from "next";
import { Suspense } from "react";

import CabinBrowser from "../components/CabinBrowser";
import { getCabins } from "../lib/data-service";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "Cabins",
};

export default async function Page() {
  const cabins = await getCabins();

  return (
    <div>
      <h1 className="mb-5 text-4xl font-medium text-accent-400">
        Our Luxury Cabins
      </h1>

      <p className="mb-10 max-w-4xl text-lg text-primary-200">
        Cozy yet luxurious cabins, located right in the heart of the Italian
        Dolomites. Imagine waking up to beautiful mountain views, spending your
        days exploring the dark forests around, or just relaxing in your private
        hot tub under the stars. Enjoy nature&apos;s beauty in your own little
        home away from home. The perfect spot for a peaceful, calm vacation.
        Welcome to paradise.
      </p>

      <Suspense fallback={<Loading />}>
        <CabinBrowser cabins={cabins} />
      </Suspense>
    </div>
  );
}
