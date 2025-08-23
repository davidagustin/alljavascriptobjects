'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface AccessibilitySettings {
  reducedMotion: boolean
  highContrast: boolean
  screenReaderOptimized: boolean
  fontSize: 'small' | 'medium' | 'large' | 'extra-large'
  keyboardNavigation: boolean
  focusVisible: boolean
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSettings: (settings: Partial<AccessibilitySettings>) => void
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void
}

const defaultSettings: AccessibilitySettings = {
  reducedMotion: false,
  highContrast: false,
  screenReaderOptimized: false,
  fontSize: 'medium',
  keyboardNavigation: true,
  focusVisible: true
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)
  const [announcer, setAnnouncer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    // Detect user preferences
    const mediaQueries = {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
      highContrast: window.matchMedia('(prefers-contrast: high)'),
    }

    setSettings(prev => ({
      ...prev,
      reducedMotion: mediaQueries.reducedMotion.matches,
      highContrast: mediaQueries.highContrast.matches,
    }))

    // Listen for changes
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, reducedMotion: e.matches }))
    }

    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, highContrast: e.matches }))
    }

    mediaQueries.reducedMotion.addEventListener('change', handleReducedMotionChange)
    mediaQueries.highContrast.addEventListener('change', handleHighContrastChange)

    return () => {
      mediaQueries.reducedMotion.removeEventListener('change', handleReducedMotionChange)
      mediaQueries.highContrast.removeEventListener('change', handleHighContrastChange)
    }
  }, [])

  useEffect(() => {
    // Create screen reader announcer
    const announcerElement = document.createElement('div')
    announcerElement.setAttribute('aria-live', 'polite')
    announcerElement.setAttribute('aria-atomic', 'true')
    announcerElement.className = 'sr-only'
    announcerElement.id = 'screen-reader-announcer'
    document.body.appendChild(announcerElement)
    setAnnouncer(announcerElement)

    return () => {
      if (announcerElement.parentNode) {
        announcerElement.parentNode.removeChild(announcerElement)
      }
    }
  }, [])

  useEffect(() => {
    // Apply accessibility classes to document
    const classes = []
    
    if (settings.reducedMotion) classes.push('reduced-motion')
    if (settings.highContrast) classes.push('high-contrast')
    if (settings.screenReaderOptimized) classes.push('screen-reader-optimized')
    if (!settings.focusVisible) classes.push('no-focus-visible')
    
    classes.push(`font-size-${settings.fontSize}`)
    
    document.documentElement.className = classes.join(' ')
    
    // Set CSS custom properties for accessibility
    document.documentElement.style.setProperty(
      '--animation-duration', 
      settings.reducedMotion ? '0.01s' : '0.2s'
    )
    
    document.documentElement.style.setProperty(
      '--transition-duration', 
      settings.reducedMotion ? '0.01s' : '0.15s'
    )

  }, [settings])

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
    
    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify({ ...settings, ...newSettings }))
  }

  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announcer) {
      announcer.setAttribute('aria-live', priority)
      announcer.textContent = message
      
      // Clear after announcement
      setTimeout(() => {
        announcer.textContent = ''
      }, 1000)
    }
  }

  useEffect(() => {
    // Load saved settings
    try {
      const savedSettings = localStorage.getItem('accessibility-settings')
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsed }))
      }
    } catch (error) {
      console.warn('Failed to load accessibility settings:', error)
    }
  }, [])

  return (
    <AccessibilityContext.Provider 
      value={{ 
        settings, 
        updateSettings, 
        announceToScreenReader 
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}

// Utility hook for focus management
export function useFocusManagement() {
  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    
    const firstFocusable = focusableElements[0] as HTMLElement
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault()
            lastFocusable?.focus()
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault()
            firstFocusable?.focus()
          }
        }
      }
    }
    
    container.addEventListener('keydown', handleKeyDown)
    firstFocusable?.focus()
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }
  
  return { trapFocus }
}

// Component for skip links
export function SkipLinks() {
  const links = [
    { href: '#main-content', text: 'Skip to main content' },
    { href: '#navigation', text: 'Skip to navigation' },
    { href: '#search', text: 'Skip to search' }
  ]

  return (
    <div className="skip-links">
      {links.map(link => (
        <a
          key={link.href}
          href={link.href}
          className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-md focus:shadow-lg"
        >
          {link.text}
        </a>
      ))}
    </div>
  )
}