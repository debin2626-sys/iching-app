/**
 * Simplified ↔ Traditional Chinese conversion using opencc-js.
 * Lazy-loaded converter to avoid bundling the dictionary on every page.
 */
import * as OpenCC from 'opencc-js';

let s2tConverter: ((text: string) => string) | null = null;
let t2sConverter: ((text: string) => string) | null = null;

/**
 * Convert Simplified Chinese → Traditional Chinese (Taiwan standard).
 */
export function s2t(text: string): string {
  if (!s2tConverter) {
    s2tConverter = OpenCC.ConverterFactory(
      OpenCC.Locale.from.cn,
      OpenCC.Locale.to.tw
    );
  }
  return s2tConverter(text);
}

/**
 * Convert Traditional Chinese → Simplified Chinese.
 */
export function t2s(text: string): string {
  if (!t2sConverter) {
    t2sConverter = OpenCC.ConverterFactory(
      OpenCC.Locale.from.tw,
      OpenCC.Locale.to.cn
    );
  }
  return t2sConverter(text);
}

/**
 * Helper: return traditional text if locale is zh-TW, otherwise return original.
 */
export function localizeZh(text: string, locale: string): string {
  if (locale === 'zh-TW') return s2t(text);
  return text;
}
