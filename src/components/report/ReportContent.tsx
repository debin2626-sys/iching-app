"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { PageLayout, Card, Button } from "@/components/ui";

interface TopHexagram {
  number: number;
  nameZh: string;
  nameEn: string;
  symbol: string;
  count: number;
}

interface WeeklyPoint {
  week: number;
  count: number;
}

interface MonthlyReport {
  year: number;
  month: number;
  totalReadings: number;
  topHexagrams: TopHexagram[];
  scenarioBreakdown: Record<string, number>;
  weeklyTrend: WeeklyPoint[];
  aiSummary: string | null;
}

const SCENARIO_LABELS_ZH: Record<string, string> = {
  career: "事业",
  love: "感情",
  wealth: "财运",
  health: "健康",
  study: "学业",
  other: "其他",
};

const SCENARIO_LABELS_EN: Record<string, string> = {
  career: "Career",
  love: "Relationships",
  wealth: "Finances",
  health: "Health",
  study: "Studies",
  other: "Other",
};

const SCENARIO_COLORS: Record<string, string> = {
  career: "#c9a96e",
  love: "#e07070",
  wealth: "#7ec8a0",
  health: "#7ab8e8",
  study: "#b07ee8",
  other: "#888888",
};

// SVG Pie chart
function PieChart({ data }: { data: Record<string, number> }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  if (total === 0) return null;

  const entries = Object.entries(data).filter(([, v]) => v > 0);
  let cumAngle = -Math.PI / 2;
  const cx = 80;
  const cy = 80;
  const r = 65;

  const slices = entries.map(([key, value]) => {
    const angle = (value / total) * 2 * Math.PI;
    const startAngle = cumAngle;
    cumAngle += angle;
    const endAngle = cumAngle;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = angle > Math.PI ? 1 : 0;
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    return { key, value, d, color: SCENARIO_COLORS[key] || "#888" };
  });

  return (
    <svg viewBox="0 0 160 160" className="w-full max-w-[160px]">
      {slices.map((s) => (
        <path key={s.key} d={s.d} fill={s.color} opacity={0.85} stroke="#0a0a12" strokeWidth={1.5} />
      ))}
    </svg>
  );
}

