import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import HistoryContent from '@/components/history/HistoryContent';
import { getBaseUrl, getAlternateLanguages, getLocalizedText } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = getBaseUrl(locale) + '/history';

  return {
    title: getLocalizedText(locale, '占卜历史记录', 'Divination History', '占卜歷史紀錄'),
    description: getLocalizedText(
      locale,
      '查看你的易经占卜历史记录，回顾过往卦象与AI解读。',
      'View your I Ching divination history, review past hexagrams and AI interpretations.',
      '查看你的易經占卜歷史紀錄，回顧過往卦象與AI解讀。'
    ),
    alternates: {
      canonical,
      languages: getAlternateLanguages('/history'),
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HistoryContent />;
}
