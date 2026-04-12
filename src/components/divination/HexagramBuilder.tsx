"use client";

import { m, AnimatePresence } from "framer-motion";
import YaoLine from "./YaoLine";
import type { LineValue } from "@/lib/iching/coins";

interface YaoResult {
  value: LineValue;
}

interface HexagramBuilderProps {
  /** Array of yao results (index 0 = first yao / bottom) */
  yaoResults: YaoResult[];
  /** Current toss number (0-5), controls how many yao are visible */
  currentToss: number;
}

const YAO_LABELS = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];

/**
 * Displays the six yao lines building up from bottom (初爻) to top (上爻).
 * Each yao slides in from the right with a fade, staggered by 600ms.
 * Uses YaoLine for rendering individual lines.
 */
export default function HexagramBuilder({
  yaoResults,
  currentToss,
}: HexagramBuilderProps) {
  // Show only completed yao (up to currentToss)
  const visibleCount = Math.min(yaoResults.length, currentToss);

  // Display order: top (上爻) first visually, but we build from bottom
  // We reverse for display: index 0 in display = highest completed yao
  const displayItems: { index: number; result: YaoResult }[] = [];
  for (let i = visibleCount - 1; i >= 0; i--) {
    displayItems.push({ index: i, result: yaoResults[i] });
  }

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <AnimatePresence mode="popLayout">
        {displayItems.map(({ index, result }) => {
          const isYang = result.value === 7 || result.value === 9;
          const isMoving = result.value === 6 || result.value === 9;

          return (
            <m.div
              key={index}
              className="flex items-center gap-3"
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: prefersReduced ? 0.2 : 0.5,
                ease: "easeOut",
              }}
              layout
            >
              <span
                className="text-xs w-10 text-right font-title"
                style={{ color: "var(--theme-text-muted)" }}
              >
                {YAO_LABELS[index]}
              </span>
              <YaoLine
                type={isYang ? "yang" : "yin"}
                isMoving={isMoving}
                animate={true}
              />
            </m.div>
          );
        })}
      </AnimatePresence>

      {visibleCount === 0 && (
        <p
          className="text-sm font-title tracking-wider"
          style={{ color: "var(--theme-text-muted)", opacity: 0.5 }}
        >
          卦象将在此显现
        </p>
      )}
    </div>
  );
}
