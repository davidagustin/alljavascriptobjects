'use client'

import { createContext, useContext, useCallback } from 'react'
import { useLocalStorageArray } from '../hooks/useLocalStorage'
import { STORAGE_KEYS } from '../utils/storage'
import { getTotalObjectsCount } from '../constants/objects'

export interface LearningProgress {
  visited: number
  total: number
  percentage: number
  streak: number
  lastVisitDate: string
}

interface AppContextType {
  favorites: string[]
  visitedObjects: string[]
  totalObjects: number
  addToFavorites: (objectName: string) => void
  removeFromFavorites: (objectName: string) => void
  toggleFavorite: (objectName: string) => void
  markAsVisited: (objectName: string) => void
  isObjectFavorited: (objectName: string) => boolean
  isObjectVisited: (objectName: string) => boolean
  getProgress: () => LearningProgress
  clearProgress: () => void
  clearFavorites: () => void
  getFavoritesByCategory: (category: string) => string[]
  getRecentlyVisited: (limit?: number) => string[]
  getBatchProgress: (objectNames: string[]) => { completed: number; total: number }
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Use the new localStorage hooks
  const {
    array: favorites,
    addItem: addToFavorites,
    removeItem: removeFromFavorites,
    toggleItem: toggleFavorite,
    hasItem: isObjectFavorited,
    clearArray: clearFavorites
  } = useLocalStorageArray<string>(STORAGE_KEYS.FAVORITES)

  const {
    array: visitedObjects,
    addItem: markAsVisited,
    hasItem: isObjectVisited,
    clearArray: clearVisited
  } = useLocalStorageArray<string>(STORAGE_KEYS.VISITED)

  // Enhanced progress calculation with streak tracking
  const getProgress = useCallback((): LearningProgress => {
    const visited = visitedObjects.length
    const total = getTotalObjectsCount()
    const percentage = Math.round((visited / total) * 100)
    
    // Calculate streak (simplified - could be enhanced with actual dates)
    const streak = Math.min(visited, 7) // Max 7 day streak for now
    
    const lastVisitDate = new Date().toISOString()
    
    return {
      visited,
      total,
      percentage,
      streak,
      lastVisitDate
    }
  }, [visitedObjects])

  const clearProgress = useCallback(() => {
    clearVisited()
    clearFavorites()
  }, [clearVisited, clearFavorites])

  // New utility functions
  const getFavoritesByCategory = useCallback((category: string): string[] => {
    // This would need category data - simplified implementation
    return favorites.filter(obj => {
      // Could enhance with actual category lookup
      return true
    })
  }, [favorites])

  const getRecentlyVisited = useCallback((limit: number = 10): string[] => {
    // Return most recent (simplified - could track actual visit dates)
    return visitedObjects.slice(-limit).reverse()
  }, [visitedObjects])

  const getBatchProgress = useCallback((objectNames: string[]): { completed: number; total: number } => {
    const completed = objectNames.filter(name => isObjectVisited(name)).length
    return {
      completed,
      total: objectNames.length
    }
  }, [isObjectVisited])

  const totalObjects = getTotalObjectsCount()

  return (
    <AppContext.Provider value={{
      favorites,
      visitedObjects,
      totalObjects,
      addToFavorites,
      removeFromFavorites,
      toggleFavorite,
      markAsVisited,
      isObjectFavorited,
      isObjectVisited,
      getProgress,
      clearProgress,
      clearFavorites,
      getFavoritesByCategory,
      getRecentlyVisited,
      getBatchProgress
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}