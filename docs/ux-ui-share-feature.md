# UX/UI 方案：「分享这一卦」

> 版本：v2 — 2026-04-20
> v1→v2 变更：响应式修复、分享文案防截断、navigator.share 纯特性检测、去 emoji、微信浮层箭头/关闭逻辑修正、超时缩短、英文名自适应字号、删除前确认、i18n 引号修正、QR 占位清理、降级日志级别修正、下载文件名拼音化、桌面端排版措辞修正、OG 卦名按 locale 取繁简
> 对齐文档：`docs/prd/share-and-og.md` (PRD v3)
> 调研基础：`docs/ux-research-result-page.md`

---

## 一、设计原则

1. **零割裂**：分享入口融入现有底部操作栏，不新增浮动按钮，不破坏阅读流
2. **古典克制**：延续宣纸+金色设计语言，分享图片本身就是品牌资产
3. **最小摩擦**：环境自动检测，一次点击完成分享/保存，不让用户做选择题
4. **钩子逻辑**：图片只给卦名+金句，看到的人必须回站才能看解读

---

## 二、底部操作栏改造

### 现状（4 按钮）

```
[ 再次占卜 ] [ 返回首页 ] [ 保存记录 ] [ 分享 ]
```

所有按钮 `btn-divine w-[180px] h-12`，`flex-wrap justify-center gap-4`。

### 改造后（5 按钮）

```
[ 再次占卜 ] [ 返回首页 ] [ 保存记录 ] [ 分享这一卦 ] [ 保存卦图 ]
```

| 按钮 | 文案 | 图标 | 行为 |
|------|------|------|------|
| 分享这一卦 | `shareHexagram` | 无 | 环境检测 → 分享链接 |
| 保存卦图 | `saveHexagramImage` | 无 | 请求服务端生成竖版图 → 触发下载 |

所有按钮纯文字，不加 emoji/icon 前缀，与现有 3 个按钮风格保持一致（修正 #4：古典克制原则）。

### 按钮样式

沿用现有 `btn-divine` 基础样式，宽度改为弹性适配小屏（修正 #1）：

```tsx
className="btn-divine min-w-[140px] max-w-[180px] flex-1 h-12 text-base font-title tracking-wider rounded-lg inline-flex items-center justify-center"
```

### 响应式行为

5 个按钮在 `flex-wrap` 下，容器加 `w-full`：
- 桌面端（≥800px）：一行 4 个，第 5 个换行居中（180×4 + 3×16gap = 768px < 800px；5 个需 964px 放不下）
- 移动端 375px（iPhone SE）：`min-w-[140px] flex-1` 保证每行 2 个（140×2 + 16gap = 296 < 375），第 5 个单独居中
- 移动端 360px（iPhone 12 mini）：同上，2 列自然换行

不需要 media query，`min-w-[140px] max-w-[180px] flex-1` + `flex-wrap justify-center gap-4` 自动适配所有宽度。

---

## 三、「分享这一卦」交互流程

### 3.1 环境检测逻辑（优先级从高到低）

```
用户点击「分享这一卦」
  │
  ├─ 微信内置浏览器？ → 显示微信引导浮层
  │
  ├─ navigator.share 可用？ → 调用系统分享面板
  │   （纯特性检测，不做 UA mobile/desktop 判断。
  │    覆盖：iOS Safari、Android Chrome、Windows 11 Edge/Chrome、macOS Safari 14+）
  │   （修正 #3：桌面端支持 Web Share API 的浏览器也走系统分享）
  │
  └─ 其他（不支持 navigator.share 的浏览器）→ 复制链接到剪贴板 → toast「链接已复制」
```

### 3.2 分享链接格式

```
https://51yijing.com/{locale}/result?hexagram={number}&utm_source=share&utm_medium=hexagram&utm_content={卦名拼音}
```

注意：
- 只带 `hexagram` 参数，不带 `question`（PRD 决策）
- UTM 参数必须附加（v1 必须，非后续扩展）
- `utm_content` 用卦名拼音（如 `qian`、`kun`），需要一个 64 卦拼音映射

### 3.3 分享文案

分享文案需防平台截断（修正 #2）。卦辞全文长度不可控（最长可达 80+ 字），统一用品牌 slogan：

```
zh:   「{卦名}」— 问古人，懂自己 | 51yijing.com
zh-TW: 「{卦名}」— 問古人，懂自己 | 51yijing.com
en:   "{hexNameEn}" — Ask the ancients, know yourself | 51yijing.com
```

