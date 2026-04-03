/**
 * SEO constants and helpers
 */

export const SITE_NAME = '51yijing.com';
export const SITE_URL = 'https://51yijing.com';
export const SITE_TITLE_ZH = '易经在线占卜 | AI智能解读';
export const SITE_TITLE_EN = 'Free I Ching Online Divination — AI-Powered Readings';
export const SITE_TITLE_ZH_TW = '易經線上占卜 | AI智能解讀';
export const SITE_DESC_ZH = '在线易经占卜，AI智能解读卦象。三币古法摇卦，结合八字命理，给出专业解读建议。';
export const SITE_DESC_EN = 'Online I Ching divination with AI-powered interpretation. Traditional three-coin method combined with BaZi analysis for professional readings.';
export const SITE_DESC_ZH_TW = '線上易經占卜，AI智慧解讀卦象。三幣古法搖卦，結合八字命理，給出專業解讀建議。';

export function getLocalePrefix(locale: string): string {
  if (locale === 'zh') return '';
  return `/${locale}`;
}

export function getBaseUrl(locale: string): string {
  return `${SITE_URL}${getLocalePrefix(locale)}`;
}

export function getCanonicalUrl(locale: string, path: string = ''): string {
  return `${getBaseUrl(locale)}${path}`;
}

export function getAlternateLanguages(path: string = '') {
  return {
    'zh': `${SITE_URL}${path}`,
    'zh-TW': `${SITE_URL}/zh-TW${path}`,
    'en': `${SITE_URL}/en${path}`,
  };
}

export function getLocalizedText(locale: string, zh: string, en: string, zhTW?: string): string {
  if (locale === 'zh-TW') return zhTW || zh;
  if (locale === 'en') return en;
  return zh;
}
