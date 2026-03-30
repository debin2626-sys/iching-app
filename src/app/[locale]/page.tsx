"use client";


import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { SHI_CHEN_LABELS } from "@/lib/iching/bazi";
import { PageLayout, TextArea, Select, Card, Button } from "@/components/ui";
import {
  AnimatedTaichi,
  AnimatedTitle,
  AnimatedSubtitle,
  AnimatedCTA,
  AnimatedFeatureGrid,
  AnimatedFeatureCard,
} from "@/components/home/HeroAnimations";

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
  const [gender, setGender] = useState<"" | "male" | "female">("");
  const [showBirth, setShowBirth] = useState(false);

  const hasBirthInfo = birthYear && birthMonth && birthDay && birthHour;

  const navItems = [
    { label: tNav("divination"), href: "/", icon: <span>🔮</span> },
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
    if (gender) {
      params.set("gender", gender);
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
        <AnimatedTaichi>
          <div className="taichi-rotate mb-10">
            <div className="taichi-symbol" />
          </div>
        </AnimatedTaichi>

        {/* 主标题 */}
        <AnimatedTitle className="font-title text-6xl sm:text-7xl md:text-8xl font-bold tracking-wider text-gold-glow mb-6">
          {t("title")}
        </AnimatedTitle>

        {/* 副标题 */}
        <AnimatedSubtitle className="glow-text text-xl sm:text-2xl tracking-[0.25em] mb-3 font-title opacity-80" delay={0.5}>
          {t("subtitle")}
        </AnimatedSubtitle>
        <AnimatedSubtitle className="text-gray-400 text-sm sm:text-base tracking-widest mb-14" delay={0.6}>
          {t("subtitleEn")}
        </AnimatedSubtitle>

        {/* 分割线 */}
        <div className="divider-gold w-40 mb-10" />

        {/* ═══ 快速占卜区域 ═══ */}
        <AnimatedCTA className="w-full max-w-2xl">
          {/* 问题输入 */}
          <Card className="mb-5">
            <TextArea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t("placeholder")}
              rows={3}
              className="font-title text-base"
            />
          </Card>

          {/* 生辰折叠区 */}
          <Card className="overflow-hidden mb-8" padding="sm">
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

                {/* 性别选择 */}
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">{t("genderLabel")}</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setGender(gender === "male" ? "" : "male")}
                      className={`flex-1 py-1.5 rounded-lg text-sm font-title tracking-wide transition-all duration-300 border ${
                        gender === "male"
                          ? "border-amber-400/60 bg-amber-400/10 text-amber-400"
                          : "border-white/10 bg-white/5 text-gray-500 hover:border-white/20"
                      }`}
                    >
                      ♂ {t("genderMale")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender(gender === "female" ? "" : "female")}
                      className={`flex-1 py-1.5 rounded-lg text-sm font-title tracking-wide transition-all duration-300 border ${
                        gender === "female"
                          ? "border-amber-400/60 bg-amber-400/10 text-amber-400"
                          : "border-white/10 bg-white/5 text-gray-500 hover:border-white/20"
                      }`}
                    >
                      ♀ {t("genderFemale")}
                    </button>
                  </div>
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
            className="w-full font-title tracking-wider !h-14 !px-12 !text-lg"
            style={{ boxShadow: '0 0 30px rgba(212,165,116,0.2), 0 0 60px rgba(212,165,116,0.1)' }}
          >
            {t("startButton")}
          </Button>
        </AnimatedCTA>

        {/* 底部装饰 */}
        <div className="mt-16 flex items-center gap-3 animate-pulse-glow">
          <span className="text-amber-600/40 text-xs tracking-[0.5em]">
            ䷀ ䷁ ䷂ ䷃ ䷄ ䷅
          </span>
        </div>
      </section>

      {/* ═══ 特色区域 ═══ */}
      <section className="px-4 py-40 relative -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="divider-gold w-48 mx-auto mb-8" />
        <p className="text-center text-amber-400/50 text-base tracking-[0.3em] mb-20 font-title">
          {t("featuresTitle")}
        </p>

        <AnimatedFeatureGrid className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-14">
          {features.map((f) => (
            <AnimatedFeatureCard key={f.title}>
              <Link href={f.href}>
                <Card
                  variant="interactive"
                  padding="lg"
                  className="text-center group min-h-[300px] flex flex-col items-center justify-center p-10"
                >
                  <div className="text-7xl mb-8 group-hover:scale-110 transition-transform duration-300">
                    {f.emoji}
                  </div>
                  <h3 className="font-title text-2xl font-semibold text-gray-100 mb-5 group-hover:text-amber-200 transition-colors">
                    {f.title}
                  </h3>
                  <div className="divider-gold w-14 mx-auto mb-5" />
                  <p className="text-base text-gray-400 tracking-wider leading-relaxed group-hover:text-gray-300 transition-colors whitespace-pre-line">
                    {f.desc}
                  </p>
                </Card>
              </Link>
            </AnimatedFeatureCard>
          ))}
        </AnimatedFeatureGrid>
      </section>

      {/* ═══ 底部 ═══ */}
      <footer className="py-16 px-4 text-center -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="divider-gold w-24 mx-auto mb-10" />
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
