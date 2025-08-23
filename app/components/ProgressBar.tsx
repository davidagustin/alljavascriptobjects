'use client'

import { useApp } from '../contexts/AppContext'
import { Target, Trophy } from 'lucide-react'

export default function ProgressBar() {
  const { visitedObjects, totalObjects } = useApp()
  const progress = (visitedObjects.length / totalObjects) * 100

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-green-500 to-emerald-500'
    if (progress >= 60) return 'from-yellow-500 to-orange-500'
    if (progress >= 40) return 'from-orange-500 to-red-500'
    return 'from-red-500 to-pink-500'
  }

  const getProgressMessage = (progress: number) => {
    if (progress >= 90) return 'JavaScript Master! 🎉'
    if (progress >= 75) return 'Almost there! Keep going! 💪'
    if (progress >= 50) return 'Halfway through! 🚀'
    if (progress >= 25) return 'Great start! 📚'
    return 'Begin your journey! 🌟'
  }

  const getAchievementLevel = (progress: number) => {
    if (progress >= 90) return { level: 'Master', color: 'text-red-600', bg: 'bg-red-100' }
    if (progress >= 75) return { level: 'Expert', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    if (progress >= 50) return { level: 'Scholar', color: 'text-purple-600', bg: 'bg-purple-100' }
    if (progress >= 25) return { level: 'Explorer', color: 'text-blue-600', bg: 'bg-blue-100' }
    return { level: 'Beginner', color: 'text-green-600', bg: 'bg-green-100' }
  }

  const achievement = getAchievementLevel(progress)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Learning Progress
        </h3>
        <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${achievement.bg} ${achievement.color}`}>
          <Trophy className="h-3 w-3 mr-1" />
          {achievement.level}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Progress tracking
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(progress)} transition-all duration-500 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Progress Message */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
          {getProgressMessage(progress)}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {Math.round(progress)}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Explored</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {100 - Math.round(progress)}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Remaining</div>
        </div>
      </div>
    </div>
  )
}
