# 结果页 UX/UI 调研报告

> 调研时间：2026-04-20  
> 项目：iching-app（Next.js 16 + Tailwind v4）  
> 目标：为分享功能 UX/UI 方案提供基础信息

---

## 1. ResultContent.tsx 组件结构

### 文件位置
`src/components/result/ResultContent.tsx`（930 行）

### 组件层级

```
ResultContent（默认导出，Suspense 包裹）
└── ResultInner（主体逻辑）
    ├── PageLayout（maxWidth="max-w-[800px]"，含 NavBar）
    │   ├── DailyLimitBanner（每日限制模态，fixed 定位）
    │   ├── Breadcrumb（px-6 pt-4）
    │   └── div.py-8.space-y-8.px-6
    │       ├── CloudPattern（云纹装饰，position="top"）
    │       │
    │       ├── [区块1] motion.div — 卦象头部（text-center）
    │       │   ├── 卦号标签（text-sm tracking-[0.3em] text-gold/30）
    │       │   ├── h1 卦名（font-title text-4xl text-gold）
    │       │   ├── 英文名（text-base text-muted tracking-widest）
    │       │   ├── 上下卦（text-base text-secondary）
    │       │   ├── 变爻提示（text-vermilion/80 text-sm）
    │       │   ├── 之卦信息（text-xs text-muted）
    │       │   ├── 问题摘要（text-xs text-gold/40 truncate）
    │       │   └── divider-gold（w-24 mx-auto）
    │       │
    │       ├── [区块2] motion.div — 六爻图（flex justify-center）
    │       │   └── Card(variant="elevated", padding="lg")
    │       │       └── HexagramReveal（animated）
    │       │
    │       ├── [区块3] BaziCard（条件渲染，birthInfo 存在时）
    │       │
    │       ├── [区块4] motion.div — 经典解读区
    │       │   └── Card(variant="elevated", padding="lg")
    │       │       ├── h3 📜 经典解读
    │       │       ├── 卦辞（border-l-3 border-gold/50 pl-3）
    │       │       ├── 象辞（同上）
    │       │       ├── 综合解读（text-secondary）
    │       │       └── 六爻爻辞列表（Card variant="default" padding="sm"）
    │       │
    │       ├── [区块5] motion.div — AI 解读区（条件渲染）
    │       │   └── AISection
    │       │       └── Card(variant="default", padding="lg")
    │       │           ├── h3 ✍️ AI 解读
    │       │           ├── DepthSelector（3 个深度按钮）
    │       │           └── ReactMarkdown 内容（max-h-[60vh] overflow-y-auto）
    │       │
    │       ├── [区块6] motion.div — 底部操作栏 ⭐
    │       │   └── div.flex.flex-wrap.items-center.justify-center.gap-4.pt-6
    │       │       ├── Link "再次占卜"（btn-divine w-[180px] h-12）
    │       │       ├── Link "返回首页"（btn-divine w-[180px] h-12）
    │       │       ├── button "保存记录"（btn-divine w-[180px] h-12）
    │       │       └── button "分享"（btn-divine w-[180px] h-12）← 当前分享入口
    │       │
    │       └── [浮层] 登录提示模态框（showLoginModal 控制）
    │           └── fixed inset-0 bg-black/70 backdrop-blur-sm z-50
    │               └── motion.div.card-mystic.rounded-2xl.max-w-md.p-8
    │                   ├── Google 登录按钮
    │                   ├── 邮箱登录按钮（btn-divine）
    │                   └── 继续匿名按钮
```

### 布局关键参数
- 页面最大宽度：`800px`（通过 PageLayout maxWidth 传入）
- 内容区 padding：`px-6`（左右各 24px）
- 区块间距：`space-y-8`（32px）
- 底部操作栏：`flex-wrap justify-center gap-4`，每个按钮 `w-[180px] h-12`

### 当前分享实现（ResultContent 内）
```tsx
// handleShare 函数（第 619-632 行）
const handleShare = async () => {
  const text = `${t("shareTitle")} — ${hexName}...`;
  if (navigator.share) {
    await navigator.share({ title, text, url: window.location.href });
  } else {
    await navigator.clipboard.writeText(text);
    alert(t("copiedToClipboard")); // ← 用 alert，非 toast
  }
};
```

---

## 2. ShareButtons.tsx（独立组件）

### 文件位置
`src/components/result/ShareButtons.tsx`（106 行）

> ⚠️ 注意：此组件存在但**未被 ResultContent.tsx 引用**，是独立实现。

