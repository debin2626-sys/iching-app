import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getDailyLessonBySlug, getAllDailyLessonSlugs } from '@/lib/daily-lesson-data';
import { SITE_URL, getLocalePrefix, getAlternateLanguages } from '@/lib/seo';
import { PageLayout } from '@/components/ui/PageLayout';
import Breadcrumb from '@/components/ui/Breadcrumb';
import DailyLessonCard from '@/components/daily/DailyLessonCard';
import DayNavigation from '@/components/daily/DayNavigation';
import BrushDivider from '@/components/ui/BrushDivider';
import EmailSubscribeForm from '@/components/daily/EmailSubscribeForm';

export async function generateStaticParams() {
  const slugs = await getAllDailyLessonSlugs('yijing');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const result = await getDailyLessonBySlug('yijing', slug, locale);

  if (!result) return { title: 'Not Found' };

  const { lesson } = result;
  const prefix = getLocalePrefix(locale);
  const canonical = `${SITE_URL}${prefix}/daily/yijing/${slug}`;
  const title = `${lesson.title} · ${lesson.subtitle} | 每日古典智慧 — 51yijing.com`;
  const description = lesson.wisdom.slice(0, 160);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: getAlternateLanguages(`/daily/yijing/${slug}`),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
  };
}

export default async function YijingDailyLessonPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const result = await getDailyLessonBySlug('yijing', slug, locale);
  if (!result) notFound();

  const { lesson, prevSlug, nextSlug, totalLessons } = result;

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
    hexagram: lesson.hexagram
      ? { number: lesson.hexagram.number, nameZh: lesson.hexagram.nameZh, nature: lesson.hexagram.nature }
      : null,
  };

  const navProps = {
    school: 'yijing' as const,
    currentDayIndex: lesson.dayIndex,
    prevSlug,
    nextSlug,
    totalLessons,
  };

  return (
    <PageLayout maxWidth="max-w-[800px]">
      <Breadcrumb
        items={[
          { label: '首页', href: '/' },
          { label: '每日古典智慧', href: '/daily' },
          { label: '易经卦序', href: '/daily/yijing' },
          { label: lesson.title },
        ]}
      />

      <DayNavigation {...navProps} />

      <DailyLessonCard lesson={lessonData} school="yijing" dayIndex={lesson.dayIndex} />

      <BrushDivider />

      <DayNavigation {...navProps} />

      <BrushDivider />

      <EmailSubscribeForm />
    </PageLayout>
  );
}
