"use client";

import { Link } from "@/i18n/navigation";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav
      aria-label="breadcrumb"
      className={`flex items-center gap-1 text-[12px] flex-wrap ${className}`}
      style={{ color: "var(--theme-text-muted)" }}
    >
      <Link
        href="/"
        className="flex items-center gap-0.5 transition-colors hover:text-[var(--color-gold)]"
        style={{ color: "var(--theme-text-muted)" }}
      >
        <Home size={12} />
      </Link>

      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight size={12} style={{ opacity: 0.4 }} />
          {item.href && i < items.length - 1 ? (
            <Link
              href={item.href}
              className="transition-colors hover:text-[var(--color-gold)]"
              style={{ color: "var(--theme-text-muted)" }}
            >
              {item.label}
            </Link>
          ) : (
            <span style={{ color: "var(--theme-text-secondary)" }}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
