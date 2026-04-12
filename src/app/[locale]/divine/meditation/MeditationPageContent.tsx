"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { TaichiWatermark } from "@/components/decorative";
import BreathingCircle from "@/components/divination/BreathingCircle";
import MeditationText from "@/components/divination/MeditationText";
import {
  trackMeditationComplete,
  trackMeditationSkip,
  trackFunnelMeditationStart,
  trackFunnelMeditationSkip,
  trackFunnelMeditationComplete,
} from "@/lib/analytics";

const MEDITATION_DURATION = 30; // seconds

export default function MeditationPageContent() {
  const t = useTranslations("Meditation");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [canSkip, setCanSkip] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const completedRef = useRef(false);
  const startTimeRef = useRef(Date.now());

  // Track meditation start
  useEffect(() => {
    trackFunnelMeditationStart();
    startTimeRef.current = Date.now();
  }, []);

  // Skip button countdown: show after 3s
  useEffect(() => {
    setShowSkip(true); // Show the button text immediately (with countdown)

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  // Navigate to divination page, preserving search params
  const navigateToDivination = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    const queryString = params.toString();
    const path = `/divination${queryString ? `?${queryString}` : ""}`;
    router.push(path);
  }, [router, searchParams]);

  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    const durationSeconds = Math.round(
      (Date.now() - startTimeRef.current) / 1000
    );
    trackMeditationComplete();
    trackFunnelMeditationComplete({ duration_seconds: durationSeconds });
    navigateToDivination();
  }, [navigateToDivination]);

  const handleSkip = useCallback(() => {
    if (completedRef.current || !canSkip) return;
    completedRef.current = true;
    const skipTimeSeconds = Math.round(
      (Date.now() - startTimeRef.current) / 1000
    );
    trackMeditationSkip();
    trackFunnelMeditationSkip({ skip_time_seconds: skipTimeSeconds });
    navigateToDivination();
  }, [canSkip, navigateToDivination]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--theme-bg)" }}
    >
      {/* Taichi watermark — centered, slow rotation */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <TaichiWatermark size={500} opacity={0.07} animate />
      </div>

      {/* Skip button — desktop: top-right */}
      <AnimatePresence>
        {showSkip && (
          <m.button
            initial={{ opacity: 0 }}
            animate={{ opacity: canSkip ? 0.6 : 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={canSkip ? { opacity: 1 } : undefined}
            onClick={handleSkip}
            disabled={!canSkip}
            className="hidden sm:block fixed top-6 right-6 text-sm transition-colors z-50 tracking-wider"
            style={{
              fontFamily: "var(--font-display)",
              color: canSkip
                ? "var(--theme-text-muted)"
                : "var(--theme-text-muted)",
              cursor: canSkip ? "pointer" : "default",
            }}
          >
            {canSkip ? t("skip") : `${t("skip")}（${countdown}）`}
          </m.button>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center flex-1 px-6 relative z-10">
        {/* Guidance text */}
        <div className="mb-8">
          <MeditationText duration={MEDITATION_DURATION} />
        </div>

        {/* Breathing circle */}
        <BreathingCircle
          duration={MEDITATION_DURATION}
          onComplete={handleComplete}
        />
      </div>

      {/* Bottom: mobile skip button */}
      <div className="w-full px-6 pb-8 sm:pb-10 flex flex-col items-center gap-4 relative z-10">
        {/* Mobile skip button */}
        <AnimatePresence>
          {showSkip && (
            <m.button
              initial={{ opacity: 0 }}
              animate={{ opacity: canSkip ? 0.5 : 0.25 }}
              transition={{ duration: 0.5 }}
              onClick={handleSkip}
              disabled={!canSkip}
              className="sm:hidden text-sm tracking-wider transition-colors"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--theme-text-muted)",
                cursor: canSkip ? "pointer" : "default",
              }}
            >
              {canSkip ? t("skip") : `${t("skip")}（${countdown}）`}
            </m.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
