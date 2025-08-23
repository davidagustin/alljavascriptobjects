'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { MapPin, Play, CheckCircle, Clock, Star, TrendingUp, Target, Award, BookOpen, ArrowRight, RotateCcw, Zap } from 'lucide-react'

interface LearningObjective {
  id: string
  title: string
  description: string
  estimatedTime: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  prerequisites: string[]
  relatedObjects: string[]
  skills: string[]
  completed: boolean
  startedAt?: number
  completedAt?: number
}

interface LearningPath {
  id: string
  title: string
  description: string
  totalTime: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  objectives: LearningObjective[]
  progress: number
  estimatedCompletion: string
  skills: string[]
  prerequisites: string[]
}

interface UserProgress {
  totalObjectivesCompleted: number
  totalTimeSpent: number
  currentStreak: number
  longestStreak: number
  skillsAcquired: string[]
  certificatesEarned: string[]
  lastActivityDate: number
}

export default function LearningPathSystem() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalObjectivesCompleted: 0,
    totalTimeSpent: 0,
    currentStreak: 0,
    longestStreak: 0,
    skillsAcquired: [],
    certificatesEarned: [],
    lastActivityDate: Date.now()
  })
  const [activeTab, setActiveTab] = useState<'paths' | 'progress' | 'objectives' | 'achievements'>('paths')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  // Learning paths data
  const learningPaths: LearningPath[] = useMemo(() => [
    {
      id: 'js-fundamentals',
      title: 'JavaScript Fundamentals',
      description: 'Master the core concepts of JavaScript including objects, functions, and data types',
      totalTime: 480, // 8 hours
      difficulty: 'Beginner',
      category: 'Fundamentals',
      progress: 0,
      estimatedCompletion: '1-2 weeks',
      skills: ['Variables', 'Functions', 'Objects', 'Arrays', 'Control Flow'],
      prerequisites: ['Basic programming concepts'],
      objectives: [
        {
          id: 'obj-1',
          title: 'Understanding Objects',
          description: 'Learn how to create, manipulate, and work with JavaScript objects',
          estimatedTime: 90,
          difficulty: 'Beginner',
          category: 'Fundamentals',
          prerequisites: [],
          relatedObjects: ['Object'],
          skills: ['Object creation', 'Property access', 'Method definition'],
          completed: false
        },
        {
          id: 'obj-2',
          title: 'Array Mastery',
          description: 'Master array methods, iteration, and data manipulation techniques',
          estimatedTime: 120,
          difficulty: 'Beginner',
          category: 'Collections',
          prerequisites: ['obj-1'],
          relatedObjects: ['Array'],
          skills: ['Array methods', 'Iteration', 'Data transformation'],
          completed: false
        },
        {
          id: 'obj-3',
          title: 'Function Deep Dive',
          description: 'Explore function declaration, expressions, arrow functions, and closures',
          estimatedTime: 150,
          difficulty: 'Intermediate',
          category: 'Fundamentals',
          prerequisites: ['obj-1'],
          relatedObjects: ['Function'],
          skills: ['Function types', 'Closures', 'Higher-order functions'],
          completed: false
        },
        {
          id: 'obj-4',
          title: 'String Manipulation',
          description: 'Learn string methods, template literals, and text processing',
          estimatedTime: 120,
          difficulty: 'Beginner',
          category: 'Text',
          prerequisites: ['obj-1'],
          relatedObjects: ['String', 'RegExp'],
          skills: ['String methods', 'Template literals', 'Regular expressions'],
          completed: false
        }
      ]
    },
    {
      id: 'async-programming',
      title: 'Asynchronous Programming',
      description: 'Learn async/await, Promises, and modern asynchronous JavaScript patterns',
      totalTime: 360, // 6 hours
      difficulty: 'Intermediate',
      category: 'Control Flow',
      progress: 0,
      estimatedCompletion: '1-2 weeks',
      skills: ['Promises', 'Async/Await', 'Event Loop', 'Error Handling'],
      prerequisites: ['JavaScript Fundamentals'],
      objectives: [
        {
          id: 'async-1',
          title: 'Promise Fundamentals',
          description: 'Understand Promise creation, chaining, and error handling',
          estimatedTime: 120,
          difficulty: 'Intermediate',
          category: 'Control Flow',
          prerequisites: ['obj-3'],
          relatedObjects: ['Promise'],
          skills: ['Promise creation', 'Promise chaining', 'Error handling'],
          completed: false
        },
        {
          id: 'async-2',
          title: 'Async/Await Mastery',
          description: 'Master async functions and await syntax for cleaner asynchronous code',
          estimatedTime: 90,
          difficulty: 'Intermediate',
          category: 'Control Flow',
          prerequisites: ['async-1'],
          relatedObjects: ['AsyncFunction'],
          skills: ['Async functions', 'Await syntax', 'Error handling'],
          completed: false
        },
        {
          id: 'async-3',
          title: 'Advanced Async Patterns',
          description: 'Learn generators, async generators, and complex async patterns',
          estimatedTime: 150,
          difficulty: 'Advanced',
          category: 'Control Flow',
          prerequisites: ['async-2'],
          relatedObjects: ['Generator', 'AsyncGenerator'],
          skills: ['Generators', 'Async generators', 'Async iteration'],
          completed: false
        }
      ]
    },
    {
      id: 'data-structures',
      title: 'Data Structures & Collections',
      description: 'Explore Maps, Sets, WeakMaps, and advanced data structure patterns',
      totalTime: 300, // 5 hours
      difficulty: 'Intermediate',
      category: 'Collections',
      progress: 0,
      estimatedCompletion: '1 week',
      skills: ['Map', 'Set', 'WeakMap', 'WeakSet', 'Data Organization'],
      prerequisites: ['JavaScript Fundamentals'],
      objectives: [
        {
          id: 'ds-1',
          title: 'Map and Set Basics',
          description: 'Learn the fundamentals of Map and Set data structures',
          estimatedTime: 90,
          difficulty: 'Intermediate',
          category: 'Collections',
          prerequisites: ['obj-2'],
          relatedObjects: ['Map', 'Set'],
          skills: ['Map operations', 'Set operations', 'Data uniqueness'],
          completed: false
        },
        {
          id: 'ds-2',
          title: 'WeakMap and WeakSet',
          description: 'Understand weak references and memory management',
          estimatedTime: 120,
          difficulty: 'Advanced',
          category: 'Collections',
          prerequisites: ['ds-1'],
          relatedObjects: ['WeakMap', 'WeakSet'],
          skills: ['Weak references', 'Memory management', 'Garbage collection'],
          completed: false
        },
        {
          id: 'ds-3',
          title: 'Advanced Collection Patterns',
          description: 'Implement complex data structures using built-in collections',
          estimatedTime: 90,
          difficulty: 'Advanced',
          category: 'Collections',
          prerequisites: ['ds-2'],
          relatedObjects: ['Map', 'Set', 'WeakMap', 'WeakSet'],
          skills: ['Data structure design', 'Performance optimization', 'Memory efficiency'],
          completed: false
        }
      ]
    },
    {
      id: 'modern-js',
      title: 'Modern JavaScript Features',
      description: 'Explore the latest JavaScript features including Proxy, Reflect, and new APIs',
      totalTime: 240, // 4 hours
      difficulty: 'Advanced',
      category: 'Meta Programming',
      progress: 0,
      estimatedCompletion: '1 week',
      skills: ['Proxy', 'Reflect', 'Symbols', 'Decorators'],
      prerequisites: ['Asynchronous Programming', 'Data Structures & Collections'],
      objectives: [
        {
          id: 'modern-1',
          title: 'Proxy and Reflect',
          description: 'Master metaprogramming with Proxy and Reflect APIs',
          estimatedTime: 120,
          difficulty: 'Advanced',
          category: 'Meta Programming',
          prerequisites: ['ds-3'],
          relatedObjects: ['Proxy', 'Reflect'],
          skills: ['Metaprogramming', 'Object interception', 'Dynamic behavior'],
          completed: false
        },
        {
          id: 'modern-2',
          title: 'Symbols and Iterators',
          description: 'Learn about Symbols, iterators, and custom iteration protocols',
          estimatedTime: 120,
          difficulty: 'Advanced',
          category: 'Meta Programming',
          prerequisites: ['modern-1'],
          relatedObjects: ['Symbol', 'Iterator'],
          skills: ['Symbols', 'Iterator protocol', 'Custom iterables'],
          completed: false
        }
      ]
    }
  ], [])

  // Calculate progress for each path
  const pathsWithProgress = useMemo(() => {
    return learningPaths.map(path => ({
      ...path,
      progress: Math.round((path.objectives.filter(obj => obj.completed).length / path.objectives.length) * 100)
    }))
  }, [learningPaths])

  // Filter paths based on difficulty and category
  const filteredPaths = useMemo(() => {
    return pathsWithProgress.filter(path => {
      const difficultyMatch = filterDifficulty === 'all' || path.difficulty === filterDifficulty
      const categoryMatch = filterCategory === 'all' || path.category === filterCategory
      return difficultyMatch && categoryMatch
    })
  }, [pathsWithProgress, filterDifficulty, filterCategory])

  // Get available objectives (not blocked by prerequisites)
  const getAvailableObjectives = useCallback((path: LearningPath): LearningObjective[] => {
    const completedIds = path.objectives.filter(obj => obj.completed).map(obj => obj.id)
    return path.objectives.filter(obj => {
      if (obj.completed) return false
      return obj.prerequisites.every(prereq => completedIds.includes(prereq))
    })
  }, [])

  // Complete an objective
  const completeObjective = useCallback((pathId: string, objectiveId: string) => {
    setSelectedPath(prev => {
      if (!prev || prev.id !== pathId) return prev
      
      return {
        ...prev,
        objectives: prev.objectives.map(obj => 
          obj.id === objectiveId 
            ? { ...obj, completed: true, completedAt: Date.now() }
            : obj
        )
      }
    })

    // Update user progress
    setUserProgress(prev => {
      const objective = learningPaths
        .find(p => p.id === pathId)
        ?.objectives.find(obj => obj.id === objectiveId)
      
      if (!objective) return prev

      const newSkills = [...new Set([...prev.skillsAcquired, ...objective.skills])]
      
      return {
        ...prev,
        totalObjectivesCompleted: prev.totalObjectivesCompleted + 1,
        totalTimeSpent: prev.totalTimeSpent + objective.estimatedTime,
        skillsAcquired: newSkills,
        lastActivityDate: Date.now()
      }
    })
  }, [learningPaths])

  // Start an objective
  const startObjective = useCallback((pathId: string, objectiveId: string) => {
    setSelectedPath(prev => {
      if (!prev || prev.id !== pathId) return prev
      
      return {
        ...prev,
        objectives: prev.objectives.map(obj => 
          obj.id === objectiveId && !obj.startedAt
            ? { ...obj, startedAt: Date.now() }
            : obj
        )
      }
    })
  }, [])

  // Reset progress
  const resetProgress = useCallback((pathId: string) => {
    setSelectedPath(prev => {
      if (!prev || prev.id !== pathId) return prev
      
      return {
        ...prev,
        objectives: prev.objectives.map(obj => ({
          ...obj,
          completed: false,
          startedAt: undefined,
          completedAt: undefined
        }))
      }
    })
  }, [])

  // Get recommended next steps
  const getRecommendations = useCallback((): LearningPath[] => {
    return pathsWithProgress
      .filter(path => path.progress < 100 && path.progress > 0)
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 3)
  }, [pathsWithProgress])

  // Categories for filtering
  const categories = useMemo(() => {
    return Array.from(new Set(learningPaths.map(path => path.category))).sort()
  }, [learningPaths])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-1/2 right-4 transform -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-colors z-40"
        title="Open Learning Paths"
      >
        <MapPin className="h-5 w-5" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Learning Paths
          </h2>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {userProgress.totalObjectivesCompleted} objectives completed
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          {[
            { id: 'paths', label: 'Learning Paths', icon: MapPin },
            { id: 'progress', label: 'My Progress', icon: TrendingUp },
            { id: 'objectives', label: 'Current Objectives', icon: Target },
            { id: 'achievements', label: 'Achievements', icon: Award }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-sm font-medium flex items-center space-x-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-gray-800 dark:text-indigo-400'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {activeTab === 'paths' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                  >
                    <option value="all">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Recommended Paths */}
              {getRecommendations().length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                    Continue Learning
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {getRecommendations().map(path => (
                      <div key={path.id} className="border border-indigo-200 dark:border-indigo-800 rounded-lg p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-indigo-900 dark:text-indigo-100">{path.title}</h4>
                          <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                            {path.progress}%
                          </div>
                        </div>
                        <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-3">{path.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-indigo-500" />
                            <span className="text-xs text-indigo-600 dark:text-indigo-400">{path.estimatedCompletion}</span>
                          </div>
                          <button
                            onClick={() => setSelectedPath(path)}
                            className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700"
                          >
                            Continue
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Learning Paths */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  All Learning Paths ({filteredPaths.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPaths.map(path => (
                    <div key={path.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{path.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{path.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {Math.round(path.totalTime / 60)}h {path.totalTime % 60}m
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              path.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                              path.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                              'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                              {path.difficulty}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                              {path.category}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex-1 mr-4">
                              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                                <span>Progress</span>
                                <span>{path.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${path.progress}%` }}
                                />
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedPath(path)}
                              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
                            >
                              {path.progress > 0 ? 'Continue' : 'Start'}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills you'll learn:</h5>
                        <div className="flex flex-wrap gap-1">
                          {path.skills.slice(0, 5).map(skill => (
                            <span key={skill} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                          {path.skills.length > 5 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              +{path.skills.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 dark:text-green-400">Objectives Completed</p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">{userProgress.totalObjectivesCompleted}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Time Spent</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {Math.round(userProgress.totalTimeSpent / 60)}h
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 dark:text-purple-400">Skills Acquired</p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{userProgress.skillsAcquired.length}</p>
                    </div>
                    <Star className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">Current Streak</p>
                      <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{userProgress.currentStreak}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </div>

              {/* Path Progress */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Learning Path Progress</h3>
                <div className="space-y-4">
                  {pathsWithProgress.map(path => (
                    <div key={path.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{path.title}</h4>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{path.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${path.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>
                          {path.objectives.filter(obj => obj.completed).length} / {path.objectives.length} objectives
                        </span>
                        <span>{path.estimatedCompletion}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Acquired */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Skills Acquired</h3>
                <div className="flex flex-wrap gap-2">
                  {userProgress.skillsAcquired.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-full text-sm flex items-center">
                      <Star className="h-3 w-3 mr-1" />
                      {skill}
                    </span>
                  ))}
                  {userProgress.skillsAcquired.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Complete learning objectives to acquire skills</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'objectives' && (
            <div className="space-y-6">
              {selectedPath ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{selectedPath.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{selectedPath.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => resetProgress(selectedPath.id)}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 flex items-center"
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Reset
                      </button>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedPath.progress}% complete
                      </div>
                    </div>
                  </div>

                  {/* Available Objectives */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Available Objectives</h4>
                    <div className="space-y-4">
                      {getAvailableObjectives(selectedPath).map(objective => (
                        <div key={objective.id} className="border border-green-200 dark:border-green-800 rounded-lg p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-800/10">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{objective.title}</h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{objective.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {objective.estimatedTime}min
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  objective.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                  objective.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                  'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                }`}>
                                  {objective.difficulty}
                                </span>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Skills:</p>
                                <div className="flex flex-wrap gap-1">
                                  {objective.skills.map(skill => (
                                    <span key={skill} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2 ml-4">
                              {!objective.startedAt && (
                                <button
                                  onClick={() => startObjective(selectedPath.id, objective.id)}
                                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 flex items-center"
                                >
                                  <Play className="h-4 w-4 mr-1" />
                                  Start
                                </button>
                              )}
                              {objective.startedAt && (
                                <button
                                  onClick={() => completeObjective(selectedPath.id, objective.id)}
                                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Complete
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Completed Objectives */}
                  {selectedPath.objectives.some(obj => obj.completed) && (
                    <div className="mt-8">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Completed Objectives</h4>
                      <div className="space-y-3">
                        {selectedPath.objectives.filter(obj => obj.completed).map(objective => (
                          <div key={objective.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700/50">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium text-gray-900 dark:text-gray-100">{objective.title}</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Completed {objective.completedAt ? new Date(objective.completedAt).toLocaleDateString() : ''}
                                </p>
                              </div>
                              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Blocked Objectives */}
                  {selectedPath.objectives.some(obj => !obj.completed && obj.prerequisites.some(prereq => !selectedPath.objectives.find(o => o.id === prereq)?.completed)) && (
                    <div className="mt-8">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Locked Objectives</h4>
                      <div className="space-y-3">
                        {selectedPath.objectives
                          .filter(obj => !obj.completed && obj.prerequisites.some(prereq => !selectedPath.objectives.find(o => o.id === prereq)?.completed))
                          .map(objective => (
                            <div key={objective.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-100 dark:bg-gray-700 opacity-60">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="font-medium text-gray-700 dark:text-gray-300">{objective.title}</h5>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Prerequisites required: {objective.prerequisites.map(prereq => 
                                      selectedPath.objectives.find(o => o.id === prereq)?.title
                                    ).join(', ')}
                                  </p>
                                </div>
                                <div className="text-gray-400">🔒</div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Target className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Active Learning Path</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Choose a learning path to see available objectives</p>
                  <button
                    onClick={() => setActiveTab('paths')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center mx-auto"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Browse Learning Paths
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <Award className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Achievements Coming Soon</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Complete learning objectives to unlock achievements and certificates
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  {[
                    { title: 'First Steps', description: 'Complete your first objective', icon: '🎯' },
                    { title: 'JavaScript Ninja', description: 'Complete all fundamentals', icon: '🥷' },
                    { title: 'Async Master', description: 'Master asynchronous programming', icon: '⚡' },
                    { title: 'Speed Learner', description: 'Complete 5 objectives in one day', icon: '🚀' },
                    { title: 'Dedicated Student', description: 'Maintain a 7-day streak', icon: '🔥' },
                    { title: 'Expert Level', description: 'Complete all advanced paths', icon: '🏆' }
                  ].map((achievement, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center opacity-60">
                      <div className="text-3xl mb-2">{achievement.icon}</div>
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">{achievement.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}