# 51yijing.com 全站审计报告

> 审计时间：2026-04-15
> 审计角色：产品、研发、运维、UX/UI（小优）、SEO（小增）、商业化

---

## 🚨 P0 — 立即修复

### 1. PM2 进程 errored，已崩溃重启 530 次
- **角色：** 运维
- **问题：** PM2 以 fork 模式运行，端口 3000 被另一个 next-server 进程占用，导致反复崩溃
- **修复：** 杀掉游离进程 → `pm2 restart iching-app` → `pm2 save`

### 2. 付费流程断裂：4 个套餐跳同一个 Ko-fi 链接
- **角色：** 产品
- **问题：** `getKofiLink()` 忽略 tier 参数，四个套餐跳转完全相同；Webhook 激活依赖邮箱匹配，无兜底
- **涉及文件：** `src/app/[locale]/pricing/page.tsx`, `src/app/api/webhooks/kofi/route.ts`
- **修复：** Ko-fi 用 `?amount=` 区分套餐；增加手动激活入口；Webhook 失败兜底通知

### 3. 每日限额弹窗直接跳 Ko-fi 站外
- **角色：** 产品 + 商业化
- **问题：** 用户付费意愿最高时被送出站外，且没有"免费注册获得更多次数"的中间路径
- **涉及文件：** `src/components/divination/DailyLimitBanner.tsx`
- **修复：** 未登录用户弹窗主按钮改为"免费注册，每天多 2 次"；已登录用户才展示"升级 Pro"

### 4. 敏感密钥硬编码 + .env 权限过宽
- **角色：** 运维
- **问题：** `ecosystem.config.cjs` 明文存储 API Key；`.env*` 文件权限 644
- **修复：** 密钥迁移到 `.env.production` + `chmod 600`；确认 `.gitignore` 覆盖

---

## 🔴 P1 — 本周处理

### 5. Nginx 缺安全响应头
- **角色：** 运维
- **缺失：** X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy

### 6. 无 Rate Limiting
- **角色：** 运维
- **问题：** API 接口完全暴露，无 `limit_req_zone`
- **修复：** API 10r/s, 通用 30r/s

### 7. sitemap.xml 缺 hreflang 关联
- **角色：** SEO
- **问题：** 三语言 URL 各自独立，Google 无法识别语言对应关系
- **涉及文件：** `src/app/sitemap.ts`
- **修复：** 改用自定义 XML 路由，添加 `<xhtml:link rel="alternate">` 标签

### 8. scenarios/about 页面 canonical URL 拼接错误
- **角色：** SEO
- **问题：** `locale=zh` 时生成 `/zh/scenarios`，但实际 zh 路由无 `/zh` 前缀
- **涉及文件：** `src/app/[locale]/scenarios/page.tsx`, `src/app/[locale]/about/page.tsx`
- **修复：** 统一使用 `getBaseUrl(locale)` 拼接

### 9. auth 页面缺 noindex
- **角色：** SEO
- **涉及文件：** `src/app/[locale]/auth/page.tsx`

### 10. 冥想页 30 秒强制等待
- **角色：** 产品
- **问题：** 跳过按钮需等 3 秒倒计时，移动端透明度仅 0.5
- **涉及文件：** `src/app/[locale]/divine/meditation/MeditationPageContent.tsx`
- **修复：** 老用户（≥3 次占卜）允许立即跳过；设置页增加偏好选项

### 11. 匿名用户结果页自动弹登录 Modal
- **角色：** 产品
- **问题：** 打断沉浸感；"继续匿名体验"语义模糊
- **涉及文件：** `src/components/result/ResultContent.tsx`
- **修复：** 改为用户主动点击"保存"时触发；文案改为"暂不登录（记录已保存在本地）"

### 12. 无障碍严重不足
- **角色：** UX
- **问题：** 下拉菜单缺 aria 属性、键盘导航覆盖率极低、`focus-visible` 仅 3 个文件
- **涉及文件：** `LanguageSwitcher`, `ThemeToggle`, 底部 Tab Bar

### 13. alert() 原生弹窗
- **角色：** UX
- **问题：** `ResultContent.tsx` 第 614 行用 `alert()` 提示复制成功，与国风设计割裂
- **修复：** 替换为已有的 `toast()` 系统

### 14. AI 解读区移动端滚动陷阱
- **角色：** UX
- **问题：** `max-h-[60vh] overflow-y-auto` 在移动端约 400px，页面滚动和区域滚动冲突
- **涉及文件：** `AISection` 组件

---

## 🟠 P2 — 近期优化

### 15. PM2 fork 模式改 cluster
- **角色：** 运维
- **问题：** 2 核 CPU 只跑单进程，无零停机重启
- **修复：** `exec_mode: "cluster"`, `instances: 2`

### 16. 静态资源无缓存策略
- **角色：** 运维
- **修复：** `/_next/static/` 加 `Cache-Control: public, max-age=31536000, immutable`

