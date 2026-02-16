---
title: Node.js 性能优化技巧
slug: nodejs-performance-optimization
description: 分享 Node.js 应用性能优化的实用技巧，包括异步处理、内存管理等方面
category: 后端
tags: Node.js, 性能优化, 后端开发
date: 2025-01-08
---

## 异步处理优化

### 使用 async/await

避免回调地狱，使用 async/await 让代码更清晰：

```javascript
// 不好的做法
fs.readFile('file1.txt', (err, data1) => {
  fs.readFile('file2.txt', (err, data2) => {
    // 处理数据
  })
})

// 好的做法
const data1 = await fs.promises.readFile('file1.txt')
const data2 = await fs.promises.readFile('file2.txt')
```

### 并行处理

使用 `Promise.all` 并行执行独立的异步操作：

```javascript
// 串行执行（慢）
const user = await getUser(id)
const posts = await getPosts(id)
const comments = await getComments(id)

// 并行执行（快）
const [user, posts, comments] = await Promise.all([
  getUser(id),
  getPosts(id),
  getComments(id)
])
```

## 内存管理

### 避免内存泄漏

- 及时清理事件监听器
- 避免全局变量
- 合理使用缓存

```javascript
// 及时清理监听器
const handler = () => {}
emitter.on('event', handler)

// 使用完后移除
emitter.off('event', handler)
```

### 使用流处理大文件

对于大文件，使用流而不是一次性读取：

```javascript
const fs = require('fs')
const readStream = fs.createReadStream('large-file.txt')
const writeStream = fs.createWriteStream('output.txt')

readStream.pipe(writeStream)
```

## 缓存策略

### 使用内存缓存

```javascript
const cache = new Map()

async function getData(key) {
  if (cache.has(key)) {
    return cache.get(key)
  }

  const data = await fetchFromDB(key)
  cache.set(key, data)
  return data
}
```

### 使用 Redis

对于生产环境，推荐使用 Redis 作为缓存：

```javascript
const redis = require('redis')
const client = redis.createClient()

async function getCachedData(key) {
  const cached = await client.get(key)
  if (cached) {
    return JSON.parse(cached)
  }

  const data = await fetchFromDB(key)
  await client.set(key, JSON.stringify(data), 'EX', 3600)
  return data
}
```

## 代码优化

### 避免不必要的计算

```javascript
// 不好的做法
function processItems(items) {
  return items.map(item => {
    const result = heavyCalculation(item)
    return result
  })
}

// 好的做法 - 只处理需要的
function processItems(items) {
  return items
    .filter(item => item.isValid)
    .map(item => heavyCalculation(item))
}
```

### 使用高效的数据结构

根据使用场景选择合适的数据结构：

```javascript
// 频繁查找 - 使用 Map
const map = new Map()
map.set('key', 'value')
map.get('key') // O(1)

// 频繁插入/删除 - 使用 Set
const set = new Set()
set.add('value')
set.delete('value')
```

## 监控和调试

### 使用性能分析工具

```bash
# 生成 CPU profile
node --prof app.js

# 分析 profile
node --prof-process isolate-*.log > profile.txt
```

### 使用内存快照

```javascript
const v8 = require('v8')

// 生成堆快照
const snapshot = v8.getHeapSnapshot()
fs.writeFileSync('heap.heapsnapshot', JSON.stringify(snapshot))
```

## 总结

Node.js 性能优化是一个持续的过程，需要根据实际应用场景选择合适的优化策略。建议在开发过程中持续监控性能指标，及时发现和解决性能问题。
