import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, UsersIcon } from "@heroicons/react/24/solid";

import type { Cabin } from "../types";

type CabinCardProps = {
  cabin: Cabin;
};

export default function CabinCard({ cabin }: CabinCardProps) {
  const { id, cabinNumber, name, maxCapacity, regularPrice, discount, image } = cabin;
  const pricePerNight = Math.max(regularPrice - discount, 0);
  const formattedPrice = pricePerNight.toLocaleString("en-US");

  return (
    <article className="ui-card group flex h-full flex-col overflow-hidden shadow-none transition-colors duration-300 hover:border-accent-700">
      <Link
        href={`/cabins/${id}`}
        aria-label={`Explore Cabin ${cabinNumber}`}
        className="relative block aspect-[16/10] overflow-hidden bg-primary-900"
      >
        <Image
          src={image}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw"
          alt={`Inside ${name}`}
          className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/75 via-transparent to-primary-950/10" />
        <span className="ui-eyebrow absolute bottom-4 left-5 text-primary-50">
          The Wild Oasis
        </span>
        {discount > 0 && (
          <span className="absolute right-4 top-4 border border-accent-200/50 bg-primary-950/85 px-3 py-1.5 text-xs font-semibold tracking-wide text-accent-200 backdrop-blur-sm">
            Special rate
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary-400">
              Private hideaway
            </p>
            <h2 className="text-xl font-medium text-primary-50 sm:text-2xl">
              Cabin {cabinNumber}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-2 border border-primary-700 px-3 py-2 text-sm text-primary-200">
            <UsersIcon aria-hidden="true" className="size-4 text-accent-400" />
            <span>{maxCapacity} guests</span>
          </div>
        </div>

        <p className="mt-4 line-clamp-2 min-h-12 text-sm leading-6 text-primary-300">
          {cabin.description}
        </p>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-primary-800 pt-5">
          <p className="flex items-baseline gap-2">
            <span className="text-2xl font-medium text-primary-50">
              ${formattedPrice}
            </span>
            {discount > 0 && (
              <span className="text-sm text-primary-400 line-through">
                ${regularPrice.toLocaleString("en-US")}
              </span>
            )}
            <span className="text-xs text-primary-400">/ night</span>
          </p>

          <Link
            href={`/cabins/${id}`}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent-300 transition-colors hover:text-accent-200"
          >
            Explore cabin
            <ArrowRightIcon
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
