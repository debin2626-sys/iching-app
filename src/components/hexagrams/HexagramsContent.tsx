"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { PageLayout, Input, Empty } from "@/components/ui";
import { Link } from "@/i18n/navigation";

const H = [
  [1,"乾","Qián","The Creative","111111"],[2,"坤","Kūn","The Receptive","000000"],
  [3,"屯","Zhūn","Difficulty","100010"],[4,"蒙","Méng","Youthful Folly","010001"],
  [5,"需","Xū","Waiting","111010"],[6,"讼","Sòng","Conflict","010111"],
  [7,"师","Shī","The Army","010000"],[8,"比","Bǐ","Holding Together","000010"],
  [9,"小畜","Xiǎo Chù","Small Taming","111011"],[10,"履","Lǚ","Treading","110111"],
  [11,"泰","Tài","Peace","111000"],[12,"否","Pǐ","Standstill","000111"],
  [13,"同人","Tóng Rén","Fellowship","101111"],[14,"大有","Dà Yǒu","Great Possession","111101"],
  [15,"谦","Qiān","Modesty","001000"],[16,"豫","Yù","Enthusiasm","000100"],
  [17,"随","Suí","Following","100110"],[18,"蛊","Gǔ","Decay","011001"],
  [19,"临","Lín","Approach","110000"],[20,"观","Guān","Contemplation","000011"],
  [21,"噬嗑","Shì Kè","Biting Through","100101"],[22,"贲","Bì","Grace","101001"],
  [23,"剥","Bō","Splitting Apart","000001"],[24,"复","Fù","Return","100000"],
  [25,"无妄","Wú Wàng","Innocence","100111"],[26,"大畜","Dà Chù","Great Taming","111001"],
  [27,"颐","Yí","Nourishment","100001"],[28,"大过","Dà Guò","Great Excess","011110"],
  [29,"坎","Kǎn","The Abysmal","010010"],[30,"离","Lí","The Clinging","101101"],
  [31,"咸","Xián","Influence","001110"],[32,"恒","Héng","Duration","011100"],
  [33,"遁","Dùn","Retreat","001111"],[34,"大壮","Dà Zhuàng","Great Power","111100"],
  [35,"晋","Jìn","Progress","000101"],[36,"明夷","Míng Yí","Darkening","101000"],
  [37,"家人","Jiā Rén","The Family","101011"],[38,"睽","Kuí","Opposition","110101"],
  [39,"蹇","Jiǎn","Obstruction","001010"],[40,"解","Xiè","Deliverance","010100"],
  [41,"损","Sǔn","Decrease","110001"],[42,"益","Yì","Increase","100011"],
  [43,"夬","Guài","Breakthrough","111110"],[44,"姤","Gòu","Coming to Meet","011111"],
  [45,"萃","Cuì","Gathering","000110"],[46,"升","Shēng","Pushing Upward","011000"],
  [47,"困","Kùn","Oppression","010110"],[48,"井","Jǐng","The Well","011010"],
  [49,"革","Gé","Revolution","101110"],[50,"鼎","Dǐng","The Cauldron","011101"],
  [51,"震","Zhèn","The Arousing","100100"],[52,"艮","Gèn","Keeping Still","001001"],
  [53,"渐","Jiàn","Development","001011"],[54,"归妹","Guī Mèi","The Marrying Maiden","110100"],
  [55,"丰","Fēng","Abundance","101100"],[56,"旅","Lǚ","The Wanderer","001101"],
  [57,"巽","Xùn","The Gentle","011011"],[58,"兑","Duì","The Joyous","110110"],
  [59,"涣","Huàn","Dispersion","010011"],[60,"节","Jié","Limitation","110010"],
  [61,"中孚","Zhōng Fú","Inner Truth","110011"],[62,"小过","Xiǎo Guò","Small Excess","001100"],
  [63,"既济","Jì Jì","After Completion","101010"],[64,"未济","Wèi Jì","Before Completion","010101"],
] as const;

// Chinese traditional hexagram names (传统卦名)
const ZH_TRADITIONAL_NAMES: Record<number, string> = {
  1: "乾为天", 2: "坤为地", 3: "水雷屯", 4: "山水蒙",
  5: "水天需", 6: "天水讼", 7: "地水师", 8: "水地比",
  9: "风天小畜", 10: "天泽履", 11: "地天泰", 12: "天地否",
  13: "天火同人", 14: "火天大有", 15: "地山谦", 16: "雷地豫",
  17: "泽雷随", 18: "山风蛊", 19: "地泽临", 20: "风地观",
  21: "火雷噬嗑", 22: "山火贲", 23: "山地剥", 24: "地雷复",
  25: "天雷无妄", 26: "山天大畜", 27: "山雷颐", 28: "泽风大过",
  29: "坎为水", 30: "离为火", 31: "泽山咸", 32: "雷风恒",
  33: "天山遁", 34: "雷天大壮", 35: "火地晋", 36: "地火明夷",
  37: "风火家人", 38: "火泽睽", 39: "水山蹇", 40: "雷水解",
  41: "山泽损", 42: "风雷益", 43: "泽天夬", 44: "天风姤",
  45: "泽地萃", 46: "地风升", 47: "泽水困", 48: "水风井",
  49: "泽火革", 50: "火风鼎", 51: "震为雷", 52: "艮为山",
  53: "风山渐", 54: "雷泽归妹", 55: "雷火丰", 56: "火山旅",
  57: "巽为风", 58: "兑为泽", 59: "风水涣", 60: "水泽节",
  61: "风泽中孚", 62: "雷山小过", 63: "水火既济", 64: "火水未济",
};

