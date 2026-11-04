import type { ReactNode } from "react";

import SideNavigation from "@/components/SideNavigation";

type AccountLayoutProps = {
  children: ReactNode;
};

export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
      <SideNavigation />

      <div className="min-w-0 break-words py-1">{children}</div>
    </div>
  );
}
