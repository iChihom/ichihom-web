import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GitHubProject, ProjectCategory, ProjectFilter, ProjectStats } from '@/types/project'

export const useProjectStore = defineStore('project', () => {
  const items = ref<GitHubProject[]>([])
  const loading = ref(false)

  const categories = computed<ProjectCategory[]>(() => {
    const categoryMap = new Map<string, number>()
    items.value.forEach(item => {
      item.topics.forEach(topic => {
        categoryMap.set(topic, (categoryMap.get(topic) || 0) + 1)
      })
    })
    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  })

  const languages = computed(() => {
    const languageMap = new Map<string, { count: number; color: string }>()
    items.value.forEach(item => {
      if (item.language) {
        const existing = languageMap.get(item.language)
        if (existing) {
          existing.count++
        } else {
          languageMap.set(item.language, { count: 1, color: item.languageColor })
        }
      }
    })
    return Array.from(languageMap.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        color: data.color
      }))
      .sort((a, b) => b.count - a.count)
  })

  const stats = computed<ProjectStats>(() => {
    const languageMap: { [key: string]: number } = {}
    items.value.forEach(item => {
      if (item.language) {
        languageMap[item.language] = (languageMap[item.language] || 0) + 1
      }
    })

    return {
      totalProjects: items.value.length,
      totalStars: items.value.reduce((sum, item) => sum + item.stars, 0),
      totalForks: items.value.reduce((sum, item) => sum + item.forks, 0),
      totalWatchers: items.value.reduce((sum, item) => sum + item.watchers, 0),
      languages: languageMap
    }
  })

  const filteredItems = computed(() => {
    return (filter: ProjectFilter) => {
      let result = items.value

      if (filter.category) {
        result = result.filter(item => item.topics.includes(filter.category))
      }

      if (filter.language) {
        result = result.filter(item => item.language === filter.language)
      }

      if (filter.search) {
        const searchLower = filter.search.toLowerCase()
        result = result.filter(
          item =>
            item.name.toLowerCase().includes(searchLower) ||
            item.fullName.toLowerCase().includes(searchLower) ||
            item.description.toLowerCase().includes(searchLower) ||
            item.topics.some(topic => topic.toLowerCase().includes(searchLower))
        )
      }

      const sortBy = filter.sortBy || 'stars'
      const sortOrder = filter.sortOrder || 'desc'

      result.sort((a, b) => {
        let comparison = 0
        switch (sortBy) {
          case 'stars':
            comparison = b.stars - a.stars
            break
          case 'forks':
            comparison = b.forks - a.forks
            break
          case 'updated':
            comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            break
          case 'name':
            comparison = a.name.localeCompare(b.name)
            break
          case 'created':
            comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            break
        }
        return sortOrder === 'asc' ? -comparison : comparison
      })

      return result
    }
  })

  const getProjectById = (id: string) => {
    return items.value.find(item => item.id === id)
  }

  const getProjectsByLanguage = (language: string) => {
    return items.value.filter(item => item.language === language)
  }

  const getProjectsByTopic = (topic: string) => {
    return items.value.filter(item => item.topics.includes(topic))
  }

  const getRecentProjects = (limit: number = 5) => {
    return [...items.value]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit)
  }

  const getTrendingProjects = (limit: number = 5) => {
    return [...items.value]
      .sort((a, b) => b.stars - a.stars)
      .slice(0, limit)
  }

  const setItems = (newItems: GitHubProject[]) => {
    items.value = newItems
  }

  return {
    items,
    loading,
    categories,
    languages,
    stats,
    filteredItems,
    getProjectById,
    getProjectsByLanguage,
    getProjectsByTopic,
    getRecentProjects,
    getTrendingProjects,
    setItems
  }
})
