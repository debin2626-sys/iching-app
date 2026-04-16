import Link from 'next/link';
import { getLocalePrefix, getLocalizedText } from '@/lib/seo';

interface Hexagram {
  number: number;
  nameZh: string;
  nameEn: string;
  symbol: string;
  descZh: string;
}

const POPULAR_HEXAGRAMS: Hexagram[] = [
  { number: 1,  nameZh: '乾',  nameEn: 'Qian / The Creative',    symbol: '☰☰', descZh: '刚健进取' },
  { number: 2,  nameZh: '坤',  nameEn: 'Kun / The Receptive',    symbol: '☷☷', descZh: '厚德载物' },
  { number: 11, nameZh: '泰',  nameEn: 'Tai / Peace',            symbol: '☷☰', descZh: '天地交泰' },
  { number: 15, nameZh: '谦',  nameEn: 'Qian / Modesty',         symbol: '☷☶', descZh: '谦虚受益' },
  { number: 30, nameZh: '离',  nameEn: 'Li / The Clinging',      symbol: '☲☲', descZh: '光明磊落' },
  { number: 63, nameZh: '既济', nameEn: 'Ji Ji / After Completion', symbol: '☵☲', descZh: '功成圆满' },
];

export function PopularHexagramsSection({ locale }: { locale: string }) {
  const prefix = getLocalePrefix(locale);
  const title = getLocalizedText(locale, '热门卦象', 'Popular Hexagrams', '熱門卦象');

  return (
    <section className="mt-16" aria-labelledby="popular-hexagrams-heading">
      <h2
        id="popular-hexagrams-heading"
        className="text-xl text-center mb-8"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}
      >
        {title}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {POPULAR_HEXAGRAMS.map((hex) => (
          <Link
            key={hex.number}
            href={`${prefix}/hexagrams/${hex.number}`}
            prefetch={false}
            className="flex items-center gap-3 p-4 rounded-xl border transition-colors hover:border-[var(--color-gold)]"
            style={{
              backgroundColor: 'var(--theme-card-bg)',
              borderColor: 'var(--theme-border)',
              textDecoration: 'none',
            }}
          >
            <span
              className="text-3xl leading-none shrink-0"
              style={{ color: 'var(--color-gold)' }}
              aria-hidden="true"
            >
              {hex.symbol}
            </span>
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span
                  className="text-xs"
                  style={{ color: 'var(--theme-text-muted)' }}
                >
                  {hex.number}
                </span>
                <span
                  className="font-semibold"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--theme-text)' }}
                >
                  {locale === 'en' ? hex.nameEn.split(' /')[0] : hex.nameZh}
                </span>
              </div>
              <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--theme-text-secondary)' }}>
                {locale === 'en' ? hex.nameEn : hex.descZh}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
