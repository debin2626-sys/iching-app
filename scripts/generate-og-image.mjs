/**
 * Generate OG image (1200x630) with Chinese ink-wash style
 * Uses sharp + SVG text overlay with system Noto Serif CJK SC fonts
 */
import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(__dirname, '..', 'public', 'og-image.png');

const W = 1200;
const H = 630;

// Taiji (yin-yang) SVG symbol
const taiji = (cx, cy, r, opacity = 0.08) => `
  <g transform="translate(${cx},${cy})" opacity="${opacity}">
    <circle r="${r}" fill="#2c2c2c"/>
    <path d="M 0,${-r} A ${r/2},${r/2} 0 0,1 0,0 A ${r/2},${r/2} 0 0,0 0,${r} A ${r},${r} 0 0,1 0,${-r}" fill="#f8f5f0"/>
    <circle cy="${-r/2}" r="${r/5}" fill="#2c2c2c"/>
    <circle cy="${r/2}" r="${r/5}" fill="#f8f5f0"/>
  </g>
`;

// Trigram lines (decorative)
const trigram = (x, y, lines, opacity = 0.06) => {
  // lines: array of 0 (broken) or 1 (solid), bottom to top
  const linesSvg = lines.map((solid, i) => {
    const ly = y - i * 18;
    if (solid) {
      return `<line x1="${x - 30}" y1="${ly}" x2="${x + 30}" y2="${ly}" stroke="#2c2c2c" stroke-width="4" opacity="${opacity}"/>`;
    }
    return `
      <line x1="${x - 30}" y1="${ly}" x2="${x - 5}" y2="${ly}" stroke="#2c2c2c" stroke-width="4" opacity="${opacity}"/>
      <line x1="${x + 5}" y1="${ly}" x2="${x + 30}" y2="${ly}" stroke="#2c2c2c" stroke-width="4" opacity="${opacity}"/>
    `;
  }).join('');
  return linesSvg;
};

// Some classic trigrams for decoration
const qian = [1, 1, 1]; // ☰ heaven
const kun = [0, 0, 0];  // ☷ earth
const kan = [0, 1, 0];  // ☵ water
const li = [1, 0, 1];   // ☲ fire
const xun = [1, 1, 0];  // ☴ wind
const zhen = [0, 0, 1]; // ☳ thunder
const gen = [1, 0, 0];  // ☶ mountain
const dui = [0, 1, 1];  // ☱ lake

const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Subtle paper texture via noise filter -->
    <filter id="paper">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" result="noise"/>
      <feColorMatrix type="saturate" values="0" in="noise" result="gray"/>
      <feBlend in="SourceGraphic" in2="gray" mode="multiply"/>
    </filter>
    <!-- Soft vignette -->
    <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.06)"/>
    </radialGradient>
    <!-- Top/bottom subtle border gradient -->
    <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#d4c5a9" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#d4c5a9" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#d4c5a9" stop-opacity="0"/>
      <stop offset="100%" stop-color="#d4c5a9" stop-opacity="0.3"/>
    </linearGradient>
  </defs>

  <!-- Base background: warm paper color -->
  <rect width="${W}" height="${H}" fill="#f8f5f0"/>

  <!-- Paper texture overlay -->
  <rect width="${W}" height="${H}" fill="#f5f0e8" opacity="0.5" filter="url(#paper)"/>

  <!-- Vignette -->
  <rect width="${W}" height="${H}" fill="url(#vignette)"/>

  <!-- Decorative top/bottom bands -->
  <rect x="0" y="0" width="${W}" height="8" fill="url(#topFade)"/>
  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="url(#bottomFade)"/>

  <!-- Thin decorative border -->
  <rect x="40" y="30" width="${W - 80}" height="${H - 60}" rx="2" ry="2"
        fill="none" stroke="#c4b08a" stroke-width="0.8" opacity="0.4"/>

  <!-- Taiji symbol (subtle, behind text) -->
  ${taiji(W / 2, H / 2 - 20, 120, 0.045)}

  <!-- Decorative trigrams scattered around edges -->
  ${trigram(100, 180, qian, 0.07)}
  ${trigram(100, 280, kun, 0.07)}
  ${trigram(100, 380, kan, 0.07)}
  ${trigram(100, 480, li, 0.07)}

  ${trigram(W - 100, 180, xun, 0.07)}
  ${trigram(W - 100, 280, zhen, 0.07)}
  ${trigram(W - 100, 380, gen, 0.07)}
  ${trigram(W - 100, 480, dui, 0.07)}

  <!-- Horizontal decorative line above title -->
  <line x1="420" y1="210" x2="780" y2="210" stroke="#c4b08a" stroke-width="1" opacity="0.5"/>

  <!-- Main title -->
  <text x="${W / 2}" y="300" text-anchor="middle"
        font-family="'Noto Serif CJK SC', 'Noto Serif SC', serif"
        font-size="72" font-weight="bold" fill="#2c2c2c" letter-spacing="12">
    易经在线占卜
  </text>

  <!-- Horizontal decorative line below title -->
  <line x1="420" y1="330" x2="780" y2="330" stroke="#c4b08a" stroke-width="1" opacity="0.5"/>

  <!-- Subtitle -->
  <text x="${W / 2}" y="390" text-anchor="middle"
        font-family="'Noto Sans CJK SC', 'Noto Sans SC', sans-serif"
        font-size="28" fill="#5a5a5a" letter-spacing="4">
    AI智能解读 · 三币古法摇卦
  </text>

  <!-- Small decorative diamond -->
  <polygon points="${W/2},420 ${W/2+6},426 ${W/2},432 ${W/2-6},426"
           fill="#c4b08a" opacity="0.4"/>

  <!-- Bottom domain -->
  <text x="${W / 2}" y="${H - 50}" text-anchor="middle"
        font-family="'Noto Sans CJK SC', 'Noto Sans SC', sans-serif"
        font-size="22" fill="#8a8070" letter-spacing="3">
    51yijing.com
  </text>
</svg>
`;

async function main() {
  const buf = await sharp(Buffer.from(svg))
    .resize(W, H)
    .png({ compressionLevel: 9, quality: 85 })
    .toBuffer();

  await sharp(buf).toFile(OUTPUT);

  const stats = await import('fs').then(fs => fs.statSync(OUTPUT));
  console.log(`✅ Generated: ${OUTPUT}`);
  console.log(`   Size: ${(stats.size / 1024).toFixed(1)} KB`);
  console.log(`   Dimensions: ${W}x${H}`);
}

main().catch(err => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
