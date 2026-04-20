import { ImageResponse } from 'next/og';
import { getHexagramByNumber } from '@/data/hexagrams';
import { loadNotoSerifSC } from '@/lib/og/load-font';
import { OG_COLORS, OG_BORDER } from '@/lib/og/constants';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const revalidate = 2592000; // 30 days

export default async function Image({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ hexagram?: string }>;
}) {
  try {
    const { locale } = await params;
    const { hexagram } = await searchParams;

    const num = hexagram ? parseInt(hexagram, 10) : NaN;
    const hex = !isNaN(num) ? getHexagramByNumber(num) : undefined;

    const number = hex?.number ?? 1;
    const nameZh = hex?.nameZh ?? '易经';
    const nameEn = hex?.nameEn ?? 'I Ching';
    const symbol = hex?.symbol ?? '111111';

    // Locale-aware display name
    const hexName =
      locale === 'zh-TW'
        ? (hex?.nameZhTW ?? nameZh)
        : locale === 'en'
          ? nameEn
          : nameZh;

    // Locale-aware judgment
    const judgment =
      locale === 'zh-TW'
        ? (hex?.judgmentZhTW ?? hex?.judgmentZh ?? '')
        : locale === 'en'
          ? (hex?.judgmentEn ?? '')
          : (hex?.judgmentZh ?? '');

    // Truncate judgment to first sentence
    const truncatedJudgment = (() => {
      const zhSplit = judgment.split('。')[0];
      const enSplit = judgment.split('.')[0];
      const candidate = locale === 'en' ? enSplit : zhSplit;
      return candidate.length < judgment.length ? candidate + (locale === 'en' ? '.' : '。') : candidate;
    })();

    // English name font size based on length
    const enFontSize = nameEn.length <= 20 ? 26 : nameEn.length <= 30 ? 22 : 18;

    // Load subset font
    const allText = `第${number}卦${hexName}${nameEn}${truncatedJudgment}51yijing.com`;
    let fontData: ArrayBuffer | null = null;
    try {
      fontData = await loadNotoSerifSC(allText);
      if (!fontData) {
        console.warn('OG image: font load returned null, using serif fallback');
      }
    } catch (fontErr) {
      console.warn('OG image: font load failed, using serif fallback', fontErr);
    }

    const fontFamily = fontData ? 'Noto Serif SC' : 'serif';

    // Render yao lines from symbol string (symbol[0]=top, symbol[5]=bottom)
    const yaoLines = symbol.split('').map((char, i) => {
      const isYang = char === '1';
      return (
        <div
          key={i}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: i < 5 ? 6 : 0,
          }}
        >
          {isYang ? (
            // Yang: single bar
            <div
              style={{
                width: 120,
                height: 10,
                background: OG_COLORS.textDark,
                display: 'flex',
              }}
            />
          ) : (
            // Yin: two bars with gap
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <div
                style={{
                  width: 52,
                  height: 10,
                  background: OG_COLORS.textDark,
                  display: 'flex',
                }}
              />
              <div style={{ width: 16, display: 'flex' }} />
              <div
                style={{
                  width: 52,
                  height: 10,
                  background: OG_COLORS.textDark,
                  display: 'flex',
                }}
              />
            </div>
          )}
        </div>
      );
    });

    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            background: OG_COLORS.bg,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            fontFamily,
          }}
        >
          {/* Outer decorative border */}
          <div
            style={{
              position: 'absolute',
              inset: OG_BORDER.outer.inset,
              border: `${OG_BORDER.outer.width}px solid ${OG_COLORS.borderGold}`,
              display: 'flex',
            }}
          />

          {/* Inner decorative border */}
          <div
            style={{
              position: 'absolute',
              inset: OG_BORDER.inner.inset,
              border: `${OG_BORDER.inner.width}px solid ${OG_COLORS.borderGold}`,
              opacity: OG_BORDER.inner.opacity,
              display: 'flex',
            }}
          />

          {/* Corner ornaments */}
          {(
            [
              { top: OG_BORDER.outer.inset - 4, left: OG_BORDER.outer.inset - 4 },
              { top: OG_BORDER.outer.inset - 4, right: OG_BORDER.outer.inset - 4 },
              { bottom: OG_BORDER.outer.inset - 4, left: OG_BORDER.outer.inset - 4 },
              { bottom: OG_BORDER.outer.inset - 4, right: OG_BORDER.outer.inset - 4 },
            ] as { top?: number; bottom?: number; left?: number; right?: number }[]
          ).map((pos, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: OG_BORDER.corner.size,
                height: OG_BORDER.corner.size,
                background: OG_COLORS.borderGold,
                display: 'flex',
                ...pos,
              }}
            />
          ))}

          {/* Hexagram number badge */}
          <div
            style={{
              background: OG_COLORS.badgeBg,
              color: OG_COLORS.badgeText,
              fontSize: 22,
              fontWeight: 700,
              padding: '6px 20px',
              borderRadius: 4,
              marginBottom: 16,
              letterSpacing: 2,
              display: 'flex',
            }}
          >
            第 {number} 卦
          </div>

          {/* Hexagram name — large */}
          <div
            style={{
              fontSize: 120,
              fontWeight: 700,
              color: OG_COLORS.textDark,
              lineHeight: 1,
              marginBottom: 8,
              display: 'flex',
            }}
          >
            {hexName}
          </div>

          {/* English name */}
          <div
            style={{
              fontSize: enFontSize,
              color: OG_COLORS.textGold,
              letterSpacing: 1,
              marginBottom: 20,
              display: 'flex',
            }}
          >
            {nameEn}
          </div>

          {/* Divider */}
          <div
            style={{
              width: 200,
              height: 1,
              background: OG_COLORS.borderGold,
              marginBottom: 20,
              display: 'flex',
            }}
          />

          {/* Six yao lines */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            {yaoLines}
          </div>

          {/* Divider */}
          <div
            style={{
              width: 200,
              height: 1,
              background: OG_COLORS.borderGold,
              marginBottom: 16,
              display: 'flex',
            }}
          />

          {/* Judgment text */}
          <div
            style={{
              fontSize: 20,
              color: OG_COLORS.textMuted,
              maxWidth: 500,
              textAlign: 'center',
              display: 'flex',
            }}
          >
            {truncatedJudgment}
          </div>

          {/* Watermark */}
          <div
            style={{
              position: 'absolute',
              bottom: 44,
              fontSize: 20,
              color: OG_COLORS.textMuted,
              letterSpacing: 2,
              display: 'flex',
            }}
          >
            51yijing.com
          </div>
        </div>
      ),
      {
        ...size,
        fonts: fontData
          ? [{ name: 'Noto Serif SC', data: fontData, style: 'normal', weight: 700 }]
          : [],
      }
    );
  } catch (e) {
    console.error('OG image generation failed:', e);
    return new ImageResponse(
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#f8f5f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
        }}
      >
        <div style={{ fontSize: 80, color: '#2c2c2c', display: 'flex' }}>易经 · 51yijing.com</div>
      </div>,
      { ...size }
    );
  }
}
