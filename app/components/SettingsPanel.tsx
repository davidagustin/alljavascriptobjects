'use client'

import { useState } from 'react'
import { Settings, X, Trash2, Download, Upload } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { clearFavorites, clearVisited } = useApp()
  const [confirmClear, setConfirmClear] = useState(false)

  const handleClearData = () => {
    clearFavorites()
    clearVisited()
    setConfirmClear(false)
  }

  const exportData = () => {
    if (typeof window === 'undefined') return
    
    let favorites = []
    let visited = []
    let theme = 'system'
    
    try {
      favorites = JSON.parse(localStorage.getItem('jsObjectsFavorites') || '[]')
    } catch (error) {
      console.warn('Failed to parse favorites:', error)
    }
    
    try {
      visited = JSON.parse(localStorage.getItem('jsObjectsVisited') || '[]')
    } catch (error) {
      console.warn('Failed to parse visited:', error)
    }
    
    try {
      theme = localStorage.getItem('theme') || 'system'
    } catch (error) {
      console.warn('Failed to get theme:', error)
    }
    
    const data = {
      favorites,
      visited,
      theme,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `js-objects-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || typeof window === 'undefined') return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const result = e.target?.result
        if (typeof result !== 'string') {
          throw new Error('Invalid file content')
        }
        
        const data = JSON.parse(result)
        
        if (data.favorites && Array.isArray(data.favorites)) {
          localStorage.setItem('jsObjectsFavorites', JSON.stringify(data.favorites))
        }
        if (data.visited && Array.isArray(data.visited)) {
          localStorage.setItem('jsObjectsVisited', JSON.stringify(data.visited))
        }
        if (data.theme && typeof data.theme === 'string') {
          localStorage.setItem('theme', data.theme)
        }
        
        // Reload the page to apply changes
        window.location.reload()
      } catch (error) {
        console.error('Failed to import data:', error)
        alert('Invalid data file. Please check the file format.')
      }
    }
    
    reader.onerror = () => {
      console.error('Failed to read file')
      alert('Failed to read the file.')
    }
    
    reader.readAsText(file)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-[95vw] sm:max-w-md w-full max-h-[85vh] sm:max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {/* Data Management */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Data Management
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={exportData}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </button>
              
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                </button>
              </div>
            </div>
          </div>

          {/* Reset Options */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Reset Options
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={() => setConfirmClear(true)}
                className="w-full flex items-center justify-center px-4 py-2 border border-red-300 dark:border-red-600 rounded-md text-sm font-medium text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </button>
              
              {confirmClear && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                    Are you sure you want to clear all your data? This action cannot be undone.
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleClearData}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      Yes, Clear All
                    </button>
                    <button
                      onClick={() => setConfirmClear(false)}
                      className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              About
            </h3>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p>JavaScript Objects Tutorial</p>
              <p>Version: 1.0.0</p>
              <p>A comprehensive tutorial covering all JavaScript objects with interactive examples.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
