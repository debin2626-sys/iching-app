"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageLayout, Card, Button, Empty, Skeleton } from "@/components/ui";

interface HexagramInfo {
  number: number;
  nameZh: string;
  nameEn: string;
  symbol: string;
}

interface DivinationRecord {
  id: string;
  question: string | null;
  coinResults: number[];
  hexagramId: number;
  changedHexagramId: number | null;
  changingLines: number[];
  createdAt: string;
  hexagram: HexagramInfo;
  changedHexagram: HexagramInfo | null;
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

type TimeFilter = "7d" | "30d" | "all";

function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  if (locale === "zh") {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const h = date.getHours().toString().padStart(2, "0");
    const min = date.getMinutes().toString().padStart(2, "0");
    return `${y}年${m}月${d}日 ${h}:${min}`;
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildResultUrl(record: DivinationRecord): string {
  const params = new URLSearchParams();
  params.set("hexagram", String(record.hexagramId));
  if (record.question) params.set("question", record.question);
  if (Array.isArray(record.coinResults) && record.coinResults.length > 0) {
    params.set("lines", record.coinResults.join(","));
  }
  return `/result?${params.toString()}`;
}

function isWithinDays(dateStr: string, days: number): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return diff <= days * 24 * 60 * 60 * 1000;
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function HistoryPage() {
  const t = useTranslations("History");
  const tNav = useTranslations("Nav");
  const locale = useLocale();
  const { data: session, status } = useSession();

  const [records, setRecords] = useState<DivinationRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");

  const navItems = [
    { label: tNav("divination"), href: "/", icon: <span>🔮</span> },
    { label: tNav("hexagrams"), href: "/hexagrams", icon: <span>📖</span> },
    { label: tNav("history"), href: "/history", icon: <span>📜</span> },
  ];

  const fetchRecords = useCallback(async (page: number, append = false) => {
    if (page === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await fetch(`/api/divination?page=${page}`);
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setRecords((prev) => append ? [...prev, ...data.divinations] : data.divinations);
      setPagination(data.pagination);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchRecords(1);
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status, fetchRecords]);

  const loadMore = () => {
    if (pagination && pagination.page < pagination.totalPages) {
      fetchRecords(pagination.page + 1, true);
    }
  };

  // Filter records by time range (client-side)
  const filteredRecords = useMemo(() => {
    if (timeFilter === "all") return records;
    const days = timeFilter === "7d" ? 7 : 30;
    return records.filter((r) => isWithinDays(r.createdAt, days));
  }, [records, timeFilter]);

  const timeFilterTabs: { key: TimeFilter; label: string }[] = [
    { key: "7d", label: locale === "zh" ? "最近7天" : "Last 7 days" },
    { key: "30d", label: locale === "zh" ? "最近30天" : "Last 30 days" },
    { key: "all", label: locale === "zh" ? "全部" : "All" },
  ];

  // Loading state
  if (status === "loading" || (status !== "authenticated" && loading)) {
    return (
      <PageLayout navItems={navItems}>
        <div className="pt-8">
          <Skeleton variant="card" count={3} />
        </div>
      </PageLayout>
    );
  }

  // Unauthenticated
  if (status === "unauthenticated" || !session) {
    return (
      <PageLayout navItems={navItems}>
        <Empty
          icon={<span>📜</span>}
          title={t("title")}
          description={t("loginRequired")}
          action={
            <Button href="/auth">
              {t("loginButton")}
            </Button>
          }
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout navItems={navItems} maxWidth="max-w-4xl">
      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="font-title text-4xl sm:text-5xl text-gold-glow tracking-wider mb-3">
          {t("title")}
        </h1>
        <p className="text-amber-400/40 text-base tracking-[0.3em]">{t("subtitle")}</p>
        <div className="divider-gold w-24 mx-auto mt-5" />
      </div>

      {/* Time filter tabs */}
      {!loading && records.length > 0 && (
        <div className="flex justify-center gap-3 mb-10">
          {timeFilterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTimeFilter(tab.key)}
              className={[
                "px-6 py-2.5 rounded-full text-base font-medium transition-all duration-300",
                timeFilter === tab.key
                  ? "border border-gold/60 bg-gold/10 text-gold"
                  : "text-zinc-500 border border-zinc-800 hover:text-zinc-300 hover:border-zinc-600",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-6">
          <Skeleton variant="card" count={3} />
        </div>
      )}

      {/* Empty state - no records at all */}
      {!loading && records.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-8xl mb-8 opacity-30 animate-[spin_20s_linear_infinite]">☯</div>
          <p className="text-xl text-amber-400/60 font-title mb-3">
            {t("empty")}
          </p>
          <p className="text-base text-zinc-600 mb-8 text-center max-w-sm">
            {t("emptyHint")}
          </p>
          <Button href="/divination" size="lg" className="h-12 px-8">
            {t("startDivination")}
          </Button>
        </div>
      )}

      {/* Empty state - filtered results empty */}
      {!loading && records.length > 0 && filteredRecords.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <div className="text-6xl mb-5 opacity-20">☯</div>
          <p className="text-zinc-500 text-base">
            {locale === "zh" ? "该时间段内暂无记录" : "No records in this period"}
          </p>
        </motion.div>
      )}

      {/* Timeline list */}
      {!loading && filteredRecords.length > 0 && (
        <div className="relative">
          {/* Timeline vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-amber-600/40 via-amber-600/20 to-transparent" />

          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredRecords.map((record, index) => {
                const hexName = locale === "zh" ? record.hexagram.nameZh : record.hexagram.nameEn;
                const changedName = record.changedHexagram
                  ? locale === "zh" ? record.changedHexagram.nameZh : record.changedHexagram.nameEn
                  : null;
                const questionText = record.question
                  ? record.question.length > 40
                    ? record.question.slice(0, 40) + "..."
                    : record.question
                  : t("noQuestion");

                return (
                  <motion.div
                    key={record.id}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                    layout
                  >
                    <Link
                      href={buildResultUrl(record) as "/result"}
                      className="block"
                    >
                      <div className="relative pl-10 group">
                        {/* Timeline node */}
                        <div className="absolute left-2.5 top-5 w-3 h-3 rounded-full border-2 border-amber-600/60 bg-bg group-hover:bg-amber-600/40 group-hover:shadow-[0_0_10px_color-mix(in_srgb,var(--color-gold)_40%,transparent)] transition-all duration-300" />

                        <Card variant="interactive" padding="md" className="!p-6 sm:!p-7">
                          {/* Hexagram name */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="font-title text-2xl text-amber-300 group-hover:text-gold-glow transition-colors">
                                {hexName}
                              </span>
                              {changedName && (
                                <>
                                  <span className="text-amber-600/40 text-base">{t("changeTo")}</span>
                                  <span className="font-title text-xl text-amber-400/70">
                                    {changedName}
                                  </span>
                                </>
                              )}
                            </div>
                            <span className="text-xs text-zinc-600">
                              #{record.hexagram.number}
                            </span>
                          </div>

                          {/* Question */}
                          <p className="text-base text-zinc-400 mb-3 truncate">
                            {record.question ? t("questionPrefix") : ""}
                            {questionText}
                          </p>

                          {/* Time */}
                          <p className="text-sm text-zinc-600">
                            {formatDate(record.createdAt, locale)}
                          </p>
                        </Card>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Load more */}
          {pagination && pagination.page < pagination.totalPages && (
            <div className="text-center mt-8">
              <Button
                variant="ghost"
                onClick={loadMore}
                loading={loadingMore}
              >
                {t("loadMore")}
              </Button>
            </div>
          )}

          {pagination && pagination.page >= pagination.totalPages && records.length > 0 && (
            <p className="text-center text-xs text-zinc-700 mt-8">{t("noMore")}</p>
          )}
        </div>
      )}
    </PageLayout>
  );
}
