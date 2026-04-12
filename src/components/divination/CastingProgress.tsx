"use client";

import { m } from "framer-motion";

interface CastingProgressProps {
  /** Current toss number (0-5) */
  current: number;
  /** Total number of tosses */
  total?: number;
}

/**
 * Casting progress indicator with Chinese-style dot indicators.
 * Current progress highlighted in gold, incomplete in muted ink color.
 */
export default function CastingProgress({
  current,
  total = 6,
}: CastingProgressProps) {
  const isComplete = current >= total;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Text indicator */}
      <p
        className="text-sm font-title tracking-[0.2em]"
        style={{ color: "var(--color-gold)" }}
      >
        {isComplete ? "卦象已成" : `第 ${current + 1} 次 / 共 ${total} 次`}
      </p>

      {/* Dot progress */}
      <div className="flex items-center gap-2">
        {Array.from({ length: total }).map((_, i) => {
          const isDone = i < current;
          const isCurrent = i === current && !isComplete;

          return (
            <m.div
              key={i}
              className="relative"
              initial={false}
              animate={{
                scale: isCurrent ? 1.3 : 1,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full transition-all duration-400"
                style={{
                  backgroundColor: isDone || isComplete
                    ? "var(--color-gold)"
                    : isCurrent
                      ? "var(--color-gold-bright)"
                      : "var(--theme-text-muted)",
                  opacity: isDone || isComplete ? 1 : isCurrent ? 0.8 : 0.2,
                  boxShadow: isDone || isCurrent
                    ? "0 0 8px color-mix(in srgb, var(--color-gold) 40%, transparent)"
                    : "none",
                }}
              />
              {/* Pulse ring on current */}
              {isCurrent && (
                <m.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: "1px solid var(--color-gold)",
                  }}
                  animate={{
                    scale: [1, 1.8],
                    opacity: [0.6, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              )}
            </m.div>
          );
        })}
      </div>

      {/* Connecting line under dots */}
      <div className="relative w-full max-w-[160px] h-0.5 rounded-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "var(--theme-text-muted)", opacity: 0.15 }}
        />
        <m.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, var(--color-gold), var(--color-gold-bright))",
          }}
          initial={false}
          animate={{
            width: `${(current / total) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
