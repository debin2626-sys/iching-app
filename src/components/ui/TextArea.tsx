"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  useCallback,
  type TextareaHTMLAttributes,
} from "react";

type Size = "sm" | "md" | "lg";

export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  size?: Size;
  autoResize?: boolean;
}

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      hint,
      size = "md",
      autoResize = false,
      rows = 4,
      className = "",
      id,
      onInput,
      ...rest
    },
    ref
  ) => {
    const innerRef = useRef<HTMLTextAreaElement | null>(null);
    const textareaId =
      id ?? (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

    const resize = useCallback(() => {
      const el = innerRef.current;
      if (!el || !autoResize) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, [autoResize]);

    useEffect(() => {
      resize();
    }, [resize]);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm text-[var(--gold)] opacity-80"
          >
            {label}
          </label>
        )}

        <textarea
          ref={(node) => {
            innerRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
          }}
          id={textareaId}
          rows={rows}
          className={[
            "bg-[rgba(255,255,255,0.02)] rounded-[8px] border outline-none resize-y w-full min-h-[48px]",
            "transition-all duration-[400ms] ease-in-out",
            "placeholder:text-[var(--theme-text-muted)]/50",
            error
              ? "border-red-500 focus:border-red-400 focus:shadow-[0_0_20px_rgba(239,68,68,0.1)]"
              : "border-[var(--color-gold)]/30 focus:border-[var(--color-gold)]/60 focus:shadow-[0_0_15px_rgba(201,169,110,0.15)]",
            "text-[var(--theme-text-primary)]",
            autoResize ? "resize-none overflow-hidden" : "",
            sizeClasses[size],
            className,
          ].join(" ")}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : hint
                ? `${textareaId}-hint`
                : undefined
          }
          onInput={(e) => {
            resize();
            onInput?.(e);
          }}
          {...rest}
        />

        {error && (
          <p id={`${textareaId}-error`} className="text-xs text-red-400" role="alert">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${textareaId}-hint`} className="text-xs text-[var(--theme-text-muted)]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
export default TextArea;
