import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import about1 from "@/public/about-1.webp";
import about2 from "@/public/about-2.webp";

export const metadata: Metadata = {
  title: "About",
};

export default function Page() {
  return (
    <div className="mx-auto grid max-w-6xl gap-16 sm:gap-24">
      <section className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <div className="py-2">
          <p className="ui-eyebrow mb-4">A family place in the mountains</p>
          <h1 className="ui-page-title max-w-lg text-4xl text-primary-50 sm:text-5xl lg:text-6xl">
            A slower stay, a lifetime in the making.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-primary-300 sm:text-lg sm:leading-8">
            In the heart of the Italian Dolomites, we made a place to step away
            from the rush and find your way back to the simple things: fresh
            mountain air, long evenings, and time together.
          </p>
          <Link
            href="/cabins"
            className="ui-button ui-button--primary mt-8"
          >
            Find your cabin
          </Link>
          <div className="mt-10 flex gap-8 border-t border-primary-800 pt-5">
            <div>
              <p className="text-2xl font-medium text-accent-300">1962</p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-primary-400">
                Family-run since
              </p>
            </div>
            <div className="border-l border-primary-800 pl-8">
              <p className="text-2xl font-medium text-accent-300">8</p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-primary-400">
                Private cabins
              </p>
            </div>
          </div>
        </div>

        <figure className="relative min-h-80 overflow-hidden border border-primary-800 sm:min-h-[30rem]">
          <Image
            src={about1}
            fill
            priority
            placeholder="blur"
            sizes="(max-width: 1024px) 100vw, 55vw"
            alt="Family gathered around a fire pit in front of a cabin"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-primary-950/70 via-transparent to-transparent"
          />
          <figcaption className="absolute bottom-5 left-5 border-l-2 border-accent-400 pl-4 text-sm text-primary-50">
            Your own place in the Dolomites
          </figcaption>
        </figure>
      </section>

      <section className="grid overflow-hidden border border-primary-800 bg-primary-900/50 lg:grid-cols-[1fr_1fr]">
        <div className="relative min-h-72 sm:min-h-96 lg:min-h-[34rem]">
          <Image
            src={about2}
            fill
            placeholder="blur"
            sizes="(max-width: 1024px) 100vw, 50vw"
            alt="The family behind The Wild Oasis"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
          <p className="ui-eyebrow mb-4">Our story</p>
          <h2 className="ui-page-title max-w-lg text-3xl text-primary-50 sm:text-4xl">
            Rooted in family. Made for getting away.
          </h2>
          <div className="mt-6 space-y-5 text-base leading-7 text-primary-300">
            <p>
              The Wild Oasis began with our grandparents and a simple idea: a
              stay should feel less like checking in and more like coming home.
              Since 1962, our family has cared for this little corner of the
              mountains and the people who find their way here.
            </p>
            <p>
              Today, our eight cabins offer a comfortable base for the best
              parts of being outdoors. Wander the forests, share stories around
              the fire, and let the mountain evenings take their time.
            </p>
          </div>
          <Link
            href="/cabins"
            className="ui-link mt-7 inline-flex w-fit items-center gap-2 font-semibold"
          >
            Explore the cabins
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
