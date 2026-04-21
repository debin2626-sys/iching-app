"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import ScenarioSelector from "@/components/divination/ScenarioSelector";
import { SHI_CHEN_LABELS } from "@/lib/iching/bazi";
import { DailyLimitBanner, useLocalDailyLimit } from "@/components/divination/DailyLimitBanner";
import { Button } from "@/components/ui/Button";
import { TaichiWatermark, CloudPattern } from "@/components/decorative";
import {
  trackScenarioSelect,
  trackFunnelStartClick,
  trackFunnelQuestionSubmit,
  trackFunnelBirthFill,
} from "@/lib/analytics";

const YEARS = Array.from({ length: 87 }, (_, i) => 1940 + i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export default function DivineForm() {
  const t = useTranslations("Home");
  const tDivine = useTranslations("Divine");
  const router = useRouter();
  const { showBanner, setShowBanner, checkAndIncrement, userId } =
    useLocalDailyLimit();

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

  return (
    <div className="relative w-full">
      {/* Cloud Pattern Decoration */}
      <CloudPattern position="top" className="mb-4" />

      {/* Taichi Watermark */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <TaichiWatermark size={400} opacity={0.07} />
      </div>

      {/* Title */}
      <div className="relative text-center mb-8">
        <h1
          className="text-3xl md:text-4xl font-bold"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--theme-text-primary)',
          }}
        >
          {tDivine('title')}
        </h1>
        <p
          className="mt-3 text-base"
          style={{ color: 'var(--theme-text-secondary)' }}
        >
          {tDivine('subtitle')}
        </p>
      </div>

      {/* Scenario Selector */}
      <div className="relative mt-6">
        <p
          className="text-sm text-center mb-3"
          style={{ color: 'var(--theme-text-secondary)' }}
        >
          {t("scenarioGuide")}
        </p>
        <ScenarioSelector onSelect={handleScenarioSelect} />
      </div>

      {/* Question Input */}
      <div className="relative mt-8">
        <div
          aria-hidden
          className="absolute inset-0 p-5 text-base pointer-events-none whitespace-pre-wrap break-words overflow-hidden"
          style={{ lineHeight: "1.5" }}
        >
          {question.split(/(\[[^\]]*\])/).map((part, idx) =>
            /^\[.*\]$/.test(part) ? (
              <span key={idx} style={{ color: 'var(--color-gold)', fontWeight: 600 }}>
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
          className="w-full h-[120px] md:h-[140px] p-5 text-base resize-none rounded-xl outline-none transition-colors"
          style={{
            backgroundColor: 'var(--theme-bg-card)',
            border: '1px solid var(--theme-border)',
            color: 'var(--theme-text-primary)',
            caretColor: 'var(--color-gold)',
          }}
        />
      </div>

      {/* Birth Time Selector */}
      <div className="relative mt-4 w-full">
        <button
          type="button"
          onClick={() => setShowBirth(!showBirth)}
          className="w-full h-12 px-4 flex items-center justify-between rounded-xl cursor-pointer transition-colors"
          style={{
            backgroundColor: 'var(--theme-bg-card)',
            border: '1px solid var(--theme-border)',
            color: 'var(--theme-text-secondary)',
          }}
        >
          <span className="text-sm">
            🌙 {t("birthLabel")}
            <span className="text-xs ml-2" style={{ color: 'var(--theme-text-muted)' }}>
              {t("birthHint")}
            </span>
          </span>
          <span
            className={`text-xs transition-transform duration-300 ${showBirth ? "rotate-180" : ""}`}
            style={{ color: 'var(--theme-text-muted)' }}
          >
            ▼
          </span>
        </button>

        {showBirth && (
          <div
            className="mt-2 p-4 rounded-xl"
            style={{
              backgroundColor: 'var(--theme-bg-card)',
              border: '1px solid var(--theme-border)',
            }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: birthYear, setter: setBirthYear, placeholder: t("yearPlaceholder"), options: YEARS },
                { value: birthMonth, setter: setBirthMonth, placeholder: t("monthPlaceholder"), options: MONTHS },
                { value: birthDay, setter: setBirthDay, placeholder: t("dayPlaceholder"), options: DAYS },
              ].map((field, i) => (
                <select
                  key={i}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className="h-10 px-3 text-sm rounded-xl outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--theme-bg-card)',
                    border: '1px solid var(--theme-border)',
                    color: field.value ? 'var(--theme-text-primary)' : 'var(--theme-text-muted)',
                  }}
                >
                  <option value="">{field.placeholder}</option>
                  {field.options.map((v) => (
                    <option key={v} value={String(v)}>{v}</option>
                  ))}
                </select>
              ))}
              <select
                value={birthHour}
                onChange={(e) => setBirthHour(e.target.value)}
                className="h-10 px-3 text-sm rounded-xl outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--theme-bg-card)',
                  border: '1px solid var(--theme-border)',
                  color: birthHour ? 'var(--theme-text-primary)' : 'var(--theme-text-muted)',
                }}
              >
                <option value="">{t("hourPlaceholder")}</option>
                {SHI_CHEN_LABELS.map((label, i) => (
                  <option key={i} value={String(i)}>{label}</option>
                ))}
              </select>
            </div>

            {/* Gender Selection */}
            <div className="mt-3 flex gap-3">
              <button
                type="button"
                onClick={() => setGender(gender === "male" ? "" : "male")}
                className="flex-1 py-1.5 rounded-lg text-sm tracking-wide transition-all duration-300"
                style={{
                  fontFamily: 'var(--font-display)',
                  border: gender === "male"
                    ? '1px solid rgba(184,146,74,0.6)'
                    : '1px solid var(--theme-border)',
                  backgroundColor: gender === "male"
                    ? 'rgba(184,146,74,0.1)'
                    : 'transparent',
                  color: gender === "male"
                    ? 'var(--color-gold)'
                    : 'var(--theme-text-muted)',
                }}
              >
                ♂ {t("genderMale")}
              </button>
              <button
                type="button"
                onClick={() => setGender(gender === "female" ? "" : "female")}
                className="flex-1 py-1.5 rounded-lg text-sm tracking-wide transition-all duration-300"
                style={{
                  fontFamily: 'var(--font-display)',
                  border: gender === "female"
                    ? '1px solid rgba(184,146,74,0.6)'
                    : '1px solid var(--theme-border)',
                  backgroundColor: gender === "female"
                    ? 'rgba(184,146,74,0.1)'
                    : 'transparent',
                  color: gender === "female"
                    ? 'var(--color-gold)'
                    : 'var(--theme-text-muted)',
                }}
              >
                ♀ {t("genderFemale")}
              </button>
            </div>

            {hasBirthInfo && (
              <p className="text-xs mt-3 tracking-wide" style={{ color: 'rgba(184,146,74,0.5)' }}>
                {t("birthRecorded")}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Start Button */}
      <div className="relative mt-8 flex flex-col items-center">
        <Button
          variant="primary"
          size="lg"
          onClick={handleStart}
          disabled={!question.trim()}
        >
          {tDivine('startButton')}
        </Button>
        <p
          className="mt-4 text-sm text-center"
          style={{ color: 'var(--theme-text-muted)' }}
        >
          {tDivine('description')}
        </p>
      </div>

      {/* Daily Limit Banner */}
      <DailyLimitBanner
        show={showBanner}
        onClose={() => setShowBanner(false)}
        userId={userId}
      />
    </div>
  );
}