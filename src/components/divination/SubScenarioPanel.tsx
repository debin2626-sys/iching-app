"use client";

import { useRef, useEffect, useCallback } from "react";
import { m, useDragControls } from "framer-motion";
import { useLocale } from "next-intl";
import type { Scenario, SubScenario } from "@/data/scenarios";

interface SubScenarioPanelProps {
  scenario: Scenario;
  onSelect: (sub: SubScenario) => void;
  onClose: () => void;
}

function useIsMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

function getScenarioText(obj: { zh: string; en: string; "zh-TW"?: string }, locale: string): string {
  if (locale === "zh-TW" && obj["zh-TW"]) return obj["zh-TW"];
  if (locale === "en") return obj.en;
  return obj.zh;
}

/* ── Desktop: dropdown panel ── */
function DesktopPanel({ scenario, onSelect, onClose }: SubScenarioPanelProps) {
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="mt-3 overflow-hidden rounded-xl bg-[#12121e] border border-[rgba(201,169,110,0.2)]"
    >
      <div className="p-4 flex flex-wrap gap-2">
        {scenario.subScenarios.map((sub) => (
          <button
            key={sub.id}
            onClick={() => onSelect(sub)}
            className="px-4 py-2 rounded-full text-sm text-[#f5f0e8] bg-[#1a1a2e] border border-[rgba(201,169,110,0.4)] transition-all duration-200 hover:bg-[#2a2035] hover:border-[#c9a96e] hover:text-[#c9a96e] active:scale-95"
          >
            {getScenarioText(sub.name, locale)}
          </button>
        ))}
      </div>
    </m.div>
  );
}

/* ── Mobile: bottom sheet ── */
function MobileSheet({ scenario, onSelect, onClose }: SubScenarioPanelProps) {
  const locale = useLocale();
  const dragControls = useDragControls();
  const sheetRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
      if (info.offset.y > 100 || info.velocity.y > 300) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <>
      {/* Backdrop */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40"
      />

      {/* Sheet */}
      <m.div
        ref={sheetRef}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        drag="y"
        dragControls={dragControls}
        dragConstraints={{ top: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#12121e] rounded-t-2xl max-h-[60vh] flex flex-col"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <div className="w-10 h-1 rounded-full bg-[rgba(201,169,110,0.4)]" />
        </div>

        {/* Title */}
        <div className="px-4 pb-3 border-b border-[#2a2a3a]">
          <h3 className="text-base font-semibold text-[#f5f0e8]">
            {scenario.emoji} {getScenarioText(scenario.name, locale)}
          </h3>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {scenario.subScenarios.map((sub, i) => (
            <button
              key={sub.id}
              onClick={() => onSelect(sub)}
              className={[
                "w-full flex items-center justify-between px-4 h-14 text-left transition-colors",
                "text-[#f5f0e8] hover:bg-[rgba(201,169,110,0.08)] active:bg-[rgba(201,169,110,0.12)]",
                i < scenario.subScenarios.length - 1 ? "border-b border-[#2a2a3a]" : "",
              ].join(" ")}
            >
              <span className="text-sm">{getScenarioText(sub.name, locale)}</span>
              <span className="text-[#a08050] text-xs">›</span>
            </button>
          ))}
        </div>
      </m.div>
    </>
  );
}

export default function SubScenarioPanel(props: SubScenarioPanelProps) {
  const isMobile = useIsMobile();
  return isMobile ? <MobileSheet {...props} /> : <DesktopPanel {...props} />;
}
