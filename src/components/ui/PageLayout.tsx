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
        className="pb-safe-bottom"
        style={{
          maxWidth: maxWidth === "max-w-lg" ? '32rem'
            : maxWidth === "max-w-4xl" ? '56rem'
            : maxWidth === "max-w-6xl" ? '72rem'
            : maxWidth === "max-w-7xl" ? '80rem'
            : maxWidth === "max-w-[800px]" ? '800px'
            : '72rem',
          margin: '0 auto',
          width: '100%',
          paddingLeft: '24px',
          paddingRight: '24px',
          ...(showNav
            ? { paddingTop: '96px', paddingBottom: '88px' }
            : { paddingTop: '24px', paddingBottom: '24px' }),
        }}
      >
        {children}
      </main>
    </div>
  );
}