示例：`「乾」— 问古人，懂自己 | 51yijing.com`

长度控制在 40 字符以内，所有社交平台均可完整显示。

文案走 `next-intl` i18n，三语适配。

### 3.4 Toast 提示

使用现有 `useToast` 组件，替代 `alert`：

| 场景 | Toast 类型 | 文案 |
|------|-----------|------|
| 桌面端复制成功 | `success` | 链接已复制到剪贴板 |
| 系统分享完成 | 无 toast | 系统分享面板自行关闭 |
| 分享失败 | `error` | 分享失败，请重试 |

---

## 四、微信引导浮层

### 4.1 触发条件

`navigator.userAgent` 包含 `MicroMessenger`

### 4.2 视觉设计

```
┌─────────────────────────────────────┐
│  (全屏半透明遮罩 bg-black/60)        │
│                                     │
│                          ╭── 箭头 ──╮
│                          │  ↗       │
│                          ╰──────────╯
│                                     │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │   点击右上角 ··· 按钮       │    │
│  │   分享给朋友或朋友圈        │    │
│  │                             │    │
│  │        [ 我知道了 ]         │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

### 4.3 样式规范

| 元素 | 样式 |
|------|------|
| 遮罩 | `fixed inset-0 bg-black/60 backdrop-blur-sm z-50` |
| 箭头 | CSS 三角形 + 动画，指向右上角，`position: absolute; top: 56px; right: 24px`（修正 #5：top:16px 太贴微信菜单栏，下移到 56px 避开系统 UI） |
| 提示卡片 | `card-mystic rounded-2xl max-w-sm p-6 mx-auto mt-[30vh]` |
| 标题 | `text-lg font-title text-gold text-center` |
| 说明文字 | `text-sm text-[var(--theme-text-muted)] text-center mt-2` |
| 按钮 | `btn-divine h-10 px-6 mt-4 mx-auto block` |

### 4.4 动画

复用项目统一模式（参考 DailyLimitBanner）：

```tsx
// 遮罩
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
/>

// 卡片
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.9 }}
/>

// 箭头：上下浮动
<motion.div
  animate={{ y: [0, -10, 0] }}
  transition={{ repeat: Infinity, duration: 1.5 }}
/>
```

### 4.5 关闭逻辑

- 点击「我知道了」按钮立即关闭
- 点击遮罩区域立即关闭
- 不设自动消失计时器（修正 #5：3s 太短，用户可能还没看完；sessionStorage 已保证同会话只弹一次，无需自动关）
- `sessionStorage.setItem('wechat_share_guided', '1')` — 同会话不再弹出

### 4.6 组件拆分

新建 `src/components/result/WeChatShareGuide.tsx`，独立组件，props：

```tsx
interface WeChatShareGuideProps {
  show: boolean;
  onClose: () => void;
}
```

---

## 五、「保存卦图」交互流程

### 5.1 点击流程

```
用户点击「保存卦图」
  │
  ├─ 按钮显示 loading 状态（spinner + "生成中..."）
  │
  ├─ 请求 /api/share-image?hexagram={n}&locale={locale}
  │
  ├─ 收到 PNG → 触发浏览器下载（filename: 卦名-51yijing.png）
  │
  └─ 根据平台显示 toast 引导
      ├─ iOS Safari: info toast「图片已下载，打开"文件"App → 长按图片 → 存储到"照片"」
      ├─ Android: success toast「图片已保存到下载文件夹」
      └─ 桌面端: success toast「图片已下载」
