export interface ThemeColor {
  name: string
  primary: string
  secondary: string
  accent: string
}

export const themePresets: ThemeColor[] = [
  {
    name: '紫色',
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#667eea'
  },
  {
    name: '蓝色',
    primary: '#3b82f6',
    secondary: '#1d4ed8',
    accent: '#3b82f6'
  },
  {
    name: '绿色',
    primary: '#10b981',
    secondary: '#059669',
    accent: '#10b981'
  },
  {
    name: '橙色',
    primary: '#f59e0b',
    secondary: '#d97706',
    accent: '#f59e0b'
  },
  {
    name: '红色',
    primary: '#ef4444',
    secondary: '#dc2626',
    accent: '#ef4444'
  },
  {
    name: '粉色',
    primary: '#ec4899',
    secondary: '#db2777',
    accent: '#ec4899'
  },
  {
    name: '青色',
    primary: '#06b6d4',
    secondary: '#0891b2',
    accent: '#06b6d4'
  },
  {
    name: '靛蓝',
    primary: '#6366f1',
    secondary: '#4f46e5',
    accent: '#6366f1'
  }
]

export const THEME_STORAGE_KEY = 'chihom-know-theme'

export function getStoredTheme(): string {
  if (typeof window === 'undefined') return '橙色'
  return localStorage.getItem(THEME_STORAGE_KEY) || '橙色'
}

export function setStoredTheme(themeName: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(THEME_STORAGE_KEY, themeName)
}

export function applyTheme(themeName: string): void {
  const theme = themePresets.find(t => t.name === themeName) || themePresets[0]
  const root = document.documentElement
  
  root.style.setProperty('--color-primary', theme.primary)
  root.style.setProperty('--color-secondary', theme.secondary)
  root.style.setProperty('--color-accent', theme.accent)
  
  setStoredTheme(themeName)
}

export function initializeTheme(): void {
  const themeName = getStoredTheme()
  applyTheme(themeName)
}
