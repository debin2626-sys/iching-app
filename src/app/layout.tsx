import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_SC } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import { WebVitalsReporter } from "@/components/WebVitalsReporter";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-noto-serif-sc",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "易 · YiChing",
  description: "Ancient Wisdom, Modern Insight",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale?: string}>;
}>) {
  const {locale} = await params;
  const lang = locale === 'en' ? 'en' : 'zh';

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSerifSC.variable} antialiased`}
      >
        <GoogleAnalytics />
        <WebVitalsReporter />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
