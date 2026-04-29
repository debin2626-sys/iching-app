"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { useNavItems } from "@/hooks/useNavItems";
import { Link } from "@/i18n/navigation";
import { Sparkles } from "lucide-react";
import { PageLayout, Breadcrumb } from "@/components/ui";
import RelatedHexagrams from "@/components/hexagrams/RelatedHexagrams";
import { SCENARIO_IDS, SCENARIO_HEXAGRAMS, SCENARIO_META, type ScenarioId } from "@/data/scenarios";

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
  const parts = (typeof text === 'string' ? text : '')
    .split(/【(事业|感情|财运|健康)】/)
    .filter(Boolean);
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
  const safeSymbol = typeof symbol === 'string' && symbol.length === 6 ? symbol : '111111';
  return (
    <div
      className="flex flex-col gap-[5px] items-center my-3"
      role="img"
      aria-label={`${altZh} / ${altEn}`}
    >
      {safeSymbol.split("").reverse().map((b, i) => (
        <div key={i} className="flex gap-[4px] justify-center w-16">
          {b === "1" ? (
            <div className="h-[6px] w-16 bg-[var(--color-gold)] rounded-sm" />
          ) : (
            <>
              <div className="h-[6px] w-[28px] bg-[var(--color-gold)] rounded-sm" />
              <div className="h-[6px] w-[28px] bg-[var(--color-gold)] rounded-sm" />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default function HexagramDetailContent({ hexagramNumber, initialData, heroContent }: { hexagramNumber: number; initialData?: HexagramData | null; heroContent?: ReactNode }) {
  const locale = useLocale();
  const isZh = locale === "zh" || locale === "zh-TW";
  const [data, setData] = useState<HexagramData | null>(initialData ?? null);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    // Skip fetch if we already have server-provided data
    if (initialData) return;
    fetch(`/api/hexagram/${hexagramNumber}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [hexagramNumber, initialData]);

  const navItems = useNavItems();

  if (loading) {
    return (
      <PageLayout navItems={navItems} maxWidth="max-w-6xl">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-pulse text-[var(--color-gold)]/60 text-lg">
            {isZh ? "加载中..." : "Loading..."}
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!data) {
    return (
      <PageLayout navItems={navItems} maxWidth="max-w-6xl">
        <div className="text-center text-[var(--theme-text-muted)] mt-20">
          {isZh ? "卦象未找到" : "Hexagram not found"}
        </div>
      </PageLayout>
    );
  }

  const upper = TRIGRAM_MAP[data.symbol.slice(3, 6)] || "?";
  const lower = TRIGRAM_MAP[data.symbol.slice(0, 3)] || "?";

  // Find primary scenario for this hexagram (for CTA)
  const primaryScene = SCENARIO_IDS.find((s) =>
    SCENARIO_HEXAGRAMS[s].includes(hexagramNumber)
  );
  const sceneMeta = primaryScene ? SCENARIO_META[primaryScene] : null;

  return (
    <PageLayout navItems={navItems} maxWidth="max-w-6xl">
      <div>
        {/* Hero section — server-rendered when heroContent is provided (improves LCP),
            falls back to inline rendering if used standalone */}
        {heroContent ?? (
          <>
            {/* Breadcrumb */}
            <Breadcrumb
              className="mb-6"
              items={[
                { label: isZh ? "六十四卦" : "Hexagrams", href: "/hexagrams" },
                { label: isZh ? `第${data.number}卦 ${data.nameZh}` : `#${data.number} ${data.nameEn}` },
              ]}
            />

            {/* Header */}
            <div className="text-center mb-10">
              <span className="text-sm text-[var(--theme-text-secondary)]">
                #{data.number}
              </span>
              <div className="flex items-center justify-center gap-2 text-[var(--color-gold)]/60 text-xl mt-2">
                <span>{upper}</span>
                <span>{lower}</span>
              </div>
              <HexagramLines symbol={data.symbol} nameZh={data.nameZh} nameEn={data.nameEn} number={data.number} />
              <h1 className="text-4xl font-bold text-[var(--color-gold)] mt-3">
                {data.nameZh}
              </h1>
              <p className="text-lg text-[var(--theme-text-muted)] mt-1">
                {data.nameEn}
              </p>
              <p className="text-sm text-[var(--theme-text-secondary)] mt-2">
                {isZh
                  ? `上卦：${data.upperTrigram} ｜ 下卦：${data.lowerTrigram}`
                  : `Upper: ${data.upperTrigram} | Lower: ${data.lowerTrigram}`}
              </p>
            </div>
          </>
        )}

        {/* Overview */}
        {(data.overviewZh || data.overviewEn) && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[var(--color-gold)]/90 mb-3 border-b border-[var(--color-gold)]/20 pb-2">
              {isZh ? "卦象概述" : "Overview"}
            </h2>
            <p className="text-[var(--theme-text-primary)] leading-relaxed">
              {isZh ? data.overviewZh : data.overviewEn}
            </p>
          </section>
        )}

        {/* Judgment */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-[var(--color-gold)]/90 mb-3 border-b border-[var(--color-gold)]/20 pb-2">
            {isZh ? "卦辞" : "Judgment"}
          </h2>
          <p className="text-[var(--theme-text-primary)] leading-relaxed text-lg">
            {isZh ? data.judgmentZh : data.judgmentEn}
          </p>
        </section>

        {/* Contextual CTA — after judgment, high visibility */}
        <section className="mb-8 rounded-xl border border-[var(--color-gold)]/30 bg-gradient-to-r from-[var(--theme-bg-card)] to-[var(--color-gold)]/5 p-5">
          <p className="text-[var(--theme-text-primary)] text-sm leading-relaxed mb-3">
            {isZh
              ? sceneMeta
                ? `想知道${data.nameZh}卦对你的${sceneMeta.nameZh.replace(/运势|投资|考试|养生|姻缘/, "")}有什么具体指引？AI 结合你的问题深度解读。`
                : `想知道${data.nameZh}卦对你意味着什么？AI 结合你的问题深度解读。`
              : `Curious what ${data.nameEn} means for you personally? Get an AI-powered reading tailored to your question.`}
          </p>
          <Link
            href="/divine"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
          >
            <Sparkles className="w-4 h-4" />
            {isZh
              ? `AI 解读${data.nameZh}卦`
              : `Get ${data.nameEn} Reading`}
          </Link>
        </section>

        {/* Judgment Detail */}
        {(data.judgmentDetailZh || data.judgmentDetailEn) && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[var(--color-gold)]/90 mb-3 border-b border-[var(--color-gold)]/20 pb-2">
              {isZh ? "卦辞详解" : "Judgment Commentary"}
            </h2>
            <p className="text-[var(--theme-text-primary)] leading-relaxed">
              {isZh ? data.judgmentDetailZh : data.judgmentDetailEn}
            </p>
          </section>
        )}

        {/* Image */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-[var(--color-gold)]/90 mb-3 border-b border-[var(--color-gold)]/20 pb-2">
            {isZh ? "象辞" : "Image"}
          </h2>
          <p className="text-[var(--theme-text-primary)] leading-relaxed text-lg">
            {isZh ? data.imageZh : data.imageEn}
          </p>
        </section>

        {/* Image Detail */}
        {(data.imageDetailZh || data.imageDetailEn) && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[var(--color-gold)]/90 mb-3 border-b border-[var(--color-gold)]/20 pb-2">
              {isZh ? "象辞详解" : "Image Commentary"}
            </h2>
            <p className="text-[var(--theme-text-primary)] leading-relaxed">
              {isZh ? data.imageDetailZh : data.imageDetailEn}
            </p>
          </section>
        )}

        {/* Interpretation */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-[var(--color-gold)]/90 mb-3 border-b border-[var(--color-gold)]/20 pb-2">
            {isZh ? "解读" : "Interpretation"}
          </h2>
          <p className="text-[var(--theme-text-primary)] leading-relaxed">
            {isZh ? data.interpretationZh : data.interpretationEn}
          </p>
        </section>

        {/* Lines */}
        {data.lines && data.lines.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-[var(--color-gold)]/90 mb-4 border-b border-[var(--color-gold)]/20 pb-2">
              {isZh ? "爻辞" : "Line Texts"}
            </h2>
            <div className="space-y-4">
              {data.lines.map((line) => {
                const detail = isZh ? line.detailZh : line.detailEn;
                return (
                  <div
                    key={line.position}
                    className="bg-[var(--theme-bg-card)] border border-[var(--theme-border)] rounded-xl p-4"
                  >
                    <p className="text-[var(--theme-text-primary)] font-medium">
                      {isZh ? line.textZh : line.textEn}
                    </p>
                    <p className="text-[var(--theme-text-muted)] text-sm mt-2">
                      {isZh ? line.interpretationZh : line.interpretationEn}
                    </p>
                    {detail && (
                      <div className="mt-3 pt-3 border-t border-[var(--theme-border)]">
                        <p className="text-sm text-[var(--theme-text-muted)] leading-relaxed">
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
              <h2 className="text-xl font-bold text-[var(--color-gold)]/90 mb-3 border-b border-[var(--color-gold)]/20 pb-2">
                {isZh ? "现代应用" : "Modern Application"}
              </h2>
              {cards.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cards.map((card) => (
                    <div
                      key={card.title}
                      className="bg-[var(--theme-bg-card)] border border-[var(--theme-border)] rounded-xl p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{card.icon}</span>
                        <span className="text-[var(--color-gold)]/80 font-medium">{card.title}</span>
                      </div>
                      <p className="text-[var(--theme-text-primary)] leading-relaxed text-sm">
                        {card.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[var(--theme-text-primary)] leading-relaxed">{text}</p>
              )}
            </section>
          );
        })()}

        {/* Related Questions — "People also ask" style for SEO + engagement */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-[var(--color-gold)]/90 mb-3 border-b border-[var(--color-gold)]/20 pb-2">
            {isZh ? "常见问题" : "People Also Ask"}
          </h2>
          <div className="space-y-2">
            {(isZh
              ? [
                  { q: `${data.nameZh}卦是什么意思？`, a: data.judgmentZh },
                  ...(sceneMeta
                    ? [{ q: `${data.nameZh}卦对${sceneMeta.nameZh.replace(/运势|投资|考试|养生|姻缘/, "")}的启示是什么？`, a: data.interpretationZh }]
                    : []),
                  { q: `${data.nameZh}卦的变爻怎么看？`, link: true },
                  { q: `抽到${data.nameZh}卦该怎么办？`, link: true },
                ]
              : [
                  { q: `What does ${data.nameEn} hexagram mean?`, a: data.judgmentEn },
                  { q: `How to interpret ${data.nameEn} in a reading?`, link: true },
                  { q: `What is the advice of ${data.nameEn}?`, a: data.interpretationEn },
                ]
            ).map((item, i) => (
              <details
                key={i}
                className="group bg-[var(--theme-bg-card)] border border-[var(--theme-border)] rounded-lg"
              >
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-[var(--theme-text-primary)] text-sm font-medium hover:text-[var(--color-gold)] transition-colors">
                  {item.q}
                  <span className="text-[var(--theme-text-muted)] group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="px-4 pb-3 text-sm text-[var(--theme-text-muted)] leading-relaxed">
                  {"a" in item && item.a ? (
                    <p className="line-clamp-3">{item.a}</p>
                  ) : (
                    <p>
                      {isZh
                        ? "每个人的情况不同，建议结合自身问题进行占卜解读。"
                        : "Every situation is unique — try a personalized reading for specific guidance."}
                    </p>
                  )}
                  <Link
                    href="/divine"
                    className="inline-flex items-center gap-1 text-amber-500 hover:text-amber-400 mt-2 text-xs font-medium"
                  >
                    <Sparkles className="w-3 h-3" />
                    {isZh ? "AI 深度解读 →" : "Get AI Reading →"}
                  </Link>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Historical Story */}
        {(data.historicalStoryZh || data.historicalStoryEn) && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[var(--color-gold)]/90 mb-3 border-b border-[var(--color-gold)]/20 pb-2">
              {isZh ? "历史典故" : "Historical Story"}
            </h2>
            <p className="text-[var(--theme-text-primary)] leading-relaxed">
              {isZh ? data.historicalStoryZh : data.historicalStoryEn}
            </p>
          </section>
        )}

        {/* Related Hexagrams Note */}
        {data.relatedHexagramsNote && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[var(--color-gold)]/90 mb-3 border-b border-[var(--color-gold)]/20 pb-2">
              {isZh ? "互卦·综卦·错卦" : "Related Trigrams"}
            </h2>
            <p className="text-[var(--theme-text-primary)] leading-relaxed">
              {data.relatedHexagramsNote}
            </p>
          </section>
        )}

        {/* References */}
        {data.references && data.references.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[var(--color-gold)]/90 mb-3 border-b border-[var(--color-gold)]/20 pb-2">
              {isZh ? "引用来源" : "References"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.references.map((ref, i) => (
                <span
                  key={i}
                  className="text-sm text-[var(--theme-text-muted)] bg-[var(--theme-bg-card)] border border-[var(--theme-border)] rounded-lg px-3 py-1"
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
