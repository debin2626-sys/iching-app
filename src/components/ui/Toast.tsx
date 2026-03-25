"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useToastState, type ToastType } from "./useToast";

const typeStyles: Record<ToastType, string> = {
  success:
    "border-green-500/40 bg-green-950/60 text-green-300",
  error:
    "border-red-500/40 bg-red-950/60 text-red-300",
  info:
    "border-[var(--gold)]/40 bg-[var(--bg-card)] text-[var(--gold)]",
  warning:
    "border-orange-500/40 bg-orange-950/60 text-orange-300",
};

const icons: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  info: "☰",
  warning: "⚠",
};

export default function Toast() {
  const { toasts, dismiss } = useToastState();

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={[
              "pointer-events-auto",
              "flex items-center gap-2 px-5 py-3 rounded-[8px] border",
              "backdrop-blur-[8px] shadow-[0_4px_24px_rgba(0,0,0,0.4)]",
              "text-sm min-w-[260px] max-w-[420px]",
              typeStyles[t.type],
            ].join(" ")}
            role="alert"
            onClick={() => dismiss(t.id)}
          >
            <span className="text-base leading-none">{icons[t.type]}</span>
            <span className="flex-1">{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
