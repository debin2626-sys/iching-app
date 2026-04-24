"use client";

import { useState, useEffect } from "react";
import type { LunarDateInfo, School } from "@/lib/daily-lesson";
import Card from "@/components/ui/Card";
import BrushDivider from "@/components/ui/BrushDivider";
import CountdownTimer from "@/components/daily/CountdownTimer";
import LunarDateHeader from "@/components/daily/LunarDateHeader";
import SchoolTabs from "@/components/daily/SchoolTabs";
import EmailSubscribeForm from "@/components/daily/EmailSubscribeForm";
import ComingSoonGrid from "@/components/daily/ComingSoonGrid";
import { Skeleton } from "@/components/ui/Skeleton";
import DailyLessonCard from "@/components/daily/DailyLessonCard";
import type { LessonData } from "@/components/daily/DailyLessonCard";
import DailySharePoster from "@/components/daily/DailySharePoster";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface Props {
  initialStatus: "active" | "not_launched";
  launchDate: string;
  lunar: LunarDateInfo;
  dayIndex: number;
}

export default function DailyPageClient({
  initialStatus,
  launchDate,
  lunar,
  dayIndex,
}: Props) {
  const [school, setSchool] = useState<School>("yijing");

  if (initialStatus === "not_launched") {
    return <PreLaunchView launchDate={launchDate} lunar={lunar} />;
  }

  return <ActiveView key={school} lunar={lunar} dayIndex={dayIndex} school={school} onSchoolChange={setSchool} />;
}

/* ── Pre-launch 倒计时页 ── */

function PreLaunchView({ launchDate, lunar }: { launchDate: string; lunar: LunarDateInfo }) {
  const t = useTranslations('Daily');
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="text-center space-y-3 pt-4">
        <p className="text-4xl">☯</p>
        <h1
          className="text-2xl"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)" }}
        >
          {t('preLaunchTitle')}
        </h1>
        <p className="text-lg" style={{ color: "var(--theme-text-secondary)" }}>
          {t('preLaunchSubtitle')}
        </p>
      </div>

      {/* Countdown */}
      <Card variant="elevated" padding="lg">
        <p
          className="text-center text-sm mb-4"
          style={{ color: "var(--theme-text-secondary)" }}
        >
          {t('preLaunchCountdown')}
        </p>
        <CountdownTimer targetDate={launchDate} />
      </Card>

      <BrushDivider />

      {/* Subscribe */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <p
            className="text-base"
            style={{ fontFamily: "var(--font-display)", color: "var(--theme-text-primary)" }}
          >
            {t('preLaunchSubscribeTitle')}
          </p>
          <p className="text-sm" style={{ color: "var(--theme-text-secondary)" }}>
            {t('preLaunchSubscribeDesc', { date: launchDate.replace(/^(\d{4})-(\d{2})-(\d{2})$/, "$1年$2月$3日") })}
          </p>
        </div>
        <EmailSubscribeForm cta={t('preLaunchSubscribeCta')} />
      </div>

      <BrushDivider />

      {/* School preview cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card variant="default" padding="md">
          <p className="text-2xl text-center">☰</p>
          <p
            className="text-base text-center mt-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)" }}
          >
            {t('previewYijing')}
          </p>
          <p className="text-xs text-center mt-1" style={{ color: "var(--theme-text-muted)" }}>
            {t('previewYijingDesc')}
          </p>
        </Card>
        <Card variant="default" padding="md">
          <p className="text-2xl text-center">☯</p>
          <p
            className="text-base text-center mt-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)" }}
          >
            {t('previewDaoist')}
          </p>
          <p className="text-xs text-center mt-1" style={{ color: "var(--theme-text-muted)" }}>
            {t('previewDaoistDesc')}
          </p>
        </Card>
      </div>

      <BrushDivider />

      {/* Coming soon schools */}
      <ComingSoonGrid />
    </div>
  );
}

/* ── Active 日课页（有内容后） ── */

function ActiveView({ lunar, dayIndex, school, onSchoolChange }: { lunar: LunarDateInfo; dayIndex: number; school: School; onSchoolChange: (s: School) => void }) {
  const t = useTranslations('Daily');
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/daily?school=${school}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        setLesson(data.lesson ?? null);
      })
      .catch(() => {
        if (!cancelled) setLesson(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [school]);

  return (
    <div className="space-y-8">
      <LunarDateHeader lunar={lunar} />
      <SchoolTabs active={school} onChange={onSchoolChange} />

      {loading ? (
        <Card variant="default" padding="lg">
          <div className="text-center space-y-4">
            <p className="text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}>
              {t('loadingHeader', { dayIndex })}
            </p>
            <Skeleton variant="text" lines={5} />
          </div>
        </Card>
      ) : lesson ? (
        <>
          <DailyLessonCard lesson={lesson} school={school} dayIndex={dayIndex} />

          {/* Share poster */}
          <DailySharePoster
            lesson={lesson}
            date={lunar.solarDisplay.replace(/[年月]/g, ".").replace("日", "")}
          />

          {/* Link to permanent page */}
          <div className="text-center">
            <Link
              href={`/daily/${school}/${lesson.slug}`}
              className="text-sm transition-colors hover:text-[var(--color-gold)]"
              style={{ color: 'var(--theme-text-secondary)' }}
            >
              {t('permalink')}
            </Link>
          </div>
        </>
      ) : (
        <Card variant="default" padding="lg">
          <div className="text-center space-y-4">
            <p className="text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}>
              {t('errorHeader', { dayIndex })}
            </p>
            <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>
              {school === 'yijing' ? t('errorYijing') : t('errorDaoist')}{t('errorPreparing')}
            </p>
            <Skeleton variant="text" lines={5} />
          </div>
        </Card>
      )}

      <BrushDivider />

      <div className="space-y-3">
        <p className="text-sm text-center" style={{ color: 'var(--theme-text-secondary)' }}>
          {t('subscribePrompt')}
        </p>
        <EmailSubscribeForm school={school} />
      </div>

      <BrushDivider />
      <ComingSoonGrid />
    </div>
  );
}
