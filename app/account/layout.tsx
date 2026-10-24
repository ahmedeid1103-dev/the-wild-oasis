import type { ReactNode } from "react";

import SideNavigation from "@/components/SideNavigation";

type AccountLayoutProps = {
  children: ReactNode;
};

export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[16rem_1fr] md:gap-12">
      <SideNavigation />

      <div className="py-1">{children}</div>
    </div>
  );
}
