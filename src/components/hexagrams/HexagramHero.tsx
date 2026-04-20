// Server Component — no 'use client' directive
// Renders the above-the-fold hero section for fast LCP (h1 paints without JS hydration)

import { Breadcrumb } from "@/components/ui";

const TRIGRAM_MAP: Record<string, string> = {
  "111": "☰", "110": "☱", "101": "☲", "100": "☳",
  "011": "☴", "010": "☵", "001": "☶", "000": "☷",
};

function HexagramLines({
  symbol,
  nameZh,
  nameEn,
  number,
}: {
  symbol: string;
  nameZh?: string;
  nameEn?: string;
  number?: number;
}) {
  const altZh = nameZh && number ? `${nameZh}卦卦象 - 第${number}卦` : "卦象";
  const altEn =
    nameEn && number
      ? `Hexagram ${number} ${nameEn} - I Ching symbol`
      : "Hexagram symbol";
  return (
    <div
      className="flex flex-col gap-[5px] items-center my-3"
      role="img"
      aria-label={`${altZh} / ${altEn}`}
    >
      {symbol
        .split("")
        .reverse()
        .map((b, i) => (
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

interface HexagramHeroData {
  number: number;
  nameZh: string;
  nameEn: string;
  symbol: string;
  upperTrigram: string;
  lowerTrigram: string;
}

interface HexagramHeroProps {
  data: HexagramHeroData;
  locale: string;
  hexagramNumber: number;
}

export default function HexagramHero({
  data,
  locale,
  hexagramNumber,
}: HexagramHeroProps) {
  const isZh = locale === "zh" || locale === "zh-TW";
  const upper = TRIGRAM_MAP[data.symbol.slice(3, 6)] || "?";
  const lower = TRIGRAM_MAP[data.symbol.slice(0, 3)] || "?";

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb
        className="mb-6"
        items={[
          { label: isZh ? "六十四卦" : "Hexagrams", href: "/hexagrams" },
          {
            label: isZh
              ? `第${data.number}卦 ${data.nameZh}`
              : `#${data.number} ${data.nameEn}`,
          },
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
        <HexagramLines
          symbol={data.symbol}
          nameZh={data.nameZh}
          nameEn={data.nameEn}
          number={hexagramNumber}
        />
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
    </div>
  );
}
