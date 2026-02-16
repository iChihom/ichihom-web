<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useKnowledgeStore } from '@/stores/knowledge'
import { loadKnowledgeFiles } from '@/utils/knowledge'
import { getPopularItems } from '@/data/menuData'

const knowledgeStore = useKnowledgeStore()
const recentItems = ref(knowledgeStore.getRecentItems(6))
const popularMenuItems = ref(getPopularItems())
const heroLoaded = ref(false)

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

onMounted(async () => {
  const items = await loadKnowledgeFiles()
  knowledgeStore.setItems(items)
  recentItems.value = knowledgeStore.getRecentItems(6)
  
  setTimeout(() => {
    heroLoaded.value = true
  }, 100)
})
</script>

<template>
  <div class="home-page">
    <section class="hero-section">
      <div class="hero-background">
        <div class="gradient-shape shape-1"></div>
        <div class="gradient-shape shape-2"></div>
        <div class="gradient-shape shape-3"></div>
        <div class="noise-overlay"></div>
      </div>
      <div class="hero-container">
        <div class="hero-content" :class="{ loaded: heroLoaded }">
          <div class="hero-badge">
            <svg class="badge-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L10.5 5.5L15 6.5L11.5 10L12.5 15L8 12.5L3.5 15L4.5 10L1 6.5L5.5 5.5L8 1Z" fill="currentColor" />
            </svg>
            <span>欢迎来到我的知识库</span>
          </div>
          
          <h1 class="hero-title">
            <span class="title-line">探索</span>
            <span class="title-line title-highlight">无限可能</span>
          </h1>
          
          <p class="hero-description">
            记录学习历程，分享技术心得。<br />
            在这里发现前端、后端、工具等各个领域的实用知识。
          </p>
          
          <div class="hero-actions">
            <RouterLink to="/knowledge" class="btn btn-primary">
              开始探索
              <svg class="btn-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9h12M9 3l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </RouterLink>
            <a href="#recent" class="btn btn-secondary">
              了解更多
            </a>
          </div>
          
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 4h12M4 10h12M4 16h8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-number">{{ knowledgeStore.items.length }}</span>
                <span class="stat-label">篇文章</span>
              </div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 7h14M3 12h14M7 3v14M13 3v14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-number">{{ knowledgeStore.categories.length }}</span>
                <span class="stat-label">个分类</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="hero-scroll-indicator">
        <div class="scroll-indicator-line"></div>
        <div class="scroll-indicator-dot"></div>
      </div>
    </section>

    <section id="recent" class="recent-section">
      <div class="section-container">
        <div class="section-header">
          <div class="section-title-group">
            <h2 class="section-title">最新文章</h2>
            <p class="section-subtitle">探索最新的技术知识和见解</p>
          </div>
          <RouterLink to="/knowledge" class="view-all-link">
            查看全部
            <svg class="arrow-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M10 5l3 3-3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </RouterLink>
        </div>

        <div v-if="recentItems.length > 0" class="articles-grid">
          <article v-for="item in recentItems" :key="item.id" class="article-card">
            <RouterLink :to="`/knowledge/${item.slug}`" class="article-link">
              <div class="article-header">
                <span class="article-category">{{ item.category }}</span>
                <span class="article-date">{{ item.date }}</span>
              </div>
              <h3 class="article-title">{{ item.title }}</h3>
              <p class="article-excerpt">{{ item.description }}</p>
              <div class="article-footer">
                <div class="article-tags">
                  <span v-for="tag in item.tags.slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
                </div>
                <div class="article-read">
                  <span>阅读更多</span>
                  <svg class="read-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M10 5l3 3-3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
              </div>
            </RouterLink>
          </article>
        </div>

        <div v-else class="empty-state">
          <svg class="empty-icon" width="64" height="64" viewBox="0 0 64 64" fill="none">
            <path d="M20 20h24M20 32h24M20 44h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          <p>暂无文章</p>
        </div>
      </div>
    </section>

    <section class="menu-section">
      <div class="section-container">
        <div class="section-header">
          <div class="section-title-group">
            <h2 class="section-title">热门菜品</h2>
            <p class="section-subtitle">发现美味的菜品和饮品</p>
          </div>
          <RouterLink to="/menu" class="view-all-link">
            查看全部
            <svg class="arrow-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M10 5l3 3-3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </RouterLink>
        </div>

        <div v-if="popularMenuItems.length > 0" class="menu-grid">
          <article v-for="item in popularMenuItems" :key="item.id" class="menu-card">
            <RouterLink to="/menu" class="menu-link">
              <div class="menu-image">
                <img :src="item.image" :alt="item.name" />
                <div v-if="item.spicy > 0" class="spicy-badge">
                  <span v-for="i in item.spicy" :key="i">🌶️</span>
                </div>
              </div>
              <div class="menu-content">
                <h3 class="menu-name">{{ item.name }}</h3>
                <p class="menu-description">{{ item.description }}</p>
                <div class="menu-footer">
                  <span class="menu-price">¥{{ item.price }}</span>
                </div>
              </div>
            </RouterLink>
          </article>
        </div>

        <div v-else class="empty-state">
          <svg class="empty-icon" width="64" height="64" viewBox="0 0 64 64" fill="none">
            <path d="M20 20h24M20 32h24M20 44h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          <p>暂无菜品</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  min-height: calc(100vh - 64px);
  background: #f8f7ff;
}

.hero-section {
  position: relative;
  min-height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f7ff 0%, #f3f0ff 50%, #eef0ff 100%);
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.gradient-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;
  animation: float 25s ease-in-out infinite;
}

