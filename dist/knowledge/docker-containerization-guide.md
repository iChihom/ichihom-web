---
title: Docker 容器化部署指南
slug: docker-containerization-guide
description: 从零开始学习 Docker，掌握容器化部署的核心概念和实践技巧
category: 后端
tags: Docker, 容器化, DevOps, 部署
date: 2025-01-09
---

## 什么是 Docker

Docker 是一个开源的容器化平台，它可以将应用程序及其依赖项打包到轻量级、可移植的容器中。

## 核心概念

### 镜像（Image）

镜像是一个只读的模板，用于创建容器。

```bash
# 拉取官方镜像
docker pull nginx:latest

# 查看本地镜像
docker images
```

### 容器（Container）

容器是镜像的运行实例。

```bash
# 运行容器
docker run -d -p 80:80 --name web nginx

# 查看运行中的容器
docker ps

# 停止容器
docker stop web
```

### Dockerfile

Dockerfile 是用于构建镜像的脚本。

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

## 实践技巧

### 1. 多阶段构建

减小镜像体积的最佳实践。

```dockerfile
# 构建阶段
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 运行阶段
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]
```

### 2. 使用 .dockerignore

排除不必要的文件。

```text
node_modules
npm-debug.log
.git
.env
```

### 3. 优化层缓存

合理组织 Dockerfile 指令顺序。

```dockerfile
COPY package*.json ./
RUN npm install # 这层会被缓存

COPY . . # 代码变化不会重新安装依赖
```

## Docker Compose

使用 Docker Compose 管理多容器应用。

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: example
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 最佳实践

- 使用官方基础镜像
- 最小化镜像层数
- 定期更新基础镜像
- 使用非 root 用户运行应用
- 设置资源限制

## 总结

Docker 极大地简化了应用的部署和运维，掌握 Docker 是现代开发者的必备技能。
