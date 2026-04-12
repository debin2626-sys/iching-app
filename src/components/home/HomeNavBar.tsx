"use client";

import { useTranslations } from "next-intl";
import { NavBar } from "@/components/ui";

export default function HomeNavBar() {
  const tNav = useTranslations("Nav");

  const navItems = [
    { label: tNav("home"), href: "/", icon: <span>🏠</span> },
    { label: tNav("divination"), href: "/divine", icon: <span>🔮</span> },
    { label: tNav("hexagrams"), href: "/hexagrams", icon: <span>📖</span> },
  ];

  return <NavBar items={navItems} />;
}
