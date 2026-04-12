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
  mode: "light",
  setMode: () => {},
  resolved: "light",
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("light");
  const [resolved, setResolved] = useState<"dark" | "light">("light");

  /* ── Resolve system preference ── */
  function resolve(m: ThemeMode): "dark" | "light" {
    if (m === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return m;
  }

  /* ── Apply theme to <html> ── */
  function applyTheme(r: "dark" | "light") {
    const html = document.documentElement;
    if (r === "dark") {
      html.setAttribute("data-theme", "dark");
    } else {
      html.removeAttribute("data-theme");
    }
    setResolved(r);
  }

  /* ── Init from localStorage ── */
  useEffect(() => {
    const saved = (localStorage.getItem("theme") as ThemeMode) || "light";
    setModeState(saved);
    const r = resolve(saved);
    applyTheme(r);

    /* Listen for system preference changes */
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (saved === "system") applyTheme(mq.matches ? "dark" : "light");
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
