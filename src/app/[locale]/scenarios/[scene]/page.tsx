import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Briefcase, Heart, DollarSign, GraduationCap, Leaf } from 'lucide-react';
import type { Metadata } from 'next';
import { SCENARIO_IDS, SCENARIO_HEXAGRAMS, SCENARIO_META, type ScenarioId } from '@/data/scenarios';
import { HEXAGRAM_DATA } from '@/data/hexagrams';
import { getBaseUrl, getAlternateLanguages, getLocalizedText } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

const ICONS = { Briefcase, Heart, DollarSign, GraduationCap, Leaf };

export async function generateStaticParams() {
  return SCENARIO_IDS.map((scene) => ({ scene }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; scene: string }>;
}): Promise<Metadata> {
  const { locale, scene } = await params;
  if (!SCENARIO_IDS.includes(scene as ScenarioId)) return {};

  const meta = SCENARIO_META[scene as ScenarioId];
  const isEn = locale === 'en';
  const isZhTW = locale === 'zh-TW';

  const nameZh = meta.nameZh;
  const nameZhTW = meta.nameZhTW;
  const nameEn = meta.nameEn;
  const name = isEn ? nameEn : isZhTW ? nameZhTW : nameZh;
  const desc = isEn ? meta.descEn : isZhTW ? meta.descZhTW : meta.descZh;
  const count = SCENARIO_HEXAGRAMS[scene as ScenarioId].length;

  const title = getLocalizedText(
    locale,
    `${nameZh}易经卦象（${count}个卦象）| 51yijing.com`,
    `${nameEn} I Ching Hexagrams (${count} hexagrams) | 51yijing.com`,
    `${nameZhTW}易經卦象（${count}個卦象）| 51yijing.com`,
  );

  const description = getLocalizedText(
    locale,
    `探索${count}个与${nameZh}相关的易经卦象。${meta.descZh}。获得三千年古老智慧对${nameZh}问题的指引。`,
    `Explore ${count} I Ching hexagrams related to ${nameEn.toLowerCase()}. ${meta.descEn}. Get ancient wisdom guidance for your ${nameEn.toLowerCase()} questions.`,
    `探索${count}個與${nameZhTW}相關的易經卦象。${meta.descZhTW}。獲得三千年古老智慧對${nameZhTW}問題的指引。`,
  );

  const canonical = getBaseUrl(locale) + '/scenarios/' + scene;

  return {
    title,
    description,
    keywords: isEn
      ? `${nameEn},I Ching,Yi Jing,hexagram,divination,${meta.descEn}`
      : `${nameZh},易经,周易,卦象,占卜,${meta.descZh}`,
    alternates: {
      canonical,
      languages: getAlternateLanguages(`/scenarios/${scene}`),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ScenarioPage({
  params,
}: {
  params: Promise<{ locale: string; scene: string }>;
}) {
  const { locale, scene } = await params;

  if (!SCENARIO_IDS.includes(scene as ScenarioId)) notFound();

  const sceneId = scene as ScenarioId;
  const meta = SCENARIO_META[sceneId];
  const hexNums = SCENARIO_HEXAGRAMS[sceneId];
  const hexagrams = hexNums
    .map((n) => HEXAGRAM_DATA.find((h) => h.number === n))
    .filter(Boolean);

  const t = await getTranslations('Scenario');
  const isEn = locale === 'en';
  const isZhTW = locale === 'zh-TW';

  const name = isEn ? meta.nameEn : isZhTW ? meta.nameZhTW : meta.nameZh;
  const intro = t(`${sceneId}.intro`);

  const Icon = ICONS[meta.icon as keyof typeof ICONS];

  // JSON-LD breadcrumb
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isEn ? 'Home' : '首页', item: `https://51yijing.com/${locale}` },
      { '@type': 'ListItem', position: 2, name: isEn ? 'Scenarios' : '场景', item: `https://51yijing.com/${locale}/scenarios` },
      { '@type': 'ListItem', position: 3, name, item: `https://51yijing.com/${locale}/scenarios/${scene}` },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />

      <main className="min-h-screen bg-gradient-to-b from-amber-50/40 to-white">
        {/* Hero */}
        <section className="py-12 px-4 text-center border-b border-amber-100">
          <div className="mx-auto max-w-[42rem]">
            {/* Scenario nav pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {SCENARIO_IDS.map((s) => {
                const sm = SCENARIO_META[s];
                const sName = isEn ? sm.nameEn : isZhTW ? sm.nameZhTW : sm.nameZh;
                const SIcon = ICONS[sm.icon as keyof typeof ICONS];
                return (
                  <Link
                    key={s}
                    href={`/${locale}/scenarios/${s}`}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      s === sceneId
                        ? `${sm.bgColor} ${sm.color} ring-1 ring-current`
                        : 'bg-white text-stone-500 hover:bg-stone-50 border border-stone-200'
                    }`}
                  >
                    <SIcon className="w-3.5 h-3.5" />
                    {sName}
                  </Link>
                );
              })}
            </div>

            {/* Title */}
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${meta.bgColor} mb-4`}>
              <Icon className={`w-7 h-7 ${meta.color}`} />
            </div>
            <h1 className="text-3xl font-bold text-stone-800 mb-3">
              {name}
            </h1>
            <p className="text-stone-500 text-base leading-relaxed mb-6">{intro}</p>
            <Link
              href={`/${locale}/divine`}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              {t('startDivination')}
            </Link>
          </div>
        </section>

        {/* Hexagram grid */}
        <section className="py-10 px-4">
          <div className="mx-auto max-w-[56rem]">
            <h2 className="text-lg font-semibold text-stone-700 mb-6 text-center">
              {t('relatedHexagrams')}
              <span className="ml-2 text-sm font-normal text-stone-400">
                {t('hexagramCount', { count: hexagrams.length })}
              </span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {hexagrams.map((hex) => {
                if (!hex) return null;
                const hexName = isEn ? hex.nameEn : isZhTW ? (hex.nameZhTW || hex.nameZh) : hex.nameZh;
                const hexTrad = isZhTW ? (hex.traditionalNameTW || hex.traditionalName) : hex.traditionalName;
                const hexInterp = isEn ? hex.interpretationEn : isZhTW ? (hex.interpretationZhTW || hex.interpretationZh) : hex.interpretationZh;

                return (
                  <Link
                    key={hex.number}
                    href={`/${locale}/hexagrams/${hex.number}`}
                    className="group bg-white rounded-xl border border-stone-100 hover:border-amber-200 hover:shadow-md transition-all p-4 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{hex.symbol.split('').map(b => b === '1' ? '⚊' : '⚋').join('')}</span>
                      <span className="text-xs text-stone-400">第{hex.number}卦</span>
                    </div>
                    <div>
                      <p className="font-semibold text-stone-800 group-hover:text-amber-700 transition-colors">
                        {hexName}卦
                      </p>
                      <p className="text-xs text-stone-400 mt-0.5">{isEn ? hex.traditionalName : hexTrad}</p>
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {hexInterp}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-10 px-4 text-center border-t border-amber-100">
          <div className="mx-auto max-w-[36rem]">
            <p className="text-stone-600 mb-4">
              {isEn
                ? `Have a question about ${name.toLowerCase()}? Start a divination now.`
                : `有关于${name}的困惑？立即开始占卜，获得指引。`}
            </p>
            <Link
              href={`/${locale}/divine`}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              {t('startDivination')}
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
