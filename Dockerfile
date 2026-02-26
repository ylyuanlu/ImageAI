# 使用 Node.js 18 Alpine 作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 安装必要的系统依赖
RUN apk add --no-cache libc6-compat

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制构建好的 Next.js standalone 文件
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "server.js"]
