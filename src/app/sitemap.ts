import type { MetadataRoute } from 'next';
import { HEXAGRAM_DATA } from '@/data/hexagrams';

const SITE_URL = 'https://51yijing.com';
const locales = ['zh', 'zh-TW', 'en'];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages (exclude auth/login/signup pages to save crawl budget)
  const staticPages = ['', '/hexagrams', '/divination', '/history'];

  for (const page of staticPages) {
    for (const locale of locales) {
      const prefix = locale === 'zh' ? '' : `/${locale}`;
      entries.push({
        url: `${SITE_URL}${prefix}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : page === '/hexagrams' ? 0.9 : 0.7,
      });
    }
  }

  // 64 hexagram pages
  for (const hex of HEXAGRAM_DATA) {
    for (const locale of locales) {
      const prefix = locale === 'zh' ? '' : `/${locale}`;
      entries.push({
        url: `${SITE_URL}${prefix}/hexagrams/${hex.number}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  }

  return entries;
}
