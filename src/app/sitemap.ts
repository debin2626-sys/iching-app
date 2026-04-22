import type { MetadataRoute } from 'next';
import { HEXAGRAM_DATA } from '@/data/hexagrams';

const SITE_URL = 'https://51yijing.com';
const locales = ['zh', 'zh-TW', 'en'];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const now = '2025-04-15';

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
    { path: '/history', changeFrequency: 'weekly' as const, priority: 0.5 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.4 },
    { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.3 },
    { path: '/privacy', changeFrequency: 'monthly' as const, priority: 0.2 },
    { path: '/terms', changeFrequency: 'monthly' as const, priority: 0.2 },
  ];

  // Helper: build hreflang alternates for a given path
  const buildAlternates = (path: string) => {
    const languages: Record<string, string> = {};
    for (const loc of locales) {
      const prefix = loc === 'zh' ? '' : `/${loc}`;
      languages[loc] = `${SITE_URL}${prefix}${path}`;
    }
    // x-default points to the zh (default) URL
    languages['x-default'] = `${SITE_URL}${path}`;
    return { languages };
  };

  for (const page of staticPages) {
    for (const locale of locales) {
      const prefix = locale === 'zh' ? '' : `/${locale}`;
      entries.push({
        url: `${SITE_URL}${prefix}${page.path}`,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: buildAlternates(page.path),
      });
    }
  }

  // 64 hexagram detail pages × 3 locales = 192 entries
  for (const hex of HEXAGRAM_DATA) {
    for (const locale of locales) {
      const prefix = locale === 'zh' ? '' : `/${locale}`;
      entries.push({
        url: `${SITE_URL}${prefix}/hexagrams/${hex.number}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: buildAlternates(`/hexagrams/${hex.number}`),
      });
    }
  }

  return entries;
}
