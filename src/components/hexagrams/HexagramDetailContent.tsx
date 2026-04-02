"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronLeft } from "lucide-react";
import { PageLayout } from "@/components/ui";
import RelatedHexagrams from "@/components/hexagrams/RelatedHexagrams";

interface HexagramLine {
  position: number;
  textZh: string;
  textEn: string;
  interpretationZh: string;
  interpretationEn: string;
  detailZh?: string;
  detailEn?: string;
}

interface HexagramData {
  number: number;
  nameZh: string;
  nameEn: string;
  symbol: string;
  upperTrigram: string;
  lowerTrigram: string;
  judgmentZh: string;
  judgmentEn: string;
  imageZh: string;
  imageEn: string;
  interpretationZh: string;
  interpretationEn: string;
  lines: HexagramLine[];
  overviewZh?: string;
  overviewEn?: string;
  judgmentDetailZh?: string;
  judgmentDetailEn?: string;
  imageDetailZh?: string;
  imageDetailEn?: string;
  modernApplicationZh?: string;
  modernApplicationEn?: string;
  historicalStoryZh?: string;
  historicalStoryEn?: string;
  relatedHexagramsNote?: string;
  references?: string[];
}

interface ModernAppCard {
  icon: string;
  title: string;
  content: string;
}

function parseModernApplication(text: string): ModernAppCard[] {
  const iconMap: Record<string, string> = {
    "事业": "💼",
    "感情": "❤️",
    "财运": "💰",
    "健康": "🏥",
  };
  const parts = text.split(/【(事业|感情|财运|健康)】/).filter(Boolean);
  const cards: ModernAppCard[] = [];
  for (let i = 0; i < parts.length - 1; i += 2) {
    const title = parts[i];
    const content = parts[i + 1]?.trim();
    if (title && content && iconMap[title]) {
      cards.push({ icon: iconMap[title], title, content });
    }
  }
  return cards;
}

const TRIGRAM_MAP: Record<string, string> = {
  "111": "☰", "110": "☱", "101": "☲", "100": "☳",
  "011": "☴", "010": "☵", "001": "☶", "000": "☷",
};

