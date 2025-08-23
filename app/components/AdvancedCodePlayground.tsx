'use client'

import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { Play, Square, RotateCcw, Download, Upload, Share2, Settings, Terminal, Eye, EyeOff, Maximize2, Minimize2, Copy, Check, AlertTriangle, Info, Lightbulb, BookOpen, Code, Cpu, Zap, Target, Trophy } from 'lucide-react'

interface CodeExecution {
  id: string
  code: string
  output: string[]
  errors: string[]
  duration: number
  timestamp: Date
  memoryUsed?: number
  success: boolean
}

interface CodeSuggestion {
  text: string
  description: string
  category: 'method' | 'property' | 'syntax' | 'best-practice'
  insertText: string
}

interface PlaygroundTheme {
  name: string
  background: string
  foreground: string
  accent: string
  border: string
  syntax: {
    keyword: string
    string: string
    number: string
    comment: string
    function: string
  }
}

const themes: PlaygroundTheme[] = [
  {
    name: 'Dark',
    background: '#1e1e1e',
    foreground: '#d4d4d4',
    accent: '#007acc',
    border: '#333',
    syntax: {
      keyword: '#569cd6',
      string: '#ce9178',
      number: '#b5cea8',
      comment: '#6a9955',
      function: '#dcdcaa'
    }
  },
  {
    name: 'Light',
    background: '#ffffff',
    foreground: '#333333',
    accent: '#0066cc',
    border: '#e1e1e1',
    syntax: {
      keyword: '#0000ff',
      string: '#a31515',
      number: '#098658',
      comment: '#008000',
      function: '#795e26'
    }
  },
  {
    name: 'Monokai',
    background: '#272822',
    foreground: '#f8f8f2',
    accent: '#66d9ef',
    border: '#49483e',
    syntax: {
      keyword: '#f92672',
      string: '#e6db74',
      number: '#ae81ff',
      comment: '#75715e',
      function: '#a6e22e'
    }
  }
]

const codeTemplates = {
  'Array Methods': `// Array manipulation examples
const numbers = [1, 2, 3, 4, 5];

// Transform data
const doubled = numbers.map(n => n * 2);
console.log('Doubled:', doubled);

// Filter data
const evens = numbers.filter(n => n % 2 === 0);
console.log('Evens:', evens);

// Reduce data
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log('Sum:', sum);

// Chain operations
const result = numbers
  .filter(n => n > 2)
  .map(n => n * 3)
  .reduce((acc, n) => acc + n, 0);
console.log('Chained result:', result);`,

  'Promise Handling': `// Async operations with Promises
async function fetchUserData(userId) {
  try {
    // Simulate API call
    const response = await new Promise(resolve => {
      setTimeout(() => {
        resolve({
          id: userId,
          name: 'John Doe',
          email: 'john@example.com'
        });
      }, 1000);
    });
    
    console.log('User data:', response);
    return response;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// Promise.all for parallel execution
async function fetchMultipleUsers() {
  const userIds = [1, 2, 3];
  
  try {
    const users = await Promise.all(
      userIds.map(id => fetchUserData(id))
    );
    console.log('All users:', users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
}

fetchMultipleUsers();`,

  'Object Manipulation': `// Advanced object operations
const user = {
  name: 'Alice',
  age: 30,
  skills: ['JavaScript', 'React', 'Node.js'],
  address: {
    city: 'New York',
    country: 'USA'
  }
};

// Object destructuring
const { name, age, skills, address: { city } } = user;
console.log(\`\${name} (\${age}) from \${city}\`);

// Object spread and rest
const updatedUser = {
  ...user,
  age: 31,
  skills: [...user.skills, 'TypeScript']
};
console.log('Updated user:', updatedUser);

// Object methods
console.log('Keys:', Object.keys(user));
console.log('Values:', Object.values(user));
console.log('Entries:', Object.entries(user));

// Dynamic property access
const property = 'name';
console.log('Dynamic access:', user[property]);`,

  'ES6+ Features': `// Modern JavaScript features
class Developer {
  constructor(name, languages = []) {
    this.name = name;
    this.languages = new Set(languages);
  }
  
  addLanguage(language) {
    this.languages.add(language);
    return this; // Method chaining
  }
  
  hasLanguage(language) {
    return this.languages.has(language);
  }
  
  get languageCount() {
    return this.languages.size;
  }
  
  toString() {
    return \`\${this.name}: \${Array.from(this.languages).join(', ')}\`;
  }
}

// Usage
const dev = new Developer('Sarah', ['JavaScript', 'Python'])
  .addLanguage('TypeScript')
  .addLanguage('Rust');

console.log(dev.toString());
console.log('Knows TypeScript:', dev.hasLanguage('TypeScript'));
console.log('Total languages:', dev.languageCount);

// Template literals and tagged templates
function highlight(strings, ...values) {
  return strings.reduce((result, string, i) => {
    const value = values[i] ? \`**\${values[i]}**\` : '';
    return result + string + value;
  }, '');
}

const name = 'JavaScript';
const year = 2024;
const message = highlight\`Learning \${name} in \${year}!\`;
console.log(message);`
}

