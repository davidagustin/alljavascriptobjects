'use client'

import React, { 
  useState, 
  useCallback, 
  useMemo, 
  useEffect, 
  useRef, 
  memo, 
  Suspense, 
  lazy,
  type FC,
  type ReactNode
} from 'react'
import { 
  ArrowLeft, 
  Play, 
  Copy, 
  RotateCcw, 
  AlertCircle, 
  Share2, 
  Eye, 
  EyeOff, 
  Maximize2, 
  Download
} from 'lucide-react'
import Link from 'next/link'
import { useApp } from '../contexts/AppContext'
import { executeCodeSafely, type CodeExecutionResult } from '../utils/errorHandling'
import { usePerformanceTracking } from '../utils/performance'
import { PERFORMANCE } from '../utils/constants'
import type { 
  CodeExample, 
  DifficultyLevel, 
  BaseComponentProps,
  InteractiveComponentProps
} from '../types'

// Lazy load heavy components for better performance
const FavoriteButton = lazy(() => import('./FavoriteButton'))
const ShareDialog = lazy(() => import('./ShareDialog'))

// Loading fallback component
const ComponentLoader: FC = () => (
  <div 
    className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded w-8 h-8" 
    role="status"
    aria-label="Loading..."
  />
)

// Interface for ObjectPage props with proper typing
export interface ObjectPageProps extends BaseComponentProps {
  readonly title: string
  readonly description: string
  readonly overview: string
  readonly syntax: string
  readonly useCases: readonly string[]
  readonly browserSupport?: string
  readonly relatedObjects?: readonly string[]
  readonly complexity?: DifficultyLevel
  readonly examples?: readonly CodeExample[]
}

// Props for SyntaxHighlighter component
interface SyntaxHighlighterProps {
  readonly code: string
  readonly isVisible: boolean
  readonly className?: string
}

// Memoized syntax highlighter component with proper TypeScript
const SyntaxHighlighter: FC<SyntaxHighlighterProps> = memo(({ 
  code, 
  isVisible, 
  className = '' 
}) => {
  const [isHighlighted, setIsHighlighted] = useState(false)
  
  useEffect(() => {
    if (isVisible && !isHighlighted) {
      const timer = setTimeout(() => {
        setIsHighlighted(true)
      }, PERFORMANCE.SYNTAX_HIGHLIGHT_DELAY)
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, isHighlighted])

  return (
    <pre 
      className={`
        text-green-400 text-sm font-mono whitespace-pre-wrap overflow-x-auto 
        transition-opacity duration-300 
        ${isHighlighted ? 'opacity-100' : 'opacity-90'} 
        ${className}
      `}
      role="code"
      aria-label="Code example"
    >
      {code}
    </pre>
  )
})

SyntaxHighlighter.displayName = 'SyntaxHighlighter'

// Custom hook for code execution with proper error handling
const useCodeExecution = () => {
  // Simple timeout implementation
  const executeWithTimeout = useCallback(async (fn: () => Promise<any>, timeout: number = 5000) => {
    return Promise.race([
      fn(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Code execution timed out')), timeout)
      )
    ])
  }, [])
  
  const runCode = useCallback(async (code: string): Promise<CodeExecutionResult> => {
    try {
      const result = await executeWithTimeout(
        () => executeCodeSafely(code),
        PERFORMANCE.CODE_EXECUTION_TIMEOUT
      )
      return result
    } catch (error) {
      return {
        error: {
          type: 'timeout',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          suggestions: ['Check for infinite loops', 'Simplify your code', 'Try smaller examples']
        }
      }
    }
  }, [executeWithTimeout])

  return { runCode }
}

// Props for ActionButton component
interface ActionButtonProps extends InteractiveComponentProps {
  readonly icon: ReactNode
  readonly label: string
  readonly variant?: 'primary' | 'secondary'
  readonly size?: 'sm' | 'md' | 'lg'
}

// Reusable action button component
const ActionButton: FC<ActionButtonProps> = memo(({ 
  icon, 
  label, 
  onClick, 
  disabled = false, 
  loading = false,
  variant = 'secondary',
  size = 'md',
  className = '',
  'aria-label': ariaLabel,
  ...props
}) => {
  const baseClasses = 'flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400',
    secondary: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500'
  }
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm gap-1',
    md: 'px-3 py-2 text-sm gap-2', 
    lg: 'px-4 py-2 text-base gap-2'
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${sizeClasses[size]} 
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      aria-label={ariaLabel || label}
      {...props}
    >
      {loading ? (
        <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        icon
      )}
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
})

