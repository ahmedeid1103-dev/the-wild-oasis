import { Suspense, type ReactNode } from "react";

import SideNavigation from "@/components/SideNavigation";
import { getAccountGuest } from "@/features/profile/queries";

type AccountLayoutProps = {
  children: ReactNode;
};

export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <Suspense
      fallback={
        <p aria-busy="true" className="text-primary-300">
          Loading your account...
        </p>
      }
    >
      <AuthenticatedAccount>{children}</AuthenticatedAccount>
    </Suspense>
  );
}

async function AuthenticatedAccount({ children }: AccountLayoutProps) {
  await getAccountGuest();

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[16rem_1fr] md:gap-12">
      <SideNavigation />

      <div className="py-1">{children}</div>
    </div>
  );
}
