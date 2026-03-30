"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { PageLayout, Input, Empty } from "@/components/ui";

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

// Map 3-bit trigram binary to Unicode trigram symbol
// ☰ 乾(111) ☱ 兑(110) ☲ 离(101) ☳ 震(100) ☴ 巽(011) ☵ 坎(010) ☶ 艮(001) ☷ 坤(000)
const TRIGRAM_MAP: Record<string, string> = {
  "111": "☰",
  "110": "☱",
  "101": "☲",
  "100": "☳",
  "011": "☴",
  "010": "☵",
  "001": "☶",
  "000": "☷",
};

function getTrigrams(sym: string): { upper: string; lower: string } {
  const lower = sym.slice(0, 3); // lines 1-3 (bottom)
  const upper = sym.slice(3, 6); // lines 4-6 (top)
  return {
    lower: TRIGRAM_MAP[lower] || "?",
    upper: TRIGRAM_MAP[upper] || "?",
  };
}

function Lines({ s }: { s: string }) {
  return (
    <div className="flex flex-col gap-[3px] items-center my-1.5">
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

export default function HexagramsPage() {
  const tNav = useTranslations("Nav");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return [...H];
    return H.filter(([, zh, py, en]) =>
      zh.includes(s) || py.toLowerCase().includes(s) || en.toLowerCase().includes(s)
    );
  }, [q]);

  const navItems = [
    { label: tNav("divination"), href: "/", icon: <span>🔮</span> },
    { label: tNav("hexagrams"), href: "/hexagrams", icon: <span>📖</span> },
    { label: tNav("history"), href: "/history", icon: <span>📜</span> },
  ];

  return (
    <PageLayout navItems={navItems} maxWidth="max-w-7xl">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-3">
        <span className="text-amber-400">六十四卦典</span>{" "}
        <span className="text-gray-400">/ 64 Hexagrams</span>
      </h1>
      <p className="text-center text-gray-500 text-lg mb-8">点击卦象查看详情</p>

      <div className="max-w-lg mx-auto mb-10">
        <Input
          type="text"
          size="lg"
          placeholder="搜索卦名 / Search hexagram..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {/* Grid: 2 cols mobile, 3 cols sm, 4 cols lg */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map(([num, zh, py, en, sym]) => {
            const { upper, lower } = getTrigrams(sym);
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
                <div
                  onClick={() => alert(`${num}. ${zh} (${en})\n即将跳转到 /hexagrams/${num}`)}
                  className="group relative flex flex-col items-center rounded-[12px] bg-[var(--bg-card)] border border-gold/10 backdrop-blur-[4px] p-6 cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-1.5 hover:border-amber-400/50 hover:shadow-[0_0_20px_rgba(217,169,56,0.15),0_8px_24px_rgba(0,0,0,0.3)]"
                >
                  <span className="text-xs text-gray-600 mb-1.5">#{num}</span>

                  {/* Trigram icons */}
                  <div className="flex items-center gap-1.5 text-amber-500/60 text-base mb-1.5">
                    <span>{upper}</span>
                    <span>{lower}</span>
                  </div>

                  {/* Hexagram lines - scale on hover */}
                  <div className="transition-transform duration-300 group-hover:scale-110">
                    <Lines s={sym} />
                  </div>

                  <span className="text-xl font-semibold text-amber-400 mt-2 group-hover:text-amber-300 transition-colors duration-300">
                    {zh}
                  </span>
                  <span className="text-sm text-gray-500 leading-tight mt-0.5">{en}</span>
                </div>
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
              title="无匹配结果 / No results found"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
