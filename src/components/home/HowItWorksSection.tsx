'use client';

import { useTranslations } from 'next-intl';
import { m } from 'framer-motion';

const STEPS = [
  { num: '一', key: 'step1' },
  { num: '二', key: 'step2' },
  { num: '三', key: 'step3' },
];

export function HowItWorksSection({ locale }: { locale: string }) {
  const t = useTranslations('Home');

  return (
    <section className="mt-16" aria-labelledby="how-it-works-heading">
      <h2
        id="how-it-works-heading"
        className="text-xl text-center mb-10"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}
      >
        {t('howTitle')}
      </h2>

      <div className="relative flex flex-col md:flex-row gap-6 md:gap-4">
        {/* 连接线 (仅桌面) */}
        <div
          className="hidden md:block absolute top-8 left-[calc(16.67%+16px)] right-[calc(16.67%+16px)] h-px"
          style={{ backgroundColor: 'var(--theme-border)' }}
          aria-hidden="true"
        />

        {STEPS.map((s, i) => (
          <m.div
            key={s.key}
            className="flex-1 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
          >
            {/* 步骤圆圈 */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 relative z-10"
              style={{
                backgroundColor: 'var(--theme-card-bg)',
                border: '2px solid var(--color-gold)',
                color: 'var(--color-gold)',
                fontFamily: 'var(--font-display)',
              }}
            >
              {s.num}
            </div>

            <h3
              className="text-base font-semibold mb-2"
              style={{ color: 'var(--theme-text-primary)' }}
            >
              {t(`${s.key}Title`)}
            </h3>
            <p
              className="text-sm leading-relaxed max-w-[200px]"
              style={{ color: 'var(--theme-text-secondary)' }}
            >
              {t(`${s.key}Desc`)}
            </p>
          </m.div>
        ))}
      </div>
    </section>
  );
}
