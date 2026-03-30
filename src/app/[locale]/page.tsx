"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Coins, Sparkles, BookOpen } from "lucide-react";
import { AnimatedTaichi } from "@/components/home/HeroAnimations";
import { NavBar } from "@/components/ui";
import { SHI_CHEN_LABELS } from "@/lib/iching/bazi";

const YEARS = Array.from({ length: 87 }, (_, i) => 1940 + i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export default function Home() {
  const t = useTranslations("Home");
  const tNav = useTranslations("Nav");
  const router = useRouter();
  const locale = useLocale();

  const navItems = [
    { label: tNav("divination"), href: "/", icon: <span>🔮</span> },
    { label: tNav("hexagrams"), href: "/hexagrams", icon: <span>📖</span> },
    { label: tNav("history"), href: "/history", icon: <span>📜</span> },
  ];

  const [question, setQuestion] = useState("");
  const [showBirth, setShowBirth] = useState(false);
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthHour, setBirthHour] = useState("");
  const [gender, setGender] = useState<"" | "male" | "female">("");

  const hasBirthInfo = birthYear && birthMonth && birthDay && birthHour;

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

  const inputStyle =
    "bg-[rgba(255,255,255,0.04)] border border-[rgba(201,169,110,0.2)] rounded-xl text-[#f5f0e8] outline-none focus:border-[rgba(201,169,110,0.5)] transition-colors";

  const features = [
    {
      icon: <Coins size={36} strokeWidth={1.5} className="text-gold mb-4" />,
      title: locale === "zh" ? "在线摇卦" : "Online Divination",
      desc: locale === "zh" ? "三币古法\n六爻成卦" : "Ancient three-coin method\nSix lines form a hexagram",
    },
    {
      icon: <Sparkles size={36} strokeWidth={1.5} className="text-gold mb-4" />,
      title: locale === "zh" ? "AI智能解读" : "AI Interpretation",
      desc: locale === "zh" ? "古今融通\n智慧解析" : "Bridging ancient and modern\nWisdom analysis",
    },
    {
      icon: <BookOpen size={36} strokeWidth={1.5} className="text-gold mb-4" />,
      title: locale === "zh" ? "六十四卦典" : "64 Hexagrams",
      desc: locale === "zh" ? "穷理尽性\n以至于命" : "Explore the nature of all things\nTo fulfill one's destiny",
    },
  ];

  return (
    <>
      <NavBar items={navItems} />
      <main className="min-h-screen bg-[#0a0a12]">
        <div className="max-w-[600px] mx-auto px-6 pt-[120px] md:pt-[140px] pb-20">
      {/* 太极图 */}
      <div className="flex justify-center">
        <AnimatedTaichi>
          <div className="taichi-rotate">
            <div className="taichi-symbol w-[120px] h-[120px]" />
          </div>
        </AnimatedTaichi>
      </div>

      {/* 主标题 */}
      <h1 className="mt-5 text-[56px] text-gold-gradient font-title font-bold text-center">
        {locale === "zh" ? "易" : "Yi Ching"}
      </h1>

      {/* 副标题 */}
      <p className="mt-3 text-xl text-[#a0978a] text-center">
        {t("subtitle")}
      </p>

      {/* 输入框 */}
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder={t("questionPlaceholder")}
        className={`mt-[60px] w-full h-[100px] p-5 text-base resize-none ${inputStyle} placeholder:text-[#a0978a]/50`}
      />

      {/* 出生时辰选择器 */}
      <div className="mt-3 w-full">
        <button
          type="button"
          onClick={() => setShowBirth(!showBirth)}
          className={`w-full h-12 px-4 flex items-center justify-between ${inputStyle} cursor-pointer`}
        >
          <span className="text-sm text-[#a0978a]">
            🌙 {t("birthLabel")}
            <span className="text-xs text-gray-500 ml-2">{t("birthHint")}</span>
          </span>
          <span
            className={`text-[#a0978a]/40 text-xs transition-transform duration-300 ${showBirth ? "rotate-180" : ""}`}
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
                className={`h-10 px-3 text-sm ${inputStyle} ${!birthYear ? "text-[#a0978a]/50" : ""}`}
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
                className={`h-10 px-3 text-sm ${inputStyle} ${!birthMonth ? "text-[#a0978a]/50" : ""}`}
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
                className={`h-10 px-3 text-sm ${inputStyle} ${!birthDay ? "text-[#a0978a]/50" : ""}`}
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
                className={`h-10 px-3 text-sm ${inputStyle} ${!birthHour ? "text-[#a0978a]/50" : ""}`}
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
                    ? "border-[rgba(201,169,110,0.6)] bg-[rgba(201,169,110,0.1)] text-[#c9a96e]"
                    : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] text-gray-500 hover:border-[rgba(255,255,255,0.2)]"
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
      <button
        onClick={handleStart}
        disabled={!question.trim()}
        className="mt-4 w-full h-[52px] border-[1.5px] border-[#c9a96e] bg-transparent text-[#c9a96e] text-[17px] rounded-xl font-bold font-title tracking-wider transition-all duration-300 hover:bg-[#c9a96e] hover:text-[#0a0a12] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t("startButton")}
      </button>

      {/* 三大核心功能标题 */}
      <h2 className="mt-[100px] text-xl text-gold font-title text-center">
        {t("featuresSectionTitle")}
      </h2>

      {/* 三张功能卡片 */}
      <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="w-[260px] bg-[rgba(255,255,255,0.03)] border border-[rgba(201,169,110,0.15)] rounded-2xl py-8 px-5 min-h-[180px] text-center flex flex-col items-center"
          >
            {f.icon}
            <h3 className="text-lg font-bold text-[#f5f0e8] mb-2">{f.title}</h3>
            <p className="text-sm text-[#a0978a] leading-relaxed whitespace-pre-line">
              {f.desc}
            </p>
          </div>
        ))}
      </div>

      {/* 底部引言 */}
      <p className="mt-[60px] text-xl text-[#a0978a] text-center">
        {t("footerQuote")}
      </p>

      {/* 免责声明 */}
      <p className="mt-5 text-xs text-[#555] text-center">
                {t("disclaimer")}
      </p>
        </div>
      </main>
    </>
  );
}
