'use client'

import { useState, useMemo } from 'react'
import { GitCompare, X, Plus, ArrowRight, Info, Code, Zap, CheckCircle, XCircle } from 'lucide-react'
import { getAllObjects, getObjectCategory } from '../constants/objects'

interface ComparisonObject {
  name: string
  category: string
  features: string[]
  methods: string[]
  properties: string[]
  useCase: string
  performance: 'fast' | 'medium' | 'slow'
  browserSupport: string
}

const objectData: Record<string, Partial<ComparisonObject>> = {
  'Array': {
    features: ['Ordered collection', 'Dynamic size', 'Index-based access', 'Iterable'],
    methods: ['push()', 'pop()', 'map()', 'filter()', 'reduce()', 'forEach()', 'find()', 'sort()'],
    properties: ['length', 'constructor', 'prototype'],
    useCase: 'Best for ordered lists and sequential data',
    performance: 'fast',
    browserSupport: 'All browsers'
  },
  'Set': {
    features: ['Unique values only', 'No duplicates', 'Insertion order', 'Iterable'],
    methods: ['add()', 'delete()', 'has()', 'clear()', 'forEach()', 'values()', 'keys()'],
    properties: ['size', 'constructor', 'prototype'],
    useCase: 'Best for unique collections and removing duplicates',
    performance: 'fast',
    browserSupport: 'ES6+'
  },
  'Map': {
    features: ['Key-value pairs', 'Any type as key', 'Insertion order', 'Iterable'],
    methods: ['set()', 'get()', 'has()', 'delete()', 'clear()', 'forEach()', 'keys()', 'values()'],
    properties: ['size', 'constructor', 'prototype'],
    useCase: 'Best for key-value associations with any key type',
    performance: 'fast',
    browserSupport: 'ES6+'
  },
  'Object': {
    features: ['Key-value pairs', 'String/Symbol keys', 'Prototype chain', 'Dynamic properties'],
    methods: ['hasOwnProperty()', 'toString()', 'valueOf()', 'propertyIsEnumerable()'],
    properties: ['constructor', 'prototype', '__proto__'],
    useCase: 'Best for structured data and configurations',
    performance: 'fast',
    browserSupport: 'All browsers'
  },
  'WeakMap': {
    features: ['Object keys only', 'Weak references', 'Not iterable', 'Garbage collection friendly'],
    methods: ['set()', 'get()', 'has()', 'delete()'],
    properties: ['constructor', 'prototype'],
    useCase: 'Best for private data and memory-sensitive apps',
    performance: 'medium',
    browserSupport: 'ES6+'
  },
  'WeakSet': {
    features: ['Object values only', 'Weak references', 'Not iterable', 'Garbage collection friendly'],
    methods: ['add()', 'has()', 'delete()'],
    properties: ['constructor', 'prototype'],
    useCase: 'Best for tracking object references without memory leaks',
    performance: 'medium',
    browserSupport: 'ES6+'
  },
  'Promise': {
    features: ['Asynchronous operations', 'Chaining', 'Error handling', 'Single resolution'],
    methods: ['then()', 'catch()', 'finally()', 'all()', 'race()', 'resolve()', 'reject()'],
    properties: ['constructor', 'prototype'],
    useCase: 'Best for handling asynchronous operations',
    performance: 'fast',
    browserSupport: 'ES6+'
  },
  'AsyncFunction': {
    features: ['Async/await syntax', 'Returns Promise', 'Sequential async', 'Error handling'],
    methods: ['call()', 'apply()', 'bind()', 'toString()'],
    properties: ['length', 'name', 'constructor', 'prototype'],
    useCase: 'Best for readable asynchronous code',
    performance: 'fast',
    browserSupport: 'ES2017+'
  }
}

