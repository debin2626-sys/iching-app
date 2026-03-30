"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";

type Size = "sm" | "md" | "lg";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  size?: Size;
}

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, options, placeholder, error, size = "md", className = "", id, ...rest },
    ref
  ) => {
    const selectId =
      id ?? (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm text-[var(--gold)] opacity-80"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={[
              "w-full bg-transparent rounded-[8px] border outline-none appearance-none",
              "transition-all duration-300 ease-in-out",
              "pr-10",
              error
                ? "border-red-500 focus:border-red-400 focus:shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                : "border-[var(--gold-dim)]/30 focus:border-[var(--gold)] focus:shadow-[0_0_20px_color-mix(in_srgb,var(--color-gold)_10%,transparent)]",
              "text-gray-200",
              sizeClasses[size],
              className,
            ].join(" ")}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${selectId}-error` : undefined}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled className="bg-[var(--bg)] text-gray-500">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-[var(--bg)] text-gray-200"
              >
                {opt.label}
              </option>
            ))}
          </select>

          {/* Custom gold arrow */}
          <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 5.5L7 9.5L11 5.5"
              stroke="var(--gold-dim)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {error && (
          <p id={`${selectId}-error`} className="text-xs text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
