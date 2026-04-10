import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Coins, Sparkles, BookOpen } from 'lucide-react';
import { HomeJsonLd } from '@/components/seo/JsonLd';
import { SITE_URL, SITE_DESC_ZH, SITE_DESC_EN, SITE_DESC_ZH_TW, getBaseUrl, getAlternateLanguages, getLocalizedText } from '@/lib/seo';
import { AnimatedTaichi } from '@/components/home/HeroAnimations';
import HomeNavBar from '@/components/home/HomeNavBar';
import TodayCounter from '@/components/home/TodayCounter';
import StartDivinationButton from '@/components/home/StartDivinationButton';
import SampleReading from '@/components/home/SampleReading';
import UserReviews from '@/components/home/UserReviews';

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
      icon: <Coins size={36} strokeWidth={1.5} className="text-gold mb-4" />,
      title: t('feature1Title'),
      desc: t('feature1Desc'),
    },
    {
      icon: <Sparkles size={36} strokeWidth={1.5} className="text-gold mb-4" />,
      title: t('feature2Title'),
      desc: t('feature2Desc'),
    },
    {
      icon: <BookOpen size={36} strokeWidth={1.5} className="text-gold mb-4" />,
      title: t('feature3Title'),
      desc: t('feature3Desc'),
    },
  ];

  return (
    <>
      <HomeJsonLd locale={locale} />
      <HomeNavBar />
      <main className="min-h-screen w-full bg-[#0a0a12]">
        <div className="w-full px-6" style={{ maxWidth: '768px', margin: '0 auto', paddingTop: '220px', paddingBottom: '80px' }}>
          {/* 太极图 */}
          <div className="flex justify-center">
            <AnimatedTaichi>
              <div className="taichi-rotate">
                <div className="taichi-symbol w-[80px] h-[80px] md:w-[100px] md:h-[100px]" />
              </div>
            </AnimatedTaichi>
          </div>

          {/* 主标题 — server rendered for SEO */}
          <h1 className="mt-5 text-2xl md:text-3xl text-gold-gradient font-title font-bold text-center leading-tight">
            {t('title')}
          </h1>

          {/* 副标题 — server rendered for SEO */}
          <p className="mt-4 text-xl text-[#a0978a] text-center">
            {t('subtitle')}
          </p>

          {/* 今日咨询计数器 (client) */}
          <div className="mt-8">
            <TodayCounter />
          </div>

          {/* 交互区域：场景选择 + 输入框 + 出生时辰 + 摇卦按钮 (client) */}
          <StartDivinationButton />

          {/* 三大核心功能标题 — server rendered for SEO */}
          <div className="mt-32">
            <h2 className="text-xl text-gold font-title text-center">
              {t('featuresSectionTitle')}
            </h2>

            {/* 三张功能卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-8">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="bg-[rgba(255,255,255,0.03)] border border-[rgba(201,169,110,0.15)] rounded-2xl py-8 px-5 min-h-[180px] text-center flex flex-col items-center"
                >
                  {f.icon}
                  <h3 className="text-lg font-bold text-[#f5f0e8] mb-2">{f.title}</h3>
                  <p className="text-sm text-[#a0978a] leading-relaxed whitespace-pre-line">
                    {f.desc.replace(/\\n/g, '\n')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 占卜结果示例 (client) */}
          <SampleReading />

          {/* 用户评价展示区 (client) */}
          <UserReviews />

          {/* 底部引言 — server rendered for SEO */}
          <p className="mt-16 text-xl text-[#a0978a] text-center">
            {t('footerQuote')}
          </p>

          {/* 免责声明 — server rendered */}
          <p className="mt-5 text-xs text-[#555] text-center">
            {t('disclaimer')}
          </p>

          {/* SEO Content Sections — server rendered for SEO */}
          <div className="mt-20 space-y-12">
            <section>
              <h2 className="text-lg text-[#a08050] font-title font-semibold mb-4">
                {t('seoSection1Title')}
              </h2>
              <p className="text-sm text-[#706860] leading-relaxed">
                {t('seoSection1Content')}
              </p>
            </section>
            <section>
              <h2 className="text-lg text-[#a08050] font-title font-semibold mb-4">
                {t('seoSection2Title')}
              </h2>
              <p className="text-sm text-[#706860] leading-relaxed">
                {t('seoSection2Content')}
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
