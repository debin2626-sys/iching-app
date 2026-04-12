"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageLayout, Card, Button, Skeleton } from "@/components/ui";

interface UserStats {
  totalDivinations: number;
  monthlyDivinations: number;
  totalFavorites: number;
}

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  stats: UserStats;
}

interface SubscriptionInfo {
  id: string;
  tier: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  nextBillingDate: string | null;
}

interface FavoriteHexagram {
  id: string;
  hexagramId: number;
  createdAt: string;
  hexagram: {
    id: number;
    number: number;
    nameZh: string;
    nameEn: string;
    symbol: string;
  };
}

function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  if (locale === "zh" || locale === "zh-TW") {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function ProfileContent() {
  const t = useTranslations("Profile");
  const tNav = useTranslations("Nav");
  const tReport = useTranslations("Report");
  const tSub = useTranslations("Subscription");
  const locale = useLocale();
  const { data: session, status, update: updateSession } = useSession();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [favorites, setFavorites] = useState<FavoriteHexagram[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameMsg, setNameMsg] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);

  const navItems = [
    { label: tNav("home"), href: "/", icon: <span>🏠</span> },
    { label: tNav("divination"), href: "/divine", icon: <span>🔮</span> },
    { label: tNav("hexagrams"), href: "/hexagrams", icon: <span>📖</span> },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, favRes, subRes] = await Promise.all([
        fetch("/api/user/profile"),
        fetch("/api/user/favorites?page=1"),
        fetch("/api/user/subscription"),
      ]);
      if (profileRes.ok) {
        const data = await profileRes.json();
        setProfile(data);
        setNameInput(data.name || "");
      }
      if (favRes.ok) {
        const data = await favRes.json();
        setFavorites(data.favorites || []);
      }
      if (subRes.ok) {
        const data = await subRes.json();
        setSubscription(data.subscription || null);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status, fetchData]);

  const saveName = async () => {
    if (!nameInput.trim()) return;
    setNameSaving(true);
    setNameMsg(null);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameInput.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile((prev) => prev ? { ...prev, name: data.name } : prev);
        setNameMsg(t("saveSuccess"));
        setEditingName(false);
        await updateSession();
      } else {
        setNameMsg(t("saveFailed"));
      }
    } catch {
      setNameMsg(t("saveFailed"));
    } finally {
      setNameSaving(false);
      setTimeout(() => setNameMsg(null), 3000);
    }
  };

  const removeFavorite = async (favId: string) => {
    setRemovingId(favId);
    try {
      const res = await fetch(`/api/user/favorites/${favId}`, { method: "DELETE" });
      if (res.ok) {
        setFavorites((prev) => prev.filter((f) => f.id !== favId));
        if (profile) {
          setProfile((prev) =>
            prev ? { ...prev, stats: { ...prev.stats, totalFavorites: prev.stats.totalFavorites - 1 } } : prev
          );
        }
      }
    } catch {
      // silent
    } finally {
      setRemovingId(null);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut({ callbackUrl: "/" });
  };

  const isZh = locale === "zh" || locale === "zh-TW";

  if (status === "loading" || (status !== "unauthenticated" && loading)) {
    return (
      <PageLayout navItems={navItems}>
        <div className="pt-8 max-w-2xl mx-auto">
          <Skeleton variant="card" count={3} />
        </div>
      </PageLayout>
    );
  }

  if (status === "unauthenticated" || !session) {
    return (
      <PageLayout navItems={navItems}>
        <div className="flex flex-col items-center justify-center" style={{ minHeight: "60vh" }}>
          <div className="text-gold/10 text-[120px] mb-8">☯</div>
          <h2 className="text-2xl font-title text-amber-300 mb-3">{t("title")}</h2>
          <p className="text-zinc-500 text-base mb-8">{t("loginRequired")}</p>
          <Button href="/auth" variant="ghost" className="w-[200px] h-12 border border-gold/40 hover:border-gold/70 text-gold">
            {t("loginButton")}
          </Button>
        </div>
      </PageLayout>
    );
  }

  const initial = (profile?.name || session.user?.email || "U").charAt(0).toUpperCase();

  return (
    <PageLayout navItems={navItems} maxWidth="max-w-4xl">
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-title text-4xl sm:text-5xl text-gold-glow tracking-wider mb-3">
            {t("title")}
          </h1>
          <p className="text-amber-400/40 text-base tracking-[0.3em]">{t("subtitle")}</p>
          <div className="divider-gold w-24 mx-auto mt-5" />
        </div>

        {/* User info card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card variant="elevated" padding="lg" className="mb-6">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div
                className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-title font-bold text-gold border-2 border-gold/30"
                style={{ background: "rgba(201,169,110,0.1)" }}
              >
                {session.user?.image ? (
                  <img src={session.user.image} alt="" className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  initial
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                {/* Name row */}
                <div className="flex items-center gap-3 mb-1">
                  {editingName ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveName()}
                        placeholder={t("namePlaceholder")}
                        maxLength={50}
                        className="flex-1 bg-white/5 border border-gold/30 rounded-lg px-3 py-1.5 text-base text-amber-100 placeholder-zinc-600 focus:outline-none focus:border-gold/60"
                        autoFocus
                      />
                      <button
                        onClick={saveName}
                        disabled={nameSaving}
                        className="px-3 py-1.5 text-sm rounded-lg border border-gold/40 text-gold hover:bg-gold/10 transition-colors disabled:opacity-50"
                      >
                        {nameSaving ? t("saving") : t("saveButton")}
                      </button>
                      <button
                        onClick={() => { setEditingName(false); setNameInput(profile?.name || ""); }}
                        className="px-3 py-1.5 text-sm rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-xl font-title text-amber-200 truncate">
                        {profile?.name || session.user?.email?.split("@")[0] || "—"}
                      </span>
                      <button
                        onClick={() => setEditingName(true)}
                        className="text-xs text-zinc-600 hover:text-gold transition-colors"
                        title={t("editName")}
                      >
                        ✏️
                      </button>
                    </>
                  )}
                </div>
                {nameMsg && (
                  <p className="text-xs text-gold/70 mb-1">{nameMsg}</p>
                )}
                <p className="text-sm text-zinc-500 truncate">{profile?.email || session.user?.email}</p>
                {profile?.createdAt && (
                  <p className="text-xs text-zinc-600 mt-1">
                    {t("memberSince")} {formatDate(profile.createdAt, locale)}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Subscription Status Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
          <Card variant="elevated" padding="lg" className="mb-6">
            <h2 className="text-base text-amber-400/60 tracking-widest mb-4 uppercase">{tSub("title")}</h2>
            {subscription ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-title text-amber-200">
                      {tSub(`tierNames.${subscription.tier}`)}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-green-900/40 text-green-400 text-xs border border-green-700/40">
                      {tSub("active")}
                    </span>
                  </div>
                  {subscription.endDate && (
                    <p className="text-sm text-zinc-500">
                      {tSub("expiresAt")}: {formatDate(subscription.endDate, locale)}
                    </p>
                  )}
                </div>
                <Link
                  href={"/pricing" as any}
                  className="px-4 py-2 rounded-lg border border-gold/40 text-gold text-sm hover:border-gold/70 hover:bg-gold/10 transition-all"
                >
                  {tSub("renewButton")}
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-title text-zinc-400 mb-1">{tSub("freeUser")}</p>
                  <p className="text-sm text-zinc-600">{tSub("freeDesc")}</p>
                </div>
                <Link
                  href={"/pricing" as any}
                  className="px-4 py-2 rounded-lg bg-gold text-bg text-sm font-bold hover:bg-gold-bright transition-all"
                >
                  {tSub("upgradeButton")}
                </Link>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Stats */}
        {profile?.stats && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <h2 className="text-base text-amber-400/60 tracking-widest mb-4 uppercase">{t("statsTitle")}</h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: t("totalDivinations"), value: profile.stats.totalDivinations },
                { label: t("monthlyDivinations"), value: profile.stats.monthlyDivinations },
                { label: t("totalFavorites"), value: profile.stats.totalFavorites },
              ].map((stat, i) => (
                <Card key={i} variant="default" padding="md" className="text-center">
                  <div className="text-3xl font-title text-gold mb-1">{stat.value}</div>
                  <div className="text-xs text-zinc-500">{stat.label}</div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Favorites */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <h2 className="text-base text-amber-400/60 tracking-widest mb-4 uppercase">{t("favoritesTitle")}</h2>
          {favorites.length === 0 ? (
            <Card variant="default" padding="md" className="text-center py-10 mb-8">
              <div className="text-5xl mb-4 opacity-20">☯</div>
              <p className="text-zinc-500 mb-2">{t("noFavorites")}</p>
              <p className="text-xs text-zinc-600 mb-5">{t("noFavoritesHint")}</p>
              <Button href="/hexagrams" variant="ghost" size="sm" className="border border-gold/30 text-gold">
                {t("browsHexagrams")}
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              <AnimatePresence>
                {favorites.map((fav) => (
                  <motion.div
                    key={fav.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card variant="interactive" padding="sm" className="relative group !p-4">
                      <Link href={`/hexagrams/${fav.hexagram.number}` as "/hexagrams/[id]"}>
                        <div className="text-center">
                          <div className="text-3xl mb-1">{fav.hexagram.symbol}</div>
                          <div className="text-sm font-title text-amber-300">
                            {isZh ? fav.hexagram.nameZh : fav.hexagram.nameEn}
                          </div>
                          <div className="text-xs text-zinc-600 mt-0.5">
                            {t("hexagramNumber", { num: fav.hexagram.number })}
                          </div>
                        </div>
                      </Link>
                      <button
                        onClick={() => removeFavorite(fav.id)}
                        disabled={removingId === fav.id}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all text-xs"
                        title={t("unfavorite")}
                      >
                        ✕
                      </button>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <Button href="/report" variant="ghost" className="flex-1 border border-gold/30 text-gold hover:border-gold/60">
              📊 {tReport("title")}
            </Button>
            <Button href="/settings" variant="secondary" className="flex-1">
              ⚙️ {t("settingsEntry")}
            </Button>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full min-h-[48px] px-6 rounded-lg border border-red-900/40 text-red-400/70 hover:border-red-700/60 hover:text-red-400 transition-all duration-300 text-base font-medium disabled:opacity-50"
          >
            {loggingOut ? t("loggingOut") : t("logout")}
          </button>
        </motion.div>
      </div>
    </PageLayout>
  );
}
