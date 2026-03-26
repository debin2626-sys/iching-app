# 易经网站部署指南

## 🚀 部署架构

### 推荐架构
```
用户 → CDN (Cloudflare/Vercel) → Next.js 应用 (Vercel/Cloudflare Pages)
                    ↓
              PostgreSQL (Neon/PlanetScale)
                    ↓
                Redis (Upstash)
                    ↓
              AI APIs (DeepSeek/OpenAI)
```

## 📦 部署选项

### 选项1: Vercel (推荐)
**优势**: 与 Next.js 深度集成，自动优化
**步骤**:
```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel --prod
```

**环境变量配置**:
- 在 Vercel 控制台设置所有环境变量
- 使用 Vercel 的 Secrets 管理敏感信息

### 选项2: Cloudflare Pages
**优势**: 全球 CDN，边缘计算
**配置** (`wrangler.toml` 已存在):
```bash
# 安装 Wrangler
npm install -g wrangler

# 登录
wrangler login

# 部署
wrangler pages deploy .next --project-name=iching-app
```

### 选项3: 自托管 (Docker)
创建 `Dockerfile`:
```dockerfile
FROM node:20-alpine AS base

# 依赖阶段
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# 构建阶段
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 运行阶段
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

创建 `docker-compose.yml`:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
      - UPSTASH_REDIS_REST_URL=${UPSTASH_REDIS_REST_URL}
      - UPSTASH_REDIS_REST_TOKEN=${UPSTASH_REDIS_REST_TOKEN}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## 🔧 生产环境配置

### 1. 环境变量检查清单
```bash
# 必须配置
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="强随机密钥"
NEXTAUTH_URL="https://your-domain.com"

# AI 服务
OPENAI_API_KEY="sk-..."
DEEPSEEK_API_KEY="sk-..."

# 支付
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# 缓存和限流
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
```

### 2. 数据库准备
```sql
-- 生产数据库初始化
CREATE DATABASE iching_prod;
CREATE USER iching_prod_user WITH PASSWORD '强密码';
GRANT ALL PRIVILEGES ON DATABASE iching_prod TO iching_prod_user;

-- 应用连接后运行
npx prisma db push
npx prisma db seed
```

### 3. SSL/TLS 配置
- 使用 Let's Encrypt 或云提供商 SSL
- 强制 HTTPS 重定向
- 配置 HSTS

## 📊 监控和告警

### 必须监控的指标
1. **应用性能**
   - 页面加载时间
   - API 响应时间
   - 错误率

2. **资源使用**
   - 内存使用率
   - CPU 使用率
   - 数据库连接数

3. **业务指标**
   - 每日活跃用户
   - 占卜请求数
   - AI 解释使用量

### 监控工具推荐
- **Vercel Analytics**: 内置性能监控
- **Sentry**: 错误监控
- **Datadog/New Relic**: 全栈监控
- **PostgreSQL 监控**: pg_stat_statements

## 🚨 故障排除

### 常见问题

#### 1. 数据库连接失败
```bash
# 检查连接
npx prisma db execute --url "$DATABASE_URL" --stdin <<< "SELECT 1;"

# 查看连接池状态
SHOW max_connections;
SHOW idle_in_transaction_session_timeout;
```

#### 2. NextAuth 会话问题
- 检查 `NEXTAUTH_SECRET` 长度和强度
- 验证 `NEXTAUTH_URL` 配置正确
- 检查数据库适配器连接

#### 3. AI API 超时
```typescript
// 调整超时时间
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 30000); // 30秒
```

#### 4. 内存泄漏
```bash
# 监控内存使用
node --inspect app.js

# 使用 clinic.js 分析
npx clinic doctor -- node app.js
```

## 🔄 持续部署

### GitHub Actions 示例
创建 `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## 📈 性能优化

### 生产环境构建
```bash
# 分析包大小
ANALYZE=true npm run build

# 生成构建报告
npx @next/bundle-analyzer
```

### 缓存策略
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: '/_next/static/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
};
```

### CDN 配置
- 静态资源使用 CDN
- 配置适当的缓存头
- 启用 Brotli/Gzip 压缩

## 🛡️ 安全最佳实践

### 部署前检查
1. [ ] 所有敏感信息使用环境变量
2. [ ] 启用 HTTPS 强制跳转
3. [ ] 配置安全响应头
4. [ ] 设置速率限制
5. [ ] 启用 WAF (Web 应用防火墙)

### 定期维护
1. **每周**: 检查依赖安全更新
2. **每月**: 轮换 API 密钥
3. **每季度**: 安全审计
4. **每年**: 渗透测试

---

## 📞 支持资源

### 紧急联系人
- **技术负责人**: [姓名]
- **安全团队**: [联系方式]
- **运维团队**: [联系方式]

### 文档链接
- [Next.js 生产部署指南](https://nextjs.org/docs/deployment)
- [Prisma 生产最佳实践](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Vercel 文档](https://vercel.com/docs)

### 监控面板
- 应用性能: [链接]
- 错误监控: [链接]
- 业务指标: [链接]

---

**部署状态**: 🟡 准备中（需先解决安全漏洞）
**预计上线时间**: 安全修复完成后 2-3 个工作日
**风险评估**: 中等（依赖第三方 AI 服务）