'use client'

import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { Play, Copy, RotateCcw, Download, Upload, Share2, Settings, Terminal, Eye, EyeOff, Maximize2, Minimize2, Check, AlertTriangle, Info, Save, FileText } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { usePerformanceTracking } from '../utils/performance'
import { executeCodeSafely } from '../utils/errorHandling'

interface CodeRunnerProps {
  selectedObject: string
  onSelectObject: (objectName: string) => void
}

interface ConsoleMessage {
  id: string
  type: 'log' | 'error' | 'warn' | 'info' | 'success'
  content: unknown[]
  timestamp: Date
  source?: string
}

interface CodeExecution {
  id: string
  code: string
  output: ConsoleMessage[]
  errors: string[]
  duration: number
  timestamp: Date
  success: boolean
}

export default function CodeRunner({ selectedObject }: CodeRunnerProps) {
  const [code, setCode] = useState('// Start coding here...')
  const [output, setOutput] = useState<ConsoleMessage[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [showConsole, setShowConsole] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [executionHistory, setExecutionHistory] = useState<CodeExecution[]>([])
  const [autoSave, setAutoSave] = useState(true)
  
  const { trackInteraction, measureAsync } = usePerformanceTracking()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-save code to localStorage
  useEffect(() => {
    if (autoSave && code) {
      localStorage.setItem(`code-${selectedObject}`, code)
    }
  }, [code, selectedObject, autoSave])

  // Load saved code when object changes
  useEffect(() => {
    const savedCode = localStorage.getItem(`code-${selectedObject}`)
    if (savedCode) {
      setCode(savedCode)
    } else {
      setCode(`// ${selectedObject} examples\n// Start coding here...`)
    }
  }, [selectedObject])

  const runCode = useCallback(async () => {
    if (!code.trim()) return

    setIsRunning(true)
    const startTime = Date.now()
    const executionId = Date.now().toString()

    try {
      const result = await measureAsync(
        executeCodeSafely(code),
        'code_execution'
      )

      const duration = Date.now() - startTime
      const newMessages: ConsoleMessage[] = []

      // Process console output
      if (result.consoleOutput) {
        result.consoleOutput.forEach((msg, index) => {
          newMessages.push({
            id: `${executionId}-${index}`,
            type: msg.type || 'log',
            content: msg.content,
            timestamp: new Date(),
            source: 'user-code'
          })
        })
      }

      // Add execution result
      if (result.result !== undefined) {
        newMessages.push({
          id: `${executionId}-result`,
          type: 'success',
          content: [result.result],
          timestamp: new Date(),
          source: 'execution-result'
        })
      }

      // Add errors if any
      if (result.errors.length > 0) {
        result.errors.forEach((error, index) => {
          newMessages.push({
            id: `${executionId}-error-${index}`,
            type: 'error',
            content: [error],
            timestamp: new Date(),
            source: 'execution-error'
          })
        })
      }

      setOutput(prev => [...newMessages, ...prev])
      
      // Save to execution history
      const execution: CodeExecution = {
        id: executionId,
        code,
        output: newMessages,
        errors: result.errors,
        duration,
        timestamp: new Date(),
        success: result.errors.length === 0
      }
      
      setExecutionHistory(prev => [execution, ...prev.slice(0, 9)]) // Keep last 10

      trackInteraction('code_run', selectedObject, {
        codeLength: code.length,
        duration,
        success: result.errors.length === 0,
        errorCount: result.errors.length
      })

    } catch (error) {
      const duration = Date.now() - startTime
      const errorMessage: ConsoleMessage = {
        id: `${executionId}-error`,
        type: 'error',
        content: [String(error)],
        timestamp: new Date(),
        source: 'execution-error'
      }
      
      setOutput(prev => [errorMessage, ...prev])
      
      trackInteraction('code_run_error', selectedObject, {
        codeLength: code.length,
        duration,
        error: String(error)
      })
    } finally {
      setIsRunning(false)
    }
  }, [code, selectedObject, trackInteraction, measureAsync])

  const resetCode = useCallback(() => {
    setCode(`// ${selectedObject} examples\n// Start coding here...`)
    setOutput([])
    trackInteraction('code_reset', selectedObject)
  }, [selectedObject, trackInteraction])

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      trackInteraction('code_copy', selectedObject)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }, [code, selectedObject, trackInteraction])

  const downloadCode = useCallback(() => {
    const blob = new Blob([code], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedObject}-example.js`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    trackInteraction('code_download', selectedObject)
  }, [code, selectedObject, trackInteraction])

  const uploadCode = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setCode(content)
        trackInteraction('code_upload', selectedObject)
      }
      reader.readAsText(file)
    }
  }, [selectedObject, trackInteraction])

  const clearConsole = useCallback(() => {
    setOutput([])
    trackInteraction('console_clear', selectedObject)
  }, [selectedObject, trackInteraction])

  const formatCode = useCallback(() => {
    try {
      // Basic code formatting (you could integrate with prettier here)
      const formatted = code
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n')
      setCode(formatted)
      trackInteraction('code_format', selectedObject)
    } catch (error) {
      console.error('Failed to format code:', error)
    }
  }, [code, selectedObject, trackInteraction])

  const getMessageIcon = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'warn': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'info': return <Info className="h-4 w-4 text-blue-500" />
      case 'success': return <Check className="h-4 w-4 text-green-500" />
      default: return <Terminal className="h-4 w-4 text-gray-500" />
    }
  }

  const getMessageClass = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error': return 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/20'
      case 'warn': return 'text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20'
      case 'info': return 'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
      case 'success': return 'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/20'
      default: return 'text-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20'
    }
  }

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900 p-4' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Code Playground
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoSave(!autoSave)}
            className={`p-2 rounded-md transition-colors ${
              autoSave 
                ? 'text-green-600 bg-green-100 dark:bg-green-900/20' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            title={autoSave ? 'Auto-save enabled' : 'Auto-save disabled'}
          >
            <Save className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Code Editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              JavaScript Code
            </label>
            <div className="flex items-center space-x-1">
              <button
                onClick={formatCode}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                title="Format code"
              >
                <FileText className="h-4 w-4" />
              </button>
              <button
                onClick={copyCode}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                title="Copy code"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={resetCode}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                title="Reset code"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-48 sm:h-64 lg:h-80 p-3 sm:p-4 font-mono text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
              placeholder="// Start coding here..."
              spellCheck={false}
            />
            
            {/* File Upload */}
            <input
              type="file"
              accept=".js,.ts,.txt"
              onChange={uploadCode}
              className="hidden"
              id="code-upload"
            />
            <label
              htmlFor="code-upload"
              className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors cursor-pointer"
              title="Upload code file"
            >
              <Upload className="h-4 w-4" />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={runCode}
                disabled={isRunning || !code.trim()}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="h-4 w-4" />
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </button>
              
              <button
                onClick={downloadCode}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400">
              {code.length} characters
            </div>
          </div>
        </div>

        {/* Console Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Console Output
            </label>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowConsole(!showConsole)}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                title={showConsole ? 'Hide console' : 'Show console'}
              >
                {showConsole ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button
                onClick={clearConsole}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                title="Clear console"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {showConsole && (
            <div className="h-64 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg overflow-y-auto">
              {output.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <Terminal className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Console output will appear here</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {output.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-2 p-2 rounded-md ${getMessageClass(message.type)}`}
                    >
                      {getMessageIcon(message.type)}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                        <div className="text-sm font-mono">
                          {message.content.map((item, index) => (
                            <span key={index}>
                              {typeof item === 'object' ? JSON.stringify(item, null, 2) : String(item)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Execution History */}
      {executionHistory.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Recent Executions
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {executionHistory.slice(0, 5).map((execution) => (
              <div
                key={execution.id}
                className={`flex items-center justify-between p-2 rounded-md text-sm ${
                  execution.success 
                    ? 'bg-green-50 dark:bg-green-900/20' 
                    : 'bg-red-50 dark:bg-red-900/20'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {execution.success ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="font-mono">
                    {execution.code.substring(0, 50)}...
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {execution.duration}ms
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
