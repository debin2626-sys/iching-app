# 51yijing.com 首页重构设计规范 v1.0

> 技术栈：Next.js 16 + Tailwind CSS v4 + Framer Motion + next-intl + Lucide React
> 范围：P0 模块 1/2/5/6（首屏 + 场景 + 信任 + FAQ+CTA）

---

## 模块1：首屏价值主张 HeroSection

### 组件名
`src/components/home/HeroSection.tsx`

### 替换内容
当前 `page.tsx` 中 `{/* Hero Section */}` 整块替换为此组件。

### Props
```ts
interface HeroSectionProps {
  locale: string;
  totalCount?: number; // 来自 /api/stats/summary，>=1000 时显示动态信任语
}
```

### 文案（方案A）三语版本

```json
// zh.json → Home 命名空间新增
{
  "heroHeadline": "心中有惑？让三千年智慧为你指引方向",
  "heroSub": "卦象解析 · AI个性化建议 · 事业/感情/财运多维洞察",
  "heroCta": "开始占卜",
  "trustStatic": "基于《周易》经典 · 完全免费",
  "trustDynamic": "已有 {count} 人获得指引 · 免费使用"
}

// en.json → Home 命名空间新增
{
  "heroHeadline": "Lost in uncertainty? Let 3,000 years of wisdom guide you",
  "heroSub": "Hexagram analysis · AI-personalized insights · Career, love & wealth",
  "heroCta": "Start Reading",
  "trustStatic": "Based on the classic I Ching · Completely free",
  "trustDynamic": "{count} people guided · Free to use"
}

// zh-TW.json → Home 命名空間新增
{
  "heroHeadline": "心中有惑？讓三千年智慧為你指引方向",
  "heroSub": "卦象解析 · AI個性化建議 · 事業/感情/財運多維洞察",
  "heroCta": "開始占卜",
  "trustStatic": "基於《周易》經典 · 完全免費",
  "trustDynamic": "已有 {count} 人獲得指引 · 免費使用"
}
```

### 信任语逻辑
```ts
// totalCount >= 1000 → 显示动态版，数字格式化为 "1,234"
// totalCount < 1000 或未加载 → 显示静态版
const trustLine = totalCount >= 1000
  ? t('trustDynamic', { count: totalCount.toLocaleString() })
  : t('trustStatic');
```

### Tailwind 样式规范
```tsx
<section className="relative flex flex-col items-center text-center pt-8 pb-12">
  {/* 背景装饰保留：TaichiWatermark + CloudPattern */}

  {/* H1 — 主标题 */}
  <h1
    className="relative text-3xl md:text-5xl font-bold leading-tight tracking-wide max-w-xl"
    style={{ fontFamily: 'var(--font-display)', color: 'var(--theme-text-primary)' }}
  >
    {t('heroHeadline')}
  </h1>

  {/* 副标题 */}
  <p
    className="relative mt-4 text-base md:text-lg max-w-md"
    style={{ color: 'var(--theme-text-secondary)' }}
  >
    {t('heroSub')}
  </p>

  {/* BrushDivider */}
  <div className="relative mt-6 w-40">
    <BrushDivider />
  </div>

  {/* CTA 按钮 */}
  <div className="relative mt-6">
    <Button href="/divine" variant="primary" size="lg">
      {t('heroCta')}
    </Button>
  </div>

  {/* 信任语 */}
  <p
    className="relative mt-4 text-sm"
    style={{ color: 'var(--theme-text-muted)' }}
  >
    {trustLine}
  </p>
</section>
```

### Framer Motion 动画
```tsx
// 整体 stagger 入场
const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

// h1、p、divider、button、trust 各自包一层 <motion.div variants={item}>
```

### ARIA
```tsx
<section aria-labelledby="hero-heading">
  <h1 id="hero-heading">...</h1>
</section>
```

### 响应式断点
| 断点 | H1 字号 | 副标题 | 布局 |
|------|---------|--------|------|
| mobile (<768px) | text-3xl | text-base | 单列居中 |
| md (≥768px) | text-5xl | text-lg | 单列居中，max-w 放宽 |

---

## 模块2：适用场景 ScenarioSection

### 组件名
`src/components/home/ScenarioSection.tsx`

### 功能
5张场景卡片，点击跳转 `/divine` 并预选对应场景（通过 URL query 或 sessionStorage）。

### Props
```ts
interface ScenarioSectionProps {
  locale: string;
}

interface ScenarioCard {
  id: 'career' | 'love' | 'wealth' | 'study' | 'health';
  icon: LucideIcon;
  labelKey: string;  // i18n key
  descKey: string;
  href: string;      // /divine?scenario=career 等
}
```

