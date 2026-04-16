'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { m, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface FaqCtaSectionProps {
  locale: string;
}

const FAQ_ITEMS = [
  { questionKey: 'faq1Q', answerKey: 'faq1A' },
  { questionKey: 'faq2Q', answerKey: 'faq2A' },
  { questionKey: 'faq3Q', answerKey: 'faq3A' },
  { questionKey: 'faq4Q', answerKey: 'faq4A' },
  { questionKey: 'faq5Q', answerKey: 'faq5A' },
  { questionKey: 'faq6Q', answerKey: 'faq6A' },
];

function FaqAccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--theme-border)' }}>
      <button
        className="w-full flex justify-between items-center px-4 py-3 text-left text-sm font-medium"
        style={{ color: 'var(--theme-text-primary)' }}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {question}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 flex-shrink-0 ml-2 ${open ? 'rotate-180' : ''}`}
          style={{ color: 'var(--theme-text-muted)' }}
        />
      </button>
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 pb-3 text-sm leading-relaxed"
            style={{ color: 'var(--theme-text-secondary)' }}
          >
            {answer}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqCtaSection({ locale }: FaqCtaSectionProps) {
  const t = useTranslations('Home');
  return (
    <>
      <section className="mt-20" aria-labelledby="faq-heading">
        <h2
          id="faq-heading"
          className="text-xl text-center mb-8"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}
        >
          {t('faqSectionTitle')}
        </h2>
        <div className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <FaqAccordionItem key={i} question={t(item.questionKey)} answer={t(item.answerKey)} />
          ))}
        </div>
      </section>

      <div
        className="mt-16 text-center py-12 px-6 rounded-2xl"
        style={{ backgroundColor: 'var(--theme-card-bg)', border: '1px solid var(--theme-border)' }}
      >
        <h2 id="final-cta-heading" className="text-2xl font-bold mb-2" style={{ color: 'var(--theme-text-primary)' }}>
          {t('finalCtaTitle')}
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--theme-text-secondary)' }}>
          {t('finalCtaDesc')}
        </p>
        <Link
          href="/divine"
          className="inline-block px-8 py-3 rounded-full font-semibold text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--color-gold)', color: '#1a1a1a' }}
        >
          {t('finalCtaButton')}
        </Link>
      </div>
    </>
  );
}
