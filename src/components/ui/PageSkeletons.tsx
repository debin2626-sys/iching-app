"use client";

/* ── Shimmer animation is defined in globals.css ── */

/* ── Result page skeleton ── */
export function ResultSkeleton() {
  return (
    <div className="space-y-6 animate-in">
      {/* Hexagram diagram skeleton */}
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="skeleton-shimmer h-6 w-32 rounded-md" />
        <div className="skeleton-shimmer h-40 w-40 rounded-xl" />
        <div className="skeleton-shimmer h-5 w-24 rounded-md" />
      </div>

      {/* Text lines skeleton */}
      <div className="space-y-3 px-4">
        <div className="skeleton-shimmer h-4 w-full rounded-md" />
        <div className="skeleton-shimmer h-4 w-5/6 rounded-md" />
        <div className="skeleton-shimmer h-4 w-4/5 rounded-md" />
        <div className="skeleton-shimmer h-4 w-3/4 rounded-md" />
      </div>

      {/* AI interpretation area skeleton */}
      <div className="rounded-xl border border-white/5 bg-[#1a1a2e]/60 p-6 space-y-4">
        <div className="skeleton-shimmer h-5 w-28 rounded-md" />
        <div className="space-y-2.5">
          <div className="skeleton-shimmer h-3.5 w-full rounded-md" />
          <div className="skeleton-shimmer h-3.5 w-full rounded-md" />
          <div className="skeleton-shimmer h-3.5 w-5/6 rounded-md" />
          <div className="skeleton-shimmer h-3.5 w-4/5 rounded-md" />
          <div className="skeleton-shimmer h-3.5 w-full rounded-md" />
          <div className="skeleton-shimmer h-3.5 w-3/4 rounded-md" />
        </div>
      </div>
    </div>
  );
}

/* ── Hexagrams grid skeleton ── */
export function HexagramsGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-white/5 bg-[#1a1a2e]/60 p-4 space-y-3"
        >
          <div className="skeleton-shimmer mx-auto h-12 w-12 rounded-lg" />
          <div className="skeleton-shimmer mx-auto h-4 w-16 rounded-md" />
          <div className="skeleton-shimmer mx-auto h-3 w-12 rounded-md" />
        </div>
      ))}
    </div>
  );
}

/* ── History list skeleton ── */
export function HistoryListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-white/5 bg-[#1a1a2e]/60 p-4 flex items-center gap-4"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="skeleton-shimmer h-12 w-12 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="skeleton-shimmer h-4 w-3/4 rounded-md" />
            <div className="skeleton-shimmer h-3 w-1/2 rounded-md" />
          </div>
          <div className="skeleton-shimmer h-4 w-16 shrink-0 rounded-md" />
        </div>
      ))}
    </div>
  );
}
