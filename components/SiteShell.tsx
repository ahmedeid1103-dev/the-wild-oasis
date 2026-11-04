"use client";

import { Suspense, type ReactNode } from "react";
import { usePathname } from "next/navigation";

type SiteShellProps = { header: ReactNode; children: ReactNode };

export default function SiteShell(props: SiteShellProps) {
  return (
    <Suspense fallback={<ShellFrame {...props} isHome={false} />}>
      <PathAwareShell {...props} />
    </Suspense>
  );
}

function PathAwareShell(props: SiteShellProps) {
  // Next.js retains inactive pages in the DOM. Layout must follow the URL,
  // not the presence of homepage markup (including hidden cached markup).
  const pathname = usePathname();
  return <ShellFrame {...props} isHome={pathname === "/"} />;
}

function ShellFrame({ header, children, isHome }: SiteShellProps & { isHome: boolean }) {
  return (
    <div className={`flex min-h-screen flex-col ${isHome ? "site-shell--home" : ""}`}>
      {header}
      <main id="main-content" tabIndex={-1} className={isHome ? "flex-1" : "flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12"}>
        <div className={isHome ? "w-full" : "mx-auto w-full max-w-7xl"}>{children}</div>
      </main>
    </div>
  );
}
