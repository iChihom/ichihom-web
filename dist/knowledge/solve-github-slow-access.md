---
title: 解决 GitHub 访问慢的问题
slug: solve-github-slow-access
description: 介绍几种解决 GitHub 访问速度慢的方法，包括修改 hosts 文件、使用代理等方案
category: 工具
tags: GitHub, 网络优化, 开发工具
date: 2025-01-15
---

## 问题描述

在国内访问 GitHub 时，经常会遇到访问速度慢、连接超时等问题，这严重影响了开发效率。

## 解决方案

### 1. 修改 hosts 文件

通过修改本地 hosts 文件，将 GitHub 的域名解析到更快的 IP 地址。

#### Windows 系统

1. 以管理员身份打开记事本
2. 打开文件 `C:\Windows\System32\drivers\etc\hosts`
3. 添加以下内容：

```
140.82.112.4 github.com
140.82.114.9 codeload.github.com
199.232.69.194 github.global.ssl.fastly.net
```

4. 保存文件

#### Linux/Mac 系统

```bash
sudo vim /etc/hosts
```

添加上述内容后保存。

### 2. 使用代理

如果你有可用的代理服务器，可以配置 Git 使用代理：

```bash
# HTTP 代理
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

# SOCKS5 代理
git config --global http.proxy socks5://127.0.0.1:7891
git config --global https.proxy socks5://127.0.0.1:7891
```

取消代理：

```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```

### 3. 使用镜像站点

一些国内镜像站点提供了 GitHub 仓库的镜像：

- Gitee：https://gitee.com/
- FastGit：https://hub.fastgit.xyz/

## 注意事项

- hosts 文件修改后可能需要刷新 DNS 缓存
- 代理配置需要根据实际情况调整端口
- 镜像站点可能不是实时同步的
