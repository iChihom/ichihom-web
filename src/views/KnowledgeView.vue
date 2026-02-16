<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useKnowledgeStore } from '@/stores/knowledge'
import { loadKnowledgeFiles } from '@/utils/knowledge'
import type { KnowledgeFilter } from '@/types/knowledge'

const knowledgeStore = useKnowledgeStore()
const searchQuery = ref('')
const selectedCategory = ref('')
const isSidebarCollapsed = ref(false)
const selectedArticle = ref<any>(null)
const isArticleOpen = ref(false)
const currentPage = ref(1)
const itemsPerPage = 10
const sortBy = ref<'date' | 'title' | 'category'>('date')
const sortOrder = ref<'desc' | 'asc'>('desc')
const searchInputRef = ref<HTMLInputElement | null>(null)
const tocItems = ref<Array<{ id: string; text: string; level: number }>>([])
const readingProgress = ref(0)
const showBackToTop = ref(false)

interface TocItem {
  id: string
  text: string
  level: number
}

const filteredItems = computed(() => {
  const filter: KnowledgeFilter = {
    sortBy: sortBy.value,
    sortOrder: sortOrder.value
  }
  if (selectedCategory.value) {
    filter.category = selectedCategory.value
  }
  if (searchQuery.value) {
    filter.search = searchQuery.value
  }
  return knowledgeStore.filteredItems(filter)
})

const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage))

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredItems.value.slice(start, end)
})

const categories = computed(() => knowledgeStore.categories)
const tags = computed(() => knowledgeStore.tags)
const stats = computed(() => knowledgeStore.stats)

const handleSearch = (event: Event) => {
  searchQuery.value = (event.target as HTMLInputElement).value
  currentPage.value = 1
}

const selectCategory = (category: string) => {
  selectedCategory.value = selectedCategory.value === category ? '' : category
  selectedArticle.value = null
  isArticleOpen.value = false
  currentPage.value = 1
}

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const openArticle = (item: any) => {
  selectedArticle.value = item
  isArticleOpen.value = true
  readingProgress.value = 0
  showBackToTop.value = false
  nextTick(() => {
    generateTOC()
    const detailBody = document.querySelector('.detail-body')
    if (detailBody) {
      detailBody.addEventListener('scroll', handleScroll)
    }
  })
}

