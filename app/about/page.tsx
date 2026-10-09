import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import about1 from "@/public/about-1.jpg";
import about2 from "@/public/about-2.jpg";

export const metadata: Metadata = {
  title: "About",
};

export default function Page() {
  return (
    <div className="grid gap-24 md:gap-32">
      <section className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
        <div>
          <h1 className="mb-6 text-4xl font-medium text-accent-400">
            Welcome to The Wild Oasis
          </h1>

          <div className="space-y-6 text-lg leading-8 text-primary-200">
            <p>
              Where nature&apos;s beauty and comfortable living blend
              seamlessly. Hidden away in the heart of the Italian Dolomites,
              this is your paradise away from home. But it&apos;s not just about
              the luxury cabins. It&apos;s about the experience of reconnecting
              with nature and enjoying simple pleasures with family.
            </p>

            <p>
              Our 8 luxury cabins provide a cozy base, but the real freedom and
              peace you&apos;ll find in the surrounding mountains. Wander
              through lush forests, breathe in the fresh air, and watch the
              stars twinkle above from the warmth of a campfire or your hot tub.
            </p>

            <p>
              This is where memorable moments are made, surrounded by
              nature&apos;s splendor. It&apos;s a place to slow down, relax, and
              feel the joy of being together in a beautiful setting.
            </p>
          </div>
        </div>

        <div className="relative h-112">
          <Image
            src={about1}
            fill
            priority
            placeholder="blur"
            sizes="(max-width: 768px) 100vw, 50vw"
            alt="Family sitting around a fire pit in front of a cabin"
            className="object-cover"
          />
        </div>
      </section>

      <section className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
        <div className="relative order-2 h-112 md:order-1">
          <Image
            src={about2}
            fill
            placeholder="blur"
            sizes="(max-width: 768px) 100vw, 50vw"
            alt="Family that manages The Wild Oasis"
            className="object-cover"
          />
        </div>

        <div className="order-1 md:order-2">
          <h2 className="mb-6 text-4xl font-medium text-accent-400">
            Managed by our family since 1962
          </h2>

          <div className="space-y-6 text-lg leading-8 text-primary-200">
            <p>
              Since 1962, The Wild Oasis has been a cherished family-run
              retreat. Started by our grandparents, this haven has been nurtured
              with love and care, passing down through our family as a testament
              to our dedication to creating a warm, welcoming environment.
            </p>

            <p>
              Over the years, we&apos;ve maintained the essence of The Wild
              Oasis, blending the timeless beauty of the mountains with the
              personal touch only a family business can offer. Here, you&apos;re
              not just a guest; you&apos;re part of our extended family. So join
              us at The Wild Oasis soon, where tradition meets tranquility, and
              every visit is like coming home.
            </p>

            <Link
              href="/cabins"
              className="inline-block bg-accent-500 px-8 py-5 text-lg font-semibold text-primary-800 transition-all hover:bg-accent-600"
            >
              Explore our luxury cabins
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
