"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { trackFunnelHomeView, trackFunnelStartClick } from "@/lib/analytics";

export default function StartDivinationButton() {
  const t = useTranslations("Home");
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    trackFunnelHomeView({
      referrer: document.referrer || undefined,
      utm_source: url.searchParams.get("utm_source") || undefined,
      utm_medium: url.searchParams.get("utm_medium") || undefined,
    });
  }, []);

  const handleStart = () => {
    trackFunnelStartClick({ entry_type: "direct_click" });
    router.push("/divine");
  };

  return (
    <button
      onClick={handleStart}
      className="min-w-[200px] px-12 h-[56px] bg-gradient-to-br from-[#c9a96e] to-[#b8943d] text-[#0a0a12] text-lg rounded-[14px] font-bold font-title tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(201,169,110,0.3)] hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(201,169,110,0.4)]"
      style={{ animation: "pulse-glow 2.5s ease-in-out infinite" }}
    >
      {t("startButton")}
    </button>
  );
}
