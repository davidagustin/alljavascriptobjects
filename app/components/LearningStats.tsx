'use client'

import { useApp } from '../contexts/AppContext'
import { TrendingUp, Clock, Star, Target, Calendar } from 'lucide-react'

export default function LearningStats() {
  const { visitedObjects, favorites, totalObjects } = useApp()
  
  const progress = (visitedObjects.length / totalObjects) * 100
  const remainingObjects = totalObjects - visitedObjects.length
  const completionRate = Math.round((visitedObjects.length / totalObjects) * 100)
  
  // Calculate estimated time to completion (assuming 2 minutes per object)
  const avgTimePerObject = 2 // minutes
  const totalTimeSpent = visitedObjects.length * avgTimePerObject
  const estimatedTimeRemaining = remainingObjects * avgTimePerObject
  
  const stats = [
    {
      label: 'Objects Explored',
      value: visitedObjects.length,
      total: totalObjects,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Favorites',
      value: favorites.length,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      label: 'Time Spent',
      value: `${totalTimeSpent}m`,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Completion',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Learning Statistics
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.bgColor} ${stat.color} mb-2`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stat.value}
              {stat.total && (
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  /{stat.total}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {completionRate}% Complete
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{visitedObjects.length} explored</span>
          <span>{remainingObjects} remaining</span>
        </div>
      </div>

      {/* Time Estimates */}
      {remainingObjects > 0 && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
            <Calendar className="h-4 w-4 mr-2" />
            Time Estimates
          </div>
          <div className="text-sm">
            <div className="flex justify-between">
              <span>Time spent:</span>
              <span className="font-medium">{totalTimeSpent} minutes</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated remaining:</span>
              <span className="font-medium">{estimatedTimeRemaining} minutes</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Based on 2 min/object</span>
            </div>
          </div>
        </div>
      )}

      {/* Motivational Message */}
      {completionRate > 0 && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            {completionRate < 25 && "🌱 Great start! Keep exploring JavaScript objects."}
            {completionRate >= 25 && completionRate < 50 && "📚 You're making excellent progress!"}
            {completionRate >= 50 && completionRate < 75 && "🚀 Halfway there! You're doing amazing!"}
            {completionRate >= 75 && completionRate < 100 && "⭐ Almost there! You're a JavaScript expert!"}
            {completionRate === 100 && "🎉 Congratulations! You've mastered all JavaScript objects!"}
          </p>
        </div>
      )}
    </div>
  )
}