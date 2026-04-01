import {notFound} from 'next/navigation';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {ToastProvider, Toast, MotionProvider} from '@/components/ui';
import type {Metadata} from 'next';
import {SITE_URL} from '@/lib/seo';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const isZh = locale === 'zh';
  const baseUrl = isZh ? SITE_URL : `${SITE_URL}/en`;

  return {
    alternates: {
      canonical: baseUrl,
      languages: {
        'zh': SITE_URL,
        'en': `${SITE_URL}/en`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <NextIntlClientProvider>
      <MotionProvider>
        <ToastProvider>
          {children}
          <Toast />
        </ToastProvider>
      </MotionProvider>
    </NextIntlClientProvider>
  );
}
