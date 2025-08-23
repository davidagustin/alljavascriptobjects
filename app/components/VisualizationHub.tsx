'use client'

import { useState, useCallback } from 'react'
import { BarChart3, Network, Activity, Eye, Download, Share2 } from 'lucide-react'
import DataVisualization from './DataVisualization'
import ObjectGraph from './ObjectGraph'
import { usePerformanceTracking } from '../utils/performance'

interface VisualizationHubProps {
  selectedObject?: string
  className?: string
}

export default function VisualizationHub({ 
  selectedObject = 'Object', 
  className = '' 
}: VisualizationHubProps) {
  const [activeView, setActiveView] = useState<'charts' | 'graph' | 'insights'>('charts')
  const { trackInteraction } = usePerformanceTracking()

  const handleViewChange = useCallback((view: typeof activeView) => {
    setActiveView(view)
    trackInteraction('visualization_hub_view', view, { selectedObject })
  }, [selectedObject, trackInteraction])

  const handleExport = useCallback(() => {
    trackInteraction('visualization_export', activeView)
    // In a real app, this would implement export functionality
    alert('Export functionality would be implemented here')
  }, [activeView, trackInteraction])

  const handleShare = useCallback(() => {
    trackInteraction('visualization_share', activeView)
    // In a real app, this would implement sharing functionality
    alert('Share functionality would be implemented here')
  }, [activeView, trackInteraction])

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
              <Activity className="h-6 w-6 mr-2 text-blue-500" />
              Learning Analytics
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Visualize your JavaScript learning journey and object relationships
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Export visualization"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Share visualization"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => handleViewChange('charts')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'charts'
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Data Charts</span>
          </button>
          <button
            onClick={() => handleViewChange('graph')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'graph'
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
            }`}
          >
            <Network className="h-4 w-4" />
            <span>Object Graph</span>
          </button>
          <button
            onClick={() => handleViewChange('insights')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'insights'
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
            }`}
          >
            <Eye className="h-4 w-4" />
            <span>Insights</span>
          </button>
        </div>
      </div>

      {/* Content based on active view */}
      {activeView === 'charts' && <DataVisualization />}
      
      {activeView === 'graph' && <ObjectGraph />}
      
      {activeView === 'insights' && (
        <div className="space-y-6">
          {/* Learning Insights */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Eye className="h-5 w-5 mr-2 text-purple-500" />
              Learning Insights & Recommendations
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Your Strengths</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-sm font-medium text-green-800 dark:text-green-300">
                      Fundamental Concepts
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                      You've mastered basic JavaScript objects like Object, Array, and String
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Consistent Learning
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Regular engagement with different object categories
                    </div>
                  </div>
                </div>
              </div>

              {/* Areas for Improvement */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Growth Opportunities</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                      Advanced Objects
                    </div>
                    <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                      Explore Proxy, Reflect, and meta-programming concepts
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-sm font-medium text-purple-800 dark:text-purple-300">
                      Typed Arrays
                    </div>
                    <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                      Learn about binary data handling and performance optimization
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personalized Learning Path */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Recommended Learning Path
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                  1
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    Complete Collections Mastery
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Focus on Map, Set, WeakMap, and WeakSet to understand different collection types
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">Map</span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">Set</span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">WeakMap</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-sm font-semibold text-purple-600 dark:text-purple-400">
                  2
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    Async Programming Deep Dive
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Master Promise, AsyncFunction, and Generator for modern JavaScript patterns
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">Promise</span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">AsyncFunction</span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">Generator</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center text-sm font-semibold text-red-600 dark:text-red-400">
                  3
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    Advanced Meta Programming
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Explore Proxy and Reflect for dynamic object manipulation and introspection
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">Proxy</span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">Reflect</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Study Tips */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Study Tips & Best Practices
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                  📚 Learning Strategies
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Practice with real-world examples</li>
                  <li>• Compare similar objects side-by-side</li>
                  <li>• Build small projects using new concepts</li>
                  <li>• Review fundamentals regularly</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                  🎯 Focus Areas
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Performance characteristics of each object</li>
                  <li>• When to use which data structure</li>
                  <li>• Browser compatibility considerations</li>
                  <li>• Modern ES6+ features and syntax</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}