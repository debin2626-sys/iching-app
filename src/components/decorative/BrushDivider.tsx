"use client";

interface BrushDividerProps {
  color?: string;
  width?: string;
  className?: string;
}

export function BrushDivider({
  color,
  width = "100%",
  className = "",
}: BrushDividerProps) {
  const strokeColor = color || "var(--color-gold)";

  return (
    <div
      className={`pointer-events-none ${className}`}
      style={{ width }}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="8"
        viewBox="0 0 800 8"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main brush stroke - irregular, organic line */}
        <path
          d="M0 4 C20 3.5, 40 2.8, 80 3.2 C120 3.6, 160 4.5, 200 4.2 C240 3.9, 280 3, 320 3.5 C360 4, 400 4.8, 440 4.3 C480 3.8, 520 3.2, 560 3.6 C600 4, 640 4.6, 680 4.1 C720 3.6, 760 3.3, 800 3.8"
          stroke={strokeColor}
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
          strokeLinecap="round"
        />
        {/* Thinner parallel stroke for brush texture */}
        <path
          d="M20 4.5 C60 4, 100 3.5, 140 4 C180 4.5, 220 5, 260 4.6 C300 4.2, 340 3.6, 380 4.1 C420 4.6, 460 5.1, 500 4.7 C540 4.3, 580 3.8, 620 4.2 C660 4.6, 700 5, 740 4.5 C760 4.2, 780 4, 800 4.2"
          stroke={strokeColor}
          strokeWidth="0.5"
          fill="none"
          opacity="0.3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
