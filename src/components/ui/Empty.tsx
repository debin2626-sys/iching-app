"use client";

import { type ReactNode } from "react";

interface EmptyProps {
  /** Icon or illustration displayed above the title */
  icon?: ReactNode;
  /** Main heading */
  title: string;
  /** Supporting description text */
  description?: string;
  /** Action slot — typically a Button */
  action?: ReactNode;
  className?: string;
}

export function Empty({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-16 text-center ${className}`}
    >
      {icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/15 bg-gold/5 text-3xl text-gold/60">
          {icon}
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-lg font-medium tracking-wide text-gray-200">
          {title}
        </h3>
        {description && (
          <p className="max-w-xs text-sm leading-relaxed text-gray-500">
            {description}
          </p>
        )}
      </div>

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
