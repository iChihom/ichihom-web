<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { themePresets, applyTheme, initializeTheme, getStoredTheme } from '@/utils/theme'

const route = useRoute()
const showThemeMenu = ref(false)
const currentTheme = ref('橙色')

const isActive = (path: string) => route.path === path

const toggleThemeMenu = () => {
  showThemeMenu.value = !showThemeMenu.value
}

const selectTheme = (themeName: string) => {
  currentTheme.value = themeName
  applyTheme(themeName)
  showThemeMenu.value = false
}

const closeThemeMenu = () => {
  showThemeMenu.value = false
}

onMounted(() => {
  initializeTheme()
  currentTheme.value = getStoredTheme()
})
</script>

<template>
  <header class="site-header">
    <div class="container">
      <div class="header-content">
        <RouterLink to="/" class="logo">
          <span class="logo-text">Chihom Know</span>
        </RouterLink>
        <nav class="main-nav">
          <RouterLink to="/" class="nav-link" :class="{ active: isActive('/') }">首页</RouterLink>
          <RouterLink to="/knowledge" class="nav-link" :class="{ active: isActive('/knowledge') || isActive('/knowledge/') }">知识库</RouterLink>
          <RouterLink to="/menu" class="nav-link" :class="{ active: isActive('/menu') || isActive('/menu/') }">菜单</RouterLink>
          <div class="theme-selector">
            <button 
              class="theme-button" 
              @click="toggleThemeMenu"
              :class="{ active: showThemeMenu }"
            >
              <span class="theme-icon">🎨</span>
              <span class="theme-name">{{ currentTheme }}</span>
              <svg class="dropdown-arrow" :class="{ rotated: showThemeMenu }" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <div class="theme-dropdown" v-show="showThemeMenu">
              <div class="theme-dropdown-header">
                <span class="dropdown-title">选择主题配色</span>
              </div>
              <div class="theme-list">
                <button
                  v-for="theme in themePresets"
                  :key="theme.name"
                  class="theme-item"
                  :class="{ active: currentTheme === theme.name }"
                  @click="selectTheme(theme.name)"
                >
                  <div class="theme-preview">
                    <div class="color-dot" :style="{ background: theme.primary }"></div>
                    <div class="color-dot" :style="{ background: theme.secondary }"></div>
                  </div>
                  <span class="theme-item-name">{{ theme.name }}</span>
                  <svg v-if="currentTheme === theme.name" class="check-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3 3 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
    <div class="dropdown-overlay" v-show="showThemeMenu" @click="closeThemeMenu"></div>
  </header>
</template>

<style scoped>
.site-header {
  background: rgba(250, 249, 247, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid #e7e5e4;
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo {
  text-decoration: none;
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1c1917;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.main-nav {
  display: flex;
  gap: 8px;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: #78716c;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.nav-link:hover {
  color: #1c1917;
  background: #f8f7ff;
}

.nav-link.active {
  color: var(--color-primary);
  background: rgba(99, 102, 241, 0.1);
}

.theme-selector {
  position: relative;
}

.theme-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #e7e5e4;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  font-weight: 500;
  color: #78716c;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.theme-button:hover {
  border-color: var(--color-primary);
  background: #f8f7ff;
  color: var(--color-primary);
}

.theme-button.active {
  border-color: var(--color-primary);
  background: rgba(99, 102, 241, 0.1);
  color: var(--color-primary);
}

.theme-icon {
  font-size: 1rem;
}

.theme-name {
  font-size: 0.9rem;
  font-weight: 500;
}

.dropdown-arrow {
  transition: transform 0.2s ease;
  color: rgba(255, 255, 255, 0.4);
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.theme-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 240px;
  background: white;
  backdrop-filter: blur(20px);
  border: 1px solid #e7e5e4;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 101;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.theme-dropdown-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f5f5f4;
  background: #f8f7ff;
}

.dropdown-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1c1917;
}

.theme-list {
  padding: 8px;
  max-height: 320px;
  overflow-y: auto;
}

.theme-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
  color: #78716c;
}

.theme-item:hover {
  background: #f8f7ff;
  color: #1c1917;
}

.theme-item.active {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
}

.theme-preview {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.theme-item.active .color-dot {
  border-color: rgba(255, 255, 255, 0.3);
}

.theme-item-name {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
}

.check-icon {
  flex-shrink: 0;
  color: white;
}

.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 100;
}

@media (max-width: 640px) {
  .header-content {
    height: 56px;
  }

  .logo-text {
    font-size: 1.25rem;
  }

  .main-nav {
    gap: 4px;
  }

  .nav-link {
    padding: 6px 12px;
    font-size: 0.875rem;
  }

  .theme-button {
    padding: 6px 12px;
    font-size: 0.875rem;
  }

  .theme-name {
    font-size: 0.875rem;
  }

  .theme-dropdown {
    min-width: 200px;
  }
}
</style>
