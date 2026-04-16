import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getBaseUrl, getAlternateLanguages, getLocalizedText } from '@/lib/seo';
import HomeNavBar from '@/components/home/HomeNavBar';
import DivineForm from './DivineForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = getBaseUrl(locale) + '/divine';

  const t = await getTranslations({ locale, namespace: 'Divine' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical,
      languages: getAlternateLanguages(),
    },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: canonical,
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metaTitle'),
      description: t('metaDescription'),
    },
  };
}

export default async function DivinePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HomeNavBar />
      <main className="min-h-screen w-full" style={{ backgroundColor: 'var(--theme-bg)' }}>
        <div className="w-full px-6" style={{ maxWidth: '768px', margin: '0 auto', paddingTop: '120px', paddingBottom: '80px' }}>
          <DivineForm />
        </div>
      </main>
    </>
  );
}
