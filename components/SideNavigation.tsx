"use client";

import Link from "next/link";
import {
  CalendarDaysIcon,
  HomeIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";

import SignOutButton from "@/features/auth/components/SignOutButton";

const navLinks = [
  {
    name: "Home",
    href: "/account",
    icon: HomeIcon,
  },
  {
    name: "Reservations",
    href: "/account/reservations",
    icon: CalendarDaysIcon,
  },
  {
    name: "Guest profile",
    href: "/account/profile",
    icon: UserIcon,
  },
];

export default function SideNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col">
      <ul className="flex flex-col gap-2 text-lg">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href ||
            (link.href !== "/account" &&
              pathname.startsWith(`${link.href}/`));

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-4 px-5 py-3 font-semibold transition-colors ${
                  isActive
                    ? "bg-primary-900 text-primary-100"
                    : "text-primary-200 hover:bg-primary-900 hover:text-primary-100"
                }`}
              >
                <Icon className="h-5 w-5 text-primary-600" />
                <span>{link.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 border-t border-primary-900 pt-2">
        <SignOutButton />
      </div>
    </nav>
  );
}
