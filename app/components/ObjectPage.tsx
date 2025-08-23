'use client'

import { useState, useCallback, useMemo, useEffect, useRef, memo, Suspense, lazy } from 'react'
import { ArrowLeft, Play, Copy, RotateCcw, AlertCircle, Share2, Eye, EyeOff, Maximize2, Download, Settings } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useApp } from '../contexts/AppContext'

// Lazy load heavy components
const FavoriteButton = lazy(() => import('./FavoriteButton'))
const ShareDialog = lazy(() => import('./ShareDialog'))

// Loading fallback component
const ComponentLoader = () => (
  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded w-8 h-8" />
)

interface ObjectPageProps {
  title: string
  description: string
  overview: string
  syntax: string
  useCases: string[]
  browserSupport?: string
  relatedObjects?: string[]
  complexity?: 'beginner' | 'intermediate' | 'advanced'
  examples?: Array<{
    title: string
    code: string
    description: string
  }>
}

// Memoized syntax highlighter component
const SyntaxHighlighter = memo(({ code, isVisible }: { code: string; isVisible: boolean }) => {
  const [isHighlighted, setIsHighlighted] = useState(false)
  
  useEffect(() => {
    if (isVisible && !isHighlighted) {
      // Delay highlighting for better performance
      const timer = setTimeout(() => {
        setIsHighlighted(true)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isVisible, isHighlighted])

  return (
    <pre className={`text-green-400 text-sm font-mono whitespace-pre-wrap overflow-x-auto transition-opacity duration-300 ${
      isHighlighted ? 'opacity-100' : 'opacity-90'
    }`}>
      {code}
    </pre>
  )
})

SyntaxHighlighter.displayName = 'SyntaxHighlighter'

// Optimized code execution with Web Workers (when available)
const useCodeExecution = () => {
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    // Initialize Web Worker if available
    if (typeof Worker !== 'undefined') {
      try {
        const workerCode = `
          self.onmessage = function(e) {
            const { code, timeout = 5000 } = e.data;
            
            const timer = setTimeout(() => {
              self.postMessage({ error: 'Code execution timed out' });
            }, timeout);
            
            try {
              const consoleOutput = [];
              const mockConsole = {
                log: (...args) => consoleOutput.push(args.map(arg => 
                  typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ).join(' ')),
                error: (...args) => consoleOutput.push('ERROR: ' + args.join(' ')),
                warn: (...args) => consoleOutput.push('WARN: ' + args.join(' ')),
                info: (...args) => consoleOutput.push('INFO: ' + args.join(' ')),
                debug: (...args) => consoleOutput.push('DEBUG: ' + args.join(' '))
              };
              
              const func = new Function('console', code);
              func(mockConsole);
              
              clearTimeout(timer);
              self.postMessage({ result: consoleOutput.join('\\n') || 'Code executed successfully (no output)' });
            } catch (error) {
              clearTimeout(timer);
              self.postMessage({ error: error.message });
            }
          };
        `
        
        const blob = new Blob([workerCode], { type: 'application/javascript' })
        workerRef.current = new Worker(URL.createObjectURL(blob))
      } catch (error) {
        console.log('Web Worker not available, using fallback execution')
      }
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
      }
    }
  }, [])

  const executeCode = useCallback(async (code: string): Promise<{ result?: string; error?: string }> => {
    return new Promise((resolve) => {
      if (workerRef.current) {
        // Use Web Worker
        const handleMessage = (e: MessageEvent) => {
          workerRef.current?.removeEventListener('message', handleMessage)
          resolve(e.data)
        }
        
        workerRef.current.addEventListener('message', handleMessage)
        workerRef.current.postMessage({ code, timeout: 5000 })
      } else {
        // Fallback to main thread execution
        try {
          const consoleOutput: string[] = []
          const mockConsole = {
            log: (...args: any[]) => consoleOutput.push(args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ')),
            error: (...args: any[]) => consoleOutput.push('ERROR: ' + args.join(' ')),
            warn: (...args: any[]) => consoleOutput.push('WARN: ' + args.join(' ')),
            info: (...args: any[]) => consoleOutput.push('INFO: ' + args.join(' ')),
            debug: (...args: any[]) => consoleOutput.push('DEBUG: ' + args.join(' '))
          }
          
          const func = new Function('console', code)
          func(mockConsole)
          
          resolve({ result: consoleOutput.join('\n') || 'Code executed successfully (no output)' })
        } catch (error) {
          resolve({ error: error instanceof Error ? error.message : 'Unknown error' })
        }
      }
    })
  }, [])

  return executeCode
}

export default function ObjectPage({
  title,
  description,
  overview,
  syntax,
  useCases,
  browserSupport = "This feature is widely supported in modern browsers.",
  relatedObjects = [],
  complexity = 'intermediate',
  examples = []
}: ObjectPageProps) {
  const [code, setCode] = useState(syntax)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [fontSize, setFontSize] = useState(14)
  const [isCodeVisible, setIsCodeVisible] = useState(true)
  
  const syntaxRef = useRef<HTMLDivElement>(null)
  const codeEditorRef = useRef<HTMLTextAreaElement>(null)
  const [isSyntaxVisible, setIsSyntaxVisible] = useState(false)
  
  const { markAsVisited } = useApp()
  const executeCode = useCodeExecution()

  // Intersection Observer for lazy loading syntax highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSyntaxVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (syntaxRef.current) {
      observer.observe(syntaxRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Mark object as visited when component mounts
  useEffect(() => {
    markAsVisited(title)
  }, [title, markAsVisited])

  // Auto-save code to localStorage
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (code !== syntax) {
        localStorage.setItem(`code_${title}`, code)
      }
    }, 1000)

    return () => clearTimeout(autoSaveTimer)
  }, [code, syntax, title])

  // Load saved code on mount
  useEffect(() => {
    const savedCode = localStorage.getItem(`code_${title}`)
    if (savedCode && savedCode !== syntax) {
      setCode(savedCode)
    }
  }, [title, syntax])

  const runCode = useCallback(async () => {
    if (!code.trim()) return
    
    setIsRunning(true)
    setOutput('')
    setError(null)
    
    try {
      const { result, error: execError } = await executeCode(code)
      
      if (execError) {
        setError(execError)
        setOutput(`Error: ${execError}`)
      } else {
        setOutput(result || 'Code executed successfully (no output)')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setError(errorMessage)
      setOutput(`Error: ${errorMessage}`)
    } finally {
      setIsRunning(false)
    }
  }, [code, executeCode])

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      // Show temporary success feedback
      const button = document.activeElement
      if (button instanceof HTMLElement) {
        const originalText = button.textContent
        button.textContent = 'Copied!'
        setTimeout(() => {
          button.textContent = originalText
        }, 1000)
      }
    } catch (error) {
      console.error('Failed to copy code:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = code
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError)
      }
      document.body.removeChild(textArea)
    }
  }, [code])

  const downloadCode = useCallback(() => {
    const blob = new Blob([code], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.toLowerCase()}-example.js`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [code, title])

  const resetCode = useCallback(() => {
    setCode(syntax)
    setOutput('')
    setError(null)
    localStorage.removeItem(`code_${title}`)
  }, [syntax, title])

  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value)
    setError(null)
  }, [])

  const toggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded)
  }, [isExpanded])

  const formatCode = useCallback(() => {
    try {
      // Basic code formatting (could be enhanced with a proper formatter)
      const formatted = code
        .replace(/;/g, ';\n')
        .replace(/\{/g, '{\n  ')
        .replace(/\}/g, '\n}')
        .replace(/,/g, ',\n  ')
      setCode(formatted)
    } catch (error) {
      console.error('Code formatting failed:', error)
    }
  }, [code])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Run code with Ctrl/Cmd + Enter
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        runCode()
      }
      // Format code with Ctrl/Cmd + Shift + F
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault()
        formatCode()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [runCode, formatCode])

  const memoizedSyntax = useMemo(() => (
    <div ref={syntaxRef} className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 mb-6 relative">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-400">Syntax Examples</h3>
        <button
          onClick={() => setIsCodeVisible(!isCodeVisible)}
          className="text-gray-400 hover:text-gray-300 transition-colors"
          title={isCodeVisible ? 'Hide code' : 'Show code'}
        >
          {isCodeVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {isCodeVisible && (
        <Suspense fallback={<div className="animate-pulse bg-gray-800 h-32 rounded"></div>}>
          <SyntaxHighlighter code={syntax} isVisible={isSyntaxVisible} />
        </Suspense>
      )}
    </div>
  ), [syntax, isSyntaxVisible, isCodeVisible])

  const complexityColor = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }[complexity]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded-md p-1"
                aria-label="Back to home page"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Index
              </Link>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${complexityColor}`}>
                  {complexity}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowShareDialog(true)}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded-md"
                title="Share this object"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <Suspense fallback={<ComponentLoader />}>
                <FavoriteButton objectName={title} />
              </Suspense>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{description}</p>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Overview</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{overview}</p>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Syntax</h2>
            {memoizedSyntax}
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Interactive Playground</h2>
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={runCode}
                    disabled={isRunning}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    aria-label={isRunning ? 'Running code...' : 'Run code (Ctrl/Cmd + Enter)'}
                    title="Ctrl/Cmd + Enter"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isRunning ? 'Running...' : 'Run Code'}
                  </button>
                  <button
                    onClick={copyCode}
                    className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    aria-label="Copy code to clipboard"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </button>
                  <button
                    onClick={downloadCode}
                    className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    aria-label="Download code as file"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                  <button
                    onClick={resetCode}
                    className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    aria-label="Reset code to original"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowLineNumbers(!showLineNumbers)}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    {showLineNumbers ? 'Hide' : 'Show'} Lines
                  </button>
                  <button
                    onClick={toggleExpanded}
                    className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
                    title={isExpanded ? 'Exit fullscreen' : 'Enter fullscreen'}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {error && (
                <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2 flex-shrink-0" />
                  <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
                </div>
              )}
              
              <div className={`grid grid-cols-1 ${isExpanded ? 'lg:grid-cols-1' : 'lg:grid-cols-2'} gap-4 ${isExpanded ? 'fixed inset-4 z-50 bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-6' : ''}`}>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="code-editor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Code Editor
                    </label>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <label className="flex items-center space-x-1">
                        <input
                          type="range"
                          min="12"
                          max="18"
                          value={fontSize}
                          onChange={(e) => setFontSize(Number(e.target.value))}
                          className="w-16"
                        />
                        <span>{fontSize}px</span>
                      </label>
                    </div>
                  </div>
                  <div className="relative">
                    <textarea
                      ref={codeEditorRef}
                      id="code-editor"
                      value={code}
                      onChange={handleCodeChange}
                      style={{ fontSize: `${fontSize}px`, lineHeight: 1.5 }}
                      className={`w-full ${isExpanded ? 'h-96' : 'h-64'} p-4 border border-gray-300 dark:border-gray-600 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200`}
                      placeholder="Enter your JavaScript code here..."
                      aria-describedby="code-editor-help"
                      spellCheck="false"
                    />
                    {showLineNumbers && (
                      <div className="absolute left-2 top-4 text-xs text-gray-400 font-mono pointer-events-none select-none">
                        {code.split('\n').map((_, index) => (
                          <div key={index} style={{ lineHeight: 1.5 * fontSize / 14 }}>
                            {index + 1}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p id="code-editor-help" className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Write your JavaScript code here. Use console.log() to see output. 
                    <kbd className="ml-2 px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+Enter</kbd> to run
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Output Console
                  </label>
                  <div className={`w-full ${isExpanded ? 'h-96' : 'h-64'} p-4 bg-gray-900 dark:bg-gray-950 text-green-400 rounded-md font-mono text-sm overflow-auto border border-gray-700`}>
                    <pre className="whitespace-pre-wrap">
                      {output || 'Output will appear here when you run your code...'}
                    </pre>
                  </div>
                </div>
                {isExpanded && (
                  <button
                    onClick={toggleExpanded}
                    className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 bg-white dark:bg-gray-800 rounded-full shadow-lg transition-colors"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Additional Examples */}
            {examples.length > 0 && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">More Examples</h2>
                <div className="space-y-4 mb-6">
                  {examples.map((example, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{example.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{example.description}</p>
                      <pre className="bg-gray-900 dark:bg-gray-950 text-green-400 p-3 rounded text-sm overflow-x-auto">
                        {example.code}
                      </pre>
                      <button
                        onClick={() => setCode(example.code)}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none"
                      >
                        Try this example
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Common Use Cases</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6">
              {useCases.map((useCase, index) => (
                <li key={index} className="leading-relaxed">{useCase}</li>
              ))}
            </ul>
            
            {relatedObjects.length > 0 && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Related Objects</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {relatedObjects.map((obj) => (
                    <Link
                      key={obj}
                      href={`/${obj.toLowerCase()}`}
                      className="px-3 py-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {obj}
                    </Link>
                  ))}
                </div>
              </>
            )}
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Browser Compatibility</h2>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300">{browserSupport}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <Suspense fallback={null}>
        <ShareDialog
          isOpen={showShareDialog}
          onClose={() => setShowShareDialog(false)}
          title={title}
          code={code}
        />
      </Suspense>
    </div>
  )
}