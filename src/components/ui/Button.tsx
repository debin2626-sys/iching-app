"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { m, type HTMLMotionProps } from "framer-motion";

/* ── Variants & sizes ── */
const variantStyles = {
  primary: [
    "border border-[rgba(201,169,110,0.5)] text-[#c9a96e] bg-transparent",
    "hover:border-[rgba(201,169,110,0.8)] hover:shadow-[0_0_15px_rgba(201,169,110,0.4)] hover:text-[#e8d5a3]",
    "disabled:border-[rgba(201,169,110,0.2)] disabled:text-[rgba(201,169,110,0.4)] disabled:shadow-none",
  ].join(" "),
  secondary: [
    "border border-[rgba(201,169,110,0.3)] text-[#a0978a] bg-transparent",
    "hover:border-[rgba(201,169,110,0.6)] hover:text-[#c9a96e] hover:shadow-[0_0_12px_rgba(201,169,110,0.25)]",
    "disabled:border-[rgba(201,169,110,0.15)] disabled:text-[rgba(160,151,138,0.4)]",
  ].join(" "),
  ghost: [
    "border border-transparent text-[#a0978a] bg-transparent",
    "hover:text-[#c9a96e] hover:border-[rgba(201,169,110,0.3)]",
    "disabled:text-[rgba(160,151,138,0.3)]",
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
      "inline-flex items-center justify-center rounded-lg font-medium tracking-wide",
      "transition-all duration-[400ms] ease-in-out",
      "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(201,169,110,0.5)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a12]",
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
