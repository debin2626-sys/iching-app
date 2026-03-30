"use client";

import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { type ReactNode } from "react";

export interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

interface NavBarProps {
  items: NavItem[];
}

function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggle = () => {
    const next = locale === "zh" ? "en" : "zh";
    router.replace(pathname, { locale: next });
  };

  return (
    <button
      onClick={toggle}
      className="relative flex h-8 w-16 items-center rounded-full border border-gold/30 bg-white/5 px-1 text-xs transition-all duration-300 hover:border-gold/60"
      aria-label="Switch language"
    >
      <motion.span
        layout
        className="absolute h-6 w-7 rounded-full bg-gold/20"
        animate={{ x: locale === "zh" ? 0 : 28 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
      <span
        className={`relative z-10 flex-1 text-center transition-colors duration-300 ${
          locale === "zh" ? "text-gold" : "text-gray-500"
        }`}
      >
        中
      </span>
      <span
        className={`relative z-10 flex-1 text-center transition-colors duration-300 ${
          locale === "en" ? "text-gold" : "text-gray-500"
        }`}
      >
        EN
      </span>
    </button>
  );
}

/* ── User Avatar / Login Button ── */
function UserButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-8 w-8 rounded-full bg-white/5 animate-pulse" />
    );
  }

  if (!session?.user) {
    return (
      <Link
        href="/auth"
        className="text-sm text-gray-300 hover:text-gold transition-colors duration-300 tracking-wide border border-gold/30 rounded-lg px-4 py-1.5 hover:border-gold/60 hover:bg-gold/5"
      >
        登录
      </Link>
    );
  }

  const initial = session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U";

  return (
    <Link
      href="/auth"
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

  return (
    <nav className="fixed inset-x-0 top-0 z-50 hidden h-20 items-center justify-between border-b border-[rgba(201,169,110,0.15)] bg-[rgba(10,10,18,0.8)] px-8 backdrop-blur-[12px] md:flex">
      {/* Logo / brand */}
      <Link
        href="/"
        className="text-xl font-semibold tracking-widest text-gold transition-colors duration-300 hover:text-gold-bright"
        style={{ textShadow: '0 0 20px rgba(201,169,110,0.3)' }}
      >
        易经
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

      {/* Right side: Language + User */}
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <UserButton />
      </div>
    </nav>
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
      <MobileTabBar items={items} />
    </>
  );
}
