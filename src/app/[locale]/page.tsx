"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { SHI_CHEN_LABELS } from "@/lib/iching/bazi";
import { PageLayout, TextArea, Select, Card, Button } from "@/components/ui";

const YEARS = Array.from({ length: 87 }, (_, i) => 1940 + i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export default function Home() {
  const t = useTranslations("Home");
  const tNav = useTranslations("Nav");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthHour, setBirthHour] = useState("");
  const [showBirth, setShowBirth] = useState(false);

  const hasBirthInfo = birthYear && birthMonth && birthDay && birthHour;

  const navItems = [
    { label: tNav("home"), href: "/", icon: <span>🏠</span> },
    { label: tNav("divination"), href: "/divination", icon: <span>🔮</span> },
    { label: tNav("hexagrams"), href: "/hexagrams", icon: <span>📖</span> },
    { label: tNav("history"), href: "/history", icon: <span>📜</span> },
  ];

  const features = [
    {
      emoji: "🎲",
      title: t("feature1Title"),
      desc: t("feature1Desc"),
      href: "/divination" as const,
    },
    {
      emoji: "🤖",
      title: t("feature2Title"),
      desc: t("feature2Desc"),
      href: "/divination" as const,
    },
    {
      emoji: "📖",
      title: t("feature3Title"),
      desc: t("feature3Desc"),
      href: "/hexagrams" as const,
    },
  ];

  const handleStart = () => {
    if (!question.trim()) return;
    const params = new URLSearchParams({ question });
    if (hasBirthInfo) {
      params.set("by", birthYear);
      params.set("bm", birthMonth);
      params.set("bd", birthDay);
      params.set("bh", birthHour);
    }
    router.push(`/divination?${params.toString()}`);
  };

  return (
    <PageLayout navItems={navItems} maxWidth="max-w-full">
      {/* ═══ Hero 区域 ═══ */}
      <section className="flex-1 flex flex-col items-center justify-center min-h-screen px-4 text-center relative -mx-4 sm:-mx-6 lg:-mx-8">
        {/* 装饰八卦符号 */}
        <div className="absolute top-32 left-[10%] text-amber-500/10 text-6xl animate-twinkle select-none hidden md:block">
          ☰
        </div>
        <div className="absolute bottom-32 right-[10%] text-amber-500/10 text-6xl animate-twinkle-slow select-none hidden md:block">
          ☷
        </div>

        {/* 太极符号 */}
        <div className="taichi-rotate mb-8">
          <div className="taichi-symbol" />
        </div>

        {/* 主标题 */}
        <h1 className="font-title text-5xl sm:text-6xl md:text-7xl font-bold tracking-wider text-gold-glow mb-4">
          {t("title")}
        </h1>

        {/* 副标题 */}
        <p className="glow-text text-lg sm:text-xl tracking-[0.25em] mb-2 font-title opacity-80">
          {t("subtitle")}
        </p>
        <p className="text-gray-500 text-sm tracking-widest mb-10">
          {t("subtitleEn")}
        </p>

        {/* 分割线 */}
        <div className="divider-gold w-32 mb-8" />

        {/* ═══ 快速占卜区域 ═══ */}
        <div className="w-full max-w-lg">
          {/* 问题输入 */}
          <Card className="mb-4">
            <TextArea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t("placeholder")}
              rows={3}
              className="font-title"
            />
          </Card>

          {/* 生辰折叠区 */}
          <Card className="overflow-hidden mb-6" padding="sm">
            <button
              onClick={() => setShowBirth(!showBirth)}
              className="w-full flex items-center justify-between px-2 py-2 hover:bg-white/5 transition rounded-lg"
            >
              <span className="flex items-center gap-2 text-sm text-amber-400/70 font-title">
                🌙 {t("birthLabel")}
                <span className="text-xs text-gray-500">{t("birthHint")}</span>
              </span>
              <span className={`text-amber-400/40 text-xs transition-transform duration-300 ${showBirth ? "rotate-180" : ""}`}>▼</span>
            </button>
            {showBirth && (
              <div className="px-2 pb-3 pt-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Select
                    label={t("year")}
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    options={YEARS.map((y) => ({ value: String(y), label: `${y}` }))}
                    placeholder={t("yearPlaceholder")}
                    size="sm"
                  />
                  <Select
                    label={t("month")}
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(e.target.value)}
                    options={MONTHS.map((m) => ({ value: String(m), label: `${m}` }))}
                    placeholder={t("monthPlaceholder")}
                    size="sm"
                  />
                  <Select
                    label={t("day")}
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                    options={DAYS.map((d) => ({ value: String(d), label: `${d}` }))}
                    placeholder={t("dayPlaceholder")}
                    size="sm"
                  />
                  <Select
                    label={t("hour")}
                    value={birthHour}
                    onChange={(e) => setBirthHour(e.target.value)}
                    options={SHI_CHEN_LABELS.map((label, i) => ({ value: String(i), label }))}
                    placeholder={t("hourPlaceholder")}
                    size="sm"
                  />
                </div>
                {hasBirthInfo && (
                  <p className="text-xs text-amber-400/50 mt-3 tracking-wide">
                    {t("birthRecorded")}
                  </p>
                )}
              </div>
            )}
          </Card>

          {/* 开始按钮 */}
          <Button
            variant="primary"
            size="lg"
            onClick={handleStart}
            disabled={!question.trim()}
            className="w-full font-title tracking-wider"
          >
            {t("startButton")}
          </Button>
        </div>

        {/* 底部装饰 */}
        <div className="mt-12 flex items-center gap-3 animate-pulse-glow">
          <span className="text-amber-600/40 text-xs tracking-[0.5em]">
            ䷀ ䷁ ䷂ ䷃ ䷄ ䷅
          </span>
        </div>
      </section>

      {/* ═══ 特色区域 ═══ */}
      <section className="px-4 py-32 relative -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="divider-gold w-48 mx-auto mb-6" />
        <p className="text-center text-amber-400/40 text-sm tracking-[0.3em] mb-16 font-title">
          {t("featuresTitle")}
        </p>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12">
          {features.map((f) => (
            <Link key={f.title} href={f.href}>
              <Card
                variant="interactive"
                padding="lg"
                className="text-center group min-h-[260px] flex flex-col items-center justify-center"
              >
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {f.emoji}
                </div>
                <h3 className="font-title text-2xl font-semibold text-gray-100 mb-4 group-hover:text-amber-200 transition-colors">
                  {f.title}
                </h3>
                <div className="divider-gold w-12 mx-auto mb-4" />
                <p className="text-base text-gray-400 tracking-wider leading-relaxed group-hover:text-gray-300 transition-colors whitespace-pre-line">
                  {f.desc}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ 底部 ═══ */}
      <footer className="py-12 px-4 text-center -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="divider-gold w-24 mx-auto mb-8" />
        <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed opacity-60">
          {t("disclaimer")}
        </p>
        <p className="text-xs text-gray-700 mt-3 opacity-40">
          {tCommon("copyright", { year: new Date().getFullYear() })}
        </p>
      </footer>
    </PageLayout>
  );
}
