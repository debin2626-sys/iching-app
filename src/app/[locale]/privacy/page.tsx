import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { SITE_URL, SITE_NAME, getLocalizedText, getAlternateLanguages } from '@/lib/seo';
import PrivacyContent from '@/components/legal/PrivacyContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title = getLocalizedText(
    locale,
    '隐私政策 | 51yijing.com',
    'Privacy Policy | 51yijing.com',
    '隱私政策 | 51yijing.com'
  );

  const description = getLocalizedText(
    locale,
    '了解 51yijing.com 如何收集、使用和保护您的个人信息。',
    'Learn how 51yijing.com collects, uses, and protects your personal information.',
    '了解 51yijing.com 如何收集、使用和保護您的個人資訊。'
  );

  return {
    title,
    description,
    alternates: {
      languages: getAlternateLanguages('/privacy'),
    },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: SITE_NAME,
      url: `${SITE_URL}/${locale === 'zh' ? '' : locale + '/'}privacy`,
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PrivacyContent />;
}
