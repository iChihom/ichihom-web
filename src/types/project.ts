export interface GitHubProject {
  id: string
  name: string
  fullName: string
  description: string
  language: string
  languageColor: string
  stars: number
  forks: number
  watchers: number
  openIssues: number
  topics: string[]
  createdAt: string
  updatedAt: string
  homepage?: string
  size: number
  isPrivate: boolean
  owner: {
    login: string
    avatarUrl: string
    type: string
  }
  readme?: string
  license?: string
  defaultBranch: string
}

export interface ProjectCategory {
  id: string
  name: string
  count: number
}

export interface ProjectFilter {
  category?: string
  search?: string
  language?: string
  sortBy?: 'stars' | 'forks' | 'updated' | 'name' | 'created'
  sortOrder?: 'desc' | 'asc'
}

export interface ProjectStats {
  totalProjects: number
  totalStars: number
  totalForks: number
  totalWatchers: number
  languages: { [key: string]: number }
}