export default function ObjectComparison() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedObjects, setSelectedObjects] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const allObjects = useMemo(() => getAllObjects(), [])
  
  const filteredObjects = useMemo(() => {
    return allObjects.filter(obj => 
      obj.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedObjects.includes(obj) &&
      objectData[obj] // Only show objects we have data for
    )
  }, [allObjects, searchTerm, selectedObjects])

  const addObject = (objectName: string) => {
    if (selectedObjects.length < 4) {
      setSelectedObjects([...selectedObjects, objectName])
      setSearchTerm('')
    }
  }

  const removeObject = (objectName: string) => {
    setSelectedObjects(selectedObjects.filter(obj => obj !== objectName))
  }

  const getComparisonData = (objectName: string): ComparisonObject => {
    const data = objectData[objectName] || {}
    const category = getObjectCategory(objectName)
    
    return {
      name: objectName,
      category: category?.name || 'Other',
      features: data.features || [],
      methods: data.methods || [],
      properties: data.properties || [],
      useCase: data.useCase || 'General purpose',
      performance: data.performance || 'medium',
      browserSupport: data.browserSupport || 'Varies'
    }
  }

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'fast': return 'text-green-600 dark:text-green-400'
      case 'medium': return 'text-yellow-600 dark:text-yellow-400'
      case 'slow': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case 'fast': return <Zap className="h-4 w-4" />
      case 'medium': return <Info className="h-4 w-4" />
      case 'slow': return <Info className="h-4 w-4" />
      default: return null
    }
  }

  const compareFeature = (objects: ComparisonObject[], feature: string) => {
    return objects.map(obj => ({
      name: obj.name,
      hasFeature: obj.features.includes(feature) || 
                  obj.methods.includes(feature) || 
                  obj.properties.includes(feature)
    }))
  }

  const comparisonObjects = selectedObjects.map(getComparisonData)
  
  // Get all unique features across selected objects
  const allFeatures = useMemo(() => {
    const features = new Set<string>()
    comparisonObjects.forEach(obj => {
      obj.features.forEach(f => features.add(f))
    })
    return Array.from(features)
  }, [comparisonObjects])

  const allMethods = useMemo(() => {
    const methods = new Set<string>()
    comparisonObjects.forEach(obj => {
      obj.methods.forEach(m => methods.add(m))
    })
    return Array.from(methods)
  }, [comparisonObjects])

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
      >
        <GitCompare className="h-4 w-4" />
        <span>Compare Objects</span>
      </button>

      {/* Comparison Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                    <GitCompare className="h-6 w-6 mr-2" />
                    Object Comparison Tool
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Compare up to 4 JavaScript objects side by side
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Object Selection */}
              {selectedObjects.length < 4 && (
                <div className="mt-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search and add objects to compare..."
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    {searchTerm && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                        {filteredObjects.slice(0, 10).map(obj => (
                          <button
                            key={obj}
                            onClick={() => addObject(obj)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
                          >
                            {obj}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Selected Objects */}
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedObjects.map(obj => (
                  <div
                    key={obj}
                    className="flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg"
                  >
                    <span>{obj}</span>
                    <button
                      onClick={() => removeObject(obj)}
                      className="hover:text-blue-900 dark:hover:text-blue-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {selectedObjects.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    No objects selected. Search and add objects above.
                  </p>
                )}
              </div>
            </div>

            {/* Comparison Table */}
            {selectedObjects.length > 0 && (
              <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Aspect
                      </th>
                      {comparisonObjects.map(obj => (
                        <th key={obj.name} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {obj.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {/* Category */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        Category
                      </td>
                      {comparisonObjects.map(obj => (
                        <td key={obj.name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {obj.category}
                        </td>
                      ))}
                    </tr>

                    {/* Use Case */}
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                        Best Use Case
                      </td>
                      {comparisonObjects.map(obj => (
                        <td key={obj.name} className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {obj.useCase}
                        </td>
                      ))}
                    </tr>

                    {/* Performance */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        Performance
                      </td>
                      {comparisonObjects.map(obj => (
                        <td key={obj.name} className={`px-6 py-4 whitespace-nowrap text-sm ${getPerformanceColor(obj.performance)}`}>
                          <div className="flex items-center space-x-1">
                            {getPerformanceIcon(obj.performance)}
                            <span className="capitalize">{obj.performance}</span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Browser Support */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        Browser Support
                      </td>
                      {comparisonObjects.map(obj => (
                        <td key={obj.name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {obj.browserSupport}
                        </td>
                      ))}
                    </tr>

                    {/* Features */}
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100 align-top">
                        Key Features
                      </td>
                      {comparisonObjects.map(obj => (
                        <td key={obj.name} className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          <ul className="space-y-1">
                            {obj.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start">
                                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                <span className="text-xs">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>

                    {/* Methods */}
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100 align-top">
                        Common Methods
                      </td>
                      {comparisonObjects.map(obj => (
                        <td key={obj.name} className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex flex-wrap gap-1">
                            {obj.methods.slice(0, 6).map((method, idx) => (
                              <code key={idx} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                {method}
                              </code>
                            ))}
                            {obj.methods.length > 6 && (
                              <span className="text-xs text-gray-500">+{obj.methods.length - 6} more</span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Feature Comparison Matrix */}
            {selectedObjects.length > 1 && (
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Feature Comparison Matrix
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allFeatures.slice(0, 8).map(feature => {
                    const comparison = compareFeature(comparisonObjects, feature)
                    const allHave = comparison.every(c => c.hasFeature)
                    const noneHave = comparison.every(c => !c.hasFeature)
                    
                    return (
                      <div
                        key={feature}
                        className={`p-3 rounded-lg border ${
                          allHave 
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                            : noneHave
                            ? 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-700'
                            : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {feature}
                          </span>
                          <div className="flex items-center space-x-2">
                            {comparison.map(c => (
                              <div
                                key={c.name}
                                className="flex items-center"
                                title={c.name}
                              >
                                {c.hasFeature ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-gray-400" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}