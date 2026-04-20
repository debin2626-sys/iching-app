# 「分享这一卦」开发计划

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** 实现结果页分享功能：动态 OG 图、分享按钮升级（UTM + 环境检测）、保存竖版卦图

**Architecture:** 三条线并行度有限（OG 图 → 分享按钮依赖 OG 路由；竖版图 API → 保存按钮依赖 API）。按依赖顺序：共享常量 → OG 图 → 竖版图 API → 前端按钮改造 → 微信浮层 → i18n → 清理

**Tech Stack:** Next.js 16 + next/og (ImageResponse/satori) + next-intl + framer-motion + Tailwind v4

**对齐文档:** `docs/ux-ui-share-feature.md` (UX/UI v2), `docs/prd/share-and-og.md` (PRD v3)

---

## Task 1: 共享常量 + 拼音映射

**Objective:** 提取 OG/分享图共享的颜色、边框常量，创建 64 卦拼音映射

**Files:**
- Create: `src/lib/og/constants.ts`
- Create: `src/lib/hexagram-pinyin.ts`

**实现:**

`src/lib/og/constants.ts`:
```typescript
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
```

`src/lib/hexagram-pinyin.ts`:
```typescript
export const HEXAGRAM_PINYIN: Record<number, string> = {
  1: 'qian', 2: 'kun', 3: 'zhun', 4: 'meng', 5: 'xu', 6: 'song',
  7: 'shi', 8: 'bi', 9: 'xiaoxu', 10: 'lv', 11: 'tai', 12: 'pi',
  13: 'tongren', 14: 'dayou', 15: 'qian2', 16: 'yu', 17: 'sui', 18: 'gu',
  19: 'lin', 20: 'guan', 21: 'shihe', 22: 'bi2', 23: 'bo', 24: 'fu',
  25: 'wuwang', 26: 'daxu', 27: 'yi', 28: 'daguo', 29: 'kan', 30: 'li',
  31: 'xian', 32: 'heng', 33: 'dun', 34: 'dazhuang', 35: 'jin', 36: 'mingyi',
  37: 'jiaren', 38: 'kui', 39: 'jian', 40: 'jie', 41: 'sun', 42: 'yi2',
  43: 'guai', 44: 'gou', 45: 'cui', 46: 'sheng', 47: 'kun2', 48: 'jing',
  49: 'ge', 50: 'ding', 51: 'zhen', 52: 'gen', 53: 'jianjin', 54: 'guimei',
  55: 'feng', 56: 'lv2', 57: 'xun', 58: 'dui', 59: 'huan', 60: 'jie2',
  61: 'zhongfu', 62: 'xiaoguo', 63: 'jiji', 64: 'weiji',
};
```

**验证:** `npx tsc --noEmit src/lib/og/constants.ts src/lib/hexagram-pinyin.ts`

**Commit:** `feat: add OG shared constants and hexagram pinyin mapping`

---

## Task 2: 结果页动态 OG 图

**Objective:** 为 /result 页创建动态 OG 图（1200×630），显示卦号+卦名+六爻+金句

**Files:**
- Create: `src/app/[locale]/result/opengraph-image.tsx`

**依赖:** Task 1 的 constants.ts

**关键参考:** 现有 `src/app/[locale]/hexagrams/[id]/opengraph-image.tsx` 的实现模式

**实现要点:**
- 从 searchParams 读 `hexagram` 参数，用 `HEXAGRAM_DATA` 查数据
- 卦名按 locale：zh→nameZh, zh-TW→nameZhTW||nameZh, en→nameEn
- 六爻用 symbol 字段（"111111"），div 模拟阳爻/阴爻
- 金句：zh/zh-TW→judgmentZh/judgmentZhTW, en→judgmentEn
- 字体：`loadNotoSerifSC(allText)` 子集加载
- 三级降级：L1 正常 / L2 字体失败 console.warn / L3 返回静态 /og-image.png console.error
- `export const revalidate = 2592000`
- 尺寸 1200×630，安全区居中 630×630
- 颜色全部从 `OG_COLORS` 取

