'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug, Copy, Check } from 'lucide-react'
import { performanceMonitor } from '../utils/performance'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: React.ComponentType<ErrorBoundaryState>
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryCount = 0
  private readonly maxRetries = 3

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Generate unique error ID for tracking
    const errorId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    return {
      hasError: true,
      error,
      errorId
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })

    // Track error in performance monitoring
    performanceMonitor.recordMetric('error_boundary_triggered', 1, {
      error: error.name,
      message: error.message,
      stack: error.stack?.slice(0, 200) || 'No stack trace',
      componentStack: errorInfo.componentStack?.slice(0, 200) || 'No component stack'
    })

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    // Log error details for debugging
    console.group('🚨 Error Boundary Caught Error')
    console.error('Error:', error)
    console.error('Error Info:', errorInfo)
    console.error('Component Stack:', errorInfo.componentStack)
    console.groupEnd()

    // Report error to external service (if implemented)
    this.reportError(error, errorInfo)
  }

  private reportError = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      // This would send error to external service like Sentry, LogRocket, etc.
      const errorReport = {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        errorInfo: {
          componentStack: errorInfo.componentStack
        },
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        errorId: this.state.errorId,
        retryCount: this.retryCount
      }

      // For now, just store in localStorage for debugging
      const existingErrors = JSON.parse(localStorage.getItem('error-reports') || '[]')
      existingErrors.push(errorReport)
      localStorage.setItem('error-reports', JSON.stringify(existingErrors.slice(-10))) // Keep last 10 errors
      
      console.log('Error reported:', errorReport)
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError)
    }
  }

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null
      })

      // Track retry attempt
      performanceMonitor.recordMetric('error_boundary_retry', this.retryCount)
    }
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  private handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent {...this.state} />
      }

      // Default error UI
      return <DefaultErrorFallback {...this.state} onRetry={this.handleRetry} onGoHome={this.handleGoHome} onReload={this.handleReload} />
    }

    return this.props.children
  }
}

interface DefaultErrorFallbackProps extends ErrorBoundaryState {
  onRetry: () => void
  onGoHome: () => void
  onReload: () => void
}

function DefaultErrorFallback({ 
  error, 
  errorInfo, 
  errorId, 
  onRetry, 
  onGoHome, 
  onReload 
}: DefaultErrorFallbackProps) {
  const [copied, setCopied] = React.useState(false)
  const [showDetails, setShowDetails] = React.useState(false)

  const copyErrorDetails = async () => {
    const errorDetails = {
      error: {
        name: error?.name,
        message: error?.message,
        stack: error?.stack
      },
      componentStack: errorInfo?.componentStack,
      errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    try {
      await navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy error details:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Something went wrong
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The application encountered an unexpected error. Don't worry, your progress is saved.
        </p>

        {errorId && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 p-2 bg-gray-100 dark:bg-gray-700 rounded">
            Error ID: {errorId}
          </div>
        )}

        <div className="space-y-3 mb-6">
          <button
            onClick={onRetry}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
          
          <button
            onClick={onGoHome}
            className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Home
          </button>
          
          <button
            onClick={onReload}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reload Page
          </button>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center mx-auto"
          >
            <Bug className="h-3 w-3 mr-1" />
            {showDetails ? 'Hide' : 'Show'} Technical Details
          </button>

          {showDetails && (
            <div className="mt-4 text-left">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-3 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Error Details</span>
                  <button
                    onClick={copyErrorDetails}
                    className="flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span className="ml-1">{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                
                <div className="space-y-2 text-gray-600 dark:text-gray-400">
                  {error?.name && (
                    <div>
                      <strong>Type:</strong> {error.name}
                    </div>
                  )}
                  {error?.message && (
                    <div>
                      <strong>Message:</strong> {error.message}
                    </div>
                  )}
                  {error?.stack && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="text-xs mt-1 overflow-x-auto whitespace-pre-wrap">
                        {error.stack.split('\n').slice(0, 5).join('\n')}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                This information helps developers fix the issue. You can safely copy and share it.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ErrorBoundary

// Hook for manual error reporting
export function useErrorReporting() {
  const reportError = React.useCallback((error: Error, context?: string) => {
    performanceMonitor.recordMetric('manual_error_report', 1, {
      error: error.name,
      message: error.message,
      context: context || 'unknown'
    })

    console.error('Manual error report:', error, context)
  }, [])

  return { reportError }
}

// Higher-order component wrapper
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    )
  }
}