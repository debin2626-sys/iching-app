"use client";

import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";

const CONTENT = {
  zh: {
    sectionTitle: "解读示例",
    sectionSubtitle: "看看 AI 如何解读卦象",
    hexName: "乾卦",
    hexSubname: "The Creative · 乾为天",
    scenario: "事业",
    originalQuote: "「乾：元，亨，利，贞。」",
    originalSource: "——《周易·乾卦》",
    paragraphs: [
      "乾卦六爻皆阳，象征天道刚健，生生不息。在事业问卦中得此卦，是极为吉利的征兆。乾卦代表着强大的创造力和领导力，暗示您当前正处于事业发展的上升期，具备充足的能量和资源去开拓新的领域。",
      "从卦象来看，天行健，君子以自强不息。这提示您应当保持积极进取的态度，不断提升自身能力。当前是推进重要项目、争取晋升机会的绝佳时机。但需注意「亢龙有悔」的警示——在追求成功的同时，保持谦逊和审慎。",
      "具体建议：近三个月内适合主动出击，展示您的专业能力和领导才华。在团队协作中发挥核心作用，但避免独断专行。财运方面，乾卦主正财旺盛，适合稳健投资，不宜投机冒进。",
    ],
    cta: "开始你的占卜",
  },
  "zh-TW": {
    sectionTitle: "解讀示例",
    sectionSubtitle: "看看 AI 如何解讀卦象",
    hexName: "乾卦",
    hexSubname: "The Creative · 乾為天",
    scenario: "事業",
    originalQuote: "「乾：元，亨，利，貞。」",
    originalSource: "——《周易·乾卦》",
    paragraphs: [
      "乾卦六爻皆陽，象徵天道剛健，生生不息。在事業問卦中得此卦，是極為吉利的徵兆。乾卦代表著強大的創造力和領導力，暗示您當前正處於事業發展的上升期，具備充足的能量和資源去開拓新的領域。",
      "從卦象來看，天行健，君子以自強不息。這提示您應當保持積極進取的態度，不斷提升自身能力。當前是推進重要項目、爭取晉升機會的絕佳時機。但需注意「亢龍有悔」的警示——在追求成功的同時，保持謙遜和審慎。",
      "具體建議：近三個月內適合主動出擊，展示您的專業能力和領導才華。在團隊協作中發揮核心作用，但避免獨斷專行。財運方面，乾卦主正財旺盛，適合穩健投資，不宜投機冒進。",
    ],
    cta: "開始你的占卜",
  },
  en: {
    sectionTitle: "Sample Reading",
    sectionSubtitle: "See how AI interprets the hexagram",
    hexName: "Qián",
    hexSubname: "The Creative · Heaven over Heaven",
    scenario: "Career",
    originalQuote: '"Qián: Sublime success. Perseverance furthers."',
    originalSource: "— I Ching, Hexagram 1",
    paragraphs: [
      "Hexagram Qián consists of six unbroken yang lines, symbolizing the creative power of heaven — vigorous, ceaseless, and full of potential. Drawing this hexagram for a career reading is an exceptionally auspicious sign. It represents powerful creativity and leadership, suggesting you are in an ascending phase of professional development with abundant energy and resources to explore new frontiers.",
      'The image of heaven in motion reminds us: "As heaven maintains vigor through movement, a superior person should constantly strive for self-improvement." This signals that now is the ideal time to push forward with important projects and pursue advancement opportunities. However, heed the warning of the top line — "the arrogant dragon will have cause to repent" — maintain humility even as you reach for success.',
      "Specific guidance: The next three months favor taking initiative and showcasing your expertise and leadership. Play a central role in team collaboration while avoiding autocratic tendencies. Financially, Qián indicates strong legitimate income — steady investment is favored over speculation.",
    ],
    cta: "Start Your Reading",
  },
};

// Qian hexagram: 6 solid yang lines
function HexagramDisplay() {
  return (
    <div className="flex flex-col items-center gap-[6px] my-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="w-20 h-[5px] rounded-sm"
          style={{
            background: "linear-gradient(90deg, #c9a96e, #e8d5a3, #c9a96e)",
            boxShadow: "0 0 6px rgba(201,169,110,0.3)",
          }}
        />
      ))}
    </div>
  );
}

export default function SampleReading() {
  const locale = useLocale();
  const router = useRouter();
  const content = CONTENT[locale as keyof typeof CONTENT] || CONTENT.en;

  return (
    <section className="mt-24">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-xl text-[#c9a96e] font-title font-bold">
          {content.sectionTitle}
        </h2>
        <p className="text-sm text-[#a0978a] mt-2">{content.sectionSubtitle}</p>
      </div>

      {/* Sample Card */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(20,20,30,0.95), rgba(15,15,22,0.98))",
          border: "1px solid rgba(201,169,110,0.3)",
          boxShadow: "0 0 40px rgba(201,169,110,0.06), inset 0 1px 0 rgba(201,169,110,0.1)",
        }}
      >
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[rgba(201,169,110,0.4)]" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[rgba(201,169,110,0.4)]" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[rgba(201,169,110,0.4)]" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[rgba(201,169,110,0.4)]" />

        <div className="p-6 sm:p-8">
          {/* Header: Hexagram name + scenario badge */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-2xl font-bold text-[#c9a96e] font-title">
                {content.hexName}
              </h3>
              <p className="text-sm text-[#a0978a]">{content.hexSubname}</p>
            </div>
            <span className="px-3 py-1 text-xs rounded-full border border-[rgba(201,169,110,0.3)] text-[#c9a96e] bg-[rgba(201,169,110,0.08)]">
              {content.scenario}
            </span>
          </div>

          {/* Hexagram visual */}
          <HexagramDisplay />

          {/* Original quote */}
          <blockquote className="my-6 pl-4 border-l-2 border-[rgba(201,169,110,0.3)]">
            <p className="text-[#c9a96e] text-sm italic leading-relaxed">
              {content.originalQuote}
            </p>
            <p className="text-[#a0978a] text-xs mt-1">
              {content.originalSource}
            </p>
          </blockquote>

          {/* AI interpretation */}
          <div className="space-y-4">
            {content.paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-[#d4cfc5] text-sm leading-relaxed"
              >
                {p}
              </p>
            ))}
          </div>

          {/* Divider */}
          <div className="my-6 h-px bg-gradient-to-r from-transparent via-[rgba(201,169,110,0.2)] to-transparent" />

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={() => router.push("/")}
              className="px-8 py-3 border-[1.5px] border-[#c9a96e] bg-transparent text-[#c9a96e] text-base rounded-xl font-bold font-title tracking-wider transition-all duration-300 hover:bg-[#c9a96e] hover:text-[#0a0a12]"
            >
              {content.cta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
