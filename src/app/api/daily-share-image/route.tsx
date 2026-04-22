/* eslint-disable react-hooks/error-boundaries */
import { ImageResponse } from 'next/og';
import { loadNotoSerifSC } from '@/lib/og/load-font';
import { OG_COLORS, SHARE_BORDER } from '@/lib/og/constants';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const quote = searchParams.get('quote') ?? '';
  const source = searchParams.get('source') ?? '';
  const book = searchParams.get('book') ?? '周易';
  const advice = searchParams.get('advice') ?? '';
  const date = searchParams.get('date') ?? '';

  if (!quote) {
    return Response.json({ error: 'Missing required param: quote' }, { status: 400 });
  }

  const allText = `☯每日古典智慧${date}${quote}──${source}──《${book}》🎯今日行动建议${advice}51yijing.com·每日古典智慧·免费订阅`;

  // L2: font load — degrade gracefully
  let fontData: ArrayBuffer | null = null;
  try {
    fontData = await loadNotoSerifSC(allText);
    if (!fontData) {
      console.warn('[daily-share-image] Font load returned null, rendering with serif fallback');
    }
  } catch (err) {
    console.warn('[daily-share-image] Font load threw, rendering with serif fallback', err);
  }

  // L3: catch-all — return minimal fallback image
  try {
    const cornerInset = SHARE_BORDER.outer.inset - 8; // 32

    const jsx = (
      <div
        style={{
          width: 1242,
          height: 1656,
          background: OG_COLORS.bg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          fontFamily: fontData ? 'Noto Serif SC' : 'serif',
          paddingTop: 100,
          paddingBottom: 80,
          paddingLeft: 80,
          paddingRight: 80,
        }}
      >
        {/* Outer border */}
        <div
          style={{
            position: 'absolute',
            top: SHARE_BORDER.outer.inset,
            right: SHARE_BORDER.outer.inset,
            bottom: SHARE_BORDER.outer.inset,
            left: SHARE_BORDER.outer.inset,
            border: `${SHARE_BORDER.outer.width}px solid ${OG_COLORS.borderGold}`,
            display: 'flex',
          }}
        />

        {/* Inner border */}
        <div
          style={{
            position: 'absolute',
            top: SHARE_BORDER.inner.inset,
            right: SHARE_BORDER.inner.inset,
            bottom: SHARE_BORDER.inner.inset,
            left: SHARE_BORDER.inner.inset,
            border: `${SHARE_BORDER.inner.width}px solid ${OG_COLORS.borderGold}`,
            opacity: SHARE_BORDER.inner.opacity,
            display: 'flex',
          }}
        />

        {/* Corner ornaments — 4 corners */}
        {(
          [
            { top: cornerInset, left: cornerInset },
            { top: cornerInset, right: cornerInset },
            { bottom: cornerInset, left: cornerInset },
            { bottom: cornerInset, right: cornerInset },
          ] as React.CSSProperties[]
        ).map((pos, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: SHARE_BORDER.corner.size,
              height: SHARE_BORDER.corner.size,
              background: OG_COLORS.borderGold,
              display: 'flex',
              ...pos,
            }}
          />
        ))}

        {/* 1. Header: ☯ 每日古典智慧 */}
        <div
          style={{
            fontSize: 28,
            color: OG_COLORS.textGold,
            letterSpacing: 4,
            marginBottom: 16,
            display: 'flex',
          }}
        >
          ☯ 每日古典智慧
        </div>

        {/* 2. Date watermark top-right */}
        {date ? (
          <div
            style={{
              position: 'absolute',
              top: 100,
              right: 100,
              fontSize: 16,
              color: OG_COLORS.textMuted,
              letterSpacing: 1,
              display: 'flex',
            }}
          >
            {date}
          </div>
        ) : null}

        {/* Spacer */}
        <div style={{ flex: 1, display: 'flex' }} />

        {/* 3. Main quote box */}
        <div
          style={{
            background: 'rgba(196,176,138,0.08)',
            border: `1px solid ${OG_COLORS.borderGold}`,
            borderRadius: 12,
            paddingTop: 48,
            paddingBottom: 48,
            paddingLeft: 64,
            paddingRight: 64,
            maxWidth: 960,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 700,
              color: OG_COLORS.textGold,
              textAlign: 'center',
              lineHeight: 1.4,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {quote}
          </div>
        </div>

        {/* 4. Source line */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 48,
            gap: 8,
          }}
        >
          {source ? (
            <div
              style={{
                fontSize: 24,
                color: OG_COLORS.textMuted,
                letterSpacing: 2,
                display: 'flex',
              }}
            >
              {`── ${source} ──`}
            </div>
          ) : null}
          <div
            style={{
              fontSize: 24,
              color: OG_COLORS.textMuted,
              letterSpacing: 2,
              display: 'flex',
            }}
          >
            {`《${book}》`}
          </div>
        </div>

        {/* 5. Action advice box */}
        {advice ? (
          <div
            style={{
              background: 'rgba(184,146,74,0.10)',
              border: `1px solid ${OG_COLORS.borderGold}`,
              borderRadius: 12,
              paddingTop: 32,
              paddingBottom: 32,
              paddingLeft: 48,
              paddingRight: 48,
              maxWidth: 960,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              marginBottom: 48,
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: OG_COLORS.textGold,
                marginBottom: 16,
                display: 'flex',
              }}
            >
              🎯 今日行动建议
            </div>
            <div
              style={{
                fontSize: 24,
                color: OG_COLORS.textDark,
                lineHeight: 1.6,
                display: 'flex',
                flexWrap: 'wrap',
              }}
            >
              {advice}
            </div>
          </div>
        ) : null}

        <div style={{ flex: 1, display: 'flex' }} />

        {/* 6. Bottom watermark */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            fontSize: 24,
            color: OG_COLORS.textMuted,
            letterSpacing: 3,
            display: 'flex',
          }}
        >
          51yijing.com · 每日古典智慧 · 免费订阅
        </div>
      </div>
    );

    const response = new ImageResponse(jsx, {
      width: 1242,
      height: 1656,
      fonts: fontData
        ? [{ name: 'Noto Serif SC', data: fontData, style: 'normal', weight: 700 }]
        : [],
    });

    response.headers.set('Cache-Control', 'public, immutable, max-age=2592000');
    return response;
  } catch (err) {
    console.error('[daily-share-image] Failed to render image', err);

    // L3 fallback: minimal plain image
    const fallback = new ImageResponse(
      (
        <div
          style={{
            width: 1242,
            height: 1656,
            background: OG_COLORS.bg,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'serif',
          }}
        >
          <div style={{ fontSize: 28, color: OG_COLORS.textGold, display: 'flex' }}>
            ☯ 每日古典智慧
          </div>
          <div
            style={{
              fontSize: 60,
              color: OG_COLORS.textDark,
              marginTop: 48,
              textAlign: 'center',
              maxWidth: 900,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {quote}
          </div>
        </div>
      ),
      { width: 1242, height: 1656 }
    );
    fallback.headers.set('Cache-Control', 'public, immutable, max-age=2592000');
    return fallback;
  }
}
