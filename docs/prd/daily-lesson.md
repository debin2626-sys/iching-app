# 日课产品方案 (P0-2)

> 古典智慧日课 — MVP 产品需求文档
> 最后更新: 2026-04-21 v3（合并郭郭 review 第二轮反馈）

## 1. 背景与定位

### 1.1 飞轮中的位置

```
海报获客 → 免费占卜（信任建立）→ 日课留存 → 决策报告变现 → 报告结尾生成海报 → 回到获客
                                    ↑ 你在这里
```

日课是飞轮的**留存引擎**。没有日课，用户占完一卦就走，LTV 撑不起 CAC。

留存的本质是**触达**。没有推送，用户必须"记得主动访问"，这是最弱的留存模式。因此邮件订阅是 MVP 必备，不是 Phase 2。（参考 Daily Stoic：整个商业模式建立在「每天早上一封邮件」上。）

### 1.2 合规定位

所有内容定位为**「古典智慧 / 决策框架」**，不使用「占卜」「预测」「算命」等敏感词。
- 对外话术：「每日古典智慧」「易经决策思维」「道家静心练习」
- 商户类目：文化咨询
- 内容本质：经典文本 + 现代应用解读，不涉及个人命运预测

### 1.3 为什么先上 2 个流派

| 考量 | 结论 |
|------|------|
| 选择悖论 | 8 个流派让用户不知道选哪个，2 个刚好形成对比 |
| 内容量 | 2×365=730 条 vs 8×365=2920 条，MVP 可控 |
| 差异化 | 易经卦序（理性决策）vs 道家清静（感性修养），覆盖两种用户心智 |
| LLM 风险 | 2 个流派更容易工程化控制输出差异，避免 sycophancy |

剩余 6 个流派挂 Coming Soon + 邮箱收集意向：
1. 儒家修身派（曾国藩日课）
2. 兵法谋略派（孙子兵法）
3. 禅宗公案派
4. 中医养生派（节气 + 经络）
5. 诗词意境派（唐诗宋词）
6. 周易象数派（梅花易数）

---

## 2. MVP 流派定义

### 2.1 易经卦序派 — 「今日一卦」

**核心理念**：按周易六十四卦序，每日一卦，以卦辞爻辞映射当日决策场景。

**内容结构**（每条约 300-500 字）：

```
┌─────────────────────────────────┐
│  ☰ 第 N 天 · 乾卦 (卦序第1)     │
│  "天行健，君子以自强不息"         │
│  📅 2026年4月21日 · 农历三月初五  │
│     谷雨 · 辛巳年 壬辰月 甲子日   │
├─────────────────────────────────┤
│  📖 经典原文                     │
│  卦辞 + 当日对应爻辞（按日轮转）   │
├─────────────────────────────────┤
│  💡 今日智慧                     │
│  ┌ 适合做什么（40%）             │
│  ├ 不适合做什么（40%）           │
│  └ 今日认知盲点（20%）           │
├─────────────────────────────────┤
│  🎯 行动建议                     │
│  一句话可执行的今日提醒（动词开头） │
├─────────────────────────────────┤
│  🔗 想深入了解？                  │
│  → 查看完整卦辞解读               │
│  → 📊 深度决策分析 →              │  ← 跳转小报童 xiaobot.net
└─────────────────────────────────┘
```

**轮转逻辑**：
- 64 卦 × 6 爻 = 384 天为一个完整周期
- Day 1 = 乾卦初九，Day 2 = 乾卦九二 ... Day 7 = 坤卦初六
- 周期结束后从头循环
- 所有用户看到相同内容（非个性化），降低内容生产成本

### 2.2 道家清静派 — 「每日静心」

**核心理念**：以《道德经》《清静经》《庄子》为源，每日一段经典 + 呼吸/冥想引导。

**内容结构**（每条约 200-400 字）：

```
┌─────────────────────────────────┐
│  ☯ 第 N 天 · 清静篇             │
│  "致虚极，守静笃"                │
│  📅 2026年4月21日 · 农历三月初五  │
├─────────────────────────────────┤
│  📖 经典原文                     │
│  《道德经》第十六章（节选）        │
├─────────────────────────────────┤
│  🧘 静心引导（2 分钟）            │
│  今日呼吸练习：4-7-8 呼吸法       │
│  配合经文意境的简短冥想词          │
├─────────────────────────────────┤
│  ✨ 一日一悟                     │
│  将经典智慧融入日常的一个小练习     │
├─────────────────────────────────┤
│  🔗 想深入了解？                  │
│  → 查看本章完整解读               │
│  → 📊 深度静心报告 →             │  ← 跳转小报童 xiaobot.net
└─────────────────────────────────┘
```

