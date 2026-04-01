"use client";

import { useTranslations } from "next-intl";

export default function Loading() {
  const t = useTranslations("Loading");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)]">
      <div className="taichi-rotate mb-8">
        <div className="taichi-symbol" />
      </div>

      <p className="glow-text text-lg tracking-[0.3em] font-title animate-pulse-glow">
        {t("text")}
      </p>

      <div className="mt-6 flex items-center gap-2 text-amber-600/30 text-xs tracking-[0.5em]">
        ䷀ ䷁ ䷂ ䷃
      </div>
    </div>
  );
}
