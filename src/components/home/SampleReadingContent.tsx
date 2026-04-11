// Server Component — no "use client"
// All static text rendered server-side for SEO crawlers

import {
  SAMPLE_READING_CONTENT,
  type SampleReadingLocale,
} from "./sampleReadingData";

// Qian hexagram: 6 solid yang lines
function HexagramDisplay() {
  return (
    <div className="flex flex-col items-center gap-[6px] my-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="w-20 h-[5px] rounded-sm"
          style={{
            background: "linear-gradient(90deg, #c9a96e, #e8d5a3, #c9a96e)",
            boxShadow: "0 0 6px rgba(201,169,110,0.3)",
          }}
        />
      ))}
    </div>
  );
}

/**
 * Section header — rendered above the card.
 */
export function SampleReadingSectionHeader({ locale }: { locale: string }) {
  const content =
    SAMPLE_READING_CONTENT[locale as SampleReadingLocale] ||
    SAMPLE_READING_CONTENT.en;

  return (
    <div className="text-center mb-8">
      <h2 className="text-xl text-[#c9a96e] font-title font-bold">
        {content.sectionTitle}
      </h2>
      <p className="text-sm text-[#a0978a] mt-2">
        {content.sectionSubtitle}
      </p>
    </div>
  );
}

/**
 * Card interior — all the SEO-valuable static content.
 * Rendered inside the card wrapper provided by the client component.
 */
export function SampleReadingCardContent({ locale }: { locale: string }) {
  const content =
    SAMPLE_READING_CONTENT[locale as SampleReadingLocale] ||
    SAMPLE_READING_CONTENT.en;

  return (
    <>
      {/* Header: Hexagram name + scenario badge */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-2xl font-bold text-[#c9a96e] font-title">
            {content.hexName}
          </h3>
          <p className="text-sm text-[#a0978a]">{content.hexSubname}</p>
        </div>
        <span className="px-3 py-1 text-xs rounded-full border border-[rgba(201,169,110,0.3)] text-[#c9a96e] bg-[rgba(201,169,110,0.08)]">
          {content.scenario}
        </span>
      </div>

      {/* Hexagram visual */}
      <HexagramDisplay />

      {/* Original quote */}
      <blockquote className="my-6 pl-4 border-l-2 border-[rgba(201,169,110,0.3)]">
        <p className="text-[#c9a96e] text-sm italic leading-relaxed">
          {content.originalQuote}
        </p>
        <p className="text-[#a0978a] text-xs mt-1">
          {content.originalSource}
        </p>
      </blockquote>

      {/* AI interpretation — ALL paragraphs in DOM for SEO */}
      <div className="space-y-4">
        <p className="text-[#d4cfc5] text-sm leading-relaxed">
          {content.paragraphs[0]}
        </p>
      </div>

      {/* Remaining paragraphs: always in DOM, CSS grid controls visibility */}
      {content.paragraphs.length > 1 && (
        <div
          data-collapsible="true"
          className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-in-out mt-4"
        >
          <div className="overflow-hidden">
            <div className="space-y-4">
              {content.paragraphs.slice(1).map((p, i) => (
                <p
                  key={i}
                  className="text-[#d4cfc5] text-sm leading-relaxed"
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
