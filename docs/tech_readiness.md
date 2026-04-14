# 51yijing.com 技术准备文档

> 生成时间：2026-04-14  
> 代码路径：`/root/.openclaw/workspace/developer/iching-app`

---

## 一、技术栈版本确认

| 组件 | 版本 | 备注 |
|------|------|------|
| Next.js | 16.1.7 | 使用 Turbopack（`next dev` 默认启用） |
| React | 19.2.3 | — |
| TypeScript | ^5 | — |
| Tailwind CSS | ^4 | 通过 `@tailwindcss/postcss` 集成 |
| Prisma Client | ^7.5.0 | 使用 `@prisma/adapter-pg`（非 Neon serverless） |
| @prisma/adapter-pg | ^7.6.0 | 连接本地 PostgreSQL（非 Neon serverless driver） |
| @neondatabase/serverless | ^1.0.2 | 已安装但当前 prisma.ts 未使用 |
| next-intl | ^4.8.3 | 多语言：zh / zh-TW / en |
| next-auth | ^5.0.0-beta.30 | Auth.js v5 beta |
| @auth/prisma-adapter | ^2.11.1 | — |
| tRPC | ^11.13.4 | client + server + react-query |
| @tanstack/react-query | ^5.90.21 | — |
| framer-motion | ^12.37.0 | 动画 |
| OpenAI SDK | ^6.31.0 | AI 解读 |
| Stripe | ^20.4.1 | 支付 |
| @upstash/ratelimit + redis | ^2.0.8 / ^1.37.0 | 已安装，当前未在 rate-limit.ts 中使用（用的是内存限速） |
| opennextjs-cloudflare | ^1.0.0 | Cloudflare 部署适配器 |

**⚠️ 注意事项：**
- `@neondatabase/serverless` 和 `@prisma/adapter-neon` 已安装，但 `src/lib/prisma.ts` 实际使用的是 `@prisma/adapter-pg` + 本地 pg pool，与上下文描述的"Neon PostgreSQL"不符，需确认生产环境 `DATABASE_URL` 指向。
- `@upstash/ratelimit` 已安装但未使用，当前限速为进程内 Map（多实例部署时无法共享状态）。
- next-auth 仍是 beta 版本（v5.0.0-beta.30），需关注稳定性。

---

## 二、项目目录结构

```
iching-app/
├── prisma/
│   └── schema.prisma          # 数据库 schema
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 根布局（GA4、字体、AuthProvider）
│   │   ├── globals.css
│   │   ├── [locale]/           # 多语言路由
│   │   │   ├── layout.tsx      # locale 布局（ThemeProvider、i18n）
│   │   │   ├── page.tsx        # 首页
│   │   │   ├── divine/         # 占卜流程
│   │   │   ├── divination/     # 占卜结果（含 .bak 文件）
│   │   │   ├── result/
│   │   │   ├── hexagrams/
│   │   │   ├── history/
│   │   │   ├── profile/
│   │   │   ├── settings/
│   │   │   ├── pricing/
│   │   │   ├── about/
│   │   │   ├── auth/
│   │   │   └── ...
│   │   └── api/
│   │       ├── stats/today/    # 今日统计
│   │       ├── health/         # 健康检查
│   │       ├── divination/     # 占卜 CRUD
│   │       ├── ai/interpret/   # AI 解读
│   │       ├── auth/           # 认证
│   │       ├── user/           # 用户相关
│   │       ├── payments/       # 支付
│   │       ├── webhooks/kofi/  # Ko-fi webhook
│   │       ├── rag/search/     # RAG 搜索
│   │       └── report/monthly/ # 月报
│   ├── components/
│   │   ├── analytics/GoogleAnalytics.tsx
│   │   ├── home/               # 首页组件
│   │   ├── divination/         # 占卜组件
│   │   ├── ui/                 # 通用 UI
│   │   └── ...
│   ├── lib/
│   │   ├── prisma.ts           # DB 客户端
│   │   ├── analytics.ts        # GA4 事件追踪
│   │   ├── ai-cache.ts         # LRU 内存缓存（AI 解读）
│   │   ├── rate-limit.ts       # 限速（内存）
│   │   ├── auth.ts
│   │   └── ...
│   ├── i18n/
│   │   └── routing.ts          # locales: ['zh', 'zh-TW', 'en']
│   └── middleware.ts
├── next.config.ts
├── open-next.config.ts         # Cloudflare 适配
└── package.json
```

---

## 三、Prisma Schema — Divination 表结构

