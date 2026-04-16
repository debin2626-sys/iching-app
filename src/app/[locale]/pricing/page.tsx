import type { Metadata } from 'next';
import { getBaseUrl, getAlternateLanguages, getLocalizedText } from '@/lib/seo';
import PricingContent from './PricingContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = getBaseUrl(locale) + '/pricing';

  const title = getLocalizedText(
    locale,
    '价格方案 | 51易经',
    'Pricing | 51 I Ching',
    '價格方案 | 51易經',
  );
  const description = getLocalizedText(
    locale,
    '选择适合您的易经占卜套餐，解锁无限次AI智能解读，深入探索三千年古老智慧。',
    'Choose a plan that works for you. Unlock unlimited AI-powered I Ching readings and explore 3000 years of ancient wisdom.',
    '選擇適合您的易經占卜套餐，解鎖無限次AI智慧解讀，深入探索三千年古老智慧。',
  );

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: getAlternateLanguages('/pricing'),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // locale is consumed by PricingContent via next-intl hooks
  await params;
  return <PricingContent />;
}
