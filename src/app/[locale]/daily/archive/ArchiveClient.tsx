'use client';

import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import type { School } from '@/lib/daily-lesson';
import SchoolTabs from '@/components/daily/SchoolTabs';
import Card from '@/components/ui/Card';
import BrushDivider from '@/components/ui/BrushDivider';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ArchiveLesson {
  slug: string;
  title: string;
  subtitle: string;
  dayIndex: number;
}

interface Props {
  school: School;
  lessons: ArchiveLesson[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export default function ArchiveClient({ school, lessons, total, totalPages, currentPage }: Props) {
  const t = useTranslations('Daily');
  const router = useRouter();

  function handleSchoolChange(s: School) {
    router.push(`/daily/archive?school=${s}&page=1`);
  }

  const prefix = school === 'yijing' ? '/daily/yijing' : '/daily/daoist';

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}>
          {t('archiveHeading')}
        </h1>
        <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>
          {t('archiveTotal', { total })}
        </p>
      </div>

      <SchoolTabs active={school} onChange={handleSchoolChange} />

      {lessons.length === 0 ? (
        <Card variant="default" padding="lg">
          <p className="text-center text-sm" style={{ color: 'var(--theme-text-muted)' }}>
            {t('archiveEmpty')}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {lessons.map((l) => (
            <Link key={l.slug} href={`${prefix}/${l.slug}`}>
              <Card variant="default" padding="md" className="transition-colors hover:border-[var(--color-gold)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base" style={{ fontFamily: 'var(--font-display)', color: 'var(--theme-text-primary)' }}>
                      {t('archiveItem', { dayIndex: l.dayIndex, title: l.title })}
                    </p>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--theme-text-secondary)' }}>
                      「{l.subtitle}」
                    </p>
                  </div>
                  <ChevronRight size={16} style={{ color: 'var(--theme-text-muted)' }} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <>
          <BrushDivider />
          <nav aria-label={t('paginationLabel')} className="flex items-center justify-center gap-4">
            {currentPage > 1 ? (
              <Link
                href={`/daily/archive?school=${school}&page=${currentPage - 1}`}
                className="flex items-center gap-1 text-sm transition-colors hover:text-[var(--color-gold)]"
                style={{ color: 'var(--theme-text-secondary)' }}
              >
                <ChevronLeft size={16} /> {t('paginationPrev')}
              </Link>
            ) : (
              <span className="text-sm" style={{ color: 'var(--theme-text-muted)', opacity: 0.4 }}>
                <ChevronLeft size={16} className="inline" /> {t('paginationPrev')}
              </span>
            )}

            <span className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>
              {currentPage} / {totalPages}
            </span>

            {currentPage < totalPages ? (
              <Link
                href={`/daily/archive?school=${school}&page=${currentPage + 1}`}
                className="flex items-center gap-1 text-sm transition-colors hover:text-[var(--color-gold)]"
                style={{ color: 'var(--theme-text-secondary)' }}
              >
                {t('paginationNext')} <ChevronRight size={16} />
              </Link>
            ) : (
              <span className="text-sm" style={{ color: 'var(--theme-text-muted)', opacity: 0.4 }}>
                {t('paginationNext')} <ChevronRight size={16} className="inline" />
              </span>
            )}
          </nav>
        </>
      )}
    </div>
  );
}
