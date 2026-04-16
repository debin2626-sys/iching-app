"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const KOFI_URL = "https://ko-fi.com/" + (process.env.NEXT_PUBLIC_KOFI_USERNAME || "51yijing");

export default function Footer() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  const links: { label: string; href: string }[] = [
    { label: t("about"), href: "/about" },
    { label: t("privacy"), href: "/privacy" },
    { label: t("terms"), href: "/terms" },
    { label: t("contact"), href: "/contact" },
  ];

  return (
    <footer
      className="w-full border-t mt-auto"
      style={{ borderColor: 'var(--theme-border)' }}
    >
      <div className="max-w-6xl mx-auto px-6 py-6 text-center">
        {/* Footer Links */}
        <nav className="mb-4 flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
          {links.map((link) => (
            <span key={link.href} className="flex items-center">
              <Link
                href={link.href}
                className="text-[11px] transition-colors"
                style={{ color: 'var(--theme-text-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--theme-text-muted)')}
              >
                {link.label}
              </Link>
              <span className="text-[11px] mx-2" style={{ color: 'var(--theme-border-hover)' }}>|</span>
            </span>
          ))}
          {/* Ko-fi support link */}
          <a
            href={KOFI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] transition-colors"
            style={{ color: 'var(--color-gold)', opacity: 0.7 }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
          >
            {t("kofiSupport")}
          </a>
        </nav>

        <p className="text-[11px] leading-relaxed mb-2" style={{ color: 'var(--theme-text-muted)' }}>
          {t("disclaimer")}
        </p>
        <p className="text-[11px]" style={{ color: 'var(--theme-text-secondary)' }}>
          © {year} 51yijing.com
        </p>
      </div>
    </footer>
  );
}
