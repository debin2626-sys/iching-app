import { ImageResponse } from 'next/og';
import { SCENARIO_META, SCENARIO_IDS, type ScenarioId } from '@/data/scenarios';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Emoji map (SCENARIO_META uses Lucide icon names, scenarios array has emoji)
const SCENE_EMOJI: Record<ScenarioId, string> = {
  career: '💼',
  love: '❤️',
  wealth: '💰',
  study: '📚',
  health: '🌿',
};

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; scene: string }>;
}) {
  const { scene } = await params;
  const sceneId = scene as ScenarioId;
  const isValid = (SCENARIO_IDS as readonly string[]).includes(sceneId);
  const meta = isValid ? SCENARIO_META[sceneId] : null;

  const nameZh = meta?.nameZh ?? '易经占卜';
  const descZh = meta?.descZh ?? '传统易经智慧';
  const emoji = isValid ? SCENE_EMOJI[sceneId] : '☯️';

  let fontData: ArrayBuffer | null = null;
  try {
    const res = await fetch(
      'https://fonts.gstatic.com/s/notoserifsc/v22/H4c8BXePl9DZ0Xe7gG9cyOj7mm63SzZBEtERe7U.woff2'
    );
    fontData = await res.arrayBuffer();
  } catch {
    // fallback without custom font
  }

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

        {/* Emoji icon */}
        <div
          style={{
            fontSize: 80,
            marginBottom: 20,
            display: 'flex',
          }}
        >
          {emoji}
        </div>

        {/* Scenario name */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: '#2c2c2c',
            lineHeight: 1,
            marginBottom: 20,
            display: 'flex',
          }}
        >
          {nameZh}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 28,
            color: '#5a5a5a',
            letterSpacing: 3,
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
      ...size,
      fonts: fontData
        ? [{ name: 'Noto Serif SC', data: fontData, style: 'normal', weight: 700 }]
        : [],
    }
  );
}
