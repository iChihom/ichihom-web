---
title: Git 工作流最佳实践
slug: git-workflow-best-practices
description: 掌握 Git 分支管理、代码审查和版本控制的最佳实践
category: 工具
tags: Git, 版本控制, 团队协作
date: 2025-01-07
---

## Git 分支策略

### Git Flow

Git Flow 是一个成熟的分支模型。

```
main (生产)
  ↑
develop (开发)
  ↑
feature/* (功能分支)
hotfix/* (修复分支)
```

### GitHub Flow

更简单的分支策略，适合持续部署。

```
main (生产)
  ↑
feature/* (功能分支)
```

## 分支管理

### 创建功能分支

```bash
# 从 develop 创建功能分支
git checkout develop
git pull
git checkout -b feature/user-auth

# 或从 main 创建
git checkout main
git pull
git checkout -b feature/user-auth
```

### 提交规范

使用约定式提交（Conventional Commits）。

```
feat: 添加用户登录功能
fix: 修复登录页面样式问题
docs: 更新 API 文档
style: 格式化代码
refactor: 重构用户服务
test: 添加登录测试
chore: 更新依赖包
```

### 合并分支

```bash
# 完成功能后合并回 develop
git checkout develop
git merge feature/user-auth
git branch -d feature/user-auth

# 推送到远程
git push origin develop
```

## 代码审查

### Pull Request 流程

1. 创建功能分支
2. 推送到远程仓库
3. 创建 Pull Request
4. 请求团队审查
5. 根据反馈修改
6. 合并到主分支

### PR 模板

```markdown
## 变更说明
简要描述这个 PR 的目的和内容

## 变更类型
- [ ] 新功能
- [ ] Bug 修复
- [ ] 文档更新
- [ ] 性能优化

## 测试
- [ ] 已添加单元测试
- [ ] 已通过所有测试
- [ ] 已手动测试

## 截图
如果有 UI 变更，请提供截图
```

## 常用命令

### 撤销操作

```bash
# 撤销最后一次提交（保留更改）
git reset --soft HEAD~1

# 撤销最后一次提交（丢弃更改）
git reset --hard HEAD~1

# 撤销已推送的提交
git revert <commit-hash>
```

### 暂存更改

```bash
# 暂存当前更改
git stash

# 查看暂存列表
git stash list

# 应用暂存
git stash pop
```

### 查看历史

```bash
# 查看提交历史
git log --oneline --graph --all

# 查看文件变更
git diff

# 查看某次提交的变更
git show <commit-hash>
```

## 最佳实践

1. **频繁提交**：小而频繁的提交更容易追踪和回滚
2. **清晰的提交信息**：使用约定式提交格式
3. **及时同步**：定期拉取远程更新
4. **代码审查**：所有代码必须经过审查才能合并
5. **保护主分支**：设置分支保护规则

## 总结

良好的 Git 工作流可以提高团队协作效率，减少代码冲突，确保代码质量。
