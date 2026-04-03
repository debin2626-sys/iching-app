"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "iching_daily_count";
const FREE_LIMIT = 3;

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function getLocalDivinationCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const data = JSON.parse(raw);
    if (data.date !== getTodayKey()) return 0;
    return data.count || 0;
  } catch {
    return 0;
  }
}

export function incrementLocalDivinationCount(): void {
  if (typeof window === "undefined") return;
  try {
    const today = getTodayKey();
    const raw = localStorage.getItem(STORAGE_KEY);
    let count = 0;
    if (raw) {
      const data = JSON.parse(raw);
      if (data.date === today) count = data.count || 0;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: count + 1 }));
  } catch {
    // ignore
  }
}

interface DailyLimitBannerProps {
  show: boolean;
  onClose: () => void;
  isLoggedIn?: boolean;
}

export function DailyLimitBanner({ show, onClose, isLoggedIn }: DailyLimitBannerProps) {
  const t = useTranslations("DailyLimit");

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-x-0 top-20 z-50 flex justify-center px-4"
        >
          <div
            className="w-full max-w-md rounded-xl border border-amber-700/40 p-5 shadow-2xl backdrop-blur-xl"
            style={{ background: "rgba(10,10,18,0.95)" }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">🔮</span>
              <div className="flex-1">
                <h3 className="text-base font-title text-amber-300 mb-1">{t("title")}</h3>
                <p className="text-sm text-zinc-400 mb-3">
                  {t("message", { limit: FREE_LIMIT })}
                </p>
                {!isLoggedIn && (
                  <p className="text-xs text-zinc-500 mb-3">{t("loginHint")}</p>
                )}
                <div className="flex gap-2">
                  {!isLoggedIn && (
                    <Link
                      href="/auth"
                      className="px-4 py-1.5 rounded-lg border border-gold/40 text-gold text-sm hover:bg-gold/10 transition-colors"
                    >
                      {t("loginButton")}
                    </Link>
                  )}
                  <button
                    onClick={onClose}
                    className="px-4 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 text-sm hover:text-zinc-200 transition-colors"
                  >
                    {t("understood")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Hook to track local (unauthenticated) daily count */
export function useLocalDailyLimit() {
  const { status } = useSession();
  const [count, setCount] = useState(0);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      setCount(getLocalDivinationCount());
    }
  }, [status]);

  const checkAndIncrement = (): boolean => {
    if (status !== "unauthenticated") return true; // logged-in users handled server-side
    const current = getLocalDivinationCount();
    if (current >= FREE_LIMIT) {
      setShowBanner(true);
      return false;
    }
    incrementLocalDivinationCount();
    setCount(current + 1);
    return true;
  };

  return { count, limit: FREE_LIMIT, showBanner, setShowBanner, checkAndIncrement };
}