**轮转逻辑**：
- 《道德经》81 章 + 《清静经》分段 + 《庄子》内篇精选 ≈ 120 条
- 120 天为一个周期，循环播放
- 同样全局统一内容

---

## 3. 内容生产方案

### 3.1 混合生成策略

**不是纯 LLM 生成，也不是纯人工编写。**

| 部分 | 生产方式 | 说明 |
|------|---------|------|
| 经典原文 | 数据库已有 | Hexagram 表已有 64 卦完整卦辞爻辞 |
| 今日智慧 / 一日一悟 | LLM 批量预生成 | DeepSeek 批量生成 → **全量人工审核** → 入库 |
| 行动建议 | LLM 预生成 | 同上 |
|| 静心引导 | LLM 初稿 + 人工精修 | LLM 强约束 prompt 生成初稿 → 人工精修节奏感（参考 Calm/Headspace 结构，去版权化）。每条精修 5-10 分钟，总 10-20 小时 |

### 3.2 预生成流程

```
1. 编写 prompt 模板（每个流派一套，含硬性约束，见 §3.3）
2. 批量调用 DeepSeek API 生成 384 条（卦序派）+ 120 条（清静派）
3. 全量人工审核 504 条（约 25 小时 ≈ 3-5 工作日，可找人分担）
   - 重点审：AI 腔 / 伪文言 / 滥用排比 / 无条件乐观
4. 导入数据库 DailyLesson 表
5. 上线后按日期自动轮转展示
```

### 3.3 吉凶元数据（反 sycophancy 基础）

Hexagram 表新增 `nature` 字段，人工定义 64 卦吉凶属性：

```prisma
model Hexagram {
  // ... 现有字段
  nature    String?  // "ji"(吉) | "xiong"(凶) | "ping"(平) | "mixed"(吉凶混杂)
}
```

- 施工前花 1 小时定义 64 卦 nature（参考通用传统判定），存进 DB
- Prompt 生成时把 nature 作为 metadata 传给 LLM
- 指令固定：`nature=ji → 触发"过盛则衰"提醒`，`nature=xiong → 触发"困中有机"指向`
- **把吉凶判断权从 LLM 手里收回，交给人**

### 3.4 反 sycophancy 设计

易经卦序派「今日智慧」prompt 硬性约束：

```
1. 「今日智慧」必须包含以下三段（顺序固定）:
   - 适合做什么（40% 篇幅）
   - 不适合做什么（40% 篇幅）
   - 今日的一个认知盲点（20% 篇幅）

2. 严禁出现以下词汇："一切都会好"、"前途光明"、"必将成功"、
   "顺利平安"、"贵人相助"等无条件乐观表达

3. 「行动建议」必须是具体动作（动词开头），不能是心态口号
   ✅ "今天和 3 个月没联系的前同事发一条消息"
   ❌ "保持乐观心态迎接机遇"

4. 根据 Hexagram.nature 元数据（见 §3.3）强制触发对应段落：
   nature=ji（吉）→ 必须增加"过盛则衰"的提醒
   nature=xiong（凶）→ 必须增加"困中有机"的指向
   nature=ping（平）→ 平衡论述，不偏不倚
   nature=mixed（混杂）→ 必须明确指出"哪部分吉、哪部分凶"
```

---

## 4. 用户流程

### 4.1 入口

```
首页 → 「每日古典智慧」卡片（新增模块）
       ├── 今日一卦（易经卦序派）
       └── 每日静心（道家清静派）

占卜结果页 → 底部推荐「免费订阅，每天早上 8:00 收到一条古典智慧」+ 邮箱输入框
             ⚠️ CTA 文案必须明确「免费」，不能暗示付费（ICP 个人备案合规要求）

个人中心 → 「我的日课」入口
```

### 4.2 日课浏览页 `/daily`

