import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { SITE_URL, SITE_NAME } from '@/lib/seo';
import AboutContent from '@/components/about/AboutContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';

  const title = isZh
    ? '关于我们 | 51yijing.com - 易经在线占卜'
    : 'About Us | 51yijing.com - I Ching Online Divination';

  const description = isZh
    ? '51yijing.com 由资深国学研究者与 AI 工程师联合打造，将三千年易经智慧与现代 AI 技术结合，让每个人都能轻松获得易经智慧的指引。'
    : 'Built by I Ching scholars and AI engineers, 51yijing.com combines 3,000 years of I Ching wisdom with modern AI technology, making ancient wisdom accessible to everyone.';

  const canonical = isZh
    ? `${SITE_URL}/about`
    : `${SITE_URL}/en/about`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        zh: `${SITE_URL}/about`,
        en: `${SITE_URL}/en/about`,
      },
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
  const isZh = locale === 'zh';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: isZh ? '关于 51yijing.com' : 'About 51yijing.com',
    description: isZh
      ? '由资深国学研究者与 AI 工程师联合打造的易经在线占卜平台'
      : 'An I Ching online divination platform built by scholars and AI engineers',
    url: `${SITE_URL}/${locale === 'zh' ? '' : 'en/'}about`,
    mainEntity: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      description: isZh
        ? '将三千年易经智慧与现代 AI 技术结合'
        : 'Combining 3,000 years of I Ching wisdom with modern AI technology',
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
