import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { GUIDE_ARTICLES, type GuideSlug } from '@/data/guide';
import { JsonLd } from '@/components/seo/JsonLd';

interface GuideArticleLayoutProps {
  locale: string;
  slug: GuideSlug;
  children: React.ReactNode;
}

export function GuideArticleLayout({ locale, slug, children }: GuideArticleLayoutProps) {
  const isEn = locale === 'en';
  const isZhTW = locale === 'zh-TW';
  const idx = GUIDE_ARTICLES.findIndex((a) => a.slug === slug);
  const article = GUIDE_ARTICLES[idx];
  const prev = idx > 0 ? GUIDE_ARTICLES[idx - 1] : null;
  const next = idx < GUIDE_ARTICLES.length - 1 ? GUIDE_ARTICLES[idx + 1] : null;

  const title = isEn ? article.titleEn : isZhTW ? article.titleZhTW : article.titleZh;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isEn ? 'Home' : '首页', item: `https://51yijing.com/${locale === 'zh' ? '' : locale}` },
      { '@type': 'ListItem', position: 2, name: isEn ? 'Guide' : '入门指南', item: `https://51yijing.com/${locale === 'zh' ? '' : locale + '/'}guide` },
      { '@type': 'ListItem', position: 3, name: title, item: `https://51yijing.com/${locale === 'zh' ? '' : locale + '/'}guide/${slug}` },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <main className="min-h-screen bg-gradient-to-b from-amber-50/40 to-white py-12 px-4">
        <article className="mx-auto max-w-[42rem]">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-stone-400 mb-8">
            <Link href={`/${locale}/guide`} className="hover:text-amber-600 transition-colors">
              {isEn ? 'Guide' : isZhTW ? '入門指南' : '入门指南'}
            </Link>
            <span>/</span>
            <span className="text-stone-600">{title}</span>
          </nav>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-4">
            {GUIDE_ARTICLES.map((a, i) => (
              <div
                key={a.slug}
                className={`w-8 h-1 rounded-full ${i === idx ? 'bg-amber-500' : 'bg-stone-200'}`}
              />
            ))}
            <span className="text-xs text-stone-400 ml-2">
              {idx + 1} / {GUIDE_ARTICLES.length}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-stone-800 mb-8">{title}</h1>

          {/* Content */}
          <div className="prose prose-stone prose-amber max-w-none
            prose-headings:text-stone-800 prose-headings:font-bold
            prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-amber-100 prose-h2:pb-2
            prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
            prose-p:leading-relaxed prose-p:text-stone-600
            prose-li:text-stone-600
            prose-strong:text-stone-800
            prose-blockquote:border-amber-300 prose-blockquote:bg-amber-50/50 prose-blockquote:rounded-r-lg prose-blockquote:py-1
          ">
            {children}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-xl bg-amber-50 border border-amber-200 p-6 text-center">
            <p className="text-stone-600 mb-3">
              {isEn
                ? 'Ready to try it yourself?'
                : isZhTW
                ? '準備好親自體驗了嗎？'
                : '准备好亲自体验了吗？'}
            </p>
            <Link
              href={`/${locale}/divine`}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              {isEn ? 'Start Divination' : isZhTW ? '開始占卜' : '开始占卜'}
            </Link>
          </div>

          {/* Prev / Next */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-stone-200">
            {prev ? (
              <Link
                href={`/${locale}/guide/${prev.slug}`}
                className="flex items-center gap-1 text-sm text-stone-500 hover:text-amber-600 transition-colors"
              >
                <ChevronLeft size={16} />
                {isEn ? prev.titleEn : isZhTW ? prev.titleZhTW : prev.titleZh}
              </Link>
            ) : <div />}
            {next ? (
              <Link
                href={`/${locale}/guide/${next.slug}`}
                className="flex items-center gap-1 text-sm text-stone-500 hover:text-amber-600 transition-colors"
              >
                {isEn ? next.titleEn : isZhTW ? next.titleZhTW : next.titleZh}
                <ChevronRight size={16} />
              </Link>
            ) : <div />}
          </div>
        </article>
      </main>
    </>
  );
}
