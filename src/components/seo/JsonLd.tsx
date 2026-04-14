import { SITE_URL, SITE_NAME, SITE_DESC_ZH, SITE_DESC_EN, SITE_DESC_ZH_TW, getLocalizedText, getLocalePrefix } from '@/lib/seo';
import { HEXAGRAM_DATA, type HexagramSEOData } from '@/data/hexagrams';

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
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

/** FAQPage schema for homepage */
export function HomeFaqJsonLd({ locale }: { locale: string }) {
  const isEn = locale === 'en';
  const isZhTW = locale === 'zh-TW';

  const faqs = isEn ? [
    { q: 'Is I Ching divination free?', a: 'Completely free. All features on 51yijing.com — coin toss, AI interpretation, and the 64 hexagram reference — are permanently free with no registration required.' },
    { q: 'How accurate are the divination results?', a: 'The I Ching operates on the principle that sincerity matters most. Hexagrams are randomly generated and AI interpretations draw from thousands of years of classical commentary. Results are for reference only and do not constitute decision-making advice.' },
    { q: 'What is the three-coin method?', a: 'Three virtual coins are tossed six times. The combination of heads and tails determines whether each line is yin or yang, producing a complete hexagram. This is the most traditional method of I Ching divination.' },
    { q: 'What are changing lines?', a: 'Changing lines (moving lines) are lines in a state of transformation, representing the direction of change in the current situation. When present, a second hexagram is generated to provide more complete guidance.' },
    { q: 'Can I consult the same question multiple times?', a: 'Tradition advises against repeating the same question to maintain sincerity. If circumstances have substantially changed, a new reading is appropriate.' },
    { q: 'What languages are supported?', a: 'Simplified Chinese, Traditional Chinese, and English are currently supported. Switch languages in the top-right corner of the page.' },
  ] : isZhTW ? [
    { q: '占卜需要付費嗎？', a: '完全免費。51yijing.com 的所有功能——搖卦、AI解讀、六十四卦查詢——均永久免費，無需註冊。' },
    { q: '占卜結果準確嗎？', a: '易經的核心是「心誠則靈」。卦象完全隨機生成，AI解讀基於數千年經典注疏。結果僅供參考，不構成決策建議。' },
    { q: '三幣占卜法是什麼？', a: '虛擬拋擲三枚銅錢六次，根據正反面組合確定每爻陰陽，六次得到完整卦象。這是最經典的易經起卦方式。' },
    { q: '什麼是動爻？', a: '動爻（變爻）是卦象中處於變化狀態的爻線，代表當前局勢的轉變趨勢。有動爻時會生成變卦，提供更完整的指引。' },
    { q: '可以反覆占卜同一個問題嗎？', a: '傳統上建議同一問題不重複占卜，以保持誠心。如果情況有實質變化，可以重新起卦。' },
    { q: '支援哪些語言？', a: '目前支援簡體中文、繁體中文和英文，可在頁面右上角切換語言。' },
  ] : [
    { q: '占卜需要付费吗？', a: '完全免费。51yijing.com 的所有功能——摇卦、AI解读、六十四卦查询——均永久免费，无需注册。' },
    { q: '占卜结果准确吗？', a: '易经的核心是"心诚则灵"。卦象完全随机生成，AI解读基于数千年经典注疏。结果仅供参考，不构成决策建议。' },
    { q: '三币占卜法是什么？', a: '虚拟抛掷三枚铜钱六次，根据正反面组合确定每爻阴阳，六次得到完整卦象。这是最经典的易经起卦方式。' },
    { q: '什么是动爻？', a: '动爻（变爻）是卦象中处于变化状态的爻线，代表当前局势的转变趋势。有动爻时会生成变卦，提供更完整的指引。' },
    { q: '可以反复占卜同一个问题吗？', a: '传统上建议同一问题不重复占卜，以保持诚心。如果情况有实质变化，可以重新起卦。' },
    { q: '支持哪些语言？', a: '目前支持简体中文、繁体中文和英文，可在页面右上角切换语言。' },
  ];

  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return <JsonLdScript data={data} />;
}

/** FAQPage schema for individual hexagram pages */
export function HexagramFaqJsonLd({
  hexagram,
  locale,
}: {
  hexagram: HexagramSEOData;
  locale: string;
}) {
  const isEn = locale === 'en';
  const isZhTW = locale === 'zh-TW';

  const name = isEn ? hexagram.nameEn : isZhTW ? (hexagram.nameZhTW || hexagram.nameZh) : hexagram.nameZh;
  const trad = isZhTW ? (hexagram.traditionalNameTW || hexagram.traditionalName) : hexagram.traditionalName;
  const judgment = isEn ? hexagram.judgmentEn : isZhTW ? (hexagram.judgmentZhTW || hexagram.judgmentZh) : hexagram.judgmentZh;
  const interpretation = isEn ? hexagram.interpretationEn : isZhTW ? (hexagram.interpretationZhTW || hexagram.interpretationZh) : hexagram.interpretationZh;
  const image = isEn ? hexagram.imageEn : isZhTW ? (hexagram.imageZhTW || hexagram.imageZh) : hexagram.imageZh;

  const faqs = isEn ? [
    {
      q: `What does Hexagram ${hexagram.number} (${name}) mean?`,
      a: `${name} (Hexagram ${hexagram.number}) is known as "${trad}". ${interpretation}`,
    },
    {
      q: `What is the judgment of Hexagram ${hexagram.number}?`,
      a: judgment,
    },
    {
      q: `What is the image of Hexagram ${hexagram.number}?`,
      a: image,
    },
  ] : isZhTW ? [
    {
      q: `${name}卦（第${hexagram.number}卦）是什麼意思？`,
      a: `${name}卦，又稱「${trad}」，是易經第${hexagram.number}卦。${interpretation}`,
    },
    {
      q: `${name}卦的卦辭是什麼？`,
      a: judgment,
    },
    {
      q: `${name}卦的象辭是什麼？`,
      a: image,
    },
  ] : [
    {
      q: `${name}卦（第${hexagram.number}卦）是什么意思？`,
      a: `${name}卦，又称「${trad}」，是易经第${hexagram.number}卦。${interpretation}`,
    },
    {
      q: `${name}卦的卦辞是什么？`,
      a: judgment,
    },
    {
      q: `${name}卦的象辞是什么？`,
      a: image,
    },
  ];

  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return <JsonLdScript data={data} />;
}

/** BreadcrumbList schema for individual hexagram pages */
export function HexagramBreadcrumbJsonLd({ hexagram, locale }: { hexagram: HexagramSEOData; locale: string }) {
  const prefix = getLocalePrefix(locale);
  const isEn = locale === 'en';
  const isZhTW = locale === 'zh-TW';

  const hexagramName = isEn
    ? `Hexagram ${hexagram.number}: ${hexagram.nameEn}`
    : isZhTW
      ? `${hexagram.nameZhTW || hexagram.nameZh}卦`
      : `${hexagram.nameZh}卦`;

  const catalogName = isEn ? 'Hexagrams' : '卦典';

  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${SITE_URL}${prefix}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: catalogName,
        item: `${SITE_URL}${prefix}/hexagrams`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: hexagramName,
        item: `${SITE_URL}${prefix}/hexagrams/${hexagram.number}`,
      },
    ],
  };

  return <JsonLdScript data={data} />;
}

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
