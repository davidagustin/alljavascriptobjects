'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { BarChart3, Activity, Clock, Zap, TrendingUp, Monitor, MemoryStick, Eye, Download } from 'lucide-react'

interface PerformanceMetric {
  id: string
  name: string
  value: number
  unit: string
  timestamp: number
  category: 'execution' | 'memory' | 'interaction' | 'network' | 'rendering'
  severity: 'low' | 'medium' | 'high'
}

interface CodeExecutionMetric {
  code: string
  executionTime: number
  memoryUsed: number
  timestamp: number
  success: boolean
  iterations?: number
}

interface UserInteraction {
  type: 'click' | 'search' | 'navigation' | 'code_execution' | 'scroll'
  target: string
  timestamp: number
  duration?: number
}

interface PerformanceReport {
  totalExecutions: number
  averageExecutionTime: number
  memoryPeakUsage: number
  userInteractions: number
  sessionDuration: number
  performanceScore: number
}

export default function PerformanceMonitor() {
  const [isOpen, setIsOpen] = useState(false)
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [executionHistory, setExecutionHistory] = useState<CodeExecutionMetric[]>([])
  const [interactions, setInteractions] = useState<UserInteraction[]>([])
  const [isRecording, setIsRecording] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'execution' | 'memory' | 'interactions' | 'reports'>('overview')
  
  const sessionStartTime = useRef(Date.now())
  const performanceObserver = useRef<PerformanceObserver | null>(null)
  const memoryInterval = useRef<NodeJS.Timeout | null>(null)

  // Initialize performance monitoring
  useEffect(() => {
    if (!isRecording) return

    // Monitor performance entries
    if ('PerformanceObserver' in window) {
      performanceObserver.current = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          addMetric({
            id: `perf_${Date.now()}_${Math.random()}`,
            name: entry.name || 'Unknown',
            value: entry.duration || entry.responseEnd - entry.responseStart,
            unit: 'ms',
            timestamp: Date.now(),
            category: entry.entryType === 'navigation' ? 'network' : 'rendering',
            severity: (entry.duration || 0) > 100 ? 'high' : (entry.duration || 0) > 50 ? 'medium' : 'low'
          })
        })
      })
      
      try {
        performanceObserver.current.observe({ entryTypes: ['measure', 'navigation', 'paint'] })
      } catch {
        console.warn('PerformanceObserver not fully supported')
      }
    }

    // Monitor memory usage
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as { memory: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory
        addMetric({
          id: `memory_${Date.now()}`,
          name: 'JavaScript Heap Size',
          value: memory.usedJSHeapSize / 1024 / 1024,
          unit: 'MB',
          timestamp: Date.now(),
          category: 'memory',
          severity: memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.8 ? 'high' : 
                   memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.5 ? 'medium' : 'low'
        })
      }
    }

    monitorMemory()
    memoryInterval.current = setInterval(monitorMemory, 5000)

    // Monitor user interactions
    const trackInteraction = (event: Event) => {
      const target = (event.target as HTMLElement)
      const interaction: UserInteraction = {
        type: event.type === 'click' ? 'click' : 'scroll',
        target: target.tagName + (target.id ? `#${target.id}` : '') + (target.className ? `.${target.className.split(' ')[0]}` : ''),
        timestamp: Date.now()
      }
      
      setInteractions(prev => [...prev.slice(-99), interaction])
    }

    document.addEventListener('click', trackInteraction)
    document.addEventListener('scroll', trackInteraction, { passive: true })

    return () => {
      performanceObserver.current?.disconnect()
      if (memoryInterval.current) clearInterval(memoryInterval.current)
      document.removeEventListener('click', trackInteraction)
      document.removeEventListener('scroll', trackInteraction)
    }
  }, [isRecording])

  const addMetric = useCallback((metric: PerformanceMetric) => {
    setMetrics(prev => [...prev.slice(-99), metric])
  }, [])

  const trackCodeExecution = useCallback((code: string, executionTime: number, success: boolean, memoryUsed?: number) => {
    const execution: CodeExecutionMetric = {
      code: code.slice(0, 100) + (code.length > 100 ? '...' : ''),
      executionTime,
      memoryUsed: memoryUsed || 0,
      timestamp: Date.now(),
      success
    }
    
    setExecutionHistory(prev => [...prev.slice(-49), execution])
    
    addMetric({
      id: `exec_${Date.now()}`,
      name: 'Code Execution',
      value: executionTime,
      unit: 'ms',
      timestamp: Date.now(),
      category: 'execution',
      severity: executionTime > 1000 ? 'high' : executionTime > 100 ? 'medium' : 'low'
    })
  }, [addMetric])

  const trackUserSearch = useCallback((query: string, resultsCount: number, duration: number) => {
    const interaction: UserInteraction = {
      type: 'search',
      target: `query: "${query}" (${resultsCount} results)`,
      timestamp: Date.now(),
      duration
    }
    
    setInteractions(prev => [...prev.slice(-99), interaction])
    
    addMetric({
      id: `search_${Date.now()}`,
      name: 'Search Operation',
      value: duration,
      unit: 'ms',
      timestamp: Date.now(),
      category: 'interaction',
      severity: duration > 500 ? 'high' : duration > 200 ? 'medium' : 'low'
    })
  }, [addMetric])

  const generateReport = useCallback((): PerformanceReport => {
    const now = Date.now()
    const sessionDuration = now - sessionStartTime.current
    
    const executionMetrics = metrics.filter(m => m.category === 'execution')
    const averageExecutionTime = executionMetrics.length > 0 
      ? executionMetrics.reduce((sum, m) => sum + m.value, 0) / executionMetrics.length 
      : 0
    
    const memoryMetrics = metrics.filter(m => m.category === 'memory')
    const memoryPeakUsage = memoryMetrics.length > 0 
      ? Math.max(...memoryMetrics.map(m => m.value)) 
      : 0
    
    const highSeverityCount = metrics.filter(m => m.severity === 'high').length
    const totalMetrics = metrics.length
    const performanceScore = Math.max(0, 100 - (highSeverityCount / Math.max(totalMetrics, 1)) * 100)
    
    return {
      totalExecutions: executionHistory.length,
      averageExecutionTime,
      memoryPeakUsage,
      userInteractions: interactions.length,
      sessionDuration,
      performanceScore: Math.round(performanceScore)
    }
  }, [metrics, executionHistory, interactions])

  const exportData = useCallback(() => {
    const report = generateReport()
    const data = {
      report,
      metrics: metrics.slice(-50),
      executionHistory: executionHistory.slice(-25),
      interactions: interactions.slice(-50),
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `performance-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [metrics, executionHistory, interactions, generateReport])

  const clearData = useCallback(() => {
    setMetrics([])
    setExecutionHistory([])
    setInteractions([])
    sessionStartTime.current = Date.now()
  }, [])

  const getMetricsByCategory = (category: string) => {
    return metrics.filter(m => m.category === category)
  }

  const getAverageMetric = (category: string) => {
    const categoryMetrics = getMetricsByCategory(category)
    return categoryMetrics.length > 0 
      ? categoryMetrics.reduce((sum, m) => sum + m.value, 0) / categoryMetrics.length
      : 0
  }

  const report = generateReport()

  // Expose tracking functions globally for other components
  useEffect(() => {
    (window as { performanceMonitor: { trackCodeExecution: () => void; trackUserSearch: () => void; addMetric: () => void } }).performanceMonitor = {
      trackCodeExecution,
      trackUserSearch,
      addMetric
    }
  }, [trackCodeExecution, trackUserSearch, addMetric])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-colors z-40"
        title="Open Performance Monitor"
      >
        <Activity className="h-5 w-5" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Performance Monitor
          </h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                isRecording 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300'
              }`}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            <button
              onClick={exportData}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 rounded-md transition-colors"
            >
              <Download className="h-4 w-4 inline mr-1" />
              Export
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          {[
            { id: 'overview', label: 'Overview', icon: Monitor },
            { id: 'execution', label: 'Execution', icon: Zap },
            { id: 'memory', label: 'Memory', icon: MemoryStick },
            { id: 'interactions', label: 'Interactions', icon: Eye },
            { id: 'reports', label: 'Reports', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'execution' | 'memory' | 'interactions' | 'reports')}
              className={`px-4 py-3 text-sm font-medium flex items-center space-x-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white dark:bg-gray-800 dark:text-blue-400'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Performance Score</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{report.performanceScore}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 dark:text-green-400">Executions</p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">{report.totalExecutions}</p>
                    </div>
                    <Zap className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 dark:text-purple-400">Avg Execution</p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{Math.round(report.averageExecutionTime)}ms</p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600 dark:text-orange-400">Memory Peak</p>
                      <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{Math.round(report.memoryPeakUsage)}MB</p>
                    </div>
                    <MemoryStick className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </div>

              {/* Recent Metrics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Recent Performance Metrics</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {metrics.slice(-10).reverse().map((metric) => (
                    <div key={metric.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          metric.severity === 'high' ? 'bg-red-500' :
                          metric.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{metric.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{metric.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          {typeof metric.value === 'number' ? metric.value.toFixed(2) : metric.value} {metric.unit}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(metric.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'execution' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Code Execution History</h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Average: {Math.round(getAverageMetric('execution'))}ms
                </div>
              </div>
              
              <div className="space-y-3">
                {executionHistory.slice(-15).reverse().map((execution, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <code className="text-sm bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                          {execution.code}
                        </code>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(execution.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          execution.success 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {execution.success ? 'Success' : 'Error'}
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">
                          {execution.executionTime.toFixed(2)}ms
                        </p>
                        {execution.memoryUsed > 0 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {execution.memoryUsed.toFixed(2)}MB
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'memory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Memory Usage</h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Peak: {Math.round(report.memoryPeakUsage)}MB
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getMetricsByCategory('memory').slice(-10).map((metric) => (
                  <div key={metric.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{metric.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(metric.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {metric.value.toFixed(2)} {metric.unit}
                        </p>
                        <div className={`w-3 h-3 rounded-full ml-auto ${
                          metric.severity === 'high' ? 'bg-red-500' :
                          metric.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'interactions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">User Interactions</h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total: {interactions.length}
                </div>
              </div>
              
              <div className="space-y-2">
                {interactions.slice(-20).reverse().map((interaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        interaction.type === 'click' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                        interaction.type === 'search' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                        interaction.type === 'navigation' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                      }`}>
                        {interaction.type}
                      </div>
                      <div>
                        <p className="text-sm text-gray-900 dark:text-gray-100">{interaction.target}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(interaction.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    {interaction.duration && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {interaction.duration}ms
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Performance Report</h3>
                <button
                  onClick={clearData}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  Clear All Data
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Session Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Session Duration:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {Math.round(report.sessionDuration / 60000)}min
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Executions:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{report.totalExecutions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">User Interactions:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{report.userInteractions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Performance Score:</span>
                      <span className={`font-bold ${
                        report.performanceScore >= 80 ? 'text-green-600 dark:text-green-400' :
                        report.performanceScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {report.performanceScore}/100
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Performance Breakdown</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Avg Execution Time:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {Math.round(report.averageExecutionTime)}ms
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Memory Peak:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {Math.round(report.memoryPeakUsage)}MB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">High Severity Issues:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {metrics.filter(m => m.severity === 'high').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Metrics:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{metrics.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}