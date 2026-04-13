"use client";

interface TaichiWatermarkProps {
  size?: number;
  opacity?: number;
  className?: string;
  animate?: boolean;
}

export function TaichiWatermark({
  size = 600,
  opacity = 0.07,
  className = "",
  animate = true,
}: TaichiWatermarkProps) {
  const half = size / 2;
  const quarter = size / 4;
  const dotR = size / 12;

  return (
    <div
      className={`pointer-events-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={animate ? { animation: 'taichi-spin 120s linear infinite' } : undefined}
      >
        {/* Outer circle */}
        <circle
          cx={half}
          cy={half}
          r={half - 2}
          stroke="var(--theme-text-primary)"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Left half (dark) */}
        <path
          d={`M ${half} ${size - 2}
              A ${half - 2} ${half - 2} 0 0 1 ${half} 2
              A ${quarter} ${quarter} 0 0 0 ${half} ${half}
              A ${quarter} ${quarter} 0 0 1 ${half} ${size - 2}`}
          fill="var(--theme-text-primary)"
          fillOpacity="0.6"
        />

        {/* Right half (light) */}
        <path
          d={`M ${half} 2
              A ${half - 2} ${half - 2} 0 0 1 ${half} ${size - 2}
              A ${quarter} ${quarter} 0 0 0 ${half} ${half}
              A ${quarter} ${quarter} 0 0 1 ${half} 2`}
          fill="var(--theme-text-primary)"
          fillOpacity="0.15"
        />

        {/* Yin dot (light dot in dark half) */}
        <circle
          cx={half}
          cy={half + quarter}
          r={dotR}
          fill="var(--theme-text-primary)"
          fillOpacity="0.15"
        />

        {/* Yang dot (dark dot in light half) */}
        <circle
          cx={half}
          cy={quarter}
          r={dotR}
          fill="var(--theme-text-primary)"
          fillOpacity="0.6"
        />

        {/* Inner S-curve line */}
        <path
          d={`M ${half} 2
              A ${quarter} ${quarter} 0 0 0 ${half} ${half}
              A ${quarter} ${quarter} 0 0 1 ${half} ${size - 2}`}
          stroke="var(--theme-text-primary)"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </div>
  );
}
