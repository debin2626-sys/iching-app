"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import ScenarioSelector from "@/components/divination/ScenarioSelector";
import { SHI_CHEN_LABELS } from "@/lib/iching/bazi";
import { DailyLimitBanner, useLocalDailyLimit } from "@/components/divination/DailyLimitBanner";
import {
  trackScenarioSelect,
  trackFunnelHomeView,
  trackFunnelStartClick,
  trackFunnelQuestionSubmit,
  trackFunnelBirthFill,
} from "@/lib/analytics";

const YEARS = Array.from({ length: 87 }, (_, i) => 1940 + i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export default function StartDivinationButton() {
  const t = useTranslations("Home");
  const router = useRouter();
  const { showBanner, setShowBanner, checkAndIncrement, userId } =
    useLocalDailyLimit();

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

    trackFunnelStartClick({
      entry_type: scenarioId ? "scenario_select" : "direct_click",
      scenario: scenarioId || undefined,
      sub_scenario: subScenarioId || undefined,
    });

    trackFunnelQuestionSubmit({
      question_length: question.trim().length,
      has_birth_info: !!hasBirthInfo,
      has_gender: !!gender,
      scenario: scenarioId || undefined,
      sub_scenario: subScenarioId || undefined,
    });

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
    "bg-[rgba(255,255,255,0.04)] border border-[var(--color-gold)]/20 rounded-xl text-[var(--theme-text-primary)] outline-none focus:border-[var(--color-gold)]/50 transition-colors";

  return (
    <>
      {/* 场景化入口 */}
      <div className="mt-10">
        <p className="text-sm text-[var(--theme-text-muted)] text-center mb-3">
          {t("scenarioGuide")}
        </p>
        <ScenarioSelector onSelect={handleScenarioSelect} />
      </div>

      {/* 输入框 — with bracket highlighting overlay */}
      <div className="mt-8 relative">
        <div
          aria-hidden
          className="absolute inset-0 p-5 text-base pointer-events-none whitespace-pre-wrap break-words overflow-hidden"
          style={{ lineHeight: "1.5" }}
        >
          {question.split(/(\[[^\]]*\])/).map((part, idx) =>
            /^\[.*\]$/.test(part) ? (
              <span key={idx} className="text-[#c9a96e] font-semibold">
                {part}
              </span>
            ) : (
              <span key={idx} className="text-transparent">
                {part}
              </span>
            )
          )}
        </div>
        <textarea
          ref={textareaRef}
          value={question}
          onChange={(e) => {
            if (!isTyping) {
              setQuestion(e.target.value);
              if (scenarioId) {
                setScenarioId("");
                setSubScenarioId("");
              }
            }
          }}
          placeholder={t("questionPlaceholder")}
          className={`w-full h-[120px] md:h-[140px] p-5 text-base resize-none ${inputStyle} placeholder:text-[var(--theme-text-muted)]/50`}
          style={{ caretColor: "#c9a96e" }}
        />
      </div>

      {/* 出生时辰选择器 */}
      <div className="mt-4 w-full">
        <button
          type="button"
          onClick={() => setShowBirth(!showBirth)}
          className={`w-full h-12 px-4 flex items-center justify-between ${inputStyle} cursor-pointer`}
        >
          <span className="text-sm text-[var(--theme-text-muted)]">
            🌙 {t("birthLabel")}
            <span className="text-xs text-[var(--theme-text-muted)] ml-2">
              {t("birthHint")}
            </span>
          </span>
          <span
            className={`text-[var(--theme-text-muted)]/40 text-xs transition-transform duration-300 ${showBirth ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </button>

        {showBirth && (
          <div className="mt-2 p-4 bg-[rgba(255,255,255,0.04)] border border-[rgba(201,169,110,0.2)] rounded-xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <select
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className={`h-10 px-3 text-sm ${inputStyle} ${!birthYear ? "text-[var(--theme-text-muted)]/50" : ""}`}
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
                className={`h-10 px-3 text-sm ${inputStyle} ${!birthMonth ? "text-[var(--theme-text-muted)]/50" : ""}`}
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
                className={`h-10 px-3 text-sm ${inputStyle} ${!birthDay ? "text-[var(--theme-text-muted)]/50" : ""}`}
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
                className={`h-10 px-3 text-sm ${inputStyle} ${!birthHour ? "text-[var(--theme-text-muted)]/50" : ""}`}
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
                    ? "border-[rgba(201,169,110,0.6)] bg-[rgba(201,169,110,0.1)] text-[#c9a96e]"
                    : "border-[var(--theme-border)] bg-[var(--theme-border)] text-[var(--theme-text-muted)] hover:border-[var(--theme-border-hover)]"
                }`}
              >
                ♂ {t("genderMale")}
              </button>
              <button
                type="button"
                onClick={() =>
                  setGender(gender === "female" ? "" : "female")
                }
                className={`flex-1 py-1.5 rounded-lg text-sm font-title tracking-wide transition-all duration-300 border ${
                  gender === "female"
                    ? "border-[rgba(201,169,110,0.6)] bg-[rgba(201,169,110,0.1)] text-[#c9a96e]"
                    : "border-[var(--theme-border)] bg-[var(--theme-border)] text-[var(--theme-text-muted)] hover:border-[var(--theme-border-hover)]"
                }`}
              >
                ♀ {t("genderFemale")}
              </button>
            </div>

            {hasBirthInfo && (
              <p className="text-xs text-[#c9a96e]/50 mt-3 tracking-wide">
                {t("birthRecorded")}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 开始摇卦按钮 */}
      <div className="mt-6 relative">
        <p className="text-center text-xs text-[#c9a96e]/50 mb-2">
          {t("tossingHint")}
        </p>
        <button
          onClick={handleStart}
          disabled={!question.trim()}
          className="w-full h-[56px] bg-gradient-to-br from-[#c9a96e] to-[#b8943d] text-[#0a0a12] text-lg rounded-[14px] font-bold font-title tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(201,169,110,0.3)] hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(201,169,110,0.4)] disabled:opacity-35 disabled:shadow-none disabled:cursor-not-allowed"
          style={
            question.trim()
              ? { animation: "pulse-glow 2.5s ease-in-out infinite" }
              : undefined
          }
        >
          {t("startButton")}
        </button>
      </div>

      {/* 限制弹窗 */}
      <DailyLimitBanner
        show={showBanner}
        onClose={() => setShowBanner(false)}
        userId={userId}
      />
    </>
  );
}
