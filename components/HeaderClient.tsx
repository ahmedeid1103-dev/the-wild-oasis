"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";

import Logo from "./Logo";
import Navigation from "./Navigation";

type HeaderClientProps = {
  isSignedIn: boolean;
};

export default function HeaderClient({ isSignedIn }: HeaderClientProps) {
  return (
    <Suspense
      fallback={
        <HeaderContents
          isSignedIn={isSignedIn}
          isHomePage={false}
          pathname=""
        />
      }
    >
      <PathAwareHeader isSignedIn={isSignedIn} />
    </Suspense>
  );
}

function PathAwareHeader({ isSignedIn }: HeaderClientProps) {
  const pathname = usePathname();
  return (
    <HeaderContents
      isSignedIn={isSignedIn}
      isHomePage={pathname === "/"}
      pathname={pathname}
    />
  );
}

function HeaderContents({
  isSignedIn,
  isHomePage,
  pathname,
}: HeaderClientProps & { isHomePage: boolean; pathname: string }) {
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
        <Navigation isSignedIn={isSignedIn} pathname={pathname} />
      </div>
    </header>
  );
}
