"use client";

import { useState, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import { scenarios, type Scenario, type SubScenario } from "@/data/scenarios";
import SubScenarioPanel from "./SubScenarioPanel";

interface ScenarioSelectorProps {
  onSelect: (template: string, scenarioId: string, subScenarioId: string) => void;
}

export default function ScenarioSelector({ onSelect }: ScenarioSelectorProps) {
  const rawLocale = useLocale();
  const locale = (rawLocale === "zh" || rawLocale === "en" ? rawLocale : "zh") as "zh" | "en";
  const localeKey = rawLocale as string;
  const [activeId, setActiveId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getText = (obj: { zh: string; en: string; "zh-TW"?: string }) => {
    if (localeKey === "zh-TW" && obj["zh-TW"]) return obj["zh-TW"];
    return obj[locale];
  };

  const handleCardClick = (scenario: Scenario) => {
    setActiveId(activeId === scenario.id ? null : scenario.id);
  };

  const handleSubSelect = (sub: SubScenario) => {
    onSelect(getText(sub.template), activeScenario!.id, sub.id);
    setActiveId(null);
  };

  const activeScenario = scenarios.find((s) => s.id === activeId) ?? null;

  return (
    <div className="w-full">
      {/* Desktop: 5 cards in a row; Mobile: horizontal scroll with gradient fade hint */}
      <div className="relative md:hidden">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {scenarios.map((scenario, i) => (
            <m.button
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.1,
                duration: 0.4,
                ease: "easeOut",
              }}
              onClick={() => handleCardClick(scenario)}
              className={[
                "flex-shrink-0 snap-center flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all duration-200",
                "w-[140px] h-[100px]",
                "bg-[var(--theme-bg-card-solid)]",
                activeId === scenario.id
                  ? "border border-gold bg-gradient-to-b from-[var(--theme-bg-card-solid)] to-[var(--theme-bg-elevated)] shadow-[0_4px_20px_rgba(184,146,74,0.3)]"
                  : "border border-gold/30 hover:border-gold hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(184,146,74,0.3)]",
              ].join(" ")}
            >
              <span className="text-[28px] leading-none">
                {scenario.emoji}
              </span>
              <span className="mt-2 text-sm font-semibold text-[var(--theme-text-primary)]">
                {getText(scenario.name)}
              </span>
              <span className="mt-1 text-[11px] text-[var(--color-gold-dim)] truncate max-w-[120px] px-2 text-center">
                {getText(scenario.description)}
              </span>
            </m.button>
          ))}
        </div>
        {/* Right gradient fade hint for horizontal scroll */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-16"
          style={{
            background: "linear-gradient(to right, transparent, var(--theme-bg))",
          }}
        />
        {/* "More" text hint */}
        <div className="absolute right-1 top-1/2 -translate-y-1/2 text-gold/60 text-xs font-semibold pointer-events-none">
          More →
        </div>
      </div>
      {/* Desktop: 5 cards in a row */}
      <div
        className="hidden md:flex gap-4 md:justify-center"
      >
        {scenarios.map((scenario, i) => (
          <m.button
            key={scenario.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: i * 0.1,
              duration: 0.4,
              ease: "easeOut",
            }}
            onClick={() => handleCardClick(scenario)}
            className={[
              "flex-shrink-0 snap-center flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all duration-200",
              "w-[140px] h-[100px] md:w-[180px] md:h-[120px]",
              "bg-[var(--theme-bg-card-solid)]",
              activeId === scenario.id
                ? "border border-gold bg-gradient-to-b from-[var(--theme-bg-card-solid)] to-[var(--theme-bg-elevated)] shadow-[0_4px_20px_rgba(184,146,74,0.3)]"
                : "border border-gold/30 hover:border-gold hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(184,146,74,0.3)]",
            ].join(" ")}
          >
            <span className="text-[28px] md:text-[32px] leading-none">
              {scenario.emoji}
            </span>
            <span className="mt-2 text-sm md:text-base font-semibold text-[var(--theme-text-primary)]">
              {getText(scenario.name)}
            </span>
            <span className="mt-1 text-[11px] md:text-xs text-[var(--color-gold-dim)] truncate max-w-[120px] md:max-w-[160px] px-2 text-center">
              {getText(scenario.description)}
            </span>
          </m.button>
        ))}
      </div>

      {/* Sub-scenario panel */}
      <AnimatePresence mode="wait">
        {activeScenario && (
          <SubScenarioPanel
            key={activeScenario.id}
            scenario={activeScenario}
            onSelect={handleSubSelect}
            onClose={() => setActiveId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
