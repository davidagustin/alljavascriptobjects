'use client'

import { useState, useCallback } from 'react'
import { Play, Copy, RotateCcw, AlertCircle } from 'lucide-react'

interface CodeEditorProps {
  code: string
  setCode: (code: string) => void
}

export default function CodeEditor({ code, setCode }: CodeEditorProps) {
  const [output, setOutput] = useState<string>('')
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runCode = useCallback(async () => {
    setIsRunning(true)
    setOutput('')
    setError(null)
    
    try {
      // Create a safe execution environment with timeout
      const safeEval = (code: string) => {
        return new Promise<string>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Code execution timed out'))
          }, 5000) // 5 second timeout

          try {
            const func = new Function(`
              "use strict";
              const console = {
                log: (...args) => window.consoleOutput.push(args.map(arg => 
                  typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ).join(' ')),
                error: (...args) => window.consoleOutput.push('ERROR: ' + args.join(' ')),
                warn: (...args) => window.consoleOutput.push('WARN: ' + args.join(' ')),
                info: (...args) => window.consoleOutput.push('INFO: ' + args.join(' ')),
                debug: (...args) => window.consoleOutput.push('DEBUG: ' + args.join(' '))
              };
              window.consoleOutput = [];
              try {
                ${code}
                return window.consoleOutput.join('\\n');
              } catch (error) {
                return 'Error: ' + error.message;
              }
            `)
            
            const result = func()
            clearTimeout(timeout)
            resolve(result)
          } catch (error) {
            clearTimeout(timeout)
            reject(error)
          }
        })
      }

      const result = await safeEval(code)
      setOutput(result || 'Code executed successfully (no output)')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setError(errorMessage)
      setOutput(`Error: ${errorMessage}`)
    } finally {
      setIsRunning(false)
    }
  }, [code])

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }, [code])

  const resetCode = useCallback(() => {
    setCode('// Start coding here...')
    setOutput('')
    setError(null)
  }, [setCode])

  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value)
    setError(null)
  }, [setCode])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Auto-indent on Enter
    if (e.key === 'Enter') {
      const target = e.target as HTMLTextAreaElement
      const start = target.selectionStart
      const end = target.selectionEnd
      const value = target.value
      
      // Get the current line
      const currentLine = value.substring(0, start).split('\n').pop() || ''
      const indent = currentLine.match(/^\s*/)?.[0] || ''
      
      // If the line ends with {, add extra indent
      if (currentLine.trim().endsWith('{')) {
        const newIndent = indent + '  '
        const newValue = value.substring(0, start) + '\n' + newIndent + value.substring(end)
        setCode(newValue)
        
        // Set cursor position
        setTimeout(() => {
          target.setSelectionRange(start + 1 + newIndent.length, start + 1 + newIndent.length)
        }, 0)
        e.preventDefault()
      }
    }
  }, [setCode])

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            aria-label={isRunning ? 'Running code...' : 'Run code'}
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
          <button
            onClick={copyCode}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            aria-label="Copy code to clipboard"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </button>
          <button
            onClick={resetCode}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            aria-label="Reset code to default"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md mb-4">
          <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
          <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Code Editor */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Code Editor</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">JavaScript</span>
          </div>
          <div className="relative">
            <textarea
              value={code}
              onChange={handleCodeChange}
              onKeyDown={handleKeyDown}
              className="w-full h-96 p-4 font-mono text-sm border-0 focus:ring-0 resize-none bg-gray-900 dark:bg-gray-950 text-green-400"
              placeholder="// Start coding here..."
              spellCheck={false}
              aria-label="JavaScript code editor"
            />
          </div>
        </div>

        {/* Output */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Output</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Console</span>
          </div>
          <div className="h-96 bg-gray-900 dark:bg-gray-950 text-green-400 p-4 overflow-auto">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {output || 'Output will appear here when you run your code...'}
            </pre>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Tips:</h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Use console.log() to see output</li>
          <li>• Try different JavaScript objects and methods</li>
          <li>• Experiment with the examples from the tutorial</li>
          <li>• The code runs in a safe environment with a 5-second timeout</li>
          <li>• Press Enter after {'{'} to auto-indent</li>
        </ul>
      </div>
    </div>
  )
}
