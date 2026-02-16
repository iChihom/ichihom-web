---
title: Vue 3 组合式 API 最佳实践
slug: vue3-composition-api-best-practices
description: 分享 Vue 3 组合式 API 的使用技巧和最佳实践，帮助你写出更优雅的代码
category: 前端
tags: Vue3, JavaScript, 前端开发
date: 2025-01-10
---

## 什么是组合式 API

Vue 3 的组合式 API 是一种基于函数的 API，允许我们更灵活地组织组件逻辑。相比 Vue 2 的选项式 API，组合式 API 提供了更好的代码组织和复用能力。

## setup 函数

`setup` 函数是组合式 API 的入口点，它在组件创建之前执行。

```javascript
import { ref, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const doubled = computed(() => count.value * 2)

    function increment() {
      count.value++
    }

    return {
      count,
      doubled,
      increment
    }
  }
}
```

## 响应式 API

### ref 和 reactive

- `ref`：用于基本类型和对象，通过 `.value` 访问
- `reactive`：用于对象，直接访问属性

```javascript
import { ref, reactive } from 'vue'

const count = ref(0)
console.log(count.value) // 0

const state = reactive({
  name: 'Vue',
  version: 3
})
console.log(state.name) // 'Vue'
```

### computed

计算属性，基于响应式数据自动更新。

```javascript
const count = ref(0)
const doubled = computed(() => count.value * 2)
```

## 生命周期钩子

组合式 API 中的生命周期钩子需要导入使用：

```javascript
import { onMounted, onUnmounted } from 'vue'

export default {
  setup() {
    onMounted(() => {
      console.log('组件已挂载')
    })

    onUnmounted(() => {
      console.log('组件已卸载')
    })
  }
}
```

## 最佳实践

### 1. 使用 script setup 语法糖

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>
```

### 2. 合理抽取可复用逻辑

将通用逻辑抽取为组合式函数：

```javascript
// useCounter.js
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  return {
    count,
    increment,
    decrement
  }
}
```

### 3. 避免过度使用 reactive

对于简单值，优先使用 `ref`，只在需要响应式对象时使用 `reactive`。

### 4. 合理使用 toRefs

解构 reactive 对象时使用 `toRefs` 保持响应性：

```javascript
import { toRefs } from 'vue'

const state = reactive({
  count: 0,
  name: 'Vue'
})

const { count, name } = toRefs(state)
```

## 总结

组合式 API 提供了更灵活的代码组织方式，通过合理使用可以写出更清晰、更易维护的代码。
