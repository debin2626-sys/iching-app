"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { LessonData } from "./DailyLessonCard";

interface DailySharePosterProps {
  lesson: LessonData;
  date: string; // e.g. "2026.05.01"
}

export default function DailySharePoster({ lesson, date }: DailySharePosterProps) {
  const t = useTranslations("Daily");
  const [showPreview, setShowPreview] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const posterUrl = buildPosterUrl(lesson, date);

  const handleDownload = useCallback(async () => {
    if (downloading) return;
    setDownloading(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(posterUrl, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error("fetch failed");

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `daily-wisdom-${date.replace(/\./g, "")}-51yijing.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // silent fail — user can retry
    } finally {
      setDownloading(false);
    }
  }, [posterUrl, date, downloading]);

  const handleShare = useCallback(async () => {
    if (!navigator.share) {
      // Fallback: copy URL
      try {
        await navigator.clipboard.writeText(window.location.href);
      } catch {
        // silent
      }
      return;
    }

    try {
      // Try sharing the image directly if possible
      const res = await fetch(posterUrl);
      if (res.ok) {
        const blob = await res.blob();
        const file = new File([blob], `daily-wisdom-${date}.png`, { type: "image/png" });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            title: t("shareTitle"),
            text: `${lesson.title} —— ${t("shareTitle")}`,
            files: [file],
          });
          return;
        }
      }
    } catch {
      // Fall through to URL share
    }

    try {
      await navigator.share({
        title: t("shareTitle"),
        text: `${lesson.title} —— ${t("shareTitle")}`,
        url: window.location.href,
      });
    } catch {
      // User cancelled or share failed
    }
  }, [posterUrl, date, lesson.title, t]);

  return (
    <div className="space-y-4">
      {/* Share button — gold outline (secondary) */}
      <button
        type="button"
        onClick={() => setShowPreview((v) => !v)}
        className="w-full py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200"
        style={{
          border: "1px solid var(--color-gold)",
          color: "var(--color-gold)",
          backgroundColor: showPreview ? "rgba(184,146,74,0.08)" : "transparent",
        }}
      >
        📤 {t("shareButton")}
      </button>

      {/* Poster preview + actions */}
      {showPreview && (
        <div
          className="rounded-lg p-4 space-y-4"
          style={{ backgroundColor: "rgba(184,146,74,0.04)" }}
        >
          {/* Preview image */}
          <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: "1242/1656" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posterUrl}
              alt={t("posterAlt")}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              style={{
                backgroundColor: "var(--color-gold)",
                color: "#fff",
              }}
            >
              {downloading ? t("posterDownloading") : t("posterDownload")}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors"
              style={{
                border: "1px solid var(--color-gold)",
                color: "var(--color-gold)",
              }}
            >
              {t("posterShare")}
            </button>
          </div>

          <p className="text-xs text-center" style={{ color: "var(--theme-text-muted)" }}>
            {t("posterHint")}
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Helper ── */

function buildPosterUrl(lesson: LessonData, date: string): string {
  const params = new URLSearchParams();
  params.set("quote", lesson.classicText.slice(0, 100)); // Truncate for URL safety
  if (lesson.sourceRef) params.set("source", lesson.sourceRef);
  if (lesson.title) params.set("book", lesson.title);
  if (lesson.action) params.set("advice", lesson.action.slice(0, 120));
  if (date) params.set("date", date);
  return `/api/daily-share-image?${params.toString()}`;
}
