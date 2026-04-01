import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import ResultContent from '@/components/result/ResultContent';
import { SITE_URL } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return {
    title: isZh ? '占卜结果 - AI解读' : 'Divination Result - AI Interpretation',
    description: isZh
      ? '查看你的易经占卜结果，AI智能解读卦象含义。'
      : 'View your I Ching divination result with AI-powered interpretation.',
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ResultContent />;
}
