"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: string; // ISO date string e.g. "2026-05-01"
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: string): TimeLeft | null {
  const diff = new Date(target + "T00:00:00+08:00").getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const UNITS = [
  { key: "days", label: "天" },
  { key: "hours", label: "时" },
  { key: "minutes", label: "分" },
  { key: "seconds", label: "秒" },
] as const;

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calcTimeLeft(targetDate));
    const id = setInterval(() => setTimeLeft(calcTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  // SSR / hydration: render placeholder to avoid mismatch
  if (!mounted || !timeLeft) {
    return (
      <div
        className="flex justify-center gap-3"
        role="timer"
        aria-live="polite"
        aria-label="倒计时"
      >
        {UNITS.map((u) => (
          <div key={u.key} className="flex flex-col items-center gap-1">
            <span
              className="text-4xl tabular-nums"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)" }}
            >
              --
            </span>
            <span className="text-xs" style={{ color: "var(--theme-text-muted)" }}>
              {u.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="flex justify-center gap-3"
      role="timer"
      aria-live="polite"
      aria-label="倒计时"
    >
      {UNITS.map((u) => (
        <div key={u.key} className="flex flex-col items-center gap-1">
          <span
            className="text-4xl tabular-nums"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-gold)",
              minWidth: "3ch",
              textAlign: "center",
            }}
          >
            {String(timeLeft[u.key]).padStart(2, "0")}
          </span>
          <span className="text-xs" style={{ color: "var(--theme-text-muted)" }}>
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