.shape-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(79, 70, 229, 0.2) 100%);
  top: -150px;
  right: -100px;
  animation-delay: 0s;
}

.shape-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.25) 0%, rgba(139, 92, 246, 0.15) 100%);
  bottom: -100px;
  left: -100px;
  animation-delay: -8s;
}

.shape-3 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, rgba(196, 181, 253, 0.4) 0%, rgba(167, 139, 250, 0.3) 100%);
  top: 40%;
  left: 30%;
  animation-delay: -16s;
}

.noise-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.03;
  pointer-events: none;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  25% {
    transform: translate(20px, -15px) scale(1.05) rotate(5deg);
  }
  50% {
    transform: translate(-10px, 10px) scale(0.95) rotate(-3deg);
  }
  75% {
    transform: translate(15px, 5px) scale(1.02) rotate(2deg);
  }
}

.hero-container {
  position: relative;
  max-width: 900px;
  padding: 0 24px;
  z-index: 1;
}

.hero-content {
  text-align: center;
  opacity: 0;
  transform: translateY(40px);
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-content.loaded {
  opacity: 1;
  transform: translateY(0);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border-radius: 100px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 32px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #78716c;
  transition: all 0.3s ease;
}

.hero-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.2);
}

.badge-icon {
  color: var(--color-primary);
}

.hero-title {
  font-size: 4.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
  letter-spacing: -0.03em;
  color: #1c1917;
}

.title-line {
  display: block;
}

.title-highlight {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.25rem;
  line-height: 1.8;
  color: #57534e;
  margin-bottom: 40px;
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 48px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4);
}

.btn-secondary {
  background: white;
  color: #1c1917;
  border: 2px solid #e7e5e4;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.btn-secondary:hover {
  transform: translateY(-2px);
  border-color: var(--color-primary);
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.15);
}

.btn-icon {
  transition: transform 0.3s ease;
}

.btn:hover .btn-icon {
  transform: translateX(4px);
}

.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  padding-top: 32px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(99, 102, 241, 0.1);
  color: var(--color-primary);
}

.stat-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #1c1917;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #78716c;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(0, 0, 0, 0.08);
}

.hero-scroll-indicator {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  animation: bounce 2s ease-in-out infinite;
}

.scroll-indicator-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, rgba(99, 102, 241, 0.3), transparent);
}

.scroll-indicator-dot {
  width: 8px;
  height: 8px;
  background: var(--color-primary);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(10px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}

.recent-section {
  padding: 100px 0;
  background: #f8f7ff;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 48px;
}

.section-title-group {
  flex: 1;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1c1917;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #78716c;
  margin: 0;
  font-weight: 400;
}

.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #78716c;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  padding: 12px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.view-all-link:hover {
  color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.15);
}

.arrow-icon {
  transition: transform 0.2s ease;
}

.view-all-link:hover .arrow-icon {
  transform: translateX(4px);
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 32px;
}

.article-card {
  background: white;
  border: 1px solid #e7e5e4;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.article-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(99, 102, 241, 0.15);
}

.article-link {
  display: block;
  padding: 32px;
  text-decoration: none;
  color: inherit;
  height: 100%;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.article-category {
  display: inline-block;
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%);
  color: var(--color-secondary);
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.article-date {
  color: #a8a29e;
  font-size: 0.875rem;
  font-weight: 500;
}

.article-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1c1917;
  margin: 0 0 16px 0;
  line-height: 1.4;
  letter-spacing: -0.01em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-excerpt {
  color: #57534e;
  font-size: 1rem;
  line-height: 1.7;
  margin: 0 0 24px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #f5f5f4;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  display: inline-block;
  padding: 6px 14px;
  background: #f8f7ff;
  color: #78716c;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
}

.article-read {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-primary);
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.article-card:hover .article-read {
  color: var(--color-secondary);
}

.read-icon {
  transition: transform 0.2s ease;
}

.article-card:hover .read-icon {
  transform: translateX(4px);
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #a8a29e;
  font-size: 1rem;
}

.empty-icon {
  color: #d6d3d1;
  margin-bottom: 16px;
}

.menu-section {
  padding: 100px 0;
  background: white;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.menu-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.menu-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(99, 102, 241, 0.15);
}

.menu-link {
  display: block;
  text-decoration: none;
  color: inherit;
  height: 100%;
}

.menu-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.menu-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.menu-card:hover .menu-image img {
  transform: scale(1.05);
}

.spicy-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.875rem;
}

.menu-content {
  padding: 20px;
}

.menu-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1c1917;
  margin: 0 0 8px 0;
}

.menu-description {
  font-size: 0.875rem;
  color: #78716c;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.menu-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
}

@media (max-width: 1024px) {
  .hero-title {
    font-size: 3.5rem;
  }

  .articles-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }

  .menu-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 600px;
  }

  .hero-title {
    font-size: 2.75rem;
  }

  .hero-description {
    font-size: 1.125rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }

  .hero-stats {
    flex-direction: column;
    gap: 24px;
  }

  .stat-divider {
    width: 40px;
    height: 1px;
  }

  .recent-section {
    padding: 60px 0;
  }

  .section-title {
    font-size: 2rem;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }

  .menu-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 2.25rem;
  }

  .hero-badge {
    font-size: 0.8125rem;
    padding: 8px 16px;
  }

  .hero-description {
    font-size: 1rem;
  }

  .stat-number {
    font-size: 1.75rem;
  }
}
</style>
