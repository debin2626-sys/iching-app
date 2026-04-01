import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { SITE_URL, SITE_NAME, getLocalizedText, getAlternateLanguages } from '@/lib/seo';
import TermsContent from '@/components/legal/TermsContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title = getLocalizedText(
    locale,
    '服务条款 | 51yijing.com',
    'Terms of Service | 51yijing.com',
    '服務條款 | 51yijing.com'
  );

  const description = getLocalizedText(
    locale,
    '51yijing.com 的服务条款和使用协议。',
    'Terms of Service and usage agreement for 51yijing.com.',
    '51yijing.com 的服務條款和使用協議。'
  );

  return {
    title,
    description,
    alternates: {
      languages: getAlternateLanguages('/terms'),
    },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: SITE_NAME,
      url: `${SITE_URL}/${locale === 'zh' ? '' : locale + '/'}terms`,
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TermsContent />;
}
