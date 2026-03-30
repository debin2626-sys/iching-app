"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { SHI_CHEN_LABELS } from "@/lib/iching/bazi";
import { PageLayout, TextArea, Select, Card } from "@/components/ui";
import { Coins, Sparkles, BookOpen } from "lucide-react";
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
  const locale = useLocale();
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
      icon: <Coins size={48} className="text-gold" strokeWidth={1.5} />,
      title: t("feature1Title"),
      desc: t("feature1Desc"),
      href: "/divination" as const,
    },
    {
      icon: <Sparkles size={48} className="text-gold" strokeWidth={1.5} />,
      title: t("feature2Title"),
      desc: t("feature2Desc"),
      href: "/divination" as const,
    },
    {
      icon: <BookOpen size={48} className="text-gold" strokeWidth={1.5} />,
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
      <section className="hero-grid flex-1 flex flex-col items-center justify-center min-h-screen px-4 text-center relative -mx-4 sm:-mx-6 lg:-mx-8 py-32">
        {/* Spotlight 光效 */}
        <div className="hero-spotlight" />

        {/* 装饰八卦符号 */}
        <div className="absolute top-32 left-[10%] text-amber-500/10 text-6xl animate-twinkle select-none hidden md:block">
          ☰
        </div>
        <div className="absolute bottom-32 right-[10%] text-amber-500/10 text-6xl animate-twinkle-slow select-none hidden md:block">
          ☷
        </div>

        {/* 太极符号 */}
        <AnimatedTaichi>
          <div className="taichi-rotate mb-12">
            <div className="taichi-symbol" />
          </div>
        </AnimatedTaichi>

        {/* 主标题 */}
        <AnimatedTitle
          className="font-title text-7xl sm:text-8xl md:text-9xl font-bold tracking-wider text-gold-gradient text-gold-breathe mb-8 relative z-10"
          style={{ textShadow: '0 0 40px rgba(201,169,110,0.3), 0 0 80px rgba(201,169,110,0.15)' }}
        >
          {t("title")}
        </AnimatedTitle>

        {/* 副标题 */}
        <AnimatedSubtitle className="glow-text text-xl sm:text-2xl md:text-3xl tracking-[0.3em] mb-16 font-title opacity-80 relative z-10" delay={0.3}>
          {t("subtitle")}
        </AnimatedSubtitle>

        {/* 中式分隔线 */}
        <div className="flex items-center justify-center gap-4 my-8 opacity-30 w-40 mb-12 relative z-10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          <span className="text-gold text-lg">☯</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/40 to-transparent" />
        </div>

        {/* ═══ 快速占卜区域 ═══ */}
        <AnimatedCTA className="w-full max-w-2xl relative z-10">
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
          <button
            onClick={handleStart}
            disabled={!question.trim()}
            className="w-full font-title tracking-wider h-14 px-12 text-lg rounded-lg bg-transparent text-[#c9a96e] border border-[rgba(201,169,110,0.5)] transition-all duration-[400ms] ease-in-out hover:border-[rgba(201,169,110,0.8)] hover:shadow-[0_0_15px_rgba(201,169,110,0.4)] hover:text-[#e8d5a3] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t("startButton")}
          </button>
        </AnimatedCTA>

        {/* 底部装饰 - 滚动卦象 */}
        <div className="mt-20 overflow-hidden w-full max-w-md opacity-25 relative z-10">
          <div className="flex whitespace-nowrap animate-marquee">
            <span className="text-amber-600 text-xs tracking-[0.5em] inline-block">
              ䷀ ䷁ ䷂ ䷃ ䷄ ䷅ ䷆ ䷇ ䷈ ䷉ ䷊ ䷋&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <span className="text-amber-600 text-xs tracking-[0.5em] inline-block">
              ䷀ ䷁ ䷂ ䷃ ䷄ ䷅ ䷆ ䷇ ䷈ ䷉ ䷊ ䷋&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          </div>
        </div>
      </section>

      {/* ═══ 特色区域 ═══ */}
      <section className="px-4 py-48 relative -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="flex items-center justify-center gap-4 opacity-30 w-48 mx-auto mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          <span className="text-gold text-lg">☯</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/40 to-transparent" />
        </div>
        <p className="text-center text-amber-400/50 text-base tracking-[0.3em] mb-24 font-title">
          {t("featuresTitle")}
        </p>

        <AnimatedFeatureGrid className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-14">
          {features.map((f) => (
            <AnimatedFeatureCard key={f.title}>
              <Link href={f.href}>
                <Card
                  variant="interactive"
                  padding="lg"
                  className="card-glow text-center group min-h-[300px] flex flex-col items-center justify-center p-10 !bg-[rgba(201,169,110,0.05)]"
                >
                  <div className="mb-8 group-hover:scale-110 transition-transform duration-300">
                    {f.icon}
                  </div>
                  <h3 className="font-title text-2xl font-semibold text-gray-100 mb-5 group-hover:text-amber-200 transition-colors">
                    {f.title}
                  </h3>
                  <div className="flex items-center justify-center gap-3 opacity-30 w-14 mx-auto mb-5">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                    <span className="text-gold text-xs">✦</span>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/40 to-transparent" />
                  </div>
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
      <footer className="py-20 px-4 text-center -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="flex items-center justify-center gap-4 opacity-30 w-24 mx-auto mb-10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          <span className="text-gold text-sm">☯</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/40 to-transparent" />
        </div>
        <p className="text-gold/60 text-sm tracking-[0.2em] font-title mb-6">
          {t("footerQuote")}
        </p>
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
