import { SITE_URL, SITE_NAME, SITE_DESC_ZH, SITE_DESC_EN, SITE_DESC_ZH_TW, getLocalizedText } from '@/lib/seo';
import { HEXAGRAM_DATA, type HexagramSEOData } from '@/data/hexagrams';

interface JsonLdProps {
  data: Record<string, unknown>;
}

function JsonLdScript({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function getInLanguage(locale: string): string {
  if (locale === 'zh-TW') return 'zh-TW';
  if (locale === 'en') return 'en';
  return 'zh-CN';
}

/** WebSite + Organization schema for homepage */
export function HomeJsonLd({ locale }: { locale: string }) {
  const description = getLocalizedText(locale, SITE_DESC_ZH, SITE_DESC_EN, SITE_DESC_ZH_TW);
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: getLocalizedText(locale, '易经在线占卜', 'I Ching Online Divination', '易經線上占卜'),
    alternateName: '51yijing',
    url: SITE_URL,
    description,
    inLanguage: getInLanguage(locale),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/${locale}/hexagrams?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const orgData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    description,
    sameAs: ['https://github.com/debin2626-sys/iching-app'],
  };

  return (
    <>
      <JsonLdScript data={websiteData} />
      <JsonLdScript data={orgData} />
    </>
  );
}

/** ItemList schema for hexagram catalog page */
export function HexagramListJsonLd({ locale }: { locale: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: getLocalizedText(locale, '六十四卦典', 'The 64 Hexagrams', '六十四卦典'),
    description: getLocalizedText(
      locale,
      '易经六十四卦完整列表，包含卦辞、爻辞及详细解读',
      'Complete list of 64 I Ching hexagrams with judgments, line texts, and interpretations',
      '易經六十四卦完整列表，包含卦辭、爻辭及詳細解讀'
    ),
    numberOfItems: 64,
    itemListElement: HEXAGRAM_DATA.map((h) => ({
      '@type': 'ListItem',
      position: h.number,
      name: locale === 'en'
        ? `Hexagram ${h.number}: ${h.nameEn}`
        : locale === 'zh-TW'
          ? `${h.nameZhTW || h.nameZh}卦 - ${h.traditionalNameTW || h.traditionalName}`
          : `${h.nameZh}卦 - ${h.traditionalName}`,
      url: `${SITE_URL}/${locale}/hexagrams/${h.number}`,
    })),
  };

  return <JsonLdScript data={data} />;
}

/** Article schema for individual hexagram page */
export function HexagramArticleJsonLd({
  hexagram,
  locale,
}: {
  hexagram: HexagramSEOData;
  locale: string;
}) {
  const isEn = locale === 'en';
  const isZhTW = locale === 'zh-TW';

  let headline: string;
  let description: string;
  let keywords: string;
  let articleSection: string;

  if (isEn) {
    headline = `Hexagram ${hexagram.number}: ${hexagram.nameEn}`;
    description = hexagram.judgmentEn;
    keywords = `hexagram ${hexagram.number},${hexagram.nameEn},I Ching,Yi Jing,divination`;
    articleSection = 'I Ching Hexagrams';
  } else if (isZhTW) {
    const name = hexagram.nameZhTW || hexagram.nameZh;
    const trad = hexagram.traditionalNameTW || hexagram.traditionalName;
    headline = `${name}卦 - ${trad} | 第${hexagram.number}卦`;
    description = hexagram.judgmentZhTW || hexagram.judgmentZh;
    keywords = `${name}卦,${trad},易經,周易,第${hexagram.number}卦,卦辭,爻辭`;
    articleSection = '易經卦典';
  } else {
    headline = `${hexagram.nameZh}卦 - ${hexagram.traditionalName} | 第${hexagram.number}卦`;
    description = hexagram.judgmentZh;
    keywords = `${hexagram.nameZh}卦,${hexagram.traditionalName},易经,周易,第${hexagram.number}卦,卦辞,爻辞`;
    articleSection = '易经卦典';
  }

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image: `${SITE_URL}/icon.png`,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${locale}/hexagrams/${hexagram.number}`,
    },
    articleSection,
    inLanguage: getInLanguage(locale),
    keywords,
  };

  return <JsonLdScript data={data} />;
}
