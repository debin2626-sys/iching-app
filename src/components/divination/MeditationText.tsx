"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

// Sync with breathing cycle: 10s per cycle
const CYCLE_DURATION = 10000;

interface MeditationTextProps {
  /** Total duration in seconds — used to calculate which line to show */
  duration?: number;
}

/**
 * Meditation guidance text that fades in line-by-line,
 * synchronized with the breathing rhythm (one line per 10s cycle).
 */
export default function MeditationText({ duration = 30 }: MeditationTextProps) {
  const t = useTranslations("Meditation");
  const [currentIndex, setCurrentIndex] = useState(0);

  const lines = [t("guide1"), t("guide2"), t("guide3")];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev < lines.length - 1) return prev + 1;
        return prev;
      });
    }, CYCLE_DURATION);
    return () => clearInterval(interval);
  }, [lines.length]);

  return (
    <div className="h-12 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <m.p
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.8, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-lg sm:text-xl tracking-[0.15em] text-center"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--theme-text-primary)",
          }}
        >
          {lines[currentIndex]}
        </m.p>
      </AnimatePresence>
    </div>
  );
}
