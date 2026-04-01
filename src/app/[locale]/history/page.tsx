import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import HistoryContent from '@/components/history/HistoryContent';
import { SITE_URL } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';
  const canonical = isZh ? `${SITE_URL}/history` : `${SITE_URL}/en/history`;

  return {
    title: isZh ? '占卜历史记录' : 'Divination History',
    description: isZh
      ? '查看你的易经占卜历史记录，回顾过往卦象与AI解读。'
      : 'View your I Ching divination history, review past hexagrams and AI interpretations.',
    alternates: {
      canonical,
      languages: {
        zh: `${SITE_URL}/history`,
        en: `${SITE_URL}/en/history`,
      },
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
