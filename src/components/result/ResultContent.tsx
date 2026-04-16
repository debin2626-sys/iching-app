"use client";


import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useTranslations, useLocale } from "next-intl";
import { useNavItems } from "@/hooks/useNavItems";
import { calculateBazi, type BirthInfo } from "@/lib/iching/bazi";
import { PageLayout, Skeleton, Button, useToast, Breadcrumb } from "@/components/ui";
import { ResultSkeleton } from "@/components/ui/PageSkeletons";
import Card from "@/components/ui/Card";
import type { LineValue } from "@/lib/iching/coins";
import {
  linesToBinary,
  getHexagramNumber,
  getChangedHexagram,
  TRIGRAM_NAMES,
} from "@/lib/iching/hexagram";
import { getChangingLines } from "@/lib/iching/coins";
import HexagramReveal from "@/components/divination/HexagramReveal";
import { CloudPattern } from "@/components/decorative";
import { DailyLimitBanner, incrementLocalDivinationCount } from "@/components/divination/DailyLimitBanner";
import { useSession, signIn } from "next-auth/react";
import { trackAIInterpretStart, trackAIInterpretComplete, trackFunnelResultView, trackFunnelAIInterpretStart, trackFunnelAIInterpretComplete } from "@/lib/analytics";
import { getOrCreateAnonymousSession, saveAnonymousDivination, hasAnonymousDivinations, migrateAnonymousDivinations } from "@/lib/anonymous-session";
import { useRouter, Link } from "@/i18n/navigation";

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

