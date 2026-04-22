"use client";

import Card from "@/components/ui/Card";

const SCHOOLS = [
  { icon: "📖", name: "儒家修身", slogan: "日省三身" },
  { icon: "⚔️", name: "兵法谋略", slogan: "知己知彼" },
  { icon: "🪷", name: "禅宗公案", slogan: "直指人心" },
  { icon: "🌿", name: "中医养生", slogan: "顺时而养" },
  { icon: "🎋", name: "诗词意境", slogan: "以诗观心" },
  { icon: "🔮", name: "周易象数", slogan: "观象玩辞" },
] as const;

export default function ComingSoonGrid() {
  return (
    <div className="space-y-4">
      <p
        className="text-base text-center"
        style={{ fontFamily: "var(--font-display)", color: "var(--theme-text-secondary)" }}
      >
        更多流派即将上线
      </p>
      <div className="grid grid-cols-3 gap-3">
        {SCHOOLS.map((s) => (
          <Card key={s.name} variant="default" padding="sm" className="text-center opacity-80">
            <p className="text-2xl">{s.icon}</p>
            <p
              className="text-sm mt-1"
              style={{ fontFamily: "var(--font-display)", color: "var(--theme-text-primary)" }}
            >
              {s.name}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--theme-text-muted)" }}>
              {s.slogan}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
