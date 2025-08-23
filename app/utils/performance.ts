/**
 * Performance monitoring and analytics utilities
 */

interface InteractionEvent {
  type: string
  target: string
  metadata: Record<string, any>
  timestamp: number
  sessionId: string
}

interface PerformanceMetrics {
  pageLoadTime: number
  interactionCount: number
  sessionDuration: number
  objectsViewed: string[]
  searchQueries: string[]
}

class PerformanceTracker {
  private events: InteractionEvent[] = []
  private sessionId: string
  private sessionStart: number
  private pageLoadStart: number

  constructor() {
    this.sessionId = this.generateSessionId()
    this.sessionStart = Date.now()
    this.pageLoadStart = typeof window !== 'undefined' ? performance.now() : 0
    
    // Track page load time only on client side
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const loadTime = performance.now() - this.pageLoadStart
        this.trackEvent('page_load', 'app', { loadTime })
      })
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  trackEvent(type: string, target: string, metadata: Record<string, any> = {}): void {
    const event: InteractionEvent = {
      type,
      target,
      metadata,
      timestamp: Date.now(),
      sessionId: this.sessionId
    }
    
    this.events.push(event)
    
    // Keep only last 100 events to prevent memory issues
    if (this.events.length > 100) {
      this.events = this.events.slice(-100)
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Event:', event)
    }
  }

  getMetrics(): PerformanceMetrics {
    const sessionDuration = Date.now() - this.sessionStart
    const pageLoadEvent = this.events.find(e => e.type === 'page_load')
    const pageLoadTime = pageLoadEvent?.metadata?.loadTime || 0
    
    const objectsViewed = this.events
      .filter(e => e.type === 'object_select')
      .map(e => e.target)
    
    const searchQueries = this.events
      .filter(e => e.type === 'search')
      .map(e => e.target)
    
    return {
      pageLoadTime,
      interactionCount: this.events.length,
      sessionDuration,
      objectsViewed: [...new Set(objectsViewed)],
      searchQueries: [...new Set(searchQueries)]
    }
  }

  exportData(): string {
    return JSON.stringify({
      sessionId: this.sessionId,
      events: this.events,
      metrics: this.getMetrics()
    })
  }

  clear(): void {
    this.events = []
  }
}

// Global performance tracker instance - only on client side
const performanceTracker = typeof window !== 'undefined' ? new PerformanceTracker() : null

export function usePerformanceTracking() {
  const trackInteraction = (type: string, target: string, metadata?: Record<string, any>) => {
    if (performanceTracker) {
      performanceTracker.trackEvent(type, target, metadata)
    }
  }

  const getMetrics = () => {
    return performanceTracker ? performanceTracker.getMetrics() : {
      pageLoadTime: 0,
      interactionCount: 0,
      sessionDuration: 0,
      objectsViewed: [],
      searchQueries: []
    }
  }

  const exportData = () => {
    return performanceTracker ? performanceTracker.exportData() : '{}'
  }

  const clearData = () => {
    if (performanceTracker) {
      performanceTracker.clear()
    }
  }

  const measureAsync = async <T>(promise: Promise<T>, name: string): Promise<T> => {
    if (typeof performance === 'undefined') {
      return await promise
    }
    
    const start = performance.now()
    try {
      const result = await promise
      const duration = performance.now() - start
      
      if (performanceTracker) {
        performanceTracker.trackEvent('async_measurement', name, { duration, success: true })
      }
      
      return result
    } catch (error) {
      const duration = performance.now() - start
      
      if (performanceTracker) {
        performanceTracker.trackEvent('async_measurement', name, { duration, success: false, error: String(error) })
      }
      
      throw error
    }
  }

  return {
    trackInteraction,
    getMetrics,
    exportData,
    clearData,
    measureAsync
  }
}

// Track common user interactions
export function trackPageView(pageName: string) {
  if (performanceTracker) {
    performanceTracker.trackEvent('page_view', pageName)
  }
}

export function trackObjectView(objectName: string, category?: string) {
  if (performanceTracker) {
    performanceTracker.trackEvent('object_view', objectName, { category })
  }
}

export function trackSearch(query: string, resultsCount: number) {
  if (performanceTracker) {
    performanceTracker.trackEvent('search', query, { resultsCount })
  }
}

export function trackFavorite(objectName: string, action: 'add' | 'remove') {
  if (performanceTracker) {
    performanceTracker.trackEvent('favorite', objectName, { action })
  }
}

export function trackCodeExecution(objectName: string, success: boolean) {
  if (performanceTracker) {
    performanceTracker.trackEvent('code_execution', objectName, { success })
  }
}

export function trackQuizCompletion(score: number, totalQuestions: number) {
  if (performanceTracker) {
    performanceTracker.trackEvent('quiz_completion', 'quiz', { 
      score, 
      totalQuestions, 
      percentage: Math.round((score / totalQuestions) * 100) 
    })
  }
}

// Performance monitoring utilities
export function measureFunctionExecution<T>(fn: () => T, name: string): T {
  if (typeof performance === 'undefined') {
    return fn()
  }
  
  const start = performance.now()
  const result = fn()
  const duration = performance.now() - start
  
  if (performanceTracker) {
    performanceTracker.trackEvent('function_execution', name, { duration })
  }
  
  return result
}

export async function measureAsyncFunctionExecution<T>(
  fn: () => Promise<T>, 
  name: string
): Promise<T> {
  if (typeof performance === 'undefined') {
    return await fn()
  }
  
  const start = performance.now()
  const result = await fn()
  const duration = performance.now() - start
  
  if (performanceTracker) {
    performanceTracker.trackEvent('async_function_execution', name, { duration })
  }
  
  return result
}

// Memory usage tracking
export function trackMemoryUsage(): void {
  if ('memory' in performance) {
    const memory = (performance as any).memory
    performanceTracker.trackEvent('memory_usage', 'system', {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit
    })
  }
}

// Network performance tracking
export function trackNetworkRequest(url: string, duration: number, status: number) {
  if (performanceTracker) {
    performanceTracker.trackEvent('network_request', url, { duration, status })
  }
}

// Error tracking
export function trackError(error: Error, context?: string) {
  if (performanceTracker) {
    performanceTracker.trackEvent('error', error.name, {
      message: error.message,
      stack: error.stack,
      context
    })
  }
}