export interface KnowledgeItem {
  id: string
  title: string
  slug: string
  description: string
  category: string
  tags: string[]
  date?: string
  content: string
}

export interface KnowledgeCategory {
  id: string
  name: string
  count: number
}

export interface KnowledgeFilter {
  category?: string
  search?: string
  sortBy?: 'date' | 'title' | 'category'
  sortOrder?: 'desc' | 'asc'
}
