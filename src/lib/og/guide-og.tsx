import { ImageResponse } from 'next/og';
import { GUIDE_ARTICLES } from '@/data/guide';
import { loadNotoSerifSC } from '@/lib/og/load-font';

export const OG_SIZE = { width: 1200, height: 630 };

const GUIDE_EMOJI: Record<string, string> = {
  'what-is-iching': '☯️',
  'how-to-divine': '🪙',
  'changing-lines': '〰️',
};

export async function renderGuideOG(slug: string): Promise<ImageResponse> {
  const article = GUIDE_ARTICLES.find((a) => a.slug === slug);
  const titleZh = article?.titleZh ?? '易经指南';
  const descZh = article?.descZh ?? '传统易经智慧';
  const emoji = GUIDE_EMOJI[slug] ?? '📖';

  // Load subset font containing only the characters we need
  const textForFont = `易经指南${titleZh}${descZh}51yijing.com`;
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
        {/* Outer border */}
        <div
          style={{
            position: 'absolute',
            inset: 24,
            border: '2px solid #c4b08a',
            display: 'flex',
          }}
        />
        {/* Inner border */}
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

        {/* Guide label */}
        <div
          style={{
            background: '#b8924a',
            color: '#f8f5f0',
            fontSize: 20,
            fontWeight: 700,
            padding: '6px 20px',
            borderRadius: 4,
            marginBottom: 24,
            letterSpacing: 3,
            display: 'flex',
          }}
        >
          易经指南
        </div>

        {/* Emoji */}
        <div style={{ fontSize: 72, marginBottom: 20, display: 'flex' }}>
          {emoji}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: '#2c2c2c',
            lineHeight: 1,
            marginBottom: 20,
            display: 'flex',
          }}
        >
          {titleZh}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 26,
            color: '#5a5a5a',
            letterSpacing: 2,
            display: 'flex',
          }}
        >
          {descZh}
        </div>

        {/* Divider */}
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
      ...OG_SIZE,
      fonts: fontData
        ? [{ name: 'Noto Serif SC', data: fontData, style: 'normal', weight: 700 }]
        : [],
    }
  );
}