### 功能
- 复制链接（clipboard API + execCommand 降级）
- 原生分享（navigator.share，移动端）
- 微博分享（window.open 新窗口）
- **无微信分享**

### 样式
```tsx
const btnBase =
  "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-title tracking-wider transition-all duration-300 border border-[var(--color-gold)]/40 bg-transparent hover:border-[var(--color-gold)] hover:shadow-[0_0_12px_rgba(184,146,74,0.25)]";
// 颜色：color: "var(--color-gold)"
// 布局：flex flex-wrap items-center justify-center gap-3
```

---

## 3. OG 图设计语言

### 文件位置
- `src/app/[locale]/hexagrams/[id]/opengraph-image.tsx`
- `src/app/[locale]/scenarios/[scene]/opengraph-image.tsx`

### 尺寸
`1200 × 630 px`

### 设计语言（两个文件一致）

| 元素 | 样式 |
|------|------|
| 背景色 | `#f8f5f0`（宣纸米白） |
| 外边框 | `inset: 24px`，`2px solid #c4b08a` |
| 内边框 | `inset: 32px`，`1px solid #c4b08a`，`opacity: 0.5` |
| 四角装饰 | `16×16px` 实心方块，`background: #c4b08a`，位于四角 `20px` 处 |
| 主标题 | `fontSize: 160`（卦名）/ `96`（场景名），`color: #2c2c2c`，`fontWeight: 700` |
| 副标题 | `fontSize: 32`，`color: #5a5a5a`，`letterSpacing: 4` |
| 英文/金色文字 | `fontSize: 26`，`color: #b8924a`（金色） |
| 卦号徽章 | `background: #b8924a`，`color: #f8f5f0`，`fontSize: 22`，`borderRadius: 4` |
| 分割线 | `width: 200px`，`height: 1px`，`background: #c4b08a` |
| 域名水印 | `bottom: 52px`，`fontSize: 20`，`color: #5a5a5a`，`letterSpacing: 2` |
| 字体 | Noto Serif SC（动态子集加载），降级 serif |

### 颜色总结
```
背景：#f8f5f0
边框/装饰：#c4b08a（浅金）
主文字：#2c2c2c（深墨）
次文字：#5a5a5a（灰墨）
金色强调：#b8924a（与 --color-gold 一致）
```

---

## 4. Toast 组件

### 文件位置
- `src/components/ui/Toast.tsx`（渲染层）
- `src/components/ui/useToast.tsx`（状态管理）

### 架构
```
ToastProvider（Context）
├── useToast() → { toast(message, type) }  ← 触发
└── useToastState() → { toasts, dismiss }  ← Toast.tsx 消费
```

### 渲染位置
```tsx
// fixed top-4 left-1/2 -translate-x-1/2 z-[9999]
// 顶部居中，最高层级
```

### 动画
```tsx
initial={{ opacity: 0, y: -40, scale: 0.95 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={{ opacity: 0, y: -20, scale: 0.95 }}
transition={{ duration: 0.3, ease: "easeOut" }}
```

### 样式（按类型）
```tsx
success: "border-green-500/40 bg-green-950/60 text-green-300"
error:   "border-red-500/40 bg-red-950/60 text-red-300"
info:    "border-[var(--gold)]/40 bg-[var(--bg-card)] text-[var(--gold)]"
warning: "border-orange-500/40 bg-orange-950/60 text-orange-300"
// 公共：rounded-[8px] border backdrop-blur-[8px] shadow-[0_4px_24px_rgba(0,0,0,0.4)]
// 尺寸：min-w-[260px] max-w-[420px] px-5 py-3 text-sm
```

### 自动消失
3000ms 后自动 dismiss，点击也可手动关闭。

---

## 5. 全局设计 Token

### 颜色系统（`globals.css` @theme + :root）

```css
/* 主色 */
--color-gold: #b8924a          /* 金色主色 */
--color-gold-bright: #d4aa6a   /* 金色高亮 */
--color-gold-dim: #8a6a30      /* 金色暗调 */
--color-vermilion: #c0392b     /* 朱砂红 */
--color-vermilion-bright: #e05a45
--color-vermilion-dark: #8b2500

/* 背景 */
--color-bg: #f7f3eb            /* 宣纸主背景 */
--color-bg-card: #f0ead8       /* 卡片背景 */
--color-bg-elevated: #e8dfc8   /* 浮起卡片 */
--color-bg-sunken: #faf7f2     /* 凹陷区域 */

/* 文字 */
--color-text-primary: #1a1208
--color-text-secondary: #4a3f2f
--color-text-muted: #8a7a65

/* 边框 */
--color-border: rgba(26,18,8,0.12)
--color-border-hover: rgba(26,18,8,0.25)

/* 语义色 */
--color-auspicious: #5a8a6a    /* 吉 */
--color-inauspicious: #3d4f7a  /* 凶 */
```

