import {notFound} from 'next/navigation';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {ToastProvider, Toast, MotionProvider} from '@/components/ui';
import Footer from '@/components/ui/Footer';
import type {Metadata} from 'next';
import {SITE_URL, getAlternateLanguages} from '@/lib/seo';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;

  return {
    alternates: {
      canonical: locale === 'zh' ? SITE_URL : `${SITE_URL}/${locale}`,
      languages: getAlternateLanguages(),
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
          <div className="flex flex-col min-h-screen">
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </div>
          <Toast />
        </ToastProvider>
      </MotionProvider>
    </NextIntlClientProvider>
  );
}
