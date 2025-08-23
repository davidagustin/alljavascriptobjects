import { getAllObjects, getObjectCategory as getCategoryForObject } from '../constants/objects'

export interface SearchResult {
  objectName: string
  score: number
  matchType: 'exact' | 'partial' | 'category' | 'tag'
  category?: string
}

export interface FilterOptions {
  favorites?: boolean
  visited?: boolean
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  category?: string
}

export function searchObjects(
  query: string, 
  favorites: string[], 
  visitedObjects: string[]
): SearchResult[] {
  if (!query.trim()) return []
  
  const queryLower = query.toLowerCase()
  const results: SearchResult[] = []
  
  // Get all objects from the constants
  const allObjects = getAllObjects()
  
  allObjects.forEach(objectName => {
    const objectLower = objectName.toLowerCase()
    let score = 0
    let matchType: SearchResult['matchType'] = 'partial'
    
    // Exact match gets highest score
    if (objectLower === queryLower) {
      score = 100
      matchType = 'exact'
    }
    // Starts with query
    else if (objectLower.startsWith(queryLower)) {
      score = 80
      matchType = 'partial'
    }
    // Contains query
    else if (objectLower.includes(queryLower)) {
      score = 60
      matchType = 'partial'
    }
    // Check if query matches category
    else {
      const category = getCategoryForObject(objectName)
      if (category && category.name.toLowerCase().includes(queryLower)) {
        score = 40
        matchType = 'category'
      }
    }
    
    // Boost score for favorites and visited objects
    if (favorites.includes(objectName)) score += 10
    if (visitedObjects.includes(objectName)) score += 5
    
    if (score > 0) {
      const categoryData = getCategoryForObject(objectName)
      results.push({
        objectName,
        score,
        matchType,
        category: categoryData?.name
      })
    }
  })
  
  // Sort by score (highest first)
  return results.sort((a, b) => b.score - a.score)
}

export function filterObjects(
  objects: string[],
  options: FilterOptions,
  favorites: string[],
  visitedObjects: string[]
): string[] {
  let filtered = objects
  
  if (options.favorites) {
    filtered = filtered.filter(obj => favorites.includes(obj))
  }
  
  if (options.visited) {
    filtered = filtered.filter(obj => visitedObjects.includes(obj))
  }
  
  if (options.difficulty) {
    filtered = filtered.filter(obj => {
      const category = getObjectCategory(obj)
      return category?.difficulty === options.difficulty
    })
  }
  
  if (options.category) {
    filtered = filtered.filter(obj => {
      const category = getObjectCategory(obj)
      return category?.name === options.category
    })
  }
  
  return filtered
}

export function getObjectCategory(objectName: string): { name: string; difficulty: string } | null {
  const categories = {
    'Fundamental': { name: 'Fundamental', difficulty: 'beginner' },
    'Numbers & Math': { name: 'Numbers & Math', difficulty: 'beginner' },
    'Text': { name: 'Text', difficulty: 'beginner' },
    'Collections': { name: 'Collections', difficulty: 'intermediate' },
    'Typed Arrays': { name: 'Typed Arrays', difficulty: 'advanced' },
    'Errors': { name: 'Errors', difficulty: 'intermediate' },
    'Control Flow': { name: 'Control Flow', difficulty: 'advanced' },
    'Memory Management': { name: 'Memory Management', difficulty: 'advanced' },
    'Meta Programming': { name: 'Meta Programming', difficulty: 'advanced' },
    'Internationalization': { name: 'Internationalization', difficulty: 'intermediate' },
    'Data Processing': { name: 'Data Processing', difficulty: 'intermediate' },
    'Global Functions': { name: 'Global Functions', difficulty: 'beginner' }
  }
  
  const objectCategories: Record<string, string> = {
    'Object': 'Fundamental', 'Function': 'Fundamental', 'Boolean': 'Fundamental', 'Symbol': 'Fundamental', 'undefined': 'Fundamental', 'globalThis': 'Fundamental',
    'Number': 'Numbers & Math', 'BigInt': 'Numbers & Math', 'Math': 'Numbers & Math', 'NaN': 'Numbers & Math', 'Infinity': 'Numbers & Math', 'isFinite()': 'Numbers & Math', 'isNaN()': 'Numbers & Math', 'parseFloat()': 'Numbers & Math', 'parseInt()': 'Numbers & Math',
    'String': 'Text', 'RegExp': 'Text', 'encodeURI()': 'Text', 'decodeURI()': 'Text', 'encodeURIComponent()': 'Text', 'decodeURIComponent()': 'Text', 'escape()': 'Text', 'unescape()': 'Text',
    'Array': 'Collections', 'Map': 'Collections', 'Set': 'Collections', 'WeakMap': 'Collections', 'WeakSet': 'Collections', 'WeakRef': 'Collections',
    'ArrayBuffer': 'Typed Arrays', 'SharedArrayBuffer': 'Typed Arrays', 'DataView': 'Typed Arrays', 'TypedArray': 'Typed Arrays', 'Int8Array': 'Typed Arrays', 'Uint8Array': 'Typed Arrays', 'Uint8ClampedArray': 'Typed Arrays', 'Int16Array': 'Typed Arrays', 'Uint16Array': 'Typed Arrays', 'Int32Array': 'Typed Arrays', 'Uint32Array': 'Typed Arrays', 'Float32Array': 'Typed Arrays', 'Float64Array': 'Typed Arrays', 'BigInt64Array': 'Typed Arrays', 'BigUint64Array': 'Typed Arrays', 'Float16Array': 'Typed Arrays',
    'Error': 'Errors', 'AggregateError': 'Errors', 'EvalError': 'Errors', 'RangeError': 'Errors', 'ReferenceError': 'Errors', 'SyntaxError': 'Errors', 'TypeError': 'Errors', 'URIError': 'Errors', 'InternalError': 'Errors', 'SuppressedError': 'Errors',
    'Promise': 'Control Flow', 'AsyncFunction': 'Control Flow', 'Generator': 'Control Flow', 'GeneratorFunction': 'Control Flow', 'AsyncGenerator': 'Control Flow', 'AsyncGeneratorFunction': 'Control Flow', 'Iterator': 'Control Flow', 'AsyncIterator': 'Control Flow',
    'FinalizationRegistry': 'Memory Management', 'DisposableStack': 'Memory Management', 'AsyncDisposableStack': 'Memory Management',
    'Proxy': 'Meta Programming', 'Reflect': 'Meta Programming',
    'Intl': 'Internationalization', 'Date': 'Internationalization', 'Temporal': 'Internationalization',
    'JSON': 'Data Processing', 'Atomics': 'Data Processing',
    'eval()': 'Global Functions'
  }
  
  const categoryName = objectCategories[objectName]
  return categoryName ? categories[categoryName as keyof typeof categories] : null
}

export function getSearchSuggestions(query: string, maxResults: number = 5): string[] {
  if (!query.trim()) return []
  
  const allObjects = [
    'Object', 'String', 'Array', 'Number', 'Boolean', 'Function', 'Date', 'Math',
    'Map', 'Set', 'Promise', 'RegExp', 'JSON', 'Error', 'Proxy', 'Reflect'
  ]
  
  const queryLower = query.toLowerCase()
  const suggestions = allObjects.filter(obj => 
    obj.toLowerCase().includes(queryLower)
  )
  
  return suggestions.slice(0, maxResults)
}