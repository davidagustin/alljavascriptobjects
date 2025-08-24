'use client'

import { useState, useEffect, useMemo } from 'react'
import { BarChart3, TrendingUp, Clock, Target, Trophy, Activity, Download, RefreshCw } from 'lucide-react'
import { usePerformanceTracking } from '../utils/performance'
import { useApp } from '../contexts/AppContext'
import { getAllObjects, getObjectsByDifficulty } from '../constants/objects'

interface AnalyticsData {
  totalObjects: number
  visitedObjects: number
  favoriteObjects: number
  sessionDuration: number
  searchQueries: number
  objectsViewed: string[]
  topCategories: Array<{ name: string; count: number }>
  difficultyProgress: Record<string, { total: number; visited: number; percentage: number }>
  recentActivity: Array<{ type: string; object: string; timestamp: number }>
}

export default function AnalyticsDashboard() {
  const [isVisible, setIsVisible] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const { getMetrics, exportData, clearData } = usePerformanceTracking()
  const { visitedObjects, favorites, getProgress } = useApp()
  const { percentage } = getProgress()

  const analyticsData = useMemo((): AnalyticsData => {
    const metrics = getMetrics()
    const allObjects = getAllObjects()
    
    // Calculate category statistics
    const categoryCounts: Record<string, number> = {}
    visitedObjects.forEach(obj => {
      const category = getObjectCategory(obj)
      if (category) {
        categoryCounts[category.name] = (categoryCounts[category.name] || 0) + 1
      }
    })
    
    const topCategories = Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
    
    // Calculate difficulty progress
    const difficulties = ['beginner', 'intermediate', 'advanced'] as const
    const difficultyProgress: Record<string, { total: number; visited: number; percentage: number }> = {}
    
    difficulties.forEach(difficulty => {
      const objectsInDifficulty = getObjectsByDifficulty(difficulty)
      const visitedInDifficulty = objectsInDifficulty.filter(obj => visitedObjects.includes(obj))
      
      difficultyProgress[difficulty] = {
        total: objectsInDifficulty.length,
        visited: visitedInDifficulty.length,
        percentage: Math.round((visitedInDifficulty.length / objectsInDifficulty.length) * 100)
      }
    })
    
    // Generate recent activity from performance metrics
    const recentActivity = metrics.objectsViewed.slice(-10).map(obj => ({
      type: 'view',
      object: obj,
      timestamp: Date.now() - Math.random() * 86400000 // Random time in last 24 hours
    }))
    
    return {
      totalObjects: allObjects.length,
      visitedObjects: visitedObjects.length,
      favoriteObjects: favorites.length,
      sessionDuration: metrics.sessionDuration,
      searchQueries: metrics.searchQueries.length,
      objectsViewed: metrics.objectsViewed,
      topCategories,
      difficultyProgress,
      recentActivity
    }
  }, [getMetrics, visitedObjects, favorites])

  const handleExport = () => {
    const data = exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all analytics data? This action cannot be undone.')) {
      clearData()
      setRefreshKey(prev => prev + 1)
    }
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors z-40"
        title="Analytics Dashboard"
      >
        <BarChart3 className="h-5 w-5" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-[95vw] sm:max-w-2xl lg:max-w-4xl xl:max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Learning Analytics Dashboard
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Refresh data"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={handleExport}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Export data"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Overview Cards */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Overview
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Progress</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {percentage}%
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 dark:text-green-400">Visited</p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                        {analyticsData.visitedObjects}
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-green-500" />
                  </div>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">Favorites</p>
                      <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                        {analyticsData.favoriteObjects}
                      </p>
                    </div>
                    <Trophy className="h-8 w-8 text-yellow-500" />
                  </div>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 dark:text-purple-400">Session</p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {Math.round(analyticsData.sessionDuration / 60000)}m
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Difficulty Progress */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Progress by Difficulty
              </h3>
              
              <div className="space-y-4">
                {Object.entries(analyticsData.difficultyProgress).map(([difficulty, data]) => (
                  <div key={difficulty} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {difficulty}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {data.visited}/{data.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${data.percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {data.percentage}% complete
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Categories */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Most Explored Categories
              </h3>
              
              <div className="space-y-3">
                {analyticsData.topCategories.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {category.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Recent Activity
              </h3>
              
              <div className="space-y-2">
                {analyticsData.recentActivity.slice(-5).map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Activity className="h-4 w-4 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Viewed <span className="font-medium">{activity.object}</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Search Analytics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Search Activity
              </h3>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Searches</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {analyticsData.searchQueries}
                  </span>
                </div>
                
                {analyticsData.searchQueries > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Average searches per session: {Math.round(analyticsData.searchQueries / Math.max(1, Math.round(analyticsData.sessionDuration / 60000)) * 60)}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No search activity yet
                  </p>
                )}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Performance
              </h3>
              
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Page Load Time</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {Math.round(analyticsData.sessionDuration / 1000)}s
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Session Duration</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {Math.round(analyticsData.sessionDuration / 60000)}m {Math.round((analyticsData.sessionDuration % 60000) / 1000)}s
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {new Date().toLocaleString()}
              </p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleClear}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                >
                  Clear Data
                </button>
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getObjectCategory(objectName: string): { name: string } | null {
  const categories = {
    'Fundamental': ['Object', 'Function', 'Boolean', 'Symbol', 'undefined', 'globalThis'],
    'Numbers & Math': ['Number', 'BigInt', 'Math', 'NaN', 'Infinity', 'isFinite()', 'isNaN()', 'parseFloat()', 'parseInt()'],
    'Text': ['String', 'RegExp', 'encodeURI()', 'decodeURI()', 'encodeURIComponent()', 'decodeURIComponent()', 'escape()', 'unescape()'],
    'Collections': ['Array', 'Map', 'Set', 'WeakMap', 'WeakSet', 'WeakRef'],
    'Typed Arrays': ['ArrayBuffer', 'SharedArrayBuffer', 'DataView', 'TypedArray', 'Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array', 'BigInt64Array', 'BigUint64Array', 'Float16Array'],
    'Errors': ['Error', 'AggregateError', 'EvalError', 'RangeError', 'ReferenceError', 'SyntaxError', 'TypeError', 'URIError', 'InternalError', 'SuppressedError'],
    'Control Flow': ['Promise', 'AsyncFunction', 'Generator', 'GeneratorFunction', 'AsyncGenerator', 'AsyncGeneratorFunction', 'Iterator', 'AsyncIterator'],
    'Memory Management': ['FinalizationRegistry', 'DisposableStack', 'AsyncDisposableStack'],
    'Meta Programming': ['Proxy', 'Reflect'],
    'Internationalization': ['Intl', 'Date', 'Temporal'],
    'Data Processing': ['JSON', 'Atomics'],
    'Global Functions': ['eval()']
  }
  
  for (const [name, objects] of Object.entries(categories)) {
    if (objects.includes(objectName)) {
      return { name }
    }
  }
  
  return null
}
