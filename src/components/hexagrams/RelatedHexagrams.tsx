"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  getMutualHexagram,
  getReversedHexagram,
  getComplementaryHexagram,
  getHexagramData,
} from "@/lib/iching/relations";

interface RelatedHexagramsProps {
  hexagramNumber: number;
  symbol: string;
}

function RelatedLink({
  num,
  label,
}: {
  num: number | null;
  label: string;
}) {
  const locale = useLocale();
  const isZh = locale === "zh";

  if (!num) return null;
  const hex = getHexagramData(num);
  if (!hex) return null;

  return (
    <Link
      href={`/hexagrams/${num}`}
      className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(201,169,110,0.12)] hover:border-amber-400/40 hover:bg-[rgba(201,169,110,0.05)] transition-all duration-300"
    >
      <span className="text-xs text-gray-500 shrink-0">{label}</span>
      <span className="text-amber-400 font-medium">
        {isZh ? `${hex.nameZh}卦` : hex.nameEn}
      </span>
      <span className="text-xs text-gray-600">#{num}</span>
    </Link>
  );
}

export default function RelatedHexagrams({ hexagramNumber, symbol }: RelatedHexagramsProps) {
  const locale = useLocale();
  const isZh = locale === "zh";

  const prevNum = hexagramNumber > 1 ? hexagramNumber - 1 : 64;
  const nextNum = hexagramNumber < 64 ? hexagramNumber + 1 : 1;

  const mutualNum = getMutualHexagram(symbol);
  const reversedNum = getReversedHexagram(symbol);
  const complementaryNum = getComplementaryHexagram(symbol);

  // Don't show reversed if it's the same hexagram (symmetric hexagrams)
  const showReversed = reversedNum !== null && reversedNum !== hexagramNumber;

  return (
    <div className="mt-10">
      {/* Related hexagrams */}
      <h2 className="text-lg font-bold text-amber-400/80 mb-4 border-b border-amber-400/20 pb-2">
        {isZh ? "相关卦象" : "Related Hexagrams"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {mutualNum && mutualNum !== hexagramNumber && (
          <RelatedLink
            num={mutualNum}
            label={isZh ? "互卦" : "Mutual"}
          />
        )}
        {showReversed && (
          <RelatedLink
            num={reversedNum}
            label={isZh ? "综卦" : "Reversed"}
          />
        )}
        {complementaryNum && complementaryNum !== hexagramNumber && (
          <RelatedLink
            num={complementaryNum}
            label={isZh ? "错卦" : "Complement"}
          />
        )}
      </div>

      {/* Prev / Next navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-800">
        <Link
          href={`/hexagrams/${prevNum}`}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-amber-400 transition-colors"
        >
          <ChevronLeft size={16} />
          {isZh ? `第${prevNum}卦` : `Hexagram ${prevNum}`}
        </Link>
        <Link
          href={`/hexagrams/${nextNum}`}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-amber-400 transition-colors"
        >
          {isZh ? `第${nextNum}卦` : `Hexagram ${nextNum}`}
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
