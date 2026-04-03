import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import SettingsContent from '@/components/profile/SettingsContent';
import { getBaseUrl, getAlternateLanguages, getLocalizedText } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = getBaseUrl(locale) + '/settings';

  return {
    title: getLocalizedText(locale, '偏好设置', 'Preferences', '偏好設定'),
    description: getLocalizedText(
      locale,
      '设置 AI 解读深度、语言偏好和通知选项。',
      'Configure AI reading depth, language preferences, and notification settings.',
      '設定 AI 解讀深度、語言偏好和通知選項。'
    ),
    alternates: {
      canonical,
      languages: getAlternateLanguages('/settings'),
    },
    robots: { index: false, follow: true },
  };
}

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SettingsContent />;
}
