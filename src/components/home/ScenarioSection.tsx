'use client';

import { useTranslations } from 'next-intl';
import { m } from 'framer-motion';
import Link from 'next/link';
import { Briefcase, Heart, DollarSign, GraduationCap, Leaf, type LucideIcon } from 'lucide-react';
import { trackScenarioSelect } from '@/lib/analytics';

interface ScenarioSectionProps {
  locale: string;
}

interface ScenarioCard {
  id: 'career' | 'love' | 'wealth' | 'study' | 'health';
  icon: LucideIcon;
  labelKey: string;
  descKey: string;
  href: string;
}

const SCENARIOS: ScenarioCard[] = [
  { id: 'career',  icon: Briefcase,     labelKey: 'scenarioCareer',  descKey: 'scenarioCareerDesc',  href: '/divine?scenario=career' },
  { id: 'love',    icon: Heart,         labelKey: 'scenarioLove',    descKey: 'scenarioLoveDesc',    href: '/divine?scenario=love' },
  { id: 'wealth',  icon: DollarSign,    labelKey: 'scenarioWealth',  descKey: 'scenarioWealthDesc',  href: '/divine?scenario=wealth' },
  { id: 'study',   icon: GraduationCap, labelKey: 'scenarioStudy',   descKey: 'scenarioStudyDesc',   href: '/divine?scenario=study' },
  { id: 'health',  icon: Leaf,          labelKey: 'scenarioHealth',  descKey: 'scenarioHealthDesc',  href: '/divine?scenario=health' },
];

export function ScenarioSection({ locale }: ScenarioSectionProps) {
  const t = useTranslations('Home');

  return (
    <section className="mt-16" aria-labelledby="scenario-heading">
      <h2
        id="scenario-heading"
        className="text-xl text-center mb-8"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}
      >
        {t('scenarioSectionTitle')}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {SCENARIOS.map((s, index) => (
          <m.div
            key={s.id}
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.08 }}
            className={index === 4 ? 'col-span-2 md:col-span-1 flex justify-center h-full' : 'h-full'}
          >
            <Link
              href={s.href}
              aria-label={`${t(s.labelKey)} - ${t(s.descKey)}`}
              className={index === 4 ? 'w-[calc(50%-6px)] md:w-full h-full' : 'block h-full'}
              onClick={() => trackScenarioSelect(s.id)}
            >
              <div
                className="h-full flex flex-col items-center text-center p-4 rounded-xl border cursor-pointer
                           hover:border-[var(--color-gold)] transition-colors duration-200
                           active:scale-95"
                style={{
                  backgroundColor: 'var(--theme-card-bg)',
                  borderColor: 'var(--theme-border)',
                }}
              >
                <s.icon size={28} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} />
                <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--theme-text-primary)' }}>
                  {t(s.labelKey)}
                </p>
                <p className="mt-1 text-xs" style={{ color: 'var(--theme-text-muted)' }}>
                  {t(s.descKey)}
                </p>
              </div>
            </Link>
          </m.div>
        ))}
      </div>
    </section>
  );
}