```prisma
model Divination {
  id                  String             @id @default(cuid())
  userId              String?            // 可为空（匿名用户）
  anonymousSessionId  String?            // 匿名会话 ID
  question            String?
  coinResults         Json               // 铜钱结果
  hexagramId          Int                // 主卦
  changedHexagramId   Int?               // 变卦（可选）
  changingLines       Int[]              // 动爻
  aiInterpretation    String?
  locale              String             @default("zh")
  createdAt           DateTime           @default(now())
  reviewNote          String?
  accuracyScore       Int?               // 用户评分（1-5）
  reviewedAt          DateTime?
  fulfilled           Boolean?
  fulfilledAt         DateTime?

  @@index([anonymousSessionId])
}
```

**关键字段说明：**
- `createdAt` — 用于今日/总量统计的时间字段，已有隐式索引（PK 关联）
- `anonymousSessionId` — 有索引，支持匿名用户限速查询
- `userId` — 无显式索引，若按用户查询频繁建议补加 `@@index([userId])`

---

## 四、现有 /api/stats/today 分析

**路径：** `src/app/api/stats/today/route.ts`

**当前行为：**
1. 每次请求直接查 DB，无缓存
2. 返回今日占卜数 + 今日高评分评价列表（≥4星，最多5条）
3. 响应格式：`{ success: true, data: { todayCount, reviews[] } }`

**问题：**
- 无缓存，高并发时每次都打 DB
- `next.config.ts` 中 `/api/(.*)` 路由设置了 `Cache-Control: no-store`，CDN 层不缓存

---

## 五、新接口设计：/api/stats/summary

### 接口规范

```
GET /api/stats/summary
Response: { total: number, today: number }
```

### 实现方案

```typescript
// src/app/api/stats/summary/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 进程内缓存（单实例适用；多实例可换 Upstash Redis）
let cache: { total: number; today: number; cachedAt: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 分钟

export async function GET() {
  const now = Date.now();

  // 缓存命中
  if (cache && now - cache.cachedAt < CACHE_TTL_MS) {
    return NextResponse.json(
      { total: cache.total, today: cache.today },
      { headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=60' } }
    );
  }

  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [total, today] = await Promise.all([
      prisma.divination.count(),
      prisma.divination.count({
        where: { createdAt: { gte: startOfDay } },
      }),
    ]);

    cache = { total, today, cachedAt: now };

    return NextResponse.json(
      { total, today },
      { headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=60' } }
    );
  } catch (error) {
    console.error('[/api/stats/summary] DB error:', error);
    // 降级：返回旧缓存（如有）
    if (cache) {
      return NextResponse.json({ total: cache.total, today: cache.today });
    }
    return NextResponse.json({ total: 0, today: 0 }, { status: 500 });
  }
}
```

### 缓存策略说明

| 层级 | 策略 | TTL |
|------|------|-----|
| 进程内 Map | 首选，零依赖 | 5 分钟 |
| Upstash Redis | 多实例/Cloudflare Workers 场景升级方案 | 5 分钟 |
| Cloudflare CDN | `Cache-Control: public, max-age=300` | 5 分钟 |
| 客户端 | `stale-while-revalidate=60` | 后台刷新 |

**注意：** `next.config.ts` 中 `/api/(.*)` 全局设置了 `no-store`，需为 `/api/stats/summary` 单独覆盖，或在路由 handler 中通过 `NextResponse` headers 覆盖（handler 级别优先级更高）。

---

## 六、GA4 集成状态评估

### GoogleAnalytics 组件

**文件：** `src/components/analytics/GoogleAnalytics.tsx`

**状态：✅ 基础集成完整**
- 仅在 `NODE_ENV === 'production'` 且 `NEXT_PUBLIC_GA_ID` 存在时加载
- 使用 `next/script` + `strategy="afterInteractive"`，不阻塞首屏
- 挂载在根布局 `src/app/layout.tsx`，全局生效

**⚠️ 问题：**
- `.env` 中 `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`（占位符），**生产环境必须替换为真实 GA4 Measurement ID**
- 无 SPA 路由变化追踪（Next.js App Router 切换页面不会自动触发 `page_view`），需要补充路由监听

### analytics.ts 事件追踪

**文件：** `src/lib/analytics.ts`

**状态：✅ 事件体系完整**

已实现的事件分类：

| 分类 | 事件数 | 说明 |
|------|--------|------|
| 转化漏斗 `funnel_*` | 12 个 | home_view → start_click → question_submit → meditation → coin_toss → hexagram_formed → result_view → ai_interpret |
| 占卜流程 | 3 个 | divination_start / complete / coin_toss |
| 静心引导 | 2 个 | meditation_complete / skip |
| 场景选择 | 1 个 | scenario_select |
| AI 解读 | 2 个 | ai_interpret_start / complete |
| 语言切换 | 1 个 | language_switch |
| 商业化 | 5 个 | limit_reached / view_limit_popup / click_upgrade_pro / click_kofi_donate / close_limit_popup |

