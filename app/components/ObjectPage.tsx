'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { ArrowLeft, Play, Copy, RotateCcw, AlertCircle, Share2 } from 'lucide-react'
import Link from 'next/link'
import FavoriteButton from './FavoriteButton'
import ShareDialog from './ShareDialog'
import { useApp } from '../contexts/AppContext'

interface ObjectPageProps {
  title: string
  description: string
  overview: string
  syntax: string
  useCases: string[]
  browserSupport?: string
}

export default function ObjectPage({
  title,
  description,
  overview,
  syntax,
  useCases,
  browserSupport = "This feature is widely supported in modern browsers."
}: ObjectPageProps) {
  const [code, setCode] = useState(syntax)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const { markAsVisited } = useApp()

  // Mark object as visited when component mounts
  useEffect(() => {
    markAsVisited(title)
  }, [title, markAsVisited])

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
    setCode(syntax)
    setOutput('')
    setError(null)
  }, [syntax])

  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value)
    setError(null)
  }, [])

  const memoizedSyntax = useMemo(() => (
    <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap overflow-x-auto">
      {syntax}
    </pre>
  ), [syntax])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded-md"
                aria-label="Back to home page"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Index
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowShareDialog(true)}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded-md"
                title="Share this object"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <FavoriteButton objectName={title} />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{description}</p>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Overview</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">{overview}</p>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Syntax</h2>
            <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 mb-6">
              {memoizedSyntax}
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Try It Yourself</h2>
            <div className="space-y-4 mb-6">
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
                  aria-label="Reset code to original"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </button>
              </div>
              
              {error && (
                <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
                  <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
                </div>
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="code-editor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Code Editor
                  </label>
                  <textarea
                    id="code-editor"
                    value={code}
                    onChange={handleCodeChange}
                    className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter your JavaScript code here..."
                    aria-describedby="code-editor-help"
                  />
                  <p id="code-editor-help" className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Write your JavaScript code here. Use console.log() to see output.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Output
                  </label>
                  <div className="w-full h-64 p-4 bg-gray-900 dark:bg-gray-950 text-green-400 rounded-md font-mono text-sm overflow-auto">
                    <pre className="whitespace-pre-wrap">
                      {output || 'Output will appear here when you run your code...'}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Common Use Cases</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6">
              {useCases.map((useCase, index) => (
                <li key={index}>{useCase}</li>
              ))}
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Browser Compatibility</h2>
            <p className="text-gray-700 dark:text-gray-300">{browserSupport}</p>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        title={title}
        code={code}
      />
    </div>
  )
}
