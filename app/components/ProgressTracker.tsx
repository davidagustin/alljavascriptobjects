'use client'

import { useState } from 'react'
import { CheckCircle, Trophy, Target } from 'lucide-react'

interface ProgressTrackerProps {
  totalObjects: number
  visitedObjects: string[]
  onObjectClick: (objectName: string) => void
}

export default function ProgressTracker({ totalObjects, visitedObjects, onObjectClick }: ProgressTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const progress = (visitedObjects.length / totalObjects) * 100

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600'
    if (progress >= 60) return 'text-yellow-600'
    if (progress >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getProgressMessage = (progress: number) => {
    if (progress >= 90) return 'JavaScript Master! 🎉'
    if (progress >= 75) return 'Almost there! Keep going! 💪'
    if (progress >= 50) return 'Halfway through! 🚀'
    if (progress >= 25) return 'Great start! 📚'
    return 'Begin your journey! 🌟'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Learning Progress
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            {visitedObjects.length} of {totalObjects} objects explored
          </span>
          <span className={`text-sm font-medium ${getProgressColor(progress)}`}>
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Progress Message */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800 font-medium">
          {getProgressMessage(progress)}
        </p>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Visited Objects:</h4>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {visitedObjects.map((objectName) => (
              <button
                key={objectName}
                onClick={() => onObjectClick(objectName)}
                className="flex items-center text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
              >
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span className="truncate">{objectName}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Achievement Badges */}
      <div className="border-t pt-4 mt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Achievements:</h4>
        <div className="flex flex-wrap gap-2">
          {progress >= 10 && (
            <div className="flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              <Trophy className="h-3 w-3 mr-1" />
              Beginner
            </div>
          )}
          {progress >= 25 && (
            <div className="flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              <Trophy className="h-3 w-3 mr-1" />
              Explorer
            </div>
          )}
          {progress >= 50 && (
            <div className="flex items-center text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
              <Trophy className="h-3 w-3 mr-1" />
              Scholar
            </div>
          )}
          {progress >= 75 && (
            <div className="flex items-center text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
              <Trophy className="h-3 w-3 mr-1" />
              Expert
            </div>
          )}
          {progress >= 90 && (
            <div className="flex items-center text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
              <Trophy className="h-3 w-3 mr-1" />
              Master
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
