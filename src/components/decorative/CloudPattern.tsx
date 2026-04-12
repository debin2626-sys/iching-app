"use client";

interface CloudPatternProps {
  position?: "top" | "bottom";
  color?: string;
  className?: string;
}

export function CloudPattern({
  position = "top",
  color,
  className = "",
}: CloudPatternProps) {
  const strokeColor = color || "var(--color-gold)";

  return (
    <div
      className={`w-full overflow-hidden pointer-events-none ${className}`}
      style={{ height: 32, transform: position === "bottom" ? "scaleY(-1)" : undefined }}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="32"
        viewBox="0 0 200 32"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        <defs>
          <pattern id="cloud-pattern" x="0" y="0" width="200" height="32" patternUnits="userSpaceOnUse">
            {/* Ruyi cloud motif - traditional auspicious cloud */}
            <path
              d="M10 24 C10 18, 16 14, 22 16 C20 10, 28 6, 34 10 C36 4, 46 4, 48 10 C54 6, 62 10, 60 16 C66 14, 72 18, 72 24"
              stroke={strokeColor}
              strokeWidth="0.8"
              fill="none"
              opacity="0.4"
            />
            <path
              d="M80 26 C80 22, 84 19, 88 20 C87 16, 92 13, 96 16 C97 12, 103 12, 104 16 C108 13, 113 16, 112 20 C116 19, 120 22, 120 26"
              stroke={strokeColor}
              strokeWidth="0.6"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M140 24 C140 20, 144 17, 148 18 C147 14, 152 11, 156 14 C157 10, 163 10, 164 14 C168 11, 173 14, 172 18 C176 17, 180 20, 180 24"
              stroke={strokeColor}
              strokeWidth="0.7"
              fill="none"
              opacity="0.35"
            />
          </pattern>
        </defs>
        <rect width="100%" height="32" fill="url(#cloud-pattern)" />
      </svg>
    </div>
  );
}
