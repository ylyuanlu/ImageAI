---
name: "db-migrate"
description: "自动化数据库迁移管理，支持 SQLite 和 PostgreSQL 切换。Invoke when user needs to migrate database, switch database provider, or sync schema changes."
---

# 数据库迁移管理技能

## 功能
自动管理数据库迁移，支持开发环境和生产环境的数据库同步。

## 触发条件
- "数据库迁移"
- "切换数据库"
- "同步数据库"
- "db migrate"
- "prisma migrate"

## 支持的数据库

| 数据库 | 适用场景 | 特点 |
|--------|---------|------|
| SQLite | 本地开发 | 零配置，文件存储 |
| Neon PostgreSQL | 开发/生产 | Serverless，自动扩展 |
| 阿里云 RDS | 生产环境 | 高性能，企业级 |

## 快速命令

### 查看当前数据库状态
```bash
/db status
```

### 切换到 SQLite（本地开发）
```bash
/db use sqlite
```

### 切换到 PostgreSQL（生产环境）
```bash
/db use postgresql
```

### 创建新的迁移
```bash
/db migrate --name add_user_table
```

### 应用迁移到数据库
```bash
/db deploy
```

### 重置数据库（危险！）
```bash
/db reset
```

### 同步生产数据库到本地
```bash
/db sync from-production
```

## 自动化迁移流程

### 场景 1：从 SQLite 切换到 PostgreSQL

```bash
# 1. 备份 SQLite 数据（可选）
/db backup sqlite

# 2. 更新 schema.prisma
# 自动修改 provider = "postgresql"

# 3. 删除旧迁移（SQLite 不兼容）
# 自动执行：rm -rf prisma/migrations

# 4. 创建新迁移
# 自动执行：npx prisma migrate dev --name init

# 5. 应用迁移到 PostgreSQL
# 自动执行：npx prisma migrate deploy

# 6. 验证连接
# 自动执行：npx prisma db pull
```

### 场景 2：Schema 变更后同步

```bash
# 1. 修改 schema.prisma
# 2. 创建迁移
/db migrate --name add_new_feature

# 3. 应用迁移
/db deploy

# 4. 更新 Prisma Client
npx prisma generate
```

### 场景 3：生产环境部署

```bash
# 1. 验证迁移文件
/db validate

# 2. 应用迁移（不删除数据）
/db deploy

# 3. 验证数据库结构
/db check
```

## 迁移文件管理

### 迁移文件结构
```
prisma/migrations/
├── 20260222072134_init/
│   └── migration.sql
├── 20260222083015_add_user_avatar/
│   └── migration.sql
└── migration_lock.toml
```

### 迁移命名规范
- `init` - 初始迁移
- `add_xxx` - 添加表/字段
- `modify_xxx` - 修改结构
- `remove_xxx` - 删除表/字段

## 数据库切换指南

### 本地开发 → Neon 数据库

```bash
# 1. 获取 Neon 连接字符串
# 从 Vercel 控制台复制 DATABASE_URL

# 2. 执行切换
/db use postgresql

# 3. 输入连接字符串
# 提示：请输入 DATABASE_URL:

# 4. 自动完成
# - 更新 .env.local
# - 修改 schema.prisma
# - 重置迁移历史
# - 创建新迁移
# - 应用到数据库
```

### Neon → 阿里云 RDS

```bash
# 1. 在阿里云创建 RDS 实例
# 2. 获取连接字符串

# 3. 执行切换
/db use postgresql

# 4. 输入新的连接字符串

# 5. 数据迁移（如果需要）
/db transfer from=neon to=rds
```

## 常见问题处理

### 问题 1：迁移锁定文件冲突

**错误**：`migration_lock.toml` 中的 provider 不匹配

**解决**：
```bash
# 删除迁移历史，重新创建
/db reset-migrations

# 这会：
# 1. 备份现有迁移
# 2. 删除 migrations 目录
# 3. 创建新的初始迁移
```

### 问题 2：数据库连接失败

**错误**：`P1001: Can't reach database server`

**解决**：
```bash
# 1. 检查网络连接
/db ping

# 2. 验证连接字符串
/db validate-connection

# 3. 测试连接
npx prisma db pull
```

### 问题 3：迁移应用失败

**错误**：`P3018: A migration failed to apply`

**解决**：
```bash
# 1. 查看失败详情
npx prisma migrate status

# 2. 修复后重试
/db deploy

# 3. 或者跳过失败迁移（危险！）
/db resolve --rolled-back
```

## 数据备份与恢复

### 备份 SQLite
```bash
/db backup sqlite
# 生成：backups/sqlite_20260222_143022.db
```

### 备份 PostgreSQL
```bash
/db backup postgresql
# 使用 pg_dump 导出数据
```

### 恢复数据
```bash
/db restore --file backups/sqlite_20260222_143022.db
```

## 多环境管理

### 环境配置

| 环境 | 数据库 | 迁移策略 |
|------|--------|---------|
| 开发 | SQLite | 快速迭代，可重置 |
| 测试 | Neon | 与生产一致 |
| 生产 | Neon/RDS | 谨慎操作，备份优先 |

### 生产环境部署检查清单

- [ ] 已备份生产数据库
- [ ] 迁移文件已测试
- [ ] 回滚方案已准备
- [ ] 维护时间窗口已确定
- [ ] 监控告警已配置

## 最佳实践

### 1. 开发流程
```
修改 schema.prisma
    ↓
创建迁移：/db migrate --name xxx
    ↓
本地测试：/db deploy
    ↓
提交代码（包含迁移文件）
    ↓
CI/CD 自动部署迁移
```

### 2. 生产部署
```
备份数据库
    ↓
应用迁移：/db deploy
    ↓
验证数据完整性
    ↓
监控应用状态
```

### 3. 回滚策略
```bash
# 如果迁移失败，快速回滚
/db rollback

# 或者恢复到特定版本
/db reset --to 20260222072134_init
```

## 命令速查表

| 命令 | 功能 |
|------|------|
| `/db status` | 查看数据库状态 |
| `/db use sqlite` | 切换到 SQLite |
| `/db use postgresql` | 切换到 PostgreSQL |
| `/db migrate --name xxx` | 创建迁移 |
| `/db deploy` | 应用迁移 |
| `/db reset` | 重置数据库 |
| `/db backup` | 备份数据库 |
| `/db restore --file xxx` | 恢复数据库 |
| `/db validate` | 验证迁移 |
| `/db sync from-production` | 同步生产数据 |