**布局（从上到下）:**
卦号徽章(mb16) → 卦名120px(mb8) → 英文名(mb20) → 分割线(mb20) → 六爻图(mb20) → 分割线(mb16) → 金句24px → 水印(absolute bottom 44px)

**验证:** 访问 `/zh/result?hexagram=1` 检查 OG 图渲染

**Commit:** `feat: add dynamic OG image for result page`

---

## Task 3: 竖版分享图片 API

**Objective:** 创建 /api/share-image API，返回 1242×1656 竖版 PNG

**Files:**
- Create: `src/app/api/share-image/route.ts`

**依赖:** Task 1 的 constants.ts

**实现要点:**
- `GET /api/share-image?hexagram={1-64}&locale={zh|zh-TW|en}`
- 用 `next/og` 的 `ImageResponse` 生成（同 OG 图技术栈）
- 尺寸 1242×1656，边框用 SHARE_BORDER 常量
- 卦名 200px（中文），英文自适应字号（≤20字符→40px, 21-30→32px, >30→26px）
- 六爻放大：阳爻 w180×h14，阴爻两段各 w78，gap 24
- 金句 32px
- 响应头：`Cache-Control: public, immutable, max-age=2592000`
- 三级降级同 OG 图
- 参数校验：hexagram 不在 1-64 范围返回 400

**验证:** `curl -o test.png "http://localhost:3000/api/share-image?hexagram=1&locale=zh"` 检查图片

**Commit:** `feat: add share image API for vertical hexagram card`

---

## Task 4: 微信引导浮层组件

**Objective:** 创建微信内分享引导浮层

**Files:**
- Create: `src/components/result/WeChatShareGuide.tsx`

**实现要点:**
- Props: `{ show: boolean; onClose: () => void }`
- 遮罩：`fixed inset-0 bg-black/60 backdrop-blur-sm z-50`
- 箭头：CSS 三角形，`absolute top-[56px] right-6`，motion 上下浮动 `y: [0, -10, 0]`
- 卡片：`card-mystic rounded-2xl max-w-sm p-6 mx-auto mt-[30vh]`
- 按钮：`btn-divine h-10 px-6`，文案「我知道了」
- 关闭：点按钮 / 点遮罩，无自动消失
- 动画：遮罩 opacity 0→1，卡片 scale 0.9→1，用 AnimatePresence
- 文案走 i18n（t('wechatShareTitle'), t('wechatShareDesc'), t('wechatShareDismiss')）

**验证:** TypeScript 编译通过

**Commit:** `feat: add WeChat share guide overlay component`

---

## Task 5: ResultContent.tsx 底部按钮改造

**Objective:** 替换 handleShare，新增「分享这一卦」和「保存卦图」按钮

**Files:**
- Modify: `src/components/result/ResultContent.tsx`

**依赖:** Task 1 (pinyin), Task 3 (API), Task 4 (WeChatShareGuide)

**改造点:**

1. **import 新增:**
   - `import { HEXAGRAM_PINYIN } from '@/lib/hexagram-pinyin'`
   - `import { WeChatShareGuide } from './WeChatShareGuide'`

2. **新增 state:**
   - `const [showWeChatGuide, setShowWeChatGuide] = useState(false)`
   - `const [isGeneratingImage, setIsGeneratingImage] = useState(false)`

3. **替换 handleShare 函数:**
   ```typescript
   const handleShare = async () => {
     const isWeChat = /MicroMessenger/i.test(navigator.userAgent);
     if (isWeChat) {
       const guided = sessionStorage.getItem('wechat_share_guided');
       if (!guided) { setShowWeChatGuide(true); return; }
     }
     const hexName = hexInfo?.cn ?? '';
     const shareUrl = `${window.location.origin}/${locale}/result?hexagram=${hexNum}&utm_source=share&utm_medium=hexagram&utm_content=${HEXAGRAM_PINYIN[hexNum ?? 1]}`;
     const shareText = t('shareTitle', { hexName });
     if (navigator.share) {
       try {
         await navigator.share({ title: hexName, text: shareText, url: shareUrl });
       } catch (e) {
         if ((e as Error).name !== 'AbortError') toast(t('shareFailed'), 'error');
       }
     } else {
       await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
       toast(t('linkCopied'), 'success');
     }
   };
   ```