```
┌──────────────────────────────────────┐
│  📅 2026年4月21日 · 农历三月初五       │
│     谷雨 · 辛巳年 壬辰月 甲子日        │
│                                      │
│  [易经卦序] [道家清静]  ← tab 切换     │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  (当日内容卡片，结构见 §2.1)    │  │
│  │  ...                           │  │
│  │  🔗 深入了解 → 卦辞详情页       │  │
│  │  📊 决策分析 → ¥9.9 轻报告     │  │
│  └────────────────────────────────┘  │
│                                      │
│  ← 前一天    [分享今日智慧]   后一天 → │
│                                      │
│  ──────────────────────────────────  │
│  🔔 每日推送                         │
│  📧 输入邮箱，每天早上 8:00 收到智慧   │
│  [____________@____] [订阅]          │
│  Coming Soon: 微信服务号推送           │
│                                      │
│  ──────────────────────────────────  │
│  📚 全部内容                         │
│  → 查看完整 384 天卦序目录            │
└──────────────────────────────────────┘
```

### 4.3 分享流程

日课内容 → 「分享今日智慧」按钮 → 生成日课专属海报 → 保存/分享

**日课海报模板**（独立于占卜海报，单独设计）：
- 视觉主角：一句金句（大字居中）
- 副标题：经典出处
- 底部：51yijing.com 二维码 → 扫码进入 /daily
- 风格参考：Notion Quotes / Daily Stoic App 的分享卡片
- 情绪调性：思考/收藏（区别于占卜海报的好奇/炫耀）
- **强制水印**：Satori 模板底部硬编码 logo + 域名，API 不提供"无水印版本"参数。每张海报都必须能把用户带回来，这是飞轮入口的关键

**这是飞轮闭环的关键节点**：日课海报 → 新用户扫码 → 免费占卜 → 订阅日课

---

## 5. 技术方案

### 5.1 slug 命名规范

动工前花 30 分钟在 Excel 列一份 slug 对照表，seed 脚本直接读这张表。

**易经卦序派**（384 条）：
```
格式: {hexagram-pinyin}-{yao-pinyin}
示例:
  qian-chujiu    (乾卦初九, dayIndex=1)
  qian-jiuer     (乾卦九二, dayIndex=2)
  qian-jiusan    (乾卦九三, dayIndex=3)
  ...
  kun-liusan     (坤卦六三, dayIndex=9)
  ...
  weiji-shangjiu (未济上九, dayIndex=384)
```

**道家清静派**（~120 条）：
```
格式: {source}-{seq}
示例:
  daodejing-01 ~ daodejing-81     (道德经 81 章)
  qingjingjing-01 ~ qingjingjing-15  (清静经 ~15 段)
  zhuangzi-xiaoyaoyou-01 ~ zhuangzi-qiwulun-10  (庄子内篇 ~24 条)
```

### 5.2 数据模型

```prisma
model DailyLesson {
  id          String   @id @default(cuid())
  school      String   // "yijing" | "daoist"
  dayIndex    Int      // 轮转序号: 1-384 (卦序) 或 1-120 (清静)
  slug        String   // URL slug: "qian-chujiu", "chapter-16"
  title       String   // "乾卦 · 初九"
  subtitle    String   // "潜龙勿用"
  classicText String   @db.Text  // 经典原文
  wisdom      String   @db.Text  // 今日智慧 / 一日一悟
  action      String   // 行动建议（一句话，动词开头）
  caution     String?  // 风险提醒（反 sycophancy）
  meditation  String?  @db.Text  // 静心引导（仅清静派）
  hexagramId  Int?     // 关联卦象（仅卦序派）
  sourceRef   String?  // 出处: "道德经第十六章"
  locale      String   @default("zh")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  hexagram    Hexagram? @relation(fields: [hexagramId], references: [number])

  @@unique([school, slug, locale])
  @@unique([school, dayIndex, locale])
  @@index([school, dayIndex])
}

model EmailSubscription {
  id          String   @id @default(cuid())
  email       String
  school      String   // "yijing" | "daoist" | "all"
  verified    Boolean  @default(false)
  verifyToken String?
  unsubToken  String   @default(cuid())
  createdAt   DateTime @default(now())

  @@unique([email, school])
  @@index([verified])
}
```

### 5.3 API 设计

```
GET  /api/daily?school=yijing&date=2026-04-21
     → 根据 date 计算 dayIndex，返回当日内容（含 slug 用于 canonical URL）

POST /api/daily/subscribe
     → { email, school } → 发送验证邮件 → 写入 EmailSubscription

GET  /api/daily/verify?token=xxx
     → 验证邮箱，verified = true

GET  /api/daily/unsubscribe?token=xxx
     → 取消订阅

POST /api/daily/send-email  (Cron 触发，需 CRON_SECRET 鉴权)
     → 查询 verified 订阅者 → 批量发送今日日课邮件
```