```

### 5.2 Loading 状态

按钮点击后：
- 文案变为「生成中...」
- `disabled` 状态，`opacity-50 cursor-not-allowed`
- 与现有「保存记录」按钮的 loading 模式一致

### 5.3 iOS 引导 Toast

iOS Safari 下载 PNG 会进入「文件」App 而非相册，需要额外引导。

使用现有 `useToast` 的 `info` 类型，文案较长但 toast 组件 `max-w-[420px]` 足够容纳。自动消失时间延长到 6 秒（iOS 引导需要用户阅读）。

### 5.4 下载实现

```tsx
// 创建隐藏 <a> 触发下载
const blob = await response.blob();
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `${HEXAGRAM_PINYIN[n]}-${n}-51yijing.png`;  // 拼音+卦号，避免中文文件名在 Windows 旧版浏览器被 URL 编码成乱码
a.click();
URL.revokeObjectURL(url);
```

### 5.5 错误处理

| 场景 | 处理 |
|------|------|
| API 返回非 200 | error toast「图片生成失败，请重试」 |
| 网络超时（>5s） | error toast「网络超时，请检查网络后重试」（修正 #6：10s 太长，缩短到 5s） |
| AbortController | 5s 超时自动 abort + 用户快速重复点击时取消前一个请求 |

---

## 六、动态 OG 图设计

### 6.1 尺寸与安全区

```
┌──────────────────────────────────────────────┐
│                 1200 × 630                    │
│                                              │
│  ┌──装饰区──┐  ┌──安全区 630×630──┐  ┌──装饰区──┐
│  │  285px   │  │                  │  │  285px   │
│  │  边框/   │  │  卦号徽章        │  │  边框/   │
│  │  纹理    │  │  卦名（大字）    │  │  纹理    │
│  │          │  │  英文名          │  │          │
│  │          │  │  ── 分割线 ──    │  │          │
│  │          │  │  ⚊ ⚊ ⚊         │  │          │
│  │          │  │  ⚋ ⚋ ⚋         │  │          │
│  │          │  │  ⚊ ⚊ ⚊         │  │          │
│  │          │  │  ...             │  │          │
│  │          │  │  ── 分割线 ──    │  │          │
│  │          │  │  金句（卦辞）    │  │          │
│  └──────────┘  └──────────────────┘  └──────────┘
│                                              │
│              51yijing.com (水印)              │
└──────────────────────────────────────────────┘
```

### 6.2 与现有 OG 图的差异

现有 hexagram detail 页 OG 图只有：卦号徽章 + 卦名（大字）+ traditionalName + 英文名 + 水印。

结果页 OG 图新增：
- **六爻图示**：用 Unicode ⚊（阳爻）⚋（阴爻）表示，不含变爻
- **金句**：卦辞原文（如「乾：元，亨，利，贞。」）

卦名按 locale 取对应文字：`locale=zh` 用简体（nameZh），`locale=zh-TW` 用繁体（若 HEXAGRAM_DATA 有 zh-TW 字段则取，否则 fallback 到 nameZh），`locale=en` 用英文名。不单独显示 traditionalName 行——繁简差异已通过 locale 分流解决。

### 6.3 六爻图示设计

```
六爻排列（从上到下 = 第6爻到第1爻）：

  ━━━━━━━━━━━   阳爻（实线）
  ━━━━  ━━━━    阴爻（断线）
  ━━━━━━━━━━━
  ━━━━  ━━━━
  ━━━━━━━━━━━
  ━━━━━━━━━━━
```

Satori 渲染中用 `div` 模拟：

| 元素 | 样式 |
|------|------|
| 阳爻 | 单个 `div`，`width: 120px, height: 10px, background: #2c2c2c, borderRadius: 2` |
| 阴爻 | 两个 `div` 并排，各 `width: 52px`，中间 `gap: 16px` |
| 爻间距 | `gap: 8px`（垂直） |
| 整体 | `flexDirection: column, alignItems: center` |

颜色用深墨 `#2c2c2c`（与卦名同色），不用朱红——OG 图尺寸小，朱红在缩略图上会显得刺眼。

### 6.4 金句排版

```
fontSize: 24
color: #5a5a5a
textAlign: center
maxWidth: 500px（防止长卦辞溢出安全区）
lineHeight: 1.6
```

英文金句用 James Legge 译本，数据来自 `HEXAGRAM_DATA[n].judgmentEn`。

### 6.5 颜色规范（完整）

直接复用现有 OG 图色板，不引入新颜色：

```
背景：    #f8f5f0  （宣纸米白）
外边框：  #c4b08a  （浅金，2px solid，inset 24px）
内边框：  #c4b08a  （浅金，1px solid，opacity 0.5，inset 32px）
四角装饰：#c4b08a  （16×16 实心方块）
卦号徽章：bg #b8924a, text #f8f5f0
卦名：    #2c2c2c  （深墨，fontSize 120 — 比现有 160 小，给六爻和金句留空间）
| 英文名：  #b8924a  （金色，竖版图中长名自适应字号，见 §七.3.1）
分割线：  #c4b08a  （w 160px, h 1px）
六爻：    #2c2c2c  （深墨）
金句：    #5a5a5a  （灰墨）
水印：    #5a5a5a  （灰墨，fontSize 20）
```

### 6.6 字体

复用 `loadNotoSerifSC()`，传入所有需要渲染的文字做子集加载。

### 6.7 布局节奏（从上到下）

