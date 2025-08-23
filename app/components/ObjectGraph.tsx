'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Network, Zap, Filter, Search, RotateCw, ZoomIn, ZoomOut } from 'lucide-react'
import { OBJECT_CATEGORIES, getAllObjects, getObjectsByDifficulty } from '../constants/objects'
import { useApp } from '../contexts/AppContext'
import { usePerformanceTracking } from '../utils/performance'

interface Node {
  id: string
  label: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  visited: boolean
  favorited: boolean
  x: number
  y: number
  connections: string[]
}

interface Edge {
  from: string
  to: string
  type: 'category' | 'similarity' | 'inheritance'
  strength: number
}

export default function ObjectGraph() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [zoom, setZoom] = useState(1)
  const [showConnections, setShowConnections] = useState(true)
  const [layoutMode, setLayoutMode] = useState<'circular' | 'force' | 'hierarchy'>('circular')

  const { favorites, visitedObjects } = useApp()
  const { trackInteraction } = usePerformanceTracking()

  // Generate nodes from objects
  const nodes = useMemo((): Node[] => {
    const allObjects = getAllObjects()
    const centerX = 300
    const centerY = 300
    
    return allObjects.map((objectName, index) => {
      const category = Object.entries(OBJECT_CATEGORIES).find(([_, cat]) => 
        cat.objects.includes(objectName)
      )?.[0] || 'Unknown'
      
      const categoryData = OBJECT_CATEGORIES[category]
      
      let x = centerX
      let y = centerY
      
      if (layoutMode === 'circular') {
        const angle = (index / allObjects.length) * 2 * Math.PI
        const radius = 150 + (index % 3) * 50
        x = centerX + Math.cos(angle) * radius
        y = centerY + Math.sin(angle) * radius
      } else if (layoutMode === 'hierarchy') {
        const categoryIndex = Object.keys(OBJECT_CATEGORIES).indexOf(category)
        x = 100 + (categoryIndex % 4) * 150
        y = 100 + Math.floor(categoryIndex / 4) * 120 + (index % 5) * 20
      }

      return {
        id: objectName,
        label: objectName,
        category,
        difficulty: categoryData?.difficulty || 'beginner',
        visited: visitedObjects.includes(objectName),
        favorited: favorites.includes(objectName),
        x,
        y,
        connections: getRelatedObjects(objectName)
      }
    })
  }, [visitedObjects, favorites, layoutMode])

  // Generate edges between related nodes
  const edges = useMemo((): Edge[] => {
    const edgeList: Edge[] = []
    
    nodes.forEach(node => {
      // Category connections
      const categoryNodes = nodes.filter(n => n.category === node.category && n.id !== node.id)
      categoryNodes.forEach(relatedNode => {
        edgeList.push({
          from: node.id,
          to: relatedNode.id,
          type: 'category',
          strength: 0.5
        })
      })
      
      // Explicit connections based on relationships
      node.connections.forEach(connectedId => {
        if (nodes.find(n => n.id === connectedId)) {
          edgeList.push({
            from: node.id,
            to: connectedId,
            type: 'similarity',
            strength: 0.8
          })
        }
      })
    })
    
    return edgeList
  }, [nodes])

  // Get related objects for a given object
  const getRelatedObjects = useCallback((objectName: string): string[] => {
    const relatedMap: Record<string, string[]> = {
      'Array': ['Object', 'Map', 'Set'],
      'Object': ['Array', 'Map', 'JSON'],
      'Promise': ['AsyncFunction', 'Generator'],
      'Map': ['Object', 'Set', 'WeakMap'],
      'Set': ['Array', 'Map', 'WeakSet'],
      'String': ['RegExp', 'Array'],
      'Number': ['Math', 'BigInt'],
      'Function': ['AsyncFunction', 'Generator', 'Proxy'],
      'Date': ['Intl', 'Number'],
      'RegExp': ['String', 'Array'],
      'Error': ['AggregateError', 'Promise'],
      'JSON': ['Object', 'String', 'Number']
    }
    return relatedMap[objectName] || []
  }, [])

  // Filter nodes based on current filters
  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      const matchesCategory = filterCategory === 'all' || node.category === filterCategory
      const matchesDifficulty = filterDifficulty === 'all' || node.difficulty === filterDifficulty
      const matchesSearch = searchTerm === '' || node.label.toLowerCase().includes(searchTerm.toLowerCase())
      
      return matchesCategory && matchesDifficulty && matchesSearch
    })
  }, [nodes, filterCategory, filterDifficulty, searchTerm])

  // Filter edges to only show connections between visible nodes
  const filteredEdges = useMemo(() => {
    const visibleNodeIds = new Set(filteredNodes.map(n => n.id))
    return edges.filter(edge => 
      visibleNodeIds.has(edge.from) && visibleNodeIds.has(edge.to)
    )
  }, [edges, filteredNodes])

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNode(nodeId === selectedNode ? null : nodeId)
    trackInteraction('graph_node_select', nodeId)
  }, [selectedNode, trackInteraction])

  const getNodeColor = useCallback((node: Node) => {
    if (node.favorited) return '#F59E0B'
    if (node.visited) return '#10B981'
    
    switch (node.difficulty) {
      case 'beginner': return '#3B82F6'
      case 'intermediate': return '#8B5CF6'
      case 'advanced': return '#EF4444'
      default: return '#6B7280'
    }
  }, [])

  const getNodeSize = useCallback((node: Node) => {
    let size = 8
    if (node.favorited) size += 4
    if (node.visited) size += 2
    if (node.id === selectedNode) size += 6
    return size
  }, [selectedNode])

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Network className="h-5 w-5 mr-2 text-blue-500" />
            Object Relationships
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))}
              className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
              className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={() => setLayoutMode(prev => 
                prev === 'circular' ? 'force' : prev === 'force' ? 'hierarchy' : 'circular'
              )}
              className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Change Layout"
            >
              <RotateCw className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search objects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
          >
            <option value="all">All Categories</option>
            {Object.keys(OBJECT_CATEGORIES).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          {/* Toggle Connections */}
          <button
            onClick={() => setShowConnections(!showConnections)}
            className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              showConnections
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            <Zap className="h-4 w-4" />
            <span>Connections</span>
          </button>
        </div>
      </div>

      {/* Graph */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="relative w-full h-[600px]">
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 600 600`}
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
            className="transition-transform duration-200"
          >
            {/* Edges */}
            {showConnections && filteredEdges.map((edge, index) => {
              const fromNode = filteredNodes.find(n => n.id === edge.from)
              const toNode = filteredNodes.find(n => n.id === edge.to)
              
              if (!fromNode || !toNode) return null
              
              return (
                <line
                  key={`${edge.from}-${edge.to}-${index}`}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={edge.type === 'category' ? '#D1D5DB' : '#9CA3AF'}
                  strokeWidth={edge.strength * 2}
                  strokeOpacity={0.6}
                  className="transition-all duration-300"
                />
              )
            })}

            {/* Nodes */}
            {filteredNodes.map((node) => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={getNodeSize(node)}
                  fill={getNodeColor(node)}
                  stroke={node.id === selectedNode ? '#1F2937' : 'transparent'}
                  strokeWidth={node.id === selectedNode ? 3 : 1}
                  className="cursor-pointer transition-all duration-300 hover:stroke-gray-800 hover:stroke-2"
                  onClick={() => handleNodeClick(node.id)}
                />
                <text
                  x={node.x}
                  y={node.y + getNodeSize(node) + 12}
                  textAnchor="middle"
                  fontSize="10"
                  fill="currentColor"
                  className="text-gray-700 dark:text-gray-300 pointer-events-none"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>

          {/* Node Info Panel */}
          {selectedNode && (
            <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-64">
              {(() => {
                const node = filteredNodes.find(n => n.id === selectedNode)
                if (!node) return null
                
                return (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {node.label}
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Category:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {node.category}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Difficulty:</span>
                        <span className={`font-medium capitalize ${
                          node.difficulty === 'beginner' ? 'text-blue-600' :
                          node.difficulty === 'intermediate' ? 'text-purple-600' : 'text-red-600'
                        }`}>
                          {node.difficulty}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                        <div className="flex space-x-2">
                          {node.visited && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded text-xs">
                              Visited
                            </span>
                          )}
                          {node.favorited && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 rounded text-xs">
                              Favorite
                            </span>
                          )}
                        </div>
                      </div>
                      {node.connections.length > 0 && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400 block mb-1">Related:</span>
                          <div className="flex flex-wrap gap-1">
                            {node.connections.slice(0, 3).map(conn => (
                              <span 
                                key={conn}
                                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded text-xs cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                                onClick={() => handleNodeClick(conn)}
                              >
                                {conn}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Legend</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-gray-600 dark:text-gray-400">Beginner</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-gray-600 dark:text-gray-400">Intermediate</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-600 dark:text-gray-400">Advanced</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-600 dark:text-gray-400">Visited</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-gray-600 dark:text-gray-400">Favorite</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-0.5 bg-gray-300" />
            <span className="text-gray-600 dark:text-gray-400">Category Link</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-0.5 bg-gray-600" />
            <span className="text-gray-600 dark:text-gray-400">Related Link</span>
          </div>
        </div>
      </div>
    </div>
  )
}