### 场景数据
```ts
import { Briefcase, Heart, Coins, GraduationCap, Leaf } from 'lucide-react';

const SCENARIOS: ScenarioCard[] = [
  { id: 'career',  icon: Briefcase,      labelKey: 'scenarioCareer',  descKey: 'scenarioCareerDesc',  href: '/divine?scenario=career' },
  { id: 'love',    icon: Heart,          labelKey: 'scenarioLove',    descKey: 'scenarioLoveDesc',    href: '/divine?scenario=love' },
  { id: 'wealth',  icon: Coins,          labelKey: 'scenarioWealth',  descKey: 'scenarioWealthDesc',  href: '/divine?scenario=wealth' },
  { id: 'study',   icon: GraduationCap,  labelKey: 'scenarioStudy',   descKey: 'scenarioStudyDesc',   href: '/divine?scenario=study' },
  { id: 'health',  icon: Leaf,           labelKey: 'scenarioHealth',  descKey: 'scenarioHealthDesc',  href: '/divine?scenario=health' },
];
```

### 文案（zh）
```json
{
  "scenarioSectionTitle": "你在为哪件事困惑？",
  "scenarioCareer": "事业发展",
  "scenarioCareerDesc": "工作、升职、创业方向",
  "scenarioLove": "感情姻缘",
  "scenarioLoveDesc": "恋爱、婚姻、复合",
  "scenarioWealth": "财运投资",
  "scenarioWealthDesc": "理财、求财、投资决策",
  "scenarioStudy": "学业考试",
  "scenarioStudyDesc": "升学、考试、深造",
  "scenarioHealth": "健康养生",
  "scenarioHealthDesc": "身体状况、调理方向"
}
```

### Tailwind 样式规范
```tsx
<section className="mt-16" aria-labelledby="scenario-heading">
  <h2
    id="scenario-heading"
    className="text-xl text-center mb-8"
    style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}
  >
    {t('scenarioSectionTitle')}
  </h2>

  {/* 移动端：2列 + 最后1个居中；桌面：5列 */}
  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
    {SCENARIOS.map((s) => (
      <Link key={s.id} href={s.href}>
        <Card
          variant="default"
          padding="md"
          className="flex flex-col items-center text-center cursor-pointer
                     hover:border-[var(--color-gold)] transition-colors duration-200
                     active:scale-95"
        >
          <s.icon size={28} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} />
          <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--theme-text-primary)' }}>
            {t(s.labelKey)}
          </p>
          <p className="mt-1 text-xs" style={{ color: 'var(--theme-text-muted)' }}>
            {t(s.descKey)}
          </p>
        </Card>
      </Link>
    ))}
  </div>
</section>
```

### 移动端布局处理
```tsx
// 5个卡片在2列网格中，最后1个单独居中
// 方案：最后一个卡片加 col-span-2 md:col-span-1 + mx-auto + max-w-[calc(50%-6px)]
<div className={`${index === 4 ? 'col-span-2 md:col-span-1 flex justify-center' : ''}`}>
  {index === 4 ? (
    <div className="w-[calc(50%-6px)] md:w-full">
      <Card ...>...</Card>
    </div>
  ) : <Card ...>...</Card>}
</div>
```

### Framer Motion 动画
```tsx
// 卡片 stagger 入场（viewport 触发）
<motion.div
  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, margin: '-50px' }}
  transition={{ delay: index * 0.08 }}
>
```

### ARIA
```tsx
// Link 加 aria-label
<Link href={s.href} aria-label={`${t(s.labelKey)}占卜 - ${t(s.descKey)}`}>
```

---

## 模块5：为什么可信 TrustSection

### 组件名
`src/components/home/TrustSection.tsx`

### 布局
三列卡片 + 解读流程可视化（静态图或 SVG 流程图）

### Props
```ts
interface TrustSectionProps {
  locale: string;
}
```

### 三列内容
```json
// zh
{
  "trustSectionTitle": "为什么可以信任易经指引？",
  "trust1Title": "三千年传承",
  "trust1Desc": "《周易》成书于西周，历经孔子、朱熹等历代大儒注疏，是中华文明最深厚的智慧结晶",
  "trust2Title": "忠实还原古法",
  "trust2Desc": "严格遵循三币六爻起卦程序，每次摇卦完全随机，不干预卦象生成",
  "trust3Title": "AI深度解读",
  "trust3Desc": "综合历代经典注疏，结合你的具体问题，提供个性化而非模板化的卦象分析",
  "trustProcessTitle": "解读流程",
  "trustStep1": "输入问题",
  "trustStep2": "三币摇卦×6",
  "trustStep3": "生成卦象",
  "trustStep4": "AI深度解读"
}
```

