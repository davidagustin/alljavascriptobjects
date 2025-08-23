import { ERROR_MESSAGES } from './constants'

export interface CodeExecutionError {
  type: 'syntax' | 'runtime' | 'timeout' | 'security' | 'memory'
  message: string
  line?: number
  column?: number
  stack?: string
  suggestions?: string[]
}

export class EnhancedError extends Error {
  type: CodeExecutionError['type']
  suggestions: string[]
  
  constructor(
    type: CodeExecutionError['type'], 
    message: string, 
    suggestions: string[] = []
  ) {
    super(message)
    this.name = 'EnhancedError'
    this.type = type
    this.suggestions = suggestions
  }
}

// Enhanced error parser for better user experience
export function parseJavaScriptError(error: Error): CodeExecutionError {
  const message = error.message.toLowerCase()
  const stack = error.stack || ''
  
  // Extract line and column information
  const lineMatch = stack.match(/(?:at|@).*?:(\d+):(\d+)/)
  const line = lineMatch ? parseInt(lineMatch[1]) : undefined
  const column = lineMatch ? parseInt(lineMatch[2]) : undefined

  let type: CodeExecutionError['type'] = 'runtime'
  let suggestions: string[] = []

  // Categorize common errors and provide helpful suggestions
  if (message.includes('syntaxerror') || message.includes('unexpected')) {
    type = 'syntax'
    suggestions = [
      'Check for missing brackets, parentheses, or semicolons',
      'Verify string quotes are properly closed',
      'Ensure variable names don\'t start with numbers',
      'Check for reserved keyword usage'
    ]
  } else if (message.includes('referenceerror')) {
    type = 'runtime'
    suggestions = [
      'Check if the variable is declared before use',
      'Verify variable names are spelled correctly',
      'Ensure the variable is in the correct scope',
      'Check for typos in function or object names'
    ]
  } else if (message.includes('typeerror')) {
    type = 'runtime'
    if (message.includes('null') || message.includes('undefined')) {
      suggestions = [
        'Check if the object exists before accessing properties',
        'Use optional chaining (?.) for safer property access',
        'Initialize variables before using them',
        'Check for null or undefined values'
      ]
    } else if (message.includes('not a function')) {
      suggestions = [
        'Check if the variable is actually a function',
        'Verify function names are spelled correctly',
        'Ensure the function is defined before calling',
        'Check if you\'re calling a method on the right object'
      ]
    } else {
      suggestions = [
        'Check the data types being used',
        'Verify method calls on correct object types',
        'Ensure operations are valid for the data types'
      ]
    }
  } else if (message.includes('rangeerror')) {
    type = 'runtime'
    suggestions = [
      'Check array indices are within bounds',
      'Verify numeric values are within valid ranges',
      'Check recursion depth isn\'t too deep',
      'Ensure loop conditions will eventually terminate'
    ]
  } else if (message.includes('timeout') || message.includes('timed out')) {
    type = 'timeout'
    suggestions = [
      'Check for infinite loops',
      'Reduce computational complexity',
      'Use setTimeout for long-running operations',
      'Consider breaking operations into smaller chunks'
    ]
  } else if (message.includes('memory') || message.includes('heap')) {
    type = 'memory'
    suggestions = [
      'Reduce array or object sizes',
      'Clear unused variables',
      'Check for memory leaks',
      'Use more efficient algorithms'
    ]
  }

  return {
    type,
    message: error.message,
    line,
    column,
    stack,
    suggestions
  }
}

// Safe code execution with comprehensive error handling
export async function executeCodeSafely(
  code: string,
  timeout: number = 5000
): Promise<{ result?: string; error?: CodeExecutionError }> {
  if (!code.trim()) {
    return { result: 'Code is empty' }
  }

  // Check for potentially dangerous patterns
  const dangerousPatterns = [
    /while\s*\(\s*true\s*\)/gi, // Infinite while loops
    /for\s*\(\s*;\s*;\s*\)/gi,   // Infinite for loops
    /eval\s*\(/gi,              // Eval usage
    /Function\s*\(/gi,          // Dynamic function creation
    /import\s*\(/gi,            // Dynamic imports
    /require\s*\(/gi,           // Node.js require
    /document\s*\./gi,          // DOM access
    /window\s*\./gi,            // Window access
    /global\s*\./gi,            // Global access
    /process\s*\./gi,           // Process access
    /fetch\s*\(/gi,             // Network requests
    /XMLHttpRequest/gi,         // XHR requests
    /localStorage/gi,           // Local storage access
    /sessionStorage/gi,         // Session storage access
  ]

  for (const pattern of dangerousPatterns) {
    if (pattern.test(code)) {
      return {
        error: {
          type: 'security',
          message: 'Code contains potentially unsafe patterns',
          suggestions: [
            'Avoid infinite loops',
            'Don\'t use eval() or dynamic code execution',
            'Avoid accessing browser APIs in this sandbox',
            'Focus on pure JavaScript logic'
          ]
        }
      }
    }
  }

  // Create isolated execution environment
  const consoleOutput: string[] = []
  const mockConsole = {
    log: (...args: any[]) => {
      consoleOutput.push(
        args.map(arg => {
          if (typeof arg === 'object' && arg !== null) {
            try {
              return JSON.stringify(arg, null, 2)
            } catch {
              return String(arg)
            }
          }
          return String(arg)
        }).join(' ')
      )
    },
    error: (...args: any[]) => consoleOutput.push('ERROR: ' + args.map(String).join(' ')),
    warn: (...args: any[]) => consoleOutput.push('WARN: ' + args.map(String).join(' ')),
    info: (...args: any[]) => consoleOutput.push('INFO: ' + args.map(String).join(' ')),
    debug: (...args: any[]) => consoleOutput.push('DEBUG: ' + args.map(String).join(' ')),
  }

  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      resolve({
        error: {
          type: 'timeout',
          message: ERROR_MESSAGES.CODE_EXECUTION_TIMEOUT,
          suggestions: [
            'Check for infinite loops',
            'Simplify complex calculations',
            'Break down large operations'
          ]
        }
      })
    }, timeout)

    try {
      // Create function with limited scope
      const func = new Function(
        'console',
        `
        "use strict";
        ${code}
        `
      )

      const result = func(mockConsole)
      clearTimeout(timeoutId)
      
      const output = consoleOutput.length > 0 
        ? consoleOutput.join('\n')
        : result !== undefined 
          ? String(result)
          : 'Code executed successfully (no output)'

      resolve({ result: output })
    } catch (error) {
      clearTimeout(timeoutId)
      const parsedError = parseJavaScriptError(error as Error)
      resolve({ error: parsedError })
    }
  })
}

// Error reporting utility
export function reportError(
  error: CodeExecutionError,
  context: {
    userAgent?: string
    timestamp?: number
    code?: string
    objectName?: string
  } = {}
) {
  // In production, you might want to send this to an error tracking service
  const errorReport = {
    ...error,
    context: {
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      url: window.location.href,
      ...context
    }
  }

  // For now, just log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.group('🐛 JavaScript Objects Tutorial - Error Report')
    console.error('Error:', errorReport)
    console.groupEnd()
  }

  // You could integrate with services like Sentry, LogRocket, etc.
  // Sentry.captureException(error, { extra: context })
}

