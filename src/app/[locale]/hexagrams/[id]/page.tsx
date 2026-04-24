import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { HEXAGRAM_DATA, getHexagramByNumber } from '@/data/hexagrams';
import { getHexagramFullData } from '@/lib/hexagram-data';
import { HexagramArticleJsonLd, HexagramFaqJsonLd, HexagramBreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { SITE_URL, getLocalePrefix, getAlternateLanguages } from '@/lib/seo';
import HexagramDetailContent from '@/components/hexagrams/HexagramDetailContent';
import HexagramHero from '@/components/hexagrams/HexagramHero';
import hexEssenceEn from '@/data/hex-essence-en.json';

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

  const isEn = locale === 'en';
  const isZhTW = locale === 'zh-TW';
  const prefix = getLocalePrefix(locale);
  const canonical = `${SITE_URL}${prefix}/hexagrams/${num}`;

  let title: string;
  let description: string;
  let keywords: string;

  if (isEn) {
    const essence = hexEssenceEn.find((e: { number: number }) => e.number === num);
    title = `Hexagram ${num}: ${hex.nameEn} (${hex.symbol}) — I Ching | 51yijing.com`;
    description = essence?.description ?? `Hexagram ${num} ${hex.nameEn}: judgment, line readings, and guidance for career, relationships, and money.`;
    keywords = `hexagram ${num},${hex.nameEn},I Ching,Yi Jing,divination,judgment,image`;
  } else if (isZhTW) {
    const nameZhTW = hex.nameZhTW || hex.nameZh;
    const traditionalNameTW = hex.traditionalNameTW || hex.traditionalName;

    const imageTW = hex.imageZhTW || hex.imageZh;
    title = `${nameZhTW}卦 第${num}卦 | 易經線上占卜 51yijing.com`;
    description = `${nameZhTW}卦（${traditionalNameTW}）完整解讀：卦辭、六爻詳解、白話翻譯。了解${nameZhTW}卦在事業、感情、財運中的指引含義。`;
    keywords = `${nameZhTW}卦,${traditionalNameTW},第${num}卦,易經,周易,卦辭,爻辭,${imageTW.slice(0, 10)}`;
  } else {
    title = `${hex.nameZh}卦 第${num}卦 | 易经在线占卜 51yijing.com`;
    description = `${hex.nameZh}卦（${hex.traditionalName}）完整解读：卦辞、六爻详解、白话翻译。了解${hex.nameZh}卦在事业、感情、财运中的指引含义。`;
    keywords = `${hex.nameZh}卦,${hex.traditionalName},第${num}卦,易经,周易,卦辞,爻辞,${hex.imageZh.slice(0, 10)}`;
  }

  return {
    title,
    description: description.slice(0, 160),
    keywords,
    alternates: {
      canonical,
      languages: getAlternateLanguages(`/hexagrams/${num}`),
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

  // Load full hexagram data from seed files at build time (SSG)
  const fullData = getHexagramFullData(num);

  return (
    <>
      <HexagramArticleJsonLd hexagram={hex} locale={locale} />
      <HexagramFaqJsonLd hexagram={hex} locale={locale} />
      <HexagramBreadcrumbJsonLd hexagram={hex} locale={locale} />
      <HexagramDetailContent
        hexagramNumber={num}
        initialData={fullData ?? null}
        heroContent={
          fullData ? (
            <HexagramHero data={fullData} locale={locale} hexagramNumber={num} />
          ) : undefined
        }
      />
    </>
  );
}
