"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] px-4 text-center">
      <div className="text-7xl mb-6 opacity-60">☲</div>

      <h1 className="font-title text-3xl sm:text-4xl font-bold text-gold-glow mb-4">
        {t("title")}
      </h1>

      <p className="text-gray-400 text-base tracking-wider mb-2 max-w-md">
        {t("subtitle")}
      </p>
      <p className="text-gray-600 text-sm tracking-wide mb-8">
        {t("subtitleEn")}
      </p>

      <div className="divider-gold w-24 mb-8" />

      <button
        onClick={reset}
        className="px-8 py-3 rounded-xl border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/50 transition-all duration-300 tracking-wider font-title cursor-pointer"
      >
        {t("retry")}
      </button>
    </div>
  );
}
