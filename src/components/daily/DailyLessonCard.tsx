"use client";

import { useTranslations } from "next-intl";
import type { School } from "@/lib/daily-lesson";
import Card from "@/components/ui/Card";

/* ── Types ── */

export interface LessonData {
  slug: string;
  title: string;
  subtitle: string;
  classicText: string;
  wisdom: string;
  action: string;
  caution: string | null;
  meditation: string | null;
  sourceRef: string | null;
  hexagram?: { number: number; nameZh: string; nature: string | null } | null;
}

interface DailyLessonCardProps {
  lesson: LessonData;
  school: School;
  dayIndex: number;
}

/* ── Nature badge config ── */

function getNatureConfig(t: ReturnType<typeof useTranslations<"Daily">>): Record<string, {
  emoji: string;
  label: string;
  borderColor: string;
  bgColor: string;
  text: string;
}> {
  return {
    ji: {
      emoji: "⚠️",
      label: t("natureJi"),
      borderColor: "var(--color-gold)",
      bgColor: "rgba(184,146,74,0.08)",
      text: t("natureJiDesc"),
    },
    xiong: {
      emoji: "🛡️",
      label: t("natureXiong"),
      borderColor: "#f87171",
      bgColor: "rgba(220,38,38,0.06)",
      text: t("natureXiongDesc"),
    },
    mixed: {
      emoji: "⚖️",
      label: t("natureMixed"),
      borderColor: "#f59e0b",
      bgColor: "rgba(245,158,11,0.06)",
      text: t("natureMixedDesc"),
    },
  };
}

/* ── Reading time estimate ── */

function estimateReadingTime(text: string): number {
  // Chinese: ~400 chars/min
  return Math.max(1, Math.ceil(text.length / 400));
}

/* ── Component ── */

export default function DailyLessonCard({ lesson, school, dayIndex }: DailyLessonCardProps) {
  const t = useTranslations("Daily");
  const fullText = lesson.classicText + lesson.wisdom + lesson.action + (lesson.caution ?? "") + (lesson.meditation ?? "");
  const readMin = estimateReadingTime(fullText);
  const nature = lesson.hexagram?.nature;
  const NATURE_CONFIG = getNatureConfig(t);
  const natureInfo = nature && nature !== "ping" ? NATURE_CONFIG[nature] : null;

  return (
    <Card variant="default" padding="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p
              className="text-xl"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)" }}
            >
              {t("cardHeader", { dayIndex, title: lesson.title })}
            </p>
            {lesson.subtitle && (
              <p
                className="text-lg mt-1"
                style={{ color: "var(--theme-text-secondary)" }}
              >
                「{lesson.subtitle}」
              </p>
            )}
          </div>
          <span
            className="text-xs whitespace-nowrap mt-1"
            style={{ color: "var(--theme-text-muted)" }}
          >
            {t("readingTime", { readMin })}
          </span>
        </div>

        {/* Divider */}
        <div className="divider-gold" />

        {school === "yijing" ? (
          <YijingContent lesson={lesson} t={t} />
        ) : (
          <DaoistContent lesson={lesson} t={t} />
        )}

        {/* Nature warning */}
        {natureInfo && (
          <div
            className="rounded-lg p-4"
            role="note"
            aria-label={t("natureLabel")}
            style={{
              borderLeft: `2px solid ${natureInfo.borderColor}`,
              backgroundColor: natureInfo.bgColor,
            }}
          >
            <p
              className="text-sm font-semibold mb-1"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {natureInfo.emoji} {natureInfo.label}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--theme-text-secondary)" }}>
              {natureInfo.text}
            </p>
          </div>
        )}

        {/* Source ref */}
        {lesson.sourceRef && (
          <p className="text-xs text-right" style={{ color: "var(--theme-text-muted)" }}>
            —— {lesson.sourceRef}
          </p>
        )}
      </div>
    </Card>
  );
}

/* ── Yijing layout ── */

function YijingContent({ lesson, t }: { lesson: LessonData; t: ReturnType<typeof useTranslations<"Daily">> }) {
  return (
    <div className="space-y-5">
      {/* Classic text */}
      <Section emoji="📜" title={t("sectionOriginal")}>
        <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--theme-text-primary)" }}>
          {lesson.classicText}
        </p>
      </Section>

      {/* Wisdom */}
      <Section emoji="💡" title={t("sectionWisdom")}>
        <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--theme-text-primary)" }}>
          {lesson.wisdom}
        </p>
      </Section>

      {/* Action */}
      <Section emoji="🎯" title={t("sectionAction")}>
        <p className="text-sm leading-relaxed" style={{ color: "var(--theme-text-primary)" }}>
          {lesson.action}
        </p>
      </Section>

      {/* Caution */}
      {lesson.caution && (
        <Section emoji="🔍" title={t("sectionBlindSpot")}>
          <p className="text-sm leading-relaxed" style={{ color: "var(--theme-text-primary)" }}>
            {lesson.caution}
          </p>
        </Section>
      )}
    </div>
  );
}

/* ── Daoist layout ── */

function DaoistContent({ lesson, t }: { lesson: LessonData; t: ReturnType<typeof useTranslations<"Daily">> }) {
  return (
    <div className="space-y-5">
      {/* Classic text */}
      <Section emoji="📜" title={t("sectionOriginal")}>
        <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--theme-text-primary)" }}>
          {lesson.classicText}
        </p>
      </Section>

      {/* Meditation guide */}
      {lesson.meditation && (
        <div
          className="rounded-lg p-5"
          style={{ backgroundColor: "rgba(184,146,74,0.05)" }}
        >
          <p
            className="text-sm font-semibold mb-3"
            style={{ color: "var(--color-gold)" }}
          >
            {t("sectionMeditation")}
          </p>
          <p
            className="text-sm leading-loose italic whitespace-pre-line"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            {lesson.meditation}
          </p>
        </div>
      )}

      {/* Daily insight */}
      <Section emoji="🌿" title={t("sectionInsight")}>
        <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--theme-text-primary)" }}>
          {lesson.wisdom}
        </p>
      </Section>

      {/* Action */}
      <Section emoji="🎯" title={t("sectionAction")}>
        <p className="text-sm leading-relaxed" style={{ color: "var(--theme-text-primary)" }}>
          {lesson.action}
        </p>
      </Section>
    </div>
  );
}

/* ── Shared section wrapper ── */

function Section({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-base font-semibold mb-2" style={{ color: "var(--theme-text-primary)" }}>
        {emoji} {title}
      </p>
      {children}
    </div>
  );
}
