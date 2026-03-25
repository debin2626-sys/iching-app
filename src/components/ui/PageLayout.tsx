"use client";

import { type ReactNode } from "react";
import { NavBar, type NavItem } from "./NavBar";

interface PageLayoutProps {
  children: ReactNode;
  /** Navigation items passed to NavBar */
  navItems?: NavItem[];
  /** Hide the navigation bar entirely (default: true) */
  showNav?: boolean;
  /** Max width of the content area (Tailwind class, e.g. "max-w-5xl") */
  maxWidth?: string;
}

export function PageLayout({
  children,
  navItems = [],
  showNav = true,
  maxWidth = "max-w-6xl",
}: PageLayoutProps) {
  return (
    <div className="relative min-h-screen">
      {showNav && <NavBar items={navItems} />}

      <main
        className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${maxWidth} ${
          showNav
            ? /* mobile: pb-24 for bottom tab bar; desktop: pt-20 for top nav */
              "pt-20 pb-24 md:pb-6"
            : "py-6"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
