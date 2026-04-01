import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { SITE_URL, SITE_NAME, getLocalizedText, getAlternateLanguages } from '@/lib/seo';
import ContactContent from '@/components/legal/ContactContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title = getLocalizedText(
    locale,
    '联系我们 | 51yijing.com',
    'Contact Us | 51yijing.com',
    '聯繫我們 | 51yijing.com'
  );

  const description = getLocalizedText(
    locale,
    '联系 51yijing.com 团队，提交反馈或咨询。',
    'Contact the 51yijing.com team for feedback or inquiries.',
    '聯繫 51yijing.com 團隊，提交反饋或諮詢。'
  );

  return {
    title,
    description,
    alternates: {
      languages: getAlternateLanguages('/contact'),
    },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: SITE_NAME,
      url: `${SITE_URL}/${locale === 'zh' ? '' : locale + '/'}contact`,
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ContactContent />;
}
