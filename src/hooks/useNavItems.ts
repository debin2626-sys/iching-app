"use client";
import { useTranslations } from "next-intl";

export function useNavItems() {
  const tNav = useTranslations("Nav");
  return [
    { label: tNav("home"),       href: "/" as const,          icon: "🏠" },
    { label: tNav("divination"), href: "/divine" as const,    icon: "🔮" },
    { label: tNav("hexagrams"),  href: "/hexagrams" as const, icon: "📖" },
    { label: tNav("history"),    href: "/history" as const,   icon: "📜" },
    { label: tNav("guide"),      href: "/guide" as const,     icon: "📚" },
  ];
}
