"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

interface ReviewPanelProps {
  divinationId: string;
  initialScore?: number | null;
  initialNote?: string | null;
  initialFulfilled?: boolean | null;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function ReviewPanel({
  divinationId,
  initialScore,
  initialNote,
  initialFulfilled,
  onSuccess,
  onClose,
}: ReviewPanelProps) {
  const t = useTranslations("Review");
  const [score, setScore] = useState<number>(initialScore ?? 0);
  const [note, setNote] = useState(initialNote ?? "");
  const [fulfilled, setFulfilled] = useState(initialFulfilled ?? false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (score === 0) return;
    setSubmitting(true);
    setError("");
    try {
      const reviewRes = await fetch(`/api/divination/${divinationId}/review`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accuracyScore: score, reviewNote: note || undefined }),
      });
      if (!reviewRes.ok) throw new Error("review failed");

      if (fulfilled) {
        const fulfillRes = await fetch(`/api/divination/${divinationId}/fulfill`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fulfilled: true }),
        });
        if (!fulfillRes.ok) throw new Error("fulfill failed");
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
      }, 1200);
    } catch {
      setError("提交失败，请重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="relative rounded-2xl border border-[var(--color-gold)]/20 bg-[var(--theme-bg-card-solid)] p-6 shadow-2xl"
      style={{ boxShadow: "0 0 40px rgba(201,169,110,0.08)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-title text-xl text-[var(--color-gold-bright)] tracking-wider">
          {t("title")}
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-zinc-600 hover:text-zinc-400 transition-colors text-lg leading-none"
          >
            ✕
          </button>
        )}
      </div>

      {/* Star rating */}
      <div className="mb-5">
        <p className="text-sm text-zinc-500 mb-3">{t("accuracyLabel")}</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => {
            const active = star <= (hoveredStar || score);
            return (
              <button
                key={star}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setScore(star)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill={active ? "var(--color-gold)" : "none"}
                  stroke={active ? "var(--color-gold)" : "#3f3f46"}
                  strokeWidth="1.5"
                >
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              </button>
            );
          })}
        </div>
      </div>

      {/* Note textarea */}
      <div className="mb-5">
        <p className="text-sm text-zinc-500 mb-2">{t("noteLabel")}</p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 500))}
          placeholder={t("notePlaceholder")}
          rows={4}
          className="w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-4 py-3 text-sm text-[var(--theme-text-primary)] resize-none focus:outline-none focus:border-[var(--color-gold)]/50 transition-colors"
        />
        <p className="text-right text-xs text-zinc-700 mt-1">{note.length}/500</p>
      </div>

      {/* Fulfill toggle */}
      <div className="mb-6">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5 flex-shrink-0">
            <input
              type="checkbox"
              checked={fulfilled}
              onChange={(e) => setFulfilled(e.target.checked)}
              className="sr-only"
            />
            <div
              className={[
                "w-10 h-6 rounded-full transition-colors duration-300",
                fulfilled ? "bg-cinnabar" : "bg-zinc-800",
              ].join(" ")}
            />
            <div
              className={[
                "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300",
                fulfilled ? "translate-x-5" : "translate-x-1",
              ].join(" ")}
            />
          </div>
          <div>
            <p className="text-sm text-zinc-300 group-hover:text-zinc-200 transition-colors">
              {t("fulfillLabel")}
            </p>
            <p className="text-xs text-zinc-600 mt-0.5">{t("fulfillDesc")}</p>
          </div>
        </label>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400 mb-4">{error}</p>
      )}

      {/* Submit */}
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 py-3 text-[var(--color-gold)]"
          >
            <span className="text-lg">✓</span>
            <span className="text-sm">{t("submitSuccess")}</span>
          </motion.div>
        ) : (
          <motion.button
            key="submit"
            onClick={handleSubmit}
            disabled={score === 0 || submitting}
            className={[
              "w-full py-3 rounded-xl text-sm font-medium transition-all duration-300",
              score > 0 && !submitting
                ? "bg-cinnabar hover:bg-cinnabar-bright text-white shadow-[0_0_20px_rgba(139,37,0,0.3)]"
                : "bg-zinc-800 text-zinc-600 cursor-not-allowed",
            ].join(" ")}
          >
            {submitting ? "提交中..." : t("submitButton")}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
