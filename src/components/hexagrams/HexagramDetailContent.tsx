"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageLayout } from "@/components/ui";

interface HexagramLine {
  position: number;
  textZh: string;
  textEn: string;
  interpretationZh: string;
  interpretationEn: string;
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
}

const TRIGRAM_MAP: Record<string, string> = {
  "111": "☰", "110": "☱", "101": "☲", "100": "☳",
  "011": "☴", "010": "☵", "001": "☶", "000": "☷",
};

function HexagramLines({ symbol }: { symbol: string }) {
  return (
    <div className="flex flex-col gap-[5px] items-center my-3">
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
  const isZh = locale === "zh";
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
  const prevNum = hexagramNumber > 1 ? hexagramNumber - 1 : 64;
  const nextNum = hexagramNumber < 64 ? hexagramNumber + 1 : 1;

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
          <HexagramLines symbol={data.symbol} />
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

        {/* Judgment */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-amber-400/90 mb-3 border-b border-amber-400/20 pb-2">
            {isZh ? "卦辞" : "Judgment"}
          </h2>
          <p className="text-[#f5f0e8] leading-relaxed text-lg">
            {isZh ? data.judgmentZh : data.judgmentEn}
          </p>
        </section>

        {/* Image */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-amber-400/90 mb-3 border-b border-amber-400/20 pb-2">
            {isZh ? "象辞" : "Image"}
          </h2>
          <p className="text-[#f5f0e8] leading-relaxed text-lg">
            {isZh ? data.imageZh : data.imageEn}
          </p>
        </section>

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
              {data.lines.map((line) => (
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
                </div>
              ))}
            </div>
          </section>
        )}

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
    </PageLayout>
  );
}
