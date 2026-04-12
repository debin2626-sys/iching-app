"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { m, type HTMLMotionProps } from "framer-motion";

/* ── Variants & sizes ── */
const variantStyles = {
  primary: [
    "border bg-[var(--color-vermilion)] border-[var(--color-gold)] text-white",
    "hover:bg-[var(--color-gold)] hover:text-[var(--theme-text-primary)] hover:border-[var(--color-gold-bright)]",
    "hover:shadow-[0_0_20px_rgba(184,146,74,0.3)]",
    "disabled:opacity-50 disabled:shadow-none",
  ].join(" "),
  secondary: [
    "border border-[var(--color-gold)] text-[var(--color-gold)] bg-transparent",
    "hover:bg-[rgba(184,146,74,0.12)] hover:text-[var(--color-gold-bright)]",
    "hover:shadow-[0_0_15px_rgba(184,146,74,0.2)]",
    "disabled:opacity-50",
  ].join(" "),
  ghost: [
    "border border-transparent text-[var(--theme-text-secondary)] bg-transparent",
    "hover:text-[var(--color-gold)]",
    "disabled:opacity-50",
  ].join(" "),
} as const;

const sizeStyles = {
  sm: "min-h-[48px] min-w-[200px] px-4 text-base gap-1.5",
  md: "min-h-[48px] min-w-[200px] px-6 text-base gap-2",
  lg: "min-h-[48px] min-w-[200px] px-8 text-lg gap-2.5",
} as const;

export type ButtonVariant = keyof typeof variantStyles;
export type ButtonSize = keyof typeof sizeStyles;

/* ── Spinner ── */
function Spinner({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="2"
      />
      <path
        d="M14 8a6 6 0 0 0-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Props ── */
type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
};

type AsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: never;
  };

type AsLink = BaseProps & {
  href: string;
  disabled?: boolean;
  className?: string;
};

export type ButtonProps = AsButton | AsLink;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    const {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      children,
      href,
      disabled,
      className = "",
      ...rest
    } = props as AsButton & { href?: string };

    const base = [
      "inline-flex items-center justify-center font-medium",
      "rounded-[4px]",
      "transition-all duration-[400ms] ease-in-out",
      "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)]",
      "disabled:pointer-events-none",
      variantStyles[variant],
      sizeStyles[size],
      className,
    ].join(" ");

    const fontStyle = {
      fontFamily: "var(--font-display)",
      letterSpacing: "0.1em",
    };

    const content = (
      <>
        {loading ? <Spinner /> : icon}
        {children && <span>{children}</span>}
      </>
    );

    if (href && !disabled) {
      return (
        <Link href={href} className={base} style={fontStyle}>
          {content}
        </Link>
      );
    }

    return (
      <m.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        disabled={disabled || loading}
        className={base}
        style={fontStyle}
        {...(rest as HTMLMotionProps<"button">)}
      >
        {content}
      </m.button>
    );
  }
);