### 5.4 dayIndex 计算

```typescript
import { formatInTimeZone } from 'date-fns-tz'
import { differenceInDays, parseISO } from 'date-fns'

const EPOCH = process.env.DAILY_EPOCH ?? '2026-05-01'
const TIMEZONE = 'Asia/Shanghai'
const CYCLES = { yijing: 384, daoist: 120 } as const

type DayIndexResult =
  | { status: 'active'; dayIndex: number }
  | { status: 'not_launched'; launchDate: string }

function getDayIndex(date: Date, school: 'yijing' | 'daoist'): DayIndexResult {
  const shanghaiDate = formatInTimeZone(date, TIMEZONE, 'yyyy-MM-dd')
  const epochDate = formatInTimeZone(new Date(EPOCH), TIMEZONE, 'yyyy-MM-dd')
  const days = differenceInDays(parseISO(shanghaiDate), parseISO(epochDate))
  if (days < 0) {
    return { status: 'not_launched', launchDate: EPOCH }
  }
  return {
    status: 'active',
    dayIndex: (days % CYCLES[school]) + 1,
  }
}
```

**Pre-launch 策略**：EPOCH 之前访问 `/daily` 展示倒计时页面：
- 「日课 {EPOCH} 开播，立即订阅抢首批」+ 邮箱输入框
- 上线前两周收集 30-50 个邮箱 = 首日推送 DAU 不是 0

### 5.5 页面路由（SEO 友好）

```
/[locale]/daily                          → 今日入口，301 重定向到当日内容页
/[locale]/daily/yijing/[slug]            → 永久内容页，如 /daily/yijing/qian-chujiu
/[locale]/daily/daoist/[slug]            → 永久内容页，如 /daily/daoist/chapter-16
/[locale]/daily/archive                  → 全部 384+120 条目录页
```

**SEO 逻辑**：
- 384 + 120 = 504 个永久内容页，每页有独立 canonical URL
- 不用日期做 URL → 第二轮循环不产生重复内容
- 长尾关键词覆盖："乾卦初九解读"、"道德经第十六章应用"
- `/daily` 入口页用 301 重定向，不产生重复索引

### 5.6 邮件推送

```
触发方式: PM2 cron，每天北京时间 08:00
流程:
  1. 计算今日 dayIndex
  2. 查询 DailyLesson
  3. 查询 EmailSubscription (verified=true, school 匹配)
  4. 通过 Resend API 批量发送
  5. 邮件底部包含：今日内容摘要 + "查看完整内容"链接 + 取消订阅链接
```

**Resend 额度限制**：
- 免费版：3,000 封/月 + **100 封/天**（日上限是隐藏限制）
- 订阅目标 ≥ 100 人 → 每天 100 封 → 刚好卡在日上限
- 订阅破 100 立即超限，推送失败

**升级路径**（提前写好切换脚本）：
| 阶段 | 方案 | 成本 |
|------|------|------|
| 0-100 订阅 | Resend 免费版 | $0 |
| 100+ 订阅 | Resend Pro | $20/月（50,000 封/月） |
| 备选 | AWS SES | $0.10/1,000 封（需验证域名 + 脱离沙箱） |

成功指标新增：**邮件订阅 ≥ 100 时触发付费升级评估**。
代码层面：邮件发送模块抽象为 interface，Resend/SES 各一个实现，env 切换。

### 5.7 农历 & 节气

使用 `lunar-javascript` 库（MIT，含节气/干支/生肖，精度到分钟）：
- 页面顶部显示：公历日期 + 农历日期 + 当前节气 + 干支纪日
- 未来可复用于「中医养生派」节气内容

### 5.8 i18n

MVP 只做中文（zh）。英文内容作为 Phase 2，复用 Hexagram 表已有的英文字段。

---

## 6. 变现触点

| 触点 | 位置 | 转化目标 |
|------|------|---------|
| 轻报告入口 | 日课卡片底部「用此卦做决策分析」 | ¥9.9 单次报告 |
| 卦辞详情 | 「查看完整卦辞解读」链接 | 页面停留 + SEO |
| 分享海报 | 「分享今日智慧」按钮 | 新用户获客 |
| 邮件订阅 | 页面订阅框 + 占卜结果页引导 | 留存 + 未来推送报告 |
| Coming Soon | 其他 6 个流派占位 + 邮箱收集 | 意向数据 + 期待感 |

