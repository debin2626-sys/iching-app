"use client";

import { m, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } }}
        exit={{ opacity: 0, y: 0, transition: { duration: 0.2 } }}
        style={{ willChange: "opacity, transform" }}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}
