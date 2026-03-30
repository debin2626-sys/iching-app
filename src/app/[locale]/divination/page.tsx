"use client";


import { useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { getChangingLines } from "@/lib/iching/coins";
import type { LineValue } from "@/lib/iching/coins";
import { linesToBinary, getHexagramNumber } from "@/lib/iching/hexagram";
import { PageLayout, Button, Empty } from "@/components/ui";
import Card from "@/components/ui/Card";

const HEXAGRAM_NAMES: Record<number, { cn: string; en: string }> = {
  1:{cn:"乾",en:"Qian"},2:{cn:"坤",en:"Kun"},3:{cn:"屯",en:"Zhun"},4:{cn:"蒙",en:"Meng"},
  5:{cn:"需",en:"Xu"},6:{cn:"讼",en:"Song"},7:{cn:"师",en:"Shi"},8:{cn:"比",en:"Bi"},
  9:{cn:"小畜",en:"Xiao Xu"},10:{cn:"履",en:"Lü"},11:{cn:"泰",en:"Tai"},12:{cn:"否",en:"Pi"},
  13:{cn:"同人",en:"Tong Ren"},14:{cn:"大有",en:"Da You"},15:{cn:"谦",en:"Qian"},16:{cn:"豫",en:"Yu"},
  17:{cn:"随",en:"Sui"},18:{cn:"蛊",en:"Gu"},19:{cn:"临",en:"Lin"},20:{cn:"观",en:"Guan"},
  21:{cn:"噬嗑",en:"Shi He"},22:{cn:"贲",en:"Bi"},23:{cn:"剥",en:"Bo"},24:{cn:"复",en:"Fu"},
  25:{cn:"无妄",en:"Wu Wang"},26:{cn:"大畜",en:"Da Xu"},27:{cn:"颐",en:"Yi"},28:{cn:"大过",en:"Da Guo"},
  29:{cn:"坎",en:"Kan"},30:{cn:"离",en:"Li"},31:{cn:"咸",en:"Xian"},32:{cn:"恒",en:"Heng"},
  33:{cn:"遁",en:"Dun"},34:{cn:"大壮",en:"Da Zhuang"},35:{cn:"晋",en:"Jin"},36:{cn:"明夷",en:"Ming Yi"},
  37:{cn:"家人",en:"Jia Ren"},38:{cn:"睽",en:"Kui"},39:{cn:"蹇",en:"Jian"},40:{cn:"解",en:"Jie"},
  41:{cn:"损",en:"Sun"},42:{cn:"益",en:"Yi"},43:{cn:"夬",en:"Guai"},44:{cn:"姤",en:"Gou"},
  45:{cn:"萃",en:"Cui"},46:{cn:"升",en:"Sheng"},47:{cn:"困",en:"Kun"},48:{cn:"井",en:"Jing"},
  49:{cn:"革",en:"Ge"},50:{cn:"鼎",en:"Ding"},51:{cn:"震",en:"Zhen"},52:{cn:"艮",en:"Gen"},
  53:{cn:"渐",en:"Jian"},54:{cn:"归妹",en:"Gui Mei"},55:{cn:"丰",en:"Feng"},56:{cn:"旅",en:"Lü"},
  57:{cn:"巽",en:"Xun"},58:{cn:"兑",en:"Dui"},59:{cn:"涣",en:"Huan"},60:{cn:"节",en:"Jie"},
  61:{cn:"中孚",en:"Zhong Fu"},62:{cn:"小过",en:"Xiao Guo"},63:{cn:"既济",en:"Ji Ji"},64:{cn:"未济",en:"Wei Ji"},
};

const YAO_LABELS = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];
const YAO_CN = ["一", "二", "三", "四", "五", "六"];

/* 铜钱组件 */
function Coin({ face, delay, flipping }: { face: number; delay: number; flipping: boolean }) {
  const isFront = face === 3;
  return (
    <m.div
      className="relative w-16 h-16 sm:w-20 sm:h-20"
      style={{ perspective: 600 }}
    >
      <m.div
        className="w-full h-full rounded-full border-2 flex items-center justify-center font-title text-xl sm:text-2xl font-bold select-none"
        style={{
          background: "linear-gradient(145deg, var(--color-gold), var(--color-gold-bright), var(--color-gold-dim))",
          borderColor: "rgba(232,201,106,0.6)",
          boxShadow: "0 0 25px color-mix(in srgb, var(--color-gold) 40%, transparent), inset 0 2px 4px rgba(255,255,255,0.2)",
          color: "#1a1a2e",
        }}
        initial={flipping ? { rotateX: 0, y: 0 } : false}
        animate={
          flipping
            ? { rotateX: [0, 360, 720, 1080], y: [0, -80, -40, 0] }
            : { rotateX: 0, y: 0 }
        }
        transition={flipping ? { duration: 1.2, delay, ease: "easeInOut" } : { duration: 0 }}
      >
        {isFront ? "乾" : "坤"}
      </m.div>
    </m.div>
  );
}

