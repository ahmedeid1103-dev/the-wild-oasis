import Image from "next/image";
import Link from "next/link";

import bg from "@/public/bg.webp";

export default function Page() {
  return (
    <div className="fixed inset-0 z-0 isolate bg-primary-950">
      <Image
        src={bg}
        fill
        preload
        placeholder="blur"
        quality={85}
        sizes="100vw"
        className="object-cover object-center"
        alt="Mountains and forests with two cabins"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-primary-950/65 via-primary-950/15 to-primary-950/55" />

      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 pb-8 pt-24 text-center sm:px-6 sm:pt-28">
        <div className="w-full max-w-4xl">
          <p className="ui-eyebrow mb-4 text-accent-200 sm:mb-5 sm:text-sm">
            Private cabins in the Italian Dolomites
          </p>
          <h1 className="mx-auto mb-5 max-w-[13ch] text-4xl font-medium leading-[1.08] tracking-tight text-primary-50 drop-shadow-lg sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to paradise.
          </h1>

          <p className="mx-auto mb-7 max-w-xl text-base leading-7 text-primary-100 drop-shadow sm:mb-8 sm:text-lg sm:leading-8">
            Find room to slow down, breathe deep, and make the mountains your
            own.
          </p>

          <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="/cabins"
              className="ui-button ui-button--primary min-h-12 px-7 py-3 text-base sm:px-8 sm:py-4 sm:text-lg"
            >
              Explore our cabins
            </Link>
            <Link
              href="/about"
              className="ui-button ui-button--secondary min-h-12 border-primary-100/50 bg-primary-950/20 px-7 py-3 text-base text-primary-50 hover:bg-primary-950/50 sm:px-8 sm:py-4"
            >
              Discover our story
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
