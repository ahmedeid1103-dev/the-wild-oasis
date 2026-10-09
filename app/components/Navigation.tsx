"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/cabins",
    label: "Cabins",
  },
  {
    href: "/about",
    label: "About",
  },
  {
    href: "/account",
    label: "Guest area",
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (mobileMenuRef.current) {
      mobileMenuRef.current.open = false;
    }
  }, [pathname]);

  return (
    <nav>
      {/* Desktop navigation */}
      <ul className="hidden items-center gap-6 text-base lg:flex lg:gap-8 lg:text-lg">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`transition-colors ${
                  isActive
                    ? "text-accent-400"
                    : "text-primary-100 hover:text-accent-400"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Mobile navigation */}
      <details ref={mobileMenuRef} className="relative lg:hidden">
        <summary className="list-none cursor-pointer border border-primary-800 px-4 py-2 text-sm font-semibold transition-colors hover:bg-primary-900 [&::-webkit-details-marker]:hidden">
          Menu
        </summary>

        <div className="absolute right-0 top-full mt-2 w-48 border border-primary-800 bg-primary-950 shadow-lg">
          <ul className="flex flex-col py-2">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`block px-4 py-3 text-sm transition-colors ${
                      isActive
                        ? "bg-primary-900 text-accent-400"
                        : "hover:bg-primary-900 hover:text-accent-400"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </details>
    </nav>
  );
}
