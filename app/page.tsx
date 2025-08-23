'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import TabbedInterface from './components/TabbedInterface'
import ThemeToggle from './components/ThemeToggle'
import FavoriteButton from './components/FavoriteButton'
import ProgressBar from './components/ProgressBar'
import KeyboardShortcuts from './components/KeyboardShortcuts'
import QuickLinks from './components/QuickLinks'
import LearningStats from './components/LearningStats'
import PWAInstallButton from './components/PWAInstallButton'
import StudyMode from './components/StudyMode'
import Notifications, { NotificationProvider, useNotifications } from './components/Notifications'
import { BookOpen, Code, Play, Search, Star, TrendingUp, Clock } from 'lucide-react'
import { useApp } from './contexts/AppContext'
import { OBJECT_CATEGORIES, getAllObjects } from './constants/objects'
import { searchObjects, filterObjects } from './utils/search'
import { usePerformanceTracking } from './utils/performance'

function HomeContent() {
  const [selectedObject, setSelectedObject] = useState<string>('Object')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filterType, setFilterType] = useState<'all' | 'favorites' | 'visited'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  
  const { favorites, isObjectVisited, markAsVisited, isObjectFavorited, visitedObjects } = useApp()
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
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                JavaScript Objects Tutorial
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <PWAInstallButton showPromoBanner={true} />
              <Notifications 
                notifications={notifications} 
                onMarkAsRead={markAsRead} 
                onClearAll={clearAll} 
              />
              <ThemeToggle />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {objects.length} Objects
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Object Navigation */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Links */}
            <QuickLinks />
            
            {/* Study Mode */}
            <StudyMode onObjectSelect={handleObjectSelect} objects={objects} />
            
            {/* Learning Stats */}
            <LearningStats />
            
            {/* Progress Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <ProgressBar />
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
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredObjects.length > 0 ? (
                  filteredObjects.map((obj) => (
                    <div key={obj} className="flex items-center group">
                      <button
                        onClick={() => handleObjectSelect(obj)}
                        className={`flex-1 text-left px-3 py-2 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800 ${
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
                      <FavoriteButton 
                        objectName={obj} 
                        className="opacity-0 group-hover:opacity-100 transition-opacity ml-1" 
                      />
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
          <div className="lg:col-span-2 space-y-8">
            {/* Tabbed Interface */}
            <TabbedInterface 
              selectedObject={selectedObject} 
              onSelectObject={handleObjectSelect} 
            />
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts />

      {/* PWA Install Banner */}
      <PWAInstallButton />
      
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
