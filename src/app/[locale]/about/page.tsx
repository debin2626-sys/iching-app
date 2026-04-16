import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { SITE_URL, SITE_NAME, getBaseUrl, getAlternateLanguages, getLocalizedText } from '@/lib/seo';
import AboutContent from '@/components/about/AboutContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title = getLocalizedText(
    locale,
    '关于我们 | 51yijing.com - 易经在线占卜',
    'About Us | 51yijing.com - I Ching Online Divination',
    '關於我們 | 51yijing.com - 易經線上占卜'
  );

  const description = getLocalizedText(
    locale,
    '51yijing.com 由资深国学研究者与 AI 工程师联合打造，将三千年易经智慧与现代 AI 技术结合，让每个人都能轻松获得易经智慧的指引。',
    'Built by I Ching scholars and AI engineers, 51yijing.com combines 3,000 years of I Ching wisdom with modern AI technology, making ancient wisdom accessible to everyone.',
    '51yijing.com 由資深國學研究者與 AI 工程師聯合打造，將三千年易經智慧與現代 AI 技術結合，讓每個人都能輕鬆獲得易經智慧的指引。'
  );

  const canonical = `${getBaseUrl(locale)}/about`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: getAlternateLanguages('/about'),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      siteName: SITE_NAME,
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

function AboutPageJsonLd({ locale }: { locale: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: getLocalizedText(locale, '关于 51yijing.com', 'About 51yijing.com', '關於 51yijing.com'),
    description: getLocalizedText(
      locale,
      '由资深国学研究者与 AI 工程师联合打造的易经在线占卜平台',
      'An I Ching online divination platform built by scholars and AI engineers',
      '由資深國學研究者與 AI 工程師聯合打造的易經線上占卜平台'
    ),
    url: `${getBaseUrl(locale)}/about`,
    mainEntity: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      description: getLocalizedText(
        locale,
        '将三千年易经智慧与现代 AI 技术结合',
        'Combining 3,000 years of I Ching wisdom with modern AI technology',
        '將三千年易經智慧與現代 AI 技術結合'
      ),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <AboutPageJsonLd locale={locale} />
      <AboutContent />
    </>
  );
}