const closeArticle = () => {
  selectedArticle.value = null
  isArticleOpen.value = false
  tocItems.value = []
  readingProgress.value = 0
  showBackToTop.value = false
  const detailBody = document.querySelector('.detail-body')
  if (detailBody) {
    detailBody.removeEventListener('scroll', handleScroll)
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleKeyboardShortcut = (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault()
    searchInputRef.value?.focus()
  }
}

const generateTOC = () => {
  const content = selectedArticle.value?.content || ''
  const headings: TocItem[] = []
  const lines = content.split('\n')
  
  lines.forEach((line, index) => {
    const h1Match = line.match(/^#\s+(.+)$/)
    const h2Match = line.match(/^##\s+(.+)$/)
    const h3Match = line.match(/^###\s+(.+)$/)
    
    if (h1Match) {
      headings.push({
        id: `heading-${index}`,
        text: h1Match[1].trim(),
        level: 1
      })
    } else if (h2Match) {
      headings.push({
        id: `heading-${index}`,
        text: h2Match[1].trim(),
        level: 2
      })
    } else if (h3Match) {
      headings.push({
        id: `heading-${index}`,
        text: h3Match[1].trim(),
        level: 3
      })
    }
  })
  
  tocItems.value = headings
  
  nextTick(() => {
    addHeadingIds()
  })
}

const addHeadingIds = () => {
  const contentElement = document.querySelector('.detail-content')
  if (!contentElement) return
  
  const headings = contentElement.querySelectorAll('h1, h2, h3')
  headings.forEach((heading, index) => {
    const tocItem = tocItems.value[index]
    if (tocItem) {
      heading.id = tocItem.id
    }
  })
}

const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const handleScroll = () => {
  const detailBody = document.querySelector('.detail-body')
  if (!detailBody) return
  
  const scrollTop = detailBody.scrollTop
  const scrollHeight = detailBody.scrollHeight - detailBody.clientHeight
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
  readingProgress.value = Math.min(100, Math.max(0, progress))
  showBackToTop.value = scrollTop > 300
}

const scrollToTop = () => {
  const detailBody = document.querySelector('.detail-body')
  if (detailBody) {
    detailBody.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const estimateReadTime = (content: string): string => {
  const wordsPerMinute = 200
  const wordCount = content.length / 5
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  if (readTime < 1) {
    return '1 分钟阅读'
  }
  return `${readTime} 分钟阅读`
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays}天前`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`
  return `${Math.floor(diffDays / 365)}年前`
}

const renderMarkdown = (content: string) => {
  let html = content
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    .replace(/\n/gim, '<br>')
  
  return html
}

onMounted(async () => {
  const items = await loadKnowledgeFiles()
  knowledgeStore.setItems(items)
  window.addEventListener('keydown', handleKeyboardShortcut)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboardShortcut)
})
</script>

<template>
  <div class="knowledge-page">
    <aside class="sidebar-drawer" :class="{ collapsed: isSidebarCollapsed }">
      <div class="drawer-header">
        <div class="drawer-title" v-if="!isSidebarCollapsed">知识库</div>
        <button class="drawer-toggle-btn" @click="toggleSidebar" :title="isSidebarCollapsed ? '展开' : '折叠'">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" :class="{ rotated: isSidebarCollapsed }">
            <path d="M3 10h14M10 3l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>

      <div class="drawer-content" v-if="!isSidebarCollapsed">
        <div class="stats-section">
          <div class="stat-card">
            <div class="stat-value">{{ stats.totalArticles }}</div>
            <div class="stat-label">文章</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ stats.totalCategories }}</div>
            <div class="stat-label">分类</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ stats.totalTags }}</div>
            <div class="stat-label">标签</div>
          </div>
        </div>

        <div class="search-section">
          <div class="search-input-wrapper">
            <svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M7 14a7 7 0 100-14 7 7 0 000 14zM15 15l-4.35-4.35" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <input
              ref="searchInputRef"
              type="text"
              v-model="searchQuery"
              @input="handleSearch"
              placeholder="搜索 (Ctrl+K)"
              class="search-input"
            />
            <div class="search-shortcut">⌘K</div>
          </div>
        </div>

        <nav class="category-nav">
          <div class="nav-section">
            <div class="nav-section-header">
              <div class="nav-section-title">分类</div>
              <div class="nav-section-count">{{ categories.length }}</div>
            </div>
            <div class="nav-list">
              <button
                class="nav-item"
                :class="{ active: selectedCategory === '' }"
                @click="selectCategory('')"
              >
                <svg class="nav-item-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span class="nav-item-text">全部</span>
                <span class="nav-item-count">{{ stats.totalArticles }}</span>
              </button>
              <button
                v-for="category in categories"
                :key="category.id"
                class="nav-item"
                :class="{ active: selectedCategory === category.name }"
                @click="selectCategory(category.name)"
              >
                <svg class="nav-item-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3h10v10H3z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M3 7h10M3 5h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span class="nav-item-text">{{ category.name }}</span>
                <span class="nav-item-count">{{ category.count }}</span>
              </button>
            </div>
          </div>

          <div class="nav-section" v-if="tags.length > 0">
            <div class="nav-section-header">
              <div class="nav-section-title">标签</div>
              <div class="nav-section-count">{{ tags.length }}</div>
            </div>
            <div class="nav-list">
              <button
                v-for="tag in tags.slice(0, 8)"
                :key="tag.name"
                class="nav-item"
                @click="searchQuery = tag.name; currentPage = 1"
              >
                <svg class="nav-item-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2l6 6-6 6M2 8h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span class="nav-item-text">{{ tag.name }}</span>
                <span class="nav-item-count">{{ tag.count }}</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </aside>

    <main class="main-content">
      <div v-if="!isArticleOpen" class="content-list">
        <nav class="breadcrumb">
          <span class="breadcrumb-item">知识库</span>
          <span v-if="selectedCategory" class="breadcrumb-separator">/</span>
          <span v-if="selectedCategory" class="breadcrumb-item current">{{ selectedCategory }}</span>
        </nav>

        <div class="content-header">
          <div class="search-bar">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M8 15a7 7 0 100-14 7 7 0 000 14zM17 17l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <input
              type="text"
              v-model="searchQuery"
              @input="handleSearch"
              placeholder="搜索知识..."
              class="search-input"
            />
          </div>
          <div class="sort-controls">
            <select v-model="sortBy" class="sort-select">
              <option value="date">发布时间</option>
              <option value="title">标题</option>
              <option value="category">分类</option>
            </select>
            <button class="sort-order-btn" @click="sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" :class="{ rotated: sortOrder === 'asc' }">
                <path d="M8 3v10M3 8l5-5 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="filteredItems.length > 0" class="knowledge-list">
          <div v-for="item in paginatedItems" :key="item.id" class="knowledge-card" @click="openArticle(item)">
            <div class="card-header">
              <span class="card-category">{{ item.category }}</span>
              <span class="card-date">{{ formatDate(item.date || '') }}</span>
            </div>
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-description">{{ item.description }}</p>
            <div class="card-footer">
              <div class="card-tags">
                <span v-for="tag in item.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
              </div>
              <div class="card-meta">
                <span class="read-time">{{ estimateReadTime(item.content) }}</span>
                <svg class="arrow-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M10 5l3 3-3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredItems.length > 0 && totalPages > 1" class="pagination">
          <button 
            class="pagination-btn" 
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            上一页
          </button>
          <div class="pagination-pages">
            <button 
              v-for="page in totalPages" 
              :key="page"
              class="pagination-page"
              :class="{ active: currentPage === page }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </div>
          <button 
            class="pagination-btn" 
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            下一页
          </button>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon-wrapper">
            <svg class="empty-icon" width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="2" stroke-dasharray="8 4" />
              <path d="M32 20v24M32 44v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </div>
          <h3 class="empty-title">没有找到相关内容</h3>
          <p class="empty-description">尝试调整搜索关键词或选择其他分类</p>
          <button @click="selectCategory(''); searchQuery = ''" class="reset-btn">
            清除筛选条件
          </button>
        </div>
      </div>

      <div v-else class="content-detail">
        <div class="reading-progress-bar">
          <div class="progress-fill" :style="{ width: `${readingProgress}%` }"></div>
        </div>

        <div class="detail-header">
          <button class="back-btn" @click="closeArticle">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4l-8 8 8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>返回列表</span>
          </button>
          <div class="detail-meta">
            <span class="detail-category">{{ selectedArticle?.category }}</span>
            <span class="detail-date">{{ formatDate(selectedArticle?.date || '') }}</span>
          </div>
        </div>

        <div class="detail-layout">
          <div class="detail-body">
            <h1 class="detail-title">{{ selectedArticle?.title }}</h1>
            <p class="detail-description">{{ selectedArticle?.description }}</p>

            <div v-if="selectedArticle?.tags.length > 0" class="detail-tags">
              <span v-for="tag in selectedArticle.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>

            <div class="detail-content" v-html="renderMarkdown(selectedArticle?.content || '')"></div>
          </div>

          <aside v-if="tocItems.length > 0" class="toc-sidebar">
            <div class="toc-header">目录</div>
            <nav class="toc-nav">
              <a
                v-for="item in tocItems"
                :key="item.id"
                :href="`#${item.id}`"
                @click.prevent="scrollToHeading(item.id)"
                class="toc-item"
                :class="`toc-level-${item.level}`"
              >
                {{ item.text }}
              </a>
            </nav>
          </aside>
        </div>

        <button v-if="showBackToTop" @click="scrollToTop" class="back-to-top-btn" title="回到顶部">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4v12M4 10l6-6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.knowledge-page {
  display: flex;
  min-height: calc(100vh - 64px);
  background: #f8f7ff;
}