| 元素 | marginBottom |
|------|-------------|
| 卦号徽章 | 16px |
| 卦名 | 8px |
| 英文名 | 20px |
| 分割线 1 | 20px |
| 六爻图 | 20px |
| 分割线 2 | 16px |
| 金句 | — |
| 水印 | absolute bottom 44px |

### 6.8 缓存策略

```tsx
export const revalidate = 2592000; // 30 天
// 响应头由 Next.js OG image 自动设置 Cache-Control
```

缓存键 = `hexagram` + `locale`，共 64 × 3 = 192 种组合。

### 6.9 三级降级

| 级别 | 条件 | 行为 | 日志 |
|------|------|------|------|
| L1 正常 | hexagram 有效 + 字体加载成功 | 完整 OG 图 | — |
| L2 部分降级 | hexagram 有效 + 字体加载失败 | 精简版（系统 serif 字体） | `console.warn('[OG-L2] Font load failed for hexagram ${n}')` （修正 #11：字体回退是预期降级，用 warn 不用 error） |
| L3 兜底 | hexagram 无效/缺失 或 Satori 异常 | 返回静态 `/og-image.png` | `console.error('[OG-L3] Fallback to static OG: ${reason}')` |

---

## 七、竖版分享图片设计

### 7.1 尺寸

1242 × 1656 px（3:4，小红书原生推荐）

### 7.2 布局

```
┌────────────────────────────┐
│        1242 × 1656         │
│                            │
│   ┌────────────────────┐   │
│   │    双层金色边框      │   │
│   │                    │   │
│   │    卦号徽章         │   │
│   │                    │   │
│   │    卦 名            │   │
│   │   （超大字）        │   │
│   │                    │   │
│   │    英文名（自适应）  │   │
│   │                    │   │
│   │   ── 分割线 ──     │   │
│   │                    │   │
│   │    ⚊ ⚊ ⚊          │   │
│   │    ⚋ ⚋ ⚋          │   │
│   │    ⚊ ⚊ ⚊          │   │
│   │    ⚋ ⚋ ⚋          │   │
│   │    ⚊ ⚊ ⚊          │   │
│   │    ⚊ ⚊ ⚊          │   │
│   │                    │   │
│   │   ── 分割线 ──     │   │
│   │                    │   │
│   │   「乾：元，亨，    │   │
│   │     利，贞。」      │   │
│   │                    │   │
│   │                    │   │
│   │   51yijing.com     │   │
│   │                    │   │
│   └────────────────────┘   │
│                            │
└────────────────────────────┘
```

### 7.3 与 OG 图的设计差异

| 属性 | OG 图 (1200×630) | 分享图 (1242×1656) |
|------|-------------------|---------------------|
| 方向 | 横版 | 竖版 |
| 卦名字号 | 120px | 200px（中文）/ 自适应（英文，见 §7.3.1） |
| 六爻尺寸 | 阳爻 w120×h10 | 阳爻 w180×h14 |
| 金句字号 | 24px | 32px |
| 边框 inset | 24/32px | 40/52px（等比放大） |
| 四角装饰 | 16×16 | 24×24 |
| 水印 | 仅域名文字 | 仅域名文字 |

### 7.3.1 英文名自适应字号（修正 #7）

竖版图英文名默认 `fontSize: 40`，但长名（如 "Difficulty at the Beginning"）在 200px 宽度内会溢出。规则：

```
英文名长度 ≤ 20 字符 → fontSize: 40
英文名长度 21-30 字符 → fontSize: 32
英文名长度 > 30 字符 → fontSize: 26
```

实现：在 Satori JSX 中根据 `hexNameEn.length` 动态设置 fontSize，不需要 canvas measureText。

### 7.4 颜色规范

与 OG 图完全一致，不引入新颜色。同一套设计语言，只是画布比例不同。

### 7.5 API 路由

```
GET /api/share-image?hexagram={1-64}&locale={zh|zh-TW|en}
→ Content-Type: image/png
→ Cache-Control: public, immutable, max-age=2592000
```

内部实现：Satori 渲染 → `@resvg/resvg-js` 转 PNG → 返回 Buffer。

与 OG 图共享：
- `loadNotoSerifSC()` 字体加载
- `HEXAGRAM_DATA` 数据源
- 边框/装饰/颜色常量（提取为 `src/lib/og/constants.ts`）

### 7.6 降级策略

同 OG 图三级降级，L3 返回一张预制的通用竖版图片。

---

## 八、多语言

### 8.1 新增 i18n key

