"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

// Breathing cycle: 4s inhale + 2s hold + 4s exhale = 10s per cycle, 3 cycles = 30s
const INHALE_DURATION = 4000;
const HOLD_DURATION = 2000;
const EXHALE_DURATION = 4000;
const CYCLE_DURATION = INHALE_DURATION + HOLD_DURATION + EXHALE_DURATION; // 10s
const TOTAL_CYCLES = 3;
const TOTAL_DURATION = CYCLE_DURATION * TOTAL_CYCLES; // 30s
const SKIP_DELAY = 3000;
const DIVINATION_COUNT_KEY = "iching_divination_count";

type BreathPhase = "inhale" | "hold" | "exhale";

interface MeditationGuideProps {
  onComplete: () => void;
}

export default function MeditationGuide({ onComplete }: MeditationGuideProps) {
  const t = useTranslations("Meditation");
  const [elapsed, setElapsed] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const completedRef = useRef(false);

  // Check if user has completed 3+ divinations
  useEffect(() => {
    try {
      const count = parseInt(localStorage.getItem(DIVINATION_COUNT_KEY) || "0", 10);
      setShowSkip(count >= 3);
    } catch {
      setShowSkip(false);
    }
  }, []);

  // Main timer loop using rAF for smooth 60fps
  useEffect(() => {
    startTimeRef.current = performance.now();

    const tick = (now: number) => {
      const ms = now - startTimeRef.current;
      setElapsed(ms);

      if (ms >= SKIP_DELAY && !canSkip) {
        setCanSkip(true);
      }

      if (ms >= TOTAL_DURATION) {
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete();
        }
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onComplete, canSkip]);

  // Derive current state from elapsed time
  const cycleMs = elapsed % CYCLE_DURATION;
  const currentCycle = Math.min(Math.floor(elapsed / CYCLE_DURATION), TOTAL_CYCLES - 1);

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
  if (breathPhase === "inhale") {
    const progress = cycleMs / INHALE_DURATION;
    // ease-in-out cubic
    const eased = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    ringScale = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * eased;
  } else if (breathPhase === "hold") {
    ringScale = MAX_SCALE;
  } else {
    const progress = (cycleMs - INHALE_DURATION - HOLD_DURATION) / EXHALE_DURATION;
    const eased = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    ringScale = MAX_SCALE - (MAX_SCALE - MIN_SCALE) * eased;
  }

  // Progress bar: 0 → 1 over 30s
  const progress = Math.min(elapsed / TOTAL_DURATION, 1);

  // Breath prompt text
  const breathText =
    breathPhase === "inhale" ? t("inhale") :
    breathPhase === "hold" ? t("hold") :
    t("exhale");

  // Guidance lines
  const lines = [t("line1"), t("line2"), t("line3")];

  const handleSkip = useCallback(() => {
    if (!completedRef.current) {
      completedRef.current = true;
      cancelAnimationFrame(rafRef.current);
      onComplete();
    }
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a12] overflow-hidden">
      {/* Skip button - desktop: top-right, mobile: bottom */}
      {showSkip && (
        <AnimatePresence>
          {canSkip && (
            <m.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              onClick={handleSkip}
              className="hidden sm:block fixed top-6 right-6 text-sm text-[#a0978a] hover:text-[#c9a96e] transition-colors z-50 font-title tracking-wider"
            >
              {t("skip")}
            </m.button>
          )}
        </AnimatePresence>
      )}

      {/* Main content area */}
      <div className="flex flex-col items-center justify-center flex-1 px-6">
        {/* Guidance text - fades in per cycle */}
        <div className="h-12 mb-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <m.p
              key={currentCycle}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.8, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="text-lg sm:text-xl text-[#f5f0e8] font-title tracking-[0.15em] text-center"
            >
              {lines[currentCycle]}
            </m.p>
          </AnimatePresence>
        </div>

        {/* Breathing ring */}
        <div className="relative w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] flex items-center justify-center">
          {/* Outer glow */}
          <div
            className="absolute rounded-full transition-none"
            style={{
              width: "100%",
              height: "100%",
              transform: `scale(${ringScale})`,
              background: `radial-gradient(circle, transparent 55%, rgba(201,169,110,${0.06 * ringScale}) 70%, transparent 85%)`,
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
              border: "2px solid transparent",
              boxShadow: `
                0 0 ${30 * ringScale}px rgba(201,169,110,${0.3 * ringScale}),
                0 0 ${60 * ringScale}px rgba(201,169,110,${0.15 * ringScale}),
                inset 0 0 ${30 * ringScale}px rgba(139,37,0,${0.1 * ringScale})
              `,
              willChange: "transform, box-shadow",
            }}
          >
            {/* Ring border with gradient */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c9a96e" />
                  <stop offset="50%" stopColor="#e8d5a3" />
                  <stop offset="100%" stopColor="#8b2500" />
                </linearGradient>
              </defs>
              <circle
                cx="100"
                cy="100"
                r="97"
                fill="none"
                stroke="url(#ringGradient)"
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
              background: `radial-gradient(circle, rgba(201,169,110,${0.04 * ringScale}) 0%, transparent 70%)`,
              willChange: "transform",
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
              className="relative z-10 text-base sm:text-lg text-[#c9a96e] font-title tracking-[0.2em]"
            >
              {breathText}
            </m.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom area: progress bar + mobile skip */}
      <div className="w-full px-6 pb-8 sm:pb-10 flex flex-col items-center gap-4">
        {/* Progress bar */}
        <div className="w-full max-w-md h-1 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full transition-none"
            style={{
              width: `${progress * 100}%`,
              background: "linear-gradient(90deg, #c9a96e, #e8d5a3)",
              willChange: "width",
            }}
          />
        </div>

        {/* Mobile skip button */}
        {showSkip && canSkip && (
          <m.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            onClick={handleSkip}
            className="sm:hidden text-sm text-[#a0978a] font-title tracking-wider active:text-[#c9a96e] transition-colors"
          >
            {t("tapToSkip")}
          </m.button>
        )}
      </div>
    </div>
  );
}
