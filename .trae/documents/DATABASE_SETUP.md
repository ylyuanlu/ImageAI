# ImageAI 数据库设置指南

## 📋 概述

本项目使用 **PostgreSQL** 作为数据库，**Prisma** 作为 ORM 工具。

## 🚀 快速开始

### 方式一：使用 Docker（推荐）

1. **安装 Docker**
   - Windows/Mac: [Docker Desktop](https://www.docker.com/products/docker-desktop)
   - Linux: `sudo apt install docker.io docker-compose`

2. **启动数据库**
   ```bash
   docker-compose up -d
   ```

3. **验证数据库运行**
   ```bash
   docker ps
   # 应该看到 imageai-postgres 容器在运行
   ```

### 方式二：使用本地 PostgreSQL

1. **安装 PostgreSQL**
   - Windows: [下载安装包](https://www.postgresql.org/download/windows/)
   - Mac: `brew install postgresql`
   - Linux: `sudo apt install postgresql`

2. **创建数据库**
   ```sql
   CREATE DATABASE imageai;
   CREATE USER imageai WITH PASSWORD 'imageai123';
   GRANT ALL PRIVILEGES ON DATABASE imageai TO imageai;
   ```

3. **更新连接字符串**
   编辑 `.env.local` 文件：
   ```env
   DATABASE_URL="postgresql://imageai:imageai123@localhost:5432/imageai?schema=public"
   ```

### 方式三：使用云数据库

#### Supabase（推荐免费方案）
1. 访问 [Supabase](https://supabase.com) 创建账号
2. 创建新项目
3. 在 Settings > Database 中获取连接字符串
4. 更新 `.env.local`

#### Neon
1. 访问 [Neon](https://neon.tech) 创建账号
2. 创建项目
3. 复制连接字符串到 `.env.local`

## 🗄️ 数据库迁移

### 自动设置（推荐）

运行一键设置脚本：

```powershell
# Windows PowerShell
.\scripts\db-setup.ps1
```

### 手动设置

1. **生成 Prisma Client**
   ```bash
   npx prisma generate
   ```

2. **执行迁移**
   ```bash
   npx prisma migrate dev --name init
   ```

3. **导入种子数据**
   ```bash
   npx prisma db seed
   ```

## 📊 数据库结构

### 核心表

| 表名 | 说明 |
|------|------|
| `User` | 用户信息 |
| `Subscription` | 会员订阅信息 |
| `Quota` | 用户生成额度 |
| `Generation` | 生成记录 |
| `Pose` | 姿势库 |
| `Outfit` | 穿搭模板 |
| `Payment` | 支付记录 |
| `Config` | 系统配置 |

### 关系图

```
User (1) ──── (1) Subscription
    │
    ├──── (1) Quota
    │
    └──── (N) Generation

Pose (独立表)
Outfit (独立表)
Payment (N) ──── (1) User
Config (独立表)
```

## 🛠️ 常用命令

### 查看数据库
```bash
# 打开 Prisma Studio（图形界面）
npx prisma studio
```

### 重置数据库
```bash
# 删除所有数据并重新迁移
npx prisma migrate reset
```

### 创建新迁移
```bash
# 修改 schema.prisma 后执行
npx prisma migrate dev --name 迁移名称
```

### 查看迁移状态
```bash
npx prisma migrate status
```

### 生成客户端（schema 变更后）
```bash
npx prisma generate
```

## 🔧 故障排除

### 问题 1: 连接失败
```
Error: P1001: Can't reach database server
```
**解决**: 检查数据库是否运行，连接字符串是否正确

### 问题 2: 权限不足
```
Error: P1010: User was denied access
```
**解决**: 检查数据库用户权限

### 问题 3: 数据库不存在
```
Error: P1003: Database does not exist
```
**解决**: 创建数据库 `CREATE DATABASE imageai;`

### 问题 4: 迁移锁定
```
Error: P3005: The database schema is not empty
```
**解决**: 
```bash
npx prisma migrate reset
# 或
npx prisma migrate resolve --rolled-back 迁移名
```

## 📈 生产环境配置

### 连接池配置
在 `.env.local` 中添加：
```env
DATABASE_URL="postgresql://...?connection_limit=10&pool_timeout=20"
```

### SSL 配置（云数据库）
```env
DATABASE_URL="postgresql://...&sslmode=require"
```

## 📝 数据库备份

### 导出数据
```bash
# Docker 方式
docker exec imageai-postgres pg_dump -U imageai imageai > backup.sql

# 本地 PostgreSQL
pg_dump -U imageai imageai > backup.sql
```

### 导入数据
```bash
# Docker 方式
docker exec -i imageai-postgres psql -U imageai imageai < backup.sql

# 本地 PostgreSQL
psql -U imageai imageai < backup.sql
```

## 🔒 安全建议

1. **使用强密码** - 生产环境使用随机生成的强密码
2. **限制访问** - 数据库只监听本地或私有网络
3. **定期备份** - 设置自动备份策略
4. **SSL 连接** - 生产环境强制使用 SSL
5. **最小权限** - 应用使用最小权限的数据库用户

## 📚 相关文档

- [Prisma 文档](https://www.prisma.io/docs)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)
- [Prisma Migrate 指南](https://www.prisma.io/docs/concepts/components/prisma-migrate)

## 💡 提示

- 开发时使用 `npx prisma studio` 可以方便地查看和编辑数据
- 修改 `schema.prisma` 后记得运行 `npx prisma migrate dev`
- 种子数据包含默认姿势和穿搭模板，方便快速测试
