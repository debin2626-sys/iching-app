import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import ReportContent from "@/components/report/ReportContent";
import { getBaseUrl, getAlternateLanguages, getLocalizedText } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = getBaseUrl(locale) + "/report";

  return {
    title: getLocalizedText(locale, "月度运势报告", "Monthly I Ching Outlook", "月度運勢報告"),
    description: getLocalizedText(
      locale,
      "基于你的历史占卜数据，AI 生成个人月度运势报告，洞见变化，把握时机。",
      "AI-generated monthly outlook based on your I Ching divination history. Discover patterns and embrace change.",
      "基於你的歷史占卜數據，AI 生成個人月度運勢報告。"
    ),
    alternates: {
      canonical,
      languages: getAlternateLanguages("/report"),
    },
    robots: { index: false, follow: true },
  };
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ReportContent />;
}
