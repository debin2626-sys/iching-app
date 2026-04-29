import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getBaseUrl, getAlternateLanguages } from '@/lib/seo';
import { getDailyLessonArchive } from '@/lib/daily-lesson-data';
import { PageLayout } from '@/components/ui/PageLayout';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ArchiveClient from './ArchiveClient';
import { getDayIndex } from '@/lib/daily-lesson';
import type { School } from '@/lib/daily-lesson';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const base = getBaseUrl(locale);
  const t = await getTranslations({ locale, namespace: 'Daily' });
  return {
    title: t('archiveTitle'),
    description: t('archiveDesc'),
    alternates: {
      canonical: `${base}/daily/archive`,
      languages: getAlternateLanguages('/daily/archive'),
    },
  };
}

export default async function ArchivePage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ school?: string; page?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Daily' });

  const school: School = (query.school === 'daoist' ? 'daoist' : 'yijing');
  const page = Math.max(1, parseInt(query.page ?? '1', 10) || 1);

  const data = await getDailyLessonArchive(school, locale, page);
  const dayResult = getDayIndex(new Date(), school);
  const currentDayIndex = dayResult.status === 'active' ? dayResult.dayIndex : undefined;

  return (
    <PageLayout maxWidth="max-w-[800px]">
      <Breadcrumb items={[
        { label: t('breadcrumbHome'), href: '/' },
        { label: t('breadcrumbDaily'), href: '/daily' },
        { label: t('breadcrumbArchive') },
      ]} />
      <ArchiveClient
        school={school}
        lessons={data.lessons}
        total={data.total}
        totalPages={data.totalPages}
        currentPage={page}
        currentDayIndex={currentDayIndex}
      />
    </PageLayout>
  );
}
