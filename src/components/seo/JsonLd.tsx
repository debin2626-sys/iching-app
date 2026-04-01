import { SITE_URL, SITE_NAME, SITE_DESC_ZH, SITE_DESC_EN } from '@/lib/seo';
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

/** WebSite + Organization schema for homepage */
export function HomeJsonLd({ locale }: { locale: string }) {
  const isZh = locale === 'zh';
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: isZh ? '易经在线占卜' : 'I Ching Online Divination',
    alternateName: isZh ? '51yijing' : '51yijing',
    url: SITE_URL,
    description: isZh ? SITE_DESC_ZH : SITE_DESC_EN,
    inLanguage: isZh ? 'zh-CN' : 'en',
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
    description: isZh ? SITE_DESC_ZH : SITE_DESC_EN,
    sameAs: [],
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
  const isZh = locale === 'zh';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: isZh ? '六十四卦典' : 'The 64 Hexagrams',
    description: isZh
      ? '易经六十四卦完整列表，包含卦辞、爻辞及详细解读'
      : 'Complete list of 64 I Ching hexagrams with judgments, line texts, and interpretations',
    numberOfItems: 64,
    itemListElement: HEXAGRAM_DATA.map((h) => ({
      '@type': 'ListItem',
      position: h.number,
      name: isZh ? `${h.nameZh}卦 - ${h.traditionalName}` : `Hexagram ${h.number}: ${h.nameEn}`,
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
  const isZh = locale === 'zh';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isZh
      ? `${hexagram.nameZh}卦 - ${hexagram.traditionalName} | 第${hexagram.number}卦`
      : `Hexagram ${hexagram.number}: ${hexagram.nameEn}`,
    description: isZh ? hexagram.judgmentZh : hexagram.judgmentEn,
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
    articleSection: isZh ? '易经卦典' : 'I Ching Hexagrams',
    inLanguage: isZh ? 'zh-CN' : 'en',
    keywords: isZh
      ? `${hexagram.nameZh}卦,${hexagram.traditionalName},易经,周易,第${hexagram.number}卦,卦辞,爻辞`
      : `hexagram ${hexagram.number},${hexagram.nameEn},I Ching,Yi Jing,divination`,
  };

  return <JsonLdScript data={data} />;
}