### 暗色主题（`[data-theme="dark"]`）
```css
--theme-bg: #1c1710
--theme-bg-card: #252018
--theme-text-primary: #f0e8d5
--theme-border: rgba(184,146,74,0.15)
```

### 间距系统
```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px   /* ⚠️ 会覆盖 Tailwind max-w-xl，项目用 max-w-[36rem] 等任意值 */
--spacing-2xl: 48px
--spacing-3xl: 64px
```

### 字体
```css
--font-display: 'LXGW WenKai Screen', 'LXGW WenKai', Noto Serif SC, STKaiti, serif
--font-body: 'LXGW WenKai Screen', 'LXGW WenKai', Noto Serif SC, system-ui, sans-serif
```

### 关键 CSS 工具类
```css
.btn-divine          /* 金色边框半透明按钮，hover 发光 */
.card-mystic         /* 毛玻璃卡片，backdrop-blur-10px */
.card-glow           /* Aceternity 风格渐变边框光效 */
.divider-gold        /* 金色渐变分割线 */
.text-gold-gradient  /* 金色渐变文字 */
.text-gold-glow      /* 金色发光文字 */
.font-title          /* 使用 --font-display */
.skeleton-shimmer    /* 骨架屏闪光动画 */
```

### Card 组件变体
```tsx
variant="default"     // bg-card + border，内阴影
variant="elevated"    // 同上 + 外阴影 0_8px_32px
variant="interactive" // 同上 + hover 浮起 + 金色边框
padding: "sm"=p-4, "md"=p-6, "lg"=p-8
border-radius: 12px
```

### Button 组件变体
```tsx
variant="primary"   // bg-vermilion + border-gold，hover 变金色
variant="secondary" // border-gold + text-gold，hover 半透明金色背景
variant="ghost"     // 透明，hover text-gold
size: sm/md/lg → min-h-[48px] min-w-[200px]
```

---

## 6. 微信引导浮层现状

### 结论：**项目中无微信相关组件**

搜索 `wechat`、`WeChat`、`微信` 关键词，全项目无任何匹配。

### 现有最接近的参考：登录提示模态框（ResultContent.tsx 第 864-912 行）

```tsx
// 结构模式可复用
<div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="card-mystic rounded-2xl w-full max-w-md p-8"
  >
    {/* 内容 */}
  </motion.div>
</div>
```

### 另一参考：DailyLimitBanner（`src/components/divination/DailyLimitBanner.tsx`）

```tsx
// 更完整的模态实现，含 AnimatePresence
<AnimatePresence>
  {show && (
    <>
      {/* 遮罩 */}
      <motion.div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      {/* 内容 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
        <motion.div
          className="relative w-full max-w-md rounded-2xl border border-amber-700/40 p-6 shadow-2xl pointer-events-auto"
          style={{ background: "var(--theme-dropdown-bg)" }}
        >
          {/* X 关闭按钮 */}
          {/* 标题 + 说明 */}
          {/* 操作按钮 */}
        </motion.div>
      </div>
    </>
  )}
</AnimatePresence>
```

---

## 7. 关键发现与设计建议

### 现状问题
1. **分享按钮割裂**：`ShareButtons.tsx` 存在但未被结果页使用，结果页用的是内联 `handleShare`（用 `alert` 而非 toast）
2. **无微信分享**：ShareButtons 只有复制链接、原生分享、微博，缺少微信
3. **微信环境无法直接分享**：微信内置浏览器屏蔽 `navigator.share`，需要引导用户点击右上角菜单

### 微信引导浮层设计参考点
- 遮罩：`bg-black/60 backdrop-blur-sm`（参考 DailyLimitBanner）
- 容器：`card-mystic rounded-2xl`（参考登录模态）
- 动画：`AnimatePresence` + `scale: 0.9 → 1`（项目统一模式）
- 箭头指向右上角：需要自定义 SVG 或 CSS 箭头
- z-index：`z-50`（与其他模态一致）

### 分享图片（OG 图）设计语言可复用
OG 图的设计语言（宣纸背景 + 双层边框 + 四角方块装饰 + 金色强调）可以直接用于分享卡片图片生成，颜色与全局 token 完全一致。
