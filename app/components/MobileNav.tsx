'use client'

import { useState, useEffect, useCallback } from 'react'
import { Menu, X, Home, BookOpen, Star, Clock, Search, Grid, List, ChevronRight } from 'lucide-react'
import { getAllObjects } from '../constants/objects'
import { useApp } from '../contexts/AppContext'

interface MobileNavProps {
  selectedObject: string
  onSelectObject: (object: string) => void
}

export default function MobileNav({ selectedObject, onSelectObject }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'recent'>('all')
  const { favorites = [], visitedObjects = [] } = useApp()
  const recentItems = visitedObjects.slice(-10)
  
  const objects = getAllObjects()
  
  // Close menu when object is selected
  const handleObjectSelect = useCallback((object: string) => {
    onSelectObject(object)
    setIsOpen(false)
  }, [onSelectObject])
  
  // Filter objects based on search and active tab
  const filteredObjects = objects.filter(obj => {
    const matchesSearch = obj.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (!matchesSearch) return false
    
    switch (activeTab) {
      case 'favorites':
        return favorites.includes(obj)
      case 'recent':
        return recentItems.includes(obj)
      default:
        return true
    }
  })
  
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])
  
  return (
    <>
      {/* Floating Action Button - only on mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-20 right-4 z-40 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
        aria-label="Open navigation menu"
      >
        <Menu className="h-6 w-6" />
      </button>
      
      {/* Full Screen Overlay Menu */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Menu Panel */}
        <div className="absolute right-0 top-0 h-full w-full sm:w-80 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Navigation</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search objects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'all'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'favorites'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Star className="inline h-4 w-4 mr-1" />
              Favorites
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'recent'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Clock className="inline h-4 w-4 mr-1" />
              Recent
            </button>
          </div>
          
          {/* Object List */}
          <div className="flex-1 overflow-y-auto">
            {filteredObjects.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <p>No objects found</p>
              </div>
            ) : (
              <div className="p-2">
                {filteredObjects.map(obj => (
                  <button
                    key={obj}
                    onClick={() => handleObjectSelect(obj)}
                    className={`w-full text-left px-4 py-3 rounded-lg mb-1 flex items-center justify-between group transition-all duration-200 ${
                      selectedObject === obj
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="font-medium">{obj}</span>
                    <div className="flex items-center space-x-2">
                      {favorites.includes(obj) && (
                        <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />
                      )}
                      {visitedObjects.includes(obj) && (
                        <div className="h-2 w-2 bg-green-500 rounded-full" />
                      )}
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => onSelectObject('Object')}
            className={`flex flex-col items-center p-2 ${
              selectedObject === 'Object'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </button>
          
          <button
            onClick={() => setIsOpen(true)}
            className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400"
          >
            <Grid className="h-5 w-5" />
            <span className="text-xs mt-1">Browse</span>
          </button>
          
          <button
            onClick={() => {
              setActiveTab('favorites')
              setIsOpen(true)
            }}
            className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400"
          >
            <Star className="h-5 w-5" />
            <span className="text-xs mt-1">Favorites</span>
          </button>
          
          <button
            onClick={() => {
              setActiveTab('recent')
              setIsOpen(true)
            }}
            className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400"
          >
            <Clock className="h-5 w-5" />
            <span className="text-xs mt-1">Recent</span>
          </button>
        </div>
      </div>
    </>
  )
}