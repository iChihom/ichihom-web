<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useProjectStore } from '@/stores/project'
import { loadMockProjects } from '@/utils/mockProjects'
import type { ProjectFilter } from '@/types/project'

const projectStore = useProjectStore()
const searchQuery = ref('')
const selectedTopic = ref('')
const selectedLanguage = ref('')
const isSidebarCollapsed = ref(false)
const selectedProject = ref<any>(null)
const isProjectOpen = ref(false)
const currentPage = ref(1)
const itemsPerPage = 10
const sortBy = ref<'stars' | 'forks' | 'updated' | 'name' | 'created'>('stars')
const sortOrder = ref<'desc' | 'asc'>('desc')
const searchInputRef = ref<HTMLInputElement | null>(null)
const readingProgress = ref(0)
const showBackToTop = ref(false)
const tocItems = ref<any[]>([])

const filteredProjects = computed(() => {
  const filter: ProjectFilter = {
    search: searchQuery.value,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value
  }
  if (selectedTopic.value) {
    filter.category = selectedTopic.value
  }
  if (selectedLanguage.value) {
    filter.language = selectedLanguage.value
  }
  return projectStore.filteredItems(filter)
})

const totalPages = computed(() => Math.ceil(filteredProjects.value.length / itemsPerPage))

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProjects.value.slice(start, end)
})

const topics = computed(() => projectStore.categories)
const languages = computed(() => projectStore.languages)
const stats = computed(() => projectStore.stats)

const handleSearch = (event: Event) => {
  searchQuery.value = (event.target as HTMLInputElement).value
  currentPage.value = 1
}

const selectTopic = (topic: string) => {
  selectedTopic.value = selectedTopic.value === topic ? '' : topic
  selectedProject.value = null
  isProjectOpen.value = false
  currentPage.value = 1
}

const selectLanguage = (language: string) => {
  selectedLanguage.value = selectedLanguage.value === language ? '' : language
  selectedProject.value = null
  isProjectOpen.value = false
  currentPage.value = 1
}

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const openProject = (project: any) => {
  selectedProject.value = project
  isProjectOpen.value = true
  generateToc(project.readme || '')
}

