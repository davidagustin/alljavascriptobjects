'use client'

import { useMemo } from 'react'
import { useApp } from '../contexts/AppContext'
import { Target, Trophy, TrendingUp, Calendar, Award, Star } from 'lucide-react'
import { OBJECT_CATEGORIES, getObjectsByDifficulty } from '../constants/objects'

export default function ProgressBar() {
  const { getProgress, visitedObjects, favorites, getBatchProgress } = useApp()
  const progress = getProgress()

  // Calculate category-specific progress
  const categoryProgress = useMemo(() => {
    return Object.entries(OBJECT_CATEGORIES).map(([categoryName, category]) => {
      const { completed, total } = getBatchProgress(category.objects)
      return {
        name: categoryName,
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        icon: category.icon || '📚',
        difficulty: category.difficulty
      }
    })
  }, [getBatchProgress])

  // Calculate difficulty-based progress
  const difficultyProgress = useMemo(() => {
    const difficulties = ['beginner', 'intermediate', 'advanced'] as const
    return difficulties.map(difficulty => {
      const objects = getObjectsByDifficulty(difficulty)
      const { completed, total } = getBatchProgress(objects)
      return {
        level: difficulty,
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
      }
    })
  }, [getBatchProgress])

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'from-green-500 to-emerald-500'
    if (percentage >= 60) return 'from-yellow-500 to-orange-500'
    if (percentage >= 40) return 'from-orange-500 to-red-500'
    return 'from-red-500 to-pink-500'
  }

  const getProgressMessage = (percentage: number) => {
    if (percentage >= 90) return 'JavaScript Master! 🎉'
    if (percentage >= 75) return 'Almost there! Keep going! 💪'
    if (percentage >= 50) return 'Halfway through! 🚀'
    if (percentage >= 25) return 'Great start! 📚'
    return 'Begin your journey! 🌟'
  }

  const getAchievementLevel = (percentage: number) => {
    if (percentage >= 90) return { level: 'Master', color: 'text-red-600', bg: 'bg-red-100', icon: Award }
    if (percentage >= 75) return { level: 'Expert', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Star }
    if (percentage >= 50) return { level: 'Scholar', color: 'text-purple-600', bg: 'bg-purple-100', icon: Trophy }
    if (percentage >= 25) return { level: 'Explorer', color: 'text-blue-600', bg: 'bg-blue-100', icon: Target }
    return { level: 'Beginner', color: 'text-green-600', bg: 'bg-green-100', icon: TrendingUp }
  }

  const achievement = getAchievementLevel(progress.percentage)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Learning Progress
        </h3>
        <div className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${achievement.bg} ${achievement.color}`}>
          <achievement.icon className="h-3 w-3 mr-1" />
          {achievement.level}
        </div>
      </div>

      {/* Overall Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Overall Progress
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {progress.percentage}% ({progress.visited}/{progress.total})
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full bg-gradient-to-r ${getProgressColor(progress.percentage)} transition-all duration-500 ease-out`}
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      {/* Progress Message with Streak */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-center justify-between">
          <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
            {getProgressMessage(progress.percentage)}
          </p>
          {progress.streak > 0 && (
            <div className="flex items-center text-xs text-blue-600 dark:text-blue-400">
              <Calendar className="h-3 w-3 mr-1" />
              {progress.streak} day streak
            </div>
          )}
        </div>
      </div>

      {/* Difficulty Progress */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Progress by Difficulty
        </h4>
        <div className="space-y-2">
          {difficultyProgress.map((diff) => (
            <div key={diff.level} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 flex-1">
                <span className={`capitalize font-medium min-w-[80px] ${
                  diff.level === 'beginner' ? 'text-green-600 dark:text-green-400' :
                  diff.level === 'intermediate' ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {diff.level}
                </span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      diff.level === 'beginner' ? 'bg-green-500' :
                      diff.level === 'intermediate' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${diff.percentage}%` }}
                  />
                </div>
              </div>
              <span className="text-gray-500 dark:text-gray-400 ml-2">
                {diff.completed}/{diff.total}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {progress.visited}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Visited</div>
        </div>
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {favorites.length}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Favorites</div>
        </div>
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {progress.total - progress.visited}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Remaining</div>
        </div>
      </div>

      {/* Category Progress (Top 3) */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Top Categories
        </h4>
        <div className="space-y-1">
          {categoryProgress
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 3)
            .map((category) => (
              <div key={category.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1">
                  <span className="text-sm">{category.icon}</span>
                  <span className="text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                    <div
                      className="h-1 rounded-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 text-xs min-w-[35px]">
                    {category.percentage}%
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
