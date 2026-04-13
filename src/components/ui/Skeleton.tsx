"use client";

interface SkeletonBaseProps {
  className?: string;
}

/* ── Shared pulse animation ── */
const pulse =
  "animate-pulse rounded-lg bg-gradient-to-r from-white/[0.04] via-white/[0.08] to-white/[0.04] bg-[length:200%_100%]";

/* ── Text line skeleton ── */
function TextSkeleton({
  lines = 3,
  className = "",
}: SkeletonBaseProps & { lines?: number }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`${pulse} h-4 rounded-md`}
          style={{ width: i === lines - 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
}

/* ── Card skeleton ── */
function CardSkeleton({ className = "" }: SkeletonBaseProps) {
  return (
    <div
      className={`rounded-xl border border-[var(--theme-border)] bg-[var(--theme-skeleton-base)] p-6 space-y-4 ${className}`}
    >
      <div className={`${pulse} h-5 w-2/5 rounded-md`} />
      <div className="space-y-2.5">
        <div className={`${pulse} h-3.5 w-full rounded-md`} />
        <div className={`${pulse} h-3.5 w-4/5 rounded-md`} />
        <div className={`${pulse} h-3.5 w-3/5 rounded-md`} />
      </div>
      <div className={`${pulse} mt-2 h-9 w-28 rounded-full`} />
    </div>
  );
}

/* ── Avatar skeleton ── */
function AvatarSkeleton({
  size = 48,
  className = "",
}: SkeletonBaseProps & { size?: number }) {
  return (
    <div
      className={`${pulse} shrink-0 rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

/* ── Compound export ── */
export type SkeletonVariant = "text" | "card" | "avatar";

interface SkeletonProps extends SkeletonBaseProps {
  variant?: SkeletonVariant;
  /** Number of text lines (text variant only) */
  lines?: number;
  /** Avatar diameter in px (avatar variant only) */
  size?: number;
  /** Repeat the skeleton N times */
  count?: number;
}

export function Skeleton({
  variant = "text",
  lines,
  size,
  count = 1,
  className,
}: SkeletonProps) {
  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, i) => {
        switch (variant) {
          case "card":
            return <CardSkeleton key={i} className={className} />;
          case "avatar":
            return <AvatarSkeleton key={i} size={size} className={className} />;
          default:
            return (
              <TextSkeleton key={i} lines={lines} className={className} />
            );
        }
      })}
    </>
  );
}
