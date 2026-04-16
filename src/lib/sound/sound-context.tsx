"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

const STORAGE_KEY = "iching_sound_enabled";

interface SoundContextValue {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

const SoundContext = createContext<SoundContextValue>({
  enabled: false,
  setEnabled: () => {},
});

/** Detect mobile device */
function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(() => {
    // Load preference from localStorage on mount
    try {
      if (typeof window === 'undefined') return false;
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored !== null ? stored === 'true' : !isMobile();
    } catch {
      return !isMobile();
    }
  });

  const setEnabled = useCallback((value: boolean) => {
    setEnabledState(value);
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      // Ignore storage errors
    }
  }, []);

  return (
    <SoundContext.Provider value={{ enabled, setEnabled }}>
      {children}
    </SoundContext.Provider>
  );
}

/** Returns [enabled, setEnabled] tuple */
export function useSoundEnabled(): [boolean, (enabled: boolean) => void] {
  const { enabled, setEnabled } = useContext(SoundContext);
  return [enabled, setEnabled];
}
