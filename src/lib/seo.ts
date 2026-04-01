/**
 * SEO constants and helpers
 */

export const SITE_NAME = '51yijing.com';
export const SITE_URL = 'https://51yijing.com';
export const SITE_TITLE_ZH = '易经在线占卜 | AI智能解读';
export const SITE_TITLE_EN = 'I Ching Online Divination | AI Interpretation';
export const SITE_DESC_ZH = '在线易经占卜，AI智能解读卦象。三币古法摇卦，结合八字命理，给出专业解读建议。';
export const SITE_DESC_EN = 'Online I Ching divination with AI-powered interpretation. Traditional three-coin method combined with BaZi analysis for professional readings.';

export function getBaseUrl(locale: string): string {
  return locale === 'zh' ? SITE_URL : `${SITE_URL}/en`;
}

export function getCanonicalUrl(locale: string, path: string = ''): string {
  const base = locale === 'zh' ? SITE_URL : `${SITE_URL}/en`;
  return `${base}${path}`;
}
