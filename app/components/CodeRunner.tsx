'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Play, Square, RotateCcw, Copy, Download, Upload, Settings, AlertCircle, CheckCircle, Clock } from 'lucide-react'

interface CodeRunnerProps {
  initialCode?: string
  onOutput?: (output: string) => void
  onError?: (error: string) => void
  theme?: 'light' | 'dark'
}

interface ExecutionResult {
  output: string[]
  errors: string[]
  executionTime: number
  memoryUsage?: number
}

export default function CodeRunner({ 
  initialCode = '// Write your JavaScript code here\nconsole.log("Hello, World!");', 
  onOutput,
  onError,
  theme = 'light'
}: CodeRunnerProps) {
  const [code, setCode] = useState(initialCode)
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<ExecutionResult>({ output: [], errors: [], executionTime: 0 })
  const [executionMode, setExecutionMode] = useState<'safe' | 'strict' | 'experimental'>('safe')
  const [autoRun, setAutoRun] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const workerRef = useRef<Worker>()

  // Auto-run effect
  useEffect(() => {
    if (autoRun && code) {
      const timer = setTimeout(() => {
        runCode()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [code, autoRun])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (workerRef.current) workerRef.current.terminate()
    }
  }, [])

  const createSafeEnvironment = () => {
    const safeGlobals = {
      console: {
        log: (...args: any[]) => {
          const output = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ')
          return { type: 'log', content: output }
        },
        error: (...args: any[]) => {
          const output = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ')
          return { type: 'error', content: output }
        },
        warn: (...args: any[]) => {
          const output = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ')
          return { type: 'warn', content: output }
        },
        info: (...args: any[]) => {
          const output = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ')
          return { type: 'info', content: output }
        }
      },
      setTimeout: (fn: Function, delay: number) => {
        if (delay > 5000) throw new Error('Timeout delay cannot exceed 5000ms')
        return setTimeout(fn, Math.min(delay, 5000))
      },
      setInterval: (fn: Function, delay: number) => {
        if (delay > 5000) throw new Error('Interval delay cannot exceed 5000ms')
        return setInterval(fn, Math.min(delay, 5000))
      },
      clearTimeout,
      clearInterval,
      Math,
      Date,
      JSON,
      Array,
      Object,
      String,
      Number,
      Boolean,
      RegExp,
      Error,
      TypeError,
      RangeError,
      SyntaxError,
      ReferenceError,
      Promise,
      Map,
      Set,
      WeakMap,
      WeakSet,
      Symbol,
      BigInt,
      Int8Array,
      Uint8Array,
      Int16Array,
      Uint16Array,
      Int32Array,
      Uint32Array,
      Float32Array,
      Float64Array,
      BigInt64Array,
      BigUint64Array,
      DataView,
      ArrayBuffer,
      SharedArrayBuffer,
      Atomics,
      Reflect,
      Proxy
    }

    return safeGlobals
  }

  const runCode = useCallback(async () => {
    setIsRunning(true)
    const startTime = performance.now()
    
    try {
      const outputs: string[] = []
      const errors: string[] = []
      
      // Create safe execution environment
      const safeGlobals = createSafeEnvironment()
      
      // Override console methods to capture output
      const originalConsole = { ...console }
      const capturedOutputs: Array<{ type: string; content: string }> = []
      
      Object.keys(safeGlobals.console).forEach(key => {
        const original = console[key as keyof Console]
        console[key as keyof Console] = (...args: any[]) => {
          const result = safeGlobals.console[key as keyof typeof safeGlobals.console](...args)
          if (result) capturedOutputs.push(result)
          original.apply(console, args)
        }
      })

      // Execute code with timeout
      const timeoutPromise = new Promise((_, reject) => {
        timeoutRef.current = setTimeout(() => {
          reject(new Error('Execution timeout (5 seconds)'))
        }, 5000)
      })

      const executionPromise = new Promise(() => {
        try {
          // Create function with restricted scope
          const func = new Function(...Object.keys(safeGlobals), code)
          func(...Object.values(safeGlobals))
        } catch (error) {
          throw error
        }
      })

      await Promise.race([executionPromise, timeoutPromise])
      
      // Process captured outputs
      capturedOutputs.forEach(output => {
        if (output.type === 'error') {
          errors.push(output.content)
        } else {
          outputs.push(`[${output.type.toUpperCase()}] ${output.content}`)
        }
      })

      const executionTime = performance.now() - startTime
      
      const result: ExecutionResult = {
        output: outputs,
        errors,
        executionTime
      }

      setResults(result)
      
      if (outputs.length > 0) {
        onOutput?.(outputs.join('\n'))
      }
      if (errors.length > 0) {
        onError?.(errors.join('\n'))
      }

    } catch (error) {
      const executionTime = performance.now() - startTime
      const errorMessage = error instanceof Error ? error.message : String(error)
      
      setResults({
        output: [],
        errors: [errorMessage],
        executionTime
      })
      
      onError?.(errorMessage)
    } finally {
      setIsRunning(false)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [code, onOutput, onError])

  const stopExecution = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (workerRef.current) {
      workerRef.current.terminate()
    }
    setIsRunning(false)
  }, [])

  const resetCode = useCallback(() => {
    setCode(initialCode)
    setResults({ output: [], errors: [], executionTime: 0 })
  }, [initialCode])

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }, [code])

  const downloadCode = useCallback(() => {
    const blob = new Blob([code], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'code.js'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [code])

  const uploadCode = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setCode(content)
      }
      reader.readAsText(file)
    }
  }, [])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Play className="h-5 w-5 mr-2" />
            Enhanced Code Runner
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Execution Mode
              </label>
              <select
                value={executionMode}
                onChange={(e) => setExecutionMode(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600"
              >
                <option value="safe">Safe (Recommended)</option>
                <option value="strict">Strict</option>
                <option value="experimental">Experimental</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Auto-run on changes
              </label>
              <input
                type="checkbox"
                checked={autoRun}
                onChange={(e) => setAutoRun(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* Code Editor */}
      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              JavaScript Code
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept=".js,.txt"
                onChange={uploadCode}
                className="hidden"
                id="upload-code"
              />
              <label
                htmlFor="upload-code"
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors"
                title="Upload code file"
              >
                <Upload className="h-4 w-4" />
              </label>
              <button
                onClick={downloadCode}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Download code"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={copyCode}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Copy code"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-64 p-4 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-900 dark:bg-gray-950 text-green-400"
            placeholder="Write your JavaScript code here..."
            spellCheck={false}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={isRunning ? stopExecution : runCode}
              disabled={!code.trim()}
              className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center ${
                isRunning
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {isRunning ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Code
                </>
              )}
            </button>
            <button
              onClick={resetCode}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </button>
          </div>
          
          {results.executionTime > 0 && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-1" />
              {results.executionTime.toFixed(2)}ms
            </div>
          )}
        </div>

        {/* Results */}
        {(results.output.length > 0 || results.errors.length > 0) && (
          <div className="space-y-4">
            {/* Output */}
            {results.output.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Output
                </h4>
                <div className="p-4 bg-gray-900 dark:bg-gray-950 text-green-400 rounded-md font-mono text-sm overflow-auto max-h-48">
                  <pre className="whitespace-pre-wrap">{results.output.join('\n')}</pre>
                </div>
              </div>
            )}

            {/* Errors */}
            {results.errors.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                  Errors
                </h4>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <pre className="text-red-700 dark:text-red-300 text-sm whitespace-pre-wrap">
                    {results.errors.join('\n')}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            💡 Tips
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Use console.log() to see output</li>
            <li>• Code runs in a safe environment with 5-second timeout</li>
            <li>• Access to most JavaScript built-in objects and methods</li>
            <li>• Enable auto-run to see results as you type</li>
            <li>• Upload .js files or download your code</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
