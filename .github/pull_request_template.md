## 变更说明

<!-- 简要描述这次改了什么，为什么改 -->

---

## 发布前 Checklist

> 参考完整文档：`docs/release-checklist-and-rollback-sop.md`

### 代码质量
- [ ] `npm run build` 本地构建通过，无 Error
- [ ] `npm run lint` 零 error

### 测试
- [ ] 已按 `docs/regression-test-checklist.md` 完成回归测试
- [ ] 核心流程验证：占卜功能走通
- [ ] 三语言路由验证：`/zh` `/zh-TW` `/en` 均可访问
- [ ] 移动端布局检查（Chrome DevTools iPhone 14 Pro）

### 数据库
- [ ] 无 pending migrations，或已准备好迁移脚本
- [ ] 如有 migration，已确认可回滚

### 安全
- [ ] 无新增硬编码密钥或敏感信息
- [ ] 环境变量变更已同步到生产服务器

---

## 回滚方案

<!-- 如果这次部署出问题，回滚步骤是什么？参考 docs/release-checklist-and-rollback-sop.md -->

当前生产 commit（部署前记录）: `______`
