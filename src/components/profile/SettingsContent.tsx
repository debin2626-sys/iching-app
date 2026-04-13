"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { PageLayout, Card, Button } from "@/components/ui";

interface Preferences {
  language: string;
  theme: string;
  aiDepth: string;
  notifications: boolean;
}

const AI_DEPTHS = ["simple", "detailed", "deep"] as const;
const LANGUAGES = ["system", "zh", "en"] as const;

export default function SettingsContent() {
  const t = useTranslations("Settings");
  const tNav = useTranslations("Nav");
  const locale = useLocale();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [prefs, setPrefs] = useState<Preferences>({
    language: "zh",
    theme: "dark",
    aiDepth: "simple",
    notifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const navItems = [
    { label: tNav("home"), href: "/", icon: <span>🏠</span> },
    { label: tNav("divination"), href: "/divine", icon: <span>🔮</span> },
    { label: tNav("hexagrams"), href: "/hexagrams", icon: <span>📖</span> },
  ];

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user/preferences")
        .then((r) => r.json())
        .then((data) => {
          setPrefs({
            language: data.language || "zh",
            theme: data.theme || "dark",
            aiDepth: data.aiDepth || "simple",
            notifications: data.notifications ?? true,
          });
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const body: Record<string, unknown> = {
        aiDepth: prefs.aiDepth,
        notifications: prefs.notifications,
        theme: prefs.theme,
      };
      // Only send language if it's a real locale (not "system")
      if (prefs.language !== "system") {
        body.language = prefs.language;
      }

      const res = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setMsg(t("saveSuccess"));
        // If language changed, navigate to that locale
        if (prefs.language !== "system" && prefs.language !== locale) {
          router.replace("/settings", { locale: prefs.language });
        }
      } else {
        setMsg(t("saveFailed"));
      }
    } catch {
      setMsg(t("saveFailed"));
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 3000);
    }
  };

  if (status === "loading" || (status !== "unauthenticated" && loading)) {
    return (
      <PageLayout navItems={navItems}>
        <div className="flex items-center justify-center" style={{ minHeight: "60vh" }}>
          <div className="text-gold/40 text-4xl animate-pulse">☯</div>
        </div>
      </PageLayout>
    );
  }

  if (status === "unauthenticated" || !session) {
    return (
      <PageLayout navItems={navItems}>
        <div className="flex flex-col items-center justify-center" style={{ minHeight: "60vh" }}>
          <div className="text-gold/10 text-[120px] mb-8">☯</div>
          <h2 className="text-2xl font-title text-[var(--color-gold-bright)] mb-3">{t("title")}</h2>
          <p className="text-zinc-500 text-base mb-8">{t("loginRequired")}</p>
          <Button href="/auth" variant="ghost" className="w-[200px] h-12 border border-gold/40 hover:border-gold/70 text-gold">
            {t("loginButton")}
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout navItems={navItems} maxWidth="max-w-6xl">
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-title text-4xl sm:text-5xl text-gold-glow tracking-wider mb-3">
            {t("title")}
          </h1>
          <p className="text-[var(--color-gold)]/40 text-base tracking-[0.3em]">{t("subtitle")}</p>
          <div className="divider-gold w-24 mx-auto mt-5" />
        </div>

        <div className="space-y-6">
          {/* AI Depth */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <Card variant="elevated" padding="lg">
              <h3 className="text-sm text-[var(--color-gold)]/60 tracking-widest uppercase mb-5">{t("aiDepthTitle")}</h3>
              <div className="space-y-3">
                {AI_DEPTHS.map((depth) => {
                  const labelKey = `aiDepth${depth.charAt(0).toUpperCase() + depth.slice(1)}` as
                    | "aiDepthSimple"
                    | "aiDepthDetailed"
                    | "aiDepthDeep";
                  const descKey = `${labelKey}Desc` as
                    | "aiDepthSimpleDesc"
                    | "aiDepthDetailedDesc"
                    | "aiDepthDeepDesc";
                  const active = prefs.aiDepth === depth;
                  return (
                    <button
                      key={depth}
                      onClick={() => setPrefs((p) => ({ ...p, aiDepth: depth }))}
                      className={[
                        "w-full text-left px-4 py-3 rounded-lg border transition-all duration-300",
                        active
                          ? "border-gold/50 bg-gold/10 text-[var(--color-gold-bright)]"
                          : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{t(labelKey)}</span>
                        {active && <span className="text-gold text-sm">✓</span>}
                      </div>
                      <p className="text-xs mt-1 opacity-60">{t(descKey)}</p>
                    </button>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Language */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08 }}>
            <Card variant="elevated" padding="lg">
              <h3 className="text-sm text-[var(--color-gold)]/60 tracking-widest uppercase mb-5">{t("languageTitle")}</h3>
              <div className="flex gap-3 flex-wrap">
                {LANGUAGES.map((lang) => {
                  const labelKey = `language${lang.charAt(0).toUpperCase() + lang.slice(1)}` as
                    | "languageSystem"
                    | "languageZh"
                    | "languageEn";
                  const active = prefs.language === lang;
                  return (
                    <button
                      key={lang}
                      onClick={() => setPrefs((p) => ({ ...p, language: lang }))}
                      className={[
                        "px-5 py-2 rounded-full border text-sm transition-all duration-300",
                        active
                          ? "border-gold/50 bg-gold/10 text-gold"
                          : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200",
                      ].join(" ")}
                    >
                      {t(labelKey)}
                    </button>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.16 }}>
            <Card variant="elevated" padding="lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm text-[var(--color-gold)]/60 tracking-widest uppercase mb-1">{t("notificationsTitle")}</h3>
                  <p className="text-xs text-zinc-500">{t("notificationsDesc")}</p>
                </div>
                <button
                  onClick={() => setPrefs((p) => ({ ...p, notifications: !p.notifications }))}
                  className={[
                    "relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0",
                    prefs.notifications ? "bg-gold/40" : "bg-zinc-800",
                  ].join(" ")}
                  role="switch"
                  aria-checked={prefs.notifications}
                >
                  <span
                    className={[
                      "absolute top-1 w-4 h-4 rounded-full transition-all duration-300",
                      prefs.notifications ? "left-7 bg-gold" : "left-1 bg-zinc-500",
                    ].join(" ")}
                  />
                </button>
              </div>
            </Card>
          </motion.div>

          {/* Save */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.24 }}>
            {msg && (
              <p className={`text-sm text-center mb-3 ${msg === t("saveSuccess") ? "text-gold/70" : "text-red-400/70"}`}>
                {msg}
              </p>
            )}
            <div className="flex gap-3">
              <Button href="/profile" variant="ghost" className="flex-1 border border-zinc-800">
                ← {t("backToProfile")}
              </Button>
              <button
                onClick={save}
                disabled={saving}
                className="flex-1 min-h-[48px] px-6 rounded-lg border border-gold/40 text-gold hover:bg-gold/10 hover:border-gold/70 transition-all duration-300 text-base font-medium disabled:opacity-50"
              >
                {saving ? t("saving") : t("saveButton")}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
}
