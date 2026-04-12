"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Coins, Sparkles, BookOpen } from "lucide-react";
import { AnimatedTaichi } from "@/components/home/HeroAnimations";
import { NavBar } from "@/components/ui";
import { SHI_CHEN_LABELS } from "@/lib/iching/bazi";
import ScenarioSelector from "@/components/divination/ScenarioSelector";
import SampleReading from "@/components/home/SampleReading";
import { SampleReadingCardContent } from "@/components/home/SampleReadingContent";
import TodayCounter from "@/components/home/TodayCounter";
import UserReviews from "@/components/home/UserReviews";
import { DailyLimitBanner, useLocalDailyLimit } from "@/components/divination/DailyLimitBanner";
import { trackScenarioSelect, trackFunnelHomeView, trackFunnelStartClick, trackFunnelQuestionSubmit, trackFunnelBirthFill } from "@/lib/analytics";

const YEARS = Array.from({ length: 87 }, (_, i) => 1940 + i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export default function HomeContent() {
  const t = useTranslations("Home");
  const tNav = useTranslations("Nav");
  const router = useRouter();
  const locale = useLocale();
  const { showBanner, setShowBanner, checkAndIncrement, userId } = useLocalDailyLimit();

  const navItems = [
    { label: tNav("divination"), href: "/", icon: <span>🔮</span> },
    { label: tNav("hexagrams"), href: "/hexagrams", icon: <span>📖</span> },
    { label: tNav("history"), href: "/history", icon: <span>📜</span> },
  ];

  // ── funnel_home_view: 首页曝光 ──
  useEffect(() => {
    const url = new URL(window.location.href);
    trackFunnelHomeView({
      referrer: document.referrer || undefined,
      utm_source: url.searchParams.get("utm_source") || undefined,
      utm_medium: url.searchParams.get("utm_medium") || undefined,
    });
  }, []);

  const [question, setQuestion] = useState("");
  const [showBirth, setShowBirth] = useState(false);
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthHour, setBirthHour] = useState("");
  const [gender, setGender] = useState<"" | "male" | "female">("");
  const [isTyping, setIsTyping] = useState(false);
  const [scenarioId, setScenarioId] = useState("");
  const [subScenarioId, setSubScenarioId] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingRef = useRef(false);

  const hasBirthInfo = birthYear && birthMonth && birthDay && birthHour;

  /* Typewriter effect for scenario template */
  const typewriterFill = useCallback((text: string) => {
    if (typingRef.current) return;
    typingRef.current = true;
    setIsTyping(true);
    setQuestion("");
    let i = 0;
    const tick = () => {
      if (i < text.length) {
        setQuestion(text.slice(0, i + 1));
        i++;
        requestAnimationFrame(() => setTimeout(tick, 30));
      } else {
        typingRef.current = false;
        setIsTyping(false);
        textareaRef.current?.focus();
      }
    };
    tick();
  }, []);

  const handleScenarioSelect = useCallback(
    (template: string, sId: string, subId: string) => {
      setScenarioId(sId);
      setSubScenarioId(subId);
      trackScenarioSelect(sId, subId);
      typewriterFill(template);
    },
    [typewriterFill]
  );

  const handleStart = () => {
    if (!question.trim()) return;

    if (!checkAndIncrement()) {
        return;
    }

    // ── funnel_start_click ──
    trackFunnelStartClick({
      entry_type: scenarioId ? "scenario_select" : "direct_click",
      scenario: scenarioId || undefined,
      sub_scenario: subScenarioId || undefined,
    });

    // ── funnel_question_submit ──
    trackFunnelQuestionSubmit({
      question_length: question.trim().length,
      has_birth_info: !!hasBirthInfo,
      has_gender: !!gender,
      scenario: scenarioId || undefined,
      sub_scenario: subScenarioId || undefined,
    });

    // ── funnel_birth_fill（如有生辰信息） ──
    if (hasBirthInfo) {
      trackFunnelBirthFill({
        birth_year: birthYear,
        birth_hour: birthHour,
        gender: gender || "unknown",
      });
    }

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
    if (scenarioId) {
      params.set("scenario", scenarioId);
    }
    if (subScenarioId) {
      params.set("sub", subScenarioId);
    }
    router.push(`/divination?${params.toString()}`);
  };

  const inputStyle =
    "bg-[var(--theme-bg-card)] border border-[var(--theme-border)] rounded-xl text-[var(--theme-text-primary)] outline-none focus:border-gold/50 transition-colors";

  const features = [
    {
      icon: <Coins size={36} strokeWidth={1.5} className="text-gold mb-4" />,
      title: t("feature1Title"),
      desc: t("feature1Desc"),
    },
    {
      icon: <Sparkles size={36} strokeWidth={1.5} className="text-gold mb-4" />,
      title: t("feature2Title"),
      desc: t("feature2Desc"),
    },
    {
      icon: <BookOpen size={36} strokeWidth={1.5} className="text-gold mb-4" />,
      title: t("feature3Title"),
      desc: t("feature3Desc"),
    },
  ];

  return (
    <>
      <NavBar items={navItems} />
      <main className="min-h-screen w-full" style={{ backgroundColor: 'var(--theme-bg)' }}>
        <div className="w-full px-6" style={{ maxWidth: '768px', margin: '0 auto', paddingTop: '220px', paddingBottom: '80px' }}>
      {/* 太极图 */}
      <div className="flex justify-center">
        <AnimatedTaichi>
          <div className="taichi-rotate">
            <div className="taichi-symbol w-[80px] h-[80px] md:w-[100px] md:h-[100px]" />
          </div>
        </AnimatedTaichi>
      </div>

      {/* 主标题 */}
      <h1 className="mt-5 text-2xl md:text-3xl text-gold-gradient font-title font-bold text-center leading-tight">
        {t("title")}
      </h1>

      {/* 副标题 */}
      <p className="mt-4 text-xl text-[var(--theme-text-secondary)] text-center">
        {t("subtitle")}
      </p>

      {/* 今日咨询计数器 */}
      <div className="mt-8">
        <TodayCounter />
      </div>

      {/* 场景化入口 */}
      <div className="mt-10">
        <p className="text-sm text-[var(--theme-text-secondary)] text-center mb-3">{t("scenarioGuide")}</p>
        <ScenarioSelector onSelect={handleScenarioSelect} />
      </div>

      {/* 输入框 — with bracket highlighting overlay */}
      <div className="mt-8 relative">
        {/* Highlight overlay for brackets */}
        <div
          aria-hidden
          className="absolute inset-0 p-5 text-base pointer-events-none whitespace-pre-wrap break-words overflow-hidden"
          style={{ lineHeight: "1.5" }}
        >
          {question.split(/(\[[^\]]*\])/).map((part, idx) =>
            /^\[.*\]$/.test(part) ? (
              <span key={idx} className="text-gold font-semibold">
                {part}
              </span>
            ) : (
              <span key={idx} className="text-transparent">{part}</span>
            )
          )}
        </div>
        <textarea
          ref={textareaRef}
          value={question}
          onChange={(e) => {
            if (!isTyping) {
              setQuestion(e.target.value);
              // 用户手动输入时清除场景选择
              if (scenarioId) {
                setScenarioId("");
                setSubScenarioId("");
              }
            }
          }}
          placeholder={t("questionPlaceholder")}
          className={`w-full h-[120px] md:h-[140px] p-5 text-base resize-none ${inputStyle} placeholder:text-[var(--theme-text-secondary)]/50`}
          style={{ caretColor: "var(--color-gold)" }}
        />
      </div>

      {/* 出生时辰选择器 */}
      <div className="mt-4 w-full">
        <button
          type="button"
          onClick={() => setShowBirth(!showBirth)}
          className={`w-full h-12 px-4 flex items-center justify-between ${inputStyle} cursor-pointer`}
        >
          <span className="text-sm text-[var(--theme-text-secondary)]">
            🌙 {t("birthLabel")}
            <span className="text-xs text-gray-500 ml-2">{t("birthHint")}</span>
          </span>
          <span
            className={`text-[var(--theme-text-secondary)]/40 text-xs transition-transform duration-300 ${showBirth ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </button>

        {showBirth && (
          <div className="mt-2 p-4 bg-[var(--theme-bg-card)] border border-[var(--theme-border)] rounded-xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <select
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className={`h-10 px-3 text-sm ${inputStyle} ${!birthYear ? "text-[var(--theme-text-secondary)]/50" : ""}`}
              >
                <option value="">{t("yearPlaceholder")}</option>
                {YEARS.map((y) => (
                  <option key={y} value={String(y)}>
                    {y}
                  </option>
                ))}
              </select>
              <select
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                className={`h-10 px-3 text-sm ${inputStyle} ${!birthMonth ? "text-[var(--theme-text-secondary)]/50" : ""}`}
              >
                <option value="">{t("monthPlaceholder")}</option>
                {MONTHS.map((m) => (
                  <option key={m} value={String(m)}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                className={`h-10 px-3 text-sm ${inputStyle} ${!birthDay ? "text-[var(--theme-text-secondary)]/50" : ""}`}
              >
                <option value="">{t("dayPlaceholder")}</option>
                {DAYS.map((d) => (
                  <option key={d} value={String(d)}>
                    {d}
                  </option>
                ))}
              </select>
              <select
                value={birthHour}
                onChange={(e) => setBirthHour(e.target.value)}
                className={`h-10 px-3 text-sm ${inputStyle} ${!birthHour ? "text-[var(--theme-text-secondary)]/50" : ""}`}
              >
                <option value="">{t("hourPlaceholder")}</option>
                {SHI_CHEN_LABELS.map((label, i) => (
                  <option key={i} value={String(i)}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* 性别选择 */}
            <div className="mt-3 flex gap-3">
              <button
                type="button"
                onClick={() => setGender(gender === "male" ? "" : "male")}
                className={`flex-1 py-1.5 rounded-lg text-sm font-title tracking-wide transition-all duration-300 border ${
                  gender === "male"
                    ? "border-gold/60 bg-gold/10 text-gold"
                    : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] text-gray-500 hover:border-[rgba(255,255,255,0.2)]"
                }`}
              >
                ♂ {t("genderMale")}
              </button>
              <button
                type="button"
                onClick={() => setGender(gender === "female" ? "" : "female")}
                className={`flex-1 py-1.5 rounded-lg text-sm font-title tracking-wide transition-all duration-300 border ${
                  gender === "female"
                    ? "border-gold/60 bg-gold/10 text-gold"
                    : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] text-gray-500 hover:border-[rgba(255,255,255,0.2)]"
                }`}
              >
                ♀ {t("genderFemale")}
              </button>
            </div>

            {hasBirthInfo && (
              <p className="text-xs text-gold/50 mt-3 tracking-wide">
                {t("birthRecorded")}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 开始摇卦按钮 */}
      <div className="mt-6 relative">
        <p className="text-center text-xs text-gold/50 mb-2">
          {t("tossingHint")}
        </p>
        <button
          onClick={handleStart}
          disabled={!question.trim()}
          className="w-full h-[56px] bg-gradient-to-br from-gold to-gold-dim text-bg text-lg rounded-[14px] font-bold font-title tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(201,169,110,0.3)] hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(201,169,110,0.4)] disabled:opacity-35 disabled:shadow-none disabled:cursor-not-allowed"
          style={question.trim() ? { animation: 'pulse-glow 2.5s ease-in-out infinite' } : undefined}
        >
          {t("startButton")}
        </button>
      </div>

      {/* 三大核心功能标题 */}
      <div className="mt-32">
      <h2 className="text-xl text-gold font-title text-center">
        {t("featuresSectionTitle")}
      </h2>

      {/* 三张功能卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-8">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-[var(--theme-bg-card)] border border-[var(--theme-border)] rounded-2xl py-8 px-5 min-h-[180px] text-center flex flex-col items-center"
          >
            {f.icon}
            <h3 className="text-lg font-bold text-[var(--theme-text-primary)] mb-2">{f.title}</h3>
            <p className="text-sm text-[var(--theme-text-secondary)] leading-relaxed whitespace-pre-line">
              {f.desc.replace(/\\n/g, '\n')}
            </p>
          </div>
        ))}
      </div>
      </div>

      {/* 占卜结果示例 */}
      <SampleReading locale={locale} header={null}>
        <SampleReadingCardContent locale={locale} />
      </SampleReading>

      {/* 用户评价展示区 */}
      <UserReviews />

      {/* 底部引言 */}
      <p className="mt-16 text-xl text-[var(--theme-text-secondary)] text-center">
        {t("footerQuote")}
      </p>

      {/* 限制弹窗 */}
      <DailyLimitBanner 
        show={showBanner} 
        onClose={() => setShowBanner(false)} 
        userId={userId}
      />

      {/* 免责声明 */}
      <p className="mt-5 text-xs text-[var(--theme-text-muted)] text-center">
                {t("disclaimer")}
      </p>

      {/* SEO Content Sections */}
      <div className="mt-20 space-y-12">
        <section>
          <h2 className="text-lg text-[var(--color-gold-dim)] font-title font-semibold mb-4">
            {t("seoSection1Title")}
          </h2>
          <p className="text-sm text-[var(--theme-text-muted)] leading-relaxed">
            {t("seoSection1Content")}
          </p>
        </section>
        <section>
          <h2 className="text-lg text-[var(--color-gold-dim)] font-title font-semibold mb-4">
            {t("seoSection2Title")}
          </h2>
          <p className="text-sm text-[var(--theme-text-muted)] leading-relaxed">
            {t("seoSection2Content")}
          </p>
        </section>
      </div>
        </div>
      </main>
    </>
  );
}
