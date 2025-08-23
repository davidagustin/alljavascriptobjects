/**
 * Application configuration and constants
 */

export const APP_CONFIG = {
  name: 'JavaScript Objects Tutorial',
  version: '1.0.0',
  description: 'A comprehensive tutorial on all JavaScript objects with examples and code compilation',
  author: 'JavaScript Objects Tutorial Team',
  repository: 'https://github.com/your-username/javascript-objects-tutorial',
  
  // URLs and endpoints
  urls: {
    homepage: 'https://javascript-objects-tutorial.vercel.app',
    documentation: 'https://docs.javascript-objects-tutorial.com',
    support: 'mailto:support@javascript-objects-tutorial.com',
    feedback: 'https://github.com/your-username/javascript-objects-tutorial/issues'
  },

  // Feature flags
  features: {
    enableAnalytics: process.env.NODE_ENV === 'production',
    enablePerformanceMonitoring: true,
    enableOfflineMode: true,
    enablePWA: true,
    enableAdvancedSearch: true,
    enableCodeSnippets: true,
    enableNotifications: true,
    enableAIAssistant: true,
    enableCollaboration: false, // Coming soon
    enableLearningPaths: false // Coming soon
  },

  // UI Configuration
  ui: {
    defaultTheme: 'system' as 'light' | 'dark' | 'system',
    sidebar: {
      defaultOpen: true,
      breakpoint: 1024
    },
    codeEditor: {
      defaultLanguage: 'javascript',
      defaultTheme: 'dark',
      tabSize: 2,
      fontSize: 14,
      fontFamily: 'Fira Code, Monaco, Consolas, monospace'
    },
    animation: {
      enableReducedMotion: false,
      defaultDuration: 200
    }
  },

  // Performance settings
  performance: {
    enableLazyLoading: true,
    virtualScrollThreshold: 100,
    debounceSearchMs: 300,
    cacheExpirationMs: 1000 * 60 * 60 * 24, // 24 hours
    maxCacheSize: 100,
    enableServiceWorker: true
  },

  // Learning and progress
  learning: {
    maxRecentItems: 10,
    maxFavorites: 100,
    progressPersistenceKey: 'js-objects-progress',
    achievementLevels: {
      beginner: { min: 0, max: 24 },
      explorer: { min: 25, max: 49 },
      scholar: { min: 50, max: 74 },
      expert: { min: 75, max: 89 },
      master: { min: 90, max: 100 }
    }
  },

  // External services
  services: {
    mdn: {
      baseUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects'
    },
    w3schools: {
      baseUrl: 'https://www.w3schools.com/jsref'
    },
    github: {
      apiUrl: 'https://api.github.com',
      repository: 'your-username/javascript-objects-tutorial'
    }
  },

  // Development settings
  development: {
    enableDebugMode: process.env.NODE_ENV === 'development',
    enableHotReload: process.env.NODE_ENV === 'development',
    showPerformanceMetrics: process.env.NODE_ENV === 'development',
    logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'error'
  },

  // SEO and metadata
  seo: {
    keywords: [
      'JavaScript',
      'Objects',
      'Tutorial',
      'Reference',
      'Examples',
      'TypeScript',
      'React',
      'Web Development',
      'Programming',
      'ES6',
      'ES2020',
      'Modern JavaScript'
    ],
    ogImage: '/og-image.png',
    twitterCard: 'summary_large_image'
  },

  // Limits and constraints
  limits: {
    maxCodeLength: 10000,
    maxSearchResults: 50,
    maxSnippets: 20,
    maxErrorReports: 10,
    maxCachedPages: 100
  }
} as const

// Environment-specific overrides
export const getConfig = () => {
  const baseConfig = APP_CONFIG

  if (typeof window !== 'undefined') {
    // Client-side specific configurations
    return {
      ...baseConfig,
      features: {
        ...baseConfig.features,
        // Override features based on client capabilities
        enableAdvancedSearch: 'IntersectionObserver' in window,
        enablePerformanceMonitoring: 'PerformanceObserver' in window
      }
    }
  }

  return baseConfig
}

// Type definitions
export type AppConfig = typeof APP_CONFIG
export type FeatureFlags = typeof APP_CONFIG.features

// Feature flag helpers
export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  return getConfig().features[feature]
}

// Environment helpers
export const isDevelopment = () => process.env.NODE_ENV === 'development'
export const isProduction = () => process.env.NODE_ENV === 'production'
export const isClient = () => typeof window !== 'undefined'
export const isServer = () => typeof window === 'undefined'

// Theme helpers
export const getSystemTheme = (): 'light' | 'dark' => {
  if (isClient() && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

// Performance helpers
export const shouldEnableFeature = (feature: keyof FeatureFlags): boolean => {
  const config = getConfig()
  
  // Check if feature is enabled
  if (!config.features[feature]) return false
  
  // Additional checks for performance-sensitive features
  if (isClient()) {
    // Check for reduced motion preference
    if (feature.includes('animation') && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false
    }
    
    // Check for low-end devices
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      if (connection && connection.effectiveType === 'slow-2g') {
        return false
      }
    }
  }
  
  return true
}

// URL helpers
export const getExternalUrl = (service: keyof typeof APP_CONFIG.services, path?: string): string => {
  const baseUrl = APP_CONFIG.services[service].baseUrl || APP_CONFIG.services[service]
  return path ? `${baseUrl}/${path}` : baseUrl
}

// Debug helpers
export const debugLog = (...args: any[]) => {
  if (getConfig().development.enableDebugMode) {
    console.log('[DEBUG]', ...args)
  }
}

export const performanceLog = (metric: string, value: number) => {
  if (getConfig().development.showPerformanceMetrics) {
    console.log(`[PERF] ${metric}:`, `${value.toFixed(2)}ms`)
  }
}