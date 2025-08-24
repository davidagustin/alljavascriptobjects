'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Search, X, Command, ArrowRight, Clock, TrendingUp, Sparkles, Filter, Hash, Code, Book, Zap } from 'lucide-react'
import { getAllObjects, getObjectCategory, getObjectsByDifficulty } from '../constants/objects'
import { useApp } from '../contexts/AppContext'
import { useRouter } from 'next/navigation'

interface SearchResult {
  name: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  relevance: number
  visited: boolean
  favorite: boolean
  type: 'object' | 'method' | 'property'
}

interface SearchSuggestion {
  text: string
  icon: any
  action: () => void
}

export default function SmartSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    difficulty: 'all' as 'all' | 'beginner' | 'intermediate' | 'advanced',
    category: 'all',
    onlyUnvisited: false,
    onlyFavorites: false
  })
  
  const searchRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { visitedObjects, favorites, markAsVisited } = useApp()

  // Load recent searches
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentSearches')
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved))
        } catch {}
      }
    }
  }, [])

  // Keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus()
    }
  }, [isOpen])

  // Advanced search algorithm
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    const allObjects = getAllObjects()
    const searchLower = searchQuery.toLowerCase()
    
    const searchResults: SearchResult[] = allObjects.map(obj => {
      const objLower = obj.toLowerCase()
      const category = getObjectCategory(obj)
      
      // Calculate relevance score
      let relevance = 0
      
      // Exact match
      if (objLower === searchLower) relevance += 100
      
      // Starts with query
      if (objLower.startsWith(searchLower)) relevance += 50
      
      // Contains query
      if (objLower.includes(searchLower)) relevance += 25
      
      // Fuzzy match
      const fuzzyScore = calculateFuzzyScore(searchLower, objLower)
      relevance += fuzzyScore * 10
      
      // Boost if visited
      if (visitedObjects.includes(obj)) relevance += 5
      
      // Boost if favorite
      if (favorites.includes(obj)) relevance += 10
      
      // Determine difficulty
      let difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
      if (getObjectsByDifficulty('beginner').includes(obj)) difficulty = 'beginner'
      else if (getObjectsByDifficulty('advanced').includes(obj)) difficulty = 'advanced'
      
      // Determine type
      let type: 'object' | 'method' | 'property' = 'object'
      if (obj.includes('()')) type = 'method'
      else if (obj.includes('.')) type = 'property'
      
      return {
        name: obj,
        category: category?.name || 'Other',
        difficulty,
        relevance,
        visited: visitedObjects.includes(obj),
        favorite: favorites.includes(obj),
        type
      }
    })
    .filter(result => {
      // Apply filters
      if (filters.difficulty !== 'all' && result.difficulty !== filters.difficulty) return false
      if (filters.category !== 'all' && result.category !== filters.category) return false
      if (filters.onlyUnvisited && result.visited) return false
      if (filters.onlyFavorites && !result.favorite) return false
      
      return result.relevance > 0
    })
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 10)

    setResults(searchResults)
    
    // Generate smart suggestions
    generateSuggestions(searchQuery, searchResults)
  }, [filters, visitedObjects, favorites])

  // Fuzzy matching algorithm
  const calculateFuzzyScore = (query: string, target: string): number => {
    let score = 0
    let queryIndex = 0
    
    for (let i = 0; i < target.length && queryIndex < query.length; i++) {
      if (target[i] === query[queryIndex]) {
        score++
        queryIndex++
      }
    }
    
    return queryIndex === query.length ? score / query.length : 0
  }

  // Generate smart suggestions
  const generateSuggestions = (searchQuery: string, searchResults: SearchResult[]) => {
    const newSuggestions: SearchSuggestion[] = []
    
    // Suggest exploring a category
    if (searchResults.length > 0) {
      const topCategory = searchResults[0].category
      newSuggestions.push({
        text: `Explore all ${topCategory} objects`,
        icon: Filter,
        action: () => {
          setFilters({ ...filters, category: topCategory })
          performSearch('')
        }
      })
    }
    
    // Suggest similar objects
    if (searchQuery.includes('array')) {
      newSuggestions.push({
        text: 'View all typed arrays',
        icon: Code,
        action: () => {
          setQuery('typed array')
          performSearch('typed array')
        }
      })
    }
    
    // Suggest learning path
    if (searchResults.some(r => !r.visited)) {
      newSuggestions.push({
        text: 'Start learning unvisited objects',
        icon: Book,
        action: () => {
          setFilters({ ...filters, onlyUnvisited: true })
          performSearch(searchQuery)
        }
      })
    }
    
    setSuggestions(newSuggestions)
  }

  // Handle search input
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    performSearch(value)
    setSelectedIndex(0)
  }, [performSearch])

  // Navigate to object
  const navigateToObject = (objectName: string) => {
    // Save to recent searches
    const newRecent = [objectName, ...recentSearches.filter(s => s !== objectName)].slice(0, 5)
    setRecentSearches(newRecent)
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentSearches', JSON.stringify(newRecent))
    }
    
    // Mark as visited
    markAsVisited(objectName)
    
    // Navigate
    const path = objectName.toLowerCase()
      .replace(/[()]/g, '')
      .replace(/\s+/g, '')
    router.push(`/${path}`)
    
    // Close search
    setIsOpen(false)
    setQuery('')
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault()
      navigateToObject(results[selectedIndex].name)
    }
  }

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 dark:text-green-400'
      case 'intermediate': return 'text-yellow-600 dark:text-yellow-400'
      case 'advanced': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'method': return <Code className="h-4 w-4" />
      case 'property': return <Hash className="h-4 w-4" />
      default: return <Book className="h-4 w-4" />
    }
  }

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm text-gray-600 dark:text-gray-300">Search...</span>
        <div className="hidden sm:flex items-center space-x-1 ml-2">
          <kbd className="px-1.5 py-0.5 text-xs bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">⌘</kbd>
          <kbd className="px-1.5 py-0.5 text-xs bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">K</kbd>
        </div>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-20">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Search Input */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={handleSearch}
                  onKeyDown={handleKeyDown}
                  placeholder="Search JavaScript objects, methods, and properties..."
                  className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500"
                />
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    showFilters ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <select
                    value={filters.difficulty}
                    onChange={(e) => setFilters({ ...filters, difficulty: e.target.value as any })}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  
                  <button
                    onClick={() => setFilters({ ...filters, onlyUnvisited: !filters.onlyUnvisited })}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      filters.onlyUnvisited 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                  >
                    Unvisited Only
                  </button>
                  
                  <button
                    onClick={() => setFilters({ ...filters, onlyFavorites: !filters.onlyFavorites })}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      filters.onlyFavorites 
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' 
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                  >
                    Favorites Only
                  </button>
                </div>
              )}
            </div>

            {/* Results */}
            <div className="overflow-y-auto max-h-96">
              {query === '' && recentSearches.length > 0 && (
                <div className="p-4">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Recent Searches</h3>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(search)
                          performSearch(search)
                        }}
                        className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-left"
                      >
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.length > 0 && (
                <div className="p-2">
                  {results.map((result, index) => (
                    <button
                      key={result.name}
                      onClick={() => navigateToObject(result.name)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        index === selectedIndex 
                          ? 'bg-blue-50 dark:bg-blue-900/20' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(result.type)}
                        <div className="text-left">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {result.name}
                            </span>
                            {result.favorite && (
                              <span className="text-yellow-500">★</span>
                            )}
                            {result.visited && (
                              <span className="text-xs text-green-600 dark:text-green-400">✓</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-xs">
                            <span className="text-gray-500 dark:text-gray-400">{result.category}</span>
                            <span className={getDifficultyColor(result.difficulty)}>
                              {result.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              )}

              {suggestions.length > 0 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 flex items-center">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Suggestions
                  </h3>
                  <div className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={suggestion.action}
                        className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-left"
                      >
                        <suggestion.icon className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{suggestion.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {query !== '' && results.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No results found for "{query}"</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Try adjusting your filters or search terms
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">↑↓</kbd>
                  <span>Navigate</span>
                </span>
                <span className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">↵</kbd>
                  <span>Select</span>
                </span>
                <span className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">ESC</kbd>
                  <span>Close</span>
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="h-3 w-3" />
                <span>AI-Powered Search</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}