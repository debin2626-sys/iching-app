import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import HomeContent from '@/components/home/HomeContent';
import { HomeJsonLd } from '@/components/seo/JsonLd';
import { SITE_URL, SITE_DESC_ZH, SITE_DESC_EN } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return {
    title: isZh
      ? '易经在线占卜 | AI智能解读 - 51yijing.com'
      : 'I Ching Online Divination | AI Interpretation - 51yijing.com',
    description: isZh ? SITE_DESC_ZH : SITE_DESC_EN,
    alternates: {
      canonical: isZh ? SITE_URL : `${SITE_URL}/en`,
      languages: {
        zh: SITE_URL,
        en: `${SITE_URL}/en`,
      },
    },
    openGraph: {
      title: isZh
        ? '易经在线占卜 | AI智能解读 - 51yijing.com'
        : 'I Ching Online Divination | AI Interpretation - 51yijing.com',
      description: isZh ? SITE_DESC_ZH : SITE_DESC_EN,
      url: isZh ? SITE_URL : `${SITE_URL}/en`,
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: isZh
        ? '易经在线占卜 | AI智能解读 - 51yijing.com'
        : 'I Ching Online Divination | AI Interpretation - 51yijing.com',
      description: isZh ? SITE_DESC_ZH : SITE_DESC_EN,
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