### Tailwind 样式规范
```tsx
<section className="mt-20" aria-labelledby="trust-heading">
  <h2
    id="trust-heading"
    className="text-xl text-center mb-8"
    style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}
  >
    {t('trustSectionTitle')}
  </h2>

  {/* 三列信任卡片 */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {trustItems.map((item, i) => (
      <Card key={i} variant="default" padding="lg" className="text-center">
        {/* 图标用 Lucide：History / Shield / Sparkles */}
        <item.icon size={32} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} className="mx-auto mb-3" />
        <h3 className="font-bold mb-2" style={{ color: 'var(--theme-text-primary)' }}>
          {t(item.titleKey)}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>
          {t(item.descKey)}
        </p>
      </Card>
    ))}
  </div>

  {/* 流程图 — 静态 SVG/HTML */}
  <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
    {steps.map((step, i) => (
      <React.Fragment key={i}>
        <div className="flex flex-col items-center">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: 'var(--color-gold)', color: '#1a1a1a' }}
          >
            {i + 1}
          </div>
          <span className="mt-1 text-xs" style={{ color: 'var(--theme-text-secondary)' }}>
            {t(step.key)}
          </span>
        </div>
        {i < steps.length - 1 && (
          <ChevronRight size={16} style={{ color: 'var(--theme-text-muted)' }} className="mb-4" />
        )}
      </React.Fragment>
    ))}
  </div>
</section>
```

### Framer Motion 动画
```tsx
// 三列卡片 viewport stagger
// 流程步骤依次 fade-in（delay: index * 0.15）
```

### ARIA
```tsx
<section aria-labelledby="trust-heading">
  {/* 流程图加 role="list" */}
  <ol role="list" aria-label={t('trustProcessTitle')}>
    {steps.map((step, i) => <li key={i}>...</li>)}
  </ol>
</section>
```

---

## 模块6：FAQ + 最终CTA + 移动端Sticky Bar

### 组件名
`src/components/home/FaqCtaSection.tsx`

### Props
```ts
interface FaqCtaProps {
  locale: string;
}

interface FaqItem {
  questionKey: string;
  answerKey: string;
}
```

### FAQ 数据（6条）
```json
// zh
{
  "faqSectionTitle": "常见问题",
  "faq1Q": "占卜需要付费吗？",
  "faq1A": "完全免费。51yijing.com 的所有功能——摇卦、AI解读、六十四卦查询——均永久免费，无需注册。",
  "faq2Q": "占卜结果准确吗？",
  "faq2A": "易经的核心是'心诚则灵'。卦象完全随机生成，AI解读基于数千年经典注疏。结果仅供参考，不构成决策建议。",
  "faq3Q": "三币占卜法是什么？",
  "faq3A": "虚拟抛掷三枚铜钱六次，根据正反面组合确定每爻阴阳，六次得到完整卦象。这是最经典的易经起卦方式。",
  "faq4Q": "什么是动爻？",
  "faq4A": "动爻（变爻）是卦象中处于变化状态的爻线，代表当前局势的转变趋势。有动爻时会生成变卦，提供更完整的指引。",
  "faq5Q": "可以反复占卜同一个问题吗？",
  "faq5A": "传统上建议同一问题不重复占卜，以保持诚心。如果情况有实质变化，可以重新起卦。",
  "faq6Q": "支持哪些语言？",
  "faq6A": "目前支持简体中文、繁体中文和英文，可在页面右上角切换语言。",
  "finalCtaTitle": "准备好了吗？",
  "finalCtaDesc": "静心凝神，让易经为你指引方向",
  "finalCtaButton": "立即开始占卜"
}
```

### Tailwind 样式规范

**FAQ 手风琴：**
```tsx
// 使用 Radix UI Accordion 或自实现
// 每条 FAQ 展开/收起，默认全部收起
<section className="mt-20" aria-labelledby="faq-heading">
  <h2
    id="faq-heading"
    className="text-xl text-center mb-8"
    style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}
  >
    {t('faqSectionTitle')}
  </h2>

  <div className="space-y-2">
    {FAQ_ITEMS.map((item, i) => (
      <FaqAccordionItem key={i} question={t(item.questionKey)} answer={t(item.answerKey)} />
    ))}
  </div>
</section>
```

