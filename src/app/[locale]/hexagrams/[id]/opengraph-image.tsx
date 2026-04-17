import { ImageResponse } from 'next/og';
import { getHexagramByNumber } from '@/data/hexagrams';
import { loadNotoSerifSC } from '@/lib/og/load-font';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const num = parseInt(id, 10);
  const hex = getHexagramByNumber(num);

  const nameZh = hex?.nameZh ?? '易经';
  const nameEn = hex?.nameEn ?? 'I Ching';
  const number = hex?.number ?? num;
  const traditionalName = hex?.traditionalName ?? '';

  // Load subset font containing only the characters we need
  const textForFont = `第${number}卦${nameZh}${traditionalName}${nameEn}51yijing.com`;
  const fontData = await loadNotoSerifSC(textForFont);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#f8f5f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          fontFamily: fontData ? 'Noto Serif SC' : 'serif',
        }}
      >
        {/* Outer decorative border */}
        <div
          style={{
            position: 'absolute',
            inset: 24,
            border: '2px solid #c4b08a',
            display: 'flex',
          }}
        />
        {/* Inner decorative border */}
        <div
          style={{
            position: 'absolute',
            inset: 32,
            border: '1px solid #c4b08a',
            opacity: 0.5,
            display: 'flex',
          }}
        />

        {/* Corner ornaments */}
        {[
          { top: 20, left: 20 },
          { top: 20, right: 20 },
          { bottom: 20, left: 20 },
          { bottom: 20, right: 20 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 16,
              height: 16,
              background: '#c4b08a',
              ...pos,
              display: 'flex',
            }}
          />
        ))}

        {/* Hexagram number badge */}
        <div
          style={{
            background: '#b8924a',
            color: '#f8f5f0',
            fontSize: 22,
            fontWeight: 700,
            padding: '6px 20px',
            borderRadius: 4,
            marginBottom: 24,
            letterSpacing: 2,
            display: 'flex',
          }}
        >
          第 {number} 卦
        </div>

        {/* Chinese name — large */}
        <div
          style={{
            fontSize: 160,
            fontWeight: 700,
            color: '#2c2c2c',
            lineHeight: 1,
            marginBottom: 16,
            display: 'flex',
          }}
        >
          {nameZh}
        </div>

        {/* Traditional name */}
        <div
          style={{
            fontSize: 32,
            color: '#5a5a5a',
            marginBottom: 8,
            letterSpacing: 4,
            display: 'flex',
          }}
        >
          {traditionalName}
        </div>

        {/* English name */}
        <div
          style={{
            fontSize: 26,
            color: '#b8924a',
            letterSpacing: 1,
            display: 'flex',
          }}
        >
          {nameEn}
        </div>

        {/* Horizontal divider */}
        <div
          style={{
            width: 200,
            height: 1,
            background: '#c4b08a',
            marginTop: 32,
            marginBottom: 24,
            display: 'flex',
          }}
        />

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: 52,
            fontSize: 20,
            color: '#5a5a5a',
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
}
