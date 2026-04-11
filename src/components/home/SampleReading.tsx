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
            "linear-gradient(145deg, rgba(20,20,30,0.95), rgba(15,15,22,0.98))",
          border: "1px solid rgba(201,169,110,0.3)",
          boxShadow:
            "0 0 40px rgba(201,169,110,0.06), inset 0 1px 0 rgba(201,169,110,0.1)",
        }}
      >
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[rgba(201,169,110,0.4)]" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[rgba(201,169,110,0.4)]" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[rgba(201,169,110,0.4)]" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[rgba(201,169,110,0.4)]" />

        <div className="p-6 sm:p-8">
          {/* Server-rendered card content (hex name, quote, paragraphs) */}
          {children}

          {/* Expand / Collapse toggle */}
          {content.paragraphs.length > 1 && (
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="flex items-center gap-1 mx-auto mt-4 text-sm text-[#c9a96e] hover:text-[#e8d5a3] transition-colors"
            >
              {expanded ? content.collapseLabel : content.expandLabel}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
              />
            </button>
          )}

          {/* Divider */}
          <div className="my-6 h-px bg-gradient-to-r from-transparent via-[rgba(201,169,110,0.2)] to-transparent" />

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={() => router.push("/")}
              className="px-8 py-3 bg-gradient-to-br from-[#c9a96e] to-[#b8943d] text-[#0a0a12] text-base rounded-[14px] font-bold font-title tracking-wider transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_20px_rgba(201,169,110,0.3)]"
            >
              {content.cta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
