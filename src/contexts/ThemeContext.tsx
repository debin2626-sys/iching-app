"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ThemeMode = "dark" | "light" | "system";

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  /** Resolved theme: "dark" or "light" */
  resolved: "dark" | "light";
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "dark",
  setMode: () => {},
  resolved: "dark",
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("dark");
  const [resolved, setResolved] = useState<"dark" | "light">("dark");

  /* ── Resolve system preference ── */
  function resolve(m: ThemeMode): "dark" | "light" {
    if (m === "system") {
      return window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
    }
    return m;
  }

  /* ── Apply theme to <html> ── */
  function applyTheme(r: "dark" | "light") {
    const html = document.documentElement;
    if (r === "light") {
      html.setAttribute("data-theme", "light");
    } else {
      html.removeAttribute("data-theme");
    }
    setResolved(r);
  }

  /* ── Init from localStorage ── */
  useEffect(() => {
    const saved = (localStorage.getItem("theme") as ThemeMode) || "dark";
    setModeState(saved);
    const r = resolve(saved);
    applyTheme(r);

    /* Listen for system preference changes */
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const handler = () => {
      if (saved === "system") applyTheme(mq.matches ? "light" : "dark");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setMode(m: ThemeMode) {
    setModeState(m);
    localStorage.setItem("theme", m);
    applyTheme(resolve(m));
  }

  return (
    <ThemeContext.Provider value={{ mode, setMode, resolved }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
