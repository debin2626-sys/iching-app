import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Briefcase, Heart, DollarSign, GraduationCap, Leaf } from 'lucide-react';
import type { Metadata } from 'next';
import { SCENARIO_IDS, SCENARIO_HEXAGRAMS, SCENARIO_META } from '@/data/scenarios';
import { getBaseUrl, getAlternateLanguages, getLocalizedText } from '@/lib/seo';

const ICONS = { Briefcase, Heart, DollarSign, GraduationCap, Leaf };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = getBaseUrl(locale) + '/scenarios';

  const title = getLocalizedText(
    locale,
    '易经场景占卜 — 事业、感情、财运、学业、健康 | 51yijing.com',
    'I Ching by Life Scenario — Career, Love, Wealth & More | 51yijing.com',
    '易經場景占卜 — 事業、感情、財運、學業、健康 | 51yijing.com',
  );
  const description = getLocalizedText(
    locale,
    '按生活场景浏览易经卦象。探索事业、感情、财运、学业、健康五大场景，获得三千年古老智慧的指引。',
    'Explore I Ching hexagrams organized by life scenario. Find guidance for career, love, wealth, study, and health from 3000 years of ancient wisdom.',
    '按生活場景瀏覽易經卦象。探索事業、感情、財運、學業、健康五大場景，獲得三千年古老智慧的指引。',
  );

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: getAlternateLanguages('/scenarios'),
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

export default async function ScenariosIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('Scenario');
  const isEn = locale === 'en';
  const isZhTW = locale === 'zh-TW';

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50/40 to-white py-12 px-4">
      <div className="mx-auto max-w-[48rem]">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-stone-800 mb-3">
            {isEn ? 'I Ching by Life Scenario' : isZhTW ? '易經場景占卜' : '易经场景占卜'}
          </h1>
          <p className="text-stone-500 text-base">
            {isEn
              ? 'Choose a life area to explore relevant hexagrams and ancient wisdom'
              : isZhTW
              ? '選擇生活領域，探索相關卦象與古老智慧'
              : '选择生活领域，探索相关卦象与古老智慧'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SCENARIO_IDS.map((sceneId) => {
            const meta = SCENARIO_META[sceneId];
            const name = isEn ? meta.nameEn : isZhTW ? meta.nameZhTW : meta.nameZh;
            const desc = isEn ? meta.descEn : isZhTW ? meta.descZhTW : meta.descZh;
            const count = SCENARIO_HEXAGRAMS[sceneId].length;
            const Icon = ICONS[meta.icon as keyof typeof ICONS];

            return (
              <Link
                key={sceneId}
                href={`/${locale}/scenarios/${sceneId}`}
                className="group bg-white rounded-2xl border border-stone-100 hover:border-amber-200 hover:shadow-lg transition-all p-6 flex items-start gap-4"
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${meta.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${meta.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="font-semibold text-stone-800 group-hover:text-amber-700 transition-colors">
                      {name}
                    </h2>
                    <span className="text-xs text-stone-400 flex-shrink-0 ml-2">
                      {t('hexagramCount', { count })}
                    </span>
                  </div>
                  <p className="text-sm text-stone-500">{desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