.sidebar-drawer {
  width: 280px;
  background: white;
  border-right: 1px solid #e7e5e4;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 64px;
  height: calc(100vh - 64px);
  transition: width 0.3s ease;
}

.sidebar-drawer.collapsed {
  width: 60px;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #e7e5e4;
}

.drawer-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1c1917;
}

.drawer-toggle-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e7e5e4;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #78716c;
}

.drawer-toggle-btn:hover {
  background: #f8f7ff;
  color: var(--color-primary);
}

.drawer-toggle-btn svg {
  transition: transform 0.3s ease;
}

.drawer-toggle-btn svg.rotated {
  transform: rotate(180deg);
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}

.stat-card {
  background: #f8f7ff;
  border-radius: 8px;
  padding: 12px 8px;
  text-align: center;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-secondary);
  margin-bottom: 2px;
}

.stat-label {
  font-size: 0.6875rem;
  color: #78716c;
}

.search-section {
  margin-bottom: 20px;
}

.search-input-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #a8a29e;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 8px 36px 8px 32px;
  border: 1px solid #e7e5e4;
  border-radius: 6px;
  font-size: 0.8125rem;
  background: #f8f7ff;
  transition: all 0.2s ease;
  color: #1c1917;
}

.search-input::placeholder {
  color: #a8a29e;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: white;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

.search-shortcut {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.6875rem;
  color: #a8a29e;
  background: #f5f5f4;
  padding: 2px 4px;
  border-radius: 3px;
  pointer-events: none;
}

.category-nav {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.nav-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.nav-section-title {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #a8a29e;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.nav-section-count {
  font-size: 0.6875rem;
  color: #a8a29e;
  background: #f5f5f4;
  padding: 2px 6px;
  border-radius: 3px;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 10px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
  gap: 8px;
}

.nav-item-icon {
  color: #a8a29e;
  flex-shrink: 0;
}

.nav-item:hover {
  background: #f8f7ff;
}

.nav-item:hover .nav-item-icon {
  color: #78716c;
}

.nav-item.active {
  background: rgba(99, 102, 241, 0.1);
}

.nav-item.active .nav-item-icon {
  color: var(--color-primary);
}

.nav-item-text {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #1c1917;
  flex: 1;
}

.nav-item.active .nav-item-text {
  color: var(--color-secondary);
}

.nav-item-count {
  font-size: 0.6875rem;
  color: #a8a29e;
  background: #f5f5f4;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.nav-item.active .nav-item-count {
  background: rgba(99, 102, 241, 0.15);
  color: var(--color-secondary);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-list,
.content-detail {
  padding: 32px 48px 32px 32px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  font-size: 0.875rem;
  color: #78716c;
}

.breadcrumb-item {
  cursor: pointer;
  transition: color 0.2s ease;
}

.breadcrumb-item:hover {
  color: var(--color-primary);
}

.breadcrumb-item.current {
  color: var(--color-secondary);
  font-weight: 500;
}

.breadcrumb-separator {
  color: #e7e5e4;
}

.content-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.search-bar {
  flex: 1;
  position: relative;
}

.search-bar .search-icon {
  left: 12px;
  width: 18px;
  height: 18px;
}

.search-bar .search-input {
  padding: 10px 16px 10px 40px;
  font-size: 0.9375rem;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-select {
  padding: 10px 12px;
  border: 1px solid #e7e5e4;
  border-radius: 6px;
  background: white;
  color: #1c1917;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-select:hover {
  border-color: var(--color-primary);
}

.sort-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

.sort-order-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e7e5e4;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #78716c;
}

.sort-order-btn:hover {
  background: #f8f7ff;
  color: var(--color-primary);
}

.sort-order-btn svg {
  transition: transform 0.3s ease;
}

.sort-order-btn svg.rotated {
  transform: rotate(180deg);
}

.knowledge-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.knowledge-card {
  background: white;
  border: 1px solid #e7e5e4;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.knowledge-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-category {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(99, 102, 241, 0.1);
  color: var(--color-secondary);
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.card-date {
  font-size: 0.8125rem;
  color: #a8a29e;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1c1917;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.card-description {
  color: #57534e;
  font-size: 0.9375rem;
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f5f5f4;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 0.75rem;
  padding: 4px 10px;
  background: #f8f7ff;
  color: #78716c;
  border-radius: 12px;
  font-weight: 500;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #78716c;
  font-size: 0.8125rem;
}

.read-time {
  display: flex;
  align-items: center;
  gap: 4px;
}

.arrow-icon {
  color: var(--color-primary);
  transition: transform 0.2s ease;
}

.knowledge-card:hover .arrow-icon {
  transform: translateX(4px);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 32px;
}

.pagination-btn {
  padding: 8px 16px;
  border: 1px solid #e7e5e4;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #1c1917;
  font-size: 0.875rem;
}

.pagination-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-secondary);
  background: rgba(99, 102, 241, 0.05);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  gap: 4px;
}

.pagination-page {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e7e5e4;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #1c1917;
  font-size: 0.875rem;
}

.pagination-page:hover {
  border-color: var(--color-primary);
  color: var(--color-secondary);
}

.pagination-page.active {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  border-color: transparent;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 32px;
  text-align: center;
}

.empty-icon-wrapper {
  margin-bottom: 24px;
}

.empty-icon {
  color: #e7e5e4;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1c1917;
  margin-bottom: 8px;
}

.empty-description {
  color: #78716c;
  margin-bottom: 24px;
}

.reset-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.content-detail {
  position: relative;
}

.reading-progress-bar {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  height: 3px;
  background: #f5f5f4;
  z-index: 100;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  transition: width 0.1s ease;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e7e5e4;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #e7e5e4;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #1c1917;
  font-size: 0.875rem;
  font-weight: 500;
}

.back-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-secondary);
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.875rem;
  color: #78716c;
}

