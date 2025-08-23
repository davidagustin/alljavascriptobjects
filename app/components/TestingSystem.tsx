'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Play, CheckCircle, XCircle, AlertCircle, Clock, Target, Zap, Award, TrendingUp, BarChart3 } from 'lucide-react'

interface TestCase {
  id: string
  name: string
  description: string
  code: string
  expected: any
  timeout: number
  category: string
}

interface TestResult {
  id: string
  testId: string
  passed: boolean
  actual: any
  expected: any
  error?: string
  duration: number
  timestamp: Date
}

interface TestSuite {
  id: string
  name: string
  description: string
  tests: TestCase[]
  category: string
}

const BUILT_IN_TEST_SUITES: TestSuite[] = [
  {
    id: 'array-basics',
    name: 'Array Fundamentals',
    description: 'Basic array operations and methods',
    category: 'Collections',
    tests: [
      {
        id: 'array-creation',
        name: 'Array Creation',
        description: 'Test various ways to create arrays',
        code: `
          const arr1 = new Array(3);
          const arr2 = [1, 2, 3];
          const arr3 = Array.of(1, 2, 3);
          const arr4 = Array.from('abc');
          return {
            length1: arr1.length,
            content2: arr2,
            content3: arr3,
            content4: arr4
          };
        `,
        expected: {
          length1: 3,
          content2: [1, 2, 3],
          content3: [1, 2, 3],
          content4: ['a', 'b', 'c']
        },
        timeout: 1000,
        category: 'basic'
      },
      {
        id: 'array-methods',
        name: 'Array Methods',
        description: 'Test common array methods',
        code: `
          const numbers = [1, 2, 3, 4, 5];
          return {
            map: numbers.map(x => x * 2),
            filter: numbers.filter(x => x % 2 === 0),
            reduce: numbers.reduce((acc, x) => acc + x, 0),
            find: numbers.find(x => x > 3),
            some: numbers.some(x => x > 3),
            every: numbers.every(x => x > 0)
          };
        `,
        expected: {
          map: [2, 4, 6, 8, 10],
          filter: [2, 4],
          reduce: 15,
          find: 4,
          some: true,
          every: true
        },
        timeout: 1000,
        category: 'methods'
      }
    ]
  },
  {
    id: 'promise-async',
    name: 'Promises & Async',
    description: 'Asynchronous JavaScript patterns',
    category: 'Control Flow',
    tests: [
      {
        id: 'promise-basic',
        name: 'Basic Promise',
        description: 'Test promise creation and resolution',
        code: `
          const promise = new Promise(resolve => {
            setTimeout(() => resolve('success'), 100);
          });
          return promise;
        `,
        expected: 'success',
        timeout: 200,
        category: 'async'
      },
      {
        id: 'async-await',
        name: 'Async/Await',
        description: 'Test async/await syntax',
        code: `
          async function getData() {
            await new Promise(resolve => setTimeout(resolve, 50));
            return { data: 'test', timestamp: Date.now() };
          }
          const result = await getData();
          return result.data;
        `,
        expected: 'test',
        timeout: 200,
        category: 'async'
      }
    ]
  },
  {
    id: 'map-set',
    name: 'Map & Set Collections',
    description: 'Modern collection types',
    category: 'Collections',
    tests: [
      {
        id: 'map-operations',
        name: 'Map Operations',
        description: 'Test Map creation and operations',
        code: `
          const map = new Map();
          map.set('key1', 'value1');
          map.set(42, 'number key');
          map.set({}, 'object key');
          
          return {
            size: map.size,
            hasKey1: map.has('key1'),
            getValue1: map.get('key1'),
            hasNumber: map.has(42),
            keys: Array.from(map.keys()).filter(k => typeof k !== 'object')
          };
        `,
        expected: {
          size: 3,
          hasKey1: true,
          getValue1: 'value1',
          hasNumber: true,
          keys: ['key1', 42]
        },
        timeout: 1000,
        category: 'collections'
      },
      {
        id: 'set-operations',
        name: 'Set Operations',
        description: 'Test Set creation and operations',
        code: `
          const set = new Set([1, 2, 2, 3, 3, 4]);
          set.add(5);
          set.delete(1);
          
          return {
            size: set.size,
            hasTwo: set.has(2),
            hasOne: set.has(1),
            values: Array.from(set).sort()
          };
        `,
        expected: {
          size: 4,
          hasTwo: true,
          hasOne: false,
          values: [2, 3, 4, 5]
        },
        timeout: 1000,
        category: 'collections'
      }
    ]
  }
]

