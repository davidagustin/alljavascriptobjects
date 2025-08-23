/**
 * Safe code execution and error handling utilities
 */

export interface CodeExecutionResult {
  result: unknown
  consoleOutput: Array<{
    type: 'log' | 'error' | 'warn' | 'info'
    content: unknown[]
  }>
  errors: string[]
  executionTime: number
  memoryUsage?: number
}

export interface ExecutionOptions {
  timeout?: number
  maxMemory?: number
  allowNetwork?: boolean
  allowFileSystem?: boolean
  allowEval?: boolean
  sandbox?: boolean
}

/**
 * Safely execute JavaScript code with comprehensive error handling
 */
export async function executeCodeSafely(
  code: string,
  options: ExecutionOptions = {}
): Promise<CodeExecutionResult> {
  const {
    timeout = 5000,
    maxMemory = 50 * 1024 * 1024, // 50MB
    allowNetwork = false,
    allowFileSystem = false,
    allowEval = false,
    sandbox = true
  } = options

  const startTime = performance.now()
  const consoleOutput: CodeExecutionResult['consoleOutput'] = []
  const errors: string[] = []

  try {
    // Create a safe execution environment
    const safeGlobals = createSafeEnvironment({
      allowNetwork,
      allowFileSystem,
      allowEval,
      sandbox
    })

    // Override console methods to capture output
    const originalConsole = { ...console }
    const capturedOutput: CodeExecutionResult['consoleOutput'] = []

    Object.keys(safeGlobals.console).forEach(key => {
      const original = console[key as keyof Console]
      console[key as keyof Console] = (...args: any[]) => {
        const result = safeGlobals.console[key as keyof typeof safeGlobals.console](...args)
        if (result) capturedOutput.push(result)
        original.apply(console, args)
      }
    })

    // Execute code with timeout
    const executionPromise = new Promise((resolve, reject) => {
      try {
        if (sandbox) {
          // Create function with restricted scope
          const func = new Function(...Object.keys(safeGlobals), code)
          const result = func(...Object.values(safeGlobals))
          resolve(result)
        } else {
          // Direct execution (less safe)
          const result = eval(code)
          resolve(result)
        }
      } catch (error) {
        reject(error)
      }
    })

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Execution timeout (${timeout}ms)`))
      }, timeout)
    })

    const result = await Promise.race([executionPromise, timeoutPromise])

    // Restore original console
    Object.keys(originalConsole).forEach(key => {
      console[key as keyof Console] = originalConsole[key as keyof Console]
    })

    const executionTime = performance.now() - startTime

    return {
      result,
      consoleOutput: capturedOutput,
      errors,
      executionTime
    }

  } catch (error) {
    const executionTime = performance.now() - startTime
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    return {
      result: undefined,
      consoleOutput,
      errors: [errorMessage],
      executionTime
    }
  }
}

/**
 * Create a safe execution environment with restricted globals
 */
function createSafeEnvironment(options: {
  allowNetwork: boolean
  allowFileSystem: boolean
  allowEval: boolean
  sandbox: boolean
}) {
  const { allowNetwork, allowFileSystem, allowEval, sandbox } = options

  const safeGlobals: Record<string, any> = {
    // Basic JavaScript objects
    Object,
    Array,
    String,
    Number,
    Boolean,
    Symbol,
    BigInt,
    Date,
    RegExp,
    Error,
    TypeError,
    RangeError,
    SyntaxError,
    ReferenceError,
    URIError,
    EvalError,
    AggregateError,
    
    // Math and utilities
    Math,
    JSON,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    encodeURI,
    decodeURI,
    encodeURIComponent,
    decodeURIComponent,
    escape,
    unescape,
    
    // Collections
    Map,
    Set,
    WeakMap,
    WeakSet,
    
    // Typed Arrays
    ArrayBuffer,
    SharedArrayBuffer,
    DataView,
    Int8Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array,
    BigInt64Array,
    BigUint64Array,
    
    // Async and iteration
    Promise,
    Generator,
    GeneratorFunction,
    AsyncGenerator,
    AsyncGeneratorFunction,
    Iterator,
    AsyncIterator,
    
    // Meta programming
    Proxy,
    Reflect,
    
    // Memory management
    WeakRef,
    FinalizationRegistry,
    
    // Console with captured output
    console: {
      log: (...args: any[]) => ({
        type: 'log' as const,
        content: args
      }),
      error: (...args: any[]) => ({
        type: 'error' as const,
        content: args
      }),
      warn: (...args: any[]) => ({
        type: 'warn' as const,
        content: args
      }),
      info: (...args: any[]) => ({
        type: 'info' as const,
        content: args
      })
    },

    // Timers with restrictions
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

    // Global object
    globalThis: sandbox ? {} : globalThis
  }

  // Add network APIs if allowed
  if (allowNetwork) {
    safeGlobals.fetch = fetch
    safeGlobals.XMLHttpRequest = XMLHttpRequest
  }

  // Add file system APIs if allowed
  if (allowFileSystem) {
    safeGlobals.FileReader = FileReader
    safeGlobals.Blob = Blob
    safeGlobals.File = File
  }

  // Add eval if allowed
  if (allowEval) {
    safeGlobals.eval = eval
  }

  return safeGlobals
}

/**
 * Validate code for potential security issues
 */
export function validateCode(code: string): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Check for potentially dangerous patterns
  const dangerousPatterns = [
    { pattern: /eval\s*\(/, message: 'eval() is not allowed for security reasons' },
    { pattern: /Function\s*\(/, message: 'Function constructor is not allowed' },
    { pattern: /import\s*\(/, message: 'Dynamic imports are not allowed' },
    { pattern: /require\s*\(/, message: 'require() is not allowed' },
    { pattern: /process\./, message: 'Node.js process object is not available' },
    { pattern: /window\./, message: 'Direct window access is restricted' },
    { pattern: /document\./, message: 'Direct document access is restricted' },
    { pattern: /localStorage\./, message: 'localStorage access is restricted' },
    { pattern: /sessionStorage\./, message: 'sessionStorage access is restricted' },
    { pattern: /indexedDB\./, message: 'IndexedDB access is restricted' },
    { pattern: /fetch\s*\(/, message: 'Network requests are not allowed by default' },
    { pattern: /XMLHttpRequest/, message: 'XMLHttpRequest is not allowed by default' },
    { pattern: /WebSocket/, message: 'WebSocket is not allowed' },
    { pattern: /Worker/, message: 'Web Workers are not allowed' },
    { pattern: /SharedWorker/, message: 'Shared Workers are not allowed' },
    { pattern: /ServiceWorker/, message: 'Service Workers are not allowed' },
    { pattern: /navigator\./, message: 'Navigator access is restricted' },
    { pattern: /location\./, message: 'Location access is restricted' },
    { pattern: /history\./, message: 'History access is restricted' }
  ]

  dangerousPatterns.forEach(({ pattern, message }) => {
    if (pattern.test(code)) {
      errors.push(message)
    }
  })

  // Check for performance issues
  const performanceWarnings = [
    { pattern: /while\s*\(true\)/, message: 'Infinite loops can cause performance issues' },
    { pattern: /for\s*\([^)]*\)\s*{[^}]*while\s*\(true\)/, message: 'Nested infinite loops detected' },
    { pattern: /setInterval\s*\([^,]*,\s*0\)/, message: 'setInterval with 0 delay can cause performance issues' },
    { pattern: /setTimeout\s*\([^,]*,\s*0\)/, message: 'setTimeout with 0 delay can cause performance issues' }
  ]

  performanceWarnings.forEach(({ pattern, message }) => {
    if (pattern.test(code)) {
      warnings.push(message)
    }
  })

  // Check code length
  if (code.length > 10000) {
    warnings.push('Code is very long and may take time to execute')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Format error messages for better readability
 */
export function formatError(error: Error | string): string {
  const message = error instanceof Error ? error.message : error
  
  // Common error patterns
  const patterns = [
    {
      regex: /Unexpected token (.+)/,
      format: (match: RegExpMatchArray) => `Syntax error: Unexpected ${match[1]}`
    },
    {
      regex: /Cannot read property '(.+)' of (.+)/,
      format: (match: RegExpMatchArray) => `Cannot read property '${match[1]}' of ${match[2]}`
    },
    {
      regex: /(.+) is not defined/,
      format: (match: RegExpMatchArray) => `'${match[1]}' is not defined`
    },
    {
      regex: /(.+) is not a function/,
      format: (match: RegExpMatchArray) => `'${match[1]}' is not a function`
    }
  ]

  for (const pattern of patterns) {
    const match = message.match(pattern.regex)
    if (match) {
      return pattern.format(match)
    }
  }

  return message
}

/**
 * Get error type and severity
 */
export function analyzeError(error: Error | string): {
  type: 'syntax' | 'runtime' | 'reference' | 'type' | 'range' | 'uri' | 'eval' | 'aggregate' | 'unknown'
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'parsing' | 'execution' | 'security' | 'performance' | 'other'
} {
  const message = error instanceof Error ? error.message : String(error).toLowerCase()

  // Determine error type
  let type: any = 'unknown'
  if (message.includes('unexpected token') || message.includes('syntax')) {
    type = 'syntax'
  } else if (message.includes('not defined') || message.includes('cannot read')) {
    type = 'reference'
  } else if (message.includes('not a function') || message.includes('type')) {
    type = 'type'
  } else if (message.includes('out of range') || message.includes('index')) {
    type = 'range'
  } else if (message.includes('uri') || message.includes('url')) {
    type = 'uri'
  } else if (message.includes('eval')) {
    type = 'eval'
  } else if (message.includes('aggregate')) {
    type = 'aggregate'
  } else if (message.includes('timeout') || message.includes('execution')) {
    type = 'runtime'
  }

  // Determine severity
  let severity: any = 'medium'
  if (message.includes('security') || message.includes('eval') || message.includes('function')) {
    severity = 'critical'
  } else if (message.includes('timeout') || message.includes('memory')) {
    severity = 'high'
  } else if (message.includes('performance') || message.includes('infinite')) {
    severity = 'medium'
  } else if (message.includes('warning') || message.includes('deprecated')) {
    severity = 'low'
  }

  // Determine category
  let category: any = 'other'
  if (type === 'syntax') {
    category = 'parsing'
  } else if (['runtime', 'reference', 'type', 'range', 'uri'].includes(type)) {
    category = 'execution'
  } else if (type === 'eval' || message.includes('security')) {
    category = 'security'
  } else if (message.includes('timeout') || message.includes('performance')) {
    category = 'performance'
  }

  return { type, severity, category }
}