**FaqAccordionItem 内部：**
```tsx
// 使用 useState 控制展开
// 展开时 answer 用 motion.div animate height
<div
  className="border rounded-lg overflow-hidden"
  style={{ borderColor: 'var(--theme-border)' }}
>
  <button
    className="w-full flex justify-between items-center px-4 py-3 text-left text-sm font-medium"
    style={{ color: 'var(--theme-text-primary)' }}
    onClick={() => setOpen(!open)}
    aria-expanded={open}
  >
    {question}
    <ChevronDown
      size={16}
      className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      style={{ color: 'var(--theme-text-muted)' }}
    />
  </button>
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="px-4 pb-3 text-sm leading-relaxed"
        style={{ color: 'var(--theme-text-secondary)' }}
      >
        {answer}
      </motion.div>
    )}
  </AnimatePresence>
</div>
```

**最终 CTA 区块：**
```tsx
<div
  className="mt-16 text-center py-12 px-6 rounded-2xl"
  style={{ backgroundColor: 'var(--theme-card-bg)', border: '1px solid var(--theme-border)' }}
>
  <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--theme-text-primary)' }}>
    {t('finalCtaTitle')}
  </h2>
  <p className="text-sm mb-6" style={{ color: 'var(--theme-text-secondary)' }}>
    {t('finalCtaDesc')}
  </p>
  <Button href="/divine" variant="primary" size="lg">
    {t('finalCtaButton')}
  </Button>
</div>
```

**移动端 Sticky 底部 Bar：**
```tsx
// 组件名：StickyCtaBar.tsx
// 仅移动端显示（md:hidden），fixed bottom-0
// 滚动超过首屏后显示（用 IntersectionObserver 监听 Hero 区域）

<div
  className="fixed bottom-0 left-0 right-0 z-50 md:hidden
             px-4 py-3 flex items-center justify-between
             border-t"
  style={{
    backgroundColor: 'var(--theme-bg)',
    borderColor: 'var(--theme-border)',
  }}
>
  <span className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>
    {t('trustStatic')}
  </span>
  <Button href="/divine" variant="primary" size="sm">
    {t('heroCta')}
  </Button>
</div>
```

**StickyCtaBar 显示逻辑：**
```tsx
const [visible, setVisible] = useState(false);
useEffect(() => {
  const hero = document.getElementById('hero-heading');
  if (!hero) return;
  const observer = new IntersectionObserver(
    ([entry]) => setVisible(!entry.isIntersecting),
    { threshold: 0 }
  );
  observer.observe(hero);
  return () => observer.disconnect();
}, []);

if (!visible) return null;
```

### ARIA
```tsx
// FAQ button: aria-expanded, aria-controls
// Sticky bar: aria-label="快速开始占卜"
// 最终CTA区: aria-labelledby="final-cta-heading"
```

---

## page.tsx 改造方案

### 新的模块顺序
```tsx
<main>
  <HeroSection locale={locale} totalCount={totalCount} />       {/* 模块1 */}
  <ScenarioSection locale={locale} />                           {/* 模块2 */}
  {/* P1: 模块3 三步流程（后续迭代）*/}
  {/* P1: 模块4 示例解读（保留现有 SampleReadingClient）*/}
  <SampleReadingClient ... />
  <TrustSection locale={locale} />                              {/* 模块5 */}
  <UserReviews />
  <FaqCtaSection locale={locale} />                             {/* 模块6 */}
  <StickyCtaBar locale={locale} />                              {/* 移动端sticky */}
  {/* 保留 SEO 段落 */}
</main>
```

### totalCount 获取
```tsx
// page.tsx 顶部 async 获取
async function getTotalCount(): Promise<number> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/stats/summary`, {
      next: { revalidate: 3600 } // 1小时缓存
    });
    const data = await res.json();
    return data.total ?? 0;
  } catch {
    return 0;
  }
}

// 在 HomePage 组件中
const totalCount = await getTotalCount();
```

---

## 新增 API 端点

### GET /api/stats/summary

**文件：** `src/app/api/stats/summary/route.ts`

```ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 3600; // ISR 1小时

export async function GET() {
  const [total, todayResult] = await Promise.all([
    prisma.divination.count(),
    prisma.divination.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ]);

  return NextResponse.json({ total, today: todayResult });
}
```

**注意：** tech_readiness.md 指出 `userId` 缺索引，建议在 Prisma schema 中添加：
```prisma
@@index([createdAt])
@@index([userId])
```

---

## 开发优先级

| 优先级 | 任务 | 预估工时 |
|--------|------|---------|
| P0-1 | HeroSection 组件 + 文案更新 | 2h |
| P0-2 | ScenarioSection 组件 | 2h |
| P0-3 | /api/stats/summary 端点 | 0.5h |
| P0-4 | TrustSection 组件 | 2h |
| P0-5 | FaqCtaSection + StickyCtaBar | 3h |
| P0-6 | i18n 文案合并（zh/en/zh-TW） | 1h |
| P0-7 | page.tsx 组装 + totalCount 逻辑 | 1h |
| **合计** | | **~11.5h** |
