<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useKnowledgeStore } from '@/stores/knowledge'
import { loadKnowledgeFiles } from '@/utils/knowledge'

const route = useRoute()
const knowledgeStore = useKnowledgeStore()

const slug = computed(() => route.params.slug as string)
const item = computed(() => knowledgeStore.getItemBySlug(slug.value))
const loading = ref(true)

onMounted(async () => {
  if (knowledgeStore.items.length === 0) {
    const items = await loadKnowledgeFiles()
    knowledgeStore.setItems(items)
  }
  loading.value = false
})

const renderMarkdown = (content: string) => {
  return content
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    .replace(/\n/gim, '<br>')
}
</script>

<template>
  <div class="knowledge-detail-page">
    <div class="container">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <div v-else-if="item" class="detail-content">
        <div class="breadcrumb">
          <RouterLink to="/" class="breadcrumb-link">首页</RouterLink>
          <span class="breadcrumb-separator">/</span>
          <RouterLink to="/knowledge" class="breadcrumb-link">知识库</RouterLink>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">{{ item.title }}</span>
        </div>

        <article class="article">
          <header class="article-header">
            <div class="article-meta">
              <span class="article-category">{{ item.category }}</span>
              <span class="article-date">{{ item.date }}</span>
            </div>
            <h1 class="article-title">{{ item.title }}</h1>
            <p class="article-description">{{ item.description }}</p>
            <div v-if="item.tags.length > 0" class="article-tags">
              <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </header>

          <div class="article-body" v-html="renderMarkdown(item.content)"></div>

          <footer class="article-footer">
            <RouterLink to="/knowledge" class="back-link">
              <span class="back-icon">←</span>
              返回知识库
            </RouterLink>
          </footer>
        </article>
      </div>

      <div v-else class="not-found">
        <div class="not-found-icon">📄</div>
        <h2 class="not-found-title">文章未找到</h2>
        <p class="not-found-description">抱歉，您访问的文章不存在或已被删除。</p>
        <RouterLink to="/knowledge" class="back-link">返回知识库</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.knowledge-detail-page {
  padding: 40px 0;
  min-height: calc(100vh - 64px);
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: var(--color-primary, #667eea);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
  font-size: 0.875rem;
  color: #6b7280;
}

.breadcrumb-link {
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--color-secondary);
}

.breadcrumb-separator {
  color: #9ca3af;
}

.breadcrumb-current {
  color: #9ca3af;
}

.detail-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.article {
  padding: 40px;
}

.article-header {
  margin-bottom: 40px;
  padding-bottom: 32px;
  border-bottom: 1px solid #e5e7eb;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.article-category {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(99, 102, 241, 0.1);
  color: var(--color-secondary);
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}

.article-date {
  color: #9ca3af;
  font-size: 0.875rem;
}

.article-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 16px 0;
  line-height: 1.3;
}

.article-description {
  font-size: 1.125rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  display: inline-block;
  padding: 4px 12px;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 4px;
  font-size: 0.875rem;
}

.article-body {
  font-size: 1.0625rem;
  line-height: 1.8;
  color: #374151;
}

.article-body :deep(h1),
.article-body :deep(h2),
.article-body :deep(h3) {
  color: #1f2937;
  font-weight: 600;
  margin-top: 2em;
  margin-bottom: 1em;
  line-height: 1.3;
}

.article-body :deep(h1) {
  font-size: 1.875rem;
}

.article-body :deep(h2) {
  font-size: 1.5rem;
}

.article-body :deep(h3) {
  font-size: 1.25rem;
}

.article-body :deep(p) {
  margin-bottom: 1.5em;
}

.article-body :deep(code) {
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  color: #dc2626;
}

.article-body :deep(pre) {
  background: #1f2937;
  color: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.5em 0;
}

.article-body :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
}

.article-body :deep(strong) {
  font-weight: 600;
  color: #1f2937;
}

.article-body :deep(em) {
  font-style: italic;
}

.article-footer {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid #e5e7eb;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--color-secondary);
}

.back-icon {
  font-size: 1.125rem;
}

.not-found {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.not-found-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.not-found-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
}

.not-found-description {
  color: #6b7280;
  margin: 0 0 24px 0;
}

@media (max-width: 640px) {
  .knowledge-detail-page {
    padding: 24px 0;
  }

  .article {
    padding: 24px;
  }

  .article-title {
    font-size: 1.75rem;
  }

  .article-description {
    font-size: 1rem;
  }

  .article-body {
    font-size: 1rem;
  }
}
</style>
