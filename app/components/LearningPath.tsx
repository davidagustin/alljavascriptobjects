'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { BookOpen, CheckCircle, Circle, Lock, Target, Zap, Award, ChevronRight, Play } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

interface LearningModule {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number // in minutes
  objectives: string[]
  objects: string[]
  prerequisites: string[]
  exercises: Exercise[]
  isCompleted: boolean
  isUnlocked: boolean
  completionDate?: Date
  score?: number
}

interface Exercise {
  id: string
  title: string
  type: 'reading' | 'coding' | 'quiz' | 'project'
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: number
  isCompleted: boolean
  score?: number
}

interface LearningPath {
  id: string
  title: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  totalModules: number
  estimatedHours: number
  modules: LearningModule[]
  skills: string[]
  certificate?: string
}

const learningPaths: LearningPath[] = [
  {
    id: 'fundamentals',
    title: 'JavaScript Fundamentals',
    description: 'Master the core concepts of JavaScript programming',
    level: 'beginner',
    totalModules: 8,
    estimatedHours: 20,
    skills: ['Variables', 'Functions', 'Objects', 'Arrays', 'Control Flow'],
    certificate: 'JavaScript Fundamentals Certificate',
    modules: [
      {
        id: 'basics',
        title: 'JavaScript Basics',
        description: 'Learn fundamental JavaScript concepts and syntax',
        difficulty: 'beginner',
        estimatedTime: 120,
        objectives: [
          'Understand JavaScript data types',
          'Work with variables and constants',
          'Master basic operators',
          'Use template literals effectively'
        ],
        objects: ['Object', 'Boolean', 'undefined', 'globalThis'],
        prerequisites: [],
        exercises: [
          {
            id: 'ex1',
            title: 'Data Types Explorer',
            type: 'coding',
            description: 'Practice with different JavaScript data types',
            difficulty: 'easy',
            estimatedTime: 20,
            isCompleted: false
          },
          {
            id: 'ex2',
            title: 'Variables Quiz',
            type: 'quiz',
            description: 'Test your knowledge of variable declarations',
            difficulty: 'easy',
            estimatedTime: 10,
            isCompleted: false
          }
        ],
        isCompleted: false,
        isUnlocked: true
      },
      {
        id: 'numbers',
        title: 'Numbers and Math',
        description: 'Work with numeric data and mathematical operations',
        difficulty: 'beginner',
        estimatedTime: 90,
        objectives: [
          'Perform arithmetic operations',
          'Use Math object methods',
          'Handle number parsing and validation',
          'Work with special numeric values'
        ],
        objects: ['Number', 'Math', 'BigInt', 'parseInt()', 'parseFloat()', 'isNaN()', 'isFinite()', 'NaN', 'Infinity'],
        prerequisites: ['basics'],
        exercises: [
          {
            id: 'ex3',
            title: 'Calculator Project',
            type: 'project',
            description: 'Build a simple calculator using JavaScript',
            difficulty: 'medium',
            estimatedTime: 45,
            isCompleted: false
          }
        ],
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'strings',
        title: 'String Manipulation',
        description: 'Master string operations and text processing',
        difficulty: 'beginner',
        estimatedTime: 100,
        objectives: [
          'Manipulate strings effectively',
          'Use regular expressions',
          'Format and template strings',
          'Handle Unicode and encoding'
        ],
        objects: ['String', 'RegExp', 'encodeURI()', 'decodeURI()', 'encodeURIComponent()', 'decodeURIComponent()'],
        prerequisites: ['basics'],
        exercises: [
          {
            id: 'ex4',
            title: 'Text Formatter',
            type: 'coding',
            description: 'Create a text formatting utility',
            difficulty: 'medium',
            estimatedTime: 30,
            isCompleted: false
          }
        ],
        isCompleted: false,
        isUnlocked: false
      }
    ]
  },
  {
    id: 'collections',
    title: 'Data Structures & Collections',
    description: 'Learn to work with JavaScript collections and data structures',
    level: 'intermediate',
    totalModules: 6,
    estimatedHours: 15,
    skills: ['Arrays', 'Objects', 'Maps', 'Sets', 'Data Organization'],
    certificate: 'Data Structures Mastery Certificate',
    modules: [
      {
        id: 'arrays',
        title: 'Array Mastery',
        description: 'Become proficient with JavaScript arrays',
        difficulty: 'intermediate',
        estimatedTime: 150,
        objectives: [
          'Master array methods',
          'Implement functional programming patterns',
          'Handle multidimensional arrays',
          'Optimize array performance'
        ],
        objects: ['Array'],
        prerequisites: ['fundamentals'],
        exercises: [
          {
            id: 'ex5',
            title: 'Data Processing Pipeline',
            type: 'project',
            description: 'Build a data processing system using array methods',
            difficulty: 'hard',
            estimatedTime: 60,
            isCompleted: false
          }
        ],
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'maps-sets',
        title: 'Maps and Sets',
        description: 'Work with modern collection types',
        difficulty: 'intermediate',
        estimatedTime: 120,
        objectives: [
          'Understand Map vs Object differences',
          'Use Sets for unique collections',
          'Implement WeakMap and WeakSet patterns',
          'Choose appropriate collection types'
        ],
        objects: ['Map', 'Set', 'WeakMap', 'WeakSet', 'WeakRef'],
        prerequisites: ['arrays'],
        exercises: [
          {
            id: 'ex6',
            title: 'Cache Implementation',
            type: 'coding',
            description: 'Implement a caching system using Maps',
            difficulty: 'medium',
            estimatedTime: 40,
            isCompleted: false
          }
        ],
        isCompleted: false,
        isUnlocked: false
      }
    ]
  },
  {
    id: 'async',
    title: 'Asynchronous JavaScript',
    description: 'Master async programming patterns and concurrent execution',
    level: 'advanced',
    totalModules: 5,
    estimatedHours: 18,
    skills: ['Promises', 'Async/Await', 'Generators', 'Concurrency', 'Error Handling'],
    certificate: 'Async JavaScript Expert Certificate',
    modules: [
      {
        id: 'promises',
        title: 'Promises Deep Dive',
        description: 'Master asynchronous programming with Promises',
        difficulty: 'advanced',
        estimatedTime: 180,
        objectives: [
          'Understand Promise internals',
          'Handle complex async workflows',
          'Implement error handling strategies',
          'Optimize concurrent operations'
        ],
        objects: ['Promise'],
        prerequisites: ['collections'],
        exercises: [
          {
            id: 'ex7',
            title: 'Async Task Manager',
            type: 'project',
            description: 'Build a task management system with async operations',
            difficulty: 'hard',
            estimatedTime: 90,
            isCompleted: false
          }
        ],
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'generators',
        title: 'Generators and Iterators',
        description: 'Learn lazy evaluation and custom iteration patterns',
        difficulty: 'advanced',
        estimatedTime: 140,
        objectives: [
          'Create custom iterators',
          'Implement generator functions',
          'Handle async iteration',
          'Build streaming data processors'
        ],
        objects: ['Generator', 'GeneratorFunction', 'Iterator', 'AsyncIterator', 'AsyncGenerator', 'AsyncGeneratorFunction'],
        prerequisites: ['promises'],
        exercises: [
          {
            id: 'ex8',
            title: 'Data Stream Processor',
            type: 'project',
            description: 'Build a streaming data processor using generators',
            difficulty: 'hard',
            estimatedTime: 70,
            isCompleted: false
          }
        ],
        isCompleted: false,
        isUnlocked: false
      }
    ]
  }
]

