"use client";

import { useTranslations } from "next-intl";
import Card from "@/components/ui/Card";

export default function ComingSoonGrid() {
  const t = useTranslations("Daily");

  const SCHOOLS = [
    { icon: "📖", nameKey: "comingSoonConfucian", sloganKey: "comingSoonConfucianSlogan" },
    { icon: "⚔️", nameKey: "comingSoonStrategy", sloganKey: "comingSoonStrategySlogan" },
    { icon: "🪷", nameKey: "comingSoonZen", sloganKey: "comingSoonZenSlogan" },
    { icon: "🌿", nameKey: "comingSoonMedicine", sloganKey: "comingSoonMedicineSlogan" },
    { icon: "🎋", nameKey: "comingSoonPoetry", sloganKey: "comingSoonPoetrySlogan" },
    { icon: "🔮", nameKey: "comingSoonNumerology", sloganKey: "comingSoonNumerologySlogan" },
  ] as const;

  return (
    <div className="space-y-4">
      <p
        className="text-base text-center"
        style={{ fontFamily: "var(--font-display)", color: "var(--theme-text-secondary)" }}
      >
        {t("comingSoonTitle")}
      </p>
      <div className="grid grid-cols-3 gap-3">
        {SCHOOLS.map((s) => (
          <Card key={s.nameKey} variant="default" padding="sm" className="text-center opacity-80">
            <p className="text-2xl">{s.icon}</p>
            <p
              className="text-sm mt-1"
              style={{ fontFamily: "var(--font-display)", color: "var(--theme-text-primary)" }}
            >
              {t(s.nameKey)}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--theme-text-muted)" }}>
              {t(s.sloganKey)}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
