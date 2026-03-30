"use client";

import { type ReactNode, type HTMLAttributes } from "react";

type Variant = "default" | "elevated" | "interactive";
type Padding = "sm" | "md" | "lg";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  padding?: Padding;
  children: ReactNode;
}

const paddingClasses: Record<Padding, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const variantClasses: Record<Variant, string> = {
  default: [
    "bg-[var(--bg-card)]",
    "border border-gold/15",
    "backdrop-blur-[12px]",
  ].join(" "),
  elevated: [
    "bg-[var(--bg-card)]",
    "border border-gold/15",
    "backdrop-blur-[12px]",
    "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
  ].join(" "),
  interactive: [
    "bg-[var(--bg-card)]",
    "border border-gold/15",
    "backdrop-blur-[12px]",
    "transition-all duration-300 ease-in-out",
    "hover:-translate-y-[2px] hover:border-gold/35",
    "hover:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_20px_rgba(201,169,110,0.08)]",
    "active:scale-[0.97]",
    "cursor-pointer",
  ].join(" "),
};

export default function Card({
  variant = "default",
  padding = "md",
  children,
  className = "",
  ...rest
}: CardProps) {
  return (
    <div
      className={[
        "rounded-[12px]",
        variantClasses[variant],
        paddingClasses[padding],
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}
