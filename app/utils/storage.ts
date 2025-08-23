/**
 * Safe localStorage utilities with error handling
 */

export interface StorageResult<T> {
  data: T | null
  error: Error | null
}

/**
 * Safely get an item from localStorage
 */
export function getStorageItem<T>(key: string, defaultValue: T): StorageResult<T> {
  try {
    if (typeof window === 'undefined') {
      return { data: defaultValue, error: null }
    }

    const item = localStorage.getItem(key)
    if (item === null) {
      return { data: defaultValue, error: null }
    }

    const parsed = JSON.parse(item)
    return { data: parsed, error: null }
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error)
    return { data: defaultValue, error: error as Error }
  }
}

/**
 * Safely set an item in localStorage
 */
export function setStorageItem<T>(key: string, value: T): { error: Error | null } {
  try {
    if (typeof window === 'undefined') {
      return { error: null }
    }

    const serialized = JSON.stringify(value)
    localStorage.setItem(key, serialized)
    return { error: null }
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error)
    return { error: error as Error }
  }
}

/**
 * Remove an item from localStorage
 */
export function removeStorageItem(key: string): { error: Error | null } {
  try {
    if (typeof window === 'undefined') {
      return { error: null }
    }

    localStorage.removeItem(key)
    return { error: null }
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error)
    return { error: error as Error }
  }
}

/**
 * Clear all app-specific items from localStorage
 */
export function clearAppStorage(): { error: Error | null } {
  try {
    if (typeof window === 'undefined') {
      return { error: null }
    }

    const keys = Object.keys(localStorage)
    const appKeys = keys.filter(key => key.startsWith('js-objects-'))
    
    appKeys.forEach(key => localStorage.removeItem(key))
    return { error: null }
  } catch (error) {
    console.error('Error clearing app storage:', error)
    return { error: error as Error }
  }
}

/**
 * Storage keys constants
 */
export const STORAGE_KEYS = {
  FAVORITES: 'js-objects-favorites',
  VISITED: 'js-objects-visited',
  THEME: 'js-objects-theme',
  SEARCH_HISTORY: 'js-objects-search-history',
  USER_PREFERENCES: 'js-objects-preferences',
  CODE_SNIPPETS: 'js-objects-code-snippets',
  LEARNING_PROGRESS: 'js-objects-progress',
  NOTIFICATIONS: 'js-objects-notifications',
  PWA_BANNER_DISMISSED: 'js-objects-pwa-banner-dismissed'
} as const