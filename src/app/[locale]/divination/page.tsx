import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import DivinationContent from '@/components/divination/DivinationContent';
import { SITE_URL } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';
  const canonical = isZh ? `${SITE_URL}/divination` : `${SITE_URL}/en/divination`;

  return {
    title: isZh ? '在线摇卦占卜' : 'Online Divination',
    description: isZh
      ? '三币古法摇卦，AI智能解读卦象。输入你的问题，开始易经占卜之旅。'
      : 'Traditional three-coin divination method with AI interpretation. Enter your question and begin your I Ching journey.',
    alternates: {
      canonical,
      languages: {
        zh: `${SITE_URL}/divination`,
        en: `${SITE_URL}/en/divination`,
      },
    },
    openGraph: {
      title: isZh ? '在线摇卦占卜 - 51yijing.com' : 'Online Divination - 51yijing.com',
      description: isZh
        ? '三币古法摇卦，AI智能解读卦象。'
        : 'Traditional three-coin divination with AI interpretation.',
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
