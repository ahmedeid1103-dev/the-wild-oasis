"use client";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const baseNavItems = [
  {
    href: "/cabins",
    label: "Cabins",
  },
  {
    href: "/about",
    label: "About",
  },
];

type NavigationProps = {
  isSignedIn: boolean;
  pathname: string;
};

export default function Navigation({ isSignedIn, pathname }: NavigationProps) {
  const navItems = [
    ...baseNavItems,
    {
      href: isSignedIn ? "/account" : "/login",
      label: isSignedIn ? "Guest area" : "Sign in",
    },
  ];
  const [menuState, setMenuState] = useState({ pathname, open: false });
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelId = "mobile-navigation-panel";
  if (menuState.pathname !== pathname) {
    setMenuState({ pathname, open: false });
  }
  const isOpen = menuState.pathname === pathname && menuState.open;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        menuRef.current?.contains(event.target)
      ) {
        return;
      }

      setMenuState({ pathname, open: false });
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuState({ pathname, open: false });
        toggleRef.current?.focus();
      }
    }

    function handleViewportResize() {
      if (window.matchMedia("(min-width: 64rem)").matches) {
        setMenuState({ pathname, open: false });
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleViewportResize);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleViewportResize);
    };
  }, [isOpen, pathname]);

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
      <div ref={menuRef} className="relative z-50 lg:hidden">
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMenuState({ pathname, open: !isOpen })}
          className="ui-button ui-button--outline min-h-11 px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-300"
        >
          {isOpen ? (
            <XMarkIcon aria-hidden="true" className="size-5" />
          ) : (
            <Bars3Icon aria-hidden="true" className="size-5" />
          )}
        </button>

        <div
          id={panelId}
          aria-hidden={!isOpen}
          inert={!isOpen}
          className={`ui-card ui-card--raised absolute right-0 top-full z-50 mt-2 w-48 origin-top-right shadow-lg transition-all duration-150 motion-reduce:transition-none ${
            isOpen
              ? "visible translate-y-0 scale-100 opacity-100"
              : "invisible -translate-y-1 scale-95 opacity-0"
          }`}
        >
          <ul className="flex flex-col py-2">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setMenuState({ pathname, open: false })}
                    className={`block min-h-11 px-4 py-3 text-sm transition-colors ${
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
      </div>
    </nav>
  );
}
