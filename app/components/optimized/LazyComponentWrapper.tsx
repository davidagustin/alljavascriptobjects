'use client'

import React, { Suspense, ComponentType } from 'react'
import LoadingSpinner from '../shared/LoadingSpinner'

interface LazyComponentWrapperProps {
  fallback?: React.ReactNode
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>
}

function DefaultErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-red-500 mb-4">
        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Failed to Load Component
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {error.message || 'Something went wrong while loading this component.'}
      </p>
      <button
        onClick={retry}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  )
}

function withLazyLoading<P extends object>(
  LazyComponent: React.LazyExoticComponent<ComponentType<P>>,
  options: LazyComponentWrapperProps = {}
) {
  return function LazyComponentWrapper(props: P) {
    const { fallback, errorFallback: ErrorFallback = DefaultErrorFallback } = options
    
    const defaultFallback = (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    )

    return (
      <ErrorBoundary ErrorFallback={ErrorFallback}>
        <Suspense fallback={fallback || defaultFallback}>
          <LazyComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    )
  }
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; ErrorFallback: ComponentType<{ error: Error; retry: () => void }> },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy component error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const { ErrorFallback } = this.props
      return (
        <ErrorFallback
          error={this.state.error}
          retry={() => this.setState({ hasError: false, error: null })}
        />
      )
    }

    return this.props.children
  }
}

export default withLazyLoading