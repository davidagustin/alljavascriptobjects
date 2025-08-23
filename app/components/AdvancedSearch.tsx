'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { Search, Filter, X, Tag, Clock, Star, TrendingUp, Book, Code, Zap, Target, ChevronDown, ChevronUp, SortAsc, SortDesc } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

interface SearchFilter {
  category: string[]
  difficulty: string[]
  tags: string[]
  hasExamples: boolean
  isFavorited: boolean
  isVisited: boolean
  lastUpdated: string
}

interface SearchResult {
  objectName: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  description: string
  exampleCount: number
  matchScore: number
  lastViewed?: Date
}

const objectCategories = {
  'Fundamental': {
    objects: ['Object', 'Function', 'Boolean', 'Symbol'],
    difficulty: 'beginner',
    description: 'Core JavaScript building blocks'
  },
  'Numbers & Math': {
    objects: ['Number', 'BigInt', 'Math', 'NaN', 'Infinity', 'isFinite()', 'isNaN()', 'parseFloat()', 'parseInt()'],
    difficulty: 'beginner',
    description: 'Numeric operations and mathematics'
  },
  'Text': {
    objects: ['String', 'RegExp'],
    difficulty: 'intermediate',
    description: 'Text processing and pattern matching'
  },
  'Collections': {
    objects: ['Array', 'Map', 'Set', 'WeakMap', 'WeakSet', 'WeakRef'],
    difficulty: 'intermediate',
    description: 'Data structures and collections'
  },
  'Typed Arrays': {
    objects: ['ArrayBuffer', 'SharedArrayBuffer', 'DataView', 'TypedArray', 'Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array', 'BigInt64Array', 'BigUint64Array', 'Float16Array'],
    difficulty: 'advanced',
    description: 'Binary data and memory management'
  },
  'Errors': {
    objects: ['Error', 'AggregateError', 'EvalError', 'RangeError', 'ReferenceError', 'SyntaxError', 'TypeError', 'URIError', 'InternalError', 'SuppressedError'],
    difficulty: 'intermediate',
    description: 'Error handling and debugging'
  },
  'Control Flow': {
    objects: ['Promise', 'AsyncFunction', 'Generator', 'GeneratorFunction', 'AsyncGenerator', 'AsyncGeneratorFunction', 'Iterator', 'AsyncIterator'],
    difficulty: 'advanced',
    description: 'Asynchronous and iterative patterns'
  },
  'Memory Management': {
    objects: ['FinalizationRegistry', 'DisposableStack', 'AsyncDisposableStack'],
    difficulty: 'advanced',
    description: 'Resource cleanup and memory optimization'
  },
  'Meta Programming': {
    objects: ['Proxy', 'Reflect'],
    difficulty: 'advanced',
    description: 'Dynamic code manipulation and interception'
  },
  'Internationalization': {
    objects: ['Intl', 'Date', 'Temporal'],
    difficulty: 'intermediate',
    description: 'Localization and date/time handling'
  },
  'Data Processing': {
    objects: ['JSON', 'Atomics'],
    difficulty: 'intermediate',
    description: 'Data serialization and atomic operations'
  },
  'Global Functions': {
    objects: ['globalThis', 'eval()', 'decodeURI()', 'decodeURIComponent()', 'encodeURI()', 'encodeURIComponent()', 'escape()', 'unescape()', 'undefined'],
    difficulty: 'beginner',
    description: 'Global utility functions and variables'
  }
}

