'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import StartDivinationButton from './StartDivinationButton';

interface HeroSectionProps {
  locale: string;
  totalCount?: number;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function HeroSection({ locale, totalCount = 0 }: HeroSectionProps) {
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
      <motion.div
        className="relative flex flex-col items-center w-full"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.h1
          id="hero-heading"
          variants={item}
          className="text-3xl md:text-5xl font-bold leading-tight tracking-wide max-w-[36rem] w-full"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--theme-text-primary)' }}
        >
          {t('heroHeadline')}
        </motion.h1>

        <motion.p
          variants={item}
          className="relative mt-4 text-base md:text-lg max-w-[28rem]"
          style={{ color: 'var(--theme-text-secondary)' }}
        >
          {t('heroSub')}
        </motion.p>

        <motion.div variants={item} className="relative mt-6">
          <StartDivinationButton />
        </motion.div>

        <motion.p
          variants={item}
          className="relative mt-4 text-sm"
          style={{ color: 'var(--theme-text-muted)' }}
        >
          {trustLine}
        </motion.p>
      </motion.div>
    </section>
  );
}
