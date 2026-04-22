"use client";

import { m, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { School } from "@/lib/daily-lesson";

interface SchoolTabsProps {
  active: School;
  onChange: (school: School) => void;
}

export default function SchoolTabs({ active, onChange }: SchoolTabsProps) {
  const t = useTranslations("Daily");

  const TABS: { key: School; label: string }[] = [
    { key: "yijing", label: t("tabYijing") },
    { key: "daoist", label: t("tabDaoist") },
  ];

  return (
    <div
      className="flex justify-center gap-6"
      role="tablist"
      aria-label={t("tabListLabel")}
    >
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className="relative pb-2 text-base transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)]"
            style={{
              fontFamily: "var(--font-display)",
              color: isActive ? "var(--color-gold)" : "var(--theme-text-muted)",
            }}
          >
            {tab.label}
            {isActive && (
              <m.div
                layoutId="daily-tab-underline"
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ backgroundColor: "var(--color-gold)" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
