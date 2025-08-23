'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { 
  Play, 
  Copy, 
  Check, 
  RotateCcw, 
  Save, 
  Download,
  Upload,
  Maximize2,
  Minimize2,
  Settings,
  Terminal,
  FileText,
  Lightbulb,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { STORAGE_KEYS } from '../utils/storage'

interface CodeEditorProps {
  initialCode?: string
  language?: 'javascript' | 'typescript' | 'html' | 'css'
  theme?: 'dark' | 'light'
  onChange?: (code: string) => void
  onRun?: (code: string) => Promise<any>
  readOnly?: boolean
  className?: string
}

interface CodeSnippet {
  id: string
  name: string
  code: string
  language: string
  createdAt: string
  tags: string[]
}

interface ConsoleOutput {
  id: string
  type: 'log' | 'error' | 'warn' | 'info'
  message: string
  timestamp: string
}

export default function EnhancedCodeEditor({
  initialCode = '// Write your JavaScript code here...\nconsole.log("Hello, JavaScript!");\n',
  language = 'javascript',
  theme = 'dark',
  onChange,
  onRun,
  readOnly = false,
  className = ''
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState<ConsoleOutput[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showConsole, setShowConsole] = useState(true)
  const [lineNumbers, setLineNumbers] = useState(true)
  const [wordWrap, setWordWrap] = useState(true)
  const [fontSize, setFontSize] = useState(14)
  const [tabSize, setTabSize] = useState(2)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Save code snippets to localStorage
  const [savedSnippets, setSavedSnippets] = useLocalStorage<CodeSnippet[]>(
    STORAGE_KEYS.CODE_SNIPPETS,
    []
  )

  // Auto-save current code
  useEffect(() => {
    const timer = setTimeout(() => {
      if (code !== initialCode) {
        localStorage.setItem('current-code-draft', code)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [code, initialCode])

  // Load saved draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('current-code-draft')
    if (draft && draft !== initialCode) {
      setCode(draft)
    }
  }, [initialCode])

  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value
    setCode(newCode)
    onChange?.(newCode)
  }, [onChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab handling
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const spaces = ' '.repeat(tabSize)
      
      const newCode = code.substring(0, start) + spaces + code.substring(end)
      setCode(newCode)
      
      // Set cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + tabSize
          textareaRef.current.selectionEnd = start + tabSize
        }
      }, 0)
    }
    
    // Run code with Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleRun()
    }
    
    // Save with Ctrl/Cmd + S
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
  }, [code, tabSize])

  const handleRun = useCallback(async () => {
    if (isRunning) return
    
    setIsRunning(true)
    setOutput([])
    
    try {
      if (onRun) {
        await onRun(code)
      } else {
        // Default execution - capture console output
        const originalMethods = {
          log: console.log,
          error: console.error,
          warn: console.warn,
          info: console.info
        }
        
        const newOutput: ConsoleOutput[] = []
        
        // Override console methods
        const createConsoleOverride = (type: ConsoleOutput['type']) => 
          (...args: any[]) => {
            const message = args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ')
            
            newOutput.push({
              id: Date.now() + Math.random(),
              type,
              message,
              timestamp: new Date().toLocaleTimeString()
            })
            
            // Also call original method
            originalMethods[type](...args)
          }

        console.log = createConsoleOverride('log')
        console.error = createConsoleOverride('error')
        console.warn = createConsoleOverride('warn')
        console.info = createConsoleOverride('info')

        try {
          // Execute the code
          const result = new Function(code)()
          
          // If there's a return value, log it
          if (result !== undefined) {
            newOutput.push({
              id: Date.now() + Math.random(),
              type: 'info',
              message: `Return value: ${JSON.stringify(result)}`,
              timestamp: new Date().toLocaleTimeString()
            })
          }
          
          if (newOutput.length === 0) {
            newOutput.push({
              id: Date.now(),
              type: 'info',
              message: 'Code executed successfully (no output)',
              timestamp: new Date().toLocaleTimeString()
            })
          }
          
        } catch (error) {
          newOutput.push({
            id: Date.now(),
            type: 'error',
            message: `Error: ${error instanceof Error ? error.message : String(error)}`,
            timestamp: new Date().toLocaleTimeString()
          })
        }
        
        // Restore original console methods
        Object.assign(console, originalMethods)
        setOutput(newOutput)
      }
      
    } catch (error) {
      setOutput([{
        id: Date.now(),
        type: 'error',
        message: `Execution error: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: new Date().toLocaleTimeString()
      }])
    } finally {
      setIsRunning(false)
    }
  }, [code, isRunning, onRun])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }, [code])

  const handleReset = useCallback(() => {
    setCode(initialCode)
    setOutput([])
    onChange?.(initialCode)
  }, [initialCode, onChange])

  const handleSave = useCallback(() => {
    const snippet: CodeSnippet = {
      id: Date.now().toString(),
      name: `Snippet ${new Date().toLocaleString()}`,
      code,
      language,
      createdAt: new Date().toISOString(),
      tags: []
    }
    
    setSavedSnippets(prev => [snippet, ...prev.slice(0, 9)]) // Keep last 10 snippets
  }, [code, language, setSavedSnippets])

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `code-${Date.now()}.js`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [code])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setCode(content)
        onChange?.(content)
      }
      reader.readAsText(file)
    }
  }, [onChange])

  const getLineCount = useCallback(() => {
    return code.split('\n').length
  }, [code])

  const getConsoleIcon = (type: ConsoleOutput['type']) => {
    switch (type) {
      case 'error': return <AlertCircle className="h-3 w-3 text-red-500" />
      case 'warn': return <AlertCircle className="h-3 w-3 text-yellow-500" />
      case 'info': return <CheckCircle className="h-3 w-3 text-blue-500" />
      default: return <Terminal className="h-3 w-3 text-gray-500" />
    }
  }

  return (
    <div className={`
      ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900' : 'relative'}
      ${className}
    `}>
      <div className="flex flex-col h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRun}
              disabled={isRunning || readOnly}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              <Play className="h-3 w-3 mr-1" />
              {isRunning ? 'Running...' : 'Run'}
            </button>
            
            <button
              onClick={handleCopy}
              className="flex items-center px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              title="Copy code"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </button>
            
            <button
              onClick={handleReset}
              className="flex items-center px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              title="Reset code"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
            
            <button
              onClick={handleSave}
              className="flex items-center px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              title="Save snippet"
            >
              <Save className="h-3 w-3" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              title="Upload file"
            >
              <Upload className="h-3 w-3" />
            </button>
            
            <button
              onClick={handleDownload}
              className="flex items-center px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              title="Download code"
            >
              <Download className="h-3 w-3" />
            </button>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              title="Settings"
            >
              <Settings className="h-3 w-3" />
            </button>
            
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="p-3 bg-gray-100 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={lineNumbers}
                    onChange={(e) => setLineNumbers(e.target.checked)}
                    className="mr-2"
                  />
                  Line numbers
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={wordWrap}
                    onChange={(e) => setWordWrap(e.target.checked)}
                    className="mr-2"
                  />
                  Word wrap
                </label>
              </div>
              <div>
                <label className="block">
                  Font size:
                  <input
                    type="range"
                    min="10"
                    max="20"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="ml-2 w-full"
                  />
                  <span className="text-xs text-gray-500">{fontSize}px</span>
                </label>
              </div>
              <div>
                <label className="block">
                  Tab size:
                  <select
                    value={tabSize}
                    onChange={(e) => setTabSize(Number(e.target.value))}
                    className="ml-2 text-xs border rounded px-1 py-0.5 bg-white dark:bg-gray-800"
                  >
                    <option value={2}>2 spaces</option>
                    <option value={4}>4 spaces</option>
                    <option value={8}>8 spaces</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col min-h-0">
          {/* Code Editor */}
          <div className="flex-1 relative">
            <div className="absolute inset-0 flex">
              {/* Line Numbers */}
              {lineNumbers && (
                <div className="w-12 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 p-2 font-mono">
                  {Array.from({ length: getLineCount() }, (_, i) => (
                    <div key={i + 1} className="leading-relaxed">
                      {i + 1}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Code Area */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={handleCodeChange}
                onKeyDown={handleKeyDown}
                readOnly={readOnly}
                placeholder="Start typing your JavaScript code..."
                className={`
                  flex-1 p-3 font-mono bg-gray-900 dark:bg-gray-950 text-green-400 
                  placeholder-gray-500 resize-none border-none outline-none
                  ${wordWrap ? '' : 'whitespace-nowrap overflow-x-auto'}
                `}
                style={{ 
                  fontSize: `${fontSize}px`,
                  lineHeight: '1.5',
                  tabSize: tabSize
                }}
                spellCheck={false}
              />
            </div>
          </div>

          {/* Console Output */}
          {showConsole && (
            <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <Terminal className="h-3 w-3 mr-2" />
                  Console Output
                </h3>
                <button
                  onClick={() => setOutput([])}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Clear
                </button>
              </div>
              
              <div className="h-32 overflow-y-auto p-2 text-xs font-mono">
                {output.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    Run your code to see output here...
                  </p>
                ) : (
                  output.map((item) => (
                    <div key={item.id} className="flex items-start space-x-2 mb-1">
                      {getConsoleIcon(item.type)}
                      <span className="text-gray-400 text-xs min-w-[60px]">
                        {item.timestamp}
                      </span>
                      <span className={`flex-1 ${
                        item.type === 'error' ? 'text-red-500' :
                        item.type === 'warn' ? 'text-yellow-500' :
                        item.type === 'info' ? 'text-blue-500' :
                        'text-gray-700 dark:text-gray-300'
                      }`}>
                        {item.message}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".js,.ts,.json,.txt"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* Saved Snippets Sidebar (when in fullscreen) */}
      {isFullscreen && savedSnippets.length > 0 && (
        <div className="absolute top-0 right-0 w-64 h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100 flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Saved Snippets
          </h3>
          <div className="space-y-2">
            {savedSnippets.map((snippet) => (
              <button
                key={snippet.id}
                onClick={() => {
                  setCode(snippet.code)
                  onChange?.(snippet.code)
                }}
                className="w-full text-left p-2 text-xs bg-gray-50 dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="font-medium truncate text-gray-900 dark:text-gray-100">
                  {snippet.name}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-xs">
                  {new Date(snippet.createdAt).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}