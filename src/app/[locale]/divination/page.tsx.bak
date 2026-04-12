import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import DivinationContent from '@/components/divination/DivinationContent';
import { getBaseUrl, getAlternateLanguages, getLocalizedText } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = getBaseUrl(locale) + '/divination';

  const title = getLocalizedText(
    locale,
    '在线摇卦占卜',
    'Online Divination',
    '線上搖卦占卜'
  );

  const description = getLocalizedText(
    locale,
    '三币古法摇卦，AI智能解读卦象。输入你的问题，开始易经占卜之旅。',
    'Traditional three-coin divination method with AI interpretation. Enter your question and begin your I Ching journey.',
    '三幣古法搖卦，AI智慧解讀卦象。輸入你的問題，開始易經占卜之旅。'
  );

  const ogTitle = getLocalizedText(
    locale,
    '在线摇卦占卜 - 51yijing.com',
    'Online Divination - 51yijing.com',
    '線上搖卦占卜 - 51yijing.com'
  );

  const ogDesc = getLocalizedText(
    locale,
    '三币古法摇卦，AI智能解读卦象。',
    'Traditional three-coin divination with AI interpretation.',
    '三幣古法搖卦，AI智慧解讀卦象。'
  );

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: getAlternateLanguages('/divination'),
    },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: canonical,
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
  };
}

export default async function DivinationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DivinationContent />;
}
