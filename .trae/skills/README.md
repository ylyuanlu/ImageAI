# ImageAI 自动化部署技能集

## 概述

这套技能集让部署变得简单快捷，告别繁琐的手动配置！

## 包含的技能

| 技能 | 文件路径 | 功能 |
|------|---------|------|
| **auto-deploy** | `.trae/skills/auto-deploy/SKILL.md` | 一键部署到阿里云 |
| **env-manager** | `.trae/skills/env-manager/SKILL.md` | 环境变量管理 |
| **db-migrate** | `.trae/skills/db-migrate/SKILL.md` | 数据库迁移管理 |

## 快速开始

### 场景 1：一键部署到阿里云

```bash
# 直接对我说：
"帮我部署到阿里云"
"一键部署"
"deploy to aliyun"

# 我会自动：
# 1. 检查所有配置
# 2. 构建项目
# 3. 应用数据库迁移
# 4. 部署到阿里云 FC
# 5. 验证部署结果
```

### 场景 2：切换数据库

```bash
# 从 SQLite 切换到 Neon PostgreSQL
"切换到 Neon 数据库"
"使用生产数据库"
"/db use postgresql"

# 我会自动：
# 1. 更新 .env.local
# 2. 修改 schema.prisma
# 3. 重置迁移历史
# 4. 创建新迁移
# 5. 应用到数据库
```

### 场景 3：管理环境变量

```bash
# 检查环境配置
"检查环境变量"
"验证配置"
"/env validate"

# 生成新的 JWT Secret
"生成 JWT 密钥"
"/env generate jwt"

# 查看当前配置
"显示环境配置"
"/env show"
```

## 部署流程对比

### 传统方式（手动）
```
1. 修改 next.config.js → 手动编辑
2. 创建 s.yaml → 手动编写
3. 配置环境变量 → 手动输入
4. 构建项目 → npm run build
5. 数据库迁移 → npx prisma migrate deploy
6. 部署 → 登录阿里云控制台，点击部署
7. 验证 → 手动测试

耗时：30-60 分钟
```

### 使用技能（自动化）
```
1. 说："帮我部署到阿里云"

耗时：5-10 分钟
```

## 配置要求

### 必需文件
- `next.config.js` - 包含 `output: 'standalone'`
- `s.yaml` - 阿里云部署配置
- `prisma/schema.prisma` - 数据库 schema
- `.env.local` - 环境变量

### 必需环境变量
```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
TONGYI_API_KEY=...
NEXT_PUBLIC_APP_URL=...
```

## 常见问题

### Q: 技能没有触发怎么办？
A: 确保使用关键词，如"部署"、"数据库"、"环境变量"等

### Q: 部署失败了怎么办？
A: 技能会自动诊断问题并给出解决方案

### Q: 可以自定义部署配置吗？
A: 可以，直接编辑 `s.yaml` 文件

## 更新日志

### v1.0.0 (2026-02-22)
- ✨ 初始版本
- ✨ 支持阿里云 FC 部署
- ✨ 支持数据库切换
- ✨ 支持环境变量管理
