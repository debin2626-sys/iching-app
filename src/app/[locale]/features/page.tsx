import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getBaseUrl, getAlternateLanguages, getLocalizedText } from '@/lib/seo';
import FeaturesContent from './FeaturesContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = getBaseUrl(locale) + '/features';

  const title = getLocalizedText(
    locale,
    '功能介绍 | 51易经',
    'Features | 51 I Ching',
    '功能介紹 | 51易經',
  );
  const description = getLocalizedText(
    locale,
    '51易经所有功能完全免费开放，包括无限次占卜、每日古典智慧、完整卦辞解读与六十四卦百科。',
    'All features on 51 I Ching are completely free — unlimited divinations, daily wisdom, full hexagram readings, and more.',
    '51易經所有功能完全免費開放，包括無限次占卜、每日古典智慧、完整卦辭解讀與六十四卦百科。',
  );

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: getAlternateLanguages('/features'),
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

export default async function FeaturesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <FeaturesContent />;
}
