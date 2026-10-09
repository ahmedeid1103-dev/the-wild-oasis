import Image from "next/image";
import Link from "next/link";

import bg from "@/public/bg.png";

export default function Page() {
  return (
    <div className="fixed inset-0 z-0 isolate overflow-hidden bg-primary-950">
      <Image
        src={bg}
        fill
        priority
        placeholder="blur"
        quality={80}
        sizes="100vw"
        className="object-cover object-center"
        alt="Mountains and forests with two cabins"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-primary-950/65 via-primary-950/15 to-primary-950/55" />

      <div className="relative z-10 flex h-full -translate-y-[14vh] items-center justify-center px-4 text-center sm:px-6">
        <div className="w-full max-w-5xl">
          <h1 className="mx-auto mb-5 max-w-[12ch] text-4xl font-medium leading-[1.08] tracking-tight text-primary-50 drop-shadow-lg sm:mb-6 sm:max-w-none sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to paradise.
          </h1>

          <div className="flex justify-center">
            <Link
              href="/cabins"
              className="inline-flex min-h-12 items-center justify-center bg-accent-500 px-7 py-3 text-base font-semibold text-primary-800 transition-colors hover:bg-accent-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-300 sm:px-8 sm:py-4 sm:text-lg"
            >
              Explore luxury cabins
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
