"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { m, type HTMLMotionProps } from "framer-motion";

/* ── Variants & sizes ── */
const variantStyles = {
  primary: [
    "border border-gold/60 text-gold bg-gold/8",
    "hover:border-gold hover:shadow-[0_0_20px_color-mix(in_srgb,var(--color-gold)_25%,transparent)] hover:text-gold-bright",
    "disabled:border-gold/20 disabled:text-gold/40 disabled:shadow-none",
  ].join(" "),
  secondary: [
    "border border-white/20 text-gray-200 bg-white/5",
    "hover:border-white/40 hover:text-white",
    "disabled:border-white/10 disabled:text-gray-500",
  ].join(" "),
  ghost: [
    "border border-transparent text-gray-300 bg-transparent",
    "hover:text-gold hover:bg-white/5",
    "disabled:text-gray-600",
  ].join(" "),
} as const;

const sizeStyles = {
  sm: "h-8 px-4 text-xs gap-1.5",
  md: "h-10 px-6 text-sm gap-2",
  lg: "h-12 px-8 text-base gap-2.5",
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
      "inline-flex items-center justify-center rounded-[9999px] font-medium tracking-wide",
      "transition-all duration-300 ease-out",
      "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
      "disabled:pointer-events-none disabled:opacity-50",
      variantStyles[variant],
      sizeStyles[size],
      className,
    ].join(" ");

    const content = (
      <>
        {loading ? <Spinner /> : icon}
        {children && <span>{children}</span>}
      </>
    );

    if (href && !disabled) {
      return (
        <Link href={href} className={base}>
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
        {...(rest as HTMLMotionProps<"button">)}
      >
        {content}
      </m.button>
    );
  }
);
