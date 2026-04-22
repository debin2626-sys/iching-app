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
import { Link } from "@/i18n/navigation";

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

  return <ActiveView lunar={lunar} dayIndex={dayIndex} school={school} onSchoolChange={setSchool} />;
}

/* ── Pre-launch 倒计时页 ── */

function PreLaunchView({ launchDate, lunar }: { launchDate: string; lunar: LunarDateInfo }) {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="text-center space-y-3 pt-4">
        <p className="text-4xl">☯</p>
        <h1
          className="text-2xl"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)" }}
        >
          每日古典智慧
        </h1>
        <p className="text-lg" style={{ color: "var(--theme-text-secondary)" }}>
          即将开播
        </p>
      </div>

      {/* Countdown */}
      <Card variant="elevated" padding="lg">
        <p
          className="text-center text-sm mb-4"
          style={{ color: "var(--theme-text-secondary)" }}
        >
          距离开播还有
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
            🔔 抢先订阅
          </p>
          <p className="text-sm" style={{ color: "var(--theme-text-secondary)" }}>
            免费订阅，{launchDate.replace(/^(\d{4})-(\d{2})-(\d{2})$/, "$1年$2月$3日")}起
            <br />
            每天早上 8:00 收到一条古典智慧
          </p>
        </div>
        <EmailSubscribeForm cta="抢先订阅" />
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
            易经卦序
          </p>
          <p className="text-xs text-center mt-1" style={{ color: "var(--theme-text-muted)" }}>
            384天完整 · 卦辞+爻辞 · 决策智慧
          </p>
        </Card>
        <Card variant="default" padding="md">
          <p className="text-2xl text-center">☯</p>
          <p
            className="text-base text-center mt-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)" }}
          >
            道家清静
          </p>
          <p className="text-xs text-center mt-1" style={{ color: "var(--theme-text-muted)" }}>
            120天完整 · 经典+冥想 · 静心引导
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
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setLesson(null);
    fetch(`/api/daily?school=${school}`)
      .then(r => r.json())
      .then(data => {
        if (data.lesson) {
          setLesson(data.lesson);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [school]);

  return (
    <div className="space-y-8">
      <LunarDateHeader lunar={lunar} />
      <SchoolTabs active={school} onChange={onSchoolChange} />

      {loading ? (
        <Card variant="default" padding="lg">
          <div className="text-center space-y-4">
            <p className="text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}>
              ☰ 第 {dayIndex} 天
            </p>
            <Skeleton variant="text" lines={5} />
          </div>
        </Card>
      ) : lesson ? (
        <>
          <DailyLessonCard lesson={lesson} school={school} dayIndex={dayIndex} />
          {/* Link to permanent page */}
          <div className="text-center">
            <Link
              href={`/daily/${school}/${lesson.slug}`}
              className="text-sm transition-colors hover:text-[var(--color-gold)]"
              style={{ color: 'var(--theme-text-secondary)' }}
            >
              🔗 永久链接 · 分享此页
            </Link>
          </div>
        </>
      ) : (
        <Card variant="default" padding="lg">
          <div className="text-center space-y-4">
            <p className="text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}>
              ☰ 第 {dayIndex} 天
            </p>
            <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>
              {school === 'yijing' ? '易经卦序' : '道家清静'} · 内容准备中
            </p>
            <Skeleton variant="text" lines={5} />
          </div>
        </Card>
      )}

      <BrushDivider />

      <div className="space-y-3">
        <p className="text-sm text-center" style={{ color: 'var(--theme-text-secondary)' }}>
          🔔 免费订阅，每天早上 8:00 收到一条古典智慧
        </p>
        <EmailSubscribeForm />
      </div>

      <BrushDivider />
      <ComingSoonGrid />
    </div>
  );
}
