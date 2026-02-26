---
name: "auto-deploy"
description: "一键自动化部署 Next.js 应用到阿里云函数计算。Invoke when user wants to deploy the project to Alibaba Cloud FC, or when user says 'deploy', '部署', '上线', '发布' etc."
---

# 一键自动化部署技能

## 功能
自动完成 Next.js 应用到阿里云函数计算（FC）的完整部署流程。

## 触发条件
当用户说以下关键词时自动触发：
- "部署到阿里云"
- "一键部署"
- "发布应用"
- "上线"
- "deploy"

## 部署前检查清单

### 1. 必需文件检查
- [ ] `next.config.js` 包含 `output: 'standalone'`
- [ ] `s.yaml` 部署配置文件存在
- [ ] `prisma/schema.prisma` 配置正确
- [ ] `.env.local` 包含必要的环境变量

### 2. 环境变量检查
必须配置以下变量：
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
TONGYI_API_KEY=...
NEXT_PUBLIC_APP_URL=...
```

### 3. 数据库检查
- [ ] 数据库连接正常
- [ ] 迁移文件已创建
- [ ] Prisma Client 已生成

## 自动化部署步骤

### 步骤 1：预部署检查
```bash
# 检查 next.config.js
if (!next.config.js 包含 output: 'standalone') {
  自动添加配置
}

# 检查 s.yaml
if (!s.yaml 存在) {
  创建默认配置
}
```

### 步骤 2：构建项目
```bash
# 安装依赖
npm install

# 生成 Prisma Client
npx prisma generate

# 构建 Next.js
npm run build
```

### 步骤 3：数据库迁移
```bash
# 应用数据库迁移
npx prisma migrate deploy
```

### 步骤 4：部署到阿里云
```bash
# 使用 Serverless Devs CLI
s deploy
```

## 部署后验证

### 自动验证项
1. [ ] 检查部署状态
2. [ ] 验证域名可访问
3. [ ] 测试数据库连接
4. [ ] 测试 API 接口

### 手动验证项
1. [ ] 访问首页
2. [ ] 测试用户注册
3. [ ] 测试图片生成

## 常见问题处理

### 问题 1：构建失败
**原因**：依赖缺失或配置错误
**解决**：
```bash
rm -rf node_modules
npm install
npm run build
```

### 问题 2：数据库连接失败
**原因**：环境变量未配置或网络问题
**解决**：
1. 检查 `.env.local` 中的 `DATABASE_URL`
2. 测试数据库连接：`npx prisma db pull`

### 问题 3：部署超时
**原因**：函数计算冷启动或网络问题
**解决**：
1. 增加超时时间到 120 秒
2. 检查阿里云账户余额

## 快速命令

### 完整部署
```bash
/deploy aliyun
```

### 仅构建
```bash
/deploy build
```

### 仅部署（跳过构建）
```bash
/deploy deploy-only
```

### 查看部署状态
```bash
/deploy status
```

## 配置说明

### s.yaml 关键配置
```yaml
edition: 3.0.0
name: imageai-app

resources:
  imageai_function:
    component: fc3
    props:
      region: cn-hangzhou
      runtime: custom
      cpu: 1
      memorySize: 2048
      timeout: 60
      customRuntimeConfig:
        command:
          - node
          - server.js
        port: 3000
```

### 环境变量模板
```bash
# 必需
DATABASE_URL=
JWT_SECRET=
TONGYI_API_KEY=

# 可选
ALIYUN_ACCESS_KEY_ID=
ALIYUN_ACCESS_KEY_SECRET=
RESEND_API_KEY=
```

## 成功标志

部署成功后会显示：
```
✅ 构建成功
✅ 数据库迁移成功
✅ 部署成功
✅ 域名: https://xxx.cn-hangzhou.fcapp.run
```