.detail-category {
  font-weight: 600;
  color: var(--color-secondary);
}

.detail-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 32px;
  align-items: start;
}

.detail-body {
  min-width: 0;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  padding-right: 16px;
}

.detail-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1c1917;
  margin-bottom: 16px;
  line-height: 1.3;
}

.detail-description {
  color: #57534e;
  font-size: 1.125rem;
  line-height: 1.7;
  margin-bottom: 24px;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
}

.detail-tags .tag {
  background: rgba(99, 102, 241, 0.1);
  color: var(--color-secondary);
}

.detail-content {
  font-size: 1.0625rem;
  line-height: 1.8;
  color: #374151;
}

.detail-content :deep(h1),
.detail-content :deep(h2),
.detail-content :deep(h3) {
  color: #1f2937;
  font-weight: 600;
  scroll-margin-top: 20px;
}

.detail-content :deep(h1) {
  font-size: 2rem;
}

.detail-content :deep(h2) {
  font-size: 1.625rem;
}

.detail-content :deep(h3) {
  font-size: 1.375rem;
}

.detail-content :deep(p) {
  margin-bottom: 1.75em;
}

.detail-content :deep(code) {
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  color: #dc2626;
}

.detail-content :deep(pre) {
  background: #1f2937;
  color: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.5em 0;
}

