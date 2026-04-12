"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import {
  SAMPLE_READING_CONTENT,
  type SampleReadingLocale,
} from "./sampleReadingData";

/**
 * Client wrapper for SampleReading.
 * Provides the card chrome, expand/collapse toggle, and CTA button.
 * Server-rendered content slots:
 *   - header: section title/subtitle (above card)
 *   - children: card interior (hex name, quote, paragraphs)
 */
export default function SampleReadingClient({
  locale,
  header,
  children,
}: {
  locale: string;
  header?: React.ReactNode;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const content =
    SAMPLE_READING_CONTENT[locale as SampleReadingLocale] ||
    SAMPLE_READING_CONTENT.en;

  return (
    <section
      className="mt-24"
      data-expanded={expanded ? "true" : "false"}
    >
      {/* CSS rules driving the collapsible panel */}
      <style
        dangerouslySetInnerHTML={{
          __html: [
            '[data-expanded="false"] [data-collapsible] { grid-template-rows: 0fr; }',
            '[data-expanded="true"] [data-collapsible] { grid-template-rows: 1fr; }',
          ].join("\n"),
        }}
      />

      {/* Section header — server rendered */}
      {header}

      {/* Sample Card */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, var(--theme-bg-card), var(--theme-bg-card-solid))",
          border: "1px solid var(--theme-border-hover)",
          boxShadow:
            "0 0 40px rgba(184,146,74,0.06), inset 0 1px 0 rgba(184,146,74,0.1)",
        }}
      >
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-gold/40" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gold/40" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-gold/40" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-gold/40" />

        <div className="p-6 sm:p-8">
          {/* Server-rendered card content (hex name, quote, paragraphs) */}
          {children}

          {/* Expand / Collapse toggle */}
          {content.paragraphs.length > 1 && (
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="flex items-center gap-1 mx-auto mt-4 text-sm text-gold hover:text-gold-bright transition-colors"
            >
              {expanded ? content.collapseLabel : content.expandLabel}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
              />
            </button>
          )}

          {/* Divider */}
          <div className="my-6 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={() => router.push("/")}
              className="px-8 py-3 bg-gradient-to-br from-gold to-gold-dim text-bg text-base rounded-[14px] font-bold font-title tracking-wider transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_20px_rgba(201,169,110,0.3)]"
            >
              {content.cta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
