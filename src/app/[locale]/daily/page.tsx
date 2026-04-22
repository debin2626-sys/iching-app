import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getBaseUrl, getAlternateLanguages } from "@/lib/seo";
import { getDayIndex, getLunarDateInfo, DAILY_EPOCH } from "@/lib/daily-lesson";
import { PageLayout } from "@/components/ui/PageLayout";
import DailyPageClient from "./DailyPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const base = getBaseUrl(locale);

  const result = getDayIndex(new Date(), "yijing");
  const isPreLaunch = result.status === "not_launched";

  const title = isPreLaunch
    ? "每日古典智慧即将开播 — 51yijing.com"
    : "每日古典智慧 | 日课 — 51yijing.com";

  const description = isPreLaunch
    ? `${DAILY_EPOCH.replace(/-/g, "年").replace(/-/, "月")}起，每天一条来自《周易》的决策智慧`
    : "每天一条来自《周易》的古典智慧，384天完整卦序，免费订阅";

  return {
    title,
    description,
    alternates: {
      canonical: `${base}/daily`,
      languages: getAlternateLanguages("/daily"),
    },
    openGraph: {
      title,
      description,
      url: `${base}/daily`,
      type: "website",
    },
  };
}

export default async function DailyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const now = new Date();
  const result = getDayIndex(now, "yijing");
  const lunar = getLunarDateInfo(now);

  return (
    <PageLayout maxWidth="max-w-[800px]">
      <DailyPageClient
        initialStatus={result.status}
        launchDate={result.status === "not_launched" ? result.launchDate : DAILY_EPOCH}
        lunar={lunar}
        dayIndex={result.status === "active" ? result.dayIndex : 0}
      />
    </PageLayout>
  );
}
