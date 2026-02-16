import type { KnowledgeItem } from '@/types/knowledge'

export function parseMarkdownFrontmatter(markdown: string): {
  frontmatter: Record<string, string>
  content: string
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = markdown.match(frontmatterRegex)

  if (!match || !match[1] || !match[2]) {
    return { frontmatter: {}, content: markdown }
  }

  const frontmatter: Record<string, string> = {}
  const lines = match[1].split('\n')

  lines.forEach(line => {
    const [key, ...valueParts] = line.split(':')
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim()
      frontmatter[key.trim()] = value
    }
  })

  return { frontmatter, content: match[2] }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function createKnowledgeItem(
  id: string,
  markdown: string,
  filename: string
): KnowledgeItem {
  const { frontmatter, content } = parseMarkdownFrontmatter(markdown)

  const title = frontmatter.title || filename.replace(/\.md$/, '')
  const slug = frontmatter.slug || slugify(title)

  return {
    id,
    title,
    slug,
    description: frontmatter.description || '',
    category: frontmatter.category || '未分类',
    tags: frontmatter.tags ? frontmatter.tags.split(',').map((t: string) => t.trim()) : [],
    date: (frontmatter.date as string | undefined) || new Date().toISOString().split('T')[0],
    content
  }
}

export function generateMockKnowledgeData(): KnowledgeItem[] {
  return [
    {
      id: 'vue3-composition-api',
      title: 'Vue 3 Composition API 完全指南',
      slug: 'vue3-composition-api',
      description: '深入理解 Vue 3 Composition API 的核心概念、最佳实践和常见模式，包括响应式系统、生命周期钩子和组合式函数的使用方法。',
      category: '前端',
      tags: ['Vue 3', 'Composition API', 'JavaScript', 'TypeScript'],
      date: '2024-01-15',
      content: '# Vue 3 Composition API 完全指南\n\nComposition API 是 Vue 3 中最重要的新特性之一...'
    },
    {
      id: 'react-hooks-deep-dive',
      title: 'React Hooks 深度解析',
      slug: 'react-hooks-deep-dive',
      description: '全面解析 React Hooks 的工作原理，包括 useState、useEffect、useContext 等核心 Hook 的使用场景和最佳实践。',
      category: '前端',
      tags: ['React', 'Hooks', 'JavaScript', '前端开发'],
      date: '2024-01-12',
      content: '# React Hooks 深度解析\n\nHooks 是 React 16.8 引入的新特性...'
    },
    {
      id: 'typescript-advanced-types',
      title: 'TypeScript 高级类型技巧',
      slug: 'typescript-advanced-types',
      description: '掌握 TypeScript 高级类型系统，包括泛型、条件类型、映射类型、工具类型等高级特性的实际应用。',
      category: '前端',
      tags: ['TypeScript', '类型系统', 'JavaScript', '前端'],
      date: '2024-01-10',
      content: '# TypeScript 高级类型技巧\n\nTypeScript 的类型系统非常强大...'
    },
    {
      id: 'nodejs-performance',
      title: 'Node.js 性能优化实战',
      slug: 'nodejs-performance',
      description: '从内存管理、事件循环、异步编程等多个维度优化 Node.js 应用性能，提升服务器响应速度和吞吐量。',
      category: '后端',
      tags: ['Node.js', '性能优化', 'JavaScript', '后端开发'],
      date: '2024-01-08',
      content: '# Node.js 性能优化实战\n\nNode.js 性能优化是一个复杂的话题...'
    },
    {
      id: 'docker-containerization',
      title: 'Docker 容器化部署完整指南',
      slug: 'docker-containerization',
      description: '从零开始学习 Docker 容器化技术，包括镜像构建、容器管理、网络配置、数据卷管理等核心概念和实践。',
      category: '后端',
      tags: ['Docker', '容器化', 'DevOps', '部署'],
      date: '2024-01-05',
      content: '# Docker 容器化部署完整指南\n\nDocker 是现代应用部署的重要工具...'
    },
    {
      id: 'git-workflow-best-practices',
      title: 'Git 工作流最佳实践',
      slug: 'git-workflow-best-practices',
      description: '掌握 Git 版本控制的最佳实践，包括分支管理、代码审查、合并策略等，提升团队协作效率。',
      category: '工具',
      tags: ['Git', '版本控制', '团队协作', '工作流'],
      date: '2024-01-03',
      content: '# Git 工作流最佳实践\n\nGit 是现代软件开发中不可或缺的版本控制工具...'
    },
    {
      id: 'vscode-extensions',
      title: 'VS Code 必备插件推荐',
      slug: 'vscode-extensions',
      description: '精选提升开发效率的 VS Code 插件，包括代码补全、格式化、调试、Git 集成等各个方面的实用工具。',
      category: '工具',
      tags: ['VS Code', '插件', '开发工具', '效率提升'],
      date: '2024-01-01',
      content: '# VS Code 必备插件推荐\n\nVS Code 是目前最受欢迎的代码编辑器之一...'
    },
    {
      id: 'webpack-optimization',
      title: 'Webpack 构建优化指南',
      slug: 'webpack-optimization',
      description: '深入理解 Webpack 构建流程，学习如何通过配置优化构建速度和打包体积，提升前端项目性能。',
      category: '前端',
      tags: ['Webpack', '构建工具', '性能优化', '前端工程化'],
      date: '2023-12-28',
      content: '# Webpack 构建优化指南\n\nWebpack 是现代前端项目中最常用的构建工具...'
    },
    {
      id: 'css-grid-layout',
      title: 'CSS Grid 布局完全指南',
      slug: 'css-grid-layout',
      description: '全面掌握 CSS Grid 网格布局系统，学习如何创建复杂的响应式布局，告别传统的布局方式。',
      category: '前端',
      tags: ['CSS', 'Grid', '布局', '响应式设计'],
      date: '2023-12-25',
      content: '# CSS Grid 布局完全指南\n\nCSS Grid 是一个强大的二维布局系统...'
    },
    {
      id: 'mongodb-aggregation',
      title: 'MongoDB 聚合框架详解',
      slug: 'mongodb-aggregation',
      description: '深入学习 MongoDB 聚合框架，掌握数据管道操作、聚合查询优化等高级数据处理技巧。',
      category: '后端',
      tags: ['MongoDB', '数据库', '聚合查询', 'NoSQL'],
      date: '2023-12-22',
      content: '# MongoDB 聚合框架详解\n\nMongoDB 的聚合框架是一个强大的数据处理工具...'
    },
    {
      id: 'redis-caching',
      title: 'Redis 缓存策略与实践',
      slug: 'redis-caching',
      description: '学习 Redis 缓存的核心概念和最佳实践，包括数据结构选择、缓存策略、性能优化等关键知识点。',
      category: '后端',
      tags: ['Redis', '缓存', '数据库', '性能优化'],
      date: '2023-12-20',
      content: '# Redis 缓存策略与实践\n\nRedis 是一个高性能的内存数据库...'
    },
    {
      id: 'graphql-api-design',
      title: 'GraphQL API 设计最佳实践',
      slug: 'graphql-api-design',
      description: '掌握 GraphQL API 设计的核心原则，学习如何构建高效、灵活的 GraphQL 接口，提升前后端协作效率。',
      category: '后端',
      tags: ['GraphQL', 'API 设计', '后端开发', 'RESTful'],
      date: '2023-12-18',
      content: '# GraphQL API 设计最佳实践\n\nGraphQL 是一种用于 API 的查询语言...'
    },
    {
      id: 'nginx-configuration',
      title: 'Nginx 配置与优化指南',
      slug: 'nginx-configuration',
      description: '全面学习 Nginx 服务器配置，包括反向代理、负载均衡、缓存配置、SSL 证书部署等实用技巧。',
      category: '后端',
      tags: ['Nginx', '服务器', '反向代理', '负载均衡'],
      date: '2023-12-15',
      content: '# Nginx 配置与优化指南\n\nNginx 是一个高性能的 Web 服务器和反向代理服务器...'
    },
    {
      id: 'linux-commands',
      title: 'Linux 常用命令速查手册',
      slug: 'linux-commands',
      description: '整理 Linux 系统中最常用的命令，包括文件操作、进程管理、网络配置、系统监控等实用命令。',
      category: '工具',
      tags: ['Linux', '命令行', '系统管理', 'Shell'],
      date: '2023-12-12',
      content: '# Linux 常用命令速查手册\n\nLinux 命令行是系统管理员的必备技能...'
    },
    {
      id: 'bash-scripting',
      title: 'Bash 脚本编程入门',
      slug: 'bash-scripting',
      description: '从零开始学习 Bash 脚本编程，掌握变量、函数、条件判断、循环等核心概念，提升自动化运维能力。',
      category: '工具',
      tags: ['Bash', 'Shell', '脚本编程', '自动化'],
      date: '2023-12-10',
      content: '# Bash 脚本编程入门\n\nBash 脚本是 Linux 系统自动化的重要工具...'
    },
    {
      id: 'jest-testing',
      title: 'Jest 单元测试最佳实践',
      slug: 'jest-testing',
      description: '学习如何使用 Jest 编写高质量的单元测试，包括测试用例设计、Mock 技术、测试覆盖率等关键内容。',
      category: '前端',
      tags: ['Jest', '单元测试', 'JavaScript', '测试'],
      date: '2023-12-08',
      content: '# Jest 单元测试最佳实践\n\nJest 是一个流行的 JavaScript 测试框架...'
    },
    {
      id: 'tailwind-css',
      title: 'Tailwind CSS 实用指南',
      slug: 'tailwind-css',
      description: '掌握 Tailwind CSS 原子化 CSS 框架，学习如何快速构建现代化的用户界面，提升开发效率。',
      category: '前端',
      tags: ['Tailwind CSS', 'CSS', 'UI 框架', '前端开发'],
      date: '2023-12-05',
      content: '# Tailwind CSS 实用指南\n\nTailwind CSS 是一个功能优先的 CSS 框架...'
    },
    {
      id: 'nextjs-ssr',
      title: 'Next.js 服务端渲染实践',
      slug: 'nextjs-ssr',
      description: '深入了解 Next.js 的服务端渲染机制，学习如何构建高性能的 SSR 应用，优化 SEO 和首屏加载速度。',
      category: '前端',
      tags: ['Next.js', 'SSR', 'React', '服务端渲染'],
      date: '2023-12-03',
      content: '# Next.js 服务端渲染实践\n\nNext.js 是一个流行的 React 框架，支持服务端渲染...'
    },
    {
      id: 'microservices-architecture',
      title: '微服务架构设计原则',
      slug: 'microservices-architecture',
      description: '学习微服务架构的核心设计原则，包括服务拆分、通信机制、数据一致性、容错处理等关键概念。',
      category: '后端',
      tags: ['微服务', '架构设计', '分布式系统', '后端开发'],
      date: '2023-12-01',
      content: '# 微服务架构设计原则\n\n微服务架构是一种将应用拆分为多个小型服务的架构风格...'
    },
    {
      id: 'kubernetes-basics',
      title: 'Kubernetes 入门教程',
      slug: 'kubernetes-basics',
      description: '从零开始学习 Kubernetes 容器编排平台，掌握 Pod、Deployment、Service 等核心概念的使用方法。',
      category: '后端',
      tags: ['Kubernetes', '容器编排', 'DevOps', '云原生'],
      date: '2023-11-28',
      content: '# Kubernetes 入门教程\n\nKubernetes 是一个开源的容器编排平台...'
    }
  ]
}

export async function loadKnowledgeFiles(): Promise<KnowledgeItem[]> {
  const mockData = generateMockKnowledgeData()
  return mockData
}
