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
import { setRequestLocale, getTranslations } from 'next-intl/server';
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
  const t = await getTranslations({ locale, namespace: 'Daily' });
  const localePrefix = getLocalePrefix(locale);
  const canonical = `${SITE_URL}${localePrefix}/daily/daoist/${slug}`;
  const title = `${lesson.title} · ${lesson.subtitle} | ${t('daoistMetaSuffix')}`;
  const description = lesson.wisdom.slice(0, 160);
  const ogImageUrl = `${SITE_URL}/api/daily-share-image?${new URLSearchParams({
    quote: lesson.classicText.slice(0, 100),
    source: lesson.sourceRef || lesson.title,
    book: '道德经',
    advice: lesson.action || '',
    date: lesson.slug,
  }).toString()}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: getAlternateLanguages(`/daily/daoist/${slug}`),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      images: [{ url: ogImageUrl, width: 1242, height: 1656 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
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
  const t = await getTranslations({ locale, namespace: 'Daily' });

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
    { label: t('breadcrumbHome'), href: '/' },
    { label: t('breadcrumbDaily'), href: '/daily' },
    { label: t('breadcrumbDaoist'), href: '/daily/daoist' },
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
      <EmailSubscribeForm school="daoist" />
    </PageLayout>
  );
}
