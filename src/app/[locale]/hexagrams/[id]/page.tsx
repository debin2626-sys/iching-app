import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { HEXAGRAM_DATA, getHexagramByNumber } from '@/data/hexagrams';
import { HexagramArticleJsonLd } from '@/components/seo/JsonLd';
import { SITE_URL } from '@/lib/seo';
import HexagramDetailContent from '@/components/hexagrams/HexagramDetailContent';

export function generateStaticParams() {
  return HEXAGRAM_DATA.map((h) => ({ id: String(h.number) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const num = parseInt(id, 10);
  const hex = getHexagramByNumber(num);

  if (!hex) return { title: 'Not Found' };

  const isZh = locale === 'zh';
  const canonical = isZh
    ? `${SITE_URL}/hexagrams/${num}`
    : `${SITE_URL}/en/hexagrams/${num}`;

  const title = isZh
    ? `${hex.nameZh}卦 - 第${num}卦 | 易经在线占卜 51yijing.com`
    : `Hexagram ${num}: ${hex.nameEn} | I Ching 51yijing.com`;

  const description = isZh
    ? `${hex.traditionalName}（第${num}卦）：${hex.judgmentZh} ${hex.interpretationZh}`
    : `Hexagram ${num} - ${hex.nameEn}: ${hex.judgmentEn} ${hex.interpretationEn}`;

  const keywords = isZh
    ? `${hex.nameZh}卦,${hex.traditionalName},第${num}卦,易经,周易,卦辞,爻辞,${hex.imageZh.slice(0, 10)}`
    : `hexagram ${num},${hex.nameEn},I Ching,Yi Jing,divination,judgment,image`;

  return {
    title,
    description: description.slice(0, 160),
    keywords,
    alternates: {
      canonical,
      languages: {
        zh: `${SITE_URL}/hexagrams/${num}`,
        en: `${SITE_URL}/en/hexagrams/${num}`,
      },
    },
    openGraph: {
      title,
      description: description.slice(0, 160),
      url: canonical,
      type: 'article',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description.slice(0, 160),
      images: ['/og-image.png'],
    },
  };
}

export default async function HexagramDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const num = parseInt(id, 10);

  if (isNaN(num) || num < 1 || num > 64) {
    notFound();
  }

  setRequestLocale(locale);

  const hex = getHexagramByNumber(num);
  if (!hex) notFound();

  return (
    <>
      <HexagramArticleJsonLd hexagram={hex} locale={locale} />
      <HexagramDetailContent hexagramNumber={num} />
    </>
  );
}
