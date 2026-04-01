import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import HexagramsContent from '@/components/hexagrams/HexagramsContent';
import { HexagramListJsonLd } from '@/components/seo/JsonLd';
import { SITE_URL } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';
  const canonical = isZh ? `${SITE_URL}/hexagrams` : `${SITE_URL}/en/hexagrams`;

  return {
    title: isZh
      ? '六十四卦典 | 完整卦辞爻辞 - 51yijing.com'
      : 'The 64 Hexagrams | Complete I Ching Guide - 51yijing.com',
    description: isZh
      ? '易经六十四卦完整列表，包含卦辞、爻辞及详细解读。乾坤屯蒙需讼师比，小畜履泰否同人大有。'
      : 'Complete list of 64 I Ching hexagrams with judgments, line texts, and detailed interpretations.',
    alternates: {
      canonical,
      languages: {
        zh: `${SITE_URL}/hexagrams`,
        en: `${SITE_URL}/en/hexagrams`,
      },
    },
    openGraph: {
      title: isZh
        ? '六十四卦典 | 完整卦辞爻辞 - 51yijing.com'
        : 'The 64 Hexagrams | Complete I Ching Guide - 51yijing.com',
      description: isZh
        ? '易经六十四卦完整列表，包含卦辞、爻辞及详细解读。'
        : 'Complete list of 64 I Ching hexagrams with judgments and interpretations.',
      url: canonical,
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: isZh
        ? '六十四卦典 | 完整卦辞爻辞'
        : 'The 64 Hexagrams | I Ching Guide',
      description: isZh
        ? '易经六十四卦完整列表，包含卦辞、爻辞及详细解读。'
        : 'Complete list of 64 I Ching hexagrams with judgments and interpretations.',
      images: ['/og-image.png'],
    },
  };
}

export default async function HexagramsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HexagramListJsonLd locale={locale} />
      <HexagramsContent />
    </>
  );
}
