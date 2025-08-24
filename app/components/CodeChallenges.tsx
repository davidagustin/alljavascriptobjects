'use client'

import { useState, useCallback, useEffect } from 'react'
import { Trophy, Target, Code, Play, RotateCcw, ChevronRight, Lock, CheckCircle, XCircle, AlertCircle, Timer, Zap, Award, TrendingUp } from 'lucide-react'
import { executeCodeSafely } from '../utils/errorHandling'
import { useApp } from '../contexts/AppContext'
import { usePerformanceTracking } from '../utils/performance'

interface Challenge {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  objectName: string
  initialCode: string
  solution: string
  tests: TestCase[]
  hints: string[]
  points: number
  timeLimit?: number // in seconds
  locked: boolean
  completionRate: number
}

interface TestCase {
  id: string
  description: string
  input: any[]
  expectedOutput: any
  hidden?: boolean
}

interface ChallengeResult {
  passed: boolean
  testsRun: number
  testsPassed: number
  executionTime: number
  points: number
  details: TestResult[]
}

interface TestResult {
  testId: string
  passed: boolean
  expected: any
  actual: any
  error?: string
}

const SAMPLE_CHALLENGES: Challenge[] = [
  {
    id: '1',
    title: 'Array Filter Challenge',
    description: 'Create a function that filters an array to only include even numbers',
    difficulty: 'easy',
    category: 'Array',
    objectName: 'Array',
    initialCode: `function filterEvenNumbers(arr) {
  // Your code here
  return arr;
}`,
    solution: `function filterEvenNumbers(arr) {
  return arr.filter(num => num % 2 === 0);
}`,
    tests: [
      {
        id: 't1',
        description: 'Should filter [1,2,3,4,5] to [2,4]',
        input: [[1,2,3,4,5]],
        expectedOutput: [2,4]
      },
      {
        id: 't2',
        description: 'Should handle empty array',
        input: [[]],
        expectedOutput: []
      },
      {
        id: 't3',
        description: 'Should handle all odd numbers',
        input: [[1,3,5,7,9]],
        expectedOutput: []
      }
    ],
    hints: [
      'Use the Array.filter() method',
      'Check if a number is even using the modulo operator (%)',
      'A number is even if num % 2 === 0'
    ],
    points: 10,
    timeLimit: 60,
    locked: false,
    completionRate: 75
  },
  {
    id: '2',
    title: 'Promise Chain Master',
    description: 'Create a promise chain that transforms data through multiple async operations',
    difficulty: 'medium',
    category: 'Promise',
    objectName: 'Promise',
    initialCode: `async function processData(data) {
  // Create a promise chain that:
  // 1. Doubles each number
  // 2. Filters numbers > 10
  // 3. Sums all remaining numbers
  return data;
}`,
    solution: `async function processData(data) {
  return Promise.resolve(data)
    .then(arr => arr.map(n => n * 2))
    .then(arr => arr.filter(n => n > 10))
    .then(arr => arr.reduce((sum, n) => sum + n, 0));
}`,
    tests: [
      {
        id: 't1',
        description: 'Should process [5,6,7,8]',
        input: [[5,6,7,8]],
        expectedOutput: 42
      },
      {
        id: 't2',
        description: 'Should handle small numbers',
        input: [[1,2,3,4]],
        expectedOutput: 0
      }
    ],
    hints: [
      'Use Promise.resolve() to start the chain',
      'Chain .then() calls for each transformation',
      'Use map, filter, and reduce array methods'
    ],
    points: 25,
    timeLimit: 120,
    locked: false,
    completionRate: 45
  },
  {
    id: '3',
    title: 'Map Data Structure Expert',
    description: 'Use Map to count occurrences and find the most frequent element',
    difficulty: 'hard',
    category: 'Map',
    objectName: 'Map',
    initialCode: `function findMostFrequent(arr) {
  // Use a Map to count occurrences
  // Return the most frequent element
  return null;
}`,
    solution: `function findMostFrequent(arr) {
  const counts = new Map();
  for (const item of arr) {
    counts.set(item, (counts.get(item) || 0) + 1);
  }
  
  let maxCount = 0;
  let mostFrequent = null;
  
  for (const [item, count] of counts) {
    if (count > maxCount) {
      maxCount = count;
      mostFrequent = item;
    }
  }
  
  return mostFrequent;
}`,
    tests: [
      {
        id: 't1',
        description: 'Should find most frequent in [1,2,2,3,3,3]',
        input: [[1,2,2,3,3,3]],
        expectedOutput: 3
      },
      {
        id: 't2',
        description: 'Should handle strings',
        input: [['a','b','b','c','c','c']],
        expectedOutput: 'c'
      }
    ],
    hints: [
      'Create a new Map() to store counts',
      'Use map.set() and map.get() methods',
      'Iterate through the map to find the maximum'
    ],
    points: 50,
    timeLimit: 180,
    locked: true,
    completionRate: 25
  }
]

