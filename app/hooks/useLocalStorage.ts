import { useState, useEffect, useCallback } from 'react'
import { getStorageItem, setStorageItem } from '../utils/storage'

/**
 * Enhanced useLocalStorage hook with error handling and SSR support
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prevValue: T) => T)) => void, { error: Error | null; loading: boolean }] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)

  // Load from localStorage on mount
  useEffect(() => {
    const { data, error: storageError } = getStorageItem(key, initialValue)
    
    if (storageError) {
      setError(storageError)
    } else {
      setStoredValue(data)
    }
    
    setLoading(false)
  }, [key, initialValue])

  const setValue = useCallback((value: T | ((prevValue: T) => T)) => {
    try {
      setError(null)
      
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      setStoredValue(valueToStore)
      
      const { error: storageError } = setStorageItem(key, valueToStore)
      if (storageError) {
        setError(storageError)
      }
    } catch (err) {
      const error = err as Error
      setError(error)
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue, { error, loading }]
}

/**
 * Hook for managing arrays in localStorage (like favorites, visited items)
 */
export function useLocalStorageArray<T>(
  key: string,
  initialValue: T[] = []
) {
  const [array, setArray, { error, loading }] = useLocalStorage<T[]>(key, initialValue)

  const addItem = useCallback((item: T) => {
    setArray(prev => {
      if (!prev.includes(item)) {
        return [...prev, item]
      }
      return prev
    })
  }, [setArray])

  const removeItem = useCallback((item: T) => {
    setArray(prev => prev.filter(existingItem => existingItem !== item))
  }, [setArray])

  const toggleItem = useCallback((item: T) => {
    setArray(prev => {
      if (prev.includes(item)) {
        return prev.filter(existingItem => existingItem !== item)
      } else {
        return [...prev, item]
      }
    })
  }, [setArray])

  const hasItem = useCallback((item: T) => {
    return array.includes(item)
  }, [array])

  const clearArray = useCallback(() => {
    setArray([])
  }, [setArray])

  return {
    array,
    setArray,
    addItem,
    removeItem,
    toggleItem,
    hasItem,
    clearArray,
    error,
    loading
  }
}

/**
 * Hook for managing sets in localStorage
 */
export function useLocalStorageSet<T>(
  key: string,
  initialValue: T[] = []
) {
  const [items, setItems, { error, loading }] = useLocalStorage<T[]>(key, initialValue)

  const add = useCallback((item: T) => {
    setItems(prev => {
      const set = new Set(prev)
      set.add(item)
      return Array.from(set)
    })
  }, [setItems])

  const remove = useCallback((item: T) => {
    setItems(prev => {
      const set = new Set(prev)
      set.delete(item)
      return Array.from(set)
    })
  }, [setItems])

  const has = useCallback((item: T) => {
    return new Set(items).has(item)
  }, [items])

  const clear = useCallback(() => {
    setItems([])
  }, [setItems])

  const size = items.length

  return {
    items,
    add,
    remove,
    has,
    clear,
    size,
    error,
    loading
  }
}