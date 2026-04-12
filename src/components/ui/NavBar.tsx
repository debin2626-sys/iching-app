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
        className="flex h-8 items-center gap-1 rounded-full border px-3 text-xs transition-all duration-300"
        style={{
          borderColor: 'rgba(184,146,74,0.3)',
          backgroundColor: 'rgba(184,146,74,0.05)',
          color: 'var(--color-gold)',
        }}
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
        <div
          className="absolute right-0 top-full mt-1 min-w-[120px] overflow-hidden rounded-lg border shadow-lg z-[100]"
          style={{
            borderColor: 'rgba(184,146,74,0.2)',
            backgroundColor: 'var(--theme-dropdown-bg)',
            backdropFilter: 'blur(24px)',
          }}
        >
          {LOCALE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => switchTo(opt.value)}
              className="flex w-full items-center px-4 py-2.5 text-sm transition-colors duration-200"
              style={{
                backgroundColor: locale === opt.value ? 'rgba(184,146,74,0.1)' : 'transparent',
                color: locale === opt.value ? 'var(--color-gold)' : 'var(--theme-text-muted)',
              }}
              onMouseEnter={(e) => {
                if (locale !== opt.value) {
                  e.currentTarget.style.color = 'var(--color-gold)';
                  e.currentTarget.style.backgroundColor = 'rgba(184,146,74,0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (locale !== opt.value) {
                  e.currentTarget.style.color = 'var(--theme-text-muted)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
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
      <div className="h-8 w-8 rounded-full animate-pulse" style={{ backgroundColor: 'rgba(184,146,74,0.1)' }} />
    );
  }

  if (!session?.user) {
    return (
      <Link
        href="/auth"
        style={{
          padding: '6px 20px',
          border: '1px solid var(--color-gold)',
          borderRadius: '20px',
          color: 'var(--color-gold)',
          backgroundColor: 'transparent',
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'all 0.3s',
          letterSpacing: '0.05em',
          textDecoration: 'none',
          fontFamily: 'var(--font-display)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(184,146,74,0.1)')}
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
      className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300"
      style={{
        backgroundColor: 'rgba(184,146,74,0.2)',
        border: '1px solid rgba(184,146,74,0.3)',
        color: 'var(--color-gold)',
      }}
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

  const brandName = locale === "en" ? "I Ching" : "易經";

  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 hidden items-center justify-between border-b px-8 md:flex"
      style={{
        height: '64px',
        backgroundColor: 'var(--theme-nav-bg)',
        borderColor: 'var(--theme-border)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Logo / brand */}
      <Link
        href="/"
        className="text-lg font-semibold tracking-widest transition-colors duration-300"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-gold)',
          textShadow: '0 0 20px rgba(184,146,74,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
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
                className={`relative flex items-center gap-1.5 text-base transition-all duration-300 ${
                  active ? "" : "hover:-translate-y-0.5"
                }`}
                style={{
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.08em',
                  color: active ? 'var(--color-gold)' : 'var(--theme-text-muted)',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = 'var(--color-gold)'; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = 'var(--theme-text-muted)'; }}
              >
                {item.icon && (
                  <span className="text-lg">{item.icon}</span>
                )}
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 w-full"
                    style={{ height: '2px', backgroundColor: 'var(--color-gold)' }}
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

  const brandName = locale === "en" ? "I Ching" : "易經";

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b px-4 md:hidden"
      style={{
        backgroundColor: 'var(--theme-nav-bg)',
        borderColor: 'var(--theme-border)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <Link
        href="/"
        className="text-lg font-semibold tracking-widest transition-colors duration-300"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-gold)',
          textShadow: '0 0 20px rgba(184,146,74,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
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
    <nav
      className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-end justify-around border-t pb-[env(safe-area-inset-bottom)] md:hidden"
      style={{
        backgroundColor: 'var(--theme-nav-bg)',
        borderColor: 'var(--theme-border)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {tabs.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-1 flex-col items-center gap-1 pb-2 pt-2 text-xs transition-all duration-300"
            style={{ color: active ? 'var(--color-gold)' : 'var(--theme-text-muted)' }}
          >
            {item.icon ? (
              <span className="text-2xl">{item.icon}</span>
            ) : (
              <span
                className="h-6 w-6 rounded-full border"
                style={{
                  borderColor: active ? 'var(--color-gold)' : 'var(--theme-border)',
                  backgroundColor: active ? 'rgba(184,146,74,0.2)' : 'transparent',
                }}
              />
            )}
            <span>{item.label}</span>
            {active && (
              <motion.span
                layoutId="tab-dot"
                className="absolute top-1 h-0.5 w-4 rounded-full"
                style={{ backgroundColor: 'var(--color-gold)' }}
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