.detail-content :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
}

.detail-content :deep(ul),
.detail-content :deep(ol) {
  margin-bottom: 1.75em;
  padding-left: 2em;
}

.detail-content :deep(li) {
  margin-bottom: 0.5em;
}

.detail-content :deep(a) {
  color: var(--color-secondary);
  text-decoration: none;
}

.detail-content :deep(a:hover) {
  text-decoration: underline;
}

.toc-sidebar {
  position: sticky;
  top: 80px;
  background: white;
  border: 1px solid #e7e5e4;
  border-radius: 8px;
  padding: 16px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.toc-header {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1c1917;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e7e5e4;
}

.toc-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toc-item {
  font-size: 0.8125rem;
  color: #78716c;
  text-decoration: none;
  padding: 6px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  line-height: 1.5;
}

.toc-item:hover {
  background: #f8f7ff;
  color: var(--color-primary);
}

.toc-level-2 {
  padding-left: 16px;
  font-weight: 500;
}

.toc-level-3 {
  font-weight: 400;
  padding-left: 32px;
}

.back-to-top-btn {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  transition: all 0.3s ease;
  z-index: 90;
}

.back-to-top-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
}

.back-to-top-btn:active {
  transform: translateY(-2px);
}

@media (max-width: 1024px) {
  .content-list,
  .content-detail {
    padding: 24px 32px 24px 20px;
  }

  .toc-sidebar {
    display: none;
  }

  .back-to-top-btn {
    bottom: 24px;
    right: 24px;
    width: 44px;
    height: 44px;
  }
}

@media (max-width: 968px) {
  .sidebar-drawer {
    width: 100%;
    position: relative;
    top: 0;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #e7e5e4;
  }

  .sidebar-drawer.collapsed {
    width: 100%;
  }

  .drawer-content {
    display: none;
  }

  .sidebar-drawer.collapsed .drawer-content {
    display: block;
  }

  .main-content {
    margin-left: 0;
  }

  .sidebar-drawer.collapsed + .main-content {
    margin-left: 0;
  }

  .content-list,
  .content-detail {
    padding: 24px 24px 24px 20px;
  }

  .detail-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .content-list,
  .content-detail {
    padding: 24px 30px 24px 16px;
  }

  .knowledge-card {
    padding: 16px;
  }

  .card-title {
    font-size: 1rem;
  }

  .card-description {
    font-size: 0.875rem;
  }

  .content-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .detail-title {
    font-size: 1.5rem;
  }

  .detail-description {
    font-size: 1rem;
  }

  .detail-body {
    max-height: calc(100vh - 300px);
  }

  .back-to-top-btn {
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 640px) {
  .drawer-header {
    padding: 16px;
  }

  .drawer-title {
    font-size: 1rem;
  }

  .content-list,
  .content-detail {
    padding: 20px 16px;
  }

  .stats-section {
    grid-template-columns: repeat(3, 1fr);
  }

  .stat-value {
    font-size: 1rem;
  }

  .card-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .pagination-pages {
    display: none;
  }

  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .detail-title {
    font-size: 1.25rem;
  }
}
</style>
