"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight, Briefcase, Heart, DollarSign, GraduationCap, Leaf, Sparkles } from "lucide-react";
import {
  getMutualHexagram,
  getReversedHexagram,
  getComplementaryHexagram,
  getHexagramData,
} from "@/lib/iching/relations";
import { SCENARIO_IDS, SCENARIO_HEXAGRAMS, SCENARIO_META, type ScenarioId } from "@/data/scenarios";

const SCENE_ICONS = {
  career: Briefcase,
  love: Heart,
  wealth: DollarSign,
  study: GraduationCap,
  health: Leaf,
} as const;

interface RelatedHexagramsProps {
  hexagramNumber: number;
  symbol: string;
}

function RelatedLink({ num, label }: { num: number | null; label: string }) {
  const locale = useLocale();
  const isZh = locale !== "en";

  if (!num) return null;
  const hex = getHexagramData(num);
  if (!hex) return null;

  return (
    <Link
      href={`/hexagrams/${num}`}
      className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[var(--theme-bg-card)] border border-[var(--theme-border)] hover:border-[var(--color-gold)]/40 hover:bg-[var(--theme-bg-elevated)] transition-all duration-300"
    >
      <span className="text-xs text-gray-500 shrink-0">{label}</span>
      <span className="text-[var(--color-gold)] font-medium">
        {isZh ? `${hex.nameZh}卦` : hex.nameEn}
      </span>
      <span className="text-xs text-gray-600">#{num}</span>
    </Link>
  );
}

export default function RelatedHexagrams({ hexagramNumber, symbol }: RelatedHexagramsProps) {
  const locale = useLocale();
  const isZh = locale !== "en";
  const isZhTW = locale === "zh-TW";

  const prevNum = hexagramNumber > 1 ? hexagramNumber - 1 : 64;
  const nextNum = hexagramNumber < 64 ? hexagramNumber + 1 : 1;

  const mutualNum = getMutualHexagram(symbol);
  const reversedNum = getReversedHexagram(symbol);
  const complementaryNum = getComplementaryHexagram(symbol);
  const showReversed = reversedNum !== null && reversedNum !== hexagramNumber;

  // Find which scenarios this hexagram belongs to
  const belongsToScenes = SCENARIO_IDS.filter((s) =>
    SCENARIO_HEXAGRAMS[s].includes(hexagramNumber)
  );

  // Pick up to 3 related hexagrams from the first matching scene (excluding self)
  const firstScene = belongsToScenes[0];
  const sameSceneHexNums = firstScene
    ? SCENARIO_HEXAGRAMS[firstScene]
        .filter((n) => n !== hexagramNumber)
        .slice(0, 3)
    : [];

  return (
    <div className="mt-10 space-y-8">
      {/* Scene tags */}
      {belongsToScenes.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-[var(--color-gold)]/70 mb-3 uppercase tracking-wide">
            {isZh ? "所属场景" : "Life Scenarios"}
          </h2>
          <div className="flex flex-wrap gap-2">
            {belongsToScenes.map((s) => {
              const meta = SCENARIO_META[s];
              const Icon = SCENE_ICONS[s];
              const name = isZh
                ? isZhTW ? meta.nameZhTW : meta.nameZh
                : meta.nameEn;
              return (
                <Link
                  key={s}
                  href={`/scenarios/${s}`}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${meta.bgColor} ${meta.color} hover:opacity-80 transition-opacity`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {name}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Related hexagrams (mutual/reversed/complementary) */}
      <div>
        <h2 className="text-lg font-bold text-[var(--color-gold)]/80 mb-4 border-b border-[var(--color-gold)]/20 pb-2">
          {isZh ? "相关卦象" : "Related Hexagrams"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {mutualNum && mutualNum !== hexagramNumber && (
            <RelatedLink num={mutualNum} label={isZh ? "互卦" : "Mutual"} />
          )}
          {showReversed && (
            <RelatedLink num={reversedNum} label={isZh ? "综卦" : "Reversed"} />
          )}
          {complementaryNum && complementaryNum !== hexagramNumber && (
            <RelatedLink num={complementaryNum} label={isZh ? "错卦" : "Complement"} />
          )}
        </div>
      </div>

      {/* Extended reading — same scene hexagrams */}
      {sameSceneHexNums.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-[var(--color-gold)]/80 mb-4 border-b border-[var(--color-gold)]/20 pb-2">
            {isZh ? "延伸阅读" : "Further Reading"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sameSceneHexNums.map((n) => {
              const hex = getHexagramData(n);
              if (!hex) return null;
              const name = isZh ? (isZhTW ? (hex.nameZhTW || hex.nameZh) : hex.nameZh) : hex.nameEn;
              const interp = isZh
                ? isZhTW ? (hex.interpretationZhTW || hex.interpretationZh) : hex.interpretationZh
                : hex.interpretationEn;
              return (
                <Link
                  key={n}
                  href={`/hexagrams/${n}`}
                  className="flex flex-col gap-1 px-4 py-3 rounded-lg bg-[var(--theme-bg-card)] border border-[var(--theme-border)] hover:border-[var(--color-gold)]/40 hover:bg-[var(--theme-bg-elevated)] transition-all duration-300"
                >
                  <span className="text-[var(--color-gold)] font-medium text-sm">
                    {isZh ? `${name}卦` : name}
                    <span className="text-xs text-gray-500 ml-1">#{n}</span>
                  </span>
                  <span className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {interp}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="rounded-xl bg-[var(--theme-bg-card)] border border-[var(--color-gold)]/20 p-5 text-center">
        <p className="text-sm text-[var(--theme-text-muted)] mb-3">
          {isZh
            ? "想知道这个卦象对你的具体指引？"
            : "Want personalized guidance from this hexagram?"}
        </p>
        <Link
          href="/divine"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          <Sparkles className="w-4 h-4" />
          {isZh ? "开始占卜" : "Start Divination"}
        </Link>
      </div>

      {/* Prev / Next navigation */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-800">
        <Link
          href={`/hexagrams/${prevNum}`}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-[var(--color-gold)] transition-colors"
        >
          <ChevronLeft size={16} />
          {isZh ? `第${prevNum}卦` : `Hexagram ${prevNum}`}
        </Link>
        <Link
          href={`/hexagrams/${nextNum}`}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-[var(--color-gold)] transition-colors"
        >
          {isZh ? `第${nextNum}卦` : `Hexagram ${nextNum}`}
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
