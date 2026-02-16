---
title: TypeScript 高级类型技巧
slug: typescript-advanced-type-techniques
description: 掌握 TypeScript 高级类型系统，提升代码质量和开发效率
category: 前端
tags: TypeScript, 类型系统, 前端开发
date: 2025-01-11
---

## 泛型

泛型是 TypeScript 最强大的特性之一，它允许你编写可重用的组件。

### 基础泛型

```typescript
function identity<T>(arg: T): T {
  return arg
}

const output = identity<string>('hello')
```

### 泛型约束

```typescript
interface Lengthwise {
  length: number
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length)
  return arg
}
```

## 条件类型

条件类型允许你根据类型关系选择类型。

```typescript
type NonNullable<T> = T extends null | undefined ? never : T

type Result = NonNullable<string | null> // string
```

## 映射类型

映射类型允许你基于旧类型创建新类型。

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

interface User {
  name: string
  age: number
}

type ReadonlyUser = Readonly<User>
```

## 工具类型

TypeScript 提供了许多内置的工具类型。

### Partial

将所有属性设为可选。

```typescript
interface Todo {
  title: string
  description: string
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate }
}
```

### Pick

从类型中选择一组属性。

```typescript
type TodoPreview = Pick<Todo, 'title'>
```

### Record

创建一个对象类型，其属性键为另一个类型。

```typescript
type PageInfo = {
  title: string
}

type PageMap = Record<string, PageInfo>
```

## 高级技巧

### 模板字面量类型

```typescript
type EventName<T extends string> = `on${Capitalize<T>}`

type ClickEvent = EventName<'click'> // 'onClick'
```

### 递归类型

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? DeepPartial<T[P]>
    : T[P]
}
```

## 总结

TypeScript 的类型系统非常强大，掌握这些高级技巧可以让你写出更安全、更优雅的代码。
