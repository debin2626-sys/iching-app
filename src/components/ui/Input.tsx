"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

type Size = "sm" | "md" | "lg";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  size?: Size;
}

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, size = "md", className = "", id, ...rest }, ref) => {
    const inputId = id ?? (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm text-[var(--gold)] opacity-80"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={[
            "bg-transparent rounded-[8px] border outline-none",
            "transition-all duration-300 ease-in-out",
            "placeholder:text-gray-500",
            error
              ? "border-red-500 focus:border-red-400 focus:shadow-[0_0_20px_rgba(239,68,68,0.1)]"
              : "border-[var(--gold-dim)]/30 focus:border-[var(--gold)] focus:shadow-[0_0_20px_color-mix(in_srgb,var(--color-gold)_10%,transparent)]",
            "text-gray-200",
            sizeClasses[size],
            className,
          ].join(" ")}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error
              ? `${inputId}-error`
              : hint
                ? `${inputId}-hint`
                : undefined
          }
          {...rest}
        />

        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-400" role="alert">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-xs text-gray-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
