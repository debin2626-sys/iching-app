import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import HomeContent from '@/components/home/HomeContent';
import { HomeJsonLd } from '@/components/seo/JsonLd';
import { SITE_URL, SITE_DESC_ZH, SITE_DESC_EN, SITE_DESC_ZH_TW, getBaseUrl, getAlternateLanguages, getLocalizedText } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = getBaseUrl(locale);

  const title = getLocalizedText(
    locale,
    '易经在线占卜 | AI智能解读 - 51yijing.com',
    'Free I Ching Online Divination — AI-Powered Readings | 51yijing.com',
    '易經線上占卜 | AI智能解讀 - 51yijing.com'
  );

  const description = getLocalizedText(locale, SITE_DESC_ZH, SITE_DESC_EN, SITE_DESC_ZH_TW);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: getAlternateLanguages(),
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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HomeJsonLd locale={locale} />
      <HomeContent />
    </>
  );
}
