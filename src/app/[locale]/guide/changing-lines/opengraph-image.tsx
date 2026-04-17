import { OG_SIZE, renderGuideOG } from '@/lib/og/guide-og';

export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderGuideOG('changing-lines');
}
