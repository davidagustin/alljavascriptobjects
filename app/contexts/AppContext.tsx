'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface AppContextType {
  favorites: string[]
  visitedObjects: string[]
  addToFavorites: (objectName: string) => void
  removeFromFavorites: (objectName: string) => void
  markAsVisited: (objectName: string) => void
  isObjectFavorited: (objectName: string) => boolean
  isObjectVisited: (objectName: string) => boolean
  getProgress: () => { visited: number; total: number; percentage: number }
  clearProgress: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const TOTAL_OBJECTS = 78 // Total number of JavaScript objects in the app

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [visitedObjects, setVisitedObjects] = useState<string[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('js-objects-favorites')
    const savedVisited = localStorage.getItem('js-objects-visited')
    
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error('Error loading favorites:', error)
      }
    }
    
    if (savedVisited) {
      try {
        setVisitedObjects(JSON.parse(savedVisited))
      } catch (error) {
        console.error('Error loading visited objects:', error)
      }
    }
  }, [])

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('js-objects-favorites', JSON.stringify(favorites))
  }, [favorites])

  // Save visited objects to localStorage
  useEffect(() => {
    localStorage.setItem('js-objects-visited', JSON.stringify(visitedObjects))
  }, [visitedObjects])

  const addToFavorites = (objectName: string) => {
    setFavorites(prev => {
      if (!prev.includes(objectName)) {
        return [...prev, objectName]
      }
      return prev
    })
  }

  const removeFromFavorites = (objectName: string) => {
    setFavorites(prev => prev.filter(name => name !== objectName))
  }

  const markAsVisited = (objectName: string) => {
    setVisitedObjects(prev => {
      if (!prev.includes(objectName)) {
        return [...prev, objectName]
      }
      return prev
    })
  }

  const isObjectFavorited = (objectName: string) => {
    return favorites.includes(objectName)
  }

  const isObjectVisited = (objectName: string) => {
    return visitedObjects.includes(objectName)
  }

  const getProgress = () => {
    const visited = visitedObjects.length
    const total = TOTAL_OBJECTS
    const percentage = Math.round((visited / total) * 100)
    return { visited, total, percentage }
  }

  const clearProgress = () => {
    setVisitedObjects([])
    setFavorites([])
    localStorage.removeItem('js-objects-favorites')
    localStorage.removeItem('js-objects-visited')
  }

  return (
    <AppContext.Provider value={{
      favorites,
      visitedObjects,
      addToFavorites,
      removeFromFavorites,
      markAsVisited,
      isObjectFavorited,
      isObjectVisited,
      getProgress,
      clearProgress
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