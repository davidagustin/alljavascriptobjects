import React, { useCallback, useRef, useEffect } from 'react'

// Debounce hook for performance optimization
export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>()
  
  const debouncedCallback = useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }, [callback, delay]) as T
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
  
  return debouncedCallback
}

// Throttle hook for performance optimization
export function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const lastCallRef = useRef<number>(0)
  
  const throttledCallback = useCallback((...args: Parameters<T>) => {
    const now = Date.now()
    
    if (now - lastCallRef.current >= delay) {
      lastCallRef.current = now
      callback(...args)
    }
  }, [callback, delay]) as T
  
  return throttledCallback
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  callback: (isIntersecting: boolean) => void,
  options?: IntersectionObserverInit
) {
  const targetRef = useRef<HTMLElement>(null)
  const observerRef = useRef<IntersectionObserver>()
  
  useEffect(() => {
    if (!targetRef.current) return
    
    observerRef.current = new IntersectionObserver(([entry]) => {
      callback(entry.isIntersecting)
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    })
    
    observerRef.current.observe(targetRef.current)
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [callback, options])
  
  return targetRef
}

// Virtual scrolling utility for large lists
export function useVirtualScrolling<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const startIndex = useRef(0)
  const endIndex = useRef(Math.ceil(containerHeight / itemHeight))
  
  const getVisibleItems = useCallback((scrollTop: number) => {
    const newStartIndex = Math.floor(scrollTop / itemHeight)
    const newEndIndex = Math.min(
      newStartIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    )
    
    startIndex.current = newStartIndex
    endIndex.current = newEndIndex
    
    return {
      startIndex: newStartIndex,
      endIndex: newEndIndex,
      visibleItems: items.slice(newStartIndex, newEndIndex),
      totalHeight: items.length * itemHeight,
      offsetY: newStartIndex * itemHeight
    }
  }, [items, itemHeight, containerHeight])
  
  return { getVisibleItems }
}

// Memory efficient cache with LRU eviction
export class LRUCache<K, V> {
  private capacity: number
  private cache: Map<K, V>
  
  constructor(capacity: number = 100) {
    this.capacity = capacity
    this.cache = new Map()
  }
  
  get(key: K): V | undefined {
    if (this.cache.has(key)) {
      // Move to end (most recently used)
      const value = this.cache.get(key)!
      this.cache.delete(key)
      this.cache.set(key, value)
      return value
    }
    return undefined
  }
  
  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      // Update existing
      this.cache.delete(key)
      this.cache.set(key, value)
    } else {
      // Add new
      if (this.cache.size >= this.capacity) {
        // Remove least recently used (first item)
        const firstKey = this.cache.keys().next().value
        this.cache.delete(firstKey)
      }
      this.cache.set(key, value)
    }
  }
  
  has(key: K): boolean {
    return this.cache.has(key)
  }
  
  clear(): void {
    this.cache.clear()
  }
  
  size(): number {
    return this.cache.size
  }
}

// Optimized search with caching and worker support
export class OptimizedSearch<T> {
  private cache = new LRUCache<string, T[]>(50)
  private worker?: Worker
  
  constructor(private data: T[], private searchFn: (item: T, query: string) => boolean) {
    // Initialize web worker if supported
    if (typeof Worker !== 'undefined' && data.length > 1000) {
      try {
        this.initializeWorker()
      } catch (error) {
        console.warn('Web Worker not supported, falling back to main thread search')
      }
    }
  }
  
  private initializeWorker() {
    const workerCode = `
      let data = [];
      let searchFn = null;
      
      self.onmessage = function(e) {
        const { type, payload } = e.data;
        
        switch (type) {
          case 'INIT':
            data = payload.data;
            searchFn = new Function('item', 'query', payload.searchFnString);
            break;
            
          case 'SEARCH':
            try {
              const { query } = payload;
              const results = data.filter(item => searchFn(item, query));
              self.postMessage({ type: 'SEARCH_RESULT', payload: results });
            } catch (error) {
              self.postMessage({ type: 'SEARCH_ERROR', payload: error.message });
            }
            break;
        }
      };
    `
    
    const blob = new Blob([workerCode], { type: 'application/javascript' })
    this.worker = new Worker(URL.createObjectURL(blob))
    
    // Initialize worker with data
    this.worker.postMessage({
      type: 'INIT',
      payload: {
        data: this.data,
        searchFnString: this.searchFn.toString()
      }
    })
  }
  
  search(query: string): Promise<T[]> {
    return new Promise((resolve) => {
      // Check cache first
      const cached = this.cache.get(query)
      if (cached) {
        resolve(cached)
        return
      }
      
      // Use worker if available and data is large
      if (this.worker && this.data.length > 1000) {
        const handleMessage = (e: MessageEvent) => {
          const { type, payload } = e.data
          
          if (type === 'SEARCH_RESULT') {
            this.cache.set(query, payload)
            this.worker!.removeEventListener('message', handleMessage)
            resolve(payload)
          } else if (type === 'SEARCH_ERROR') {
            console.error('Worker search error:', payload)
            this.fallbackSearch(query).then(resolve)
          }
        }
        
        this.worker.addEventListener('message', handleMessage)
        this.worker.postMessage({ type: 'SEARCH', payload: { query } })
      } else {
        this.fallbackSearch(query).then(resolve)
      }
    })
  }
  
  private async fallbackSearch(query: string): Promise<T[]> {
    // Use requestIdleCallback for non-blocking search
    return new Promise((resolve) => {
      const performSearch = () => {
        const results = this.data.filter(item => this.searchFn(item, query))
        this.cache.set(query, results)
        resolve(results)
      }
      
      if ('requestIdleCallback' in window) {
        requestIdleCallback(performSearch, { timeout: 100 })
      } else {
        setTimeout(performSearch, 0)
      }
    })
  }
  
  destroy() {
    if (this.worker) {
      this.worker.terminate()
    }
    this.cache.clear()
  }
}

// Bundle size optimization - code splitting helpers
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  componentName?: string
): React.LazyExoticComponent<T> {
  const LazyComponent = React.lazy(() => 
    importFn().catch(error => {
      console.error(`Failed to load ${componentName || 'component'}:`, error)
      // Return a fallback component
      return {
        default: (() => React.createElement('div', { className: 'p-4 text-center text-red-600' }, 'Failed to load component. Please refresh the page.')) as T
      }
    })
  )
  
  LazyComponent.displayName = componentName || 'LazyComponent'
  return LazyComponent
}

// Performance monitoring utilities
export const performanceHelpers = {
  measureRender: (name: string, fn: () => void) => {
    const start = performance.now()
    fn()
    const end = performance.now()
    console.log(`${name} render time: ${end - start}ms`)
  },
  
  measureAsync: async <T>(name: string, promise: Promise<T>): Promise<T> => {
    const start = performance.now()
    const result = await promise
    const end = performance.now()
    console.log(`${name} async time: ${end - start}ms`)
    return result
  },
  
  getMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      }
    }
    return null
  }
}

