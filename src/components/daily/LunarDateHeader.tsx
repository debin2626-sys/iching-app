"use client";

import { useTranslations } from "next-intl";
import type { LunarDateInfo } from "@/lib/daily-lesson";

interface LunarDateHeaderProps {
  lunar: LunarDateInfo;
}

export default function LunarDateHeader({ lunar }: LunarDateHeaderProps) {
  const t = useTranslations("Daily");
  return (
    <div className="text-center space-y-1">
      <p
        className="text-2xl"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)" }}
      >
        📅 {lunar.solarDisplay}
      </p>
      <p className="text-sm" style={{ color: "var(--theme-text-secondary)" }}>
        {t("lunarPrefix")}{lunar.lunarDisplay}
        {lunar.solarTerm && (
          <span style={{ color: "var(--color-gold)" }}> · {lunar.solarTerm}</span>
        )}
      </p>
      <p className="text-sm" style={{ color: "var(--theme-text-muted)" }}>
        {lunar.ganzhiDisplay}
      </p>
    </div>
  );
}
