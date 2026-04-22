"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  const featureLinks = [
    { label: t("divination"), href: "/divine" },
    { label: t("hexagrams"),  href: "/hexagrams" },
    { label: t("history"),    href: "/history" },
    { label: t("guide"),      href: "/guide" },
  ];

  const legalLinks = [
    { label: t("about"),   href: "/about" },
    { label: t("privacy"), href: "/privacy" },
    { label: t("terms"),   href: "/terms" },
    { label: t("contact"), href: "/contact" },
  ];

  return (
    <footer
      className="w-full border-t mt-auto"
      style={{ borderColor: 'var(--theme-border)' }}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Two-column link groups */}
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 mb-6">
          {/* Features */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--color-gold)', opacity: 0.6 }}>
              {t("features")}
            </span>
            {featureLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[12px] transition-colors"
                style={{ color: 'var(--theme-text-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--theme-text-muted)')}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Legal / Info */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--color-gold)', opacity: 0.6 }}>
              Info
            </span>
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[12px] transition-colors"
                style={{ color: 'var(--theme-text-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--theme-text-muted)')}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Disclaimer + copyright */}
        <div className="text-center">
          <p className="text-[11px] leading-relaxed mb-2" style={{ color: 'var(--theme-text-muted)' }}>
            {t("disclaimer")}
          </p>
          <p className="text-[11px]" style={{ color: 'var(--theme-text-secondary)' }}>
            © {year} 51yijing.com
          </p>
        </div>
      </div>
    </footer>
  );
}