**防重复机制：** `sendEventOnce()` 用 `Set<string>` 去重（页面级，刷新后重置）

**⚠️ 待确认：**
- `trackFunnelHomeView` 是否在首页实际调用（需检查 `src/app/[locale]/page.tsx` 或 `TodayCounter`）
- 商业化事件（limit_popup 系列）是否已接入对应组件

---

## 七、首页重构影响文件清单

首页重构（`src/app/[locale]/page.tsx`）可能影响的文件：

### 直接影响（首页直接引用）

| 文件 | 说明 |
|------|------|
| `src/app/[locale]/page.tsx` | 首页主文件 |
| `src/components/home/HomeNavBar.tsx` | 顶部导航 |
| `src/components/home/TodayCounter.tsx` | 今日计数器（调用 `/api/stats/today`） |
| `src/components/home/SampleReading.tsx` | 示例解读（Client Component） |
| `src/components/home/SampleReadingContent.tsx` | 示例解读内容 |
| `src/components/home/sampleReadingData.ts` | 示例数据 |
| `src/components/home/UserReviews.tsx` | 用户评价 |
| `src/components/home/StartDivinationButton.tsx` | 开始占卜按钮 |
| `src/components/decorative/TaichiWatermark.tsx` | 太极水印 |
| `src/components/decorative/BrushDivider.tsx` | 毛笔分隔线 |
| `src/components/decorative/CloudPattern.tsx` | 云纹装饰 |
| `src/components/seo/JsonLd.tsx` | 结构化数据（HomeJsonLd） |
| `src/components/ui/Card.tsx` | 卡片组件 |
| `src/components/ui/Button.tsx` | 按钮组件 |

### 间接影响（布局/全局）

| 文件 | 说明 |
|------|------|
| `src/app/[locale]/layout.tsx` | locale 布局（ThemeProvider、Footer） |
| `src/app/layout.tsx` | 根布局（GA4、字体） |
| `src/lib/seo.ts` | SEO 工具函数（metadata 生成） |
| `src/lib/analytics.ts` | GA4 事件（首页 funnel_home_view） |
| `src/app/api/stats/today/route.ts` | TodayCounter 依赖的 API |

### i18n 翻译文件（需同步更新）

如首页新增/修改文案，需同步更新：
- `messages/zh.json`（或对应路径）
- `messages/zh-TW.json`
- `messages/en.json`

---

## 八、发布前 Checklist

### 8.1 代码质量检查

- [ ] `npm run lint` — ESLint 无 error（warning 可接受）
- [ ] TypeScript 编译无错误：`npx tsc --noEmit`
- [ ] 删除 `.bak` 文件：`src/app/[locale]/divination/page.tsx.bak` 和 `.bak2`
- [ ] 确认无 `console.log` 调试输出残留（`console.error` 保留）
- [ ] 检查 `any` 类型使用（`TodayCounter.tsx` 第26行有 `data: any`）
- [ ] 确认所有环境变量已在生产环境配置（见下方环境变量清单）

### 8.2 环境变量清单（生产必须配置）

| 变量 | 当前状态 | 说明 |
|------|----------|------|
| `DATABASE_URL` | ✅ 已配置（本地） | 生产需指向 Neon/云 PostgreSQL |
| `NEXTAUTH_SECRET` | ✅ 已配置 | — |
| `NEXTAUTH_URL` | ⚠️ 指向 localhost | 生产需改为 `https://51yijing.com` |
| `DEEPSEEK_API_KEY` | ✅ 已配置 | — |
| `OPENAI_API_KEY` | ✅ 已配置 | — |
| `STRIPE_SECRET_KEY` | ✅ 已配置 | — |
| `STRIPE_WEBHOOK_SECRET` | ✅ 已配置 | — |
| `UPSTASH_REDIS_REST_URL` | ⚠️ placeholder | 若启用 Redis 限速需配置 |
| `UPSTASH_REDIS_REST_TOKEN` | ⚠️ placeholder | 同上 |
| `GOOGLE_CLIENT_ID` | ⚠️ placeholder | Google OAuth 需配置 |
| `GOOGLE_CLIENT_SECRET` | ⚠️ placeholder | 同上 |
| `NEXT_PUBLIC_GA_ID` | ⚠️ `G-XXXXXXXXXX` | **必须替换为真实 GA4 ID** |

### 8.3 构建验证步骤

