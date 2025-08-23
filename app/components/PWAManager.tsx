'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Download, Wifi, WifiOff, Bell, Settings, Smartphone, Monitor, RefreshCw, AlertCircle, CheckCircle, Zap, Database } from 'lucide-react'

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface NotificationOptions {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  data?: any
  actions?: NotificationAction[]
  timestamp?: number
}

interface CacheStatus {
  totalSize: number
  objectsCached: number
  lastUpdated: Date
  version: string
}

interface OfflineQueue {
  id: string
  type: 'favorite' | 'progress' | 'bookmark' | 'comment'
  data: any
  timestamp: Date
  retries: number
}

export default function PWAManager() {
  const [isOnline, setIsOnline] = useState(true)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')
  const [cacheStatus, setCacheStatus] = useState<CacheStatus>({
    totalSize: 0,
    objectsCached: 0,
    lastUpdated: new Date(),
    version: '1.0.0'
  })
  const [offlineQueue, setOfflineQueue] = useState<OfflineQueue[]>([])
  const [isUpdating, setIsUpdating] = useState(false)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false)

  const serviceWorkerRef = useRef<ServiceWorker | null>(null)

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Service Worker registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      registerServiceWorker()
    }
  }, [])

  // Install prompt handling
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as InstallPromptEvent)
      setIsInstallable(true)
      
      // Show install banner after a delay
      setTimeout(() => {
        if (!isInstalled) {
          setShowInstallBanner(true)
        }
      }, 30000) // Show after 30 seconds
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setShowInstallBanner(false)
      showNotification({
        title: 'App Installed!',
        body: 'JavaScript Objects Tutorial is now installed and ready for offline use.',
        icon: '/icon-192.png'
      })
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [isInstalled])

  // Check if app is already installed
  useEffect(() => {
    const checkInstallation = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          (window.navigator as any).standalone === true) {
        setIsInstalled(true)
      }
    }

    checkInstallation()
  }, [])

  // Notification permission handling
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
  }, [])

  // Offline queue processing
  useEffect(() => {
    if (isOnline && offlineQueue.length > 0) {
      processOfflineQueue()
    }
  }, [isOnline])

  // Load offline queue from localStorage
  useEffect(() => {
    const savedQueue = localStorage.getItem('offline-queue')
    if (savedQueue) {
      setOfflineQueue(JSON.parse(savedQueue))
    }
  }, [])

  // Save offline queue to localStorage
  useEffect(() => {
    localStorage.setItem('offline-queue', JSON.stringify(offlineQueue))
  }, [offlineQueue])

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      serviceWorkerRef.current = registration.active

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setIsUpdating(true)
              showNotification({
                title: 'Update Available',
                body: 'A new version of the app is available. Refresh to update.',
                actions: [
                  { action: 'update', title: 'Update Now' },
                  { action: 'dismiss', title: 'Later' }
                ]
              })
            }
          })
        }
      })

      // Handle service worker messages
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'CACHE_UPDATED') {
          updateCacheStatus()
        }
      })

      console.log('Service Worker registered successfully')
      updateCacheStatus()
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }

  const updateCacheStatus = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        let totalSize = 0
        let objectsCached = 0

        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName)
          const requests = await cache.keys()
          objectsCached += requests.length

          // Estimate cache size (simplified)
          for (const request of requests) {
            const response = await cache.match(request)
            if (response) {
              const blob = await response.blob()
              totalSize += blob.size
            }
          }
        }

        setCacheStatus({
          totalSize,
          objectsCached,
          lastUpdated: new Date(),
          version: '1.0.0'
        })
      }
    } catch (error) {
      console.error('Failed to update cache status:', error)
    }
  }

  const installApp = useCallback(async () => {
    if (!installPrompt) return

    try {
      await installPrompt.prompt()
      const result = await installPrompt.userChoice
      
      if (result.outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }
      
      setInstallPrompt(null)
      setIsInstallable(false)
      setShowInstallBanner(false)
    } catch (error) {
      console.error('Failed to install app:', error)
    }
  }, [installPrompt])

  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications')
      return
    }

    try {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
      setShowNotificationPrompt(false)

      if (permission === 'granted') {
        showNotification({
          title: 'Notifications Enabled!',
          body: 'You\'ll now receive updates about your learning progress.',
          icon: '/icon-192.png'
        })
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error)
    }
  }, [])

  const showNotification = useCallback(async (options: NotificationOptions) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/icon-192.png',
        badge: options.badge || '/icon-192.png',
        tag: options.tag,
        data: options.data,
        timestamp: options.timestamp || Date.now()
      })

      notification.onclick = () => {
        window.focus()
        notification.close()
        
        if (options.data?.url) {
          window.location.href = options.data.url
        }
      }

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close()
      }, 5000)
    } catch (error) {
      console.error('Failed to show notification:', error)
    }
  }, [])

  const addToOfflineQueue = useCallback((type: OfflineQueue['type'], data: any) => {
    const queueItem: OfflineQueue = {
      id: Date.now().toString(),
      type,
      data,
      timestamp: new Date(),
      retries: 0
    }

    setOfflineQueue(prev => [...prev, queueItem])
  }, [])

  const processOfflineQueue = useCallback(async () => {
    if (offlineQueue.length === 0) return

    const processedIds: string[] = []

    for (const item of offlineQueue) {
      try {
        // Simulate API calls for different types
        switch (item.type) {
          case 'favorite':
            // await api.addFavorite(item.data)
            console.log('Processing favorite:', item.data)
            break
          case 'progress':
            // await api.updateProgress(item.data)
            console.log('Processing progress:', item.data)
            break
          case 'bookmark':
            // await api.addBookmark(item.data)
            console.log('Processing bookmark:', item.data)
            break
          case 'comment':
            // await api.addComment(item.data)
            console.log('Processing comment:', item.data)
            break
        }

        processedIds.push(item.id)
      } catch (error) {
        console.error(`Failed to process offline item ${item.id}:`, error)
        
        // Increment retry count
        if (item.retries < 3) {
          setOfflineQueue(prev => prev.map(queueItem => 
            queueItem.id === item.id 
              ? { ...queueItem, retries: queueItem.retries + 1 }
              : queueItem
          ))
        } else {
          // Remove after 3 failed attempts
          processedIds.push(item.id)
        }
      }
    }

    // Remove processed items
    if (processedIds.length > 0) {
      setOfflineQueue(prev => prev.filter(item => !processedIds.includes(item.id)))
      
      showNotification({
        title: 'Sync Complete',
        body: `${processedIds.length} offline action(s) synced successfully.`,
        icon: '/icon-192.png'
      })
    }
  }, [offlineQueue, showNotification])

  const clearCache = useCallback(async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map(name => caches.delete(name)))
        setCacheStatus({
          totalSize: 0,
          objectsCached: 0,
          lastUpdated: new Date(),
          version: '1.0.0'
        })
        
        showNotification({
          title: 'Cache Cleared',
          body: 'All cached data has been removed.',
          icon: '/icon-192.png'
        })
      }
    } catch (error) {
      console.error('Failed to clear cache:', error)
    }
  }, [showNotification])

  const updateApp = useCallback(async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration()
        if (registration?.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' })
          window.location.reload()
        }
      }
    } catch (error) {
      console.error('Failed to update app:', error)
    }
  }, [])

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className={`p-4 rounded-lg border ${
        isOnline 
          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
          : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
      }`}>
        <div className="flex items-center space-x-3">
          {isOnline ? (
            <Wifi className="h-5 w-5 text-green-600 dark:text-green-400" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-600 dark:text-red-400" />
          )}
          <div>
            <h3 className={`font-medium ${
              isOnline 
                ? 'text-green-800 dark:text-green-200' 
                : 'text-red-800 dark:text-red-200'
            }`}>
              {isOnline ? 'Online' : 'Offline'}
            </h3>
            <p className={`text-sm ${
              isOnline 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {isOnline 
                ? 'All features available' 
                : `Working offline • ${offlineQueue.length} actions queued`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Install App Banner */}
      {showInstallBanner && (
        <div className="p-4 bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="font-medium text-blue-800 dark:text-blue-200">
                  Install App
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Install for faster access and offline support
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={installApp}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                Install
              </button>
              <button
                onClick={() => setShowInstallBanner(false)}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Permission */}
      {showNotificationPrompt && notificationPermission === 'default' && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                  Enable Notifications
                </h3>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  Get notified about learning milestones and updates
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={requestNotificationPermission}
                className="px-4 py-2 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 transition-colors"
              >
                Allow
              </button>
              <button
                onClick={() => setShowNotificationPrompt(false)}
                className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Update Available */}
      {isUpdating && (
        <div className="p-4 bg-purple-50 border border-purple-200 dark:bg-purple-900/20 dark:border-purple-800 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <RefreshCw className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <div>
                <h3 className="font-medium text-purple-800 dark:text-purple-200">
                  Update Available
                </h3>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  A new version with improvements is ready
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={updateApp}
                className="px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
              >
                Update Now
              </button>
              <button
                onClick={() => setIsUpdating(false)}
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PWA Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Installation Status */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-lg ${
              isInstalled 
                ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                Installation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isInstalled ? 'Installed' : isInstallable ? 'Available' : 'Not Available'}
              </p>
            </div>
          </div>
          {isInstallable && !isInstalled && (
            <button
              onClick={installApp}
              className="w-full mt-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Install App
            </button>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-lg ${
              notificationPermission === 'granted'
                ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                Notifications
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {notificationPermission}
              </p>
            </div>
          </div>
          {notificationPermission === 'default' && (
            <button
              onClick={requestNotificationPermission}
              className="w-full mt-2 px-3 py-2 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 transition-colors"
            >
              Enable
            </button>
          )}
        </div>

        {/* Cache Status */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 rounded-lg">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                Offline Cache
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatBytes(cacheStatus.totalSize)}
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {cacheStatus.objectsCached} items cached
          </div>
        </div>

        {/* Offline Queue */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-lg ${
              offlineQueue.length === 0
                ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400'
            }`}>
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                Sync Queue
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {offlineQueue.length} pending
              </p>
            </div>
          </div>
          {offlineQueue.length > 0 && isOnline && (
            <button
              onClick={processOfflineQueue}
              className="w-full mt-2 px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
            >
              Sync Now
            </button>
          )}
        </div>
      </div>

      {/* PWA Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          App Management
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={updateCacheStatus}
            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Cache Status
          </button>
          
          <button
            onClick={clearCache}
            className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Database className="h-4 w-4 mr-2" />
            Clear Cache
          </button>
          
          <button
            onClick={() => setShowNotificationPrompt(true)}
            className="flex items-center justify-center px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <Bell className="h-4 w-4 mr-2" />
            Manage Notifications
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Monitor className="h-4 w-4 mr-2" />
            Reload App
          </button>
        </div>
        
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <p>Last cache update: {cacheStatus.lastUpdated.toLocaleString()}</p>
          <p>App version: {cacheStatus.version}</p>
        </div>
      </div>
    </div>
  )
}
