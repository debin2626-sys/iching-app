import { prisma } from "@/lib/prisma";
import type { School } from "@/lib/daily-lesson";

/**
 * 根据 school + slug 获取日课内容 + 前后导航 slug
 */
export async function getDailyLessonBySlug(school: School, slug: string, locale = "zh") {
  const lesson = await prisma.dailyLesson.findUnique({
    where: { school_slug_locale: { school, slug, locale } },
    include: { hexagram: true },
  });

  if (!lesson) return null;

  // 获取前后天的 slug 用于导航
  const [prev, next] = await Promise.all([
    prisma.dailyLesson.findUnique({
      where: { school_dayIndex_locale: { school, dayIndex: lesson.dayIndex - 1, locale } },
      select: { slug: true },
    }),
    prisma.dailyLesson.findUnique({
      where: { school_dayIndex_locale: { school, dayIndex: lesson.dayIndex + 1, locale } },
      select: { slug: true },
    }),
  ]);

  // 已发布总数
  const totalLessons = await prisma.dailyLesson.count({ where: { school, locale } });

  return {
    lesson,
    prevSlug: prev?.slug ?? null,
    nextSlug: next?.slug ?? null,
    totalLessons,
  };
}

/**
 * 获取所有已发布的 slug（用于 generateStaticParams）
 */
export async function getAllDailyLessonSlugs(school: School) {
  try {
    const lessons = await prisma.dailyLesson.findMany({
      where: { school },
      select: { slug: true },
      orderBy: { dayIndex: "asc" },
    });
    return lessons.map((l) => l.slug);
  } catch {
    // CI has no database — return empty so build succeeds (pages render via SSR)
    return [];
  }
}

/**
 * 根据 school + dayIndex 获取日课（用于 /daily 主页当天内容）
 */
export async function getDailyLessonByDayIndex(school: School, dayIndex: number, locale = "zh") {
  return prisma.dailyLesson.findUnique({
    where: { school_dayIndex_locale: { school, dayIndex, locale } },
    include: { hexagram: true },
  });
}

/**
 * 获取归档列表（分页）
 */
export async function getDailyLessonArchive(school: School, locale = 'zh', page = 1, pageSize = 20) {
  const [lessons, total] = await Promise.all([
    prisma.dailyLesson.findMany({
      where: { school, locale },
      select: { slug: true, title: true, subtitle: true, dayIndex: true },
      orderBy: { dayIndex: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.dailyLesson.count({ where: { school, locale } }),
  ]);
  return { lessons, total, totalPages: Math.ceil(total / pageSize) };
}