export default function AdvancedCodePlayground({ 
  initialCode = '',
  objectContext = null,
  showTutorial = false 
}: {
  initialCode?: string
  objectContext?: string | null
  showTutorial?: boolean
}) {
  const [code, setCode] = useState(initialCode || codeTemplates['Array Methods'])
  const [isRunning, setIsRunning] = useState(false)
  const [executions, setExecutions] = useState<CodeExecution[]>([])
  const [selectedTheme, setSelectedTheme] = useState(0)
  const [showConsole, setShowConsole] = useState(true)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [fontSize, setFontSize] = useState(14)
  const [autoRun, setAutoRun] = useState(false)
  const [showMinimap, setShowMinimap] = useState(false)
  const [executionStats, setExecutionStats] = useState({
    totalExecutions: 0,
    avgDuration: 0,
    successRate: 0
  })

  const editorRef = useRef<HTMLTextAreaElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const currentTheme = themes[selectedTheme]

  // Auto-save code to localStorage
  useEffect(() => {
    const savedCode = localStorage.getItem('playground-code')
    if (savedCode && !initialCode) {
      setCode(savedCode)
    }
  }, [initialCode])

  useEffect(() => {
    localStorage.setItem('playground-code', code)
  }, [code])

  // Auto-run functionality
  useEffect(() => {
    if (autoRun && code.trim()) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        executeCode()
      }, 2000)
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [code, autoRun])

  // Code suggestions based on context
  const getCodeSuggestions = useCallback((codeText: string): CodeSuggestion[] => {
    const suggestions: CodeSuggestion[] = []
    
    if (codeText.includes('array') || codeText.includes('[]')) {
      suggestions.push({
        text: 'Array.map()',
        description: 'Transform each element in an array',
        category: 'method',
        insertText: '.map(item => item)'
      })
      suggestions.push({
        text: 'Array.filter()',
        description: 'Filter elements based on condition',
        category: 'method',
        insertText: '.filter(item => condition)'
      })
    }
    
    if (codeText.includes('async') || codeText.includes('Promise')) {
      suggestions.push({
        text: 'await expression',
        description: 'Wait for Promise to resolve',
        category: 'syntax',
        insertText: 'await '
      })
      suggestions.push({
        text: 'try/catch',
        description: 'Handle async errors',
        category: 'best-practice',
        insertText: 'try {\n  \n} catch (error) {\n  console.error(error);\n}'
      })
    }
    
    return suggestions
  }, [])

  const executeCode = useCallback(async () => {
    if (isRunning) return
    
    setIsRunning(true)
    const startTime = performance.now()
    const executionId = Date.now().toString()
    
    try {
      // Capture console output
      const originalConsole = { ...console }
      const output: string[] = []
      const errors: string[] = []
      
      console.log = (...args) => {
        output.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '))
      }
      
      console.error = (...args) => {
        errors.push(args.map(arg => String(arg)).join(' '))
      }
      
      console.warn = (...args) => {
        output.push('⚠️ ' + args.map(arg => String(arg)).join(' '))
      }
      
      // Execute in isolated context
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
      const fn = new AsyncFunction(`
        ${code}
        return 'Execution completed successfully';
      `)
      
      const result = await Promise.race([
        fn(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Execution timeout')), 10000)
        )
      ])
      
      // Restore console
      Object.assign(console, originalConsole)
      
      const duration = performance.now() - startTime
      const execution: CodeExecution = {
        id: executionId,
        code,
        output,
        errors,
        duration,
        timestamp: new Date(),
        success: errors.length === 0
      }
      
      setExecutions(prev => [execution, ...prev.slice(0, 9)])
      
      // Update stats
      setExecutionStats(prev => {
        const newTotal = prev.totalExecutions + 1
        const newAvg = (prev.avgDuration * prev.totalExecutions + duration) / newTotal
        const successCount = executions.filter(e => e.success).length + (execution.success ? 1 : 0)
        const newSuccessRate = (successCount / newTotal) * 100
        
        return {
          totalExecutions: newTotal,
          avgDuration: newAvg,
          successRate: newSuccessRate
        }
      })
      
    } catch (error) {
      const duration = performance.now() - startTime
      const execution: CodeExecution = {
        id: executionId,
        code,
        output: [],
        errors: [error instanceof Error ? error.message : String(error)],
        duration,
        timestamp: new Date(),
        success: false
      }
      
      setExecutions(prev => [execution, ...prev.slice(0, 9)])
    } finally {
      setIsRunning(false)
    }
  }, [code, isRunning, executions])

  const downloadCode = useCallback(() => {
    const blob = new Blob([code], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `playground-${Date.now()}.js`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [code])

  const shareCode = useCallback(async () => {
    const encodedCode = btoa(encodeURIComponent(code))
    const shareUrl = `${window.location.origin}${window.location.pathname}?code=${encodedCode}`
    
    try {
      await navigator.clipboard.writeText(shareUrl)
      alert('Share link copied to clipboard!')
    } catch (error) {
      prompt('Copy this link to share your code:', shareUrl)
    }
  }, [code])

  const suggestions = useMemo(() => getCodeSuggestions(code), [code, getCodeSuggestions])

  const editorStyles = {
    backgroundColor: currentTheme.background,
    color: currentTheme.foreground,
    fontSize: `${fontSize}px`,
    fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    border: `1px solid ${currentTheme.border}`,
    lineHeight: 1.5
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : ''} bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700`}>
      {/* Enhanced Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <button
              onClick={executeCode}
              disabled={isRunning}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                isRunning
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
              }`}
            >
              {isRunning ? (
                <>
                  <Square className="h-4 w-4 mr-1" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Run Code
                </>
              )}
            </button>
            
            <button
              onClick={() => setCode('')}
              className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm font-medium transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center space-x-1">
            <select
              value={Object.keys(codeTemplates).findIndex(key => codeTemplates[key as keyof typeof codeTemplates] === code)}
              onChange={(e) => {
                const templateKey = Object.keys(codeTemplates)[parseInt(e.target.value)]
                if (templateKey) {
                  setCode(codeTemplates[templateKey as keyof typeof codeTemplates])
                }
              }}
              className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value={-1}>Select Template</option>
              {Object.keys(codeTemplates).map((template, index) => (
                <option key={template} value={index}>{template}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Execution Stats */}
          <div className="hidden md:flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <Target className="h-3 w-3 mr-1" />
              {executionStats.totalExecutions} runs
            </div>
            <div className="flex items-center">
              <Zap className="h-3 w-3 mr-1" />
              {executionStats.avgDuration.toFixed(1)}ms avg
            </div>
            <div className="flex items-center">
              <Trophy className="h-3 w-3 mr-1" />
              {executionStats.successRate.toFixed(1)}% success
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setAutoRun(!autoRun)}
              className={`px-2 py-1 text-xs rounded ${
                autoRun 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              Auto-run
            </button>
            
            <button
              onClick={() => setShowConsole(!showConsole)}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              {showConsole ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            
            <button
              onClick={shareCode}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <Share2 className="h-4 w-4" />
            </button>
            
            <button
              onClick={downloadCode}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <Download className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="relative flex-1">
            <textarea
              ref={editorRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={editorStyles}
              className="w-full h-96 p-4 resize-none outline-none"
              placeholder="Write your JavaScript code here..."
              spellCheck={false}
            />
            
            {/* Code Suggestions Panel */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-2 right-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-1 text-yellow-500" />
                  Suggestions
                </h4>
                <div className="space-y-2">
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-2 bg-gray-50 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      onClick={() => {
                        const newCode = code + '\n' + suggestion.insertText
                        setCode(newCode)
                      }}
                    >
                      <div className="text-xs font-medium text-gray-900 dark:text-gray-100">
                        {suggestion.text}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {suggestion.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Settings Panel */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Theme:</label>
                  <select
                    value={selectedTheme}
                    onChange={(e) => setSelectedTheme(parseInt(e.target.value))}
                    className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
                  >
                    {themes.map((theme, index) => (
                      <option key={theme.name} value={index}>{theme.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Font Size:</label>
                  <input
                    type="range"
                    min="12"
                    max="20"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{fontSize}px</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className={`text-xs px-2 py-1 rounded ${
                    showSuggestions 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  Suggestions
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Console Output */}
        {showConsole && (
          <div className="w-1/3 border-l border-gray-200 dark:border-gray-700 bg-gray-900 text-gray-100">
            <div className="flex items-center justify-between p-3 border-b border-gray-700">
              <h3 className="text-sm font-medium flex items-center">
                <Terminal className="h-4 w-4 mr-2" />
                Console Output
              </h3>
              <button
                onClick={() => setExecutions([])}
                className="text-xs text-gray-400 hover:text-gray-200"
              >
                Clear
              </button>
            </div>
            
            <div className="h-96 overflow-y-auto p-3 space-y-2">
              {executions.length === 0 ? (
                <div className="text-gray-500 text-sm italic">Run your code to see output here...</div>
              ) : (
                executions.map((execution) => (
                  <div key={execution.id} className="border-b border-gray-700 pb-2 mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${execution.success ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-xs text-gray-400">
                          {execution.timestamp.toLocaleTimeString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {execution.duration.toFixed(1)}ms
                        </span>
                      </div>
                    </div>
                    
                    {execution.output.map((line, index) => (
                      <div key={index} className="text-sm text-gray-200 font-mono mb-1">
                        {line}
                      </div>
                    ))}
                    
                    {execution.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-400 font-mono mb-1">
                        ❌ {error}
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
