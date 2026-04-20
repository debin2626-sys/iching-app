// OG 图 & 分享图共享设计常量
export const OG_COLORS = {
  bg: '#f8f5f0',
  borderGold: '#c4b08a',
  badgeBg: '#b8924a',
  badgeText: '#f8f5f0',
  textDark: '#2c2c2c',
  textGold: '#b8924a',
  textMuted: '#5a5a5a',
} as const;

export const OG_BORDER = {
  outer: { inset: 24, width: 2 },
  inner: { inset: 32, width: 1, opacity: 0.5 },
  corner: { size: 16 },
} as const;

// 竖版图等比放大
export const SHARE_BORDER = {
  outer: { inset: 40, width: 3 },
  inner: { inset: 52, width: 1, opacity: 0.5 },
  corner: { size: 24 },
} as const;
