import Link from 'next/link';
import type { Metadata } from 'next';
import { GUIDE_ARTICLES } from '@/data/guide';
import { getAlternateLanguages } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const canonical = `https://51yijing.com/${locale === 'zh' ? '' : locale + '/'}guide`;

  const title = isEn
    ? 'I Ching Beginner Guide — Learn the Basics | 51yijing.com'
    : '易经入门指南 — 从零开始学易经 | 51yijing.com';
  const description = isEn
    ? 'New to the I Ching? Start here. Learn what the I Ching is, how to cast hexagrams, and how to read changing lines.'
    : '易经新手？从这里开始。了解什么是易经、如何起卦、如何看变爻，三篇文章带你入门。';

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: getAlternateLanguages('/guide'),
    },
    openGraph: { title, description, url: canonical, type: 'website' },
  };
}

export default async function GuideIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const isZhTW = locale === 'zh-TW';

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50/40 to-white py-12 px-4">
      <div className="mx-auto max-w-[42rem]">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-stone-800 mb-3">
            {isEn ? 'I Ching Beginner Guide' : isZhTW ? '易經入門指南' : '易经入门指南'}
          </h1>
          <p className="text-stone-500 text-base">
            {isEn
              ? 'Three articles to get you started with the I Ching'
              : isZhTW
              ? '三篇文章帶你從零開始學易經'
              : '三篇文章带你从零开始学易经'}
          </p>
        </div>

        <div className="space-y-4">
          {GUIDE_ARTICLES.map((article, idx) => {
            const Icon = article.icon;
            const title = isEn ? article.titleEn : isZhTW ? article.titleZhTW : article.titleZh;
            const desc = isEn ? article.descEn : isZhTW ? article.descZhTW : article.descZh;

            return (
              <Link
                key={article.slug}
                href={`/${locale}/guide/${article.slug}`}
                className="group flex items-start gap-4 bg-white rounded-2xl border border-stone-100 hover:border-amber-200 hover:shadow-lg transition-all p-6"
              >
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-700 font-bold text-lg">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-stone-800 group-hover:text-amber-700 transition-colors mb-1">
                    {title}
                  </h2>
                  <p className="text-sm text-stone-500">{desc}</p>
                </div>
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${article.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${article.color}`} />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={`/${locale}/divine`}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            {isEn ? 'Try a Divination Now' : isZhTW ? '立即開始占卜' : '立即开始占卜'}
          </Link>
        </div>
      </div>
    </main>
  );
}
