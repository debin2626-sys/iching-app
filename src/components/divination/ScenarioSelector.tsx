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
      {/* Desktop: 5 cards in a row; Mobile: horizontal scroll */}
      <div
        ref={scrollRef}
        className="flex gap-3 md:gap-4 md:justify-center overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 snap-x snap-mandatory scrollbar-hide"
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
              "w-[140px] h-[100px] md:w-[180px] md:h-[120px]",
              "bg-[#1a1a2e]",
              activeId === scenario.id
                ? "border border-[#c9a96e] bg-gradient-to-b from-[#1a1a2e] to-[#2a2035] shadow-[0_4px_20px_rgba(201,169,110,0.3)]"
                : "border border-[rgba(201,169,110,0.3)] hover:border-[#c9a96e] hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(201,169,110,0.3)]",
            ].join(" ")}
          >
            <span className="text-[28px] md:text-[32px] leading-none">
              {scenario.emoji}
            </span>
            <span className="mt-2 text-sm md:text-base font-semibold text-[#f5f0e8]">
              {getText(scenario.name)}
            </span>
            <span className="mt-1 text-[11px] md:text-xs text-[#a08050] truncate max-w-[120px] md:max-w-[160px] px-2 text-center">
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
