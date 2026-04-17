# 51yijing.com 优化路线图

## S 级 — 留存转化（已完成 ✅）
- [x] S1-1 卦象详情页场景化 CTA
- [x] S1-2 相关问题模块（People Also Ask）
- [x] S1-3 底部场景入口卡片升级
- [x] S1-4 Organization schema logo 修复

## P1 — SEO 基建 + 体验基础
- [x] P1-1 首页减重（首页精简 + framer-motion 替换）`4c2369a`
- [x] P1-2 Meta 优化（hexagram description 场景关键词升级 + 卦详情页 title 修复）`c36d64a` `0e5109a`
- [x] P1-3 OG 图 — 静态 og-image.png 已加 `95d057a`
  - [ ] 动态 OG 图生成（per-page 独立 OG 图）— 未做
- [x] P1-4 导航增强（面包屑、footer links、guide layout）`1170c25`
- [x] P1-5 新手入门内容链（3 篇指南文章）`33b37bc`

## P2 — 性能 + 一致性
- [x] P2-1 字体优化（Noto Serif SC 瘦身、LXGW WenKai CSP、Safari ITP blocking load 修复）`b249cb9` `832358d` `fb68cbb`
- [~] P2-2 缓存策略 — 部分完成
  - [x] HeroSection Suspense streaming + getTotalCount 缓存 `147b96e`
  - [x] AI 解读缓存 `bcfcf1c`
  - [x] SSG 改进 `8960f94`
  - [ ] 静态资源 Cache-Control 头系统性配置 — 未做
- [x] P2-3 CSS 统一（@layer base 修复 Tailwind v4 cascade、unlayered CSS 清理、CSS bundle 瘦身）`69a98f4` `0e85bf6` `b249cb9`
- [x] P2-4 Core Web Vitals 调优（browserslist polyfill 裁剪、prefetch 优化、性能调优）`350d98c` `08632e7` `ad8f89a`

## P3 — 产品 + 商业化（规划中）
- [ ] P3-1 微信分享适配
- [ ] P3-2 国内支付接入
- [ ] P3-3 留存邮件/通知系统