ActionButton.displayName = 'ActionButton'

// Main ObjectPage component
const ObjectPage: FC<ObjectPageProps> = ({
  title,
  description,
  overview,
  syntax,
  useCases,
  browserSupport = "This feature is widely supported in modern browsers.",
  relatedObjects = [],
  complexity = 'intermediate',
  examples = [],
  className = '',
  ...props
}) => {
  // State management with proper typing
  const [code, setCode] = useState<string>(syntax)
  const [output, setOutput] = useState<string>('')
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [showShareDialog, setShowShareDialog] = useState<boolean>(false)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true)
  const [fontSize, setFontSize] = useState<number>(14)
  const [isCodeVisible, setIsCodeVisible] = useState<boolean>(true)
  
  // Refs for performance optimizations
  const syntaxRef = useRef<HTMLDivElement>(null)
  const codeEditorRef = useRef<HTMLTextAreaElement>(null)
  
  // Custom hooks
  const { markAsVisited } = useApp()
  const { runCode } = useCodeExecution()
  // Simple intersection observer implementation
  const [isIntersecting, setIsIntersecting] = useState(false)
  
  useEffect(() => {
    if (!syntaxRef.current) return
    
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.1 }
    )
    
    observer.observe(syntaxRef.current)
    return () => observer.disconnect()
  }, [])

  // Mark object as visited when component mounts
  useEffect(() => {
    markAsVisited(title)
  }, [title, markAsVisited])

  // Auto-save code to localStorage with debouncing
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (code !== syntax) {
        try {
          localStorage.setItem(`code_${title}`, code)
        } catch (error) {
          console.warn('Failed to save code to localStorage:', error)
        }
      }
    }, PERFORMANCE.AUTO_SAVE_DELAY)

    return () => clearTimeout(autoSaveTimer)
  }, [code, syntax, title])

  // Load saved code on mount
  useEffect(() => {
    try {
      const savedCode = localStorage.getItem(`code_${title}`)
      if (savedCode && savedCode !== syntax) {
        setCode(savedCode)
      }
    } catch (error) {
      console.warn('Failed to load saved code from localStorage:', error)
    }
  }, [title, syntax])

  // Event handlers with proper typing
  const handleRunCode = useCallback(async () => {
    if (!code.trim() || isRunning) return
    
    setIsRunning(true)
    setOutput('')
    setError(null)
    
    try {
      const result = await runCode(code)
      
      if (result.error) {
        setError(result.error.message)
        setOutput(`Error: ${result.error.message}`)
      } else {
        setOutput(result.result || 'Code executed successfully (no output)')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setError(errorMessage)
      setOutput(`Error: ${errorMessage}`)
    } finally {
      setIsRunning(false)
    }
  }, [code, runCode, isRunning])

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      // Could add toast notification here
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = code
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      
      try {
        document.execCommand('copy')
      } catch (fallbackError) {
        console.error('Copy failed:', fallbackError)
      }
      
      document.body.removeChild(textArea)
    }
  }, [code])

  const handleDownloadCode = useCallback(() => {
    try {
      const blob = new Blob([code], { type: 'text/javascript' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      
      link.href = url
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-example.js`
      link.style.display = 'none'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }, [code, title])

  const handleResetCode = useCallback(() => {
    setCode(syntax)
    setOutput('')
    setError(null)
    
    try {
      localStorage.removeItem(`code_${title}`)
    } catch (error) {
      console.warn('Failed to remove saved code from localStorage:', error)
    }
  }, [syntax, title])

  const handleCodeChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(event.target.value)
    setError(null)
  }, [])

  const handleToggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault()
        handleRunCode()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleRunCode])

  // Memoized syntax display
  const syntaxDisplay = useMemo(() => (
    <div ref={syntaxRef} className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 mb-6 relative">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-400">Syntax Examples</h3>
        <ActionButton
          icon={isCodeVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          label={isCodeVisible ? 'Hide code' : 'Show code'}
          onClick={() => setIsCodeVisible(!isCodeVisible)}
          size="sm"
          aria-label={isCodeVisible ? 'Hide code examples' : 'Show code examples'}
        />
      </div>
      {isCodeVisible && (
        <Suspense fallback={<div className="animate-pulse bg-gray-800 h-32 rounded" />}>
          <SyntaxHighlighter code={syntax} isVisible={isIntersecting} />
        </Suspense>
      )}
    </div>
  ), [syntax, isIntersecting, isCodeVisible])

  // Complexity badge color
  const complexityColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  } as const

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors ${className}`} {...props}>
      {/* Sticky Header */}
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
                <span className="hidden sm:inline">Back to Index</span>
              </Link>
              <div className="flex items-center space-x-3">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {title}
                </h1>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${complexityColors[complexity]}`}>
                  {complexity}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ActionButton
                icon={<Share2 className="h-4 w-4" />}
                label="Share"
                onClick={() => setShowShareDialog(true)}
                aria-label="Share this object page"
              />
              <Suspense fallback={<ComponentLoader />}>
                <FavoriteButton objectName={title} />
              </Suspense>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            {/* Description */}
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              {description}
            </p>
            
            {/* Overview */}
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Overview
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {overview}
              </p>
            </section>
            
            {/* Syntax */}
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Syntax
              </h2>
              {syntaxDisplay}
            </section>
            
            {/* Interactive Playground */}
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Interactive Playground
              </h2>
              <div className="space-y-4">
                {/* Action Buttons */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <ActionButton
                      icon={<Play className="h-4 w-4" />}
                      label={isRunning ? 'Running...' : 'Run Code'}
                      onClick={handleRunCode}
                      disabled={isRunning}
                      loading={isRunning}
                      variant="primary"
                      aria-label={isRunning ? 'Code is running...' : 'Run code (Ctrl/Cmd + Enter)'}
                    />
                    <ActionButton
                      icon={<Copy className="h-4 w-4" />}
                      label="Copy"
                      onClick={handleCopyCode}
                      aria-label="Copy code to clipboard"
                    />
                    <ActionButton
                      icon={<Download className="h-4 w-4" />}
                      label="Download"
                      onClick={handleDownloadCode}
                      aria-label="Download code as JavaScript file"
                    />
                    <ActionButton
                      icon={<RotateCcw className="h-4 w-4" />}
                      label="Reset"
                      onClick={handleResetCode}
                      aria-label="Reset code to original example"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <ActionButton
                      icon={<Maximize2 className="h-4 w-4" />}
                      label={isExpanded ? 'Exit Fullscreen' : 'Fullscreen'}
                      onClick={handleToggleExpanded}
                      aria-label={isExpanded ? 'Exit fullscreen mode' : 'Enter fullscreen mode'}
                    />
                  </div>
                </div>
                
                {/* Error Display */}
                {error && (
                  <div 
                    className="flex items-start p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
                    role="alert"
                  >
                    <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                    <div className="text-red-700 dark:text-red-300 text-sm">
                      <p className="font-medium mb-1">Error</p>
                      <p>{error}</p>
                    </div>
                  </div>
                )}
                
                {/* Code Editor and Output */}
                <div className={`grid grid-cols-1 ${isExpanded ? 'lg:grid-cols-1' : 'lg:grid-cols-2'} gap-4 ${isExpanded ? 'fixed inset-4 z-50 bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-6' : ''}`}>
                  {/* Code Editor */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label 
                        htmlFor="code-editor" 
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Code Editor
                      </label>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <label className="flex items-center space-x-1">
                          <span>Font Size:</span>
                          <input
                            type="range"
                            min="12"
                            max="18"
                            value={fontSize}
                            onChange={(e) => setFontSize(Number(e.target.value))}
                            className="w-16"
                            aria-label="Adjust font size"
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
                        style={{ 
                          fontSize: `${fontSize}px`, 
                          lineHeight: 1.5,
                          paddingLeft: showLineNumbers ? '3rem' : '1rem'
                        }}
                        className={`
                          w-full ${isExpanded ? 'h-96' : 'h-64'} p-4 border border-gray-300 
                          dark:border-gray-600 rounded-md font-mono text-sm 
                          focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                          resize-none bg-white dark:bg-gray-700 text-gray-900 
                          dark:text-gray-100 transition-all duration-200
                        `}
                        placeholder="Enter your JavaScript code here..."
                        aria-describedby="code-editor-help"
                        spellCheck="false"
                      />
                      
                      {/* Line Numbers */}
                      {showLineNumbers && (
                        <div className="absolute left-2 top-4 text-xs text-gray-400 font-mono pointer-events-none select-none">
                          {(code || '').split('\n').map((_, index) => (
                            <div key={index} style={{ lineHeight: 1.5 }}>
                              {index + 1}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <p id="code-editor-help" className="text-sm text-gray-500 dark:text-gray-400">
                      Write your JavaScript code here. Use console.log() to see output.{' '}
                      <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                        Ctrl+Enter
                      </kbd>{' '}
                      to run
                    </p>
                  </div>
                  
                  {/* Output Console */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Output Console
                    </label>
                    <div className={`
                      w-full ${isExpanded ? 'h-96' : 'h-64'} p-4 bg-gray-900 dark:bg-gray-950 
                      text-green-400 rounded-md font-mono text-sm overflow-auto 
                      border border-gray-700
                    `}>
                      <pre className="whitespace-pre-wrap">
                        {output || 'Output will appear here when you run your code...'}
                      </pre>
                    </div>
                  </div>
                  
                  {/* Fullscreen Exit Button */}
                  {isExpanded && (
                    <button
                      onClick={handleToggleExpanded}
                      className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 bg-white dark:bg-gray-800 rounded-full shadow-lg transition-colors"
                      aria-label="Exit fullscreen mode"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </section>
            
            {/* Additional Examples */}
            {examples.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  More Examples
                </h2>
                <div className="space-y-4">
                  {examples.map((example, index) => (
                    <article 
                      key={`${example.title}-${index}`}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {example.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {example.description}
                      </p>
                      <pre className="bg-gray-900 dark:bg-gray-950 text-green-400 p-3 rounded text-sm overflow-x-auto">
                        {example.code}
                      </pre>
                      <button
                        onClick={() => setCode(example.code)}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none focus:underline"
                      >
                        Try this example
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            )}
            
            {/* Use Cases */}
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Common Use Cases
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                {useCases.map((useCase, index) => (
                  <li key={index} className="leading-relaxed">
                    {useCase}
                  </li>
                ))}
              </ul>
            </section>
            
            {/* Related Objects */}
            {relatedObjects.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Related Objects
                </h2>
                <div className="flex flex-wrap gap-2">
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
              </section>
            )}
            
            {/* Browser Compatibility */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Browser Compatibility
              </h2>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  {browserSupport}
                </p>
              </div>
            </section>
          </div>
        </article>
      </main>

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

ObjectPage.displayName = 'ObjectPage'

export default ObjectPage