export default function LearningPath() {
  const { visitedObjects, markAsVisited } = useApp()
  const [selectedPath, setSelectedPath] = useState<string>('fundamentals')
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [userProgress, setUserProgress] = useState<Record<string, any>>({})


  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('learning-progress')
    if (saved) {
      setUserProgress(JSON.parse(saved))
    }
  }, [])

  // Save progress to localStorage
  const saveProgress = useCallback((progress: Record<string, any>) => {
    setUserProgress(progress)
    localStorage.setItem('learning-progress', JSON.stringify(progress))
  }, [])

  // Update module completion and unlock logic
  const pathsWithProgress = useMemo(() => {
    return learningPaths.map(path => ({
      ...path,
      modules: path.modules.map((module, index) => {
        const moduleProgress = userProgress[`${path.id}-${module.id}`] || {}
        const isCompleted = moduleProgress.isCompleted || false
        
        // Check if module is unlocked
        let isUnlocked = index === 0 // First module is always unlocked
        if (index > 0) {
          const prevModule = path.modules[index - 1]
          const prevProgress = userProgress[`${path.id}-${prevModule.id}`] || {}
          isUnlocked = prevProgress.isCompleted || false
        }

        // Check if all objects in module have been visited
        const objectsVisited = module.objects.every(obj => visitedObjects.includes(obj))
        
        return {
          ...module,
          isCompleted: isCompleted || objectsVisited,
          isUnlocked,
          ...(moduleProgress.completionDate && { completionDate: new Date(moduleProgress.completionDate) }),
          score: moduleProgress.score || 0,
          exercises: module.exercises.map(exercise => ({
            ...exercise,
            isCompleted: moduleProgress.exercises?.[exercise.id]?.isCompleted || false,
            score: moduleProgress.exercises?.[exercise.id]?.score || 0
          }))
        }
      })
    }))
  }, [userProgress, visitedObjects])

  const currentPath = pathsWithProgress.find(p => p.id === selectedPath)!

  // Calculate overall progress
  const pathProgress = useMemo(() => {
    const completedModules = currentPath.modules.filter(m => m.isCompleted).length
    const totalModules = currentPath.modules.length
    const percentage = (completedModules / totalModules) * 100
    
    const totalTime = currentPath.modules.reduce((sum, m) => sum + m.estimatedTime, 0)
    const completedTime = currentPath.modules
      .filter(m => m.isCompleted)
      .reduce((sum, m) => sum + m.estimatedTime, 0)
    
    return {
      percentage,
      completedModules,
      totalModules,
      totalTime,
      completedTime
    }
  }, [currentPath])

  // Complete a module
  const completeModule = useCallback((pathId: string, moduleId: string) => {
    const progressKey = `${pathId}-${moduleId}`
    const newProgress = {
      ...userProgress,
      [progressKey]: {
        ...userProgress[progressKey],
        isCompleted: true,
        completionDate: new Date().toISOString(),
        score: 100
      }
    }
    saveProgress(newProgress)
  }, [userProgress, saveProgress])

  // Complete an exercise
  const completeExercise = useCallback((pathId: string, moduleId: string, exerciseId: string, score: number = 100) => {
    const progressKey = `${pathId}-${moduleId}`
    const moduleProgress = userProgress[progressKey] || { exercises: {} }
    
    const newProgress = {
      ...userProgress,
      [progressKey]: {
        ...moduleProgress,
        exercises: {
          ...moduleProgress.exercises,
          [exerciseId]: {
            isCompleted: true,
            score,
            completionDate: new Date().toISOString()
          }
        }
      }
    }
    saveProgress(newProgress)
  }, [userProgress, saveProgress])

  // Start learning a module
  const startModule = useCallback((module: LearningModule) => {
    if (!module.isUnlocked) return
    
    // Mark all objects in the module as visited
    module.objects.forEach(objectName => {
      markAsVisited(objectName)
    })
  }, [markAsVisited])

  // Toggle module expansion
  const toggleModule = useCallback((moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev)
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId)
      } else {
        newSet.add(moduleId)
      }
      return newSet
    })
  }, [])

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
      case 'easy':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'intermediate':
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
      case 'advanced':
      case 'hard':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  // Get exercise type icon
  const getExerciseIcon = (type: string) => {
    switch (type) {
      case 'reading':
        return <BookOpen className="h-4 w-4" />
      case 'coding':
        return <Zap className="h-4 w-4" />
      case 'quiz':
        return <Target className="h-4 w-4" />
      case 'project':
        return <Award className="h-4 w-4" />
      default:
        return <Circle className="h-4 w-4" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Learning Paths
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Structured learning journeys to master JavaScript objects and concepts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {/* Path Selection Sidebar */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Choose Your Path
            </h2>
            
            <div className="space-y-3">
              {pathsWithProgress.map(path => {
                const completedModules = path.modules.filter(m => m.isCompleted).length
                const progressPercentage = (completedModules / path.totalModules) * 100
                
                return (
                  <button
                    key={path.id}
                    onClick={() => setSelectedPath(path.id)}
                    className={`w-full text-left p-3 sm:p-4 rounded-lg border transition-all ${
                      selectedPath === path.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base mb-1 sm:mb-0">
                        {path.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium self-start sm:self-auto ${getDifficultyColor(path.level)}`}>
                        {path.level}
                      </span>
                    </div>
                    
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {path.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Progress</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {completedModules}/{path.totalModules}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{path.estimatedHours}h total</span>
                        <span>{Math.round(progressPercentage)}% complete</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            {/* Path Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {currentPath.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {currentPath.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentPath.skills.map(skill => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {Math.round(pathProgress.percentage)}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Complete
                  </div>
                </div>
              </div>

              {/* Progress Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {pathProgress.completedModules}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Modules Complete
                  </div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {Math.round(pathProgress.completedTime / 60)}h
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Time Invested
                  </div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {currentPath.modules.filter(m => m.isUnlocked).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Modules Unlocked
                  </div>
                </div>
              </div>
            </div>

            {/* Modules List */}
            <div className="p-6">
              <div className="space-y-4">
                {currentPath.modules.map((module, index) => {
                  const isExpanded = expandedModules.has(module.id)
                  const completedExercises = module.exercises.filter((e: any) => e.isCompleted).length
                  
                  return (
                    <div
                      key={module.id}
                      className={`border rounded-lg transition-all ${
                        module.isUnlocked
                          ? 'border-gray-200 dark:border-gray-700'
                          : 'border-gray-100 dark:border-gray-800 opacity-60'
                      }`}
                    >
                      <div
                        className={`p-4 cursor-pointer ${
                          module.isUnlocked ? 'hover:bg-gray-50 dark:hover:bg-gray-750' : ''
                        }`}
                        onClick={() => module.isUnlocked && toggleModule(module.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {module.isCompleted ? (
                                <CheckCircle className="h-6 w-6 text-green-500" />
                              ) : module.isUnlocked ? (
                                <Circle className="h-6 w-6 text-gray-400" />
                              ) : (
                                <Lock className="h-6 w-6 text-gray-300" />
                              )}
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {index + 1}. {module.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {module.description}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                              {module.difficulty}
                            </span>
                            
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {module.estimatedTime}min
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {module.objects.length} objects
                              </div>
                            </div>
                            
                            {module.isUnlocked && (
                              <ChevronRight
                                className={`h-5 w-5 text-gray-400 transition-transform ${
                                  isExpanded ? 'rotate-90' : ''
                                }`}
                              />
                            )}
                          </div>
                        </div>
                        
                        {module.isUnlocked && (
                          <div className="mt-3">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  module.isCompleted
                                    ? 'bg-green-500'
                                    : 'bg-blue-500'
                                }`}
                                style={{
                                  width: module.isCompleted
                                    ? '100%'
                                    : `${(completedExercises / module.exercises.length) * 100}%`
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Expanded Module Content */}
                      {isExpanded && module.isUnlocked && (
                        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-750">
                          {/* Objectives */}
                          <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                              Learning Objectives
                            </h4>
                            <ul className="space-y-1">
                              {module.objectives.map((objective: string, idx: number) => (
                                <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                  <Target className="h-3 w-3 mr-2 text-blue-500" />
                                  {objective}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* JavaScript Objects */}
                          <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                              JavaScript Objects Covered
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {module.objects.map((objectName: string) => (
                                <span
                                  key={objectName}
                                  className={`px-2 py-1 rounded text-xs font-medium ${
                                    visitedObjects.includes(objectName)
                                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                  }`}
                                >
                                  {objectName}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Exercises */}
                          <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                              Exercises ({completedExercises}/{module.exercises.length})
                            </h4>
                            <div className="space-y-2">
                              {module.exercises.map((exercise: any) => (
                                <div
                                  key={exercise.id}
                                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                      {exercise.isCompleted ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                      ) : (
                                        getExerciseIcon(exercise.type)
                                      )}
                                    </div>
                                    
                                    <div>
                                      <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {exercise.title}
                                      </h5>
                                      <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {exercise.description}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                                      {exercise.difficulty}
                                    </span>
                                    
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {exercise.estimatedTime}min
                                    </div>
                                    
                                    {!exercise.isCompleted && (
                                      <button
                                        onClick={() => completeExercise(currentPath.id, module.id, exercise.id)}
                                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                      >
                                        Start
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Module Actions */}
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => startModule(module)}
                              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Play className="h-4 w-4 mr-2" />
                              {module.isCompleted ? 'Review Module' : 'Start Learning'}
                            </button>
                            
                            {!module.isCompleted && completedExercises === module.exercises.length && (
                              <button
                                onClick={() => completeModule(currentPath.id, module.id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                Mark Complete
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Certificate Section */}
            {pathProgress.percentage === 100 && currentPath.certificate && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                      🎉 Congratulations!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      You've completed the {currentPath.title} learning path
                    </p>
                  </div>
                  
                  <button className="flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                    <Award className="h-5 w-5 mr-2" />
                    Download Certificate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}