# 发布前 Checklist & 回滚 SOP

> 部署目标：腾讯云 `43.163.4.94`，pm2 进程 `iching-app`，通过 GitHub Actions 自动部署。

---

## 发布前 Checklist

### 阶段一：代码准备（推送前）

```bash
cd /root/.openclaw/workspace/developer/iching-app
```

- [ ] **构建通过**
  ```bash
  npm run build
  # 确认无 Error，Warning 可接受
  ```

- [ ] **Lint 通过**
  ```bash
  npm run lint
  # 零 error
  ```

- [ ] **回归测试完成**
  - 参考 `docs/regression-test-checklist.md`，所有项打 ✅

- [ ] **环境变量确认**（对照生产服务器）
  ```bash
  # 本地 .env 中以下变量均已配置且有效：
  # DATABASE_URL / NEXTAUTH_SECRET / NEXTAUTH_URL
  # DEEPSEEK_API_KEY / OPENAI_API_KEY
  # STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET
  # UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
  # GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
  # NEXT_PUBLIC_GA_ID
  ```

- [ ] **数据库迁移检查**
  ```bash
  npx prisma migrate status
  # 确认无 pending migrations，或已准备好迁移脚本
  ```

- [ ] **记录当前生产版本（用于回滚）**
  ```bash
  ssh ubuntu@43.163.4.94 "cd /home/ubuntu/iching-app && git rev-parse HEAD"
  # 记录此 commit hash：_______________________
  ```

---

### 阶段二：部署执行

- [ ] **推送到 main 分支**
  ```bash
  git push origin main
  # 触发 GitHub Actions: .github/workflows/deploy.yml
  ```

- [ ] **监控 Actions 执行**
  - 打开 GitHub → Actions → 确认 workflow 绿色通过
  - 预计耗时：3-5 分钟

- [ ] **部署后健康检查**
  ```bash
  # 等待 30 秒让服务重启
  sleep 30
  curl -s https://你的域名/api/health | python3 -m json.tool
  # 预期：{"status": "ok", "uptime": ..., "version": "0.1.0"}
  ```

- [ ] **pm2 进程状态确认**
  ```bash
  ssh ubuntu@43.163.4.94 "pm2 status iching-app"
  # 确认 status: online，restart 次数未异常增加
  ```

---

### 阶段三：部署后验证（5 分钟快速验证）

- [ ] 首页三语言可访问（`/zh` `/zh-TW` `/en`）
- [ ] 占卜核心流程走通一次
- [ ] 登录功能正常
- [ ] 无 JS 控制台报错（F12 检查）
- [ ] 移动端首页布局正常

---

## 回滚 SOP

### 触发条件（满足任一即回滚）

- 部署后 `/api/health` 返回非 200
- pm2 进程频繁重启（restart > 3 次/分钟）
- 核心功能（占卜、登录）不可用
- 错误率突增（服务器日志 5xx > 1%）

---

### 回滚步骤

**方式一：Git 回滚（推荐，< 5 分钟）**

```bash
# 1. 登录服务器
ssh ubuntu@43.163.4.94

# 2. 进入项目目录
cd /home/ubuntu/iching-app

# 3. 查看最近提交记录，找到上一个稳定版本
git log --oneline -10

# 4. 回滚到指定 commit（替换 <COMMIT_HASH>）
git checkout <COMMIT_HASH>

# 5. 重新安装依赖并构建
npm install --production=false
npm run build

# 6. 重启服务
pm2 restart iching-app

# 7. 验证
sleep 10
curl -s http://localhost:3000/api/health
pm2 status iching-app
```

**方式二：强制推送回滚（触发 CI/CD）**

```bash
# 本地操作
git revert HEAD --no-edit        # 创建回滚 commit
git push origin main             # 触发自动部署
```

**方式三：紧急直接重启（服务崩溃时）**

```bash
ssh ubuntu@43.163.4.94
pm2 restart iching-app
pm2 logs iching-app --lines 50   # 查看错误原因
```

---

### 数据库回滚（如有 migration）

```bash
ssh ubuntu@43.163.4.94
cd /home/ubuntu/iching-app

# 查看 migration 历史
npx prisma migrate status

# 回滚最后一次 migration（谨慎操作，可能丢数据）
npx prisma migrate resolve --rolled-back <migration_name>

# 或直接连接数据库手动回滚
# psql $DATABASE_URL
```

> ⚠️ 数据库回滚有数据丢失风险，操作前务必确认影响范围。

---

### 回滚后确认

```bash
# 1. 健康检查
curl -s https://你的域名/api/health

# 2. 确认版本已回滚
ssh ubuntu@43.163.4.94 "cd /home/ubuntu/iching-app && git rev-parse HEAD"

# 3. pm2 状态
ssh ubuntu@43.163.4.94 "pm2 status"

# 4. 查看最近日志确认无报错
ssh ubuntu@43.163.4.94 "pm2 logs iching-app --lines 30"
```

---

## 紧急联系 & 资源

| 资源 | 地址 |
|------|------|
| 服务器 | `43.163.4.94` (ubuntu) |
| GitHub Actions | `https://github.com/<org>/iching-app/actions` |
| pm2 监控 | `ssh ubuntu@43.163.4.94 "pm2 monit"` |
| 健康检查 | `https://你的域名/api/health` |

---

**文档版本**: v1.0  
**最后更新**: 2026-04-14
