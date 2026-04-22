"use client";

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

const NATURE_CONFIG: Record<string, {
  emoji: string;
  label: string;
  borderColor: string;
  bgColor: string;
  text: string;
}> = {
  ji: {
    emoji: "⚠️",
    label: "过盛则衰",
    borderColor: "var(--color-gold)",
    bgColor: "rgba(184,146,74,0.08)",
    text: "顺势而为固然好，但也要警惕盛极而衰。保持谦逊，不因一时顺利而忘形。",
  },
  xiong: {
    emoji: "🛡️",
    label: "化险为夷",
    borderColor: "#f87171",
    bgColor: "rgba(220,38,38,0.06)",
    text: "困境中蕴含转机。不必恐惧，关键在于识别风险、主动调整，化被动为主动。",
  },
  mixed: {
    emoji: "⚖️",
    label: "吉凶参半",
    borderColor: "#f59e0b",
    bgColor: "rgba(245,158,11,0.06)",
    text: "吉凶并存，关键在于把握分寸。趋吉避凶，需要你在行动中保持觉察。",
  },
};

/* ── Reading time estimate ── */

function estimateReadingTime(text: string): number {
  // Chinese: ~400 chars/min
  return Math.max(1, Math.ceil(text.length / 400));
}

/* ── Component ── */

export default function DailyLessonCard({ lesson, school, dayIndex }: DailyLessonCardProps) {
  const fullText = lesson.classicText + lesson.wisdom + lesson.action + (lesson.caution ?? "") + (lesson.meditation ?? "");
  const readMin = estimateReadingTime(fullText);
  const nature = lesson.hexagram?.nature;
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
              ☰ 第 {dayIndex} 天 · {lesson.title}
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
            约 {readMin} 分钟
          </span>
        </div>

        {/* Divider */}
        <div className="divider-gold" />

        {school === "yijing" ? (
          <YijingContent lesson={lesson} />
        ) : (
          <DaoistContent lesson={lesson} />
        )}

        {/* Nature warning */}
        {natureInfo && (
          <div
            className="rounded-lg p-4"
            role="note"
            aria-label="吉凶提醒"
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

function YijingContent({ lesson }: { lesson: LessonData }) {
  return (
    <div className="space-y-5">
      {/* Classic text */}
      <Section emoji="📜" title="经典原文">
        <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--theme-text-primary)" }}>
          {lesson.classicText}
        </p>
      </Section>

      {/* Wisdom */}
      <Section emoji="💡" title="今日智慧">
        <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--theme-text-primary)" }}>
          {lesson.wisdom}
        </p>
      </Section>

      {/* Action */}
      <Section emoji="🎯" title="行动建议">
        <p className="text-sm leading-relaxed" style={{ color: "var(--theme-text-primary)" }}>
          {lesson.action}
        </p>
      </Section>

      {/* Caution */}
      {lesson.caution && (
        <Section emoji="🔍" title="今日认知盲点">
          <p className="text-sm leading-relaxed" style={{ color: "var(--theme-text-primary)" }}>
            {lesson.caution}
          </p>
        </Section>
      )}
    </div>
  );
}

/* ── Daoist layout ── */

function DaoistContent({ lesson }: { lesson: LessonData }) {
  return (
    <div className="space-y-5">
      {/* Classic text */}
      <Section emoji="📜" title="经典原文">
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
            🧘 静心引导（约 2 分钟）
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
      <Section emoji="🌿" title="一日一悟">
        <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--theme-text-primary)" }}>
          {lesson.wisdom}
        </p>
      </Section>

      {/* Action */}
      <Section emoji="🎯" title="行动建议">
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
