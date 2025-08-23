'use client'

import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { Play, Square, RotateCcw, Download, Upload, Share2, Settings, Terminal, Eye, EyeOff, Maximize2, Minimize2, Copy, Check, AlertTriangle, Info } from 'lucide-react'

interface ConsoleMessage {
  id: string
  type: 'log' | 'error' | 'warn' | 'info'
  content: unknown[]
  timestamp: Date
  source?: string
}

interface PlaygroundSettings {
  theme: 'light' | 'dark'
  fontSize: number
  tabSize: number
  showLineNumbers: boolean
  wordWrap: boolean
  autoRun: boolean
  timeout: number
}

interface PlaygroundState {
  code: string
  isRunning: boolean
  consoleMessages: ConsoleMessage[]
  settings: PlaygroundSettings
  isFullscreen: boolean
  showConsole: boolean
}

const DEFAULT_CODE = `// JavaScript Objects Playground
// Try experimenting with different JavaScript objects!

// Example: Working with Arrays
const numbers = [1, 2, 3, 4, 5];
console.log('Original array:', numbers);

const doubled = numbers.map(n => n * 2);
console.log('Doubled:', doubled);

const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log('Sum:', sum);

// Example: Working with Maps
const userRoles = new Map();
userRoles.set('alice', 'admin');
userRoles.set('bob', 'user');
userRoles.set('charlie', 'moderator');

console.log('User roles:', userRoles);
console.log('Alice\\'s role:', userRoles.get('alice'));

// Example: Working with Sets
const uniqueNumbers = new Set([1, 2, 2, 3, 3, 4, 5]);
console.log('Unique numbers:', [...uniqueNumbers]);

// Try your own code here!
`

