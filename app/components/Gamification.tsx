'use client'

import { useState, useEffect, useMemo } from 'react'
import { Trophy, Award, Target, Zap, Star, TrendingUp, Lock, CheckCircle, Gift, Flame } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import confetti from 'canvas-confetti'

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  points: number
  category: 'exploration' | 'mastery' | 'speed' | 'dedication' | 'special'
  requirement: (stats: UserStats) => boolean
  unlocked: boolean
  unlockedAt?: Date
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface UserStats {
  objectsVisited: number
  totalObjects: number
  favoriteCount: number
  streakDays: number
  totalTimeSpent: number // in minutes
  challengesCompleted: number
  perfectChallenges: number
  codeExecutions: number
  level: number
  xp: number
  rank: string
}

interface Badge {
  id: string
  name: string
  icon: string
  color: string
  requirement: number
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Visit your first JavaScript object',
    icon: <FootprintsIcon />,
    points: 10,
    category: 'exploration',
    requirement: (stats) => stats.objectsVisited >= 1,
    unlocked: false,
    rarity: 'common'
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Visit 10 different objects',
    icon: <CompassIcon />,
    points: 25,
    category: 'exploration',
    requirement: (stats) => stats.objectsVisited >= 10,
    unlocked: false,
    rarity: 'common'
  },
  {
    id: 'adventurer',
    title: 'Adventurer',
    description: 'Visit 25 different objects',
    icon: <MapIcon />,
    points: 50,
    category: 'exploration',
    requirement: (stats) => stats.objectsVisited >= 25,
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'completionist',
    title: 'Completionist',
    description: 'Visit all JavaScript objects',
    icon: <Trophy className="h-5 w-5" />,
    points: 200,
    category: 'mastery',
    requirement: (stats) => stats.objectsVisited === stats.totalObjects,
    unlocked: false,
    rarity: 'legendary'
  },
  {
    id: 'speed-learner',
    title: 'Speed Learner',
    description: 'Complete 5 challenges in under 5 minutes each',
    icon: <Zap className="h-5 w-5" />,
    points: 75,
    category: 'speed',
    requirement: (stats) => stats.challengesCompleted >= 5,
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Complete 10 challenges with perfect scores',
    icon: <Star className="h-5 w-5" />,
    points: 100,
    category: 'mastery',
    requirement: (stats) => stats.perfectChallenges >= 10,
    unlocked: false,
    rarity: 'epic'
  },
  {
    id: 'dedicated',
    title: 'Dedicated Learner',
    description: 'Maintain a 7-day learning streak',
    icon: <Flame className="h-5 w-5" />,
    points: 50,
    category: 'dedication',
    requirement: (stats) => stats.streakDays >= 7,
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'code-warrior',
    title: 'Code Warrior',
    description: 'Execute code 100 times',
    icon: <SwordIcon />,
    points: 60,
    category: 'dedication',
    requirement: (stats) => stats.codeExecutions >= 100,
    unlocked: false,
    rarity: 'rare'
  }
]

const RANKS = [
  { name: 'Novice', minXP: 0, color: 'text-gray-600' },
  { name: 'Apprentice', minXP: 100, color: 'text-green-600' },
  { name: 'Journeyman', minXP: 300, color: 'text-blue-600' },
  { name: 'Expert', minXP: 600, color: 'text-purple-600' },
  { name: 'Master', minXP: 1000, color: 'text-orange-600' },
  { name: 'Grandmaster', minXP: 1500, color: 'text-red-600' },
  { name: 'Legend', minXP: 2500, color: 'text-yellow-600' }
]

const BADGES: Badge[] = [
  { id: 'array-master', name: 'Array Master', icon: '🎯', color: 'bg-blue-500', requirement: 5 },
  { id: 'promise-keeper', name: 'Promise Keeper', icon: '⏳', color: 'bg-purple-500', requirement: 3 },
  { id: 'object-oriented', name: 'Object Oriented', icon: '📦', color: 'bg-green-500', requirement: 10 },
  { id: 'error-handler', name: 'Error Handler', icon: '⚠️', color: 'bg-red-500', requirement: 5 },
  { id: 'async-await', name: 'Async Master', icon: '🔄', color: 'bg-indigo-500', requirement: 4 }
]

// Custom icon components
function FootprintsIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  )
}

function CompassIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  )
}

function MapIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
    </svg>
  )
}

function SwordIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6.92 5H5l9 9 1.92-1.92L6.92 5zm3.54-.54L4 11l1.41 1.41 6.54-6.54-1.49-1.41zm9.13.12l-5.66 5.66 2.83 2.83 5.66-5.66-2.83-2.83z"/>
    </svg>
  )
}

