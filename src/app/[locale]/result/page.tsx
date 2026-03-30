"use client";


import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { calculateBazi, type BirthInfo } from "@/lib/iching/bazi";
import { PageLayout, Button, Skeleton } from "@/components/ui";
import Card from "@/components/ui/Card";
import type { LineValue } from "@/lib/iching/coins";
import {
  linesToBinary,
  getHexagramNumber,
  getChangedHexagram,
  TRIGRAM_NAMES,
} from "@/lib/iching/hexagram";
import { getChangingLines } from "@/lib/iching/coins";

/* ── 卦象名称映射 ── */
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

/* ── 数据库卦象数据类型 ── */
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

/* ── 获取卦象数据 hook ── */
function useHexagramData(hexNum: number | null) {
  const [data, setData] = useState<HexagramData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async (num: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/hexagram/${num}`);
      if (!res.ok) throw new Error(`获取卦辞失败 (${res.status})`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取卦辞失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hexNum && hexNum >= 1 && hexNum <= 64) {
      fetchData(hexNum);
    }
  }, [hexNum, fetchData]);

  return { data, loading, error };
}

/* ── 六爻图组件 ── */
function HexagramDiagram({ lines }: { lines: LineValue[] }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {[...lines].reverse().map((v, ri) => {
        const i = 5 - ri;
        const isYang = v === 7 || v === 9;
        const isChanging = v === 6 || v === 9;
        const color = isChanging ? "#ef4444" : "var(--color-gold)";
        return (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs w-10 text-right opacity-50">{YAO_LABELS[i]}</span>
            <div className="flex items-center gap-1">
              {isYang ? (
                <span className="block w-20 sm:w-28 h-2.5 rounded-sm" style={{ background: color }} />
              ) : (
                <>
                  <span className="block w-8 sm:w-12 h-2.5 rounded-sm" style={{ background: color }} />
                  <span className="block w-4" />
                  <span className="block w-8 sm:w-12 h-2.5 rounded-sm" style={{ background: color }} />
                </>
              )}
            </div>
            {isChanging && <span className="text-red-500 text-xs">🔴</span>}
          </div>
        );
      })}
    </div>
  );
}

/* ── 八字信息卡组件 ── */
function BaziCard({ birthInfo }: { birthInfo: BirthInfo }) {
  const bazi = calculateBazi(birthInfo);
  const pillars = [
    { label: "年柱", pillar: bazi.yearPillar },
    { label: "月柱", pillar: bazi.monthPillar },
    { label: "日柱", pillar: bazi.dayPillar },
    { label: "时柱", pillar: bazi.hourPillar },
  ];

  return (
    <Card variant="default" padding="lg">
      <h3 className="text-lg font-title text-amber-300 mb-4">🌙 命主信息</h3>
      <div className="grid grid-cols-4 gap-3 text-center mb-4">
        {pillars.map(({ label, pillar }) => (
          <div key={label}>
            <p className="text-xs text-zinc-500 mb-1">{label}</p>
            <p className="text-lg font-title text-amber-400">
              {pillar.gan}{pillar.zhi}
            </p>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 flex-wrap mb-3">
        {Object.entries(bazi.wuxing).map(([element, count]) => (
          <span
            key={element}
            className={`text-xs px-2 py-0.5 rounded-full border ${
              count === 0
                ? "border-zinc-700 text-zinc-600"
                : "border-amber-600/30 text-amber-400/80"
            }`}
          >
            {element} {count}
          </span>
        ))}
      </div>
      <p className="text-xs text-zinc-500 text-center">
        日主 {bazi.dayMaster}（{bazi.dayMasterElement}）· {bazi.strength}
      </p>
    </Card>
  );
}

/* ── 打字机 hook ── */
function useTypewriter(fullText: string, streamDone: boolean) {
  const [displayCount, setDisplayCount] = useState(0);
  const prevLenRef = useRef(0);

  useEffect(() => {
    if (displayCount >= fullText.length) return;
    const id = setInterval(() => {
      setDisplayCount((c) => {
        const next = c + 1;
        if (next >= fullText.length) clearInterval(id);
        return next;
      });
    }, 35);
    return () => clearInterval(id);
  }, [fullText, displayCount]);

  // When new streaming content arrives, keep displayCount behind to create typewriter gap
  useEffect(() => {
    if (fullText.length > prevLenRef.current && displayCount >= prevLenRef.current) {
      // new chunk arrived — typewriter interval will catch up naturally
    }
    prevLenRef.current = fullText.length;
  }, [fullText.length, displayCount]);

  const displayText = fullText.slice(0, displayCount);
  const isTyping = displayCount < fullText.length;
  const showCursor = isTyping || (!streamDone && fullText.length > 0);

  return { displayText, showCursor };
}

/* ── AI 解读区组件 ── */
function AISection({
  hexagramNumber,
  changingLines,
  question,
  birthInfo,
  gender,
}: {
  hexagramNumber: number;
  changingLines: number[];
  question: string;
  birthInfo: BirthInfo | null;
  gender: string;
}) {
  const t = useTranslations("Result");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamDone, setStreamDone] = useState(false);
  const [error, setError] = useState("");
  const hasFetched = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const { displayText, showCursor } = useTypewriter(content, streamDone);

  // Auto-scroll to bottom while typing
  useEffect(() => {
    if (!contentRef.current) return;
    const el = contentRef.current;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (isNearBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, [displayText]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchAI = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/ai/interpret", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hexagramNumber,
            changingLines,
            question,
            locale: "zh",
            birthInfo,
            gender: gender || undefined,
          }),
        });

        if (!res.ok) throw new Error(`AI 请求失败 (${res.status})`);

        const reader = res.body?.getReader();
        if (!reader) throw new Error("无法读取响应流");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6).trim();
            if (payload === "[DONE]") break;
            try {
              const parsed = JSON.parse(payload);
              if (parsed.content) {
                setContent((prev) => prev + parsed.content);
              }
              if (parsed.error) {
                setError(parsed.error);
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "AI 解读失败");
      } finally {
        setLoading(false);
        setStreamDone(true);
      }
    };

    fetchAI();
  }, [hexagramNumber, changingLines, question, birthInfo]);

  const title = birthInfo ? t("aiTitleWithBazi") : t("aiTitle");
  const disclaimer = birthInfo ? t("aiDisclaimerWithBazi") : t("aiDisclaimer");

  return (
    <Card variant="default" padding="lg">
      <h3 className="text-lg font-title text-amber-300 mb-2">🤖 {title}</h3>
      <p className="text-xs text-zinc-600 mb-4">{disclaimer}</p>

      {loading && !content && <Skeleton variant="text" lines={3} />}

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {content && (
        <div
          ref={contentRef}
          className="prose prose-invert prose-sm max-w-none text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-[60vh] overflow-y-auto"
        >
          {displayText}
          {showCursor && (
            <span className="inline-block animate-pulse text-amber-400 ml-0.5">▌</span>
          )}
        </div>
      )}
    </Card>
  );
}

/* ── 结果页主体 ── */
function ResultContent() {
  const searchParams = useSearchParams();
  const t = useTranslations("Result");
  const tNav = useTranslations("Nav");

  const navItems = [
    { label: tNav("divination"), href: "/", icon: <span>🔮</span> },
    { label: tNav("hexagrams"), href: "/hexagrams", icon: <span>📖</span> },
    { label: tNav("history"), href: "/history", icon: <span>📜</span> },
  ];

  /* ── URL 参数解析 ── */
  const question = searchParams.get("question") || "";
  const linesParam = searchParams.get("lines") || "";
  const hexParam = searchParams.get("hexagram");
  const birthYear = searchParams.get("by");
  const birthMonth = searchParams.get("bm");
  const birthDay = searchParams.get("bd");
  const birthHour = searchParams.get("bh");
  const gender = searchParams.get("gender") || "";

  /* 解析爻值 */
  const lines: LineValue[] = linesParam
    ? (linesParam.split(",").map(Number).filter((n) => [6, 7, 8, 9].includes(n)) as LineValue[])
    : [];

  /* 卦号：优先 URL 参数，否则从爻值计算 */
  const hexNum =
    hexParam ? Number(hexParam) :
    lines.length === 6 ? getHexagramNumber(linesToBinary(lines)) ?? null :
    null;

  const hexInfo = hexNum ? HEXAGRAM_NAMES[hexNum] : null;
  const changingLines = lines.length === 6 ? getChangingLines(lines) : [];
  const changedHex = lines.length === 6 && changingLines.length > 0
    ? getChangedHexagram(lines)
    : null;
  const changedHexInfo = changedHex?.number ? HEXAGRAM_NAMES[changedHex.number] : null;

  /* 八字信息 */
  const birthInfo: BirthInfo | null =
    birthYear && birthMonth && birthDay && birthHour
      ? {
          year: Number(birthYear),
          month: Number(birthMonth),
          day: Number(birthDay),
          hour: Number(birthHour),
        }
      : null;

  /* 获取卦辞数据 */
  const { data: hexData, loading: hexLoading, error: hexError } = useHexagramData(hexNum);

  /* 保存占卜记录 */
  const hasSaved = useRef(false);
  useEffect(() => {
    if (hasSaved.current || !hexNum || lines.length !== 6) return;
    hasSaved.current = true;

    fetch("/api/divination", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        coinResults: lines,
        hexagramId: hexNum,
        changedHexagramId: changedHex?.number ?? null,
        changingLines,
      }),
    }).catch(() => {
      // 保存失败静默处理
    });
  }, [hexNum, lines, question, changedHex, changingLines]);

  /* 分享功能 */
  const handleShare = async () => {
    const text = `易经占卜 — ${hexInfo?.cn ?? ""}卦（第${hexNum}卦）\n所问：${question}\n${window.location.href}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${hexInfo?.cn}卦`, text, url: window.location.href });
      } catch {
        // 用户取消
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert("已复制到剪贴板");
    }
  };

  /* 动画变体 */
  const fadeScale = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  };
  const slideUp = (delay: number) => ({
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay } },
  });

  /* 无效状态 */
  if (!hexNum) {
    return (
      <PageLayout navItems={navItems} maxWidth="max-w-2xl">
        <div className="text-center py-20">
          <p className="text-zinc-500 mb-4">未找到有效的卦象信息</p>
          <Button variant="primary" href="/divination">去占卜</Button>
        </div>
      </PageLayout>
    );
  }

  /* 上下卦三位二进制 */
  const binary = lines.length === 6 ? linesToBinary(lines) : null;
  const upperTrigramKey = binary ? binary.slice(0, 3) : null;
  const lowerTrigramKey = binary ? binary.slice(3, 6) : null;
  const upperTrigram = upperTrigramKey ? TRIGRAM_NAMES[upperTrigramKey] : null;
  const lowerTrigram = lowerTrigramKey ? TRIGRAM_NAMES[lowerTrigramKey] : null;

  return (
    <PageLayout navItems={navItems} maxWidth="max-w-2xl">
      <div className="py-6 space-y-6">
        {/* ── 卦象头部 ── */}
        <motion.div
          className="text-center"
          variants={fadeScale}
          initial="hidden"
          animate="visible"
        >
          <p className="text-xs tracking-[0.3em] text-amber-400/30 mb-2">
            {t("hexagramNumber", { num: hexNum })}
          </p>
          <h1 className="font-title text-4xl sm:text-5xl text-gold-glow mb-1">
            {hexInfo?.cn ?? "未知"}
          </h1>
          <p className="text-sm text-zinc-500 tracking-widest mb-2">
            {hexInfo?.en ?? ""}
          </p>
          {upperTrigram && lowerTrigram && (
            <p className="text-xs text-zinc-600">
              {t("upperTrigram")}：{upperTrigram.cn}　{t("lowerTrigram")}：{lowerTrigram.cn}
            </p>
          )}
          {changingLines.length > 0 && (
            <p className="text-red-400/80 text-sm mt-2">
              {t("changingYao")}：{changingLines.map((i) => YAO_LABELS[i]).join("、")}
            </p>
          )}
          {changedHexInfo && (
            <p className="text-xs text-zinc-500 mt-1">
              {t("originalHex")}：{hexInfo?.cn} → {t("changedHex")}：{changedHexInfo.cn}
            </p>
          )}
          {question && (
            <p className="text-xs text-amber-400/40 mt-3 truncate max-w-md mx-auto">
              {t("question", { q: question })}
            </p>
          )}
          <div className="divider-gold w-24 mx-auto mt-4" />
        </motion.div>

        {/* ── 六爻图 ── */}
        {lines.length === 6 && (
          <motion.div
            className="flex justify-center"
            variants={fadeScale}
            initial="hidden"
            animate="visible"
          >
            <Card variant="elevated" padding="lg">
              <HexagramDiagram lines={lines} />
            </Card>
          </motion.div>
        )}

        {/* ── 八字信息卡 ── */}
        {birthInfo && <BaziCard birthInfo={birthInfo} />}

        {/* ── 经典解读区 ── */}
        <motion.div
          variants={slideUp(0.3)}
          initial="hidden"
          animate="visible"
        >
        <Card variant="elevated" padding="lg">
          <h3 className="text-lg font-title text-amber-300 mb-4">📜 {t("classicTitle")}</h3>

          {hexLoading && <Skeleton variant="text" lines={3} />}

          {hexError && (
            <p className="text-sm text-red-400">{hexError}</p>
          )}

          {hexData && (
            <div className="space-y-4">
              {/* 卦辞 */}
              <div>
                <h4 className="text-sm font-semibold text-amber-400/70 mb-1">{t("guaCi")}</h4>
                <p className="text-sm text-zinc-300 leading-relaxed">{hexData.judgmentZh}</p>
              </div>

              {/* 象辞 */}
              {hexData.imageZh && (
                <div>
                  <h4 className="text-sm font-semibold text-amber-400/70 mb-1">象曰</h4>
                  <p className="text-sm text-zinc-300 leading-relaxed">{hexData.imageZh}</p>
                </div>
              )}

              {/* 综合解读 */}
              {hexData.interpretationZh && (
                <div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{hexData.interpretationZh}</p>
                </div>
              )}

              {/* 六爻爻辞 */}
              {hexData.lines && hexData.lines.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-amber-400/70 mb-2">{t("yaoCi")}</h4>
                  <div className="space-y-2">
                    {hexData.lines
                      .sort((a, b) => a.position - b.position)
                      .map((line) => {
                        const isChanging = changingLines.includes(line.position - 1);
                        return (
                          <Card key={line.position} variant="default" padding="sm">
                            <div className="flex items-start gap-2">
                              <span className={`text-xs font-mono shrink-0 mt-0.5 ${
                                isChanging ? "text-red-400" : "text-amber-400/60"
                              }`}>
                                {YAO_LABELS[line.position - 1]}
                                {isChanging && " 🔴"}
                              </span>
                              <div className="min-w-0">
                                <p className="text-sm text-zinc-300">{line.textZh}</p>
                                {line.interpretationZh && (
                                  <p className="text-xs text-zinc-500 mt-1">{line.interpretationZh}</p>
                                )}
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
        </motion.div>

        {/* ── AI 解读区 ── */}
        {hexNum && question && (
          <motion.div
            variants={slideUp(0.5)}
            initial="hidden"
            animate="visible"
          >
          <AISection
            hexagramNumber={hexNum}
            changingLines={changingLines}
            question={question}
            birthInfo={birthInfo}
            gender={gender}
          />
          </motion.div>
        )}

        {/* ── 底部操作栏 ── */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
          variants={slideUp(0.7)}
          initial="hidden"
          animate="visible"
        >
          <Button variant="primary" href="/divination">
            {t("divinationAgain")}
          </Button>
          <Button variant="secondary" href="/">
            {t("backHome")}
          </Button>
          <Button variant="ghost" onClick={handleShare}>
            {t("share")}
          </Button>
        </motion.div>
      </div>
    </PageLayout>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-4xl animate-spin">☯</div>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