function HexagramLines({ symbol, nameZh, nameEn, number }: { symbol: string; nameZh?: string; nameEn?: string; number?: number }) {
  const altZh = nameZh && number ? `${nameZh}卦卦象 - 第${number}卦` : "卦象";
  const altEn = nameEn && number ? `Hexagram ${number} ${nameEn} - I Ching symbol` : "Hexagram symbol";
  return (
    <div
      className="flex flex-col gap-[5px] items-center my-3"
      role="img"
      aria-label={`${altZh} / ${altEn}`}
    >
      {symbol.split("").reverse().map((b, i) => (
        <div key={i} className="flex gap-[4px] justify-center w-16">
          {b === "1" ? (
            <div className="h-[6px] w-16 bg-amber-400 rounded-sm" />
          ) : (
            <>
              <div className="h-[6px] w-[28px] bg-amber-400 rounded-sm" />
              <div className="h-[6px] w-[28px] bg-amber-400 rounded-sm" />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default function HexagramDetailContent({ hexagramNumber }: { hexagramNumber: number }) {
  const tNav = useTranslations("Nav");
  const locale = useLocale();
  const isZh = locale === "zh" || locale === "zh-TW";
  const [data, setData] = useState<HexagramData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/hexagram/${hexagramNumber}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [hexagramNumber]);

  const navItems = [
    { label: tNav("divination"), href: "/", icon: <span>🔮</span> },
    { label: tNav("hexagrams"), href: "/hexagrams", icon: <span>📖</span> },
    { label: tNav("history"), href: "/history", icon: <span>📜</span> },
  ];

  if (loading) {
    return (
      <PageLayout navItems={navItems} maxWidth="max-w-4xl">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-pulse text-amber-400/60 text-lg">
            {isZh ? "加载中..." : "Loading..."}
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!data) {
    return (
      <PageLayout navItems={navItems} maxWidth="max-w-4xl">
        <div className="text-center text-gray-500 mt-20">
          {isZh ? "卦象未找到" : "Hexagram not found"}
        </div>
      </PageLayout>
    );
  }

  const upper = TRIGRAM_MAP[data.symbol.slice(3, 6)] || "?";
  const lower = TRIGRAM_MAP[data.symbol.slice(0, 3)] || "?";

  return (
    <PageLayout navItems={navItems} maxWidth="max-w-4xl">
      <div className="max-w-2xl mx-auto">
        {/* Back to list */}
        <Link
          href="/hexagrams"
          className="inline-flex items-center text-sm text-gray-500 hover:text-amber-400 transition-colors mb-6"
        >
          <ChevronLeft size={16} />
          {isZh ? "返回卦典" : "Back to Hexagrams"}
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-sm text-gray-600">
            #{data.number}
          </span>
          <div className="flex items-center justify-center gap-2 text-amber-500/60 text-xl mt-2">
            <span>{upper}</span>
            <span>{lower}</span>
          </div>
          <HexagramLines symbol={data.symbol} nameZh={data.nameZh} nameEn={data.nameEn} number={data.number} />
          <h1 className="text-4xl font-bold text-amber-400 mt-3">
            {data.nameZh}
          </h1>
          <p className="text-lg text-gray-400 mt-1">
            {data.nameEn}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {isZh
              ? `上卦：${data.upperTrigram} ｜ 下卦：${data.lowerTrigram}`
              : `Upper: ${data.upperTrigram} | Lower: ${data.lowerTrigram}`}
          </p>
        </div>

        {/* Overview */}
        {(data.overviewZh || data.overviewEn) && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-amber-400/90 mb-3 border-b border-amber-400/20 pb-2">
              {isZh ? "卦象概述" : "Overview"}
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {isZh ? data.overviewZh : data.overviewEn}
            </p>
          </section>
        )}

        {/* Judgment */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-amber-400/90 mb-3 border-b border-amber-400/20 pb-2">
            {isZh ? "卦辞" : "Judgment"}
          </h2>
          <p className="text-[#f5f0e8] leading-relaxed text-lg">
            {isZh ? data.judgmentZh : data.judgmentEn}
          </p>
        </section>

        {/* Judgment Detail */}
        {(data.judgmentDetailZh || data.judgmentDetailEn) && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-amber-400/90 mb-3 border-b border-amber-400/20 pb-2">
              {isZh ? "卦辞详解" : "Judgment Commentary"}
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {isZh ? data.judgmentDetailZh : data.judgmentDetailEn}
            </p>
          </section>
        )}

        {/* Image */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-amber-400/90 mb-3 border-b border-amber-400/20 pb-2">
            {isZh ? "象辞" : "Image"}
          </h2>
          <p className="text-[#f5f0e8] leading-relaxed text-lg">
            {isZh ? data.imageZh : data.imageEn}
          </p>
        </section>

        {/* Image Detail */}
        {(data.imageDetailZh || data.imageDetailEn) && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-amber-400/90 mb-3 border-b border-amber-400/20 pb-2">
              {isZh ? "象辞详解" : "Image Commentary"}
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {isZh ? data.imageDetailZh : data.imageDetailEn}
            </p>
          </section>
        )}

        {/* Interpretation */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-amber-400/90 mb-3 border-b border-amber-400/20 pb-2">
            {isZh ? "解读" : "Interpretation"}
          </h2>
          <p className="text-gray-300 leading-relaxed">
            {isZh ? data.interpretationZh : data.interpretationEn}
          </p>
        </section>

        {/* Lines */}
        {data.lines && data.lines.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-amber-400/90 mb-4 border-b border-amber-400/20 pb-2">
              {isZh ? "爻辞" : "Line Texts"}
            </h2>
            <div className="space-y-4">
              {data.lines.map((line) => {
                const detail = isZh ? line.detailZh : line.detailEn;
                return (
                  <div
                    key={line.position}
                    className="bg-[rgba(255,255,255,0.03)] border border-[rgba(201,169,110,0.12)] rounded-xl p-4"
                  >
                    <p className="text-[#f5f0e8] font-medium">
                      {isZh ? line.textZh : line.textEn}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      {isZh ? line.interpretationZh : line.interpretationEn}
                    </p>
                    {detail && (
                      <div className="mt-3 pt-3 border-t border-[rgba(201,169,110,0.08)]">
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {detail}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Modern Application */}
        {(data.modernApplicationZh || data.modernApplicationEn) && (() => {
          const text = (isZh ? data.modernApplicationZh : data.modernApplicationEn) || "";
          const cards = parseModernApplication(text);
          return (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-amber-400/90 mb-3 border-b border-amber-400/20 pb-2">
                {isZh ? "现代应用" : "Modern Application"}
              </h2>
              {cards.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cards.map((card) => (
                    <div
                      key={card.title}
                      className="bg-[rgba(255,255,255,0.03)] border border-[rgba(201,169,110,0.12)] rounded-xl p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{card.icon}</span>
                        <span className="text-amber-400/80 font-medium">{card.title}</span>
                      </div>
                      <p className="text-gray-300 leading-relaxed text-sm">
                        {card.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-300 leading-relaxed">{text}</p>
              )}
            </section>
          );
        })()}

        {/* Historical Story */}
        {(data.historicalStoryZh || data.historicalStoryEn) && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-amber-400/90 mb-3 border-b border-amber-400/20 pb-2">
              {isZh ? "历史典故" : "Historical Story"}
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {isZh ? data.historicalStoryZh : data.historicalStoryEn}
            </p>
          </section>
        )}

        {/* Related Hexagrams Note */}
        {data.relatedHexagramsNote && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-amber-400/90 mb-3 border-b border-amber-400/20 pb-2">
              {isZh ? "互卦·综卦·错卦" : "Related Trigrams"}
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {data.relatedHexagramsNote}
            </p>
          </section>
        )}

        {/* References */}
        {data.references && data.references.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-amber-400/90 mb-3 border-b border-amber-400/20 pb-2">
              {isZh ? "引用来源" : "References"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.references.map((ref, i) => (
                <span
                  key={i}
                  className="text-sm text-gray-500 bg-[rgba(255,255,255,0.03)] border border-[rgba(201,169,110,0.08)] rounded-lg px-3 py-1"
                >
                  {ref}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Related hexagrams + Prev/Next navigation */}
        <RelatedHexagrams hexagramNumber={hexagramNumber} symbol={data.symbol} />
      </div>
    </PageLayout>
  );
}
