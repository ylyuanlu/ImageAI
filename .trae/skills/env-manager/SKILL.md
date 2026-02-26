---
name: "env-manager"
description: "自动化管理环境变量，支持本地开发和生产环境配置。Invoke when user needs to configure environment variables, check env setup, or switch between development and production databases."
---

# 环境变量管理技能

## 功能
自动管理和切换环境变量配置，支持多种部署环境。

## 触发条件
- "配置环境变量"
- "切换数据库"
- "检查环境配置"
- "env setup"
- "环境配置"

## 支持的部署环境

| 环境 | 数据库 | 用途 |
|------|--------|------|
| 本地开发 | SQLite | 快速开发测试 |
| 本地开发 | Neon PostgreSQL | 连接生产数据库测试 |
| 阿里云生产 | Neon PostgreSQL | 正式生产环境 |
| Vercel | Neon PostgreSQL | 海外部署 |

## 快速命令

### 查看当前配置
```bash
/env show
```

### 切换到本地 SQLite
```bash
/env use sqlite
```

### 切换到 Neon 数据库
```bash
/env use neon
```

### 生成新的 JWT Secret
```bash
/env generate jwt
```

### 验证环境配置
```bash
/env validate
```

## 环境配置模板

### 1. 本地开发 - SQLite（默认）
```env
NODE_ENV=development
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
TONGYI_API_KEY="your-tongyi-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="ImageAI"
ENABLE_REGISTRATION="true"
ENABLE_PAYMENT="false"
```

### 2. 本地开发 - Neon 数据库
```env
NODE_ENV=development
DATABASE_URL="postgresql://user:password@host.neon.tech/db?sslmode=require"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
TONGYI_API_KEY="your-tongyi-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="ImageAI"
ENABLE_REGISTRATION="true"
ENABLE_PAYMENT="false"
```

### 3. 阿里云生产环境
```env
NODE_ENV=production
DATABASE_URL="postgresql://user:password@host.neon.tech/db?sslmode=require"
JWT_SECRET="your-strong-secret-key"
JWT_EXPIRES_IN="7d"
TONGYI_API_KEY="your-tongyi-key"
NEXT_PUBLIC_APP_URL="https://your-service.cn-hangzhou.fcapp.run"
NEXT_PUBLIC_APP_NAME="ImageAI"
ALIYUN_ACCESS_KEY_ID="your-key"
ALIYUN_ACCESS_KEY_SECRET="your-secret"
ALIYUN_OSS_REGION="oss-cn-hangzhou"
ALIYUN_OSS_BUCKET="your-bucket"
RESEND_API_KEY="your-resend-key"
FROM_EMAIL="onboarding@resend.dev"
FROM_NAME="ImageAI"
ENABLE_REGISTRATION="true"
ENABLE_PAYMENT="false"
```

## 自动化配置流程

### 步骤 1：检测当前环境
```bash
# 检查 .env.local 是否存在
# 检查当前数据库配置
# 检查必需变量是否完整
```

### 步骤 2：自动补全缺失变量
```bash
# 如果 JWT_SECRET 缺失，自动生成
# 如果 DATABASE_URL 缺失，提示用户输入
# 如果 TONGYI_API_KEY 缺失，提示配置
```

### 步骤 3：验证配置
```bash
# 测试数据库连接
# 验证 JWT Secret 格式
# 检查 API Key 有效性
```

## 环境变量检查清单

### 必需变量（所有环境）
- [ ] `DATABASE_URL` - 数据库连接字符串
- [ ] `JWT_SECRET` - JWT 签名密钥（建议 32 字符以上）
- [ ] `TONGYI_API_KEY` - 通义千问 API Key
- [ ] `NEXT_PUBLIC_APP_URL` - 应用域名

### 生产环境必需
- [ ] `NODE_ENV=production`
- [ ] `JWT_SECRET`（强随机密钥）
- [ ] 文件存储配置（OSS 或 S3）
- [ ] 邮件服务配置

### 可选变量
- [ ] `ALIYUN_ACCESS_KEY_ID` - 阿里云 OSS
- [ ] `RESEND_API_KEY` - 邮件服务
- [ ] `ENABLE_PAYMENT` - 支付功能开关

## 安全最佳实践

### 1. 密钥管理
```bash
# 生成强随机密钥
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. 文件权限
- `.env.local` - 永远不要提交到 Git
- `.env.example` - 可以提交，作为模板

### 3. 生产环境
- 使用阿里云 Secrets Manager 管理敏感信息
- 定期轮换 API Key 和 JWT Secret

## 常见问题

### Q1: 如何切换数据库？
```bash
# 从 SQLite 切换到 Neon
/env use neon

# 系统会提示输入 Neon 连接字符串
# 然后自动更新 .env.local
```

### Q2: 如何验证配置是否正确？
```bash
/env validate

# 系统会检查：
# - 所有必需变量是否存在
# - 数据库连接是否正常
# - JWT Secret 强度是否足够
```

### Q3: 部署到阿里云需要哪些变量？
```bash
/env check aliyun

# 系统会列出阿里云部署所需的所有变量
# 并检查哪些已配置，哪些缺失
```

## 配置文件说明

### .env.local（本地开发）
- 包含真实密钥
- 被 .gitignore 忽略
- 优先级最高

### .env.example（模板）
- 不包含真实密钥
- 可以提交到 Git
- 供其他开发者参考

### s.yaml 中的环境变量
- 阿里云部署时使用
- 在控制台手动配置
- 或通过 CLI 导入
