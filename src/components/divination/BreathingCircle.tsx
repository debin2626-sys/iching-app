"use client";

import { useState, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

// Breathing cycle: 4s inhale + 2s hold + 4s exhale = 10s per cycle
const INHALE_DURATION = 4000;
const HOLD_DURATION = 2000;
const EXHALE_DURATION = 4000;
const CYCLE_DURATION = INHALE_DURATION + HOLD_DURATION + EXHALE_DURATION;

type BreathPhase = "inhale" | "hold" | "exhale";

interface BreathingCircleProps {
  /** Total duration in seconds (default 30) */
  duration?: number;
  /** Called when all cycles complete */
  onComplete?: () => void;
}

export default function BreathingCircle({
  duration = 30,
  onComplete,
}: BreathingCircleProps) {
  const t = useTranslations("Meditation");
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef(0);
  const rafRef = useRef(0);
  const completedRef = useRef(false);

  const totalDuration = duration * 1000;
  const totalCycles = Math.max(1, Math.ceil(totalDuration / CYCLE_DURATION));
  const actualTotalDuration = totalCycles * CYCLE_DURATION;

  // Check prefers-reduced-motion
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // rAF timer loop
  useEffect(() => {
    if (reducedMotion) {
      // In reduced motion mode, just run a simple interval countdown
      const interval = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1000;
          if (next >= actualTotalDuration && !completedRef.current) {
            completedRef.current = true;
            onComplete?.();
          }
          return next;
        });
      }, 1000);
      return () => clearInterval(interval);
    }

    startTimeRef.current = performance.now();
    const tick = (now: number) => {
      const ms = now - startTimeRef.current;
      setElapsed(ms);

      if (ms >= actualTotalDuration) {
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete?.();
        }
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onComplete, actualTotalDuration, reducedMotion]);

  // Derive breath phase from elapsed time
  const cycleMs = elapsed % CYCLE_DURATION;
  let breathPhase: BreathPhase;
  if (cycleMs < INHALE_DURATION) {
    breathPhase = "inhale";
  } else if (cycleMs < INHALE_DURATION + HOLD_DURATION) {
    breathPhase = "hold";
  } else {
    breathPhase = "exhale";
  }

  // Ring scale: 0.4 → 1.0 during inhale, hold at 1.0, 1.0 → 0.4 during exhale
  const MIN_SCALE = 0.4;
  const MAX_SCALE = 1.0;
  let ringScale: number;

  if (reducedMotion) {
    ringScale = MAX_SCALE; // Static ring in reduced motion
  } else if (breathPhase === "inhale") {
    const progress = cycleMs / INHALE_DURATION;
    const eased =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    ringScale = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * eased;
  } else if (breathPhase === "hold") {
    ringScale = MAX_SCALE;
  } else {
    const progress =
      (cycleMs - INHALE_DURATION - HOLD_DURATION) / EXHALE_DURATION;
    const eased =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    ringScale = MAX_SCALE - (MAX_SCALE - MIN_SCALE) * eased;
  }

  const breathText =
    breathPhase === "inhale"
      ? t("inhale")
      : breathPhase === "hold"
        ? t("hold")
        : t("exhale");

  const progress = Math.min(elapsed / actualTotalDuration, 1);

  return (
    <div className="flex flex-col items-center">
      {/* Breathing ring container */}
      <div
        className="relative flex items-center justify-center w-[280px] h-[280px] sm:w-[400px] sm:h-[400px]"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Outer glow */}
          <div
            className="absolute rounded-full"
            style={{
              width: "100%",
              height: "100%",
              transform: `scale(${ringScale})`,
              background: `radial-gradient(circle, transparent 55%, rgba(184,146,74,${0.06 * ringScale}) 70%, transparent 85%)`,
              willChange: reducedMotion ? "auto" : "transform",
            }}
          />

          {/* Main ring */}
          <div
            className="absolute rounded-full"
            style={{
              width: "80%",
              height: "80%",
              transform: `scale(${ringScale})`,
              background: "transparent",
              boxShadow: `
                0 0 ${30 * ringScale}px rgba(184,146,74,${0.3 * ringScale}),
                0 0 ${60 * ringScale}px rgba(184,146,74,${0.15 * ringScale}),
                inset 0 0 ${30 * ringScale}px rgba(139,37,0,${0.1 * ringScale})
              `,
              willChange: reducedMotion ? "auto" : "transform, box-shadow",
            }}
          >
            {/* Ring border with gold-to-vermilion gradient */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 200 200"
              role="img"
              aria-label="Breathing circle"
            >
              <defs>
                <linearGradient
                  id="breathRingGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="var(--color-gold)" />
                  <stop offset="50%" stopColor="var(--color-gold-bright)" />
                  <stop offset="100%" stopColor="var(--color-vermilion)" />
                </linearGradient>
              </defs>
              <circle
                cx="100"
                cy="100"
                r="97"
                fill="none"
                stroke="url(#breathRingGradient)"
                strokeWidth="2.5"
                opacity={0.6 + 0.4 * ringScale}
              />
            </svg>
          </div>

          {/* Inner subtle glow */}
          <div
            className="absolute rounded-full"
            style={{
              width: "50%",
              height: "50%",
              transform: `scale(${ringScale})`,
              background: `radial-gradient(circle, rgba(184,146,74,${0.04 * ringScale}) 0%, transparent 70%)`,
              willChange: reducedMotion ? "auto" : "transform",
            }}
          />

          {/* Breath phase text in center */}
          <AnimatePresence mode="wait">
            <m.span
              key={breathPhase}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 text-base sm:text-lg tracking-[0.2em]"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-gold)",
              }}
            >
              {breathText}
            </m.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md h-1 rounded-full overflow-hidden mt-8 bg-white/5">
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress * 100}%`,
            background:
              "linear-gradient(90deg, var(--color-gold), var(--color-gold-bright))",
            transition: reducedMotion ? "width 1s linear" : "none",
            willChange: reducedMotion ? "auto" : "width",
          }}
        />
      </div>
    </div>
  );
}
