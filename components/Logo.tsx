import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-4">
      <Image
        src="/logo.png"
        width={60}
        height={60}
        alt="The Wild Oasis logo"
        loading="eager"
        className="h-9 w-9 sm:h-12 sm:w-12 lg:h-15 lg:w-15"
      />

      <span className="text-sm font-semibold text-primary-100 sm:text-base lg:text-xl">
        The Wild Oasis
      </span>
    </Link>
  );
}
