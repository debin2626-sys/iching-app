import type { Metadata } from "next";
import { Noto_Serif_SC } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import { WebVitalsReporter } from "@/components/WebVitalsReporter";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { getLocale } from "next-intl/server";
import "./globals.css";

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-noto-serif-sc",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

const SITE_URL = 'https://51yijing.com';

export const metadata: Metadata = {
  title: {
    default: '易经在线占卜 | AI智能解读 - 51yijing.com',
    template: '%s',
  },
  description: '在线易经占卜，AI智能解读卦象。三币古法摇卦，结合八字命理，给出专业解读建议。',
  keywords: ['易经', '占卜', 'AI解读', '周易', '六十四卦', '摇卦', '八字', 'I Ching', 'divination'],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
    languages: {
      'zh': SITE_URL,
      'zh-TW': `${SITE_URL}/zh-TW`,
      'en': `${SITE_URL}/en`,
      'x-default': SITE_URL,
    },
  },
  openGraph: {
    type: 'website',
    siteName: '51yijing.com',
    title: '易经在线占卜 | AI智能解读 - 51yijing.com',
    description: '在线易经占卜，AI智能解读卦象。三币古法摇卦，结合八字命理，给出专业解读建议。',
    url: SITE_URL,
    locale: 'zh_CN',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '易经在线占卜 - 51yijing.com',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '易经在线占卜 | AI智能解读 - 51yijing.com',
    description: '在线易经占卜，AI智能解读卦象。三币古法摇卦，结合八字命理，给出专业解读建议。',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const lang = locale === 'en' ? 'en' : locale === 'zh-TW' ? 'zh-TW' : 'zh';

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.7.0/style.css"
        />
      </head>
      <body
        className={`${notoSerifSC.variable} antialiased`}
      >
        <GoogleAnalytics />
        <WebVitalsReporter />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
