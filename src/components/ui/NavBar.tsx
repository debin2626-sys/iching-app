"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { useState, useRef, useEffect, type ReactNode } from "react";
import { trackLanguageSwitch } from "@/lib/analytics";
import { ThemeToggle } from "./ThemeToggle";

export interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

interface NavBarProps {
  items: NavItem[];
}

const LOCALE_LABELS: Record<string, string> = {
  zh: "简体",
  "zh-TW": "繁體",
  en: "EN",
};

const LOCALE_OPTIONS = [
  { value: "zh", label: "简体中文" },
  { value: "zh-TW", label: "繁體中文" },
  { value: "en", label: "English" },
];

function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const switchTo = (next: string) => {
    if (next !== locale) {
      trackLanguageSwitch(locale, next);
      router.replace(pathname, { locale: next });
    }
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-8 items-center gap-1 rounded-full border border-gold/30 bg-white/5 px-3 text-xs text-gold transition-all duration-300 hover:border-gold/60"
        aria-label="Switch language"
      >
        <span>{LOCALE_LABELS[locale] || locale}</span>
        <svg
          className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 min-w-[120px] overflow-hidden rounded-lg border border-gold/20 bg-[rgba(10,10,18,0.95)] shadow-lg backdrop-blur-xl z-[100]">
          {LOCALE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => switchTo(opt.value)}
              className={`flex w-full items-center px-4 py-2.5 text-sm transition-colors duration-200 ${
                locale === opt.value
                  ? "bg-gold/10 text-gold"
                  : "text-gray-400 hover:bg-white/5 hover:text-gold"
              }`}
            >
              {locale === opt.value && (
                <span className="mr-2 text-xs">✓</span>
              )}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── User Avatar / Login Button ── */
function UserButton() {
  const { data: session, status } = useSession();
  const tHome = useTranslations("Home");

  if (status === "loading") {
    return (
      <div className="h-8 w-8 rounded-full bg-white/5 animate-pulse" />
    );
  }

  if (!session?.user) {
    return (
      <Link
        href="/auth"
        style={{
          padding: '6px 20px',
          border: '1px solid rgba(201,169,110,0.4)',
          borderRadius: '20px',
          color: '#c9a96e',
          backgroundColor: 'transparent',
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'all 0.3s',
          letterSpacing: '0.05em',
          textDecoration: 'none',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(201,169,110,0.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        {tHome("loginButton")}
      </Link>
    );
  }

  const initial = session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U";

  return (
    <Link
      href="/profile"
      className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20 border border-gold/30 text-gold text-sm font-semibold hover:bg-gold/30 transition-all duration-300"
      title={session.user.name || session.user.email || ""}
    >
      {session.user.image ? (
        <img
          src={session.user.image}
          alt=""
          className="h-8 w-8 rounded-full object-cover"
        />
      ) : (
        initial.toUpperCase()
      )}
    </Link>
  );
}

/* ── Desktop top bar ── */
function DesktopNav({ items }: NavBarProps) {
  const pathname = usePathname();
  const locale = useLocale();

  const brandName = locale === "en" ? "Yi Ching" : "易經";

  return (
    <nav className="fixed inset-x-0 top-0 z-50 hidden items-center justify-between border-b border-[rgba(201,169,110,0.15)] bg-[rgba(10,10,18,0.8)] px-8 backdrop-blur-[12px] md:flex" style={{ height: '64px' }}>
      {/* Logo / brand */}
      <Link
        href="/"
        className="text-lg font-title font-semibold tracking-widest text-gold transition-colors duration-300 hover:text-gold-bright"
        style={{ textShadow: '0 0 20px rgba(201,169,110,0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}
      >
        <span style={{ fontSize: '20px' }}>☯</span>
        {brandName}
      </Link>

      {/* Nav links */}
      <ul className="flex items-center gap-8">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`relative flex items-center gap-1.5 text-base tracking-wide transition-all duration-300 ${
                  active
                    ? "text-gold"
                    : "text-gray-400 hover:text-gold hover:-translate-y-0.5"
                }`}
              >
                {item.icon && (
                  <span className="text-lg">{item.icon}</span>
                )}
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 h-px w-full bg-gold"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Right side: Theme + Language + User */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <LanguageSwitcher />
        <UserButton />
      </div>
    </nav>
  );
}

/* ── Mobile top header (language + login) ── */
function MobileTopBar() {
  const locale = useLocale();

  const brandName = locale === "en" ? "Yi Ching" : "易經";

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-[rgba(201,169,110,0.15)] bg-[rgba(10,10,18,0.9)] px-4 backdrop-blur-[12px] md:hidden">
      <Link
        href="/"
        className="text-lg font-title font-semibold tracking-widest text-gold transition-colors duration-300 hover:text-gold-bright"
        style={{ textShadow: '0 0 20px rgba(201,169,110,0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}
      >
        <span style={{ fontSize: '20px' }}>☯</span>
        {brandName}
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <LanguageSwitcher />
        <UserButton />
      </div>
    </div>
  );
}

/* ── Mobile bottom tab bar ── */
function MobileTabBar({ items }: NavBarProps) {
  const pathname = usePathname();
  const tabs = items.slice(0, 5);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex h-18 items-end justify-around border-t border-[rgba(201,169,110,0.15)] bg-[rgba(10,10,18,0.9)] pb-[env(safe-area-inset-bottom)] backdrop-blur-[12px] md:hidden">
      {tabs.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-1 pb-2 pt-2 text-xs transition-all duration-300 ${
              active ? "text-gold" : "text-gray-500"
            }`}
          >
            {item.icon ? (
              <span className="text-2xl">{item.icon}</span>
            ) : (
              <span
                className={`h-6 w-6 rounded-full border ${
                  active ? "border-gold bg-gold/20" : "border-gray-600"
                }`}
              />
            )}
            <span>{item.label}</span>
            {active && (
              <motion.span
                layoutId="tab-dot"
                className="absolute top-1 h-0.5 w-4 rounded-full bg-gold"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function NavBar({ items }: NavBarProps) {
  return (
    <>
      <DesktopNav items={items} />
      <MobileTopBar />
      <MobileTabBar items={items} />
    </>
  );
}
