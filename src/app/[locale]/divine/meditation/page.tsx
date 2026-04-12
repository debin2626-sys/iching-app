import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getBaseUrl, getAlternateLanguages } from "@/lib/seo";
import { Suspense } from "react";
import MeditationPageContent from "./MeditationPageContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = getBaseUrl(locale) + "/divine/meditation";
  const t = await getTranslations({ locale, namespace: "Meditation" });

  return {
    title: t("meditationTitle"),
    description: t("meditationDescription"),
    alternates: {
      canonical,
      languages: getAlternateLanguages("/divine/meditation"),
    },
    openGraph: {
      title: t("meditationTitle"),
      description: t("meditationDescription"),
      url: canonical,
      type: "website",
    },
  };
}

export default async function MeditationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense>
      <MeditationPageContent />
    </Suspense>
  );
}
