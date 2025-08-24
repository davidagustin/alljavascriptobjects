'use client'

import { useState, useEffect } from 'react'
import { Keyboard, X, Command } from 'lucide-react'

interface Shortcut {
  key: string
  description: string
  modifier?: 'ctrl' | 'cmd'
}

const shortcuts: Shortcut[] = [
  { key: 'K', description: 'Focus search', modifier: 'ctrl' },
  { key: 'Escape', description: 'Clear search' },
  { key: 'Enter', description: 'Run code' },
  { key: 'S', description: 'Save code', modifier: 'ctrl' },
  { key: 'R', description: 'Reset code', modifier: 'ctrl' },
  { key: 'C', description: 'Copy code', modifier: 'ctrl' },
]

export default function KeyboardShortcuts() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setIsVisible(!isVisible)
      }
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-[95vw] sm:max-w-md lg:max-w-lg w-full max-h-[85vh] sm:max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Keyboard className="h-5 w-5 mr-2" />
            Keyboard Shortcuts
          </h2>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.key} className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {shortcut.description}
              </span>
              <div className="flex items-center space-x-1">
                {shortcut.modifier && (
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                    {isMac ? <Command className="h-3 w-3" /> : 'Ctrl'}
                  </kbd>
                )}
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                  {shortcut.key}
                </kbd>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Press <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
              {isMac ? '⌘' : 'Ctrl'}+?
            </kbd> to toggle this help
          </p>
        </div>
      </div>
    </div>
  )
}
