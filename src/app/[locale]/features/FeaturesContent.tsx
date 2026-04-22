"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/ui";
import { useNavItems } from "@/hooks/useNavItems";

const FREE_FEATURE_KEYS = [
  "divination",
  "daily",
  "hexagrams",
  "encyclopedia",
  "history",
] as const;

const FAQ_KEYS = ["whyFree", "privacy", "author"] as const;

export default function FeaturesContent() {
  const t = useTranslations("Features");
  const navItems = useNavItems();

  return (
    <PageLayout navItems={navItems} maxWidth="max-w-[48rem]">
      <div className="py-8 px-4">
        {/* Hero */}
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
            className="text-[var(--color-gold)]/50 text-base tracking-widest"
          >
            {t("subtitle")}
          </motion.p>
          <div className="divider-gold w-24 mx-auto mt-5" />
        </div>

        {/* Free features list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-2xl border border-[var(--color-gold)]/20 bg-white/[0.02] p-8 mb-8"
        >
          <h2 className="font-title text-xl text-[var(--color-gold-bright)] mb-6 tracking-wide">
            {t("freeTitle")}
          </h2>
          <ul className="space-y-4">
            {FREE_FEATURE_KEYS.map((key) => (
              <li key={key} className="flex items-center gap-3 text-base text-[var(--theme-text-secondary)]">
                <span className="text-green-400 text-lg flex-shrink-0">✅</span>
                <span>{t(`features.${key}.title`)}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Support narrative */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-2xl border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/[0.04] p-8 mb-8"
        >
          <h2 className="font-title text-xl text-[var(--color-gold-bright)] mb-4 tracking-wide">
            {t("supportTitle")}
          </h2>
          <p className="text-[var(--theme-text-secondary)] leading-relaxed mb-5">
            {t("supportDesc")}
          </p>
          <a
            href="https://xiaobot.net/p/51yijing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[var(--color-gold)] hover:text-[var(--color-gold-bright)] transition-colors text-base"
          >
            {t("supportLink")}
          </a>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <h2 className="font-title text-xl text-[var(--color-gold-bright)] mb-6 tracking-wide">
            {t("faqTitle")}
          </h2>
          <div className="space-y-5">
            {FAQ_KEYS.map((key) => (
              <div
                key={key}
                className="rounded-xl border border-[var(--color-gold)]/15 bg-white/[0.02] p-5"
              >
                <h3 className="text-[var(--color-gold)] font-medium mb-2">
                  {t(`faq.${key}.q`)}
                </h3>
                <p className="text-[var(--theme-text-muted)] text-sm leading-relaxed">
                  {t(`faq.${key}.a`)}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}
