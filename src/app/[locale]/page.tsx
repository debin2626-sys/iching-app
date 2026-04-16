import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { HomeJsonLd, HomeFaqJsonLd } from '@/components/seo/JsonLd';
import { SITE_DESC_ZH, SITE_DESC_EN, SITE_DESC_ZH_TW, getBaseUrl, getAlternateLanguages, getLocalizedText } from '@/lib/seo';
import HomeNavBar from '@/components/home/HomeNavBar';
import SampleReadingClient from '@/components/home/SampleReading';
import { SampleReadingSectionHeader, SampleReadingCardContent } from '@/components/home/SampleReadingContent';
import UserReviews from '@/components/home/UserReviews';
import { HeroSection } from '@/components/home/HeroSection';
import { ScenarioSection } from '@/components/home/ScenarioSection';
import { TrustSection } from '@/components/home/TrustSection';
import { FaqCtaSection } from '@/components/home/FaqCtaSection';
import { GuideLinksSection } from '@/components/home/GuideLinksSection';
import { PopularHexagramsSection } from '@/components/home/PopularHexagramsSection';
import { StickyCtaBar } from '@/components/home/StickyCtaBar';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { prisma } from '@/lib/prisma';

async function getTotalCount(): Promise<number> {
  try {
    return await prisma.divination.count();
  } catch {
    return 0;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = getBaseUrl(locale);

  const title = getLocalizedText(
    locale,
    '易经在线占卜 | AI智能解读 - 51yijing.com',
    'Free I Ching Online Divination — AI-Powered Readings | 51yijing.com',
    '易經線上占卜 | AI智能解讀 - 51yijing.com'
  );

  const description = getLocalizedText(locale, SITE_DESC_ZH, SITE_DESC_EN, SITE_DESC_ZH_TW);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: getAlternateLanguages(),
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
      images: ['/og-image.png'],
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Home' });
  const totalCount = await getTotalCount();

  return (
    <>
      <HomeJsonLd locale={locale} />
      <HomeFaqJsonLd locale={locale} />
      <HomeNavBar />
      <main className="min-h-screen w-full" style={{ backgroundColor: 'var(--theme-bg)' }}>
        <div className="w-full px-6" style={{ maxWidth: '768px', margin: '0 auto', paddingTop: '120px', paddingBottom: '80px' }}>

          {/* 模块1: Hero */}
          <HeroSection totalCount={totalCount} />

          {/* 模块2: 场景 */}
          <ScenarioSection locale={locale} />

          {/* 模块3: 三步流程 (P1) */}
          <HowItWorksSection locale={locale} />

          {/* 示例解读 (P1 保留) */}
          <SampleReadingClient
            locale={locale}
            header={<SampleReadingSectionHeader locale={locale} />}
          >
            <SampleReadingCardContent locale={locale} />
          </SampleReadingClient>

          {/* 模块5: 信任 */}
          <TrustSection locale={locale} />

          {/* 用户评价 */}
          <UserReviews />

          {/* 入门指南内链 */}
          <GuideLinksSection locale={locale} />

          {/* 热门卦象内链 */}
          <PopularHexagramsSection locale={locale} />

          {/* 模块6: FAQ + 最终CTA */}
          <FaqCtaSection locale={locale} />

          {/* Footer Quote */}
          <p
            className="mt-16 text-xl text-center"
            style={{ color: 'var(--theme-text-secondary)' }}
          >
            {t('footerQuote')}
          </p>

          {/* Disclaimer */}
          <p
            className="mt-5 text-xs text-center"
            style={{ color: 'var(--theme-text-muted)' }}
          >
            {t('disclaimer')}
          </p>

          {/* SEO Content Sections */}
          <div className="mt-20 space-y-12">
            <section>
              <h2
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}
              >
                {t('seoSection1Title')}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>
                {t('seoSection1Content')}
              </p>
            </section>
            <section>
              <h2
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}
              >
                {t('seoSection2Title')}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>
                {t('seoSection2Content')}
              </p>
            </section>
          </div>

        </div>
      </main>

      {/* 移动端 Sticky Bar */}
      <StickyCtaBar locale={locale} />
    </>
  );
}
