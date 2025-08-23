'use client'

import { useState, useMemo } from 'react'
import { Play, Search, BookOpen, Bot, BarChart3, Share2, Smartphone, Code, Zap, Target, Award, Users, TrendingUp, Clock, Heart, Eye } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import AdvancedCodePlayground from './AdvancedCodePlayground'
import AdvancedSearch from './AdvancedSearch'
import LearningPath from './LearningPath'
import VisualizationDashboard from './VisualizationDashboard'
import CodeSharingHub from './CodeSharingHub'
import PWAManager from './PWAManager'

type TabId = 'playground' | 'search' | 'learning' | 'analytics' | 'sharing' | 'pwa'

interface Feature {
  id: TabId
  title: string
  description: string
  icon: React.ReactNode
  color: string
  badge?: string
  isNew?: boolean
}

const features: Feature[] = [
  {
    id: 'playground',
    title: 'Code Playground',
    description: 'Interactive coding environment with live execution',
    icon: <Play className="h-5 w-5" />,
    color: 'from-green-500 to-emerald-600',
    badge: 'Live',
    isNew: true
  },
  {
    id: 'search',
    title: 'Advanced Search',
    description: 'Intelligent search with filters and smart suggestions',
    icon: <Search className="h-5 w-5" />,
    color: 'from-blue-500 to-cyan-600',
    badge: 'Smart'
  },
  {
    id: 'learning',
    title: 'Learning Paths',
    description: 'Structured learning journeys with progress tracking',
    icon: <BookOpen className="h-5 w-5" />,
    color: 'from-purple-500 to-indigo-600',
    badge: 'Guided'
  },
  {
    id: 'analytics',
    title: 'Analytics Dashboard',
    description: 'Visualize your learning progress and insights',
    icon: <BarChart3 className="h-5 w-5" />,
    color: 'from-yellow-500 to-orange-600',
    badge: 'Insights'
  },
  {
    id: 'sharing',
    title: 'Code Sharing',
    description: 'Share code snippets and collaborate with others',
    icon: <Share2 className="h-5 w-5" />,
    color: 'from-pink-500 to-rose-600',
    badge: 'Social',
    isNew: true
  },
  {
    id: 'pwa',
    title: 'PWA Manager',
    description: 'Offline support and app installation management',
    icon: <Smartphone className="h-5 w-5" />,
    color: 'from-teal-500 to-green-600',
    badge: 'Offline'
  }
]

export default function AdvancedDashboard() {
  const { visitedObjects, favorites, totalObjects } = useApp()
  const [activeTab, setActiveTab] = useState<TabId>('playground')
  const [selectedObject, setSelectedObject] = useState<string>('')

  // Calculate user stats
  const userStats = useMemo(() => {
    const completionRate = (visitedObjects.length / totalObjects) * 100
    const favoriteRate = favorites.length > 0 ? (favorites.length / visitedObjects.length) * 100 : 0
    
    return {
      objectsLearned: visitedObjects.length,
      totalObjects,
      completionRate: Math.round(completionRate),
      favoriteObjects: favorites.length,
      favoriteRate: Math.round(favoriteRate),
      streakDays: 7, // Mock data
      timeSpent: 240 // Mock data in minutes
    }
  }, [visitedObjects, favorites, totalObjects])

  const handleObjectSelect = (objectName: string) => {
    setSelectedObject(objectName)
    // Could navigate to the object page or show details
  }

  const renderActiveFeature = () => {
    switch (activeTab) {
      case 'playground':
        return <AdvancedCodePlayground selectedObject={selectedObject} />
      case 'search':
        return <AdvancedSearch onObjectSelect={handleObjectSelect} />
      case 'learning':
        return <LearningPath />
      case 'analytics':
        return <VisualizationDashboard />
      case 'sharing':
        return <CodeSharingHub />
      case 'pwa':
        return <PWAManager />
      default:
        return <AdvancedCodePlayground />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Advanced Learning Studio
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Complete JavaScript Objects learning environment
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {userStats.objectsLearned}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Objects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {userStats.completionRate}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Complete</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {userStats.streakDays}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Day Streak</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1 overflow-x-auto py-4">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className={`relative flex items-center space-x-3 px-6 py-3 rounded-lg transition-all whitespace-nowrap ${
                  activeTab === feature.id
                    ? `bg-gradient-to-r ${feature.color} text-white shadow-lg transform scale-105`
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className={`p-2 rounded-md ${
                  activeTab === feature.id 
                    ? 'bg-white/20' 
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  {feature.icon}
                </div>
                
                <div className="text-left">
                  <div className="font-medium flex items-center space-x-2">
                    <span>{feature.title}</span>
                    {feature.badge && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        activeTab === feature.id
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}>
                        {feature.badge}
                      </span>
                    )}
                    {feature.isNew && (
                      <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full animate-pulse">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className={`text-sm ${
                    activeTab === feature.id 
                      ? 'text-white/80' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {feature.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Achievement Banner */}
      {userStats.completionRate >= 50 && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Award className="h-6 w-6" />
                <div>
                  <span className="font-medium">🎉 Halfway Hero!</span>
                  <span className="ml-2 text-yellow-100">
                    You've completed {userStats.completionRate}% of JavaScript objects!
                  </span>
                </div>
              </div>
              <button className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                View Achievements
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Feature Overview Cards (only show when no specific tab is active) */}
        {activeTab === 'playground' && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Quick Stats Cards */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {userStats.objectsLearned}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Objects Learned
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {userStats.completionRate}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Completion Rate
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {userStats.favoriteObjects}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Favorites
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {userStats.streakDays}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Day Streak
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab('search')}
                  className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Search Objects
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('learning')}
                  className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Start Learning
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <BarChart3 className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    View Progress
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('sharing')}
                  className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <Share2 className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Share Code
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Feature Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {renderActiveFeature()}
        </div>
      </div>

      {/* Footer with feature highlights */}
      <div className="bg-gray-800 dark:bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-Powered Learning</h3>
              <p className="text-gray-300 text-sm">
                Get intelligent code suggestions and personalized learning recommendations
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-lg mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Collaborative Learning</h3>
              <p className="text-gray-300 text-sm">
                Share code snippets, learn from others, and build together
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 rounded-lg mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Progress Tracking</h3>
              <p className="text-gray-300 text-sm">
                Visualize your learning journey with detailed analytics and insights
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-8 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              🚀 Advanced JavaScript Objects Learning Platform - Built with ❤️ for developers
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
