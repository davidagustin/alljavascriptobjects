import { useCallback, useEffect, useRef, useState } from 'react'
import { PERFORMANCE } from '../utils/constants'

// Debounce hook for performance optimization
export function useDebounce<T>(value: T, delay: number = PERFORMANCE.DEBOUNCE_DELAY): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Throttle hook for performance optimization
export function useThrottle<T extends (...args: any[]) => void>(
  callback: T, 
  delay: number = PERFORMANCE.DEBOUNCE_DELAY
): T {
  const throttleTimer = useRef<NodeJS.Timeout | null>(null)

  const throttledCallback = useCallback((...args: Parameters<T>) => {
    if (throttleTimer.current === null) {
      callback(...args)
      throttleTimer.current = setTimeout(() => {
        throttleTimer.current = null
      }, delay)
    }
  }, [callback, delay])

  useEffect(() => {
    return () => {
      if (throttleTimer.current) {
        clearTimeout(throttleTimer.current)
      }
    }
  }, [])

  return throttledCallback as T
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting
        setIsIntersecting(isElementIntersecting)
        
        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }
      },
      {
        threshold: PERFORMANCE.LAZY_LOAD_THRESHOLD,
        ...options
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [elementRef, hasIntersected, options])

  return { isIntersecting, hasIntersected }
}

// Memory usage monitoring hook
export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  } | null>(null)

  useEffect(() => {
    // @ts-ignore - performance.memory is not in TypeScript definitions
    if ('memory' in performance) {
      const updateMemoryInfo = () => {
        // @ts-ignore
        const memory = performance.memory
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        })
      }

      updateMemoryInfo()
      const interval = setInterval(updateMemoryInfo, 5000) // Update every 5 seconds

      return () => clearInterval(interval)
    }
  }, [])

  return memoryInfo
}

// Virtual scrolling hook for large lists
export function useVirtualScroll<T>({
  items,
  itemHeight = PERFORMANCE.VIRTUAL_SCROLL_ITEM_HEIGHT,
  containerHeight = 400,
  overscan = 5
}: {
  items: T[]
  itemHeight?: number
  containerHeight?: number
  overscan?: number
}) {
  const [scrollTop, setScrollTop] = useState(0)
  
  const visibleCount = Math.ceil(containerHeight / itemHeight)
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(items.length, startIndex + visibleCount + overscan * 2)
  
  const visibleItems = items.slice(startIndex, endIndex)
  const totalHeight = items.length * itemHeight
  const offsetY = startIndex * itemHeight

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop)
  }, [])

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    startIndex,
    endIndex
  }
}

// Performance measurement hook
export function usePerformanceMeasure() {
  const measureRef = useRef<{ [key: string]: number }>({})

  const startMeasure = useCallback((name: string) => {
    measureRef.current[name] = performance.now()
  }, [])

  const endMeasure = useCallback((name: string): number => {
    const startTime = measureRef.current[name]
    if (startTime === undefined) {
      console.warn(`No start time found for measurement: ${name}`)
      return 0
    }
    
    const duration = performance.now() - startTime
    delete measureRef.current[name]
    return duration
  }, [])

  const measureAsync = useCallback(async <T>(
    name: string, 
    asyncOperation: () => Promise<T>
  ): Promise<{ result: T; duration: number }> => {
    startMeasure(name)
    try {
      const result = await asyncOperation()
      const duration = endMeasure(name)
      return { result, duration }
    } catch (error) {
      endMeasure(name)
      throw error
    }
  }, [startMeasure, endMeasure])

  return { startMeasure, endMeasure, measureAsync }
}

// Local storage with compression for large data
export function useCompressedStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      if (item === null) return defaultValue
      
      // Try to parse as compressed JSON first, then fallback to regular JSON
      try {
        // Simple compression: if data is large, we could implement LZ compression here
        return JSON.parse(item)
      } catch {
        return defaultValue
      }
    } catch (error) {
      console.warn(`Error reading from localStorage key "${key}":`, error)
      return defaultValue
    }
  })

  const setStoredValue = useCallback((newValue: T | ((val: T) => T)) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue
      setValue(valueToStore)
      
      const serialized = JSON.stringify(valueToStore)
      
      // Only store if under size limit
      if (serialized.length < PERFORMANCE.MAX_CODE_LENGTH) {
        localStorage.setItem(key, serialized)
      } else {
        console.warn(`Data too large to store in localStorage for key "${key}"`)
      }
    } catch (error) {
      console.warn(`Error saving to localStorage key "${key}":`, error)
    }
  }, [key, value])

  return [value, setStoredValue] as const
}

// Battery status hook for performance adaptation
export function useBatteryStatus() {
  const [batteryInfo, setBatteryInfo] = useState<{
    level: number
    charging: boolean
    chargingTime: number
    dischargingTime: number
  } | null>(null)

  useEffect(() => {
    let battery: any = null

    const updateBatteryInfo = (battery: any) => {
      setBatteryInfo({
        level: battery.level,
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime
      })
    }

    // @ts-ignore - Battery API is experimental
    if ('getBattery' in navigator) {
      // @ts-ignore
      navigator.getBattery().then((b: any) => {
        battery = b
        updateBatteryInfo(battery)

        battery.addEventListener('chargingchange', () => updateBatteryInfo(battery))
        battery.addEventListener('levelchange', () => updateBatteryInfo(battery))
      })
    }

    return () => {
      if (battery) {
        battery.removeEventListener('chargingchange', () => updateBatteryInfo(battery))
        battery.removeEventListener('levelchange', () => updateBatteryInfo(battery))
      }
    }
  }, [])

  return batteryInfo
}

// Code execution timeout hook
export function useCodeExecutionTimeout() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const executeWithTimeout = useCallback(async <T>(
    operation: () => Promise<T> | T,
    timeout: number = PERFORMANCE.CODE_EXECUTION_TIMEOUT
  ): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      // Set up timeout
      timeoutRef.current = setTimeout(() => {
        reject(new Error('Operation timed out'))
      }, timeout)

      // Execute operation
      Promise.resolve(operation())
        .then(result => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
          }
          resolve(result)
        })
        .catch(error => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
          }
          reject(error)
        })
    })
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return executeWithTimeout
}

// Resource preloader hook
export function useResourcePreloader(resources: string[]) {
  const [loadedResources, setLoadedResources] = useState<Set<string>>(new Set())
  const [failedResources, setFailedResources] = useState<Set<string>>(new Set())

  useEffect(() => {
    resources.forEach(resource => {
      if (!loadedResources.has(resource) && !failedResources.has(resource)) {
        if (resource.endsWith('.js')) {
          // Preload JavaScript
          const link = document.createElement('link')
          link.rel = 'modulepreload'
          link.href = resource
          link.onload = () => {
            setLoadedResources(prev => new Set(prev).add(resource))
          }
          link.onerror = () => {
            setFailedResources(prev => new Set(prev).add(resource))
          }
          document.head.appendChild(link)
        } else if (resource.endsWith('.css')) {
          // Preload CSS
          const link = document.createElement('link')
          link.rel = 'preload'
          link.href = resource
          link.as = 'style'
          link.onload = () => {
            setLoadedResources(prev => new Set(prev).add(resource))
          }
          link.onerror = () => {
            setFailedResources(prev => new Set(prev).add(resource))
          }
          document.head.appendChild(link)
        }
      }
    })
  }, [resources, loadedResources, failedResources])

  return {
    loadedResources: Array.from(loadedResources),
    failedResources: Array.from(failedResources),
    isLoading: resources.some(resource => 
      !loadedResources.has(resource) && !failedResources.has(resource)
    )
  }
}