4. **新增 handleSaveImage 函数:**
   ```typescript
   const handleSaveImage = async () => {
     if (isGeneratingImage) return;
     setIsGeneratingImage(true);
     const controller = new AbortController();
     const timeout = setTimeout(() => controller.abort(), 5000);
     try {
       const res = await fetch(`/api/share-image?hexagram=${hexNum}&locale=${locale}`, { signal: controller.signal });
       clearTimeout(timeout);
       if (!res.ok) throw new Error('API error');
       const blob = await res.blob();
       const url = URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = `${HEXAGRAM_PINYIN[hexNum ?? 1]}-${hexNum}-51yijing.png`;
       a.click();
       URL.revokeObjectURL(url);
       // 平台引导 toast
       const ua = navigator.userAgent;
       if (/iPad|iPhone|iPod/.test(ua)) toast(t('imageDownloadedIOS'), 'info');
       else if (/Android/.test(ua)) toast(t('imageDownloadedAndroid'), 'success');
       else toast(t('imageDownloaded'), 'success');
     } catch (e) {
       clearTimeout(timeout);
       if ((e as Error).name === 'AbortError') toast(t('imageTimeout'), 'error');
       else toast(t('imageGenerateFailed'), 'error');
     } finally {
       setIsGeneratingImage(false);
     }
   };
   ```

5. **底部按钮区域改造:**
   - 原「分享卦象」→「分享这一卦」，onClick=handleShare
   - 新增「保存卦图」按钮，onClick=handleSaveImage，loading 时显示「生成中...」
   - 所有按钮 className 改为 `btn-divine min-w-[140px] max-w-[180px] flex-1 h-12 ...`

6. **底部加 WeChatShareGuide 组件**

**验证:** TypeScript 编译通过 + 浏览器手动测试

**Commit:** `feat: upgrade share button with UTM, env detection, and save image`

---

## Task 6: i18n 三语翻译

**Objective:** 在 zh/zh-TW/en 三个 messages 文件中添加分享相关 i18n key

**Files:**
- Modify: `messages/zh.json`
- Modify: `messages/zh-TW.json`
- Modify: `messages/en.json`

**新增 key（在 Result 命名空间下）:**

zh.json:
```json
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
"imageTimeout": "网络超时，请检查网络后重试",
"wechatShareTitle": "点击右上角 ··· 按钮",
"wechatShareDesc": "分享给朋友或朋友圈",
"wechatShareDismiss": "我知道了"
```

zh-TW.json: 繁体对应翻译
en.json: 英文翻译（shareTitle 用英文引号 `"{hexName}"` 不用「」）

**验证:** JSON 语法检查 `node -e "JSON.parse(require('fs').readFileSync('messages/zh.json'))"`

**Commit:** `feat: add i18n keys for share feature (zh/zh-TW/en)`

---

## Task 7: 清理 + 最终验证

**Objective:** 删除废弃文件，全量构建验证

**Steps:**
1. `grep -r "ShareButtons" src/` 确认 0 引用
2. 若 0 引用：`rm src/components/social/ShareButtons.tsx`
3. 若有引用：`mv src/components/social/ShareButtons.tsx src/components/social/ShareButtons.deprecated.tsx`
4. `npm run build` 全量构建
5. 修复任何构建错误
6. `git add -A && git commit -m "chore: remove unused ShareButtons, verify build"`

**验证:** build 成功，无 TypeScript/lint 错误

---

## 执行顺序 & 并行策略

```
Task 1 (常量+拼音) ──→ Task 2 (OG图) ──→ Task 5 (按钮改造) ──→ Task 7 (清理)
                   ──→ Task 3 (竖版API) ──↗        ↑
                   ──→ Task 4 (微信浮层) ──↗        │
                   ──→ Task 6 (i18n) ────────────────┘
```

- Task 1 先做（无依赖）
- Task 2/3/4/6 可并行（都只依赖 Task 1）
- Task 5 等 2/3/4/6 全完成后做（集成）
- Task 7 最后做（全量验证）