const objectTags = {
  'Array': ['collection', 'iteration', 'functional', 'data-structure'],
  'Object': ['fundamental', 'oop', 'properties', 'methods'],
  'Promise': ['async', 'concurrent', 'es6', 'callback'],
  'String': ['text', 'manipulation', 'regex', 'encoding'],
  'Number': ['math', 'arithmetic', 'validation', 'parsing'],
  'Date': ['time', 'calendar', 'formatting', 'timezone'],
  'RegExp': ['pattern', 'matching', 'validation', 'parsing'],
  'Map': ['collection', 'key-value', 'iteration', 'es6'],
  'Set': ['collection', 'unique', 'iteration', 'es6'],
  'JSON': ['serialization', 'data', 'api', 'storage'],
  'Math': ['calculations', 'constants', 'trigonometry', 'random'],
  'Error': ['debugging', 'exception', 'handling', 'validation'],
  'Proxy': ['meta', 'interception', 'dynamic', 'advanced'],
  'Symbol': ['unique', 'identifier', 'meta', 'es6'],
  'BigInt': ['large-numbers', 'precision', 'arithmetic', 'es2020'],
  'WeakMap': ['memory', 'garbage-collection', 'private', 'performance'],
  'WeakSet': ['memory', 'garbage-collection', 'unique', 'performance'],
  'ArrayBuffer': ['binary', 'memory', 'buffer', 'performance'],
  'TypedArray': ['binary', 'numeric', 'buffer', 'performance'],
  'Int8Array': ['binary', 'integers', 'signed', '8-bit'],
  'Uint8Array': ['binary', 'integers', 'unsigned', '8-bit'],
  'Float32Array': ['binary', 'floating-point', '32-bit', 'precision'],
  'Generator': ['iterator', 'lazy', 'yield', 'es6'],
  'AsyncGenerator': ['async', 'iterator', 'yield', 'streaming'],
  'Iterator': ['iteration', 'protocol', 'lazy', 'streaming'],
  'AsyncIterator': ['async', 'iteration', 'streaming', 'protocol']
}

