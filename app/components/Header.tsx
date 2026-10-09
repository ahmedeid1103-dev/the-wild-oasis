"use client";

import { usePathname } from "next/navigation";

import Logo from "./Logo";
import Navigation from "./Navigation";

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <header
      className={
        isHomePage
          ? "absolute inset-x-0 top-0 z-50 px-3 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5"
          : "relative z-20 px-3 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5"
      }
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 sm:gap-6">
        <Logo />
        <Navigation />
      </div>
    </header>
  );
}
