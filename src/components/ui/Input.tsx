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
            className="text-sm"
            style={{ color: "var(--color-gold)", opacity: 0.8 }}
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={[
            "w-full min-h-[48px] border-0 border-b outline-none rounded-none",
            "transition-all duration-[400ms] ease-in-out",
            error
              ? "border-b-red-500 focus:border-b-red-400"
              : "focus:border-b-[var(--color-gold)]",
            sizeClasses[size],
            className,
          ].join(" ")}
          style={{
            backgroundColor: "var(--color-bg-sunken)",
            borderBottomColor: error ? undefined : "var(--theme-border)",
            borderBottomWidth: "1px",
            color: "var(--theme-text-primary)",
          }}
          placeholder={rest.placeholder}
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
          <p id={`${inputId}-hint`} className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