export default function AdvancedSearch({ onObjectSelect }: { onObjectSelect: (objectName: string) => void }) {
  const { favorites, visitedObjects, isObjectVisited } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [sortBy, setSortBy] = useState<'relevance' | 'name' | 'category' | 'difficulty' | 'popularity'>('relevance')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filters, setFilters] = useState<SearchFilter>({
    category: [],
    difficulty: [],
    tags: [],
    hasExamples: false,
    isFavorited: false,
    isVisited: false,
    lastUpdated: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1)
  
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('search-history')
    if (saved) {
      setSearchHistory(JSON.parse(saved))
    }
  }, [])

  // Save search to history
  const saveToHistory = useCallback((query: string) => {
    if (query.trim() && !searchHistory.includes(query)) {
      const newHistory = [query, ...searchHistory.slice(0, 9)]
      setSearchHistory(newHistory)
      localStorage.setItem('search-history', JSON.stringify(newHistory))
    }
  }, [searchHistory])

  // Get all available objects with metadata
  const allObjects = useMemo(() => {
    const objects: SearchResult[] = []
    
    Object.entries(objectCategories).forEach(([categoryName, categoryData]) => {
      categoryData.objects.forEach(objectName => {
        const tags = objectTags[objectName as keyof typeof objectTags] || []
        const exampleCount = Math.floor(Math.random() * 10) + 3 // Mock example count
        
        objects.push({
          objectName,
          category: categoryName,
          difficulty: categoryData.difficulty,
          tags,
          description: categoryData.description,
          exampleCount,
          matchScore: 0,
          lastViewed: isObjectVisited(objectName) ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined
        })
      })
    })
    
    return objects
  }, [isObjectVisited])

  // Calculate search score
  const calculateMatchScore = useCallback((object: SearchResult, query: string): number => {
    if (!query) return 1
    
    const queryLower = query.toLowerCase()
    let score = 0
    
    // Exact name match
    if (object.objectName.toLowerCase() === queryLower) {
      score += 100
    }
    
    // Name starts with query
    if (object.objectName.toLowerCase().startsWith(queryLower)) {
      score += 50
    }
    
    // Name contains query
    if (object.objectName.toLowerCase().includes(queryLower)) {
      score += 25
    }
    
    // Category match
    if (object.category.toLowerCase().includes(queryLower)) {
      score += 20
    }
    
    // Description match
    if (object.description.toLowerCase().includes(queryLower)) {
      score += 15
    }
    
    // Tag matches
    object.tags.forEach(tag => {
      if (tag.toLowerCase().includes(queryLower)) {
        score += 10
      }
    })
    
    // Boost for favorites and visited
    if (favorites.includes(object.objectName)) {
      score += 5
    }
    
    if (object.lastViewed) {
      score += 3
    }
    
    return score
  }, [favorites])

  // Filter and search objects
  const filteredObjects = useMemo(() => {
    let results = allObjects.map(obj => ({
      ...obj,
      matchScore: calculateMatchScore(obj, searchQuery)
    }))

    // Apply text search
    if (searchQuery) {
      results = results.filter(obj => obj.matchScore > 0)
    }

    // Apply filters
    if (filters.category.length > 0) {
      results = results.filter(obj => filters.category.includes(obj.category))
    }

    if (filters.difficulty.length > 0) {
      results = results.filter(obj => filters.difficulty.includes(obj.difficulty))
    }

    if (filters.tags.length > 0) {
      results = results.filter(obj => 
        filters.tags.some(tag => obj.tags.includes(tag))
      )
    }

    if (filters.hasExamples) {
      results = results.filter(obj => obj.exampleCount > 5)
    }

    if (filters.isFavorited) {
      results = results.filter(obj => favorites.includes(obj.objectName))
    }

    if (filters.isVisited) {
      results = results.filter(obj => isObjectVisited(obj.objectName))
    }

    // Sort results
    results.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'relevance':
          comparison = b.matchScore - a.matchScore
          break
        case 'name':
          comparison = a.objectName.localeCompare(b.objectName)
          break
        case 'category':
          comparison = a.category.localeCompare(b.category)
          break
        case 'difficulty':
          const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 }
          comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
          break
        case 'popularity':
          const aPopularity = (favorites.includes(a.objectName) ? 1 : 0) + (a.lastViewed ? 1 : 0)
          const bPopularity = (favorites.includes(b.objectName) ? 1 : 0) + (b.lastViewed ? 1 : 0)
          comparison = bPopularity - aPopularity
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return results
  }, [allObjects, searchQuery, filters, sortBy, sortOrder, calculateMatchScore, favorites, isObjectVisited])

  // Get search suggestions
  const suggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return []
    
    const queryLower = searchQuery.toLowerCase()
    const suggestions = new Set<string>()
    
    // Add object names
    allObjects.forEach(obj => {
      if (obj.objectName.toLowerCase().includes(queryLower)) {
        suggestions.add(obj.objectName)
      }
    })
    
    // Add categories
    Object.keys(objectCategories).forEach(category => {
      if (category.toLowerCase().includes(queryLower)) {
        suggestions.add(category)
      }
    })
    
    // Add tags
    Object.values(objectTags).flat().forEach(tag => {
      if (tag.toLowerCase().includes(queryLower)) {
        suggestions.add(tag)
      }
    })
    
    return Array.from(suggestions).slice(0, 5)
  }, [searchQuery, allObjects])

  // Handle search submission
  const handleSearch = useCallback((query: string = searchQuery) => {
    if (query.trim()) {
      saveToHistory(query.trim())
      setSearchQuery(query.trim())
    }
  }, [searchQuery, saveToHistory])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedSuggestion(prev => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedSuggestion(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedSuggestion >= 0) {
        handleSearch(suggestions[selectedSuggestion])
      } else {
        handleSearch()
      }
      setSelectedSuggestion(-1)
    } else if (e.key === 'Escape') {
      setSelectedSuggestion(-1)
      searchInputRef.current?.blur()
    }
  }, [suggestions, selectedSuggestion, handleSearch])

  useEffect(() => {
    const input = searchInputRef.current
    if (input) {
      input.addEventListener('keydown', handleKeyDown)
      return () => input.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  // Toggle filter
  const toggleFilter = useCallback((filterType: keyof SearchFilter, value: string | boolean) => {
    setFilters(prev => {
      if (filterType === 'hasExamples' || filterType === 'isFavorited' || filterType === 'isVisited') {
        return { ...prev, [filterType]: value as boolean }
      }
      
      const currentArray = prev[filterType] as string[]
      const newArray = currentArray.includes(value as string)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value as string]
      
      return { ...prev, [filterType]: newArray }
    })
  }, [])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      category: [],
      difficulty: [],
      tags: [],
      hasExamples: false,
      isFavorited: false,
      isVisited: false,
      lastUpdated: ''
    })
  }, [])

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    Object.values(objectTags).flat().forEach(tag => tags.add(tag))
    return Array.from(tags).sort()
  }, [])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Search Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          {/* Main Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search JavaScript objects, methods, properties..."
              className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Search Suggestions */}
          {suggestions.length > 0 && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  onClick={() => handleSearch(suggestion)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    index === selectedSuggestion ? 'bg-blue-50 dark:bg-blue-900' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <Search className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900 dark:text-gray-100">{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                showFilters 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
              {Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f) && (
                <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {Object.values(filters).reduce((count, f) => 
                    count + (Array.isArray(f) ? f.length : f ? 1 : 0), 0
                  )}
                </span>
              )}
            </button>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="relevance">Relevance</option>
                <option value="name">Name</option>
                <option value="category">Category</option>
                <option value="difficulty">Difficulty</option>
                <option value="popularity">Popularity</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredObjects.length} result{filteredObjects.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && !searchQuery && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Searches</h4>
            <div className="flex flex-wrap gap-2">
              {searchHistory.slice(0, 5).map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(query)}
                  className="flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categories</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {Object.keys(objectCategories).map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.category.includes(category)}
                      onChange={() => toggleFilter('category', category)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulty</h4>
              <div className="space-y-1">
                {['beginner', 'intermediate', 'advanced'].map(difficulty => (
                  <label key={difficulty} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.difficulty.includes(difficulty)}
                      onChange={() => toggleFilter('difficulty', difficulty)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {difficulty}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</h4>
              <div className="space-y-1">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.isFavorited}
                    onChange={() => toggleFilter('isFavorited', !filters.isFavorited)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Favorited</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.isVisited}
                    onChange={() => toggleFilter('isVisited', !filters.isVisited)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Visited</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.hasExamples}
                    onChange={() => toggleFilter('hasExamples', !filters.hasExamples)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Rich Examples</span>
                </label>
              </div>
            </div>
          </div>

          {/* Tags Filter */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleFilter('tags', tag)}
                  className={`px-2 py-1 rounded-full text-xs transition-colors ${
                    filters.tags.includes(tag)
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f) && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Search Results */}
      <div className="max-h-96 overflow-y-auto">
        {filteredObjects.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
              No results found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or filters
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredObjects.map((object) => (
              <div
                key={object.objectName}
                onClick={() => onObjectSelect(object.objectName)}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {object.objectName}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        object.difficulty === 'beginner' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : object.difficulty === 'intermediate'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {object.difficulty}
                      </span>
                      {favorites.includes(object.objectName) && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                      {object.lastViewed && (
                        <Clock className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {object.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <Tag className="h-3 w-3 mr-1" />
                        {object.category}
                      </span>
                      <span className="flex items-center">
                        <Code className="h-3 w-3 mr-1" />
                        {object.exampleCount} examples
                      </span>
                      {searchQuery && object.matchScore > 0 && (
                        <span className="flex items-center">
                          <Target className="h-3 w-3 mr-1" />
                          {Math.round(object.matchScore)}% match
                        </span>
                      )}
                    </div>
                    
                    {object.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {object.tags.slice(0, 4).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {object.tags.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded text-xs">
                            +{object.tags.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {object.lastViewed && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 ml-4">
                      Last viewed {object.lastViewed.toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}