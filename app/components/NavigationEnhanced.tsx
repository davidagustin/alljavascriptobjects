'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  ChevronRight,
  Star,
  Clock,
  TrendingUp,
  Code,
  Hash,
  BookOpen,
  Command,
  X,
  ChevronDown
} from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { OBJECT_CATEGORIES, getAllObjects } from '../constants/objects'
import { searchObjects, filterObjects } from '../utils/search'

interface NavigationEnhancedProps {
  selectedObject: string
  onSelectObject: (object: string) => void
  className?: string
}

type ViewMode = 'grid' | 'list' | 'compact'
type FilterType = 'all' | 'favorites' | 'visited' | 'recent'

export default function NavigationEnhanced({ 
  selectedObject, 
  onSelectObject,
  className = ''
}: NavigationEnhancedProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['all']))
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  const { favorites, visitedObjects, isObjectVisited, getRecentlyVisited } = useApp()
  
  const objects = useMemo(() => getAllObjects(), [])
  const recentObjects = useMemo(() => getRecentlyVisited(5), [getRecentlyVisited])
  
  // Group objects by category for mega-menu style display
  const groupedObjects = useMemo(() => {
    const groups: Record<string, string[]> = {}
    
    Object.entries(OBJECT_CATEGORIES).forEach(([category, data]) => {
      groups[category] = data.objects
    })
    
    return groups
  }, [])
  
  // Enhanced filtering with fuzzy search
  const filteredObjects = useMemo(() => {
    let filtered = objects
    
    // Apply category filter
    if (selectedCategory !== 'all' && OBJECT_CATEGORIES[selectedCategory]) {
      filtered = OBJECT_CATEGORIES[selectedCategory].objects
    }
    
    // Apply search with fuzzy matching
    if (searchTerm) {
      const searchResults = searchObjects(searchTerm, favorites, visitedObjects)
      filtered = filtered.filter(obj => 
        searchResults.some(result => result.objectName === obj)
      )
    }
    
    // Apply filter type
    switch (filterType) {
      case 'favorites':
        filtered = filtered.filter(obj => favorites.includes(obj))
        break
      case 'visited':
        filtered = filtered.filter(obj => visitedObjects.includes(obj))
        break
      case 'recent':
        filtered = filtered.filter(obj => recentObjects.includes(obj))
        break
    }
    
    return filtered
  }, [objects, selectedCategory, searchTerm, filterType, favorites, visitedObjects, recentObjects])
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Quick search with /
      if (e.key === '/' && !isSearchFocused) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
      
      // Clear search with Escape
      if (e.key === 'Escape' && isSearchFocused) {
        setSearchTerm('')
        searchInputRef.current?.blur()
      }
      
      // Navigate with arrow keys
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const currentIndex = filteredObjects.indexOf(selectedObject)
        if (currentIndex !== -1) {
          e.preventDefault()
          const newIndex = e.key === 'ArrowDown' 
            ? (currentIndex + 1) % filteredObjects.length
            : (currentIndex - 1 + filteredObjects.length) % filteredObjects.length
          onSelectObject(filteredObjects[newIndex])
        }
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isSearchFocused, filteredObjects, selectedObject, onSelectObject])
  
  const toggleCategory = useCallback((category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }, [])
  
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Fundamental': '🔧',
      'Numbers & Math': '🔢',
      'Text': '📝',
      'Collections': '📦',
      'Typed Arrays': '⚡',
      'Error Handling': '⚠️',
      'Async': '⏳',
      'Control Flow': '🔄',
      'Meta Programming': '🔮',
      'Internationalization': '🌍',
      'Date & Time': '📅',
      'Data': '💾',
      'System': '⚙️'
    }
    return icons[category] || '📌'
  }
  
  return (
    <div className={`${className} p-4 lg:p-6`}>
      {/* Header with View Controls */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Code className="h-5 w-5 mr-2" />
          JavaScript Objects
        </h2>
        
        {/* View Mode Toggle */}
        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'list' 
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'grid' 
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            aria-label="Grid view"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('compact')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'compact' 
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            aria-label="Compact view"
          >
            <Hash className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Enhanced Search Bar */}
      <div className="relative mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search objects... (press /)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                     placeholder-gray-500 dark:placeholder-gray-400 text-sm
                     transition-all duration-200"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Search Shortcuts Hint */}
        {isSearchFocused && (
          <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 z-10">
            <div className="flex items-center justify-between">
              <span>Press <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↑↓</kbd> to navigate</span>
              <span>Press <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Esc</kbd> to clear</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Quick Filters */}
      <div className="flex items-center space-x-1 mb-3 overflow-x-auto">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
            filterType === 'all'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <TrendingUp className="h-3 w-3 mr-1 inline" />
          All ({objects.length})
        </button>
        <button
          onClick={() => setFilterType('recent')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
            filterType === 'recent'
              ? 'bg-purple-500 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Clock className="h-3 w-3 mr-1 inline" />
          Recent ({recentObjects.length})
        </button>
        <button
          onClick={() => setFilterType('favorites')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
            filterType === 'favorites'
              ? 'bg-red-500 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Star className="h-3 w-3 mr-1 inline" />
          Favorites ({favorites.length})
        </button>
        <button
          onClick={() => setFilterType('visited')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
            filterType === 'visited'
              ? 'bg-green-500 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <BookOpen className="h-3 w-3 mr-1 inline" />
          Visited ({visitedObjects.length})
        </button>
      </div>
      
      {/* Category Filter */}
      <div className="mb-3">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
        >
          <option value="all">All Categories</option>
          {Object.keys(OBJECT_CATEGORIES).map(category => (
            <option key={category} value={category}>
              {getCategoryIcon(category)} {category} ({OBJECT_CATEGORIES[category].objects.length})
            </option>
          ))}
        </select>
      </div>
      
      {/* Results Count */}
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        Showing {filteredObjects.length} of {objects.length} objects
      </div>
      
      {/* Objects Display */}
      <div className={`
        ${viewMode === 'grid' ? 'grid grid-cols-2 gap-2' : ''}
        ${viewMode === 'compact' ? 'space-y-0.5' : 'space-y-1'}
        max-h-[500px] overflow-y-auto pr-2 scrollbar-thin
      `}>
        {selectedCategory === 'all' && viewMode === 'list' ? (
          // Mega-menu style category groups
          Object.entries(groupedObjects).map(([category, categoryObjects]) => {
            const isExpanded = expandedCategories.has(category)
            const visibleObjects = categoryObjects.filter(obj => filteredObjects.includes(obj))
            
            if (visibleObjects.length === 0) return null
            
            return (
              <div key={category} className="mb-3">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between px-2 py-1.5 
                           text-xs font-medium text-gray-700 dark:text-gray-300 
                           hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <span className="flex items-center">
                    <span className="mr-2">{getCategoryIcon(category)}</span>
                    {category}
                    <span className="ml-2 text-gray-500 dark:text-gray-400">
                      ({visibleObjects.length})
                    </span>
                  </span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                
                {isExpanded && (
                  <div className="mt-1 ml-6 space-y-0.5">
                    {visibleObjects.map(obj => (
                      <ObjectItem
                        key={obj}
                        object={obj}
                        isSelected={selectedObject === obj}
                        isVisited={isObjectVisited(obj)}
                        isFavorite={favorites.includes(obj)}
                        onClick={() => onSelectObject(obj)}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })
        ) : (
          // Regular list/grid display
          filteredObjects.map(obj => (
            <ObjectItem
              key={obj}
              object={obj}
              isSelected={selectedObject === obj}
              isVisited={isObjectVisited(obj)}
              isFavorite={favorites.includes(obj)}
              onClick={() => onSelectObject(obj)}
              viewMode={viewMode}
            />
          ))
        )}
        
        {filteredObjects.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="mb-2">No objects found</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Keyboard Shortcuts Help */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center">
            <Command className="h-3 w-3 mr-1" />
            Keyboard shortcuts
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">/</kbd> Search
          </span>
        </div>
      </div>
    </div>
  )
}

// Individual object item component
function ObjectItem({ 
  object, 
  isSelected, 
  isVisited, 
  isFavorite, 
  onClick, 
  viewMode 
}: {
  object: string
  isSelected: boolean
  isVisited: boolean
  isFavorite: boolean
  onClick: () => void
  viewMode: ViewMode
}) {
  if (viewMode === 'compact') {
    return (
      <button
        onClick={onClick}
        className={`w-full text-left px-2 py-1 rounded text-xs transition-all ${
          isSelected
            ? 'bg-blue-500 text-white'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
        }`}
      >
        <span className="flex items-center justify-between">
          <span>{object}</span>
          <span className="flex items-center space-x-1">
            {isFavorite && <Star className="h-3 w-3 text-yellow-500" />}
            {isVisited && <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />}
          </span>
        </span>
      </button>
    )
  }
  
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
        ${viewMode === 'grid' ? 'flex flex-col items-center text-center' : ''}
        ${isSelected
          ? 'bg-blue-500 text-white shadow-md transform scale-[1.02]'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 hover:shadow-sm'
        }
      `}
    >
      <span className={`flex items-center ${viewMode === 'grid' ? 'flex-col space-y-1' : 'justify-between'}`}>
        <span className="font-medium">{object}</span>
        <span className={`flex items-center ${viewMode === 'grid' ? 'space-x-2' : 'space-x-1'}`}>
          {isFavorite && <Star className="h-3 w-3 text-yellow-500" />}
          {isVisited && <div className="w-2 h-2 bg-green-500 rounded-full" />}
        </span>
      </span>
    </button>
  )
}