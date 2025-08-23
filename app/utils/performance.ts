/**
 * Performance monitoring and analytics utilities
 */

export interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  tags?: Record<string, string>
}

export interface UserInteraction {
  action: string
  target: string
  timestamp: number
  duration?: number
  metadata?: Record<string, any>
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private interactions: UserInteraction[] = []
  private observers: PerformanceObserver[] = []

  constructor() {
    this.initializeObservers()
  }

  private initializeObservers() {
    // Observe Core Web Vitals
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1] as any
          this.recordMetric('LCP', lastEntry.startTime)
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
        this.observers.push(lcpObserver)

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            this.recordMetric('FID', entry.processingStart - entry.startTime)
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })
        this.observers.push(fidObserver)

        // Cumulative Layout Shift (CLS)
        let clsValue = 0
        const clsObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })
          this.recordMetric('CLS', clsValue)
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
        this.observers.push(clsObserver)

        // Long Tasks
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.recordMetric('LongTask', entry.duration, {
              name: entry.name,
              entryType: entry.entryType
            })
          })
        })
        longTaskObserver.observe({ entryTypes: ['longtask'] })
        this.observers.push(longTaskObserver)

      } catch (error) {
        console.warn('Performance monitoring setup failed:', error)
      }
    }
  }

  recordMetric(name: string, value: number, tags?: Record<string, string>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      tags
    }
    
    this.metrics.push(metric)
    
    // Keep only last 100 metrics to avoid memory issues
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100)
    }
  }

  recordInteraction(action: string, target: string, metadata?: Record<string, any>) {
    const interaction: UserInteraction = {
      action,
      target,
      timestamp: Date.now(),
      metadata
    }
    
    this.interactions.push(interaction)
    
    // Keep only last 50 interactions
    if (this.interactions.length > 50) {
      this.interactions = this.interactions.slice(-50)
    }
  }

  startTimer(name: string): () => void {
    const startTime = performance.now()
    
    return () => {
      const duration = performance.now() - startTime
      this.recordMetric(name, duration, { type: 'timer' })
    }
  }

  measureFunction<T extends (...args: any[]) => any>(
    fn: T,
    name: string
  ): (...args: Parameters<T>) => ReturnType<T> {
    return (...args: Parameters<T>): ReturnType<T> => {
      const stopTimer = this.startTimer(name)
      try {
        const result = fn(...args)
        
        // Handle async functions
        if (result && typeof result.then === 'function') {
          return result.finally(stopTimer) as ReturnType<T>
        } else {
          stopTimer()
          return result
        }
      } catch (error) {
        stopTimer()
        this.recordMetric(`${name}_error`, 1, { error: String(error) })
        throw error
      }
    }
  }

  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter(metric => metric.name === name)
    }
    return [...this.metrics]
  }

  getInteractions(action?: string): UserInteraction[] {
    if (action) {
      return this.interactions.filter(interaction => interaction.action === action)
    }
    return [...this.interactions]
  }

  getAverageMetric(name: string): number | null {
    const metrics = this.getMetrics(name)
    if (metrics.length === 0) return null
    
    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0)
    return sum / metrics.length
  }

  getPercentile(name: string, percentile: number): number | null {
    const metrics = this.getMetrics(name)
    if (metrics.length === 0) return null
    
    const values = metrics.map(m => m.value).sort((a, b) => a - b)
    const index = Math.floor((percentile / 100) * values.length)
    return values[Math.min(index, values.length - 1)]
  }

  getPerformanceReport(): {
    coreWebVitals: Record<string, number | null>
    customMetrics: Record<string, { avg: number; p95: number; count: number }>
    userInteractions: Record<string, number>
  } {
    const coreWebVitals = {
      LCP: this.getAverageMetric('LCP'),
      FID: this.getAverageMetric('FID'),
      CLS: this.getAverageMetric('CLS')
    }

    const customMetricsNames = [...new Set(this.metrics.map(m => m.name))]
      .filter(name => !['LCP', 'FID', 'CLS'].includes(name))

    const customMetrics: Record<string, { avg: number; p95: number; count: number }> = {}
    
    customMetricsNames.forEach(name => {
      const metrics = this.getMetrics(name)
      customMetrics[name] = {
        avg: this.getAverageMetric(name) || 0,
        p95: this.getPercentile(name, 95) || 0,
        count: metrics.length
      }
    })

    const interactionCounts: Record<string, number> = {}
    this.interactions.forEach(interaction => {
      interactionCounts[interaction.action] = (interactionCounts[interaction.action] || 0) + 1
    })

    return {
      coreWebVitals,
      customMetrics,
      userInteractions: interactionCounts
    }
  }

  exportData(): string {
    return JSON.stringify({
      metrics: this.metrics,
      interactions: this.interactions,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    }, null, 2)
  }

  clear() {
    this.metrics = []
    this.interactions = []
  }

  disconnect() {
    this.observers.forEach(observer => {
      try {
        observer.disconnect()
      } catch (error) {
        console.warn('Error disconnecting performance observer:', error)
      }
    })
    this.observers = []
  }
}

