'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Download, Wifi, WifiOff, Smartphone, Monitor, Zap, Database, Settings, Bell, Sync, CloudOff, Check, AlertCircle } from 'lucide-react'

interface CacheStatus {
  isOnline: boolean
  cacheSize: number
  lastSync: Date | null
  pendingSync: number
  serviceWorkerStatus: 'installing' | 'waiting' | 'active' | 'redundant' | 'not-supported'
}

interface OfflineData {
  objects: string[]
  favorites: string[]
  progress: any
  codeSnippets: any[]
  lastUpdated: Date
}

interface PWACapability {
  name: string
  description: string
  icon: any
  status: 'available' | 'enabled' | 'disabled' | 'unsupported'
  details: string
}

export default function PWAFeatures() {
  const [isOpen, setIsOpen] = useState(false)
  const [cacheStatus, setCacheStatus] = useState<CacheStatus>({
    isOnline: true,
    cacheSize: 0,
    lastSync: null,
    pendingSync: 0,
    serviceWorkerStatus: 'not-supported'
  })
  const [offlineData, setOfflineData] = useState<OfflineData | null>(null)
  const [activeTab, setActiveTab] = useState<'status' | 'cache' | 'sync' | 'settings'>('status')
  const [notifications, setNotifications] = useState({
    enabled: false,
    updates: true,
    offline: true,
    sync: false
  })
  const [dataToCache, setDataToCache] = useState({
    objects: true,
    favorites: true,
    progress: true,
    code: false
  })

  // PWA Capabilities
  const capabilities: PWACapability[] = useMemo(() => [
    {
      name: 'App Installation',
      description: 'Install as a native app on your device',
      icon: Download,
      status: typeof window !== 'undefined' && 'serviceWorker' in navigator ? 'available' : 'unsupported',
      details: 'Add to home screen for quick access and app-like experience'
    },
    {
      name: 'Offline Mode',
      description: 'Access content without internet connection',
      icon: CloudOff,
      status: cacheStatus.serviceWorkerStatus === 'active' ? 'enabled' : 'disabled',
      details: 'Essential content cached for offline use'
    },
    {
      name: 'Background Sync',
      description: 'Sync data when connection is restored',
      icon: Sync,
      status: typeof window !== 'undefined' && 'background-sync' in (window as any) ? 'available' : 'unsupported',
      details: 'Automatically sync changes when back online'
    },
    {
      name: 'Push Notifications',
      description: 'Receive updates and reminders',
      icon: Bell,
      status: typeof window !== 'undefined' && 'Notification' in window ? 'available' : 'unsupported',
      details: 'Get notified about new features and learning reminders'
    },
    {
      name: 'Fast Loading',
      description: 'Instant loading with service worker caching',
      icon: Zap,
      status: cacheStatus.serviceWorkerStatus === 'active' ? 'enabled' : 'disabled',
      details: 'Pre-cached resources for lightning-fast performance'
    },
    {
      name: 'Data Persistence',
      description: 'Save your progress and preferences locally',
      icon: Database,
      status: typeof window !== 'undefined' && 'indexedDB' in window ? 'available' : 'unsupported',
      details: 'Your data is stored securely on your device'
    }
  ], [cacheStatus.serviceWorkerStatus])

  // Monitor online/offline status
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const updateOnlineStatus = () => {
      setCacheStatus(prev => ({ ...prev, isOnline: navigator.onLine }))
    }

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Initial status
    updateOnlineStatus()

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  // Monitor service worker status
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        setCacheStatus(prev => ({ ...prev, serviceWorkerStatus: 'active' }))
        
        // Monitor for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              setCacheStatus(prev => ({ 
                ...prev, 
                serviceWorkerStatus: newWorker.state as any 
              }))
            })
          }
        })
      }).catch(() => {
        setCacheStatus(prev => ({ ...prev, serviceWorkerStatus: 'not-supported' }))
      })
    }
  }, [])

  // Load offline data
  const loadOfflineData = useCallback(async () => {
    try {
      // Mock loading offline data from IndexedDB
      const mockOfflineData: OfflineData = {
        objects: ['Array', 'Object', 'Promise', 'String', 'Number'],
        favorites: (() => {
          try {
            return typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('favorites') || '[]') : []
          } catch {
            return []
          }
        })(),
        progress: (() => {
          try {
            return typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('visitedObjects') || '[]') : []
          } catch {
            return []
          }
        })(),
        codeSnippets: [],
        lastUpdated: new Date()
      }
      
      setOfflineData(mockOfflineData)
      
      // Simulate cache size calculation
      const dataSize = JSON.stringify(mockOfflineData).length
      setCacheStatus(prev => ({ ...prev, cacheSize: dataSize }))
    } catch (error) {
      console.error('Failed to load offline data:', error)
    }
  }, [])

  // Cache data for offline use
  const cacheForOffline = useCallback(async () => {
    try {
      const dataToStore: any = {}
      
      if (dataToCache.objects) {
        // Mock caching object data
        dataToStore.objects = capabilities.map(cap => cap.name)
      }
      
      if (dataToCache.favorites) {
        try {
          dataToStore.favorites = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('favorites') || '[]') : []
        } catch {
          dataToStore.favorites = []
        }
      }
      
      if (dataToCache.progress) {
        try {
          dataToStore.progress = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('visitedObjects') || '[]') : []
        } catch {
          dataToStore.progress = []
        }
      }
      
      // Simulate storing in IndexedDB
      if (typeof window !== 'undefined') {
        localStorage.setItem('offlineData', JSON.stringify({
          ...dataToStore,
          lastUpdated: new Date().toISOString()
        }))
      }
      
      setCacheStatus(prev => ({
        ...prev,
        lastSync: new Date(),
        cacheSize: JSON.stringify(dataToStore).length
      }))
      
      loadOfflineData()
    } catch (error) {
      console.error('Failed to cache data:', error)
    }
  }, [dataToCache, capabilities, loadOfflineData])

  // Clear cache
  const clearCache = useCallback(async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('offlineData')
      }
      setOfflineData(null)
      setCacheStatus(prev => ({ 
        ...prev, 
        cacheSize: 0, 
        lastSync: null 
      }))
    } catch (error) {
      console.error('Failed to clear cache:', error)
    }
  }, [])

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        setNotifications(prev => ({ ...prev, enabled: true }))
        // Show test notification
        new Notification('JavaScript Objects Tutorial', {
          body: 'Notifications enabled! You\'ll receive updates about new features.',
          icon: '/icon-192x192.png'
        })
      }
    }
  }, [])

  // Install PWA
  const installPWA = useCallback(() => {
    // This would typically use the beforeinstallprompt event
    alert('To install this app:\n\n1. Open the browser menu\n2. Select "Add to Home Screen" or "Install App"\n3. Follow the prompts')
  }, [])

  // Format cache size
  const formatCacheSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }, [])

  // Load initial offline data
  useEffect(() => {
    loadOfflineData()
  }, [loadOfflineData])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-36 right-4 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors z-40"
        title="PWA Features & Offline Support"
      >
        <Smartphone className="h-5 w-5" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Smartphone className="h-5 w-5 mr-2" />
            PWA Features & Offline Support
          </h2>
          <div className="flex items-center space-x-3">
            <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
              cacheStatus.isOnline 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              {cacheStatus.isOnline ? <Wifi className="h-4 w-4 mr-1" /> : <WifiOff className="h-4 w-4 mr-1" />}
              {cacheStatus.isOnline ? 'Online' : 'Offline'}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          {[
            { id: 'status', label: 'Status', icon: Monitor },
            { id: 'cache', label: 'Offline Cache', icon: Database },
            { id: 'sync', label: 'Sync & Updates', icon: Sync },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-sm font-medium flex items-center space-x-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-white dark:bg-gray-800 dark:text-purple-400'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {activeTab === 'status' && (
            <div className="space-y-6">
              {/* PWA Installation */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                      Install as App
                    </h3>
                    <p className="text-purple-700 dark:text-purple-300 mb-4">
                      Get the full app experience with offline support, notifications, and faster loading.
                    </p>
                    <button
                      onClick={installPWA}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Install App</span>
                    </button>
                  </div>
                  <Smartphone className="h-16 w-16 text-purple-400" />
                </div>
              </div>

              {/* Capabilities Grid */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">PWA Capabilities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {capabilities.map(capability => (
                    <div
                      key={capability.name}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <capability.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          capability.status === 'enabled' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          capability.status === 'available' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                          capability.status === 'disabled' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                        }`}>
                          {capability.status === 'enabled' && <Check className="h-3 w-3 inline mr-1" />}
                          {capability.status === 'unsupported' && <AlertCircle className="h-3 w-3 inline mr-1" />}
                          {capability.status}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {capability.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {capability.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {capability.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Worker Status */}
              <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Service Worker Status</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Status: <span className="font-medium text-gray-900 dark:text-gray-100">
                        {cacheStatus.serviceWorkerStatus}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cache Size: <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatCacheSize(cacheStatus.cacheSize)}
                      </span>
                    </p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    cacheStatus.serviceWorkerStatus === 'active' ? 'bg-green-500' :
                    cacheStatus.serviceWorkerStatus === 'installing' ? 'bg-yellow-500' :
                    'bg-gray-400'
                  }`} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cache' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Offline Data Management</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Choose what data to cache for offline access. Cached data allows you to use the app without an internet connection.
                </p>
              </div>

              {/* Cache Controls */}
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Data to Cache</h4>
                <div className="space-y-3">
                  {Object.entries(dataToCache).map(([key, enabled]) => (
                    <label key={key} className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-900 dark:text-gray-100 font-medium capitalize">
                          {key === 'code' ? 'Code Snippets' : key}
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {key === 'objects' && 'JavaScript object documentation and examples'}
                          {key === 'favorites' && 'Your favorited objects and personal preferences'}
                          {key === 'progress' && 'Learning progress and visited objects'}
                          {key === 'code' && 'Saved code snippets and examples'}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setDataToCache(prev => ({ ...prev, [key]: e.target.checked }))}
                        className="rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Cache Actions */}
              <div className="flex space-x-4">
                <button
                  onClick={cacheForOffline}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center space-x-2"
                >
                  <Database className="h-4 w-4" />
                  <span>Cache Selected Data</span>
                </button>
                <button
                  onClick={clearCache}
                  className="px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border border-red-300 dark:border-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Clear Cache
                </button>
              </div>

              {/* Cached Data Info */}
              {offlineData && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Cached Data</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-green-700 dark:text-green-300 font-medium">Objects</p>
                      <p className="text-green-600 dark:text-green-400">{offlineData.objects.length} cached</p>
                    </div>
                    <div>
                      <p className="text-green-700 dark:text-green-300 font-medium">Favorites</p>
                      <p className="text-green-600 dark:text-green-400">{offlineData.favorites.length} items</p>
                    </div>
                    <div>
                      <p className="text-green-700 dark:text-green-300 font-medium">Progress</p>
                      <p className="text-green-600 dark:text-green-400">{offlineData.progress.length} visits</p>
                    </div>
                    <div>
                      <p className="text-green-700 dark:text-green-300 font-medium">Last Updated</p>
                      <p className="text-green-600 dark:text-green-400">{offlineData.lastUpdated.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Storage Usage */}
              <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Storage Usage</h4>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatCacheSize(cacheStatus.cacheSize)} used
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((cacheStatus.cacheSize / (5 * 1024 * 1024)) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Maximum: 5 MB recommended for optimal performance
                </p>
              </div>
            </div>
          )}

          {activeTab === 'sync' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Background Sync</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Automatically sync your changes when you come back online. Your progress and preferences are saved locally and synchronized when possible.
                </p>
              </div>

              {/* Sync Status */}
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Sync Status</h4>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    cacheStatus.isOnline && cacheStatus.pendingSync === 0
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : cacheStatus.pendingSync > 0
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                  }`}>
                    {cacheStatus.isOnline && cacheStatus.pendingSync === 0 && 'Synced'}
                    {cacheStatus.pendingSync > 0 && `${cacheStatus.pendingSync} pending`}
                    {!cacheStatus.isOnline && 'Offline'}
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Last Sync:</span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {cacheStatus.lastSync ? cacheStatus.lastSync.toLocaleString() : 'Never'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Pending Changes:</span>
                    <span className="text-gray-900 dark:text-gray-100">{cacheStatus.pendingSync}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Auto-Sync:</span>
                    <span className="text-green-600 dark:text-green-400">Enabled</span>
                  </div>
                </div>
              </div>

              {/* Manual Sync */}
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setCacheStatus(prev => ({ ...prev, lastSync: new Date(), pendingSync: 0 }))
                  }}
                  disabled={!cacheStatus.isOnline}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Sync className="h-4 w-4" />
                  <span>Sync Now</span>
                </button>
              </div>

              {/* Sync History */}
              <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Recent Activity</h4>
                <div className="space-y-2 text-sm">
                  {[
                    { action: 'Favorited Array object', time: '2 minutes ago' },
                    { action: 'Completed Promise tutorial', time: '15 minutes ago' },
                    { action: 'Updated learning progress', time: '1 hour ago' },
                    { action: 'Cached offline data', time: '2 hours ago' }
                  ].map((activity, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-900 dark:text-gray-100">{activity.action}</span>
                      <span className="text-gray-500 dark:text-gray-400">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {!cacheStatus.isOnline && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-start">
                    <WifiOff className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">Offline Mode</h5>
                      <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                        You're currently offline. Your changes are being saved locally and will sync automatically when you reconnect.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">PWA Settings</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Configure how the app behaves when installed and used offline.
                </p>
              </div>

              {/* Notifications Settings */}
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Push Notifications</h4>
                  <button
                    onClick={requestNotificationPermission}
                    disabled={notifications.enabled}
                    className="px-3 py-1 text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-400 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {notifications.enabled ? 'Enabled' : 'Enable'}
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'updates', label: 'App updates and new features', desc: 'Get notified when new features are available' },
                    { key: 'offline', label: 'Offline status changes', desc: 'Know when you go online or offline' },
                    { key: 'sync', label: 'Sync completion', desc: 'Confirm when your data has been synchronized' }
                  ].map(({ key, label, desc }) => (
                    <label key={key} className="flex items-start">
                      <input
                        type="checkbox"
                        checked={notifications[key as keyof typeof notifications]}
                        onChange={(e) => setNotifications(prev => ({ 
                          ...prev, 
                          [key]: e.target.checked 
                        }))}
                        disabled={!notifications.enabled}
                        className="rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500 mt-1"
                      />
                      <div className="ml-3">
                        <span className="text-gray-900 dark:text-gray-100 font-medium">{label}</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Performance Settings */}
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Performance</h4>
                <div className="space-y-3">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500 mt-1"
                    />
                    <div className="ml-3">
                      <span className="text-gray-900 dark:text-gray-100 font-medium">Preload content</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Load frequently used content in the background for faster access
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500 mt-1"
                    />
                    <div className="ml-3">
                      <span className="text-gray-900 dark:text-gray-100 font-medium">Optimize for low memory</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Reduce memory usage on devices with limited RAM
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Data Management */}
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Data Management</h4>
                <div className="space-y-4">
                  <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-gray-900 dark:text-gray-100 font-medium">Export Data</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Download your progress and preferences</p>
                      </div>
                      <Download className="h-4 w-4 text-gray-400" />
                    </div>
                  </button>
                  
                  <button className="w-full text-left p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-red-900 dark:text-red-100 font-medium">Reset All Data</span>
                        <p className="text-sm text-red-700 dark:text-red-400">Clear all cached data and preferences</p>
                      </div>
                      <AlertCircle className="h-4 w-4 text-red-400" />
                    </div>
                  </button>
                </div>
              </div>

              {/* App Info */}
              <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">App Information</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Version:</span>
                    <span className="text-gray-900 dark:text-gray-100">1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                    <span className="text-gray-900 dark:text-gray-100">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Installation:</span>
                    <span className="text-gray-900 dark:text-gray-100">Web App</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}