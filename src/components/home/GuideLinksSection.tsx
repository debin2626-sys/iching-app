import Link from 'next/link';
import { getLocalePrefix, getLocalizedText } from '@/lib/seo';

interface GuideLink {
  path: string;
  title: { zh: string; en: string; zhTW: string };
  desc: { zh: string; en: string; zhTW: string };
}

const GUIDE_LINKS: GuideLink[] = [
  {
    path: '/guide/what-is-iching',
    title: { zh: '什么是易经', en: 'What is the I Ching?', zhTW: '什麼是易經' },
    desc: {
      zh: '了解易经的起源、哲学思想与现代意义',
      en: 'Explore the origins, philosophy, and modern relevance of the I Ching',
      zhTW: '了解易經的起源、哲學思想與現代意義',
    },
  },
  {
    path: '/guide/how-to-divine',
    title: { zh: '如何占卜', en: 'How to Divine', zhTW: '如何占卜' },
    desc: {
      zh: '三枚铜钱起卦法详解，从提问到解读全流程',
      en: 'Step-by-step guide to the three-coin method, from question to interpretation',
      zhTW: '三枚銅錢起卦法詳解，從提問到解讀全流程',
    },
  },
  {
    path: '/guide/changing-lines',
    title: { zh: '变爻详解', en: 'Understanding Changing Lines', zhTW: '變爻詳解' },
    desc: {
      zh: '变爻的含义与作用，掌握卦象变化的核心',
      en: 'The meaning and role of changing lines — the dynamic heart of a reading',
      zhTW: '變爻的含義與作用，掌握卦象變化的核心',
    },
  },
];

export function GuideLinksSection({ locale }: { locale: string }) {
  const prefix = getLocalePrefix(locale);
  const title = getLocalizedText(locale, '入门指南', "Beginner's Guide", '入門指南');

  return (
    <section className="mt-16" aria-labelledby="guide-links-heading">
      <h2
        id="guide-links-heading"
        className="text-xl text-center mb-8"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}
      >
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {GUIDE_LINKS.map((item) => (
          <Link
            key={item.path}
            href={`${prefix}${item.path}`}
            className="block p-5 rounded-xl border transition-colors hover:border-[var(--color-gold)]"
            style={{
              backgroundColor: 'var(--theme-card-bg)',
              borderColor: 'var(--theme-border)',
              textDecoration: 'none',
            }}
          >
            <h3
              className="font-semibold mb-2"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}
            >
              {getLocalizedText(locale, item.title.zh, item.title.en, item.title.zhTW)}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>
              {getLocalizedText(locale, item.desc.zh, item.desc.en, item.desc.zhTW)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
