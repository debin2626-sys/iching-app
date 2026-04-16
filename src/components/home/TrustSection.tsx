'use client';

import { useTranslations } from 'next-intl';
import { m } from 'framer-motion';
import { History, Shield, Sparkles, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface TrustSectionProps {
  locale: string;
}

interface TrustItem {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
}

const TRUST_ITEMS: TrustItem[] = [
  { icon: History,  titleKey: 'trust1Title', descKey: 'trust1Desc' },
  { icon: Shield,   titleKey: 'trust2Title', descKey: 'trust2Desc' },
  { icon: Sparkles, titleKey: 'trust3Title', descKey: 'trust3Desc' },
];

const STEPS = [
  { key: 'trustStep1' },
  { key: 'trustStep2' },
  { key: 'trustStep3' },
  { key: 'trustStep4' },
];

export function TrustSection({ locale }: TrustSectionProps) {
  const t = useTranslations('Home');

  return (
    <section className="mt-20" aria-labelledby="trust-heading">
      <h2
        id="trust-heading"
        className="text-xl text-center mb-8"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}
      >
        {t('trustSectionTitle')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TRUST_ITEMS.map((item, i) => (
          <m.div
            key={i}
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: i * 0.1 }}
            className="text-center p-6 rounded-xl border"
            style={{ backgroundColor: 'var(--theme-card-bg)', borderColor: 'var(--theme-border)' }}
          >
            <item.icon size={32} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} className="mx-auto mb-3" />
            <h3 className="font-bold mb-2" style={{ color: 'var(--theme-text-primary)' }}>
              {t(item.titleKey)}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>
              {t(item.descKey)}
            </p>
          </m.div>
        ))}
      </div>

      <ol
        role="list"
        aria-label={t('trustProcessTitle')}
        className="mt-10 flex items-center justify-center gap-2 flex-wrap list-none p-0"
      >
        {STEPS.map((step, i) => (
          <m.li
            key={i}
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            <div className="flex flex-col items-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: 'var(--color-gold)', color: '#1a1a1a' }}
              >
                {i + 1}
              </div>
              <span className="mt-1 text-xs" style={{ color: 'var(--theme-text-secondary)' }}>
                {t(step.key)}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <ChevronRight size={16} style={{ color: 'var(--theme-text-muted)' }} className="mb-4" />
            )}
          </m.li>
        ))}
      </ol>
    </section>
  );
}
