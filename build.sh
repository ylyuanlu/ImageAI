#!/bin/bash
# 构建 Docker 镜像脚本

set -e

echo "Building Docker image..."

# 构建镜像
docker build -t imageai:latest .

# 标记镜像
docker tag imageai:latest ylyuanlu/imageai:latest

# 推送到 Docker Hub
echo "Pushing to Docker Hub..."
docker push ylyuanlu/imageai:latest

echo "Build and push completed!"
