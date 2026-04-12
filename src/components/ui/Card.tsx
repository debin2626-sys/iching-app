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
    "bg-[var(--theme-bg-card)]",
    "border border-[var(--theme-border)]",
    "shadow-[inset_0_0_0_1px_var(--color-border-light)]",
  ].join(" "),
  elevated: [
    "bg-[var(--theme-bg-card)]",
    "border border-[var(--theme-border)]",
    "shadow-[inset_0_0_0_1px_var(--color-border-light),0_8px_32px_rgba(0,0,0,0.06)]",
  ].join(" "),
  interactive: [
    "bg-[var(--theme-bg-card)]",
    "border border-[var(--theme-border)]",
    "shadow-[inset_0_0_0_1px_var(--color-border-light)]",
    "transition-all duration-[600ms] ease-in-out",
    "hover:-translate-y-[2px] hover:border-[var(--color-gold)]",
    "hover:shadow-[inset_0_0_0_1px_var(--color-border-light),0_8px_24px_rgba(0,0,0,0.08),0_0_12px_rgba(184,146,74,0.08)]",
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
