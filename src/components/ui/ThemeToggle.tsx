"use client";

import { useTheme, type ThemeMode } from "@/contexts/ThemeContext";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  );
}

export function ThemeToggle() {
  const { mode, setMode, resolved } = useTheme();
  const t = useTranslations("Settings");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const options: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: "dark", label: t("dark"), icon: <MoonIcon /> },
    { value: "light", label: t("light"), icon: <SunIcon /> },
    { value: "system", label: t("system"), icon: <SystemIcon /> },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 bg-[var(--theme-border)] text-gold transition-all duration-300 hover:border-gold/60 hover:bg-[var(--theme-bg-card)]"
        aria-label={t("theme")}
        title={t("theme")}
      >
        {resolved === "light" ? <SunIcon /> : <MoonIcon />}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 min-w-[120px] overflow-hidden rounded-lg border border-gold/20 bg-[var(--theme-dropdown-bg)] shadow-lg backdrop-blur-xl z-[100] theme-dropdown">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setMode(opt.value); setOpen(false); }}
              className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors duration-200 ${
                mode === opt.value
                  ? "bg-gold/10 text-gold"
                  : "text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-card)] hover:text-gold"
              }`}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
