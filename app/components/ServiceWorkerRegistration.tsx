'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // Check if service workers are supported
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Register service worker
      registerServiceWorker()
    }
  }, [])

  async function registerServiceWorker() {
    try {
      // Register the service worker
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      console.log('Service Worker registered successfully:', registration)

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available, show update notification
              showUpdateNotification()
            }
          })
        }
      })

      // Handle messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('Message from service worker:', event.data)
        
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          // Show user that new content is available
          showCacheUpdateNotification()
        }
      })

      // Request persistent storage
      if ('storage' in navigator && 'persist' in navigator.storage) {
        const persistent = await navigator.storage.persist()
        console.log(`Persistent storage granted: ${persistent}`)
      }

      // Check cache status periodically
      setInterval(checkCacheStatus, 5 * 60 * 1000) // Every 5 minutes

    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }

  function showUpdateNotification() {
    // Create a subtle notification for updates
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300'
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <span class="text-sm">New version available!</span>
        <button onclick="this.parentElement.parentElement.remove(); window.location.reload()" 
                class="bg-white text-blue-600 px-2 py-1 rounded text-xs font-medium hover:bg-gray-100">
          Update
        </button>
        <button onclick="this.parentElement.parentElement.remove()" 
                class="text-white hover:text-gray-200">
          ×
        </button>
      </div>
    `
    
    document.body.appendChild(notification)

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove()
      }
    }, 10000)
  }

  function showCacheUpdateNotification() {
    // Subtle notification for cache updates
    const notification = document.createElement('div')
    notification.className = 'fixed bottom-4 left-4 bg-green-600 text-white px-3 py-2 rounded-lg shadow-lg z-50 text-sm'
    notification.textContent = 'Content cached for offline use'
    
    document.body.appendChild(notification)

    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove()
      }
    }, 3000)
  }

  async function checkCacheStatus() {
    if (navigator.serviceWorker.controller) {
      // Create message channel for response
      const messageChannel = new MessageChannel()
      
      messageChannel.port1.onmessage = (event) => {
        if (event.data.cacheStatus) {
          console.log('Cache status:', event.data.cacheStatus)
          // Store cache info for analytics or debugging
          localStorage.setItem('cacheStatus', JSON.stringify({
            status: event.data.cacheStatus,
            timestamp: Date.now()
          }))
        }
      }

      // Request cache status from service worker
      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_CACHE_STATUS' },
        [messageChannel.port2]
      )
    }
  }

  // Component doesn't render anything visible
  return null
}

// Utility function to manually cache a page
export function cacheObjectPage(url: string) {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_OBJECT_PAGE',
      url: url
    })
  }
}

// Utility function to clear all caches
export function clearAllCaches() {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CLEAR_CACHE'
    })
  }
}

// Hook for PWA install prompt
export function usePWAInstall() {
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      ;(window as { deferredPrompt: Event | null }).deferredPrompt = e
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const installPWA = async () => {
    const deferredPrompt = (window as { deferredPrompt: Event | null }).deferredPrompt
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response to install prompt: ${outcome}`)
      ;(window as { deferredPrompt: Event | null }).deferredPrompt = null
    }
  }

  return { installPWA }
}