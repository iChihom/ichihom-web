---
title: React Hooks 最佳实践
slug: react-hooks-best-practices
description: 深入探讨 React Hooks 的使用技巧和常见陷阱，帮助你写出更优雅的 React 代码
category: 前端
tags: React, JavaScript, 前端开发
date: 2025-01-12
---

## 什么是 React Hooks

React Hooks 是 React 16.8 引入的新特性，它允许你在不编写 class 的情况下使用 state 以及其他的 React 特性。

## 常用 Hooks

### useState

用于在函数组件中添加 state。

```javascript
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

### useEffect

用于处理副作用，如数据获取、订阅、DOM 操作等。

```javascript
import { useEffect, useState } from 'react'

function UserProfile({ userId }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchUser(userId).then(setUser)
  }, [userId])

  if (!user) return <div>Loading...</div>

  return <div>Hello, {user.name}</div>
}
```

## 最佳实践

### 1. 遵循 Hooks 规则

- 只在最顶层使用 Hooks
- 只在 React 函数中调用 Hooks

### 2. 合理使用依赖数组

useEffect 的依赖数组决定了 effect 何时重新执行。

```javascript
useEffect(() => {
  document.title = `Count: ${count}`
}, [count]) // 只在 count 变化时执行
```

### 3. 使用自定义 Hooks

将重复逻辑抽取为自定义 Hooks。

```javascript
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}
```

### 4. 避免过度优化

不要过早优化，只在性能确实成为问题时才使用 useMemo 和 useCallback。

## 常见陷阱

### 1. 在条件语句中使用 Hooks

```javascript
if (condition) {
  const [count, setCount] = useState(0) // 错误！
}
```

### 2. 忘记清理副作用

```javascript
useEffect(() => {
  const timer = setInterval(() => {
    console.log('tick')
  }, 1000)

  return () => clearInterval(timer) // 不要忘记清理
}, [])
```

## 总结

React Hooks 提供了更简洁的组件编写方式，遵循最佳实践可以避免常见的陷阱，写出更优雅的代码。
