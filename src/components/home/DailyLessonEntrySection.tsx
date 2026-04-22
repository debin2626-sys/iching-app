import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Card from "@/components/ui/Card";
import BrushDivider from "@/components/ui/BrushDivider";

/**
 * 首页日课入口卡片 — 引导用户进入 /daily
 * 纯 server component，无状态
 */
export async function DailyLessonEntrySection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "Daily" });
  return (
    <section className="mt-16">
      <BrushDivider />

      <div className="mt-10 text-center space-y-3">
        <p className="text-3xl">☯</p>
        <h2
          className="text-lg"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)" }}
        >
          {t("title")}
        </h2>
        <p className="text-sm" style={{ color: "var(--theme-text-secondary)" }}>
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <Card variant="default" padding="md">
          <p className="text-2xl text-center">☰</p>
          <p
            className="text-base text-center mt-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)" }}
          >
            {t("yijingSchool")}
          </p>
          <p className="text-xs text-center mt-1" style={{ color: "var(--theme-text-muted)" }}>
            {t("yijingCycle")}
          </p>
        </Card>
        <Card variant="default" padding="md">
          <p className="text-2xl text-center">☯</p>
          <p
            className="text-base text-center mt-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)" }}
          >
            {t("daoistSchool")}
          </p>
          <p className="text-xs text-center mt-1" style={{ color: "var(--theme-text-muted)" }}>
            {t("daoistCycle")}
          </p>
        </Card>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/daily"
          className="inline-block px-6 py-2.5 rounded-lg text-sm transition-all"
          style={{
            backgroundColor: "var(--color-gold)",
            color: "var(--theme-bg)",
            fontFamily: "var(--font-display)",
          }}
        >
          {t("startFree")}
        </Link>
      </div>
    </section>
  );
}
