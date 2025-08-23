import { getObjectTags, getCategoryByObject, getAllObjects } from '../constants/objects'

export interface SearchResult {
  objectName: string
  score: number
  matchType: 'exact' | 'starts' | 'contains' | 'tag' | 'category'
  matchedText: string
}

export interface SearchOptions {
  caseSensitive?: boolean
  includeDescriptions?: boolean
  boostFavorites?: boolean
  boostVisited?: boolean
  maxResults?: number
}

/**
 * Advanced search functionality with scoring
 */
export function searchObjects(
  query: string,
  favorites: string[] = [],
  visited: string[] = [],
  options: SearchOptions = {}
): SearchResult[] {
  if (!query.trim()) return []

  const {
    caseSensitive = false,
    boostFavorites = true,
    boostVisited = true,
    maxResults = 50
  } = options

  const searchTerm = caseSensitive ? query.trim() : query.trim().toLowerCase()
  const allObjects = getAllObjects()
  const results: SearchResult[] = []

  for (const objectName of allObjects) {
    const targetName = caseSensitive ? objectName : objectName.toLowerCase()
    const tags = getObjectTags(objectName)
    const category = getCategoryByObject(objectName)

    let score = 0
    let matchType: SearchResult['matchType'] = 'contains'
    let matchedText = objectName

    // Exact match (highest score)
    if (targetName === searchTerm) {
      score = 100
      matchType = 'exact'
    }
    // Starts with query
    else if (targetName.startsWith(searchTerm)) {
      score = 80
      matchType = 'starts'
    }
    // Contains query in name
    else if (targetName.includes(searchTerm)) {
      score = 60
      matchType = 'contains'
    }
    // Tag match
    else {
      const matchingTag = tags.find(tag => 
        caseSensitive ? tag.includes(searchTerm) : tag.toLowerCase().includes(searchTerm)
      )
      if (matchingTag) {
        score = 40
        matchType = 'tag'
        matchedText = matchingTag
      }
      // Category match
      else if (category && (caseSensitive ? category.includes(searchTerm) : category.toLowerCase().includes(searchTerm))) {
        score = 30
        matchType = 'category'
        matchedText = category
      }
    }

    if (score > 0) {
      // Apply boosts
      if (boostFavorites && favorites.includes(objectName)) {
        score += 10
      }
      if (boostVisited && visited.includes(objectName)) {
        score += 5
      }

      results.push({
        objectName,
        score,
        matchType,
        matchedText
      })
    }
  }

  // Sort by score (descending) then by name (ascending)
  results.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score
    }
    return a.objectName.localeCompare(b.objectName)
  })

  return results.slice(0, maxResults)
}

/**
 * Get search suggestions based on partial input
 */
export function getSearchSuggestions(
  query: string,
  maxSuggestions: number = 5
): string[] {
  if (!query.trim() || query.length < 2) return []

  const queryLower = query.toLowerCase()
  const suggestions = new Set<string>()
  
  // Add object names
  const allObjects = getAllObjects()
  for (const obj of allObjects) {
    if (obj.toLowerCase().includes(queryLower) && suggestions.size < maxSuggestions) {
      suggestions.add(obj)
    }
  }

  // Add unique tags
  if (suggestions.size < maxSuggestions) {
    const allTags = new Set<string>()
    allObjects.forEach(obj => {
      const tags = getObjectTags(obj)
      tags.forEach(tag => allTags.add(tag))
    })

    for (const tag of allTags) {
      if (tag.toLowerCase().includes(queryLower) && suggestions.size < maxSuggestions) {
        suggestions.add(tag)
      }
    }
  }

  return Array.from(suggestions)
}

/**
 * Filter objects by multiple criteria
 */
export interface FilterOptions {
  categories?: string[]
  difficulties?: string[]
  tags?: string[]
  favorites?: boolean
  visited?: boolean
  hasExamples?: boolean
}

export function filterObjects(
  objects: string[],
  filters: FilterOptions,
  userFavorites: string[] = [],
  userVisited: string[] = []
): string[] {
  return objects.filter(objectName => {
    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      const category = getCategoryByObject(objectName)
      if (!category || !filters.categories.includes(category)) {
        return false
      }
    }

    // Tag filter
    if (filters.tags && filters.tags.length > 0) {
      const objectTags = getObjectTags(objectName)
      const hasMatchingTag = filters.tags.some(tag => objectTags.includes(tag))
      if (!hasMatchingTag) {
        return false
      }
    }

    // Favorites filter
    if (filters.favorites && !userFavorites.includes(objectName)) {
      return false
    }

    // Visited filter
    if (filters.visited && !userVisited.includes(objectName)) {
      return false
    }

    return true
  })
}

/**
 * Get related objects based on tags and category
 */
export function getRelatedObjects(
  objectName: string,
  maxResults: number = 5
): string[] {
  const objectTags = getObjectTags(objectName)
  const objectCategory = getCategoryByObject(objectName)
  const allObjects = getAllObjects().filter(name => name !== objectName)
  
  const scored = allObjects.map(name => {
    let score = 0
    const nameTags = getObjectTags(name)
    const nameCategory = getCategoryByObject(name)
    
    // Same category gets higher score
    if (nameCategory === objectCategory) {
      score += 10
    }
    
    // Shared tags
    const sharedTags = objectTags.filter(tag => nameTags.includes(tag))
    score += sharedTags.length * 5
    
    return { name, score }
  })

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(item => item.name)
}

/**
 * Highlight search terms in text
 */
export function highlightSearchTerm(
  text: string,
  searchTerm: string,
  className: string = 'bg-yellow-200 dark:bg-yellow-800'
): string {
  if (!searchTerm.trim()) return text
  
  const regex = new RegExp(`(${searchTerm})`, 'gi')
  return text.replace(regex, `<span class="${className}">$1</span>`)
}