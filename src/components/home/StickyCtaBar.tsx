'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface StickyCtaBarProps {
  locale: string;
}

export function StickyCtaBar({ locale }: StickyCtaBarProps) {
  const t = useTranslations('Home');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('hero-heading');
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-4 py-3 flex items-center justify-between border-t"
      style={{ backgroundColor: 'var(--theme-bg)', borderColor: 'var(--theme-border)' }}
      aria-label="快速开始占卜"
    >
      <span className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>
        {t('trustStatic')}
      </span>
      <Link
        href="/divine"
        className="px-4 py-2 rounded-full font-semibold text-xs transition-opacity hover:opacity-90"
        style={{ backgroundColor: 'var(--color-gold)', color: '#1a1a1a' }}
      >
        {t('heroCta')}
      </Link>
    </div>
  );
}
