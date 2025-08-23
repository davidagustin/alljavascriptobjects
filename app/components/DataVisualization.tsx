'use client'

import { useState, useMemo, useCallback } from 'react'
import { BarChart3, PieChart, Activity, TrendingUp, Users, Clock, Target } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { OBJECT_CATEGORIES, getAllObjects, getObjectsByDifficulty } from '../constants/objects'
import { usePerformanceTracking } from '../utils/performance'

interface ChartProps {
  data: any[]
  type: 'bar' | 'pie' | 'line' | 'progress'
  title: string
  className?: string
}

interface DataPoint {
  label: string
  value: number
  color: string
  percentage?: number
}

export default function DataVisualization() {
  const [activeView, setActiveView] = useState<'overview' | 'progress' | 'categories' | 'trends'>('overview')
  const { favorites, visitedObjects, totalObjects } = useApp()
  const { trackInteraction } = usePerformanceTracking()

  // Calculate visualization data
  const overviewData = useMemo(() => {
    const total = getAllObjects().length
    const visited = visitedObjects.length
    const favorited = favorites.length
    const remaining = total - visited

    return [
      { label: 'Visited', value: visited, color: '#10B981', percentage: Math.round((visited / total) * 100) },
      { label: 'Favorites', value: favorited, color: '#F59E0B', percentage: Math.round((favorited / total) * 100) },
      { label: 'Remaining', value: remaining, color: '#6B7280', percentage: Math.round((remaining / total) * 100) }
    ]
  }, [visitedObjects, favorites])

  const categoryData = useMemo(() => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316']
    return Object.entries(OBJECT_CATEGORIES).map(([name, category], index) => ({
      label: name,
      value: category.objects.length,
      color: colors[index % colors.length],
      difficulty: category.difficulty,
      icon: category.icon
    }))
  }, [])

  const difficultyData = useMemo(() => {
    return [
      { 
        label: 'Beginner', 
        value: getObjectsByDifficulty('beginner').length, 
        color: '#10B981',
        description: 'Essential objects for getting started'
      },
      { 
        label: 'Intermediate', 
        value: getObjectsByDifficulty('intermediate').length, 
        color: '#F59E0B',
        description: 'Objects for building complex applications'
      },
      { 
        label: 'Advanced', 
        value: getObjectsByDifficulty('advanced').length, 
        color: '#EF4444',
        description: 'Specialized objects for expert use'
      }
    ]
  }, [])

  const progressTrends = useMemo(() => {
    // Simulate weekly progress data
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
    return weeks.map((week, index) => ({
      label: week,
      visited: Math.floor(visitedObjects.length * ((index + 1) / weeks.length)),
      favorites: Math.floor(favorites.length * ((index + 1) / weeks.length)),
    }))
  }, [visitedObjects, favorites])

  const handleViewChange = useCallback((view: typeof activeView) => {
    setActiveView(view)
    trackInteraction('visualization_view', view)
  }, [trackInteraction])

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => handleViewChange('overview')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeView === 'overview'
              ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>Overview</span>
        </button>
        <button
          onClick={() => handleViewChange('categories')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeView === 'categories'
              ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Categories</span>
        </button>
        <button
          onClick={() => handleViewChange('progress')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeView === 'progress'
              ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
          }`}
        >
          <Target className="h-4 w-4" />
          <span>Progress</span>
        </button>
        <button
          onClick={() => handleViewChange('trends')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeView === 'trends'
              ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>Trends</span>
        </button>
      </div>

      {/* Content based on active view */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Learning Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              Learning Overview
            </h3>
            <div className="space-y-4">
              {overviewData.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.value}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({item.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Overall Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Overall Progress</span>
                <span>{Math.round((visitedObjects.length / getAllObjects().length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(visitedObjects.length / getAllObjects().length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Difficulty Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-green-500" />
              Difficulty Levels
            </h3>
            <div className="space-y-4">
              {difficultyData.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {item.label}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({item.value} objects)
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 ml-5">
                    {item.description}
                  </p>
                  <div className="ml-5">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="h-1.5 rounded-full transition-all duration-300"
                        style={{ 
                          backgroundColor: item.color,
                          width: `${(item.value / getAllObjects().length) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeView === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-purple-500" />
              Objects by Category
            </h3>
            <div className="space-y-3">
              {categoryData.map((category) => (
                <div key={category.label} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{category.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {category.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {category.difficulty} level
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-2 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {category.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Chart Representation */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-indigo-500" />
              Category Distribution
            </h3>
            <div className="relative w-full h-64">
              <SVGPieChart data={categoryData} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {categoryData.map((item) => (
                <div key={item.label} className="flex items-center space-x-1 text-xs">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.label} ({Math.round((item.value / getAllObjects().length) * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeView === 'progress' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-500" />
            Learning Progress Over Time
          </h3>
          <div className="space-y-6">
            {progressTrends.map((week, index) => (
              <div key={week.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {week.label}
                  </span>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>Visited: {week.visited}</span>
                    <span>Favorites: {week.favorites}</span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(week.visited / getAllObjects().length) * 100}%`,
                          transitionDelay: `${index * 100}ms`
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(week.favorites / getAllObjects().length) * 100}%`,
                          transitionDelay: `${index * 100 + 50}ms`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'trends' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Learning Trends & Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Math.round((visitedObjects.length / getAllObjects().length) * 100)}%
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Objects Explored</div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {favorites.length}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">Favorites Saved</div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {getAllObjects().length - visitedObjects.length}
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-300">Objects Remaining</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Simple SVG Pie Chart Component
function SVGPieChart({ data }: { data: any[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let cumulativePercentage = 0

  return (
    <svg width="100%" height="100%" viewBox="0 0 200 200" className="transform -rotate-90">
      <circle
        cx="100"
        cy="100"
        r="80"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-gray-200 dark:text-gray-600"
      />
      {data.map((item, index) => {
        const percentage = (item.value / total) * 100
        const strokeDasharray = `${percentage * 5.024} 502.4` // 2πr where r=80
        const strokeDashoffset = -cumulativePercentage * 5.024
        cumulativePercentage += percentage

        return (
          <circle
            key={index}
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke={item.color}
            strokeWidth="12"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000"
            style={{ transitionDelay: `${index * 100}ms` }}
          />
        )
      })}
    </svg>
  )
}