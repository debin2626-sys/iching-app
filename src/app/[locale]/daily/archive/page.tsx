import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getBaseUrl, getAlternateLanguages } from '@/lib/seo';
import { getDailyLessonArchive } from '@/lib/daily-lesson-data';
import { PageLayout } from '@/components/ui/PageLayout';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ArchiveClient from './ArchiveClient';
import type { School } from '@/lib/daily-lesson';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const base = getBaseUrl(locale);
  return {
    title: '日课归档 | 每日古典智慧 — 51yijing.com',
    description: '浏览所有已发布的每日古典智慧内容，包括易经卦序和道家清静两大流派',
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

  const school: School = (query.school === 'daoist' ? 'daoist' : 'yijing');
  const page = Math.max(1, parseInt(query.page ?? '1', 10) || 1);

  const data = await getDailyLessonArchive(school, locale, page);

  return (
    <PageLayout maxWidth="max-w-[800px]">
      <Breadcrumb items={[
        { label: '首页', href: '/' },
        { label: '每日古典智慧', href: '/daily' },
        { label: '日课归档' },
      ]} />
      <ArchiveClient
        school={school}
        lessons={data.lessons}
        total={data.total}
        totalPages={data.totalPages}
        currentPage={page}
      />
    </PageLayout>
  );
}
