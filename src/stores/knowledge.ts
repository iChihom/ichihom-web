import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { KnowledgeItem, KnowledgeCategory, KnowledgeFilter } from '@/types/knowledge'

export const useKnowledgeStore = defineStore('knowledge', () => {
  const items = ref<KnowledgeItem[]>([])
  const loading = ref(false)

  const categories = computed<KnowledgeCategory[]>(() => {
    const categoryMap = new Map<string, number>()
    items.value.forEach(item => {
      categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1)
    })
    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        count
      }))
      .sort((a, b) => b.count - a.count)
  })

  const tags = computed(() => {
    const tagMap = new Map<string, number>()
    items.value.forEach(item => {
      item.tags.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
      })
    })
    return Array.from(tagMap.entries())
      .map(([name, count]) => ({
        name,
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  })

  const stats = computed(() => {
    return {
      totalArticles: items.value.length,
      totalCategories: categories.value.length,
      totalTags: tags.value.length
    }
  })

  const filteredItems = computed(() => {
    return (filter: KnowledgeFilter) => {
      let result = items.value

      if (filter.category) {
        result = result.filter(item => item.category === filter.category)
      }

      if (filter.search) {
        const searchLower = filter.search.toLowerCase()
        result = result.filter(
          item =>
            item.title.toLowerCase().includes(searchLower) ||
            item.description.toLowerCase().includes(searchLower) ||
            item.content.toLowerCase().includes(searchLower)
        )
      }

      const sortBy = filter.sortBy || 'date'
      const sortOrder = filter.sortOrder || 'desc'

      result.sort((a, b) => {
        let comparison = 0
        switch (sortBy) {
          case 'date':
            const dateA = a.date ? new Date(a.date).getTime() : 0
            const dateB = b.date ? new Date(b.date).getTime() : 0
            comparison = dateB - dateA
            break
          case 'title':
            comparison = a.title.localeCompare(b.title)
            break
          case 'category':
            comparison = a.category.localeCompare(b.category)
            break
        }
        return sortOrder === 'asc' ? -comparison : comparison
      })

      return result
    }
  })

  const getItemsByCategory = (category: string) => {
    return items.value.filter(item => item.category === category)
  }

  const getItemBySlug = (slug: string) => {
    return items.value.find(item => item.slug === slug)
  }

  const getRecentItems = (limit: number = 5) => {
    return [...items.value]
      .sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0
        const dateB = b.date ? new Date(b.date).getTime() : 0
        return dateB - dateA
      })
      .slice(0, limit)
  }

  const setItems = (newItems: KnowledgeItem[]) => {
    items.value = newItems
  }

  return {
    items,
    loading,
    categories,
    tags,
    stats,
    filteredItems,
    getItemsByCategory,
    getItemBySlug,
    getRecentItems,
    setItems
  }
})
