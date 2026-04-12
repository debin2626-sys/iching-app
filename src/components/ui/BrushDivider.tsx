"use client";

interface BrushDividerProps {
  className?: string;
}

/**
 * Decorative brush-stroke divider with gold gradient and ink-wash feel.
 * Used between content sections for a traditional Chinese aesthetic.
 */
export default function BrushDivider({ className = "" }: BrushDividerProps) {
  return (
    <div className={`flex items-center justify-center gap-3 py-6 ${className}`}>
      {/* Left brush stroke */}
      <div
        className="h-[1px] flex-1 max-w-[120px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--color-gold) 100%)",
          opacity: 0.4,
        }}
      />
      {/* Center ornament */}
      <span
        className="text-lg select-none"
        style={{ color: "var(--color-gold)", opacity: 0.5 }}
      >
        ◆
      </span>
      {/* Right brush stroke */}
      <div
        className="h-[1px] flex-1 max-w-[120px]"
        style={{
          background:
            "linear-gradient(90deg, var(--color-gold) 0%, transparent 100%)",
          opacity: 0.4,
        }}
      />
    </div>
  );
}
