"use client";

import { m, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

const spring = { type: "spring" as const, stiffness: 80, damping: 18 };

/* ── Taichi: fade-in + scale + slow rotate ── */
export function AnimatedTaichi({ children }: { children: ReactNode }) {
  return (
    <m.div
      initial={{ opacity: 1, scale: 0.95, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ ...spring, duration: 1.2 }}
    >
      {children}
    </m.div>
  );
}

/* ── Title: slide up + fade ── */
export function AnimatedTitle({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <m.h1
      className={className}
      style={style}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: 0.15, duration: 1 }}
    >
      {children}
    </m.h1>
  );
}

/* ── Subtitle: fade in ── */
export function AnimatedSubtitle({ children, className, delay = 0.3 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <m.p
      className={className}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay, duration: 0.8 }}
    >
      {children}
    </m.p>
  );
}

/* ── CTA area: fade in ── */
export function AnimatedCTA({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: 0.6, duration: 0.8 }}
    >
      {children}
    </m.div>
  );
}

/* ── Feature cards: stagger on scroll into view ── */
export function AnimatedFeatureGrid({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <m.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } },
      }}
    >
      {children}
    </m.div>
  );
}

export function AnimatedFeatureCard({ children }: { children: ReactNode }) {
  return (
    <m.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { ...spring, duration: 1 } },
      }}
    >
      {children}
    </m.div>
  );
}
