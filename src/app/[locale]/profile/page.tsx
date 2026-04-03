import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import ProfileContent from '@/components/profile/ProfileContent';
import { getBaseUrl, getAlternateLanguages, getLocalizedText } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = getBaseUrl(locale) + '/profile';

  return {
    title: getLocalizedText(locale, '个人中心', 'My Profile', '個人中心'),
    description: getLocalizedText(
      locale,
      '查看你的占卜统计、收藏卦象和账户设置。',
      'View your divination stats, saved hexagrams, and account settings.',
      '查看你的占卜統計、收藏卦象和帳戶設定。'
    ),
    alternates: {
      canonical,
      languages: getAlternateLanguages('/profile'),
    },
    robots: { index: false, follow: true },
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProfileContent />;
}