---

## 7. MVP 范围 & 排期

### 7.1 MVP 包含

- [ ] DailyLesson + EmailSubscription 数据模型 + migration
- [ ] Hexagram.nature 字段 + 64 卦吉凶定义
- [ ] slug 对照表（Excel/CSV）
- [ ] 批量内容预生成（384 + 120 条，含冥想词 LLM 初稿）
- [ ] 全量人工审核 504 条 + 冥想词精修
- [ ] `/daily` 页面（tab 切换两个流派）+ pre-launch 倒计时页
- [ ] 永久内容页 `/daily/yijing/[slug]` + `/daily/daoist/[slug]`
- [ ] 目录页 `/daily/archive`
- [ ] 日课专属分享海报模板（强制水印，不可去除）
- [ ] 首页日课入口卡片
- [ ] 占卜结果页底部引导 + 邮箱订阅框（CTA 明确「免费」）
- [ ] 邮件订阅 + 验证 + 每日推送（Resend，含 provider 抽象层）
- [ ] 农历 + 节气显示
- [ ] Coming Soon 流派列表（6 个）+ 意向收集

### 7.2 MVP 不包含（Phase 2）

- .ics 日历订阅
- 英文/繁体内容
- 个性化推荐（根据用户历史卦象）
- 微信服务号推送
- 其他流派内容
- 日课打卡/连续签到

### 7.3 预估排期

| 任务 | 工时 |
|------|------|
| 数据模型 + migration（含 Hexagram.nature） | 0.5 天 |
| 64 卦 nature 定义 + slug 对照表 | 0.5 天 |
| Prompt 工程 + 批量生成（含冥想词初稿） | 2 天 |
| 全量内容审核 504 条 + 冥想词精修 | 3-5 天（可并行，找人分担） |
| seed 脚本 | 0.5 天 |
| `/daily` 页面 + API + 永久 URL + pre-launch 页 | 2.5 天 |
| 首页入口 + 结果页引导 | 1 天 |
| 日课分享海报模板（含强制水印） | 1 天 |
| 邮件订阅 + Cron 推送（Resend，含 provider 抽象） | 1.5 天 |
| 农历库接入 | 0.5 天 |
| 测试 + 修复 | 1.5 天 |
| **合计** | **~14 天（业余时间 ≈ 3-4 周）** |

**关键路径**：内容审核。LLM 跑完后审核是瓶颈，越早并行越好。

---

## 8. 成功指标

| 指标 | 目标（上线 30 天） |
|------|-------------------|
| 日课页日均 PV | ≥ 50 |
| 次日回访率（含邮件触达） | ≥ 15% |
| 分享海报生成次数 | ≥ 30 次/周 |
| 小报童跳转率（深度分析 CTA） | ≥ 3% |
| 邮件订阅数 | ≥ 100 |
| 邮件打开率 | ≥ 30% |
| **升级触发** | **订阅 ≥ 100 → 评估 Resend Pro / AWS SES 切换** |

---

## 9. 失败条件 / Kill Switch

明确什么情况下停止投入，把资源转向其他方向：

| 条件 | 触发时间 | 动作 |
|------|---------|------|
| 日均 PV < 20 且次日回访率 < 8% | 上线 60 天后 | 停止内容更新，资源转向 P1 决策报告 |
| 邮件订阅 < 30 人 | 上线 45 天后 | 复盘获客入口是否有效，考虑砍邮件改微信 |
| 分享海报 < 5 次/周 | 上线 30 天后 | 海报模板 A/B 测试，若仍无效则砍分享功能 |
| 小报童跳转率 < 0.5% | 上线 60 天后 | 调整 CTA 文案/位置，若仍无效则变现路径需重新设计 |

---

## 10. 已决定的开放问题

| # | 问题 | 决定 |
|---|------|------|
| 1 | 农历显示？ | ✅ 做，用 lunar-javascript，0.5 天 |
| 2 | 审核深度？ | ✅ 全量 504 条逐条审核 |
| 3 | Coming Soon 流派？ | ✅ 列齐 6 个，每个挂邮箱收集意向 |
| 4 | SEO 独立 URL？ | ✅ 用内容命名永久 URL，不用日期 |
