import { getDailyLessonBySlug, getAllDailyLessonSlugs } from '@/lib/daily-lesson-data';
import { SITE_URL, getLocalePrefix, getAlternateLanguages } from '@/lib/seo';
import { PageLayout } from '@/components/ui/PageLayout';
import Breadcrumb from '@/components/ui/Breadcrumb';
import DailyLessonCard from '@/components/daily/DailyLessonCard';
import DayNavigation from '@/components/daily/DayNavigation';
import BrushDivider from '@/components/ui/BrushDivider';
import EmailSubscribeForm from '@/components/daily/EmailSubscribeForm';
import type { School } from '@/lib/daily-lesson';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

const SCHOOL: School = 'daoist';

export async function generateStaticParams() {
  const slugs = await getAllDailyLessonSlugs(SCHOOL);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const data = await getDailyLessonBySlug(SCHOOL, slug, locale);
  if (!data) return {};

  const { lesson } = data;
  const localePrefix = getLocalePrefix(locale);
  const canonical = `${SITE_URL}${localePrefix}/daily/daoist/${slug}`;
  const title = `${lesson.title} · ${lesson.subtitle} | 每日古典智慧 — 51yijing.com`;

  return {
    title,
    alternates: {
      canonical,
      languages: getAlternateLanguages(`/daily/daoist/${slug}`),
    },
    openGraph: {
      title,
      url: canonical,
      type: 'article',
    },
  };
}

export default async function DaoistLessonPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const data = await getDailyLessonBySlug(SCHOOL, slug, locale);
  if (!data) notFound();

  const { lesson, prevSlug, nextSlug, totalLessons } = data;

  const lessonData = {
    slug: lesson.slug,
    title: lesson.title,
    subtitle: lesson.subtitle,
    classicText: lesson.classicText,
    wisdom: lesson.wisdom,
    action: lesson.action,
    caution: lesson.caution,
    meditation: lesson.meditation,
    sourceRef: lesson.sourceRef,
    hexagram: null,
  };

  const breadcrumbItems = [
    { label: '首页', href: '/' },
    { label: '每日古典智慧', href: '/daily' },
    { label: '道家清静', href: '/daily/daoist' },
    { label: lesson.title },
  ];

  return (
    <PageLayout maxWidth="max-w-[800px]">
      <Breadcrumb items={breadcrumbItems} />
      <DayNavigation
        school={SCHOOL}
        currentDayIndex={lesson.dayIndex}
        prevSlug={prevSlug}
        nextSlug={nextSlug}
        totalLessons={totalLessons}
      />
      <DailyLessonCard lesson={lessonData} school={SCHOOL} dayIndex={lesson.dayIndex} />
      <BrushDivider />
      <DayNavigation
        school={SCHOOL}
        currentDayIndex={lesson.dayIndex}
        prevSlug={prevSlug}
        nextSlug={nextSlug}
        totalLessons={totalLessons}
      />
      <BrushDivider />
      <EmailSubscribeForm />
    </PageLayout>
  );
}