export default function Gamification() {
  const { visitedObjects, favorites, totalObjects } = useApp()
  const [userStats, setUserStats] = useState<UserStats>({
    objectsVisited: 0,
    totalObjects: 0,
    favoriteCount: 0,
    streakDays: 0,
    totalTimeSpent: 0,
    challengesCompleted: 0,
    perfectChallenges: 0,
    codeExecutions: 0,
    level: 1,
    xp: 0,
    rank: 'Novice'
  })
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS)
  const [showAchievementModal, setShowAchievementModal] = useState<Achievement | null>(null)
  const [userBadges, setUserBadges] = useState<string[]>([])

  // Update stats based on app state
  useEffect(() => {
    const xp = visitedObjects.length * 10 + favorites.length * 5
    const level = Math.floor(xp / 100) + 1
    const rank = RANKS.find(r => xp >= r.minXP && xp < (RANKS[RANKS.indexOf(r) + 1]?.minXP || Infinity))?.name || 'Novice'
    
    setUserStats(prev => ({
      ...prev,
      objectsVisited: visitedObjects.length,
      totalObjects,
      favoriteCount: favorites.length,
      xp,
      level,
      rank
    }))
  }, [visitedObjects, favorites, totalObjects])

  // Check for new achievements
  useEffect(() => {
    const newAchievements = achievements.map(achievement => {
      const wasUnlocked = achievement.unlocked
      const isNowUnlocked = achievement.requirement(userStats)
      
      if (!wasUnlocked && isNowUnlocked) {
        // Show achievement unlocked notification
        setTimeout(() => {
          setShowAchievementModal(achievement)
          // Fire confetti!
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          })
        }, 500)
      }
      
      return {
        ...achievement,
        unlocked: isNowUnlocked,
        unlockedAt: isNowUnlocked && !wasUnlocked ? new Date() : achievement.unlockedAt
      }
    })
    
    setAchievements(newAchievements)
  }, [userStats])

  // Calculate progress to next level
  const currentLevelXP = (userStats.level - 1) * 100
  const nextLevelXP = userStats.level * 100
  const progressToNextLevel = ((userStats.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100

  // Get current rank info
  const currentRankInfo = RANKS.find(r => r.name === userStats.rank) || RANKS[0]
  const nextRank = RANKS[RANKS.indexOf(currentRankInfo) + 1]

  // Group achievements by category
  const achievementsByCategory = useMemo(() => {
    const grouped: Record<string, Achievement[]> = {}
    achievements.forEach(achievement => {
      if (!grouped[achievement.category]) {
        grouped[achievement.category] = []
      }
      grouped[achievement.category].push(achievement)
    })
    return grouped
  }, [achievements])

  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'common': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800'
      case 'rare': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30'
      case 'epic': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30'
      case 'legendary': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* User Stats Overview */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-lg text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Level {userStats.level}</h2>
            <p className={`text-lg font-medium ${currentRankInfo.color}`}>
              {userStats.rank}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{userStats.xp}</div>
            <div className="text-sm opacity-90">Total XP</div>
          </div>
        </div>
        
        {/* XP Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Level {userStats.level}</span>
            <span>Level {userStats.level + 1}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressToNextLevel}%` }}
            />
          </div>
          <div className="text-xs mt-1 text-center">
            {userStats.xp - currentLevelXP} / {nextLevelXP - currentLevelXP} XP
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{userStats.objectsVisited}</div>
            <div className="text-xs opacity-90">Objects</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{userStats.challengesCompleted}</div>
            <div className="text-xs opacity-90">Challenges</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{userStats.streakDays}</div>
            <div className="text-xs opacity-90">Day Streak</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{achievements.filter(a => a.unlocked).length}</div>
            <div className="text-xs opacity-90">Achievements</div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Badges Earned
        </h3>
        <div className="flex flex-wrap gap-3">
          {BADGES.map(badge => {
            const earned = userStats.objectsVisited >= badge.requirement
            return (
              <div
                key={badge.id}
                className={`relative p-3 rounded-lg ${
                  earned 
                    ? `${badge.color} text-white` 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                }`}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <div className="text-xs font-medium">{badge.name}</div>
                {!earned && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <Lock className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Achievements
        </h3>
        
        {Object.entries(achievementsByCategory).map(([category, categoryAchievements]) => (
          <div key={category} className="mb-6">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 capitalize">
              {category}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categoryAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-lg border transition-all ${
                    achievement.unlocked
                      ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 opacity-60'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getRarityColor(achievement.rarity)}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-gray-900 dark:text-gray-100">
                          {achievement.title}
                        </h5>
                        <div className="flex items-center space-x-1">
                          {achievement.unlocked && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            +{achievement.points} XP
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {achievement.description}
                      </p>
                      {achievement.unlockedAt && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Unlocked {achievement.unlockedAt.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard Preview */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Global Ranking
        </h3>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Trophy className="h-12 w-12 mx-auto mb-3" />
          <p className="text-sm">Leaderboards coming soon!</p>
          <p className="text-xs mt-1">Compete with learners worldwide</p>
        </div>
      </div>

      {/* Achievement Unlocked Modal */}
      {showAchievementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAchievementModal(null)} />
          <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full animate-bounce-in">
            <div className="text-center">
              <div className="mb-4 inline-flex p-4 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                <Trophy className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Achievement Unlocked!
              </h3>
              <div className="mb-4">
                <div className={`inline-flex p-3 rounded-lg ${getRarityColor(showAchievementModal.rarity)}`}>
                  {showAchievementModal.icon}
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {showAchievementModal.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {showAchievementModal.description}
              </p>
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                +{showAchievementModal.points} XP
              </div>
              <button
                onClick={() => setShowAchievementModal(null)}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Awesome!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}