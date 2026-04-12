"use client";

interface InkWashBackgroundProps {
  variant?: "subtle" | "medium" | "strong";
  className?: string;
}

const opacityMap = {
  subtle: { primary: 0.03, secondary: 0.02, tertiary: 0.015 },
  medium: { primary: 0.06, secondary: 0.04, tertiary: 0.03 },
  strong: { primary: 0.1, secondary: 0.07, tertiary: 0.05 },
};

export function InkWashBackground({
  variant = "subtle",
  className = "",
}: InkWashBackgroundProps) {
  const o = opacityMap[variant];

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
      style={{
        backgroundImage: [
          `radial-gradient(ellipse 70% 50% at 20% 30%, rgba(var(--theme-text-primary, 26, 18, 8), ${o.primary}) 0%, transparent 70%)`,
          `radial-gradient(ellipse 50% 60% at 75% 60%, rgba(var(--theme-text-primary, 26, 18, 8), ${o.secondary}) 0%, transparent 70%)`,
          `radial-gradient(ellipse 80% 40% at 50% 80%, rgba(var(--theme-text-primary, 26, 18, 8), ${o.tertiary}) 0%, transparent 70%)`,
          `radial-gradient(circle 300px at 10% 90%, rgba(184, 146, 74, ${o.tertiary}) 0%, transparent 70%)`,
          `radial-gradient(circle 250px at 85% 15%, rgba(192, 57, 43, ${o.tertiary * 0.5}) 0%, transparent 70%)`,
        ].join(', '),
      }}
    />
  );
}
