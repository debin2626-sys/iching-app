"use client";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
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

export default function HistoryPage() {
  const t = useTranslations("History");
  const tNav = useTranslations("Nav");
  const locale = useLocale();
  const { data: session, status } = useSession();

  const [records, setRecords] = useState<DivinationRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const navItems = [
    { label: tNav("home"), href: "/", icon: <span>🏠</span> },
    { label: tNav("divination"), href: "/divination", icon: <span>🔮</span> },
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

  // 初始加载状态
  if (status === "loading" || (status !== "authenticated" && loading)) {
    return (
      <PageLayout navItems={navItems}>
        <div className="pt-8">
          <Skeleton variant="card" count={3} />
        </div>
      </PageLayout>
    );
  }

  // 未登录状态
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
    <PageLayout navItems={navItems} maxWidth="max-w-2xl">
      {/* 标题 */}
      <div className="text-center mb-12">
        <h1 className="font-title text-3xl sm:text-4xl text-gold-glow tracking-wider mb-2">
          {t("title")}
        </h1>
        <p className="text-amber-400/40 text-sm tracking-[0.3em]">{t("subtitle")}</p>
        <div className="divider-gold w-24 mx-auto mt-4" />
      </div>

      {/* 加载中 */}
      {loading && (
        <div className="space-y-6">
          <Skeleton variant="card" count={3} />
        </div>
      )}

      {/* 空状态 */}
      {!loading && records.length === 0 && (
        <Empty
          icon={<span>🔮</span>}
          title={t("empty")}
          description={t("emptyHint")}
          action={
            <Button href="/divination">
              {t("startDivination")}
            </Button>
          }
        />
      )}

      {/* 时间线列表 */}
      {!loading && records.length > 0 && (
        <div className="relative">
          {/* 时间线竖线 */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-amber-600/40 via-amber-600/20 to-transparent" />

          <div className="space-y-6">
            {records.map((record) => {
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
                <Link
                  key={record.id}
                  href={buildResultUrl(record) as "/result"}
                  className="block"
                >
                  <div className="relative pl-10 group">
                    {/* 时间线节点 */}
                    <div className="absolute left-2.5 top-5 w-3 h-3 rounded-full border-2 border-amber-600/60 bg-[#0a0a0f] group-hover:bg-amber-600/40 group-hover:shadow-[0_0_10px_rgba(212,165,116,0.4)] transition-all duration-300" />

                    <Card variant="interactive" padding="md">
                      {/* 卦名 */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-title text-xl text-amber-300 group-hover:text-gold-glow transition-colors">
                            {hexName}
                          </span>
                          {changedName && (
                            <>
                              <span className="text-amber-600/40 text-sm">{t("changeTo")}</span>
                              <span className="font-title text-lg text-amber-400/70">
                                {changedName}
                              </span>
                            </>
                          )}
                        </div>
                        <span className="text-xs text-zinc-600">
                          #{record.hexagram.number}
                        </span>
                      </div>

                      {/* 问题 */}
                      <p className="text-sm text-zinc-400 mb-3 truncate">
                        {record.question ? t("questionPrefix") : ""}
                        {questionText}
                      </p>

                      {/* 时间 */}
                      <p className="text-xs text-zinc-600">
                        {formatDate(record.createdAt, locale)}
                      </p>
                    </Card>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* 加载更多 */}
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
