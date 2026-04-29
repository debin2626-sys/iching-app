import type { MetadataRoute } from 'next';
import { HEXAGRAM_DATA } from '@/data/hexagrams';
import { routing } from '@/i18n/routing';
import { prisma } from '@/lib/prisma';

export const revalidate = 3600;

const SITE_URL = 'https://51yijing.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = routing.locales;
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date().toISOString().slice(0, 10);

  // Static pages — all routes under src/app/[locale]/
  const staticPages = [
    { path: '', changeFrequency: 'daily' as const, priority: 1.0 },
    { path: '/divine', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/hexagrams', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/divination', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/scenarios', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/guide', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/guide/what-is-iching', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/guide/how-to-divine', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/guide/changing-lines', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/features', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/daily', changeFrequency: 'daily' as const, priority: 0.8 },
    { path: '/daily/archive', changeFrequency: 'daily' as const, priority: 0.7 },
    { path: '/history', changeFrequency: 'weekly' as const, priority: 0.5 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.4 },
    { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.3 },
    { path: '/privacy', changeFrequency: 'monthly' as const, priority: 0.2 },
    { path: '/terms', changeFrequency: 'monthly' as const, priority: 0.2 },
  ];

  // Helper: build hreflang alternates for a given path
  const buildAlternates = (availableLocales: readonly string[], path: string) => {
    const languages: Record<string, string> = {};
    for (const loc of availableLocales) {
      languages[loc] = `${SITE_URL}/${loc}${path}`;
    }
    // x-default points to the zh (default) URL
    languages['x-default'] = `${SITE_URL}/zh${path}`;
    return { languages };
  };

  // Static pages × locales
  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${page.path}`,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: buildAlternates(locales, page.path),
      });
    }
  }

  // 64 hexagram detail pages × locales
  for (const hex of HEXAGRAM_DATA) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/hexagrams/${hex.number}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: buildAlternates(locales, `/hexagrams/${hex.number}`),
      });
    }
  }

  // DailyLesson detail pages — query DB for all published lessons
  const lessons = await prisma.dailyLesson.findMany({
    select: { school: true, slug: true, locale: true, updatedAt: true },
    orderBy: [{ school: 'asc' }, { slug: 'asc' }, { locale: 'asc' }],
  });

  // Group by school+slug to build per-slug locale sets
  const slugsByKey = new Map<string, { locales: Set<string>; maxUpdatedAt: Date }>();
  for (const l of lessons) {
    const key = `${l.school}/${l.slug}`;
    const existing = slugsByKey.get(key);
    if (existing) {
      existing.locales.add(l.locale);
      if (l.updatedAt > existing.maxUpdatedAt) existing.maxUpdatedAt = l.updatedAt;
    } else {
      slugsByKey.set(key, { locales: new Set([l.locale]), maxUpdatedAt: l.updatedAt });
    }
  }

  for (const [key, info] of slugsByKey) {
    const [school, slug] = key.split('/');
    const availableLocales = [...info.locales].sort();
    for (const locale of availableLocales) {
      entries.push({
        url: `${SITE_URL}/${locale}/daily/${school}/${slug}`,
        lastModified: info.maxUpdatedAt.toISOString().slice(0, 10),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: buildAlternates(availableLocales, `/daily/${school}/${slug}`),
      });
    }
  }

  return entries;
}