const closeProject = () => {
  selectedProject.value = null
  isProjectOpen.value = false
  tocItems.value = []
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

const generateToc = (content: string) => {
  const headings = content.match(/^#{1,3}\s+.+$/gm) || []
  tocItems.value = headings.map((heading, index) => {
    const level = (heading.match(/^#+/) || [''])[0].length
    const text = heading.replace(/^#+\s+/, '')
    return {
      id: `heading-${index}`,
      text,
      level
    }
  })
}

const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const renderMarkdown = (content: string) => {
  return content
    .replace(/^### (.*$)/gim, '<h3 id="heading-$1">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 id="heading-$1">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 id="heading-$1">$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    .replace(/\n/gim, '<br>')
}

const handleScroll = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  readingProgress.value = (scrollTop / docHeight) * 100
  showBackToTop.value = scrollTop > 300
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
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

onMounted(async () => {
  const projects = loadMockProjects()
  projectStore.setItems(projects)
  window.addEventListener('keydown', handleKeyboardShortcut)
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboardShortcut)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="projects-page">
    <aside class="sidebar-drawer" :class="{ collapsed: isSidebarCollapsed }">
      <div class="drawer-header">
        <div class="drawer-title" v-if="!isSidebarCollapsed">项目库</div>
        <button class="drawer-toggle-btn" @click="toggleSidebar" :title="isSidebarCollapsed ? '展开' : '折叠'">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" :class="{ rotated: isSidebarCollapsed }">
            <path d="M3 10h14M10 3l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>

      <div class="drawer-content" v-if="!isSidebarCollapsed">
        <div class="stats-section">
          <div class="stat-card">
            <div class="stat-value">{{ formatNumber(stats.totalProjects) }}</div>
            <div class="stat-label">项目</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ formatNumber(stats.totalStars) }}</div>
            <div class="stat-label">Stars</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ formatNumber(stats.totalForks) }}</div>
            <div class="stat-label">Forks</div>
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
              <div class="nav-section-title">主题</div>
              <div class="nav-section-count">{{ topics.length }}</div>
            </div>
            <div class="nav-list">
              <button
                class="nav-item"
                :class="{ active: selectedTopic === '' }"
                @click="selectTopic('')"
              >
                <svg class="nav-item-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span class="nav-item-text">全部</span>
                <span class="nav-item-count">{{ stats.totalProjects }}</span>
              </button>
              <button
                v-for="topic in topics"
                :key="topic.id"
                class="nav-item"
                :class="{ active: selectedTopic === topic.name }"
                @click="selectTopic(topic.name)"
              >
                <svg class="nav-item-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2l6 6-6 6M2 8h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span class="nav-item-text">{{ topic.name }}</span>
                <span class="nav-item-count">{{ topic.count }}</span>
              </button>
            </div>
          </div>

          <div class="nav-section" v-if="languages.length > 0">
            <div class="nav-section-header">
              <div class="nav-section-title">语言</div>
              <div class="nav-section-count">{{ languages.length }}</div>
            </div>
            <div class="nav-list">
              <button
                v-for="lang in languages.slice(0, 8)"
                :key="lang.name"
                class="nav-item"
                :class="{ active: selectedLanguage === lang.name }"
                @click="selectLanguage(lang.name)"
              >
                <span class="language-dot" :style="{ backgroundColor: lang.color }"></span>
                <span class="nav-item-text">{{ lang.name }}</span>
                <span class="nav-item-count">{{ lang.count }}</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </aside>

    <main class="main-content">
      <div v-if="!isProjectOpen" class="content-list">
        <nav class="breadcrumb">
          <span class="breadcrumb-item">项目库</span>
          <span v-if="selectedTopic" class="breadcrumb-separator">/</span>
          <span v-if="selectedTopic" class="breadcrumb-item current">{{ selectedTopic }}</span>
          <span v-if="selectedLanguage" class="breadcrumb-separator">/</span>
          <span v-if="selectedLanguage" class="breadcrumb-item current">{{ selectedLanguage }}</span>
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
              placeholder="搜索项目..."
              class="search-input"
            />
          </div>
          <div class="sort-controls">
            <select v-model="sortBy" class="sort-select">
              <option value="stars">Stars</option>
              <option value="forks">Forks</option>
              <option value="updated">更新时间</option>
              <option value="name">名称</option>
              <option value="created">创建时间</option>
            </select>
            <button class="sort-order-btn" @click="sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" :class="{ rotated: sortOrder === 'asc' }">
                <path d="M8 3v10M3 8l5-5 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="filteredProjects.length > 0" class="projects-list">
          <div v-for="project in paginatedProjects" :key="project.id" class="project-card" @click="openProject(project)">
            <div class="project-header">
              <div class="project-title-row">
                <svg class="repo-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2a6 6 0 100 12A6 6 0 008 2zM8 4a4 4 0 110 8 4 4 0 010-8z" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1.5" />
                </svg>
                <h3 class="project-name">{{ project.name }}</h3>
                <span class="project-visibility" :class="{ private: project.isPrivate }">
                  {{ project.isPrivate ? 'Private' : 'Public' }}
                </span>
              </div>
              <div class="project-meta">
                <span class="project-owner">{{ project.owner.login }}</span>
                <span class="project-updated">{{ formatDate(project.updatedAt) }}</span>
              </div>
            </div>
            <p class="project-description">{{ project.description }}</p>
            <div class="project-stats">
              <div class="stat-item">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2l1.5 3h3.5l-2.5 2.5 1 3.5L7 9l-3.5 2 1-3.5L2 5h3.5L7 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="currentColor" fill-opacity="0.1" />
                </svg>
                <span>{{ formatNumber(project.stars) }}</span>
              </div>
              <div class="stat-item">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 5v6M12 5v6M5 2v10M9 2v10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                </svg>
                <span>{{ formatNumber(project.forks) }}</span>
              </div>
              <div class="stat-item">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2a5 5 0 100 10A5 5 0 007 2zM7 5v2h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span>{{ formatNumber(project.watchers) }}</span>
              </div>
              <div class="stat-item language">
                <span class="language-dot" :style="{ backgroundColor: project.languageColor }"></span>
                <span>{{ project.language }}</span>
              </div>
            </div>
            <div v-if="project.topics.length > 0" class="project-topics">
              <span v-for="topic in project.topics.slice(0, 4)" :key="topic" class="topic-tag">{{ topic }}</span>
            </div>
          </div>
        </div>

        <div v-if="filteredProjects.length > 0 && totalPages > 1" class="pagination">
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
          <h3 class="empty-title">没有找到相关项目</h3>
          <p class="empty-description">尝试调整搜索关键词或选择其他分类</p>
          <button @click="selectTopic(''); selectedLanguage = ''; searchQuery = ''" class="reset-btn">
            清除筛选条件
          </button>
        </div>
      </div>

      <div v-else class="content-detail">
        <div class="reading-progress-bar">
          <div class="progress-fill" :style="{ width: `${readingProgress}%` }"></div>
        </div>

        <div class="detail-header">
          <button class="back-btn" @click="closeProject">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4l-8 8 8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>返回列表</span>
          </button>
          <div class="detail-meta">
            <span class="detail-language">
              <span class="language-dot" :style="{ backgroundColor: selectedProject?.languageColor }"></span>
              {{ selectedProject?.language }}
            </span>
            <span class="detail-updated">{{ formatDate(selectedProject?.updatedAt) }}</span>
          </div>
        </div>

        <div class="detail-layout">
          <div class="detail-body">
            <div class="project-detail-header">
              <div class="project-title-row">
                <svg class="repo-icon" width="24" height="24" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2a6 6 0 100 12A6 6 0 008 2zM8 4a4 4 0 110 8 4 4 0 010-8z" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1.5" />
                </svg>
                <h1 class="detail-title">{{ selectedProject?.fullName }}</h1>
              </div>
              <div class="project-detail-stats">
                <div class="stat-card-large">
                  <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
                    <path d="M7 2l1.5 3h3.5l-2.5 2.5 1 3.5L7 9l-3.5 2 1-3.5L2 5h3.5L7 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="currentColor" fill-opacity="0.1" />
                  </svg>
                  <div class="stat-info">
                    <div class="stat-value">{{ formatNumber(selectedProject?.stars) }}</div>
                    <div class="stat-label">Stars</div>
                  </div>
                </div>
                <div class="stat-card-large">
                  <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
                    <path d="M2 5v6M12 5v6M5 2v10M9 2v10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  </svg>
                  <div class="stat-info">
                    <div class="stat-value">{{ formatNumber(selectedProject?.forks) }}</div>
                    <div class="stat-label">Forks</div>
                  </div>
                </div>
                <div class="stat-card-large">
                  <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
                    <path d="M7 2a5 5 0 100 10A5 5 0 007 2zM7 5v2h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div class="stat-info">
                    <div class="stat-value">{{ formatNumber(selectedProject?.watchers) }}</div>
                    <div class="stat-label">Watchers</div>
                  </div>
                </div>
                <div class="stat-card-large">
                  <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
                    <path d="M7 2l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4L7 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div class="stat-info">
                    <div class="stat-value">{{ selectedProject?.openIssues }}</div>
                    <div class="stat-label">Issues</div>
                  </div>
                </div>
              </div>
            </div>

            <p class="detail-description">{{ selectedProject?.description }}</p>

            <div v-if="selectedProject?.topics.length > 0" class="detail-topics">
              <span v-for="topic in selectedProject.topics" :key="topic" class="topic-tag">{{ topic }}</span>
            </div>

            <div class="detail-meta-info">
              <div class="meta-item">
                <span class="meta-label">所有者:</span>
                <span class="meta-value">{{ selectedProject?.owner.login }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">大小:</span>
                <span class="meta-value">{{ formatNumber(selectedProject?.size) }} KB</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">许可证:</span>
                <span class="meta-value">{{ selectedProject?.license || '无' }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">默认分支:</span>
                <span class="meta-value">{{ selectedProject?.defaultBranch }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">创建时间:</span>
                <span class="meta-value">{{ new Date(selectedProject?.createdAt).toLocaleDateString('zh-CN') }}</span>
              </div>
              <div v-if="selectedProject?.homepage" class="meta-item">
                <span class="meta-label">主页:</span>
                <a :href="selectedProject.homepage" target="_blank" class="meta-link">{{ selectedProject.homepage }}</a>
              </div>
            </div>

            <div class="detail-content" v-html="renderMarkdown(selectedProject?.readme || '')"></div>
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
.projects-page {
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

.language-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
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

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.project-card {
  background: white;
  border: 1px solid #e7e5e4;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.project-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
}

.project-header {
  margin-bottom: 12px;
}

.project-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.repo-icon {
  color: #a8a29e;
  flex-shrink: 0;
}

.project-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1c1917;
  margin: 0;
}

.project-visibility {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 12px;
  background: #f5f5f4;
  color: #78716c;
  font-weight: 500;
  margin-left: auto;
}

.project-visibility.private {
  background: rgba(99, 102, 241, 0.1);
  color: var(--color-secondary);
}

.project-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.8125rem;
  color: #78716c;
}

.project-owner {
  font-weight: 500;
}

.project-description {
  color: #57534e;
  font-size: 0.9375rem;
  line-height: 1.6;
  margin-bottom: 16px;
}

.project-stats {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8125rem;
  color: #78716c;
}

.stat-item svg {
  color: #a8a29e;
}

.stat-item.language {
  display: flex;
  align-items: center;
  gap: 6px;
}

.project-topics {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.topic-tag {
  font-size: 0.75rem;
  padding: 4px 10px;
  background: #f8f7ff;
  color: #78716c;
  border-radius: 12px;
  font-weight: 500;
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

.detail-language {
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 32px;
  align-items: start;
}

.detail-body {
  min-width: 0;
}

.project-detail-header {
  margin-bottom: 24px;
}

.project-detail-header .project-title-row {
  margin-bottom: 16px;
}

.project-detail-header .repo-icon {
  width: 24px;
  height: 24px;
}

.detail-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1c1917;
  margin: 0;
}

.project-detail-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stat-card-large {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f7ff;
  border-radius: 8px;
}

.stat-card-large svg {
  color: #a8a29e;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.stat-info .stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-secondary);
  margin-bottom: 2px;
}

.stat-info .stat-label {
  font-size: 0.75rem;
  color: #78716c;
}

.detail-description {
  color: #57534e;
  font-size: 1.0625rem;
  line-height: 1.7;
  margin-bottom: 24px;
}

.detail-topics {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f7ff;
  border-radius: 8px;
}

.detail-topics .topic-tag {
  background: white;
  color: #78716c;
}

.detail-meta-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 32px;
  padding: 20px;
  background: #f8f7ff;
  border-radius: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
}

.meta-label {
  color: #78716c;
  font-weight: 500;
}

.meta-value {
  color: #1c1917;
}

.meta-link {
  color: var(--color-secondary);
  text-decoration: none;
}

.meta-link:hover {
  text-decoration: underline;
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

  .project-detail-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .content-list,
  .content-detail {
    padding: 24px 30px 24px 16px;
  }

  .project-card {
    padding: 16px;
  }

  .project-name {
    font-size: 1rem;
  }

  .project-description {
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

  .project-detail-stats {
    grid-template-columns: 1fr;
  }

  .detail-meta-info {
    grid-template-columns: 1fr;
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

  .project-stats {
    flex-wrap: wrap;
    gap: 12px;
  }

  .project-topics {
    gap: 4px;
  }

  .topic-tag {
    font-size: 0.6875rem;
    padding: 3px 8px;
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

  .stat-card-large {
    padding: 12px;
  }

  .stat-info .stat-value {
    font-size: 1.125rem;
  }
}
</style>
