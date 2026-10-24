import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, UsersIcon } from "@heroicons/react/24/solid";

import type { Cabin } from "../types";

import CabinReservation from "@/features/reservations/components/CabinReservation";

export default function CabinDetail({ cabin }: { cabin: Cabin }) {
  const discountedPrice = Math.max(cabin.regularPrice - cabin.discount, 0);
  const formattedPrice = discountedPrice.toLocaleString("en-US");

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-5">
        <Link
          href="/cabins"
          className="ui-button ui-button--secondary group min-h-11 px-4 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-300"
        >
          <ArrowLeftIcon
            aria-hidden="true"
            className="size-4 transition-transform group-hover:-translate-x-0.5"
          />
          Back to cabins
        </Link>
      </div>

      <article className="overflow-hidden border border-primary-800 bg-primary-950">
        <div className="group relative aspect-[16/8] min-h-72 w-full overflow-hidden sm:min-h-[26rem]">
          <Image
            src={cabin.image}
            alt={`${cabin.name}, a private cabin at The Wild Oasis`}
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transition-none"
            sizes="(max-width: 1024px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/20 to-primary-950/5" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-8 lg:p-10">
            <div>
              <p className="ui-eyebrow mb-3 text-accent-200">
                The Wild Oasis · Private cabin
              </p>
              <h1 className="max-w-2xl text-3xl font-medium leading-tight text-primary-50 sm:text-4xl lg:text-5xl">
                Cabin {cabin.cabinNumber}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-primary-200 sm:text-base">
                {cabin.name}
              </p>
            </div>

            <div className="flex w-fit shrink-0 items-center gap-2 border border-primary-100/25 bg-primary-950/70 px-4 py-3 text-sm text-primary-100 backdrop-blur-sm">
              <UsersIcon aria-hidden="true" className="size-4 text-accent-300" />
              Up to {cabin.maxCapacity} guests
            </div>
          </div>
        </div>

        <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12 lg:p-10">
          <section className="min-w-0">
            <p className="ui-eyebrow mb-3">Your mountain hideaway</p>
            <h2 className="text-2xl font-medium text-primary-50 sm:text-3xl">
              A stay made for slowing down
            </h2>

            <p className="mt-5 max-w-3xl text-base leading-7 text-primary-300 sm:text-lg sm:leading-8">
              {cabin.description}
            </p>

            <div className="mt-8 grid grid-cols-2 border-y border-primary-800 sm:max-w-lg">
              <div className="py-5 pr-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-400">
                  Sleeps
                </p>
                <p className="mt-2 text-lg font-medium text-primary-100">
                  {cabin.maxCapacity} guests
                </p>
              </div>
              <div className="border-l border-primary-800 py-5 pl-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-400">
                  From
                </p>
                <p className="mt-2 text-lg font-medium text-primary-100">
                  ${formattedPrice}
                  <span className="ml-1 text-sm font-normal text-primary-400">
                    / night
                  </span>
                </p>
              </div>
            </div>
          </section>

          <CabinReservation cabin={cabin} />
        </div>
      </article>
    </div>
  );
}