// Global instance
export const performanceMonitor = new PerformanceMonitor()

/**
 * Hook for React components to track interactions
 */
export function usePerformanceTracking() {
  const trackInteraction = (action: string, target: string, metadata?: Record<string, any>) => {
    performanceMonitor.recordInteraction(action, target, metadata)
  }

  const trackMetric = (name: string, value: number, tags?: Record<string, string>) => {
    performanceMonitor.recordMetric(name, value, tags)
  }

  const measureAsync = async <T>(
    promise: Promise<T>,
    name: string
  ): Promise<T> => {
    const stopTimer = performanceMonitor.startTimer(name)
    try {
      const result = await promise
      stopTimer()
      return result
    } catch (error) {
      stopTimer()
      performanceMonitor.recordMetric(`${name}_error`, 1, { error: String(error) })
      throw error
    }
  }

  return {
    trackInteraction,
    trackMetric,
    measureAsync,
    getReport: () => performanceMonitor.getPerformanceReport(),
    exportData: () => performanceMonitor.exportData()
  }
}

/**
 * Decorator for measuring function performance
 */
export function measure(name: string) {
  return function <T extends (...args: any[]) => any>(
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const method = descriptor.value!
    descriptor.value = performanceMonitor.measureFunction(method, name) as T
  }
}

/**
 * Utility functions for common performance measurements
 */
export const performanceUtils = {
  measurePageLoad: () => {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      performanceMonitor.recordMetric('DNS_Lookup', navigation.domainLookupEnd - navigation.domainLookupStart)
      performanceMonitor.recordMetric('TCP_Connect', navigation.connectEnd - navigation.connectStart)
      performanceMonitor.recordMetric('Request_Response', navigation.responseEnd - navigation.requestStart)
      performanceMonitor.recordMetric('DOM_Parse', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart)
      performanceMonitor.recordMetric('Full_Load', navigation.loadEventEnd - navigation.loadEventStart)
    }
  },

  measureMemoryUsage: () => {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory
      performanceMonitor.recordMetric('Memory_Used', memory.usedJSHeapSize)
      performanceMonitor.recordMetric('Memory_Total', memory.totalJSHeapSize)
      performanceMonitor.recordMetric('Memory_Limit', memory.jsHeapSizeLimit)
    }
  },

  measureBundleSize: async (bundleName: string) => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name.includes(bundleName)) {
            performanceMonitor.recordMetric(`Bundle_${bundleName}`, entry.transferSize || 0)
          }
        })
      })
      observer.observe({ entryTypes: ['resource'] })
    }
  }
}

// Auto-initialize performance tracking
if (typeof window !== 'undefined') {
  // Measure initial page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      performanceUtils.measurePageLoad()
      performanceUtils.measureMemoryUsage()
    }, 1000)
  })

  // Measure memory usage periodically
  setInterval(() => {
    performanceUtils.measureMemoryUsage()
  }, 30000) // Every 30 seconds

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    performanceMonitor.disconnect()
  })
}