### 17. OG 图片所有页面共用一张
- **角色：** SEO
- **修复：** 卦象详情页用 Next.js `ImageResponse` 动态生成含卦象符号的 OG 图

### 18. Article schema 缺 datePublished
- **角色：** SEO
- **涉及文件：** `src/components/seo/JsonLd.tsx`

### 19. Organization schema logo 指向不存在的 icon.png
- **角色：** SEO
- **涉及文件：** `src/components/seo/JsonLd.tsx` 第 58 行

### 20. 外部字体 LXGW WenKai 阻塞渲染
- **角色：** SEO + UX
- **问题：** 阻塞渲染的外部 CSS，字体约 10MB+，影响 LCP
- **涉及文件：** `src/app/layout.tsx` 第 83-86 行
- **修复：** 改为 `preload` + `font-display: swap`，或自托管字体子集

### 21. CSS 变量双轨制
- **角色：** UX
- **问题：** 旧变量 `--gold`/`--bg-card` 与新变量 `--color-gold`/`--theme-bg-card` 混用
- **涉及文件：** `globals.css`, `Toast.tsx`, `ResultContent.tsx`

### 22. 按钮圆角四种规格不统一
- **角色：** UX
- **问题：** `rounded-[4px]` / `rounded-xl` / `rounded-lg` / `rounded-full` 混用

### 23. 英文模式字体问题
- **角色：** UX
- **问题：** LXGW WenKai 为中文设计，英文字形偏细字距偏宽
- **修复：** 英文模式 fallback 到 Georgia 或 Playfair Display

### 24. 首页与 /divine 功能重叠
- **角色：** 产品
- **修复：** 首页作营销落地页，/divine 作纯操作页；或首页简化为场景选择 + "开始占卜"按钮

### 25. 缺微信分享
- **角色：** 产品 + 商业化
- **修复：** 增加"生成分享图片"功能（卦象+问题+核心解读渲染为图片）

### 26. 国内用户缺微信支付/支付宝
- **角色：** 商业化
- **问题：** 只有 Ko-fi，对国内用户极不友好

### 27. 接入 Resend 做留存邮件
- **角色：** 商业化
- **建议：** 注册后第 3 天、每周一、次数用尽时各发一封

### 28. 缺 purchase_complete 埋点
- **角色：** 商业化
- **问题：** 付费成功后无法追踪 ROI，数据无闭环

---

## 🟡 P3 — 持续改进

### 29. 无专业监控告警
- **角色：** 运维
- **建议：** 接入 UptimeRobot 或 BetterUptime

### 30. 无数据库备份策略
- **角色：** 运维
- **数据库：** Neon 托管 PG，需确认自动备份 + 添加每日 pg_dump

### 31. 磁盘 74%，需设告警阈值
- **角色：** 运维

### 32. 卦象详情页间缺内链
- **角色：** SEO
- **修复：** 底部添加对卦/错卦/综卦链接

### 33. robots.txt 未屏蔽带 locale 前缀的 /auth
- **角色：** SEO
- **修复：** 添加 `/zh/auth/`, `/en/auth/`, `/zh-TW/auth/`

### 34. 404 页面未国际化
- **角色：** UX
- **问题：** 中文文案硬编码，英文用户看到中文错误页

### 35. 打字机动画缺"跳过"选项
- **角色：** UX

### 36. 收藏功能只能收藏卦象，不能收藏占卜结果
- **角色：** 产品

### 37. 设置页"通知"功能空承诺
- **角色：** 产品
- **修复：** 短期移除或改为"敬请期待"

### 38. 64 卦 SEO 内容扩充
- **角色：** 商业化
- **建议：** 每卦一篇 2000 字深度解读文章

### 39. Stripe 集成（英文市场）
- **角色：** 商业化

---

## 转化漏斗分析

```
访问首页
  ↓ [流失点1] 首页内容过长，CTA 被稀释
选择场景/输入问题
  ↓ [流失点2] 冥想页 30 秒强制等待
摇卦（6次投掷）
  ↓ [流失点3] 操作步骤多，移动端体验待验证
查看 AI 解读
  ↓ [流失点4] 匿名用户弹出登录 Modal
保存/分享结果
  ↓ [流失点5] 限额触发后升级路径跳出站外
付费转化         ← 当前最薄弱环节
```

## 竞品参考

| 竞品 | 模式 | 定价 | 差异化 |
|------|------|------|--------|
| AI 命理 App（星盘/测测） | 订阅制 | ¥18-68/月 | 主打星座/塔罗 |
| iChing.com | 免费 | 无 | 无 AI，纯静态 |
| Labyrinthos（塔罗） | 订阅制 | $9.99/月 | 200万用户 |
| Keen.com | 按分钟 | 高客单价 | 真人占卜 |

**结论：** 英文 AI 易经市场几乎是蓝海。
