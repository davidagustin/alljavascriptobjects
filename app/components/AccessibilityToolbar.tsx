'use client'

import { useState, useEffect } from 'react'
import { Eye, Type, Palette, Volume2, Moon, Sun, Zap, Settings2, X } from 'lucide-react'

export default function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState(100)
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [screenReader, setScreenReader] = useState(false)
  const [focusIndicator, setFocusIndicator] = useState(true)
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  
  // Load preferences from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const savedFontSize = localStorage.getItem('a11y-font-size')
    const savedHighContrast = localStorage.getItem('a11y-high-contrast')
    const savedReducedMotion = localStorage.getItem('a11y-reduced-motion')
    const savedFocusIndicator = localStorage.getItem('a11y-focus-indicator')
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
    
    if (savedFontSize) setFontSize(parseInt(savedFontSize))
    if (savedHighContrast) setHighContrast(savedHighContrast === 'true')
    if (savedReducedMotion) setReducedMotion(savedReducedMotion === 'true')
    if (savedFocusIndicator) setFocusIndicator(savedFocusIndicator === 'true')
    if (savedTheme) setTheme(savedTheme)
    
    // Check system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) setReducedMotion(true)
  }, [])
  
  // Apply font size
  useEffect(() => {
    if (typeof window === 'undefined') return
    document.documentElement.style.fontSize = `${fontSize}%`
    localStorage.setItem('a11y-font-size', fontSize.toString())
  }, [fontSize])
  
  // Apply high contrast
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    if (highContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
    localStorage.setItem('a11y-high-contrast', highContrast.toString())
  }, [highContrast])
  
  // Apply reduced motion
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion')
    } else {
      document.documentElement.classList.remove('reduce-motion')
    }
    localStorage.setItem('a11y-reduced-motion', reducedMotion.toString())
  }, [reducedMotion])
  
  // Apply focus indicator
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    if (focusIndicator) {
      document.documentElement.classList.add('focus-visible')
    } else {
      document.documentElement.classList.remove('focus-visible')
    }
    localStorage.setItem('a11y-focus-indicator', focusIndicator.toString())
  }, [focusIndicator])
  
  // Apply theme
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const root = document.documentElement
    
    if (theme === 'dark') {
      root.classList.add('dark')
    } else if (theme === 'light') {
      root.classList.remove('dark')
    } else {
      // System theme
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (isDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
    
    localStorage.setItem('theme', theme)
  }, [theme])
  
  const resetSettings = () => {
    setFontSize(100)
    setHighContrast(false)
    setReducedMotion(false)
    setScreenReader(false)
    setFocusIndicator(true)
    setTheme('system')
  }
  
  // Announce changes for screen readers
  const announce = (message: string) => {
    if (typeof window === 'undefined') return
    
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', 'polite')
    announcement.className = 'sr-only'
    announcement.textContent = message
    document.body.appendChild(announcement)
    setTimeout(() => document.body.removeChild(announcement), 1000)
  }
  
  return (
    <>
      {/* Accessibility Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 w-12 h-12 bg-gray-800 dark:bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        aria-label="Open accessibility settings"
      >
        <Eye className="h-5 w-5" />
      </button>
      
      {/* Accessibility Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[85vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <Settings2 className="h-5 w-5 mr-2" />
                Accessibility Settings
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close accessibility settings"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Settings */}
            <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
              {/* Font Size */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Type className="h-4 w-4 mr-2" />
                  Font Size: {fontSize}%
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setFontSize(Math.max(50, fontSize - 10))
                      announce(`Font size decreased to ${fontSize - 10}%`)
                    }}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Decrease font size"
                  >
                    A-
                  </button>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    step="10"
                    value={fontSize}
                    onChange={(e) => {
                      const value = parseInt(e.target.value)
                      setFontSize(value)
                      announce(`Font size set to ${value}%`)
                    }}
                    className="flex-1"
                    aria-label="Font size slider"
                  />
                  <button
                    onClick={() => {
                      setFontSize(Math.min(200, fontSize + 10))
                      announce(`Font size increased to ${fontSize + 10}%`)
                    }}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Increase font size"
                  >
                    A+
                  </button>
                </div>
              </div>
              
              {/* Theme */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Palette className="h-4 w-4 mr-2" />
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setTheme('light')
                      announce('Light theme activated')
                    }}
                    className={`flex items-center justify-center px-3 py-2 rounded-lg transition-colors ${
                      theme === 'light'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Sun className="h-4 w-4 mr-1" />
                    Light
                  </button>
                  <button
                    onClick={() => {
                      setTheme('dark')
                      announce('Dark theme activated')
                    }}
                    className={`flex items-center justify-center px-3 py-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Moon className="h-4 w-4 mr-1" />
                    Dark
                  </button>
                  <button
                    onClick={() => {
                      setTheme('system')
                      announce('System theme activated')
                    }}
                    className={`flex items-center justify-center px-3 py-2 rounded-lg transition-colors ${
                      theme === 'system'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Settings2 className="h-4 w-4 mr-1" />
                    Auto
                  </button>
                </div>
              </div>
              
              {/* Toggle Settings */}
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Palette className="h-4 w-4 mr-2" />
                    High Contrast
                  </span>
                  <button
                    onClick={() => {
                      setHighContrast(!highContrast)
                      announce(highContrast ? 'High contrast disabled' : 'High contrast enabled')
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      highContrast ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    role="switch"
                    aria-checked={highContrast}
                    aria-label="Toggle high contrast"
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      highContrast ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Zap className="h-4 w-4 mr-2" />
                    Reduced Motion
                  </span>
                  <button
                    onClick={() => {
                      setReducedMotion(!reducedMotion)
                      announce(reducedMotion ? 'Animations enabled' : 'Animations disabled')
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      reducedMotion ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    role="switch"
                    aria-checked={reducedMotion}
                    aria-label="Toggle reduced motion"
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      reducedMotion ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Eye className="h-4 w-4 mr-2" />
                    Focus Indicators
                  </span>
                  <button
                    onClick={() => {
                      setFocusIndicator(!focusIndicator)
                      announce(focusIndicator ? 'Focus indicators disabled' : 'Focus indicators enabled')
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      focusIndicator ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    role="switch"
                    aria-checked={focusIndicator}
                    aria-label="Toggle focus indicators"
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      focusIndicator ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </label>
              </div>
              
              {/* Keyboard Shortcuts Info */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Keyboard Shortcuts
                </h3>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• <kbd>Alt + A</kbd> - Open accessibility panel</li>
                  <li>• <kbd>Alt + +</kbd> - Increase font size</li>
                  <li>• <kbd>Alt + -</kbd> - Decrease font size</li>
                  <li>• <kbd>Alt + C</kbd> - Toggle high contrast</li>
                  <li>• <kbd>Tab</kbd> - Navigate elements</li>
                </ul>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <button
                onClick={resetSettings}
                className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Screen reader announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        JavaScript Objects Tutorial - Accessibility features available
      </div>
    </>
  )
}