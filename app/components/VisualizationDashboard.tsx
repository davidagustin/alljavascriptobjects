'use client'

import { useState, useMemo, useCallback } from 'react'
import { BarChart3, PieChart, TrendingUp, Target, Users, Clock, Zap, Award, Eye, Heart, Code, BookOpen, Filter, Download } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string[]
  }[]
}

interface LearningMetric {
  id: string
  title: string
  value: number | string
  change: number
  icon: React.ReactNode
  color: string
  description: string
}

interface ProgressData {
  date: string
  objectsLearned: number
  timeSpent: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export default function VisualizationDashboard() {
  const { visitedObjects, favorites, totalObjects } = useApp()
  const [selectedTimeframe, setSelectedTimeframe] = useState('week')
  const [selectedChart, setSelectedChart] = useState('overview')

  // Mock progress data (in real app, this would come from user activity tracking)
  const progressData: ProgressData[] = useMemo(() => [
    { date: '2024-01-01', objectsLearned: 3, timeSpent: 45, difficulty: 'beginner' },
    { date: '2024-01-02', objectsLearned: 5, timeSpent: 60, difficulty: 'beginner' },
    { date: '2024-01-03', objectsLearned: 2, timeSpent: 30, difficulty: 'intermediate' },
    { date: '2024-01-04', objectsLearned: 4, timeSpent: 75, difficulty: 'intermediate' },
    { date: '2024-01-05', objectsLearned: 6, timeSpent: 90, difficulty: 'intermediate' },
    { date: '2024-01-06', objectsLearned: 3, timeSpent: 50, difficulty: 'advanced' },
    { date: '2024-01-07', objectsLearned: 7, timeSpent: 120, difficulty: 'advanced' }
  ], [])

  // Calculate learning metrics
  const metrics: LearningMetric[] = useMemo(() => {
    const completionRate = (visitedObjects.length / totalObjects) * 100
    const favoriteRate = (favorites.length / visitedObjects.length) * 100 || 0
    const totalTimeSpent = progressData.reduce((sum, day) => sum + day.timeSpent, 0)
    const averageDaily = totalTimeSpent / progressData.length
    
    return [
      {
        id: 'completion',
        title: 'Completion Rate',
        value: `${Math.round(completionRate)}%`,
        change: 12,
        icon: <Target className="h-6 w-6" />,
        color: 'text-blue-600',
        description: 'Objects learned vs total available'
      },
      {
        id: 'favorites',
        title: 'Favorite Rate',
        value: `${Math.round(favoriteRate)}%`,
        change: 8,
        icon: <Heart className="h-6 w-6" />,
        color: 'text-red-500',
        description: 'Percentage of visited objects marked as favorites'
      },
      {
        id: 'daily-average',
        title: 'Daily Average',
        value: `${Math.round(averageDaily)}min`,
        change: -5,
        icon: <Clock className="h-6 w-6" />,
        color: 'text-green-600',
        description: 'Average learning time per day'
      },
      {
        id: 'streak',
        title: 'Learning Streak',
        value: '7 days',
        change: 15,
        icon: <Zap className="h-6 w-6" />,
        color: 'text-yellow-500',
        description: 'Consecutive days of learning activity'
      }
    ]
  }, [visitedObjects, favorites, totalObjects, progressData])

  // Category distribution data
  const categoryData: ChartData = useMemo(() => {
    const categories = {
      'Fundamental': 0,
      'Collections': 0,
      'Async': 0,
      'Text': 0,
      'Numbers': 0,
      'Errors': 0,
      'Advanced': 0
    }

    // Mock category mapping
    visitedObjects.forEach(obj => {
      if (['Object', 'Function', 'Boolean'].includes(obj)) {
        categories.Fundamental++
      } else if (['Array', 'Map', 'Set', 'WeakMap'].includes(obj)) {
        categories.Collections++
      } else if (['Promise', 'AsyncFunction', 'Generator'].includes(obj)) {
        categories.Async++
      } else if (['String', 'RegExp'].includes(obj)) {
        categories.Text++
      } else if (['Number', 'Math', 'BigInt'].includes(obj)) {
        categories.Numbers++
      } else if (obj.includes('Error')) {
        categories.Errors++
      } else {
        categories.Advanced++
      }
    })

    return {
      labels: Object.keys(categories),
      datasets: [{
        label: 'Objects Learned',
        data: Object.values(categories),
        backgroundColor: [
          '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
          '#8B5CF6', '#06B6D4', '#84CC16'
        ]
      }]
    }
  }, [visitedObjects])

  // Progress over time data
  const progressChartData: ChartData = useMemo(() => {
    return {
      labels: progressData.map(d => new Date(d.date).toLocaleDateString()),
      datasets: [
        {
          label: 'Objects Learned',
          data: progressData.map(d => d.objectsLearned),
          borderColor: '#3B82F6',
          backgroundColor: '#3B82F640'
        },
        {
          label: 'Time Spent (minutes)',
          data: progressData.map(d => d.timeSpent),
          borderColor: '#10B981',
          backgroundColor: '#10B98140'
        }
      ]
    }
  }, [progressData])

  // Difficulty distribution
  const difficultyData: ChartData = useMemo(() => {
    const difficulty = { beginner: 0, intermediate: 0, advanced: 0 }
    
    progressData.forEach(day => {
      difficulty[day.difficulty] += day.objectsLearned
    })

    return {
      labels: ['Beginner', 'Intermediate', 'Advanced'],
      datasets: [{
        label: 'Objects by Difficulty',
        data: Object.values(difficulty),
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444']
      }]
    }
  }, [progressData])

  // Simple chart component (in real app, would use a charting library)
  const SimpleBarChart = ({ data, title }: { data: ChartData; title: string }) => {
    const maxValue = Math.max(...data.datasets[0].data)
    
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
        <div className="space-y-3">
          {data.labels.map((label, index) => {
            const value = data.datasets[0].data[index]
            const percentage = (value / maxValue) * 100
            const color = data.datasets[0].backgroundColor?.[index] || '#3B82F6'
            
            return (
              <div key={label} className="flex items-center space-x-3">
                <div className="w-20 text-sm text-gray-600 dark:text-gray-400 truncate">
                  {label}
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative">
                  <div
                    className="h-4 rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: color
                    }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                    {value}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const SimpleLineChart = ({ data, title }: { data: ChartData; title: string }) => {
    const maxValue = Math.max(...data.datasets.flatMap(d => d.data))
    
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
        <div className="h-64 flex items-end space-x-2">
          {data.labels.map((label, index) => (
            <div key={label} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center space-y-1 mb-2">
                {data.datasets.map((dataset, datasetIndex) => {
                  const value = dataset.data[index]
                  const height = (value / maxValue) * 200
                  
                  return (
                    <div
                      key={datasetIndex}
                      className="w-8 rounded-t transition-all duration-500"
                      style={{
                        height: `${height}px`,
                        backgroundColor: dataset.borderColor
                      }}
                      title={`${dataset.label}: ${value}`}
                    />
                  )
                })}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                {label}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center space-x-6">
          {data.datasets.map((dataset, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: dataset.borderColor }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {dataset.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const exportData = useCallback(() => {
    const data = {
      metrics,
      categoryData,
      progressData,
      visitedObjects,
      favorites,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `learning-analytics-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [metrics, categoryData, progressData, visitedObjects, favorites])

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Learning Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your JavaScript learning progress and insights
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          
          <button
            onClick={exportData}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${metric.color.replace('text-', 'bg-').replace('600', '100')} dark:${metric.color.replace('text-', 'bg-').replace('600', '900')}`}>
                <div className={metric.color}>
                  {metric.icon}
                </div>
              </div>
              <div className={`flex items-center text-sm font-medium ${
                metric.change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`h-4 w-4 mr-1 ${metric.change < 0 ? 'rotate-180' : ''}`} />
                {Math.abs(metric.change)}%
              </div>
            </div>
            
            <div className="mb-2">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {metric.value}
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {metric.title}
              </div>
            </div>
            
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {metric.description}
            </div>
          </div>
        ))}
      </div>

      {/* Chart Selection Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'categories', label: 'Categories', icon: PieChart },
              { id: 'progress', label: 'Progress', icon: TrendingUp },
              { id: 'difficulty', label: 'Difficulty', icon: Target }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedChart(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedChart === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Chart Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {selectedChart === 'overview' && (
          <>
            <SimpleLineChart data={progressChartData} title="Learning Progress Over Time" />
            <SimpleBarChart data={categoryData} title="Objects by Category" />
          </>
        )}
        
        {selectedChart === 'categories' && (
          <>
            <SimpleBarChart data={categoryData} title="Category Distribution" />
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Category Insights
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Most Active Category
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    You've explored the most objects in the <strong>Collections</strong> category. 
                    This shows strong foundational knowledge in data structures.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                    Recommended Focus
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Consider exploring more <strong>Async</strong> objects like Promise and AsyncGenerator 
                    to round out your asynchronous programming skills.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        
        {selectedChart === 'progress' && (
          <>
            <SimpleLineChart data={progressChartData} title="Daily Learning Activity" />
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Progress Summary
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Objects Learned</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{visitedObjects.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Time Investment</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {progressData.reduce((sum, day) => sum + day.timeSpent, 0)} minutes
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {Math.round((visitedObjects.length / totalObjects) * 100)}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Favorite Objects</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{favorites.length}</span>
                </div>
              </div>
            </div>
          </>
        )}
        
        {selectedChart === 'difficulty' && (
          <>
            <SimpleBarChart data={difficultyData} title="Learning by Difficulty Level" />
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Difficulty Analysis
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                    <h4 className="font-medium text-green-900 dark:text-green-100">Beginner</h4>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Strong foundation with {difficultyData.datasets[0].data[0]} objects mastered
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Intermediate</h4>
                  </div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Good progress with {difficultyData.datasets[0].data[1]} objects learned
                  </p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                    <h4 className="font-medium text-red-900 dark:text-red-100">Advanced</h4>
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Challenging concepts with {difficultyData.datasets[0].data[2]} objects explored
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Achievement Badges */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2 text-yellow-500" />
          Achievement Badges
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: 'First Steps', description: 'Learned your first JavaScript object', earned: visitedObjects.length > 0, icon: '🎯' },
            { name: 'Array Master', description: 'Mastered array methods', earned: visitedObjects.includes('Array'), icon: '📊' },
            { name: 'Promise Keeper', description: 'Understood async programming', earned: visitedObjects.includes('Promise'), icon: '⚡' },
            { name: 'Object Oriented', description: 'Explored object manipulation', earned: visitedObjects.includes('Object'), icon: '🔧' },
            { name: 'Collection Curator', description: 'Learned 3+ collection types', earned: ['Map', 'Set', 'WeakMap'].filter(obj => visitedObjects.includes(obj)).length >= 2, icon: '📚' },
            { name: 'Error Handler', description: 'Studied error types', earned: visitedObjects.some(obj => obj.includes('Error')), icon: '🛡️' },
            { name: 'Speed Learner', description: '10+ objects in a week', earned: visitedObjects.length >= 10, icon: '🚀' },
            { name: 'Favorite Collector', description: '5+ favorite objects', earned: favorites.length >= 5, icon: '❤️' }
          ].map((badge, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg text-center border-2 transition-all ${
                badge.earned
                  ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-600'
                  : 'border-gray-200 bg-gray-50 dark:bg-gray-750 dark:border-gray-600 opacity-50'
              }`}
            >
              <div className="text-2xl mb-2">{badge.icon}</div>
              <div className={`text-sm font-medium mb-1 ${
                badge.earned ? 'text-yellow-800 dark:text-yellow-200' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {badge.name}
              </div>
              <div className={`text-xs ${
                badge.earned ? 'text-yellow-600 dark:text-yellow-300' : 'text-gray-500 dark:text-gray-500'
              }`}>
                {badge.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