// User-friendly error messages
export function getErrorDisplayMessage(error: CodeExecutionError): string {
  const baseMessage = error.message
  
  switch (error.type) {
    case 'syntax':
      return `Syntax Error: ${baseMessage}\n\nThis usually means there's a problem with how your code is written.`
    
    case 'runtime':
      return `Runtime Error: ${baseMessage}\n\nThis error occurred while your code was running.`
    
    case 'timeout':
      return `Timeout Error: Your code took too long to execute.\n\nThis might be caused by an infinite loop or very complex calculations.`
    
    case 'security':
      return `Security Error: ${baseMessage}\n\nFor safety reasons, some code patterns are not allowed in this environment.`
    
    case 'memory':
      return `Memory Error: ${baseMessage}\n\nYour code used too much memory. Try to optimize your data structures.`
    
    default:
      return `Error: ${baseMessage}`
  }
}

// Recovery suggestions based on error patterns
export function getRecoverySuggestions(error: CodeExecutionError): string[] {
  const baseSuggestions = error.suggestions || []
  
  // Add general suggestions based on error type
  switch (error.type) {
    case 'syntax':
      return [
        ...baseSuggestions,
        'Use a code formatter to help identify syntax issues',
        'Check for matching brackets and parentheses',
        'Validate string quotes and escape characters'
      ]
    
    case 'runtime':
      return [
        ...baseSuggestions,
        'Add console.log statements to debug values',
        'Use try-catch blocks for error handling',
        'Check variable initialization'
      ]
    
    case 'timeout':
      return [
        ...baseSuggestions,
        'Add breakpoints or console.log to find slow parts',
        'Use array methods like map/filter instead of loops when possible',
        'Consider async/await for heavy operations'
      ]
    
    case 'memory':
      return [
        ...baseSuggestions,
        'Use let/const instead of var to limit scope',
        'Clear large arrays when done: array.length = 0',
        'Avoid creating too many objects in loops'
      ]
    
    default:
      return baseSuggestions
  }
}

// Code quality analyzer
export function analyzeCodeQuality(code: string): {
  score: number
  issues: Array<{
    type: 'warning' | 'suggestion' | 'best-practice'
    message: string
    line?: number
  }>
} {
  const issues: Array<{
    type: 'warning' | 'suggestion' | 'best-practice'
    message: string
    line?: number
  }> = []

  const lines = code.split('\n')
  let score = 100

  lines.forEach((line, index) => {
    const lineNumber = index + 1
    
    // Check for var usage (prefer let/const)
    if (line.includes('var ')) {
      issues.push({
        type: 'best-practice',
        message: 'Consider using let or const instead of var',
        line: lineNumber
      })
      score -= 2
    }

    // Check for == usage (prefer ===)
    if (line.includes('==') && !line.includes('===')) {
      issues.push({
        type: 'best-practice',
        message: 'Consider using === instead of == for strict equality',
        line: lineNumber
      })
      score -= 3
    }

    // Check for console.log (should be removed in production)
    if (line.includes('console.log')) {
      issues.push({
        type: 'suggestion',
        message: 'Consider removing console.log statements in production code',
        line: lineNumber
      })
      score -= 1
    }

    // Check for magic numbers
    const magicNumberPattern = /\b\d{2,}\b/
    if (magicNumberPattern.test(line) && !line.includes('//')) {
      issues.push({
        type: 'suggestion',
        message: 'Consider using named constants instead of magic numbers',
        line: lineNumber
      })
      score -= 1
    }

    // Check for long lines
    if (line.length > 100) {
      issues.push({
        type: 'suggestion',
        message: 'Line is quite long, consider breaking it up',
        line: lineNumber
      })
      score -= 1
    }
  })

  return {
    score: Math.max(0, score),
    issues
  }
}