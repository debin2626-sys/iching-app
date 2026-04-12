import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Coins, Sparkles, BookOpen } from 'lucide-react';
import { HomeJsonLd } from '@/components/seo/JsonLd';
import { SITE_DESC_ZH, SITE_DESC_EN, SITE_DESC_ZH_TW, getBaseUrl, getAlternateLanguages, getLocalizedText } from '@/lib/seo';
import HomeNavBar from '@/components/home/HomeNavBar';
import TodayCounter from '@/components/home/TodayCounter';
import SampleReadingClient from '@/components/home/SampleReading';
import { SampleReadingSectionHeader, SampleReadingCardContent } from '@/components/home/SampleReadingContent';
import UserReviews from '@/components/home/UserReviews';
import { TaichiWatermark, BrushDivider, CloudPattern } from '@/components/decorative';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

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

  const features = [
    {
      icon: <Coins size={36} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} className="mb-4" />,
      title: t('feature1Title'),
      desc: t('feature1Desc'),
    },
    {
      icon: <Sparkles size={36} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} className="mb-4" />,
      title: t('feature2Title'),
      desc: t('feature2Desc'),
    },
    {
      icon: <BookOpen size={36} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} className="mb-4" />,
      title: t('feature3Title'),
      desc: t('feature3Desc'),
    },
  ];

  return (
    <>
      <HomeJsonLd locale={locale} />
      <HomeNavBar />
      <main className="min-h-screen w-full" style={{ backgroundColor: 'var(--theme-bg)' }}>
        <div className="w-full px-6" style={{ maxWidth: '768px', margin: '0 auto', paddingTop: '120px', paddingBottom: '80px' }}>

          {/* Hero Section */}
          <section className="relative flex flex-col items-center text-center">
            {/* Cloud Pattern Decoration */}
            <CloudPattern position="top" className="absolute top-0 left-0 right-0" />
            {/* Taichi Watermark Background */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <TaichiWatermark size={500} opacity={0.07} />
            </div>

            {/* Brand Name */}
            <h1
              className="relative text-5xl md:text-7xl font-bold tracking-wider"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--theme-text-primary)',
              }}
            >
              {t('heroTitle')}
            </h1>

            {/* Subtitle */}
            <p
              className="relative mt-4 text-lg md:text-xl"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--theme-text-secondary)',
              }}
            >
              {t('heroSubtitle')}
            </p>

            {/* Brush Divider */}
            <div className="relative mt-8 w-48">
              <BrushDivider />
            </div>

            {/* CTA Button */}
            <div className="relative mt-8">
              <Button href="/divine" variant="primary" size="lg">
                {t('ctaButton')}
              </Button>
            </div>
          </section>

          {/* Today Counter */}
          <div className="mt-16">
            <TodayCounter />
          </div>

          {/* Core Features Section */}
          <section className="mt-20">
            <h2
              className="text-xl text-center"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-gold)',
              }}
            >
              {t('coreFeatures')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-8">
              {features.map((f) => (
                <Card key={f.title} variant="default" padding="lg" className="text-center flex flex-col items-center min-h-[180px]">
                  {f.icon}
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ color: 'var(--theme-text-primary)' }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed whitespace-pre-line"
                    style={{ color: 'var(--theme-text-secondary)' }}
                  >
                    {f.desc.replace(/\\n/g, '\n')}
                  </p>
                </Card>
              ))}
            </div>
          </section>

          {/* Sample Reading */}
          <SampleReadingClient
            locale={locale}
            header={<SampleReadingSectionHeader locale={locale} />}
          >
            <SampleReadingCardContent locale={locale} />
          </SampleReadingClient>

          {/* User Reviews */}
          <UserReviews />

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
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-gold)',
                }}
              >
                {t('seoSection1Title')}
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--theme-text-muted)' }}
              >
                {t('seoSection1Content')}
              </p>
            </section>
            <section>
              <h2
                className="text-lg font-semibold mb-4"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-gold)',
                }}
              >
                {t('seoSection2Title')}
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--theme-text-muted)' }}
              >
                {t('seoSection2Content')}
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