/* YAO_LABELS removed — now using i18n keys via t("yaoLabel0")..t("yaoLabel5") */

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
      if (!res.ok) throw new Error(`Failed to load hexagram (${res.status})`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load hexagram data");
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

/* ── 八字信息卡组件 ── */
function BaziCard({ birthInfo }: { birthInfo: BirthInfo }) {
  const t = useTranslations("Result");
  const bazi = calculateBazi(birthInfo);
  const pillars = [
    { label: t("yearPillar"), pillar: bazi.yearPillar },
    { label: t("monthPillar"), pillar: bazi.monthPillar },
    { label: t("dayPillar"), pillar: bazi.dayPillar },
    { label: t("hourPillar"), pillar: bazi.hourPillar },
  ];

  return (
    <div className="bg-[var(--theme-bg-card)] border border-[var(--theme-border)] backdrop-blur-sm p-6 rounded-xl">
      <h3 className="text-lg font-title text-gold mb-4">🌙 {t("baziTitle")}</h3>
      <div className="grid grid-cols-4 gap-3 text-center mb-4">
        {pillars.map(({ label, pillar }) => (
          <div key={label}>
            <p className="text-xs text-[var(--theme-text-muted)] mb-1">{label}</p>
            <p className="text-lg font-title text-gold-bright">
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
                ? "border-[var(--theme-border)] text-[var(--theme-text-muted)]"
                : "border-gold-dim/30 text-gold/80"
            }`}
          >
            {element} {count}
          </span>
        ))}
      </div>
      <p className="text-xs text-[var(--theme-text-muted)] text-center">
        {t("dayMasterLabel")} {bazi.dayMaster}（{bazi.dayMasterElement}）· {bazi.strength}
      </p>
    </div>
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

/* ── 解读深度类型 ── */
type InterpretDepth = "simple" | "detailed" | "deep";

const DEPTH_OPTIONS: { value: InterpretDepth; labelKey: string; icon: string }[] = [
  { value: "simple", labelKey: "depthSimple", icon: "🌙" },
  { value: "detailed", labelKey: "depthDetailed", icon: "⭐" },
  { value: "deep", labelKey: "depthDeep", icon: "🌟" },
];

/* ── 深度选择器组件 ── */
function DepthSelector({
  value,
  onChange,
  disabled,
}: {
  value: InterpretDepth;
  onChange: (d: InterpretDepth) => void;
  disabled?: boolean;
}) {
  const t = useTranslations("Result");
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      {DEPTH_OPTIONS.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            disabled={disabled}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-medium
              transition-all duration-200 border
              ${isActive
                ? "border-gold/60 bg-gold/10 text-gold"
                : "border-gold/20 bg-transparent text-gold/50 hover:text-gold/70 hover:border-gold/40"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            <span>{opt.icon}</span>
            <span>{t(opt.labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ── AI 解读区组件 ── */
function AISection({
  hexagramNumber,
  changingLines,
  question,
  birthInfo,
  gender,
  scenarioId,
  subScenarioId,
}: {
  hexagramNumber: number;
  changingLines: number[];
  question: string;
  birthInfo: BirthInfo | null;
  gender: string;
  scenarioId: string;
  subScenarioId: string;
}) {
  const t = useTranslations("Result");
  const locale = useLocale();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamDone, setStreamDone] = useState(false);
  const [error, setError] = useState("");
  const [depth, setDepth] = useState<InterpretDepth>("detailed");
  const fetchIdRef = useRef(0);
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

  const fetchAI = useCallback(async (selectedDepth: InterpretDepth) => {
    const id = ++fetchIdRef.current;
    setLoading(true);
    setError("");
    setContent("");
    setStreamDone(false);
    trackAIInterpretStart(hexagramNumber, selectedDepth);
    trackFunnelAIInterpretStart({
      hexagram_number: hexagramNumber,
      interpret_mode: selectedDepth,
    });
    const aiStartTime = Date.now();
    let aiSuccess = true;
    try {
      const res = await fetch("/api/ai/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hexagramNumber,
          changingLines,
          question,
          depth: selectedDepth,
          locale: locale,
          birthInfo,
          gender: gender || undefined,
          scenarioId: scenarioId || undefined,
          subScenarioId: subScenarioId || undefined,
        }),
      });

      if (!res.ok) throw new Error(`AI request failed (${res.status})`);

      const reader = res.body?.getReader();
      if (!reader) throw new Error("Unable to read response stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        // Abort if a newer request was fired
        if (fetchIdRef.current !== id) { reader.cancel(); return; }

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
      if (fetchIdRef.current === id) {
        setError(err instanceof Error ? err.message : "AI interpretation failed");
        aiSuccess = false;
      }
    } finally {
      if (fetchIdRef.current === id) {
        setLoading(false);
        setStreamDone(true);
        trackAIInterpretComplete(hexagramNumber, selectedDepth);
        const durationSeconds = Math.round((Date.now() - aiStartTime) / 1000);
        trackFunnelAIInterpretComplete({
          hexagram_number: hexagramNumber,
          interpret_mode: selectedDepth,
          duration_seconds: durationSeconds,
          success: aiSuccess,
        });
      }
    }
  }, [hexagramNumber, changingLines, question, birthInfo, gender, scenarioId, subScenarioId]);

  // Initial fetch
  const hasInitialFetch = useRef(false);
  useEffect(() => {
    if (hasInitialFetch.current) return;
    hasInitialFetch.current = true;
    fetchAI(depth);
  }, [fetchAI, depth]);

  const handleDepthChange = (newDepth: InterpretDepth) => {
    if (newDepth === depth) return;
    setDepth(newDepth);
    fetchAI(newDepth);
  };

  const title = birthInfo ? t("aiTitleWithBazi") : t("aiTitle");
  const disclaimer = birthInfo ? t("aiDisclaimerWithBazi") : t("aiDisclaimer");

  return (
    <Card variant="default" padding="lg">
      <h3 className="text-xl font-title text-gold mb-4">✍️ {title}</h3>
      <p className="text-sm text-[var(--theme-text-muted)] mb-6">{disclaimer}</p>

      <DepthSelector value={depth} onChange={handleDepthChange} disabled={false} />

      {loading && !content && <Skeleton variant="text" lines={3} />}

      {error && (
        <p className="text-sm text-vermilion">{error}</p>
      )}

      {content && (
        <div
          ref={contentRef}
          className="prose prose-base max-w-none text-[var(--theme-text-secondary)] leading-loose max-h-[60vh] overflow-y-auto prose-headings:text-gold prose-strong:text-[var(--theme-text-primary)] prose-li:marker:text-gold/60"
        >
          <ReactMarkdown>{displayText}</ReactMarkdown>
          {showCursor && (
            <span className="inline-block animate-pulse text-gold ml-0.5">▌</span>
          )}
        </div>
      )}
    </Card>
  );
}

/* ── 结果页主体 ── */
function ResultInner() {
  const searchParams = useSearchParams();
  const t = useTranslations("Result");
  const locale = useLocale();

  const navItems = useNavItems();

  /* ── URL 参数解析 ── */
  const question = searchParams.get("question") || "";
  const linesParam = searchParams.get("lines") || "";
  const hexParam = searchParams.get("hexagram");
  const birthYear = searchParams.get("by");
  const birthMonth = searchParams.get("bm");
  const birthDay = searchParams.get("bd");
  const birthHour = searchParams.get("bh");
  const gender = searchParams.get("gender") || "";
  const scenarioId = searchParams.get("scenario") || "";
  const subScenarioId = searchParams.get("sub") || "";

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

  /* 每日限制 banner */
  const { data: session } = useSession();
  const [showLimitBanner, setShowLimitBanner] = useState(false);
  
  /* 保存和登录相关 */
  const router = useRouter();
  const { toast } = useToast();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  /* 保存占卜记录 */
  const hasSaved = useRef(false);
  useEffect(() => {
    if (hasSaved.current || !hexNum || lines.length !== 6) return;
    hasSaved.current = true;

    const saveData = {
      question,
      coinResults: lines,
      hexagramId: hexNum,
      changedHexagramId: changedHex?.number ?? null,
      changingLines,
    };

    // 如果用户已登录，保存到服务器
    if (session?.user) {
      fetch("/api/divination", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saveData),
      }).then(async (res) => {
        if (res.status === 429) {
          const data = await res.json().catch(() => ({}));
          if (data.code === "DAILY_LIMIT_EXCEEDED") {
            setShowLimitBanner(true);
          }
        }
      }).catch(() => {
        // 保存失败静默处理
      });
    } else {
      // 匿名用户：保存到本地存储
      const anonymousDivination = {
        id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...saveData,
        aiInterpretation: null,
        createdAt: new Date().toISOString(),
        hexagram: {
          number: hexNum,
          nameZh: hexInfo?.cn || "",
          nameEn: hexInfo?.en || "",
          symbol: hexData?.symbol || "",
        },
        changedHexagram: changedHex?.number ? {
          number: changedHex.number,
          nameZh: changedHexInfo?.cn || "",
          nameEn: changedHexInfo?.en || "",
          symbol: "",
        } : null,
      };
      
      saveAnonymousDivination(anonymousDivination);
      // Track local count for unauthenticated users
      incrementLocalDivinationCount();
    }
  }, [hexNum, lines, question, changedHex, changingLines, session, hexInfo, hexData, changedHexInfo]);

  /* 手动保存记录函数 */
  const handleSaveHistory = async () => {
    if (!hexNum || lines.length !== 6) return;
    
    // 如果用户已登录，直接保存
    if (session?.user) {
      setIsSaving(true);
      try {
        const saveData = {
          question,
          coinResults: lines,
          hexagramId: hexNum,
          changedHexagramId: changedHex?.number ?? null,
          changingLines,
        };
        
        const res = await fetch("/api/divination", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(saveData),
        });
        
        if (res.ok) {
          toast(t("saveSuccess"), "success");
        } else if (res.status === 429) {
          const data = await res.json().catch(() => ({}));
          if (data.code === "DAILY_LIMIT_EXCEEDED") {
            setShowLimitBanner(true);
            toast(t("dailyLimitReached"), "warning");
          } else {
            toast(t("saveFailed"), "error");
          }
        } else {
          toast(t("saveFailed"), "error");
        }
      } catch (error) {
        toast(t("saveFailed"), "error");
      } finally {
        setIsSaving(false);
      }
    } else {
      // 匿名用户：显示登录提示
      setShowLoginModal(true);
    }
  };

  /* 处理登录 */
  const handleLogin = async (provider: "google" | "credentials") => {
    if (provider === "google") {
      // 检查是否有匿名记录需要迁移
      const hasAnonymousRecords = hasAnonymousDivinations();
      const callbackUrl = hasAnonymousRecords ? "/auth/migrate" : "/";
      await signIn("google", { callbackUrl });
    } else {
      router.push("/auth");
    }
  };

  /* 继续匿名体验 */
  const handleContinueAnonymous = () => {
    setShowLoginModal(false);
    toast(t("continueAnonymousMessage"), "info");
  };

  // ── funnel_result_view: 结果页曝光（最终转化） ──
  useEffect(() => {
    if (!hexNum || !hexInfo) return;
    trackFunnelResultView({
      hexagram_number: hexNum,
      hexagram_name: hexInfo.cn,
      question_length: question.length,
      has_birth_info: !!birthInfo,
      scenario: scenarioId || undefined,
      interpret_mode: birthInfo ? "multi-dimension" : "simple",
    });
  }, [hexNum, hexInfo, question.length, birthInfo, scenarioId]);

  /* 分享功能 */
  const handleShare = async () => {
    const hexName = hexInfo?.cn ?? "";
    const text = `${t("shareTitle")} — ${hexName}（${t("hexagramNumber", { num: hexNum ?? 0 })}）\n${t("question", { q: question })}\n${window.location.href}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${hexName}`, text, url: window.location.href });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert(t("copiedToClipboard"));
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
      <PageLayout navItems={navItems} maxWidth="max-w-[800px]">
        <div className="text-center py-20 px-6">
          <p className="text-[var(--theme-text-muted)] mb-4">{t("noHexagram")}</p>
          <Link href="/divine" className="btn-divine inline-flex items-center justify-center h-12 px-6 text-base font-title tracking-wider rounded-lg">
            {t("startDivination")}
          </Link>
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
    <PageLayout navItems={navItems} maxWidth="max-w-[800px]">
      <DailyLimitBanner
        show={showLimitBanner}
        onClose={() => setShowLimitBanner(false)}
        userId={session?.user?.id ?? null}
      />
      <Breadcrumb
        className="px-6 pt-4"
        items={[{ label: locale === "zh" || locale === "zh-TW" ? "占卜结果" : "Result" }]}
      />
      <div className="py-8 space-y-8 px-6">
        {/* ── 云纹装饰 ── */}
        <CloudPattern position="top" className="mb-2" />

        {/* ── 卦象头部 ── */}
        <motion.div
          className="text-center"
          variants={fadeScale}
          initial="hidden"
          animate="visible"
        >
          <p className="text-sm tracking-[0.3em] text-gold/30 mb-3">
            {t("hexagramNumber", { num: hexNum })}
          </p>
          <h1 className="font-title text-4xl text-center text-gold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            {hexInfo?.cn ?? t("noHexagram")}
          </h1>
          <p className="text-base text-[var(--theme-text-muted)] tracking-widest mb-3">
            {hexInfo?.en ?? ""}
          </p>
          {upperTrigram && lowerTrigram && (
            <p className="text-base text-center text-[var(--theme-text-secondary)]">
              {t("upperTrigram")}：{upperTrigram.cn}　{t("lowerTrigram")}：{lowerTrigram.cn}
            </p>
          )}
          {changingLines.length > 0 && (
            <p className="text-vermilion/80 text-sm mt-2">
              {t("changingYao")}：{changingLines.map((i) => t(`yaoLabel${i}` as Parameters<typeof t>[0])).join("、")}
            </p>
          )}
          {changedHexInfo && (
            <p className="text-xs text-[var(--theme-text-muted)] mt-1">
              {t("originalHex")}：{hexInfo?.cn} → {t("changedHex")}：{changedHexInfo.cn}
            </p>
          )}
          {question && (
            <p className="text-xs text-gold/40 mt-3 truncate max-w-md mx-auto">
              {t("question", { q: question })}
            </p>
          )}
          <div className="divider-gold w-24 mx-auto mt-4" />
        </motion.div>

        {/* ── 六爻图（逐爻显现动画） ── */}
        {lines.length === 6 && (
          <motion.div
            className="flex justify-center"
            variants={fadeScale}
            initial="hidden"
            animate="visible"
          >
            <Card variant="elevated" padding="lg">
              <HexagramReveal lines={lines} animated={true} />
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
          <h3 className="text-xl font-title text-gold mb-5">📜 {t("classicTitle")}</h3>

          {hexLoading && <ResultSkeleton />}

          {hexError && (
            <p className="text-sm text-vermilion">{hexError}</p>
          )}

          {hexData && (
            <div className="space-y-4">
              {/* 卦辞 */}
              <div>
                <h4 className="text-sm font-semibold text-gold/70 mb-1">{t("guaCi")}</h4>
                <p className="text-base text-[var(--theme-text-primary)] leading-relaxed border-l-3 border-gold/50 pl-3">{hexData.judgmentZh}</p>
              </div>

              {/* 象辞 */}
              {hexData.imageZh && (
                <div>
                  <h4 className="text-sm font-semibold text-gold/70 mb-1">{t("imageText")}</h4>
                  <p className="text-base text-[var(--theme-text-primary)] leading-relaxed border-l-3 border-gold/50 pl-3">{hexData.imageZh}</p>
                </div>
              )}

              {/* 综合解读 */}
              {hexData.interpretationZh && (
                <div>
                  <p className="text-sm text-[var(--theme-text-secondary)] leading-relaxed">{hexData.interpretationZh}</p>
                </div>
              )}

              {/* 六爻爻辞 */}
              {hexData.lines && hexData.lines.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gold/70 mb-2">{t("yaoCi")}</h4>
                  <div className="space-y-2">
                    {hexData.lines
                      .sort((a, b) => a.position - b.position)
                      .map((line) => {
                        const isChanging = changingLines.includes(line.position - 1);
                        return (
                          <Card key={line.position} variant="default" padding="sm">
                            <div className="flex items-start gap-2">
                              <span className={`text-xs font-mono shrink-0 mt-0.5 ${
                                isChanging ? "text-vermilion" : "text-gold/60"
                              }`}>
                                {t(`yaoLabel${line.position - 1}` as Parameters<typeof t>[0])}
                                {isChanging && " 🔴"}
                              </span>
                              <div className="min-w-0">
                                <p className="text-sm text-[var(--theme-text-primary)]">{line.textZh}</p>
                                {line.interpretationZh && (
                                  <p className="text-xs text-[var(--theme-text-muted)] mt-1">{line.interpretationZh}</p>
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
            scenarioId={scenarioId}
            subScenarioId={subScenarioId}
          />
          </motion.div>
        )}

        {/* ── 底部操作栏 ── */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 pt-6"
          variants={slideUp(0.7)}
          initial="hidden"
          animate="visible"
        >
          <Link
            href="/divine"
            className="btn-divine w-[180px] h-12 text-base font-title tracking-wider rounded-lg inline-flex items-center justify-center"
          >
            {t("divinationAgain")}
          </Link>
          <Link
            href="/"
            className="btn-divine w-[180px] h-12 text-base font-title tracking-wider rounded-lg inline-flex items-center justify-center"
          >
            {t("backHome")}
          </Link>
          <button
            onClick={handleSaveHistory}
            disabled={isSaving}
            className="btn-divine w-[180px] h-12 text-base font-title tracking-wider rounded-lg inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? t("saving") : (session?.user ? t("saveHistory") : t("saveHistoryLogin"))}
          </button>
          <button
            onClick={handleShare}
            className="btn-divine w-[180px] h-12 text-base font-title tracking-wider rounded-lg inline-flex items-center justify-center"
          >
            {t("share")}
          </button>
        </motion.div>

        {/* ── 登录提示模态框 ── */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="card-mystic rounded-2xl w-full max-w-md p-8"
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">🔐</div>
                <h3 className="text-xl font-title text-gold mb-2">
                  {t("loginToSave")}
                </h3>
                <p className="text-[var(--theme-text-muted)] text-sm">
                  {t("loginToSaveDescription")}
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleLogin("google")}
                  className="w-full flex items-center justify-center gap-3 px-4 h-12 bg-[var(--theme-bg-card-solid)] hover:bg-[var(--theme-bg-elevated)] text-[var(--theme-text-primary)] font-medium text-base rounded-xl border border-[var(--theme-border)] transition-all duration-200 shadow-sm hover:shadow"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 2.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                  {t("signInWithGoogle")}
                </button>

                <button
                  onClick={() => handleLogin("credentials")}
                  className="btn-divine w-full h-12 text-base font-title tracking-wider rounded-lg"
                >
                  {t("emailLogin")}
                </button>

                <button
                  onClick={handleContinueAnonymous}
                  className="w-full h-10 text-sm text-[var(--theme-text-muted)] hover:text-[var(--theme-text-secondary)] transition-colors"
                >
                  {t("continueAnonymous")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export default function ResultContent() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-4xl animate-spin">☯</div>
        </div>
      }
    >
      <ResultInner />
    </Suspense>
  );
}
