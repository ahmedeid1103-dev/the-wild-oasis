import Image from "next/image";
import Link from "next/link";

import type { Cabin } from "../types";

import CabinReservation from "@/features/reservations/components/CabinReservation";

export default function CabinDetail({ cabin }: { cabin: Cabin }) {
  const discountedPrice = Math.max(cabin.regularPrice - cabin.discount, 0);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-4xl font-medium text-accent-400">
          Cabin #{cabin.cabinNumber}
        </h1>

        <Link
          href="/cabins"
          className="inline-flex items-center gap-2 border border-primary-800 bg-primary-900 px-4 py-2 text-sm font-medium text-primary-100 transition-colors hover:border-accent-500 hover:bg-accent-500 hover:text-primary-900"
        >
          <span aria-hidden="true">←</span>
          Back to cabins
        </Link>
      </div>

      <section className="overflow-hidden border border-primary-800 bg-primary-950">
        <div className="relative aspect-16/7 w-full">
          <Image
            src={cabin.image}
            alt={`Cabin ${cabin.name}`}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1200px"
          />
        </div>

        <div className="grid gap-8 p-6 lg:grid-cols-[1fr_320px] lg:p-8">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-primary-800 px-2.5 py-1 text-xs font-medium text-primary-100">
                Cabin
              </span>

              <span className="bg-primary-800 px-2.5 py-1 text-xs font-medium text-primary-100">
                Up to {cabin.maxCapacity} guests
              </span>

              {cabin.discount > 0 && (
                <span className="bg-green-950 px-2.5 py-1 text-xs font-medium text-green-300">
                  ${cabin.discount} discount
                </span>
              )}
            </div>

            <h2 className="mt-5 text-xl font-semibold text-primary-100">
              {cabin.name}
            </h2>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-primary-200">
              {cabin.description}
            </p>

            <div className="mt-8 grid gap-4 border-t border-primary-800 pt-6 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-primary-400">
                  Capacity
                </p>
                <p className="mt-1 text-sm font-medium text-primary-100">
                  {cabin.maxCapacity} guests
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-primary-400">
                  Regular price
                </p>
                <p className="mt-1 text-sm font-medium text-primary-100">
                  ${cabin.regularPrice}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-primary-400">
                  Final price
                </p>
                <p className="mt-1 text-sm font-semibold text-accent-400">
                  ${discountedPrice}
                </p>
              </div>
            </div>
          </div>

          <CabinReservation cabin={cabin} />
        </div>
      </section>
    </div>
  );
}
