"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/ui";

const KOFI_USERNAME = process.env.NEXT_PUBLIC_KOFI_USERNAME || "51yijing";

interface PricingTier {
  key: "BASIC" | "MONTHLY" | "QUARTERLY" | "ANNUAL";
  amount: number;
  popular?: boolean;
}

const TIERS: PricingTier[] = [
  { key: "BASIC", amount: 5 },
  { key: "MONTHLY", amount: 15 },
  { key: "QUARTERLY", amount: 40, popular: true },
  { key: "ANNUAL", amount: 120 },
];

function getKofiLink(tier: PricingTier): string {
  return `https://ko-fi.com/${KOFI_USERNAME}`;
}

export default function PricingPage() {
  const t = useTranslations("Pricing");
  const tNav = useTranslations("Nav");

  const navItems = [
    { label: tNav("home"), href: "/", icon: <span>☯</span> },
    { label: tNav("divination"), href: "/divination", icon: <span>🔮</span> },
    { label: tNav("hexagrams"), href: "/hexagrams", icon: <span>📖</span> },
  ];

  return (
    <PageLayout navItems={navItems} maxWidth="max-w-5xl">
      <div className="py-8 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-title text-4xl sm:text-5xl text-gold-glow tracking-wider mb-4"
          >
            {t("title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-amber-400/50 text-base tracking-widest"
          >
            {t("subtitle")}
          </motion.p>
          <div className="divider-gold w-24 mx-auto mt-5" />
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * i }}
              className={`relative rounded-2xl border p-6 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.03] ${
                tier.popular
                  ? "border-[#c9a96e]/60 bg-[#c9a96e]/[0.06] shadow-lg shadow-[#c9a96e]/10"
                  : "border-[#c9a96e]/20 bg-white/[0.02]"
              }`}
            >
              {/* Popular badge */}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#c9a96e] text-[#0a0a12] text-xs font-bold tracking-wide">
                  {t("popular")}
                </div>
              )}

              {/* Icon */}
              <div className="text-3xl mb-3 mt-1">{t(`tiers.${tier.key}.icon`)}</div>

              {/* Name */}
              <h3 className="font-title text-lg text-amber-200 mb-1">
                {t(`tiers.${tier.key}.name`)}
              </h3>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-bold text-[#c9a96e]">${tier.amount}</span>
                <span className="text-sm text-zinc-500">
                  {t(`tiers.${tier.key}.period`)}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-zinc-400 mb-5 leading-relaxed min-h-[3rem]">
                {t(`tiers.${tier.key}.description`)}
              </p>

              {/* Features */}
              <ul className="text-left w-full space-y-2 mb-6 flex-1">
                {(t.raw(`tiers.${tier.key}.features`) as string[]).map(
                  (feature: string, fi: number) => (
                    <li
                      key={fi}
                      className="flex items-start gap-2 text-sm text-zinc-300"
                    >
                      <span className="text-[#c9a96e] mt-0.5 flex-shrink-0">✦</span>
                      <span>{feature}</span>
                    </li>
                  )
                )}
              </ul>

              {/* CTA Button */}
              <a
                href={getKofiLink(tier)}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3 rounded-xl font-title tracking-wide text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  tier.popular
                    ? "bg-[#c9a96e] hover:bg-[#d4b87e] text-[#0a0a12] font-bold shadow-md shadow-[#c9a96e]/20"
                    : "border border-[#c9a96e]/40 text-[#c9a96e] hover:border-[#c9a96e]/70 hover:bg-[#c9a96e]/10"
                }`}
              >
                ☕ {t("buyButton")}
              </a>
            </motion.div>
          ))}
        </div>

        {/* FAQ / Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12 max-w-2xl mx-auto"
        >
          <p className="text-sm text-zinc-500 leading-relaxed">
            {t("note")}
          </p>
          <p className="text-xs text-zinc-600 mt-3">
            {t("paymentNote")}
          </p>
        </motion.div>
      </div>
    </PageLayout>
  );
}