/* 爻线组件 */
function YaoLine({ value, label, isChanging }: { value: LineValue; label: string; isChanging: boolean }) {
  const isYang = value === 7 || value === 9;
  const color = isChanging ? "#ef4444" : "var(--color-gold)";
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-10 text-right opacity-50">{label}</span>
      <div className="flex items-center gap-1">
        {isYang ? (
          <span className="block w-20 sm:w-28 h-2.5 rounded-sm" style={{ background: color }} />
        ) : (
          <>
            <span className="block w-8 sm:w-12 h-2.5 rounded-sm" style={{ background: color }} />
            <span className="block w-4 sm:w-4" />
            <span className="block w-8 sm:w-12 h-2.5 rounded-sm" style={{ background: color }} />
          </>
        )}
      </div>
      {isChanging && <span className="text-red-500 text-xs">🔴</span>}
    </div>
  );
}

function DivinationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tNav = useTranslations("Nav");

  const navItems = [
    { label: tNav("home"), href: "/", icon: <span>🏠</span> },
    { label: tNav("divination"), href: "/divination", icon: <span>🔮</span> },
    { label: tNav("hexagrams"), href: "/hexagrams", icon: <span>📖</span> },
    { label: tNav("history"), href: "/history", icon: <span>📜</span> },
  ];

  // 从 URL 读取首页传来的参数
  const question = searchParams.get("question") || "";
  const birthYear = searchParams.get("by") || "";
  const birthMonth = searchParams.get("bm") || "";
  const birthDay = searchParams.get("bd") || "";
  const birthHour = searchParams.get("bh") || "";

  // 如果没有问题，引导回首页
  const noQuestion = !question.trim();

  const [phase, setPhase] = useState<"shaking" | "done">("shaking");
  const [lines, setLines] = useState<LineValue[]>([]);
  const [currentYao, setCurrentYao] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [coinFaces, setCoinFaces] = useState<number[]>([2, 3, 2]);

  const shakeCoin = useCallback(() => {
    if (flipping || currentYao >= 6) return;
    setFlipping(true);

    const coins: number[] = Array.from({ length: 3 }, () => (Math.random() < 0.5 ? 2 : 3));
    const sum = coins.reduce((a: number, b: number) => a + b, 0) as LineValue;

    setTimeout(() => {
      setCoinFaces(coins);
    }, 600);

    setTimeout(() => {
      setLines((prev) => [...prev, sum]);
      setCurrentYao((prev) => prev + 1);
      setFlipping(false);
      if (currentYao + 1 >= 6) {
        setTimeout(() => setPhase("done"), 800);
      }
    }, 1500);
  }, [flipping, currentYao]);

  const binary = lines.length === 6 ? linesToBinary(lines) : "";
  const hexNum = binary ? getHexagramNumber(binary) : undefined;
  const hexInfo = hexNum ? HEXAGRAM_NAMES[hexNum] : null;
  const changingLines = lines.length === 6 ? getChangingLines(lines) : [];

  const goToResult = () => {
    const params = new URLSearchParams({
      lines: lines.join(","),
      question,
    });
    if (hexNum) params.set("hexagram", String(hexNum));
    if (birthYear && birthMonth && birthDay && birthHour) {
      params.set("by", birthYear);
      params.set("bm", birthMonth);
      params.set("bd", birthDay);
      params.set("bh", birthHour);
    }
    router.push(`/result?${params.toString()}`);
  };

  const resetAndGoHome = () => {
    router.push("/");
  };

  // 没有问题时，用 Empty 组件提示
  if (noQuestion) {
    return (
      <PageLayout navItems={navItems} maxWidth="max-w-lg">
        <Empty
          icon={<span>🔮</span>}
          title="请先输入您的问题"
          description="在首页输入您想占卜的问题后，再来此页摇卦"
          action={<Button variant="primary" href="/">返回首页</Button>}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout navItems={navItems} maxWidth="max-w-lg">
      <div className="flex flex-col items-center py-6 sm:py-10">
        {/* 顶部装饰 */}
        <m.div
          className="mb-2 text-4xl opacity-30 animate-pulse-glow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
        >
          ☰
        </m.div>

        {/* 问题回显 */}
        <p className="text-xs text-amber-400/40 mb-6 tracking-wide max-w-md text-center truncate">
          「{question}」
        </p>

        {/* 步骤指示器 */}
        <div className="flex items-center gap-3 mb-10">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                  (s === 1 && phase === "shaking") || (s <= 2 && phase === "done")
                    ? "bg-[var(--gold)] shadow-[0_0_10px_color-mix(in_srgb,var(--color-gold)_50%,transparent)]"
                    : "bg-white/10"
                }`}
              />
              {s < 2 && (
                <div className={`w-8 h-px transition-all duration-500 ${
                  phase === "done" ? "bg-[var(--gold)]/40" : "bg-white/10"
                }`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ═══ 摇卦阶段 ═══ */}
          {phase === "shaking" && (
            <m.div
              key="shaking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full text-center"
            >
              <h1 className="font-title text-2xl sm:text-3xl text-gold-glow mb-1">
                第{YAO_CN[Math.min(currentYao, 5)]}爻
              </h1>
              <p className="text-xs opacity-30 mb-6 tracking-wide">
                {currentYao < 6 ? `${currentYao} / 6 已完成` : "六爻已成"}
              </p>

              <div className="divider-gold mb-8" />

              {/* 铜钱区域 */}
              <Card variant="elevated" className="mb-6">
                <div className="flex justify-center gap-4 sm:gap-6 mb-6 min-h-[80px] sm:min-h-[96px] items-center">
                  {[0, 1, 2].map((i) => (
                    <Coin key={i} face={coinFaces[i]} delay={i * 0.15} flipping={flipping} />
                  ))}
                </div>

                {/* 当前爻结果提示 */}
                {lines.length > 0 && !flipping && (
                  <m.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-sm opacity-50 mb-2"
                  >
                    {(() => {
                      const last = lines[lines.length - 1];
                      const isYang = last === 7 || last === 9;
                      const isChanging = last === 6 || last === 9;
                      return `${isYang ? "阳爻 ▬▬▬" : "阴爻 ▬ ▬"}${isChanging ? "（动爻）" : ""}`;
                    })()}
                  </m.div>
                )}
              </Card>

              {/* 已完成的爻（从下往上） */}
              {lines.length > 0 && (
                <Card className="mb-6">
                  <div className="flex flex-col items-center gap-2">
                    {[...lines].reverse().map((v, ri) => {
                      const i = lines.length - 1 - ri;
                      const isChanging = v === 6 || v === 9;
                      return (
                        <m.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <YaoLine value={v} label={YAO_LABELS[i]} isChanging={isChanging} />
                        </m.div>
                      );
                    })}
                  </div>
                </Card>
              )}

              <Button
                variant="primary"
                size="lg"
                onClick={shakeCoin}
                disabled={flipping || currentYao >= 6}
                loading={flipping}
              >
                {flipping ? "摇卦中…" : currentYao >= 6 ? "卦象已成" : "摇 卦"}
              </Button>
            </m.div>
          )}

          {/* ═══ 卦象生成 ═══ */}
          {phase === "done" && (
            <m.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full text-center"
            >
              <m.p
                className="text-xs tracking-[0.3em] opacity-30 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 0.3 }}
              >
                卦象已成
              </m.p>

              {/* 卦名 */}
              <m.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h1 className="font-title text-5xl sm:text-6xl text-gold-glow mb-2">
                  {hexInfo?.cn ?? "未知"}
                </h1>
                <p className="text-sm opacity-40 tracking-widest mb-1">
                  {hexInfo?.en ?? ""} · 第{hexNum}卦
                </p>
                {changingLines.length > 0 && (
                  <p className="text-red-400/80 text-sm mt-2">
                    动爻：{changingLines.map((i) => YAO_LABELS[i]).join("、")}
                  </p>
                )}
              </m.div>

              <div className="divider-gold my-6" />

              {/* 六爻图 */}
              <m.div
                className="inline-block mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Card variant="elevated" className="inline-block">
                  <div className="flex flex-col items-center gap-3">
                    {[...lines].reverse().map((v, ri) => {
                      const i = 5 - ri;
                      const isChanging = v === 6 || v === 9;
                      return (
                        <m.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + ri * 0.1 }}
                        >
                          <YaoLine value={v} label={YAO_LABELS[i]} isChanging={isChanging} />
                        </m.div>
                      );
                    })}
                  </div>
                </Card>
              </m.div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="primary" size="lg" onClick={goToResult}>
                  查看解读
                </Button>
                <Button variant="secondary" onClick={resetAndGoHome}>
                  重新占卜
                </Button>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}

export default function DivinationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-spin">☯</div>
      </div>
    }>
      <DivinationContent />
    </Suspense>
  );
}
