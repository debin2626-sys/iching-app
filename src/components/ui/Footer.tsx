"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const KOFI_URL = "https://ko-fi.com/" + (process.env.NEXT_PUBLIC_KOFI_USERNAME || "51yijing");

export default function Footer() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  const links = [
    { label: t("about"), href: "/about" },
    { label: t("privacy"), href: "/privacy" },
    { label: t("terms"), href: "/terms" },
    { label: t("contact"), href: "/contact" },
  ];

  return (
    <footer className="w-full border-t border-[rgba(201,169,110,0.1)] mt-auto">
      <div className="max-w-4xl mx-auto px-6 py-6 text-center">
        {/* Footer Links */}
        <nav className="mb-4 flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
          {links.map((link, i) => (
            <span key={link.href} className="flex items-center">
              <Link
                href={link.href as any}
                className="text-[11px] text-gray-600 hover:text-[#c9a96e] transition-colors"
              >
                {link.label}
              </Link>
              <span className="text-gray-700 text-[11px] mx-2">|</span>
            </span>
          ))}
          {/* Ko-fi support link */}
          <a
            href={KOFI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-[#c9a96e]/70 hover:text-[#c9a96e] transition-colors"
          >
            {t("kofiSupport")}
          </a>
        </nav>

        <p className="text-[11px] leading-relaxed text-gray-600 mb-2">
          {t("disclaimer")}
        </p>
        <p className="text-[11px] text-gray-700">
          © {year} 51yijing.com
        </p>
      </div>
    </footer>
  );
}
