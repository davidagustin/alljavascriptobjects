'use client'

import { useEffect, useState } from 'react'
import { Command } from 'lucide-react'

export default function KeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false)
  const [lastKey, setLastKey] = useState('')
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show/hide help
      if (e.key === '?' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setShowHelp(prev => !prev)
        return
      }
      
      // Global shortcuts
      if (!e.metaKey && !e.ctrlKey) {
        switch(e.key) {
          case '/':
            // Focus search if not already in an input
            if (document.activeElement?.tagName !== 'INPUT') {
              e.preventDefault()
              const searchInput = document.querySelector('input[type="search"], input[placeholder*="Search"]') as HTMLInputElement
              searchInput?.focus()
            }
            break
          case 'g':
            // Go to navigation
            if (lastKey === 'g') {
              e.preventDefault()
              const nav = document.querySelector('[role="navigation"]') as HTMLElement
              nav?.focus()
              setLastKey('')
            } else {
              setLastKey('g')
              setTimeout(() => setLastKey(''), 1000)
            }
            break
          case 'h':
            // Go home
            if (lastKey === 'g') {
              e.preventDefault()
              const homeLink = document.querySelector('a[href="/"], button[aria-label*="Home"]') as HTMLElement
              homeLink?.click()
              setLastKey('')
            }
            break
          case 'f':
            // Toggle favorites
            if (lastKey === 'g') {
              e.preventDefault()
              const favButton = document.querySelector('button[aria-label*="favorite"]') as HTMLElement
              favButton?.click()
              setLastKey('')
            }
            break
        }
      }
      
      // Navigation with arrow keys
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const activeElement = document.activeElement
        const navigationContainer = activeElement?.closest('[role="navigation"]')
        
        if (navigationContainer) {
          e.preventDefault()
          const buttons = Array.from(navigationContainer.querySelectorAll('button:not([disabled])'))
          const currentIndex = buttons.indexOf(activeElement as HTMLButtonElement)
          
          let nextIndex
          if (e.key === 'ArrowDown') {
            nextIndex = currentIndex === -1 ? 0 : Math.min(currentIndex + 1, buttons.length - 1)
          } else {
            nextIndex = currentIndex === -1 ? buttons.length - 1 : Math.max(currentIndex - 1, 0)
          }
          
          (buttons[nextIndex] as HTMLElement)?.focus()
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lastKey])
  
  // Auto-hide help after 5 seconds
  useEffect(() => {
    if (showHelp) {
      const timer = setTimeout(() => setShowHelp(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showHelp])
  
  if (!showHelp) return null
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 max-w-sm animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">Keyboard Shortcuts</h3>
        <button
          onClick={() => setShowHelp(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Close help"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Search</span>
          <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">/</kbd>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Navigate</span>
          <div className="space-x-1">
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">↑</kbd>
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">↓</kbd>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Go to nav</span>
          <div className="space-x-1">
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">g</kbd>
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">g</kbd>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Go home</span>
          <div className="space-x-1">
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">g</kbd>
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">h</kbd>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Toggle help</span>
          <div className="space-x-1">
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
              <Command className="inline h-3 w-3" />
            </kbd>
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">?</kbd>
          </div>
        </div>
      </div>
    </div>
  )
}