export default function InteractivePlayground({ 
  initialCode = DEFAULT_CODE,
  objectContext = null 
}: {
  initialCode?: string
  objectContext?: string | null
}) {
  const [state, setState] = useState<PlaygroundState>({
    code: initialCode,
    isRunning: false,
    consoleMessages: [],
    settings: {
      theme: 'dark',
      fontSize: 14,
      tabSize: 2,
      showLineNumbers: true,
      wordWrap: true,
      autoRun: false,
      timeout: 5000
    },
    isFullscreen: false,
    showConsole: true
  })

  const [showSettings, setShowSettings] = useState(false)
  const [copied, setCopied] = useState(false)
  const codeEditorRef = useRef<HTMLTextAreaElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const workerRef = useRef<Worker>()

  // Enhanced console capture
  const captureConsole = useCallback(() => {
    const originalConsole = { ...console }
    const messages: ConsoleMessage[] = []

    const createLogger = (type: ConsoleMessage['type']) => (...args: unknown[]) => {
      const message: ConsoleMessage = {
        id: Date.now() + Math.random().toString(),
        type,
        content: args,
        timestamp: new Date(),
        source: 'user'
      }
      messages.push(message)
      originalConsole[type](...args)
    }

    // Override console methods
    console.log = createLogger('log')
    console.error = createLogger('error')
    console.warn = createLogger('warn')
    console.info = createLogger('info')

    return {
      messages,
      restore: () => {
        Object.assign(console, originalConsole)
      }
    }
  }, [])

  // Safe code execution with timeout
  const executeCode = useCallback(async (code: string) => {
    setState(prev => ({ 
      ...prev, 
      isRunning: true, 
      consoleMessages: [] 
    }))

    const { messages, restore } = captureConsole()

    try {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set execution timeout
      const timeoutPromise = new Promise((_, reject) => {
        timeoutRef.current = setTimeout(() => {
          reject(new Error(`Code execution timed out after ${state.settings.timeout}ms`))
        }, state.settings.timeout)
      })

      // Execute code in try-catch
      const codePromise = new Promise((resolve, reject) => {
        try {
          // Create a safer execution context
          const safeCode = `
            // Prevent access to dangerous APIs
            const fetch = undefined;
            const XMLHttpRequest = undefined;
            const WebSocket = undefined;
            
            // Inject helpful utilities
            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
            const range = (start, end) => Array.from({length: end - start}, (_, i) => start + i);
            
            // User code starts here
            ${code}
          `
          
          // Use Function constructor for safer evaluation
          const result = new Function(safeCode)()
          
          // Handle promises
          if (result instanceof Promise) {
            result.then(resolve).catch(reject)
          } else {
            resolve(result)
          }
        } catch (error) {
          reject(error)
        }
      })

      await Promise.race([codePromise, timeoutPromise])

      // Clear timeout if code completed successfully
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

    } catch (error) {
      const errorMessage: ConsoleMessage = {
        id: Date.now() + Math.random().toString(),
        type: 'error',
        content: [error instanceof Error ? error.message : String(error)],
        timestamp: new Date(),
        source: 'system'
      }
      messages.push(errorMessage)
    } finally {
      restore()
      
      setState(prev => ({
        ...prev,
        isRunning: false,
        consoleMessages: messages
      }))
    }
  }, [state.settings.timeout, captureConsole])

  // Code execution handler
  const handleRunCode = useCallback(() => {
    executeCode(state.code)
  }, [state.code, executeCode])

  // Stop execution
  const handleStopExecution = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (workerRef.current) {
      workerRef.current.terminate()
      workerRef.current = undefined
    }
    setState(prev => ({ ...prev, isRunning: false }))
  }, [])

  // Reset playground
  const handleReset = useCallback(() => {
    setState(prev => ({
      ...prev,
      code: DEFAULT_CODE,
      consoleMessages: [],
      isRunning: false
    }))
  }, [])

  // Copy code to clipboard
  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(state.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }, [state.code])

  // Download code as file
  const handleDownloadCode = useCallback(() => {
    const blob = new Blob([state.code], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'playground-code.js'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [state.code])

  // Load code from file
  const handleUploadCode = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.js,.ts,.txt'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const code = e.target?.result as string
          setState(prev => ({ ...prev, code }))
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }, [])

  // Share code (generate shareable link)
  const handleShareCode = useCallback(async () => {
    const encoded = btoa(encodeURIComponent(state.code))
    const url = `${window.location.origin}${window.location.pathname}?code=${encoded}`
    
    try {
      await navigator.clipboard.writeText(url)
      // Show success notification
      console.log('Share link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy share link:', error)
    }
  }, [state.code])

  // Format console message for display
  const formatConsoleMessage = useCallback((content: unknown[]): string => {
    return content.map(item => {
      if (typeof item === 'object') {
        try {
          return JSON.stringify(item, null, 2)
        } catch {
          return String(item)
        }
      }
      return String(item)
    }).join(' ')
  }, [])

  // Get message icon based on type
  const getMessageIcon = useCallback((type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'warn':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <Terminal className="h-4 w-4 text-gray-500" />
    }
  }, [])

  // Auto-run on code change (if enabled)
  useEffect(() => {
    if (state.settings.autoRun && state.code.trim()) {
      const debounceTimer = setTimeout(() => {
        executeCode(state.code)
      }, 1000)
      
      return () => clearTimeout(debounceTimer)
    }
  }, [state.code, state.settings.autoRun, executeCode])

  // Load code from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const codeParam = urlParams.get('code')
    if (codeParam) {
      try {
        const decodedCode = decodeURIComponent(atob(codeParam))
        setState(prev => ({ ...prev, code: decodedCode }))
      } catch (error) {
        console.error('Failed to load code from URL:', error)
      }
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'Enter':
            e.preventDefault()
            if (!state.isRunning) {
              handleRunCode()
            } else {
              handleStopExecution()
            }
            break
          case 's':
            e.preventDefault()
            handleDownloadCode()
            break
          case 'r':
            e.preventDefault()
            handleReset()
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.isRunning, handleRunCode, handleStopExecution, handleDownloadCode, handleReset])

  // Memoized editor styles
  const editorStyles = useMemo(() => ({
    fontSize: state.settings.fontSize,
    tabSize: state.settings.tabSize,
    fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    lineHeight: 1.5,
  }), [state.settings.fontSize, state.settings.tabSize])

  return (
    <div className={`${state.isFullscreen ? 'fixed inset-0 z-50' : ''} bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <button
              onClick={state.isRunning ? handleStopExecution : handleRunCode}
              disabled={!state.code.trim()}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                state.isRunning
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:text-gray-500'
              }`}
            >
              {state.isRunning ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{state.isRunning ? 'Stop' : 'Run'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              title="Reset Code (Ctrl+R)"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          <div className="h-4 border-l border-gray-300 dark:border-gray-600" />

          <div className="flex items-center space-x-1">
            <button
              onClick={handleCopyCode}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              title="Copy Code"
            >
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </button>

            <button
              onClick={handleDownloadCode}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              title="Download Code (Ctrl+S)"
            >
              <Download className="h-4 w-4" />
            </button>

            <button
              onClick={handleUploadCode}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              title="Upload Code"
            >
              <Upload className="h-4 w-4" />
            </button>

            <button
              onClick={handleShareCode}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              title="Share Code"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setState(prev => ({ ...prev, showConsole: !prev.showConsole }))}
            className={`p-1.5 rounded-md transition-colors ${
              state.showConsole
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Toggle Console"
          >
            {state.showConsole ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>

          <button
            onClick={() => setState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }))}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            title="Toggle Fullscreen"
          >
            {state.isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Font Size
              </label>
              <input
                type="range"
                min="10"
                max="20"
                value={state.settings.fontSize}
                onChange={(e) => setState(prev => ({
                  ...prev,
                  settings: { ...prev.settings, fontSize: Number(e.target.value) }
                }))}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{state.settings.fontSize}px</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tab Size
              </label>
              <select
                value={state.settings.tabSize}
                onChange={(e) => setState(prev => ({
                  ...prev,
                  settings: { ...prev.settings, tabSize: Number(e.target.value) }
                }))}
                className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Timeout (ms)
              </label>
              <input
                type="number"
                min="1000"
                max="30000"
                step="1000"
                value={state.settings.timeout}
                onChange={(e) => setState(prev => ({
                  ...prev,
                  settings: { ...prev.settings, timeout: Number(e.target.value) }
                }))}
                className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
              />
            </div>

            <div className="space-y-1">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={state.settings.autoRun}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    settings: { ...prev.settings, autoRun: e.target.checked }
                  }))}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700 dark:text-gray-300">Auto Run</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={state.settings.wordWrap}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    settings: { ...prev.settings, wordWrap: e.target.checked }
                  }))}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700 dark:text-gray-300">Word Wrap</span>
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row h-96">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            <textarea
              ref={codeEditorRef}
              value={state.code}
              onChange={(e) => setState(prev => ({ ...prev, code: e.target.value }))}
              className="absolute inset-0 w-full h-full p-4 font-mono text-sm bg-gray-900 text-gray-100 border-none outline-none resize-none"
              style={editorStyles}
              placeholder="// Start coding here..."
              spellCheck={false}
              wrap={state.settings.wordWrap ? 'soft' : 'off'}
            />
            
            {state.isRunning && (
              <div className="absolute top-2 right-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
              </div>
            )}
          </div>
        </div>

        {/* Console */}
        {state.showConsole && (
          <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Console</h3>
              <button
                onClick={() => setState(prev => ({ ...prev, consoleMessages: [] }))}
                className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
              >
                Clear
              </button>
            </div>
            
            <div className="h-full overflow-y-auto p-2 space-y-1 max-h-80">
              {state.consoleMessages.length === 0 ? (
                <div className="text-xs text-gray-500 dark:text-gray-400 italic p-2">
                  Console output will appear here...
                </div>
              ) : (
                state.consoleMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-2 p-2 rounded text-xs font-mono ${
                      message.type === 'error'
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                        : message.type === 'warn'
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                        : message.type === 'info'
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {getMessageIcon(message.type)}
                    <div className="flex-1">
                      <div className="whitespace-pre-wrap break-words">
                        {formatConsoleMessage(message.content)}
                      </div>
                      <div className="text-xs opacity-60 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Lines: {state.code.split('\\n').length}</span>
          <span>Characters: {state.code.length}</span>
          {objectContext && <span>Context: {objectContext}</span>}
        </div>
        <div className="flex items-center space-x-4">
          {state.isRunning && (
            <span className="flex items-center space-x-1">
              <div className="animate-pulse h-2 w-2 bg-green-500 rounded-full" />
              <span>Running...</span>
            </span>
          )}
          <span>Ctrl+Enter to run</span>
        </div>
      </div>
    </div>
  )
}