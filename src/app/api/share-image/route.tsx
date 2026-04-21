/* eslint-disable react-hooks/error-boundaries */
import { ImageResponse } from 'next/og';
import { getHexagramByNumber } from '@/data/hexagrams';
import { loadNotoSerifSC } from '@/lib/og/load-font';
import { OG_COLORS, SHARE_BORDER } from '@/lib/og/constants';

export const runtime = 'edge';

// Truncate judgment to first 2 sentences
function truncateJudgment(text: string): string {
  // Match sentence endings: Chinese 。or English ./?/!
  const sentences = text.match(/[^。.!?！？]+[。.!?！？]?/g) ?? [];
  return sentences.slice(0, 2).join('').trim();
}

// Auto-scale English name font size
function enNameFontSize(name: string): number {
  if (name.length <= 20) return 40;
  if (name.length <= 30) return 32;
  return 26;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hexNum = parseInt(searchParams.get('hexagram') ?? '0', 10);
  const locale = searchParams.get('locale') ?? 'zh';

  if (hexNum < 1 || hexNum > 64) {
    return Response.json({ error: 'Invalid hexagram number' }, { status: 400 });
  }

  const hex = getHexagramByNumber(hexNum);
  if (!hex) {
    return Response.json({ error: 'Hexagram not found' }, { status: 400 });
  }

  const { number, nameZh, nameEn, symbol, judgmentZh, judgmentEn, nameZhTW, judgmentZhTW } = hex;

  const hexName = locale === 'zh-TW' ? (nameZhTW ?? nameZh) : locale === 'en' ? nameEn : nameZh;
  const judgment = truncateJudgment(
    locale === 'zh-TW' ? (judgmentZhTW ?? judgmentZh) : locale === 'en' ? judgmentEn : judgmentZh
  );
  const slogan = locale === 'en' ? 'Ask the ancients, know yourself' : '问古人，懂自己';

  const allText = `第${number}卦${hexName}${nameEn}${judgment}${slogan}51yijing.com`;

  // L2: font load — degrade gracefully
  let fontData: ArrayBuffer | null = null;
  try {
    fontData = await loadNotoSerifSC(allText);
    if (!fontData) {
      console.warn('[share-image] Font load returned null, rendering with serif fallback');
    }
  } catch (err) {
    console.warn('[share-image] Font load threw, rendering with serif fallback', err);
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
          justifyContent: 'center',
          position: 'relative',
          fontFamily: fontData ? 'Noto Serif SC' : 'serif',
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

        {/* 1. Badge: 第 N 卦 */}
        <div
          style={{
            background: OG_COLORS.badgeBg,
            color: OG_COLORS.badgeText,
            fontSize: 36,
            fontWeight: 700,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 32,
            paddingRight: 32,
            borderRadius: 6,
            marginBottom: 32,
            display: 'flex',
          }}
        >
          {`第 ${number} 卦`}
        </div>

        {/* 2. Hexagram name (large Chinese / English) */}
        <div
          style={{
            fontSize: 200,
            fontWeight: 700,
            color: OG_COLORS.textDark,
            lineHeight: 1,
            marginBottom: 16,
            display: 'flex',
          }}
        >
          {hexName}
        </div>

        {/* 3. English name */}
        <div
          style={{
            fontSize: enNameFontSize(nameEn),
            color: OG_COLORS.textGold,
            letterSpacing: 2,
            marginBottom: 40,
            display: 'flex',
          }}
        >
          {nameEn}
        </div>

        {/* 4. Divider */}
        <div
          style={{
            width: 300,
            height: 2,
            background: OG_COLORS.borderGold,
            marginBottom: 40,
            display: 'flex',
          }}
        />

        {/* 5. Six yao lines */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          {symbol.split('').map((bit, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: i < 5 ? 10 : 0,
                width: 180,
                height: 14,
              }}
            >
              {bit === '1' ? (
                // Yang: single solid bar
                <div
                  style={{
                    width: 180,
                    height: 14,
                    background: OG_COLORS.textDark,
                    display: 'flex',
                  }}
                />
              ) : (
                // Yin: two bars with gap
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 24,
                  }}
                >
                  <div
                    style={{
                      width: 78,
                      height: 14,
                      background: OG_COLORS.textDark,
                      display: 'flex',
                    }}
                  />
                  <div
                    style={{
                      width: 78,
                      height: 14,
                      background: OG_COLORS.textDark,
                      display: 'flex',
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 6. Divider */}
        <div
          style={{
            width: 300,
            height: 2,
            background: OG_COLORS.borderGold,
            marginBottom: 32,
            display: 'flex',
          }}
        />

        {/* 7. Judgment text */}
        <div
          style={{
            fontSize: 32,
            color: OG_COLORS.textMuted,
            maxWidth: 800,
            textAlign: 'center',
            lineHeight: 1.6,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {judgment}
        </div>

        {/* 8. Slogan */}
        <div
          style={{
            fontSize: 28,
            color: OG_COLORS.textGold,
            marginTop: 40,
            letterSpacing: 4,
            display: 'flex',
          }}
        >
          {slogan}
        </div>

        {/* 9. Watermark */}
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
          51yijing.com
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
    console.error('[share-image] Failed to render image', err);

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
          <div style={{ fontSize: 200, color: OG_COLORS.textDark, display: 'flex' }}>
            {nameZh}
          </div>
          <div style={{ fontSize: 40, color: OG_COLORS.textGold, marginTop: 32, display: 'flex' }}>
            {nameEn}
          </div>
        </div>
      ),
      { width: 1242, height: 1656 }
    );
    fallback.headers.set('Cache-Control', 'public, immutable, max-age=2592000');
    return fallback;
  }
}
