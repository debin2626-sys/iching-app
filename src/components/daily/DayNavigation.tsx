"use client";

import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { School } from "@/lib/daily-lesson";
import { CYCLES } from "@/lib/daily-lesson";

interface DayNavigationProps {
  school: School;
  currentDayIndex: number;
  /** Slug for previous day (null if day 1) */
  prevSlug: string | null;
  /** Slug for next day (null if last day or not yet published) */
  nextSlug: string | null;
  /** Total available lessons */
  totalLessons: number;
}

const SCHOOL_PREFIX: Record<School, string> = {
  yijing: "/daily/yijing",
  daoist: "/daily/daoist",
};

export default function DayNavigation({
  school,
  currentDayIndex,
  prevSlug,
  nextSlug,
  totalLessons,
}: DayNavigationProps) {
  const prefix = SCHOOL_PREFIX[school];
  const cycle = CYCLES[school];

  return (
    <nav
      aria-label="日课导航"
      className="flex items-center justify-between"
    >
      {/* Prev */}
      {prevSlug ? (
        <Link
          href={`${prefix}/${prevSlug}`}
          className="flex items-center gap-1 text-sm transition-colors hover:text-[var(--color-gold)]"
          style={{ color: "var(--theme-text-secondary)" }}
        >
          <ChevronLeft size={16} />
          <span>上一天</span>
        </Link>
      ) : (
        <span className="text-sm" style={{ color: "var(--theme-text-muted)", opacity: 0.4 }}>
          <ChevronLeft size={16} className="inline" /> 上一天
        </span>
      )}

      {/* Center: progress */}
      <span className="text-xs" style={{ color: "var(--theme-text-muted)" }}>
        {currentDayIndex} / {cycle}
        {totalLessons < cycle && (
          <span className="ml-1">（已发布 {totalLessons} 天）</span>
        )}
      </span>

      {/* Next */}
      {nextSlug ? (
        <Link
          href={`${prefix}/${nextSlug}`}
          className="flex items-center gap-1 text-sm transition-colors hover:text-[var(--color-gold)]"
          style={{ color: "var(--theme-text-secondary)" }}
        >
          <span>下一天</span>
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span className="text-sm" style={{ color: "var(--theme-text-muted)", opacity: 0.4 }}>
          下一天 <ChevronRight size={16} className="inline" />
        </span>
      )}
    </nav>
  );
}
