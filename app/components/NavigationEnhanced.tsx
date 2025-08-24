'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  TrendingUp, 
  Code,
  ChevronRight,
  ChevronDown,
  Hash,
  X,
  Command,
  ArrowUp,
  ArrowDown,
  Check,
  Sparkles,
  History,
  BookmarkPlus,
  Layers,
  Grid3x3
} from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { OBJECT_CATEGORIES, getAllObjects } from '../constants/objects'
import { searchObjects, filterObjects } from '../utils/search'
import { usePerformanceTracking } from '../utils/performance'
import FavoriteButton from './FavoriteButton'

interface NavigationEnhancedProps {
  selectedObject: string
  onSelectObject: (objectName: string) => void
  className?: string
}

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  action: () => void
  badge?: string | number
}

export default function NavigationEnhanced({
  selectedObject,
  onSelectObject,
  className = ''
}: NavigationEnhancedProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'favorites' | 'visited' | 'recent'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['all']))
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  
  const searchInputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  
  const { favorites, visitedObjects, markAsVisited } = useApp()
  const { trackInteraction } = usePerformanceTracking()
  
  const objectCategories = useMemo(() => OBJECT_CATEGORIES, [])
  const objects = useMemo(() => getAllObjects(), [])

  // Group objects by category for better organization
  const groupedObjects = useMemo(() => {
    const groups: Record<string, string[]> = {}
    
    Object.entries(objectCategories).forEach(([categoryName, category]) => {
      groups[categoryName] = category.objects
    })
    
    return groups
  }, [objectCategories])

  // Enhanced filtering with search
  const filteredObjects = useMemo(() => {
    let filtered = objects
    
    // Category filter
    if (selectedCategory !== 'all') {
      filtered = groupedObjects[selectedCategory] || []
    }
    
    // Search filter
    if (searchTerm) {
      const searchResults = searchObjects(searchTerm, favorites, visitedObjects)
      filtered = filtered.filter(obj => 
        searchResults.some(result => result.objectName === obj)
      )
    }
    
    // Type filter
    filtered = filterObjects(filtered, {
      favorites: filterType === 'favorites',
      visited: filterType === 'visited'
    }, favorites, visitedObjects)
    
    // Recent filter
    if (filterType === 'recent') {
      const recentlyVisited = visitedObjects.slice(-10).reverse()
      filtered = filtered.filter(obj => recentlyVisited.includes(obj))
    }
    
    return filtered
  }, [objects, groupedObjects, selectedCategory, searchTerm, filterType, favorites, visitedObjects])

  // Get suggested objects based on current selection
  const suggestedObjects = useMemo(() => {
    const category = Object.entries(objectCategories).find(([_, cat]) => 
      cat.objects.includes(selectedObject)
    )?.[0]
    
    if (!category) return []
    
    return objectCategories[category].objects
      .filter(obj => obj !== selectedObject && !visitedObjects.includes(obj))
      .slice(0, 3)
  }, [selectedObject, objectCategories, visitedObjects])

  // Quick actions for easy navigation
  const quickActions: QuickAction[] = useMemo(() => [
    {
      id: 'recent',
      label: 'Recent',
      icon: <History className="h-4 w-4" />,
      action: () => setFilterType('recent'),
      badge: visitedObjects.slice(-5).length
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: <Star className="h-4 w-4" />,
      action: () => setFilterType('favorites'),
      badge: favorites.length
    },
    {
      id: 'unvisited',
      label: 'New',
      icon: <Sparkles className="h-4 w-4" />,
      action: () => setFilterType('all'),
      badge: objects.length - visitedObjects.length
    }
  ], [favorites, visitedObjects, objects])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSearchFocused) return
      
      const items = filteredObjects
      
      switch(e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev < items.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : items.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && selectedIndex < items.length) {
            handleObjectSelect(items[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          setSearchTerm('')
          searchInputRef.current?.blur()
          break
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isSearchFocused, selectedIndex, filteredObjects])

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-object-item]')
      items[selectedIndex]?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
      })
    }
  }, [selectedIndex])

  // Save recent searches
  useEffect(() => {
    if (searchTerm && !recentSearches.includes(searchTerm)) {
      setRecentSearches(prev => [searchTerm, ...prev.slice(0, 4)])
    }
  }, [searchTerm])

  const handleObjectSelect = useCallback((objectName: string) => {
    onSelectObject(objectName)
    markAsVisited(objectName)
    setSearchTerm('')
    setSelectedIndex(-1)
    
    trackInteraction('object_select', objectName, {
      category: selectedCategory,
      searchTerm: searchTerm || null,
      filterType
    })
  }, [onSelectObject, markAsVisited, trackInteraction, selectedCategory, searchTerm, filterType])

  const toggleCategoryExpansion = useCallback((category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }, [])

  const getCategoryIcon = (category: string) => {
    return objectCategories[category]?.icon || '📦'
  }

  const getCategoryColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner': return 'text-green-600 dark:text-green-400'
      case 'intermediate': return 'text-yellow-600 dark:text-yellow-400'
      case 'advanced': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className={`${className}`}>
      {/* Enhanced Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Search objects (⌘K)"
            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     placeholder-gray-400 dark:placeholder-gray-500
                     transition-all duration-200 text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
            </button>
          )}
          
          {/* Search suggestions dropdown */}
          {isSearchFocused && searchTerm && (
            <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="p-2 max-h-60 overflow-y-auto">
                {filteredObjects.slice(0, 5).map((obj, index) => (
                  <button
                    key={obj}
                    onClick={() => handleObjectSelect(obj)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      index === selectedIndex
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{obj}</span>
                      {visitedObjects.includes(obj) && (
                        <Check className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Recent searches */}
        {!searchTerm && recentSearches.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {recentSearches.map(search => (
              <button
                key={search}
                onClick={() => setSearchTerm(search)}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 
                         rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {search}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {quickActions.map(action => (
            <button
              key={action.id}
              onClick={action.action}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                (filterType === action.id || (action.id === 'unvisited' && filterType === 'all'))
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {action.icon}
              <span>{action.label}</span>
              {action.badge !== undefined && action.badge > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded-full text-xs">
                  {action.badge}
                </span>
              )}
            </button>
          ))}
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded ${
              viewMode === 'list' 
                ? 'bg-gray-200 dark:bg-gray-700' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="List view"
          >
            <Layers className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded ${
              viewMode === 'grid' 
                ? 'bg-gray-200 dark:bg-gray-700' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Grid view"
          >
            <Grid3x3 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="mb-4">
        <div className="flex items-center space-x-1 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All Categories
          </button>
          {Object.entries(objectCategories).map(([name, category]) => (
            <button
              key={name}
              onClick={() => setSelectedCategory(name)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === name
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span>{category.icon}</span>
              <span>{name}</span>
              <span className="ml-1 text-xs opacity-70">({category.objects.length})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Progress Overview */}
      <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Learning Progress
          </span>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            {Math.round((visitedObjects.length / objects.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(visitedObjects.length / objects.length) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {visitedObjects.length} visited
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {objects.length - visitedObjects.length} remaining
          </span>
        </div>
      </div>

      {/* Suggested Next Objects */}
      {suggestedObjects.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-xs font-medium text-yellow-800 dark:text-yellow-300 mb-2">
            Suggested Next
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedObjects.map(obj => (
              <button
                key={obj}
                onClick={() => handleObjectSelect(obj)}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-yellow-300 dark:border-yellow-700 
                         rounded-md text-xs font-medium text-yellow-700 dark:text-yellow-400
                         hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-all"
              >
                {obj}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Objects List/Grid */}
      <div 
        ref={listRef}
        className={`
          ${viewMode === 'grid' 
            ? 'grid grid-cols-2 gap-2' 
            : 'space-y-1'
          } 
          max-h-[500px] overflow-y-auto pr-2 
          scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600
        `}
      >
        {selectedCategory === 'all' ? (
          // Show grouped by category
          Object.entries(groupedObjects).map(([categoryName, categoryObjects]) => {
            const category = objectCategories[categoryName]
            const isExpanded = expandedCategories.has(categoryName)
            const categoryFilteredObjects = categoryObjects.filter(obj => 
              filteredObjects.includes(obj)
            )
            
            if (categoryFilteredObjects.length === 0) return null
            
            return (
              <div key={categoryName} className={viewMode === 'grid' ? 'col-span-2' : ''}>
                <button
                  onClick={() => toggleCategoryExpansion(categoryName)}
                  className="w-full flex items-center justify-between px-3 py-2 mb-1 
                           bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                           transition-colors group"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{category.icon}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {categoryName}
                    </span>
                    <span className={`text-xs ${getCategoryColor(category.difficulty)}`}>
                      {category.difficulty}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({categoryFilteredObjects.length})
                    </span>
                  </div>
                  <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${
                    isExpanded ? 'rotate-90' : ''
                  }`} />
                </button>
                
                {isExpanded && (
                  <div className={`ml-6 ${viewMode === 'grid' ? 'grid grid-cols-2 gap-2' : 'space-y-1'} mb-2`}>
                    {categoryFilteredObjects.map((obj, index) => (
                      <ObjectItem
                        key={obj}
                        object={obj}
                        isSelected={selectedObject === obj}
                        isVisited={visitedObjects.includes(obj)}
                        isFavorited={favorites.includes(obj)}
                        isHighlighted={index === selectedIndex}
                        onClick={() => handleObjectSelect(obj)}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })
        ) : (
          // Show flat list for specific category
          <div className={viewMode === 'grid' ? 'contents' : 'space-y-1'}>
            {filteredObjects.map((obj, index) => (
              <ObjectItem
                key={obj}
                object={obj}
                isSelected={selectedObject === obj}
                isVisited={visitedObjects.includes(obj)}
                isFavorited={favorites.includes(obj)}
                isHighlighted={index === selectedIndex}
                onClick={() => handleObjectSelect(obj)}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
        
        {filteredObjects.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-sm mb-2">No objects found</p>
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterType('all')
                setSelectedCategory('all')
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Object Item Component
function ObjectItem({
  object,
  isSelected,
  isVisited,
  isFavorited,
  isHighlighted,
  onClick,
  viewMode
}: {
  object: string
  isSelected: boolean
  isVisited: boolean
  isFavorited: boolean
  isHighlighted: boolean
  onClick: () => void
  viewMode: 'list' | 'grid'
}) {
  return (
    <div
      data-object-item
      className={`group flex items-center ${
        viewMode === 'grid' ? 'flex-col p-3' : 'space-x-2'
      }`}
    >
      <button
        onClick={onClick}
        className={`
          ${viewMode === 'grid' 
            ? 'w-full text-center p-3' 
            : 'flex-1 text-left px-3 py-2'
          }
          rounded-lg text-sm font-medium transition-all duration-150
          ${isSelected
            ? 'bg-blue-500 text-white shadow-md dark:bg-blue-600'
            : isHighlighted
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }
          ${isVisited && !isSelected ? 'opacity-75' : ''}
        `}
      >
        <div className={`flex items-center ${viewMode === 'grid' ? 'justify-center' : 'justify-between'}`}>
          <span className={viewMode === 'grid' ? 'block mb-2' : ''}>{object}</span>
          <div className={`flex items-center ${viewMode === 'grid' ? 'justify-center mt-2' : 'space-x-1'}`}>
            {isVisited && (
              <Check className="h-3 w-3 text-green-500" />
            )}
            {isFavorited && (
              <Star className="h-3 w-3 text-yellow-500 fill-current" />
            )}
          </div>
        </div>
      </button>
      
      {viewMode === 'list' && (
        <FavoriteButton
          objectName={object}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        />
      )}
    </div>
  )
}