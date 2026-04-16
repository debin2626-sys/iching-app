"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  trackDivinationLimitReached,
  trackViewLimitPopup,
  trackClickUpgradePro,
  trackClickKofiDonate,
  trackCloseLimitPopup,
} from "@/lib/analytics";

const STORAGE_KEY = "iching_daily_count";
export const FREE_LIMIT = 3;

// Ko-fi link (to be updated when finalized)
const KOFI_URL = "https://ko-fi.com/51yijing";
// Pro upgrade link (to be updated when finalized)
const PRO_UPGRADE_URL = "/pricing";

function getTodayKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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

interface DailyLimitModalProps {
  show: boolean;
  onClose: () => void;
  userId?: string | null;
}

/**
 * 每日限制模态对话框
 * PRD: 居中显示，背景半透明置灰，X 图标关闭，升级到 Pro + Ko-fi 打赏两个按钮
 */
export function DailyLimitBanner({ show, onClose, userId }: DailyLimitModalProps) {
  const t = useTranslations("DailyLimit");

  // Track popup view when shown
  useEffect(() => {
    if (show) {
      trackViewLimitPopup(userId);
    }
  }, [show, userId]);

  const handleClose = () => {
    trackCloseLimitPopup(userId);
    onClose();
  };

  const handleUpgradePro = () => {
    trackClickUpgradePro();
    window.location.href = PRO_UPGRADE_URL;
  };

  const handleKofiDonate = () => {
    trackClickKofiDonate();
    window.open(KOFI_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* 半透明背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* 居中模态对话框 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-md rounded-2xl border border-amber-700/40 p-6 shadow-2xl pointer-events-auto"
              style={{ background: "var(--theme-dropdown-bg)" }}
            >
              {/* X 关闭按钮 */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-white/10 transition-colors text-lg"
                aria-label={t("close")}
              >
                ✕
              </button>

              {/* 标题 */}
              <div className="text-center mb-4">
                <div className="text-3xl mb-3">🔮</div>
                <h3 className="text-xl font-title text-[var(--color-gold-bright)] mb-3">
                  {t("title")}
                </h3>

                {/* 内容说明 */}
                <p className="text-sm text-[var(--theme-text-muted)] leading-relaxed">
                  {t("description", { limit: FREE_LIMIT })}
                </p>
                <p className="text-sm text-[var(--theme-text-muted)] leading-relaxed mt-2">
                  {t("upgradeHint")}
                </p>
              </div>

              {/* 操作按钮 */}
              <div className="flex flex-col gap-3 mt-5">
                {/* 主按钮：升级到 Pro */}
                <button
                  onClick={handleUpgradePro}
                  className="w-full h-12 rounded-xl bg-[var(--color-vermilion)] hover:bg-[var(--color-vermilion-bright)] text-white font-bold font-title tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-lg border border-[var(--color-gold)]"
                >
                  ✨ {t("upgradePro")}
                </button>

                {/* 次按钮：Ko-fi 打赏 */}
                <button
                  onClick={handleKofiDonate}
                  className="w-full h-12 rounded-xl border border-[var(--color-gold)]/40 text-[var(--color-gold)] hover:border-[var(--color-gold)]/60 hover:text-[var(--color-gold-bright)] font-title tracking-wide transition-all duration-200 flex items-center justify-center gap-2"
                >
                  ☕️ {t("kofiDonate")}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/** Hook to track local (unauthenticated) daily count, subscription-aware */
export function useLocalDailyLimit() {
  const { data: session, status } = useSession();
  const [count, setCount] = useState(0);
  const [showBanner, setShowBanner] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const userId = session?.user?.id ?? null;

  useEffect(() => {
    if (status === "unauthenticated") {
      const count = getLocalDivinationCount();
      // Use queueMicrotask to avoid synchronous setState in effect
      queueMicrotask(() => setCount(count));
    }
  }, [status]);

  // Check subscription status for authenticated users
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user/subscription")
        .then((res) => res.json())
        .then((data) => {
          if (data.subscription) {
            setIsSubscribed(true);
          }
        })
        .catch(() => {});
    }
  }, [status]);

  const checkAndIncrement = (): boolean => {
    // Subscribed users always pass
    if (isSubscribed) return true;
    if (status !== "unauthenticated") return true; // logged-in users handled server-side
    const current = getLocalDivinationCount();
    if (current >= FREE_LIMIT) {
      trackDivinationLimitReached(null);
      setShowBanner(true);
      return false;
    }
    incrementLocalDivinationCount();
    setCount(current + 1);
    return true;
  };

  return { count, limit: FREE_LIMIT, showBanner, setShowBanner, checkAndIncrement, userId, isSubscribed };
}