```json
{
  "shareHexagram": "分享这一卦",
  "saveHexagramImage": "保存卦图",
  "shareTitle": "「{hexName}」— 问古人，懂自己 | 51yijing.com",
  "linkCopied": "链接已复制到剪贴板",
  "shareFailed": "分享失败，请重试",
  "imageGenerating": "生成中...",
  "imageDownloaded": "图片已下载",
  "imageDownloadedAndroid": "图片已保存到下载文件夹",
  "imageDownloadedIOS": "图片已下载，打开\"文件\"App → 长按图片 → 存储到\"照片\"",
  "imageGenerateFailed": "图片生成失败，请重试",
  "wechatShareTitle": "点击右上角 ··· 按钮",
  "wechatShareDesc": "分享给朋友或朋友圈",
  "wechatShareDismiss": "我知道了"
}
```

三语（zh / zh-TW / en）都需要翻译。注意 en.json 中 `shareTitle` 使用英文引号（修正 #9）：

```json
{
  "shareTitle": "\"{hexName}\" — Ask the ancients, know yourself | 51yijing.com"
}
```

### 8.2 卦名拼音映射（UTM 用）

新建 `src/lib/hexagram-pinyin.ts`，64 条映射：

```ts
export const HEXAGRAM_PINYIN: Record<number, string> = {
  1: 'qian', 2: 'kun', 3: 'zhun', 4: 'meng',
  // ... 64 条
};
```

---

## 九、文件变更清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/app/[locale]/result/opengraph-image.tsx` | 新建 | 结果页动态 OG 图 |
| `src/app/api/share-image/route.ts` | 新建 | 竖版分享图片 API |
| `src/lib/og/constants.ts` | 新建 | OG/分享图共享的颜色、边框常量 |
| `src/lib/hexagram-pinyin.ts` | 新建 | 64 卦拼音映射（UTM 用） |
| `src/components/result/WeChatShareGuide.tsx` | 新建 | 微信引导浮层组件 |
| `src/components/result/ResultContent.tsx` | 修改 | 替换 handleShare → 新逻辑 + 新增保存卦图按钮 |
| `src/components/result/ShareButtons.tsx` | 删除（需确认） | 删除前 `grep -r "ShareButtons" src/` 确认 0 引用；若有引用则先 rename 为 `.deprecated.tsx`（修正 #8） |
| `messages/zh.json` | 修改 | 新增 i18n key |
| `messages/zh-TW.json` | 修改 | 新增 i18n key |
| `messages/en.json` | 修改 | 新增 i18n key |

---

## 十、验收对照

PRD 验收标准 → UX/UI 方案覆盖情况：

| # | PRD 验收标准 | 方案覆盖 |
|---|-------------|---------|
| 1 | 社交平台预览图显示卦名+卦象+金句 | §六 OG 图设计 ✓ |
| 2 | 微信朋友圈方形裁切后关键信息完整 | §六.1 安全区 630×630 ✓ |
| 3 | Cache-Control 30 天 | §六.8 缓存策略 ✓ |
| 4 | 第二次请求走缓存 X-Cache: HIT | §六.8 + Nginx 已有配置 ✓ |
| 5 | hexagram 无效时 L3 降级 | §六.9 三级降级 ✓ |
| 6 | 字体失败时 L2 降级 | §六.9 三级降级 ✓ |
| 7 | 每级降级有 console.error | §六.9 日志格式 ✓ |
| 8 | 移动端系统分享面板 | §三.1 环境检测 ✓ |
| 9 | 微信引导浮层 + 手动关闭 + 同会话一次 | §四 完整设计 ✓ |
| 10 | 桌面端复制链接 + toast | §三.4 Toast 提示 ✓ |
| 11 | UTM 参数 | §三.2 分享链接格式 ✓ |
| 12 | URL 包含正确 UTM | §三.2 + §八.2 拼音映射 ✓ |
| 12b | GA4 筛选分享回流（上线后） | UTM 参数就位即可 ✓ |
| 13 | 保存卦图触发下载 | §五 完整流程 ✓ |
| 14 | 图片含卦名+六爻+金句+水印 | §七.2 布局 ✓ |
| 15 | 图片不含 AI 解读 | §七.2 明确不含 ✓ |
| 16 | 小红书 3:4 比例正确 | §七.1 尺寸 1242×1656 ✓ |
| 17 | 三语正确 | §八 多语言 ✓ |
| 18 | 降级有错误日志 | §六.9 + §七.6 ✓ |
