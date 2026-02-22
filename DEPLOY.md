# ImageAI 部署指南

## 🚀 阶段1：最小化部署（当前）

### 部署前准备

1. **Vercel 账号**
   - 访问 https://vercel.com 注册/登录
   - 建议关联 GitHub 账号

2. **必需的环境变量**
   在 Vercel 控制台设置以下环境变量：

   ```bash
   # 基础配置
   NODE_ENV=production
   JWT_SECRET=your-strong-random-secret-key-32chars
   JWT_EXPIRES_IN=7d
   
   # AI API
   TONGYI_API_KEY=sk-777a9155d80a4703aa169c7f41947dcd
   
   # 应用配置
   NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
   NEXT_PUBLIC_APP_NAME=ImageAI
   
   # 功能开关
   ENABLE_REGISTRATION=true
   ENABLE_SOCIAL_SHARE=true
   ENABLE_POSE_GENERATION=true
   ENABLE_PAYMENT=false
   
   # 限制配置
   MAX_FILE_SIZE=5
   MAX_BATCH_GENERATE=2
   CONCURRENT_GENERATION=1
   ```

### 部署步骤

#### 方式1：通过 Vercel CLI 部署（推荐）

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署
vercel --prod
```

#### 方式2：通过 GitHub 集成部署

1. 将代码推送到 GitHub
2. 在 Vercel 控制台导入项目
3. 配置环境变量
4. 自动部署

### 部署后验证

访问以下端点验证部署：

- 首页: `https://your-domain.vercel.app/`
- API健康检查: `https://your-domain.vercel.app/api/health`
- 登录页面: `https://your-domain.vercel.app/account`

### ⚠️ 阶段1限制说明

1. **数据存储**: 使用 SQLite，数据会在每次重新部署后重置
2. **文件上传**: 未配置存储服务，图片上传功能受限
3. **支付功能**: 已禁用，无法购买会员或额度
4. **AI生成**: 正常可用（使用通义千问API）

---

## 📋 后续阶段规划

### 阶段2：添加 PostgreSQL 数据库
- [ ] 创建 Vercel Postgres 或 Neon 数据库
- [ ] 更新 DATABASE_URL 环境变量
- [ ] 修改 prisma/schema.prisma 使用 PostgreSQL
- [ ] 执行数据库迁移

### 阶段3：添加阿里云 OSS 存储
- [ ] 创建阿里云 OSS Bucket
- [ ] 配置 ALIYUN_ACCESS_KEY_ID 和 ALIYUN_ACCESS_KEY_SECRET
- [ ] 配置 ALIYUN_OSS_REGION 和 ALIYUN_OSS_BUCKET_NAME
- [ ] 测试图片上传功能

### 阶段4：添加支付功能
- [ ] 申请支付宝商户账号
- [ ] 申请微信支付商户账号
- [ ] 配置支付相关环境变量
- [ ] 启用 ENABLE_PAYMENT=true
- [ ] 测试支付流程

### 阶段5：配置自定义域名
- [ ] 购买域名
- [ ] 在 Vercel 配置自定义域名
- [ ] 配置 DNS 解析
- [ ] 更新 NEXT_PUBLIC_APP_URL

---

## 🔧 故障排除

### 构建失败
1. 检查 Node.js 版本 >= 18
2. 检查所有依赖是否安装: `npm install`
3. 检查环境变量是否配置完整

### 运行时错误
1. 检查 TONGYI_API_KEY 是否有效
2. 检查 JWT_SECRET 是否设置
3. 查看 Vercel Functions 日志

### 数据库错误
- 阶段1使用 SQLite，不支持并发写入
- 如出现数据库锁定错误，等待几秒后重试

---

## 📞 支持

如有问题，请查看：
- [Project-Memory.md](./Project-Memory.md) - 项目状态
- [CHANGELOG.md](./CHANGELOG.md) - 更新日志
