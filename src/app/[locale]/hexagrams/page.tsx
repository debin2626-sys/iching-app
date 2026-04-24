import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import HexagramsContent from '@/components/hexagrams/HexagramsContent';
import { HexagramListJsonLd } from '@/components/seo/JsonLd';
import { getBaseUrl, getAlternateLanguages, getLocalizedText } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = getBaseUrl(locale) + '/hexagrams';

  const title = getLocalizedText(
    locale,
    '六十四卦典 | 完整卦辞爻辞 - 51yijing.com',
    '64 I Ching Hexagrams — Career, Love & Money Readings | 51yijing.com',
    '六十四卦典 | 完整卦辭爻辭 - 51yijing.com'
  );

  const description = getLocalizedText(
    locale,
    '易经六十四卦完整列表，包含卦辞、爻辞及详细解读。乾坤屯蒙需讼师比，小畜履泰否同人大有。',
    'Browse all 64 I Ching hexagrams with judgments, line texts, and practical guidance for career decisions, relationships, and finances.',
    '易經六十四卦完整列表，包含卦辭、爻辭及詳細解讀。乾坤屯蒙需訟師比，小畜履泰否同人大有。'
  );

  const shortDesc = getLocalizedText(
    locale,
    '易经六十四卦完整列表，包含卦辞、爻辞及详细解读。',
    'Browse all 64 I Ching hexagrams with practical guidance for career, relationships, and finances.',
    '易經六十四卦完整列表，包含卦辭、爻辭及詳細解讀。'
  );

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: getAlternateLanguages('/hexagrams'),
    },
    openGraph: {
      title,
      description: shortDesc,
      url: canonical,
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: getLocalizedText(
        locale,
        '六十四卦典 | 完整卦辞爻辞',
        '64 I Ching Hexagrams — Career, Love & Money Readings',
        '六十四卦典 | 完整卦辭爻辭'
      ),
      description: shortDesc,
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
