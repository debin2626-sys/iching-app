"use client";

import { useEffect, useState } from "react";

interface YaoLineProps {
  /** 'yang' for solid line, 'yin' for broken line */
  type: "yang" | "yin";
  /** Whether this is a changing line (old yang / old yin) */
  isMoving: boolean;
  /** Whether to animate the stroke-dashoffset drawing effect */
  animate: boolean;
}

/**
 * Single yao line component with SVG stroke-dashoffset animation.
 * Yang = solid line, Yin = broken line (two segments with gap).
 * Moving lines (old yang/old yin) are vermilion with a circle marker.
 * Static lines are gold.
 */
export default function YaoLine({ type, isMoving, animate }: YaoLineProps) {
  const [drawn, setDrawn] = useState(!animate);

  useEffect(() => {
    if (!animate) return;
    // Trigger draw after mount
    const raf = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(raf);
  }, [animate]);

  const color = isMoving ? "var(--color-vermilion)" : "var(--color-gold)";
  const width = 120;
  const height = 20; // viewBox height for padding
  const strokeWidth = 6;
  const y = height / 2;

  // Reduced motion: skip animation
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const transitionDuration = prefersReduced ? "0s" : "0.4s";

  if (type === "yang") {
    // Solid line
    const dashLen = width;
    return (
      <div className="flex items-center gap-2">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          aria-hidden="true"
        >
          <line
            x1={0}
            y1={y}
            x2={width}
            y2={y}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={dashLen}
            strokeDashoffset={drawn ? 0 : dashLen}
            style={{
              transition: `stroke-dashoffset ${transitionDuration} ease-out`,
            }}
          />
        </svg>
        {isMoving && (
          <svg width={12} height={12} viewBox="0 0 12 12" aria-hidden="true">
            <circle
              cx={6}
              cy={6}
              r={5}
              fill="none"
              stroke="var(--color-vermilion)"
              strokeWidth={1.5}
            />
          </svg>
        )}
      </div>
    );
  }

  // Yin: two segments with gap
  const segWidth = 50;
  const gap = 20;
  const totalW = segWidth * 2 + gap;

  return (
    <div className="flex items-center gap-2">
      <svg
        width={totalW}
        height={height}
        viewBox={`0 0 ${totalW} ${height}`}
        aria-hidden="true"
      >
        {/* Left segment */}
        <line
          x1={0}
          y1={y}
          x2={segWidth}
          y2={y}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={segWidth}
          strokeDashoffset={drawn ? 0 : segWidth}
          style={{
            transition: `stroke-dashoffset ${transitionDuration} ease-out`,
          }}
        />
        {/* Right segment */}
        <line
          x1={segWidth + gap}
          y1={y}
          x2={totalW}
          y2={y}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={segWidth}
          strokeDashoffset={drawn ? 0 : segWidth}
          style={{
            transition: `stroke-dashoffset ${transitionDuration} ease-out`,
            transitionDelay: prefersReduced ? "0s" : "0.1s",
          }}
        />
      </svg>
      {isMoving && (
        <svg width={12} height={12} viewBox="0 0 12 12" aria-hidden="true">
          <circle
            cx={6}
            cy={6}
            r={5}
            fill="none"
            stroke="var(--color-vermilion)"
            strokeWidth={1.5}
          />
        </svg>
      )}
    </div>
  );
}
