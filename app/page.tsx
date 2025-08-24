'use client'

import { useState, useCallback, useMemo, useEffect, lazy, Suspense } from 'react'
import { BookOpen, Code, Search, Star, TrendingUp, Clock } from 'lucide-react'
import ThemeToggle from './components/ThemeToggle'
import Notifications, { NotificationProvider, useNotifications } from './components/Notifications'

// Lazy load heavy components for better performance
const TabbedInterface = lazy(() => import('./components/TabbedInterface'))
const FavoriteButton = lazy(() => import('./components/FavoriteButton'))
const ProgressBar = lazy(() => import('./components/ProgressBar'))
const KeyboardShortcuts = lazy(() => import('./components/KeyboardShortcuts'))
const QuickLinks = lazy(() => import('./components/QuickLinks'))
const LearningStats = lazy(() => import('./components/LearningStats'))
const PWAInstallButton = lazy(() => import('./components/PWAInstallButton'))
const StudyMode = lazy(() => import('./components/StudyMode'))
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'))
import { useApp } from './contexts/AppContext'
import { OBJECT_CATEGORIES, getAllObjects } from './constants/objects'
import { searchObjects, filterObjects } from './utils/search'
import { usePerformanceTracking } from './utils/performance'

// Loading fallback components
const ComponentFallback = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg p-4 ${className}`}>
    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
  </div>
)

const ButtonFallback = () => (
  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded w-8 h-8"></div>
)

function HomeContent() {
  const [selectedObject, setSelectedObject] = useState<string>('Object')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filterType, setFilterType] = useState<'all' | 'favorites' | 'visited'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const { favorites, isObjectVisited, markAsVisited, visitedObjects } = useApp()
  const { notifications, markAsRead, clearAll } = useNotifications()
  const { trackInteraction } = usePerformanceTracking()

  const objectCategories = useMemo(() => OBJECT_CATEGORIES, [])
  const objects = useMemo(() => getAllObjects(), [])

  // Enhanced filtering with search functionality
  const filteredObjects = useMemo(() => {
    let filtered = objects

    // Apply category filter first
    if (selectedCategory !== 'all') {
      filtered = objectCategories[selectedCategory].objects
    }

    // Apply search filter with enhanced search
    if (searchTerm) {
      const searchResults = searchObjects(searchTerm, favorites, visitedObjects)
      filtered = filtered.filter(obj => 
        searchResults.some(result => result.objectName === obj)
      )
    }

    // Apply type filter
    filtered = filterObjects(filtered, {
      favorites: filterType === 'favorites',
      visited: filterType === 'visited'
    }, favorites, visitedObjects)

    return filtered
  }, [objects, objectCategories, selectedCategory, searchTerm, filterType, favorites, visitedObjects])

  const handleObjectSelect = useCallback((objectName: string) => {
    setSelectedObject(objectName)
    markAsVisited(objectName)
    
    // Track user interaction for analytics
    trackInteraction('object_select', objectName, {
      category: selectedCategory,
      searchTerm: searchTerm || null,
      filterType
    })
  }, [markAsVisited, trackInteraction, selectedCategory, searchTerm, filterType])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search with Ctrl/Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        const searchInput = document.getElementById('search-input')
        searchInput?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    
    // Track search interactions
    if (value.length >= 3) {
      trackInteraction('search', value, {
        category: selectedCategory,
        filterType,
        resultsCount: filteredObjects.length
      })
    }
  }, [trackInteraction, selectedCategory, filterType, filteredObjects.length])



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                <span className="hidden sm:inline">JavaScript Objects Tutorial</span>
                <span className="sm:hidden">JS Objects</span>
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:block">
                <Suspense fallback={<ButtonFallback />}>
                  <PWAInstallButton showPromoBanner={true} />
                </Suspense>
              </div>
              <Notifications 
                notifications={notifications} 
                onMarkAsRead={markAsRead} 
                onClearAll={clearAll} 
              />
              <ThemeToggle />
              <span className="hidden sm:inline text-sm text-gray-500 dark:text-gray-400">
                {objects.length} Objects
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Mobile Search Bar */}
        <div className="lg:hidden mb-4">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search objects..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
          >
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Filters & Navigation
            </span>
            <div className="flex items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                {sidebarOpen ? 'Hide' : 'Show'}
              </span>
              <div className={`transform transition-transform ${sidebarOpen ? 'rotate-180' : ''}`}>
                ▼
              </div>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Sidebar - Object Navigation */}
          <div className={`lg:col-span-1 space-y-4 lg:space-y-6 order-2 lg:order-1 ${
            !sidebarOpen ? 'hidden lg:block' : ''
          }`}>
            {/* Quick Links */}
            <Suspense fallback={<ComponentFallback />}>
              <QuickLinks />
            </Suspense>
            
            {/* Study Mode */}
            <Suspense fallback={<ComponentFallback />}>
              <StudyMode onObjectSelect={handleObjectSelect} objects={objects} />
            </Suspense>
            
            {/* Learning Stats */}
            <Suspense fallback={<ComponentFallback />}>
              <LearningStats />
            </Suspense>
            
            {/* Progress Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <Suspense fallback={<ComponentFallback className="h-20" />}>
                <ProgressBar />
              </Suspense>
            </div>

            {/* Navigation Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Code className="h-5 w-5 mr-2" />
                JavaScript Objects
              </h2>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search objects..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  aria-label="Search JavaScript objects"
                />
              </div>

              {/* Category Selector */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                >
                  <option value="all">All Categories</option>
                  {Object.keys(objectCategories).map(category => (
                    <option key={category} value={category}>
                      {category} ({objectCategories[category as keyof typeof objectCategories].length})
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center space-x-1 mb-4">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    filterType === 'all'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                  }`}
                >
                  <TrendingUp className="h-3 w-3 mr-1 inline" />
                  All
                </button>
                <button
                  onClick={() => setFilterType('favorites')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    filterType === 'favorites'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                  }`}
                >
                  <Star className="h-3 w-3 mr-1 inline" />
                  Favorites ({favorites.length})
                </button>
                <button
                  onClick={() => setFilterType('visited')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    filterType === 'visited'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                  }`}
                >
                  <Clock className="h-3 w-3 mr-1 inline" />
                  Visited
                </button>
              </div>
              
              <div className="space-y-2 max-h-80 sm:max-h-96 overflow-y-auto">
                {filteredObjects.length > 0 ? (
                  filteredObjects.map((obj) => (
                    <div key={obj} className="flex items-center group">
                      <button
                        onClick={() => handleObjectSelect(obj)}
                        className={`flex-1 text-left px-2 sm:px-3 py-2 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800 ${
                          selectedObject === obj
                            ? 'bg-blue-100 text-blue-700 font-medium dark:bg-blue-900 dark:text-blue-300'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                        aria-label={`Select ${obj} object`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{obj}</span>
                          <div className="flex items-center space-x-1">
                            {isObjectVisited(obj) && (
                              <div className="w-2 h-2 bg-green-500 rounded-full" title="Visited" />
                            )}
                          </div>
                        </div>
                      </button>
                      <Suspense fallback={<ButtonFallback />}>
                        <FavoriteButton 
                          objectName={obj} 
                          className="opacity-0 group-hover:opacity-100 transition-opacity ml-1" 
                        />
                      </Suspense>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm py-2">
                    {filterType === 'favorites' && favorites.length === 0 
                      ? 'No favorites yet. Click the heart icon to add some!'
                      : searchTerm 
                        ? `No objects found matching "${searchTerm}"`
                        : 'No objects found in this category'}
                  </p>
                )}
              </div>
              
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800 rounded"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-8 order-1 lg:order-2">
            {/* Tabbed Interface */}
            <Suspense fallback={<ComponentFallback className="h-96" />}>
              <TabbedInterface 
                selectedObject={selectedObject} 
                onSelectObject={handleObjectSelect} 
              />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <Suspense fallback={null}>
        <KeyboardShortcuts />
      </Suspense>

      {/* Analytics Dashboard */}
      <Suspense fallback={<ComponentFallback className="h-64" />}>
        <AnalyticsDashboard />
      </Suspense>

      {/* PWA Install Banner */}
      <Suspense fallback={null}>
        <PWAInstallButton />
      </Suspense>
      
    </div>
  )
}

export default function Home() {
  return (
    <NotificationProvider>
      <HomeContent />
    </NotificationProvider>
  )
}