export default function TestingSystem() {
  const [testSuites] = useState<TestSuite[]>(BUILT_IN_TEST_SUITES)
  const [selectedSuite, setSelectedSuite] = useState<string>('')
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set())
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [showResults, setShowResults] = useState(true)
  const [autoRun, setAutoRun] = useState(false)
  const abortControllerRef = useRef<AbortController>()

  const executeTest = useCallback(async (test: TestCase): Promise<TestResult> => {
    const startTime = Date.now()
    
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Test timeout')), test.timeout)
      })

      const codePromise = new Promise((resolve, reject) => {
        try {
          const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
          const testFunction = new AsyncFunction(test.code)
          const result = testFunction()
          
          if (result instanceof Promise) {
            result.then(resolve).catch(reject)
          } else {
            resolve(result)
          }
        } catch (error) {
          reject(error)
        }
      })

      const actual = await Promise.race([codePromise, timeoutPromise])
      const duration = Date.now() - startTime
      const passed = JSON.stringify(actual) === JSON.stringify(test.expected)

      return {
        id: Date.now() + Math.random().toString(),
        testId: test.id,
        passed,
        actual,
        expected: test.expected,
        duration,
        timestamp: new Date()
      }
    } catch (error) {
      const duration = Date.now() - startTime
      return {
        id: Date.now() + Math.random().toString(),
        testId: test.id,
        passed: false,
        actual: null,
        expected: test.expected,
        error: error instanceof Error ? error.message : String(error),
        duration,
        timestamp: new Date()
      }
    }
  }, [])

  const runTest = useCallback(async (test: TestCase) => {
    setRunningTests(prev => new Set(prev).add(test.id))
    
    try {
      const result = await executeTest(test)
      setTestResults(prev => {
        const filtered = prev.filter(r => r.testId !== test.id)
        return [...filtered, result]
      })
    } finally {
      setRunningTests(prev => {
        const newSet = new Set(prev)
        newSet.delete(test.id)
        return newSet
      })
    }
  }, [executeTest])

  const runTestSuite = useCallback(async (suite: TestSuite) => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()
    
    setTestResults(prev => prev.filter(r => !suite.tests.some(t => t.id === r.testId)))
    
    for (const test of suite.tests) {
      if (abortControllerRef.current.signal.aborted) break
      await runTest(test)
    }
  }, [runTest])

  const runAllTests = useCallback(async () => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()
    
    setTestResults([])
    
    for (const suite of testSuites) {
      if (abortControllerRef.current.signal.aborted) break
      await runTestSuite(suite)
    }
  }, [testSuites, runTestSuite])

  const stopTests = useCallback(() => {
    abortControllerRef.current?.abort()
    setRunningTests(new Set())
  }, [])

  const getTestResult = useCallback((testId: string) => {
    return testResults.find(r => r.testId === testId)
  }, [testResults])

  const getSuiteStats = useCallback((suite: TestSuite) => {
    const suiteResults = suite.tests.map(test => getTestResult(test.id)).filter(Boolean) as TestResult[]
    const passed = suiteResults.filter(r => r.passed).length
    const total = suite.tests.length
    const avgDuration = suiteResults.length > 0 
      ? Math.round(suiteResults.reduce((acc, r) => acc + r.duration, 0) / suiteResults.length)
      : 0
    
    return { passed, total, avgDuration, results: suiteResults }
  }, [getTestResult])

  const overallStats = useCallback(() => {
    const allTests = testSuites.flatMap(s => s.tests)
    const allResults = testResults
    const passed = allResults.filter(r => r.passed).length
    const failed = allResults.filter(r => !r.passed).length
    const total = allTests.length
    const coverage = total > 0 ? Math.round((allResults.length / total) * 100) : 0
    const avgDuration = allResults.length > 0
      ? Math.round(allResults.reduce((acc, r) => acc + r.duration, 0) / allResults.length)
      : 0

    return { passed, failed, total, coverage, avgDuration }
  }, [testSuites, testResults])

  const isAnyTestRunning = runningTests.size > 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Testing System
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automated testing for JavaScript objects and concepts
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={isAnyTestRunning ? stopTests : runAllTests}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isAnyTestRunning 
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isAnyTestRunning ? (
                <>
                  <XCircle className="h-4 w-4" />
                  <span>Stop Tests</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Run All Tests</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
          {(() => {
            const stats = overallStats()
            return (
              <>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.passed}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Passed</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {stats.failed}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Failed</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.total}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.coverage}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Coverage</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {stats.avgDuration}ms
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Avg Time</div>
                </div>
              </>
            )
          })()}
        </div>
      </div>

      {/* Test Suites */}
      <div className="p-6 space-y-6">
        {testSuites.map(suite => {
          const stats = getSuiteStats(suite)
          const isRunning = suite.tests.some(test => runningTests.has(test.id))
          const successRate = stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0
          
          return (
            <div key={suite.id} className="border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      stats.results.length === 0 ? 'bg-gray-200 dark:bg-gray-600' :
                      stats.passed === stats.total ? 'bg-green-100 dark:bg-green-900' :
                      stats.passed > 0 ? 'bg-yellow-100 dark:bg-yellow-900' :
                      'bg-red-100 dark:bg-red-900'
                    }`}>
                      {isRunning ? (
                        <Clock className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
                      ) : stats.results.length === 0 ? (
                        <AlertCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      ) : stats.passed === stats.total ? (
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {suite.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {suite.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {stats.passed}/{stats.total} passed
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {successRate}% success rate
                      </div>
                    </div>
                    
                    <button
                      onClick={() => runTestSuite(suite)}
                      disabled={isRunning}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Play className="h-4 w-4" />
                      <span>Run Suite</span>
                    </button>
                  </div>
                </div>
                
                {/* Progress Bar */}
                {stats.total > 0 && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          stats.passed === stats.total ? 'bg-green-600' :
                          stats.passed > 0 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${successRate}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Individual Tests */}
              <div className="p-4 space-y-3">
                {suite.tests.map(test => {
                  const result = getTestResult(test.id)
                  const isTestRunning = runningTests.has(test.id)
                  
                  return (
                    <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-1 rounded ${
                          isTestRunning ? 'bg-blue-100 dark:bg-blue-900' :
                          !result ? 'bg-gray-100 dark:bg-gray-600' :
                          result.passed ? 'bg-green-100 dark:bg-green-900' :
                          'bg-red-100 dark:bg-red-900'
                        }`}>
                          {isTestRunning ? (
                            <Clock className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
                          ) : !result ? (
                            <AlertCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          ) : result.passed ? (
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {test.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {test.description}
                          </div>
                          {result && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Completed in {result.duration}ms
                              {result.error && (
                                <span className="text-red-600 dark:text-red-400 ml-2">
                                  Error: {result.error}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => runTest(test)}
                        disabled={isTestRunning}
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 disabled:opacity-50 text-gray-700 dark:text-gray-300 rounded text-xs font-medium transition-colors"
                      >
                        {isTestRunning ? 'Running...' : 'Run'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}