export default function CodeChallenges({ selectedObject }: { selectedObject: string }) {
  const [challenges, setChallenges] = useState<Challenge[]>(SAMPLE_CHALLENGES)
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [code, setCode] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<ChallengeResult | null>(null)
  const [showHints, setShowHints] = useState(false)
  const [currentHintIndex, setCurrentHintIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [showSolution, setShowSolution] = useState(false)
  const [totalPoints, setTotalPoints] = useState(0)
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set())
  
  const { trackInteraction } = usePerformanceTracking()

  // Filter challenges for current object
  const objectChallenges = challenges.filter(c => 
    c.objectName === selectedObject || c.category === selectedObject
  )

  // Timer for timed challenges
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return
    
    const timer = setTimeout(() => {
      setTimeRemaining(prev => prev ? prev - 1 : null)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [timeRemaining])

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeRemaining === 0 && selectedChallenge) {
      runChallenge()
    }
  }, [timeRemaining])

  const selectChallenge = useCallback((challenge: Challenge) => {
    if (challenge.locked && !completedChallenges.has(challenge.id)) {
      // Check if previous challenges are completed
      const previousChallenges = challenges.filter(c => 
        parseInt(c.id) < parseInt(challenge.id)
      )
      const allPreviousCompleted = previousChallenges.every(c => 
        completedChallenges.has(c.id)
      )
      
      if (!allPreviousCompleted) {
        alert('Complete previous challenges to unlock this one!')
        return
      }
    }
    
    setSelectedChallenge(challenge)
    setCode(challenge.initialCode)
    setResult(null)
    setShowHints(false)
    setCurrentHintIndex(0)
    setShowSolution(false)
    
    if (challenge.timeLimit) {
      setTimeRemaining(challenge.timeLimit)
    } else {
      setTimeRemaining(null)
    }
    
    trackInteraction('challenge_select', challenge.id, {
      difficulty: challenge.difficulty,
      category: challenge.category
    })
  }, [challenges, completedChallenges, trackInteraction])

  const runChallenge = useCallback(async () => {
    if (!selectedChallenge || !code) return
    
    setIsRunning(true)
    const startTime = Date.now()
    const testResults: TestResult[] = []
    let testsPassed = 0
    
    try {
      // Create function from code
      const func = new Function('return ' + code)()
      
      // Run each test case
      for (const test of selectedChallenge.tests) {
        try {
          const actual = await func(...test.input)
          const passed = JSON.stringify(actual) === JSON.stringify(test.expectedOutput)
          
          if (passed) testsPassed++
          
          if (!test.hidden) {
            testResults.push({
              testId: test.id,
              passed,
              expected: test.expectedOutput,
              actual,
            })
          }
        } catch (error) {
          testResults.push({
            testId: test.id,
            passed: false,
            expected: test.expectedOutput,
            actual: null,
            error: String(error)
          })
        }
      }
      
      const executionTime = Date.now() - startTime
      const allPassed = testsPassed === selectedChallenge.tests.length
      const points = allPassed ? selectedChallenge.points : Math.floor(selectedChallenge.points * (testsPassed / selectedChallenge.tests.length))
      
      const result: ChallengeResult = {
        passed: allPassed,
        testsRun: selectedChallenge.tests.length,
        testsPassed,
        executionTime,
        points,
        details: testResults
      }
      
      setResult(result)
      
      if (allPassed) {
        setCompletedChallenges(prev => new Set([...prev, selectedChallenge.id]))
        setTotalPoints(prev => prev + points)
        
        // Unlock next challenge
        const nextChallenge = challenges.find(c => 
          parseInt(c.id) === parseInt(selectedChallenge.id) + 1
        )
        if (nextChallenge) {
          setChallenges(prev => prev.map(c => 
            c.id === nextChallenge.id ? { ...c, locked: false } : c
          ))
        }
      }
      
      trackInteraction('challenge_run', selectedChallenge.id, {
        passed: allPassed,
        testsPassed,
        executionTime,
        points
      })
      
    } catch (error) {
      setResult({
        passed: false,
        testsRun: selectedChallenge.tests.length,
        testsPassed: 0,
        executionTime: Date.now() - startTime,
        points: 0,
        details: [{
          testId: 'syntax',
          passed: false,
          expected: 'Valid JavaScript',
          actual: null,
          error: String(error)
        }]
      })
    } finally {
      setIsRunning(false)
      setTimeRemaining(null)
    }
  }, [selectedChallenge, code, challenges, trackInteraction])

  const resetChallenge = useCallback(() => {
    if (selectedChallenge) {
      setCode(selectedChallenge.initialCode)
      setResult(null)
      setShowHints(false)
      setCurrentHintIndex(0)
      setShowSolution(false)
      
      if (selectedChallenge.timeLimit) {
        setTimeRemaining(selectedChallenge.timeLimit)
      }
    }
  }, [selectedChallenge])

  const showNextHint = useCallback(() => {
    if (selectedChallenge && currentHintIndex < selectedChallenge.hints.length - 1) {
      setCurrentHintIndex(prev => prev + 1)
    }
  }, [selectedChallenge, currentHintIndex])

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30'
      case 'hard': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30'
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Code Challenges
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Test your {selectedObject} knowledge
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {totalPoints}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {completedChallenges.size}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {!selectedChallenge ? (
        <div className="grid grid-cols-1 gap-3">
          {objectChallenges.length > 0 ? (
            objectChallenges.map(challenge => (
              <button
                key={challenge.id}
                onClick={() => selectChallenge(challenge)}
                disabled={challenge.locked && !completedChallenges.has(challenge.id)}
                className={`
                  w-full p-4 rounded-lg border transition-all text-left
                  ${challenge.locked && !completedChallenges.has(challenge.id)
                    ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
                    : completedChallenges.has(challenge.id)
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:shadow-md'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {challenge.locked && !completedChallenges.has(challenge.id) ? (
                      <Lock className="h-4 w-4 text-gray-400" />
                    ) : completedChallenges.has(challenge.id) ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Target className="h-4 w-4 text-purple-500" />
                    )}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {challenge.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Zap className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {challenge.points}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {challenge.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-500">
                    {challenge.timeLimit && (
                      <div className="flex items-center space-x-1">
                        <Timer className="h-3 w-3" />
                        <span>{challenge.timeLimit}s</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{challenge.completionRate}% success</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No challenges available for {selectedObject} yet</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Challenge Header */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {selectedChallenge.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {selectedChallenge.description}
                </p>
              </div>
              <button
                onClick={() => setSelectedChallenge(null)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(selectedChallenge.difficulty)}`}>
                  {selectedChallenge.difficulty}
                </span>
                <div className="flex items-center space-x-1">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">{selectedChallenge.points} points</span>
                </div>
              </div>
              
              {timeRemaining !== null && (
                <div className={`flex items-center space-x-1 ${
                  timeRemaining < 30 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  <Timer className="h-4 w-4" />
                  <span className="font-mono text-sm">{formatTime(timeRemaining)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Code Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Solution
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  <AlertCircle className="h-4 w-4" />
                </button>
                <button
                  onClick={resetChallenge}
                  className="text-xs text-gray-600 hover:text-gray-700 dark:text-gray-400"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-48 p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              spellCheck={false}
            />
          </div>

          {/* Hints */}
          {showHints && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  Hint {currentHintIndex + 1} of {selectedChallenge.hints.length}
                </h5>
                {currentHintIndex < selectedChallenge.hints.length - 1 && (
                  <button
                    onClick={showNextHint}
                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Next Hint →
                  </button>
                )}
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {selectedChallenge.hints[currentHintIndex]}
              </p>
            </div>
          )}

          {/* Test Cases */}
          <div>
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Test Cases
            </h5>
            <div className="space-y-2">
              {selectedChallenge.tests.filter(t => !t.hidden).map(test => (
                <div
                  key={test.id}
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                        {test.description}
                      </p>
                      <div className="font-mono text-xs text-gray-600 dark:text-gray-400">
                        Input: {JSON.stringify(test.input)}
                        <br />
                        Expected: {JSON.stringify(test.expectedOutput)}
                      </div>
                    </div>
                    {result && (
                      <div className="ml-3">
                        {result.details.find(r => r.testId === test.id)?.passed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Run Button */}
          <div className="flex items-center justify-between">
            <button
              onClick={runChallenge}
              disabled={isRunning}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg 
                       hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Play className="h-4 w-4" />
              <span>{isRunning ? 'Running...' : 'Run Tests'}</span>
            </button>
            
            {completedChallenges.has(selectedChallenge.id) && (
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400"
              >
                {showSolution ? 'Hide' : 'Show'} Solution
              </button>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className={`p-4 rounded-lg border ${
              result.passed 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {result.passed ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="font-medium text-green-800 dark:text-green-300">
                        All tests passed!
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <span className="font-medium text-red-800 dark:text-red-300">
                        {result.testsPassed} of {result.testsRun} tests passed
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="flex items-center space-x-1">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">+{result.points}</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">
                    {result.executionTime}ms
                  </span>
                </div>
              </div>
              
              {result.details.filter(d => !d.passed).map(detail => (
                <div key={detail.testId} className="mt-2 p-2 bg-white dark:bg-gray-800 rounded">
                  <p className="text-xs text-red-600 dark:text-red-400 font-mono">
                    {detail.error || `Expected: ${JSON.stringify(detail.expected)}, Got: ${JSON.stringify(detail.actual)}`}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Solution */}
          {showSolution && (
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Solution
              </h5>
              <pre className="text-xs font-mono text-gray-600 dark:text-gray-400 overflow-x-auto">
                {selectedChallenge.solution}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}