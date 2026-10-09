import Image from "next/image";
import Link from "next/link";
import { UsersIcon } from "@heroicons/react/24/solid";

import type { Cabin } from "../types/cabin";

type CabinCardProps = {
  cabin: Cabin;
};

export default function CabinCard({ cabin }: CabinCardProps) {
  const { id, cabinNumber, name, maxCapacity, regularPrice, discount, image } =
    cabin;

  return (
    <div className="flex border border-primary-800">
      <div className="relative flex-1">
        <Image
          src={image}
          fill
          sizes="(max-width: 270px) 1px, (max-width: 639px) calc(50vw - 134px), (max-width: 767px) calc(50vw - 142px), (max-width: 1023px) calc(25vw - 138px), (max-width: 1279px) calc(25vw - 146px), (max-width: 1353px) calc(25vw - 148px), 188px"
          alt={`Cabin ${name}`}
          className="object-cover border-r border-primary-800"
        />
      </div>

      <div className="grow">
        <div className="bg-primary-950 px-7 pt-5 pb-4">
          <h3 className="text-accent-500 font-semibold text-2xl mb-3">
            Cabin {cabinNumber}
          </h3>

          <div className="flex items-center gap-3 mb-2">
            <UsersIcon className="h-5 w-5 text-primary-600" />

            <p className="text-lg text-primary-200">
              For up to <span className="font-bold">{maxCapacity}</span> guests
            </p>
          </div>

          <p className="flex items-baseline justify-end gap-3">
            {discount > 0 ? (
              <>
                <span className="text-3xl font-[350]">
                  ${regularPrice - discount}
                </span>

                <span className="line-through font-semibold text-primary-400">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-3xl font-[350]">${regularPrice}</span>
            )}

            <span className="text-primary-200">/ night</span>
          </p>
        </div>

        <div className="bg-primary-950 border-t border-primary-800 text-right">
          <Link
            href={`/cabins/${id}`}
            className="inline-block border-l border-primary-800 px-6 py-4 transition-all hover:bg-accent-600 hover:text-primary-900"
          >
            Details & reservation &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
