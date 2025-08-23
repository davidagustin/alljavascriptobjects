'use client'

import { useState, useEffect } from 'react'
import { Download, X, Smartphone, Monitor } from 'lucide-react'

interface PWAInstallButtonProps {
  showPromoBanner?: boolean
}

export default function PWAInstallButton({ showPromoBanner = false }: PWAInstallButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
      
      // Show banner after a delay if enabled
      if (showPromoBanner) {
        setTimeout(() => setShowBanner(true), 5000)
      }
    }

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallButton(false)
      setShowBanner(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [showPromoBanner])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }
    
    setDeferredPrompt(null)
    setShowInstallButton(false)
    setShowBanner(false)
  }

  const dismissBanner = () => {
    setShowBanner(false)
    localStorage.setItem('pwa-banner-dismissed', 'true')
  }

  // Don't show if already installed or banner was dismissed
  if (isInstalled || (!showInstallButton && !showBanner)) {
    return null
  }

  return (
    <>
      {/* Install Button in Header */}
      {showInstallButton && (
        <button
          onClick={handleInstallClick}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          title="Install JavaScript Objects Tutorial"
        >
          <Download className="h-4 w-4 mr-2" />
          Install
        </button>
      )}

      {/* Promo Banner */}
      {showBanner && showPromoBanner && (
        <div className="fixed bottom-4 left-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50 max-w-sm mx-auto">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Install JavaScript Objects Tutorial
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Get quick access to all JavaScript objects with offline support
              </p>
              <div className="flex items-center space-x-2 mt-3">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Install App
                </button>
                <button
                  onClick={dismissBanner}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Utility component for settings/about page
export function PWAStatus() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [cacheInfo, setCacheInfo] = useState<any>(null)

  useEffect(() => {
    // Check install status
    const checkInstallStatus = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
      } else if ((window.navigator as any).standalone === true) {
        setIsInstalled(true)
      }
    }

    // Get cache information
    const getCacheInfo = () => {
      const stored = localStorage.getItem('cacheStatus')
      if (stored) {
        try {
          setCacheInfo(JSON.parse(stored))
        } catch (error) {
          console.error('Error parsing cache status:', error)
        }
      }
    }

    checkInstallStatus()
    getCacheInfo()
  }, [])

  return (
    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        PWA Status
      </h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Installed:</span>
          <span className={isInstalled ? 'text-green-600' : 'text-gray-600'}>
            {isInstalled ? 'Yes' : 'No'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Service Worker:</span>
          <span className={navigator.serviceWorker ? 'text-green-600' : 'text-red-600'}>
            {navigator.serviceWorker ? 'Supported' : 'Not Supported'}
          </span>
        </div>
        
        {cacheInfo && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Cached Items:</span>
            <span className="text-blue-600">
              {Object.values(cacheInfo.status).reduce((a: any, b: any) => a + b, 0)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}