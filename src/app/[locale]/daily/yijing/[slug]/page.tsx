import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
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
  const t = await getTranslations({ locale, namespace: 'Daily' });
  const prefix = getLocalePrefix(locale);
  const canonical = `${SITE_URL}${prefix}/daily/yijing/${slug}`;
  const title = `${lesson.title} · ${lesson.subtitle} | ${t('yijingMetaSuffix')}`;
  const description = lesson.wisdom.slice(0, 160);
  const ogImageUrl = `${SITE_URL}/api/daily-share-image?${new URLSearchParams({
    quote: lesson.classicText.slice(0, 100),
    source: lesson.sourceRef || lesson.title,
    book: '易经',
    advice: lesson.action || '',
    date: lesson.slug,
  }).toString()}`;

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

export default async function YijingDailyLessonPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Daily' });

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
          { label: t('breadcrumbHome'), href: '/' },
          { label: t('breadcrumbDaily'), href: '/daily' },
          { label: t('breadcrumbYijing'), href: '/daily/yijing' },
          { label: lesson.title },
        ]}
      />

      <DayNavigation {...navProps} />

      <DailyLessonCard lesson={lessonData} school="yijing" dayIndex={lesson.dayIndex} />

      <BrushDivider />

      <DayNavigation {...navProps} />

      <BrushDivider />

      <EmailSubscribeForm school="yijing" />
    </PageLayout>
  );
}