// Map 3-bit trigram binary to Unicode trigram symbol
const TRIGRAM_MAP: Record<string, string> = {
  "111": "☰", "110": "☱", "101": "☲", "100": "☳",
  "011": "☴", "010": "☵", "001": "☶", "000": "☷",
};

function getTrigrams(sym: string): { upper: string; lower: string } {
  const lower = sym.slice(0, 3);
  const upper = sym.slice(3, 6);
  return {
    lower: TRIGRAM_MAP[lower] || "?",
    upper: TRIGRAM_MAP[upper] || "?",
  };
}

function Lines({ s, nameZh, nameEn, number }: { s: string; nameZh?: string; nameEn?: string; number?: number }) {
  const label = nameZh && number
    ? `${nameZh}卦 - 第${number}卦 / Hexagram ${number} ${nameEn || ''}`
    : "卦象";
  return (
    <div className="flex flex-col gap-[3px] items-center my-1.5" role="img" aria-label={label}>
      {s.split("").reverse().map((b, i) => (
        <div key={i} className="flex gap-[3px] justify-center w-8">
          {b === "1" ? (
            <div className="h-[4px] w-8 bg-amber-400 rounded-sm" />
          ) : (
            <>
              <div className="h-[4px] w-[14px] bg-amber-400 rounded-sm" />
              <div className="h-[4px] w-[14px] bg-amber-400 rounded-sm" />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

export default function HexagramsContent() {
  const t = useTranslations("Hexagrams");
  const tNav = useTranslations("Nav");
  const locale = useLocale();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return [...H];
    return H.filter(([num, zh, py, en]) => {
      const traditionalName = ZH_TRADITIONAL_NAMES[num] || "";
      return (
        zh.includes(s) ||
        py.toLowerCase().includes(s) ||
        en.toLowerCase().includes(s) ||
        traditionalName.includes(s)
      );
    });
  }, [q]);

  const navItems = [
    { label: tNav("home"), href: "/", icon: <span>🏠</span> },
    { label: tNav("divination"), href: "/divine", icon: <span>🔮</span> },
    { label: tNav("hexagrams"), href: "/hexagrams", icon: <span>📖</span> },
  ];

  return (
    <PageLayout navItems={navItems} maxWidth="max-w-7xl">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-3">
          <span className="text-amber-400">{t("title")}</span>{" "}
          <span className="text-gray-400">/ {t("subtitle")}</span>
        </h1>
        <p className="text-center text-gray-500 text-lg mb-8">{t("clickHint")}</p>

        <div style={{ maxWidth: '600px', width: '100%', margin: '0 auto 40px auto' }}>
          <Input
            type="text"
            size="lg"
            placeholder={t("searchPlaceholder")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-12 border-[rgba(201,169,110,0.3)]"
          />
        </div>

        {/* Grid: 2 cols mobile, 3 cols sm, 4 cols lg */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map(([num, zh, , en, sym]) => {
              const { upper, lower } = getTrigrams(sym);
              const displayName = locale === "en"
                ? en
                : (ZH_TRADITIONAL_NAMES[num] || zh);
              return (
                <motion.div
                  key={num}
                  layout
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <Link href={`/hexagrams/${num}`}>
                  <div
                    className="group relative flex flex-col items-center rounded-[12px] bg-[var(--bg-card)] border border-gold/15 backdrop-blur-[12px] p-6 cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-1.5 hover:border-amber-400/50 hover:shadow-[0_0_24px_rgba(201,169,110,0.18),0_8px_24px_rgba(0,0,0,0.3)]"
                  >
                    <span className="text-xs text-gray-600 mb-1.5">#{num}</span>

                    {/* Trigram icons */}
                    <div className="flex items-center gap-1.5 text-amber-500/60 text-base mb-1.5">
                      <span>{upper}</span>
                      <span>{lower}</span>
                    </div>

                    {/* Hexagram lines */}
                    <div className="transition-transform duration-300 group-hover:scale-110">
                      <Lines s={sym} nameZh={zh} nameEn={en} number={num} />
                    </div>

                    <span className="text-xl font-semibold text-amber-400 mt-2 group-hover:text-amber-300 transition-colors duration-300">
                      {zh}
                    </span>
                    <span className="text-sm text-gray-500 leading-tight mt-0.5 text-center">
                      {displayName}
                    </span>
                  </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Empty
                icon={<span>🔍</span>}
                title={t("noResult")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}
