# 51yijing.com 开发全流程

> 从概念到上线的完整工作流，适用于「一人 + AI」团队。

## 流程总览

```
概念 → 产品文档 → 设计 → 开发(分支) → 测试 → PR Review → 预览验证 → 合并 main → CI → 自动部署 → 线上验证
```

---

## 1. 概念阶段

**输入：** 飞书聊天中的想法、GA 数据洞察、用户反馈
**输出：** `docs/prd/<feature-name>.md`

每个功能在动手写代码前，先写一份简短的产品文档：

```markdown
# 功能名称

## 背景
为什么要做这个？数据支撑是什么？

## 目标
上线后期望达到什么效果？用什么指标衡量？

## 方案
- 页面结构 / 用户流程
- 核心交互描述
- 中英文内容要求

## 边界
- 不做什么（明确排除）
- 已知风险 / 合规注意事项

## 验收标准
- [ ] 具体可检查的条目
```

---

## 2. 设计阶段

**输入：** PRD 文档
**输出：** 简单的 UI 描述或线框图（放在 `docs/design/` 下）

现阶段不需要 Figma 精稿，但需要在写代码前明确：
- 页面布局（移动端优先）
- 关键交互状态（loading / empty / error / success）
- 与现有页面的导航关系

可以用文字描述 + ASCII 线框，或者用 Excalidraw 画简单草图。

---

## 3. 开发阶段

### 3.1 分支策略

```bash
# 从 main 创建功能分支
git checkout main && git pull
git checkout -b feat/<feature-name>

# 开发完成后推送
git push origin feat/<feature-name>
```

分支命名规范：
- `feat/<name>` — 新功能
- `fix/<name>` — 修 bug
- `refactor/<name>` — 重构
- `docs/<name>` — 纯文档

**禁止直接推 main。**

### 3.2 Commit 规范

```
<type>: <简短描述>

type: feat / fix / refactor / docs / perf / chore
```

### 3.3 测试

#### 单元测试（Vitest + React Testing Library）

```bash
npm run test        # 跑全部测试
npm run test:watch  # 开发时 watch 模式（手动在终端跑）
```

测试文件放在 `__tests__/` 目录或与源文件同级 `*.test.ts(x)`。

优先覆盖：
- API routes（`/api/divination`, `/api/health` 等）
- 核心工具函数（卦象计算、i18n 等）
- 关键组件的交互逻辑

#### E2E 测试（Playwright）

```bash
npm run test:e2e    # 跑 E2E
```

覆盖核心用户路径：
- 首页 → 占卜 → 摇卦 → 结果页
- 语言切换（中/英/繁）
- 分享海报生成

---

## 4. PR Review

### 4.1 创建 PR

```bash
# 推送分支后，创建 PR
gh pr create --title "feat: <描述>" --body "关联 PRD: docs/prd/<name>.md"
```

PR 模板（自动填充）：

```markdown
## 改了什么
简述变更内容

## 关联文档
- PRD: docs/prd/xxx.md

## 测试
- [ ] 单元测试通过
- [ ] E2E 测试通过（如涉及页面变更）
- [ ] 手动验证过预览环境

## 截图（如有 UI 变更）
```

### 4.2 CI 自动检查（PR 触发）

PR 推送后 CI 自动跑：
1. Lint（ESLint）
2. 单元测试（Vitest）
3. Build
4. （可选）E2E 测试

全部通过才能合并。

### 4.3 Review 流程

- AI（我）写代码 → 郭郭在 GitHub 上看 PR diff
- 有问题直接在飞书说，我改完再推
- 确认没问题 → 合并到 main

---

## 5. 预览环境

### 方案：Vercel Preview Deployments

每个 PR 自动生成一个预览 URL（如 `feat-daily-lesson-xxx.vercel.app`），郭郭可以直接在手机/电脑上看效果。

配置：
- Vercel 项目连接 GitHub repo
- 生产部署仍走腾讯云（Vercel 仅用于预览）
- 环境变量在 Vercel 中配置 preview 专用值

**替代方案（如不想用 Vercel）：**
服务器上开 staging 端口（如 3001），Nginx 配 `staging.51yijing.com`，PR 合并到 `staging` 分支时自动部署。

---

## 6. 合并 & 部署

```
PR 合并到 main
    ↓
CI workflow（lint + test + build）
    ↓ 通过
Deploy workflow（SSH → git pull → build → pm2 restart → health check）
    ↓
线上生效
```

部署失败自动回滚到上一个 commit（已有机制）。

---

## 7. 线上验证

部署完成后检查：
1. Health check：`https://51yijing.com/api/health` 返回 `{"status":"ok"}`
2. 手动验证核心路径（占卜流程、新功能页面）
3. 检查 GA / Clarity 是否有异常

---

## 目录结构约定

```
docs/
├── prd/                    # 产品需求文档
│   └── <feature-name>.md
├── design/                 # 设计稿 / 线框图
│   └── <feature-name>/
├── plans/                  # 实施计划
│   └── <date>-<name>.md
└── regression-test-checklist.md  # 手动回归清单
```

---

## 落地优先级

### 第一步（立即）
- [x] 文档化此流程
- [ ] 安装 Vitest + React Testing Library
- [ ] 给 CI 加 test 步骤
- [ ] 设置 GitHub 分支保护（main 禁止直推，必须 PR）

### 第二步（本周）
- [ ] 写核心路径的单元测试（API routes + 卦象计算）
- [ ] 配置 Vercel 预览环境（或 staging 子域名）
- [ ] 创建 PR 模板 `.github/pull_request_template.md`

### 第三步（持续）
- [ ] 逐步补 E2E 测试（Playwright）
- [ ] 每个新功能先写 PRD 再动手
