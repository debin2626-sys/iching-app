"use client";

import { useState, useRef, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import type { UseSoundEffect } from "@/hooks/useSoundEffect";
import type { SoundTheme } from "@/lib/sound-synth";

const THEMES: { key: SoundTheme; icon: string; label: string; labelEn: string }[] = [
  { key: "ambient", icon: "🌫️", label: "白噪音", labelEn: "Ambient" },
  { key: "bell", icon: "🔔", label: "钟磬", labelEn: "Bell" },
  { key: "water", icon: "💧", label: "流水", labelEn: "Water" },
];

interface SoundSettingsProps {
  sound: UseSoundEffect;
}

export default function SoundSettings({ sound }: SoundSettingsProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={panelRef} className="fixed top-4 right-4 z-50">
      {/* 触发按钮 */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border border-white/10 bg-black/40 backdrop-blur-sm hover:border-[var(--color-gold)]/40 hover:bg-black/60"
        aria-label="音效设置"
        title="音效设置"
      >
        <span className="text-lg">{sound.muted ? "🔇" : "🔊"}</span>
      </button>

      {/* 首次使用提示气泡 */}
      {sound.isFirstUse && !open && (
        <m.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute top-12 right-0 bg-black/80 backdrop-blur-sm border border-[var(--color-gold)]/30 rounded-lg px-3 py-2 text-xs text-[var(--color-gold)] whitespace-nowrap"
        >
          🎵 点击开启音效体验
          <div className="absolute -top-1 right-4 w-2 h-2 bg-black/80 border-l border-t border-[var(--color-gold)]/30 rotate-45" />
        </m.div>
      )}

      {/* 设置面板 */}
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-12 right-0 w-56 bg-[var(--theme-dropdown-bg)] backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-xl"
          >
            {/* 标题 */}
            <p className="text-xs text-[var(--color-gold)]/70 font-title tracking-wider mb-3">
              🎵 音效设置
            </p>

            {/* 静音开关 */}
            <button
              onClick={sound.toggleMute}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg mb-3 transition-all duration-200 border ${
                sound.muted
                  ? "border-white/10 bg-white/5 text-gray-400"
                  : "border-[var(--color-gold)]/40 bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
              }`}
            >
              <span className="text-sm">{sound.muted ? "🔇 已静音" : "🔊 已开启"}</span>
              <div
                className={`w-8 h-4 rounded-full relative transition-colors duration-200 ${
                  sound.muted ? "bg-white/10" : "bg-[var(--color-gold)]/40"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-3 h-3 rounded-full transition-all duration-200 ${
                    sound.muted
                      ? "left-0.5 bg-gray-500"
                      : "left-[18px] bg-[var(--color-gold)]"
                  }`}
                />
              </div>
            </button>

            {/* 音效类型选择 */}
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2">音效类型</p>
              <div className="flex gap-1.5">
                {THEMES.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => sound.setTheme(t.key)}
                    className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg text-xs transition-all duration-200 border ${
                      sound.theme === t.key
                        ? "border-[var(--color-gold)]/50 bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
                        : "border-white/5 bg-white/5 text-gray-500 hover:border-white/15"
                    }`}
                  >
                    <span className="text-base">{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 音量滑块 */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs text-gray-500">音量</p>
                <p className="text-xs text-gray-500">{Math.round(sound.volume * 100)}%</p>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(sound.volume * 100)}
                onChange={(e) => sound.setVolume(Number(e.target.value) / 100)}
                className="w-full h-1 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-3.5
                  [&::-webkit-slider-thumb]:h-3.5
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-[var(--color-gold)]
                  [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgba(201,169,110,0.5)]
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:w-3.5
                  [&::-moz-range-thumb]:h-3.5
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-[var(--color-gold)]
                  [&::-moz-range-thumb]:border-0
                  [&::-moz-range-thumb]:cursor-pointer"
                style={{
                  background: `linear-gradient(to right, var(--color-gold) 0%, var(--color-gold) ${sound.volume * 100}%, rgba(255,255,255,0.1) ${sound.volume * 100}%, rgba(255,255,255,0.1) 100%)`,
                }}
              />
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
