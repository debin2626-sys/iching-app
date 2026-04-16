import { useTranslations } from 'next-intl';
import StartDivinationButton from './StartDivinationButton';

interface HeroSectionProps {
  totalCount?: number;
}

export function HeroSection({ totalCount = 0 }: HeroSectionProps) {
  const t = useTranslations('Home');

  const trustLine =
    totalCount >= 1000
      ? t('trustDynamic', { count: totalCount.toLocaleString() })
      : t('trustStatic');

  return (
    <section
      className="relative flex flex-col items-center text-center pt-8 pb-12"
      aria-labelledby="hero-heading"
    >
      <div className="relative flex flex-col items-center w-full">
        <h1
          id="hero-heading"
          className="hero-fade-up text-3xl md:text-5xl font-bold leading-tight tracking-wide max-w-[36rem] w-full"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--theme-text-primary)', animationDelay: '0ms' }}
        >
          {t('heroHeadline')}
        </h1>

        <p
          className="hero-fade-up relative mt-4 text-base md:text-lg max-w-[28rem]"
          style={{ color: 'var(--theme-text-secondary)', animationDelay: '120ms' }}
        >
          {t('heroSub')}
        </p>

        <div className="hero-fade-up relative mt-6" style={{ animationDelay: '240ms' }}>
          <StartDivinationButton />
        </div>

        <p
          className="hero-fade-up relative mt-4 text-sm"
          style={{ color: 'var(--theme-text-muted)', animationDelay: '360ms' }}
        >
          {trustLine}
        </p>
      </div>
    </section>
  );
}
