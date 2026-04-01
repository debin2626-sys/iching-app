import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import ResultContent from '@/components/result/ResultContent';
import { getLocalizedText } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: getLocalizedText(
      locale,
      '占卜结果 - AI解读',
      'Divination Result - AI Interpretation',
      '占卜結果 - AI解讀'
    ),
    description: getLocalizedText(
      locale,
      '查看你的易经占卜结果，AI智能解读卦象含义。',
      'View your I Ching divination result with AI-powered interpretation.',
      '查看你的易經占卜結果，AI智慧解讀卦象含義。'
    ),
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