// Bar chart for weekly trend
function BarChart({ data }: { data: WeeklyPoint[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-2 h-24 w-full">
      {data.map((d) => (
        <div key={d.week} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs text-gold/60">{d.count > 0 ? d.count : ""}</span>
          <div
            className="w-full rounded-t-sm transition-all duration-500"
            style={{
              height: `${(d.count / max) * 72}px`,
              minHeight: d.count > 0 ? "4px" : "0",
              background: d.count > 0 ? "linear-gradient(to top, #8b2500, #c9a96e)" : "rgba(201,169,110,0.1)",
            }}
          />
          <span className="text-xs text-zinc-600">W{d.week}</span>
        </div>
      ))}
    </div>
  );
}

export default function ReportContent() {
  const t = useTranslations("Report");
  const tNav = useTranslations("Nav");
  const locale = useLocale();
  const { data: session, status } = useSession();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const navItems = [
    { label: tNav("home"), href: "/", icon: <span>🏠</span> },
    { label: tNav("divination"), href: "/divine", icon: <span>🔮</span> },
    { label: tNav("hexagrams"), href: "/hexagrams", icon: <span>📖</span> },
  ];

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setReport(null);
    try {
      const res = await fetch(`/api/report/monthly?year=${year}&month=${month}&locale=${locale}`);
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [year, month, locale]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchReport();
    }
  }, [status, fetchReport]);

  const handlePrevMonth = () => {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    const nextDate = new Date(year, month, 1);
    if (nextDate <= now) {
      if (month === 12) {
        setYear((y) => y + 1);
        setMonth(1);
      } else {
        setMonth((m) => m + 1);
      }
    }
  };

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;
  const isZh = locale === "zh" || locale === "zh-TW";
  const scenarioLabels = isZh ? SCENARIO_LABELS_ZH : SCENARIO_LABELS_EN;

  const handleShare = async () => {
    if (!report) return;
    const monthLabel = isZh ? `${year}年${month}月` : `${year}-${String(month).padStart(2, "0")}`;
    const topNames = report.topHexagrams
      .map((h) => `${h.symbol}${isZh ? h.nameZh : h.nameEn}`)
      .join("、");
    const text = isZh
      ? `【易经月度运势 ${monthLabel}】\n本月占卜${report.totalReadings}次，主导卦象：${topNames || "暂无"}\n${report.aiSummary ? "\n" + report.aiSummary.slice(0, 100) + "..." : ""}\n\n来自 iching.app`
      : `[Monthly I Ching Outlook ${monthLabel}]\n${report.totalReadings} readings this month. Top hexagrams: ${topNames || "none"}\n${report.aiSummary ? "\n" + report.aiSummary.slice(0, 100) + "..." : ""}\n\niching.app`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  if (status === "loading") {
    return (
      <PageLayout navItems={navItems}>
        <div className="flex items-center justify-center" style={{ minHeight: "60vh" }}>
          <div className="text-gold/40 text-5xl animate-pulse">☯</div>
        </div>
      </PageLayout>
    );
  }

  if (status === "unauthenticated") {
    return (
      <PageLayout navItems={navItems}>
        <div className="flex flex-col items-center justify-center" style={{ minHeight: "60vh" }}>
          <div className="text-gold/10 text-[120px] mb-8">☯</div>
          <h2 className="text-2xl font-title text-amber-300 mb-3">{t("title")}</h2>
          <p className="text-zinc-500 text-base mb-8">{t("loginRequired")}</p>
          <Button href="/auth" variant="ghost" className="w-[200px] h-12 border border-gold/40 hover:border-gold/70 text-gold">
            {t("loginButton")}
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout navItems={navItems} maxWidth="max-w-4xl">
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-title text-4xl sm:text-5xl text-gold-glow tracking-wider mb-3">
            {t("title")}
          </h1>
          <p className="text-amber-400/40 text-base tracking-[0.3em]">{t("subtitle")}</p>
          <div className="divider-gold w-24 mx-auto mt-5" />
        </div>

        {/* Month selector */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <button
            onClick={handlePrevMonth}
            className="w-9 h-9 rounded-full border border-gold/30 text-gold hover:border-gold/60 hover:bg-gold/10 transition-all flex items-center justify-center text-lg"
          >
            ‹
          </button>
          <span className="text-xl font-title text-amber-200 min-w-[140px] text-center">
            {isZh ? `${year}年${month}月` : `${new Date(year, month - 1).toLocaleString("en-US", { month: "long", year: "numeric" })}`}
          </span>
          <button
            onClick={handleNextMonth}
            disabled={isCurrentMonth}
            className="w-9 h-9 rounded-full border border-gold/30 text-gold hover:border-gold/60 hover:bg-gold/10 transition-all flex items-center justify-center text-lg disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ›
          </button>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-gold/40 text-5xl animate-pulse">☯</div>
          </div>
        )}

        {/* No data */}
        {!loading && report && report.totalReadings === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <Card variant="default" padding="lg" className="text-center py-16">
              <div className="text-6xl mb-5 opacity-20">☯</div>
              <p className="text-zinc-400 text-lg mb-2">{t("noData")}</p>
              <p className="text-zinc-600 text-sm mb-6">{t("noDataHint")}</p>
              <Button href="/divination" variant="ghost" size="sm" className="border border-gold/30 text-gold">
                {tNav("divination")}
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Report content */}
        {!loading && report && report.totalReadings > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Total readings */}
            <Card variant="elevated" padding="md">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-sm tracking-wider uppercase">{t("totalReadings")}</span>
                <span className="text-4xl font-title text-gold">{report.totalReadings}</span>
              </div>
            </Card>

            {/* Top hexagrams */}
            <div>
              <h2 className="text-sm text-amber-400/60 tracking-widest mb-3 uppercase">{t("topHexagrams")}</h2>
              <div className="grid grid-cols-3 gap-3">
                {report.topHexagrams.map((h, i) => (
                  <Link key={h.number} href={`/hexagrams/${h.number}` as "/hexagrams/[id]"}>
                    <Card variant="interactive" padding="sm" className="text-center !p-4 relative">
                      {i === 0 && (
                        <div className="absolute top-2 right-2 text-xs text-gold/60">★</div>
                      )}
                      <div className="text-3xl mb-1">{h.symbol}</div>
                      <div className="text-sm font-title text-amber-300 truncate">
                        {isZh ? h.nameZh : h.nameEn}
                      </div>
                      <div className="text-xs text-zinc-600 mt-0.5">
                        {isZh ? `第${h.number}卦` : `#${h.number}`} · ×{h.count}
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Weekly trend */}
              <Card variant="default" padding="md">
                <h3 className="text-xs text-amber-400/60 tracking-widest uppercase mb-4">{t("weeklyTrend")}</h3>
                <BarChart data={report.weeklyTrend} />
              </Card>

              {/* Scenario breakdown */}
              <Card variant="default" padding="md">
                <h3 className="text-xs text-amber-400/60 tracking-widest uppercase mb-4">{t("scenarioBreakdown")}</h3>
                <div className="flex items-center gap-4">
                  <PieChart data={report.scenarioBreakdown} />
                  <div className="flex flex-col gap-1.5 flex-1">
                    {Object.entries(report.scenarioBreakdown)
                      .filter(([, v]) => v > 0)
                      .sort(([, a], [, b]) => b - a)
                      .map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ background: SCENARIO_COLORS[key] || "#888" }}
                          />
                          <span className="text-xs text-zinc-400 flex-1">{scenarioLabels[key] || key}</span>
                          <span className="text-xs text-gold/70">{value}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* AI Summary */}
            <Card variant="elevated" padding="lg">
              <h3 className="text-sm text-amber-400/60 tracking-widest uppercase mb-4">{t("aiSummary")}</h3>
              {report.aiSummary ? (
                <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{report.aiSummary}</p>
              ) : (
                <p className="text-zinc-600 text-sm italic">{t("generating")}</p>
              )}
            </Card>

            {/* Share button */}
            <div className="flex justify-center pb-8">
              <button
                onClick={handleShare}
                className="px-6 py-2.5 rounded-lg border border-gold/30 text-gold/80 hover:border-gold/60 hover:text-gold hover:bg-gold/5 transition-all text-sm"
              >
                {copied ? `✓ ${t("copied")}` : `↑ ${t("share")}`}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
}