```bash
# 1. 安装依赖
cd /root/.openclaw/workspace/developer/iching-app
npm ci

# 2. 生成 Prisma Client
npx prisma generate

# 3. TypeScript 类型检查
npx tsc --noEmit

# 4. ESLint
npm run lint

# 5. 生产构建
npm run build
# 等价于: rm -rf .next && next build

# 6. 本地预览生产构建
npm run start
# 访问 http://localhost:3000 验证关键页面

# 7. 健康检查
curl http://localhost:3000/api/health
# 期望: { "status": "ok", ... }
```

### 8.4 部署步骤（腾讯云）

```bash
# 在服务器上执行
cd /path/to/iching-app

# 拉取最新代码
git pull origin main

# 安装依赖（生产）
npm ci --production=false

# 生成 Prisma Client
npx prisma generate

# 执行数据库迁移（如有 schema 变更）
npx prisma migrate deploy

# 构建
npm run build

# 重启服务（PM2）
pm2 restart iching-app
# 或
pm2 reload iching-app --update-env
```

### 8.5 回滚 SOP

#### 快速回滚（代码回滚）

```bash
# 1. 查看最近提交记录
git log --oneline -10

# 2. 回滚到上一个稳定版本（替换 <commit-hash>）
git revert HEAD --no-edit
# 或强制回到指定 commit（危险，会丢失后续提交）
git reset --hard <commit-hash>

# 3. 推送回滚
git push origin main

# 4. 在服务器重新构建部署
git pull origin main
npm ci --production=false
npx prisma generate
npm run build
pm2 restart iching-app
```

#### 数据库回滚（Prisma Migration）

```bash
# 查看迁移历史
npx prisma migrate status

# 回滚到指定迁移（Prisma 不支持自动 down migration）
# 手动方式：
# 1. 找到上一个迁移的 SQL
ls prisma/migrations/

# 2. 连接数据库手动执行回滚 SQL
psql $DATABASE_URL

# 3. 更新 _prisma_migrations 表标记
# UPDATE "_prisma_migrations" SET "rolled_back_at" = NOW() WHERE "migration_name" = '<migration_name>';
```

#### 紧急回滚（PM2 + 旧构建）

```bash
# 如果保留了旧的 .next 目录备份
cp -r .next.backup .next
pm2 restart iching-app

# 验证回滚成功
curl https://51yijing.com/api/health
```

---

## 九、监控要点

### 9.1 关键指标

| 指标 | 监控方式 | 告警阈值 |
|------|----------|----------|
| 服务可用性 | `GET /api/health` | 响应非 200 立即告警 |
| 响应时间 | Cloudflare Analytics / 腾讯云监控 | P95 > 3s 告警 |
| DB 连接 | Prisma 错误日志 | 连接失败 > 3次/分钟 |
| AI 解读成功率 | `funnel_ai_interpret_complete.success=false` GA4 | 失败率 > 20% |
| 每日占卜量 | `/api/stats/summary` | 异常骤降（< 前7日均值50%） |
| 错误率 | PM2 logs / 腾讯云日志服务 | 5xx > 1% |

### 9.2 日志检查命令

```bash
# PM2 实时日志
pm2 logs iching-app --lines 100

# 过滤错误
pm2 logs iching-app | grep -i error

# 查看 AI 解读错误
pm2 logs iching-app | grep "\[ai\]"
```

### 9.3 GA4 监控事件

重点关注以下 GA4 事件漏斗转化率：
1. `funnel_home_view` → `funnel_start_click`（首页转化率）
2. `funnel_question_submit` → `funnel_hexagram_formed`（占卜完成率）
3. `funnel_result_view` → `funnel_ai_interpret_complete`（AI 解读完成率）
4. `divination_limit_reached` → `click_upgrade_pro`（商业化转化）

---

## 十、已知风险与建议

| 风险 | 严重度 | 建议 |
|------|--------|------|
| `NEXT_PUBLIC_GA_ID` 为占位符 | 高 | 上线前必须配置真实 GA4 ID |
| `NEXTAUTH_URL` 指向 localhost | 高 | 生产环境必须改为 `https://51yijing.com` |
| Google OAuth 未配置 | 中 | 若需 Google 登录，配置 `GOOGLE_CLIENT_ID/SECRET` |
| 内存限速不支持多实例 | 中 | 多实例部署时接入 Upstash Redis |
| `Divination.userId` 无索引 | 低 | 用户历史查询频繁时补加 `@@index([userId])` |
| `.bak` 文件残留在代码库 | 低 | 删除 `divination/page.tsx.bak*` |
| next-auth v5 beta | 低 | 关注正式版发布，及时升级 |
| SPA 路由变化无 GA4 page_view | 低 | 补充 `usePathname` 监听路由变化触发 gtag |
