'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { BarChart3, PieChart, LineChart, Scatter3, TreePine, Network, Activity, Eye, Settings, Download, Maximize2, RotateCcw } from 'lucide-react'

interface VisualizationData {
  id: string
  name: string
  value: number | string | object
  type: 'number' | 'string' | 'array' | 'object' | 'function' | 'boolean'
  depth?: number
  children?: VisualizationData[]
  metadata?: {
    size: number
    references: number
    complexity: number
    performance?: number
  }
}

interface ChartConfig {
  type: 'bar' | 'pie' | 'line' | 'scatter' | 'tree' | 'network' | 'memory' | 'performance'
  width: number
  height: number
  colors: string[]
  showLabels: boolean
  showLegend: boolean
  animate: boolean
  theme: 'light' | 'dark'
}

export default function AdvancedVisualization() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedVisualization, setSelectedVisualization] = useState<string>('data-structure')
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    type: 'tree',
    width: 800,
    height: 600,
    colors: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'],
    showLabels: true,
    showLegend: true,
    animate: true,
    theme: 'light'
  })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [animationFrame, setAnimationFrame] = useState<number>(0)

  // Sample data structures for visualization
  const sampleData = useMemo(() => ({
    'data-structure': {
      id: 'root',
      name: 'JavaScript Object',
      type: 'object' as const,
      value: {
        name: 'User',
        age: 30,
        hobbies: ['reading', 'coding', 'gaming'],
        address: {
          street: '123 Main St',
          city: 'New York',
          country: 'USA'
        },
        active: true
      },
      children: [
        {
          id: 'name',
          name: 'name',
          type: 'string' as const,
          value: 'User',
          metadata: { size: 4, references: 1, complexity: 1 }
        },
        {
          id: 'age',
          name: 'age',
          type: 'number' as const,
          value: 30,
          metadata: { size: 8, references: 1, complexity: 1 }
        },
        {
          id: 'hobbies',
          name: 'hobbies',
          type: 'array' as const,
          value: ['reading', 'coding', 'gaming'],
          metadata: { size: 48, references: 3, complexity: 2 },
          children: [
            { id: 'h1', name: '[0]', type: 'string' as const, value: 'reading', metadata: { size: 7, references: 1, complexity: 1 } },
            { id: 'h2', name: '[1]', type: 'string' as const, value: 'coding', metadata: { size: 6, references: 1, complexity: 1 } },
            { id: 'h3', name: '[2]', type: 'string' as const, value: 'gaming', metadata: { size: 6, references: 1, complexity: 1 } }
          ]
        },
        {
          id: 'address',
          name: 'address',
          type: 'object' as const,
          value: { street: '123 Main St', city: 'New York', country: 'USA' },
          metadata: { size: 72, references: 3, complexity: 2 },
          children: [
            { id: 'street', name: 'street', type: 'string' as const, value: '123 Main St', metadata: { size: 11, references: 1, complexity: 1 } },
            { id: 'city', name: 'city', type: 'string' as const, value: 'New York', metadata: { size: 8, references: 1, complexity: 1 } },
            { id: 'country', name: 'country', type: 'string' as const, value: 'USA', metadata: { size: 3, references: 1, complexity: 1 } }
          ]
        },
        {
          id: 'active',
          name: 'active',
          type: 'boolean' as const,
          value: true,
          metadata: { size: 1, references: 1, complexity: 1 }
        }
      ],
      metadata: { size: 150, references: 8, complexity: 3 }
    },
    'performance': [
      { name: 'Array.forEach', value: 0.5, type: 'performance' },
      { name: 'Array.map', value: 0.7, type: 'performance' },
      { name: 'Array.filter', value: 0.6, type: 'performance' },
      { name: 'Array.reduce', value: 0.8, type: 'performance' },
      { name: 'for loop', value: 0.3, type: 'performance' },
      { name: 'for...of', value: 0.4, type: 'performance' },
      { name: 'while loop', value: 0.2, type: 'performance' }
    ],
    'memory-usage': [
      { name: 'Strings', value: 25, type: 'memory' },
      { name: 'Numbers', value: 15, type: 'memory' },
      { name: 'Objects', value: 35, type: 'memory' },
      { name: 'Arrays', value: 20, type: 'memory' },
      { name: 'Functions', value: 5, type: 'memory' }
    ],
    'complexity': [
      { name: 'O(1)', value: 12, operations: ['Array access', 'Object property', 'Variable assignment'] },
      { name: 'O(log n)', value: 8, operations: ['Binary search', 'Tree traversal', 'Balanced BST'] },
      { name: 'O(n)', value: 25, operations: ['Linear search', 'Array iteration', 'Single loop'] },
      { name: 'O(n log n)', value: 15, operations: ['Merge sort', 'Quick sort', 'Heap sort'] },
      { name: 'O(n²)', value: 6, operations: ['Nested loops', 'Bubble sort', 'Selection sort'] },
      { name: 'O(2^n)', value: 2, operations: ['Fibonacci recursive', 'Power set', 'Tower of Hanoi'] }
    ]
  }), [])

  // Animation loop
  useEffect(() => {
    if (!chartConfig.animate) return

    const animate = () => {
      setAnimationFrame(prev => prev + 1)
      requestAnimationFrame(animate)
    }
    
    const frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [chartConfig.animate])

  // Draw tree visualization
  const drawTreeVisualization = useCallback((data: VisualizationData) => {
    const svg = svgRef.current
    if (!svg) return

    const width = chartConfig.width
    const height = chartConfig.height
    const nodeRadius = 20
    const levelHeight = 80

    // Clear previous content
    svg.innerHTML = ''

    // Calculate positions for tree layout
    const calculatePositions = (node: VisualizationData, x: number, y: number, level: number): any => {
      const children = node.children || []
      const childWidth = width / Math.max(children.length, 1)
      
      return {
        ...node,
        x,
        y,
        level,
        children: children.map((child, index) => 
          calculatePositions(child, (index + 0.5) * childWidth, y + levelHeight, level + 1)
        )
      }
    }

    const positionedData = calculatePositions(data, width / 2, 50, 0)

    // Draw connections
    const drawConnections = (node: any) => {
      if (!node.children) return

      node.children.forEach((child: any) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.setAttribute('x1', node.x.toString())
        line.setAttribute('y1', (node.y + nodeRadius).toString())
        line.setAttribute('x2', child.x.toString())
        line.setAttribute('y2', (child.y - nodeRadius).toString())
        line.setAttribute('stroke', chartConfig.theme === 'dark' ? '#64748b' : '#94a3b8')
        line.setAttribute('stroke-width', '2')
        
        if (chartConfig.animate) {
          line.style.opacity = '0'
          line.style.transition = `opacity 0.5s ease-in-out ${node.level * 0.2}s`
          setTimeout(() => {
            line.style.opacity = '1'
          }, 100)
        }
        
        svg.appendChild(line)
        drawConnections(child)
      })
    }

    // Draw nodes
    const drawNodes = (node: any) => {
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      
      // Node circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      circle.setAttribute('cx', node.x.toString())
      circle.setAttribute('cy', node.y.toString())
      circle.setAttribute('r', nodeRadius.toString())
      
      const typeColors: Record<string, string> = {
        object: '#3b82f6',
        array: '#10b981',
        string: '#f59e0b',
        number: '#ef4444',
        boolean: '#8b5cf6',
        function: '#06b6d4'
      }
      
      circle.setAttribute('fill', typeColors[node.type] || '#6b7280')
      circle.setAttribute('stroke', chartConfig.theme === 'dark' ? '#374151' : '#d1d5db')
      circle.setAttribute('stroke-width', '2')
      
      if (chartConfig.animate) {
        circle.style.transform = 'scale(0)'
        circle.style.transformOrigin = `${node.x}px ${node.y}px`
        circle.style.transition = `transform 0.3s ease-out ${node.level * 0.1}s`
        setTimeout(() => {
          circle.style.transform = 'scale(1)'
        }, 100)
      }
      
      group.appendChild(circle)

      // Node label
      if (chartConfig.showLabels) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        text.setAttribute('x', node.x.toString())
        text.setAttribute('y', (node.y - nodeRadius - 10).toString())
        text.setAttribute('text-anchor', 'middle')
        text.setAttribute('fill', chartConfig.theme === 'dark' ? '#f3f4f6' : '#374151')
        text.setAttribute('font-size', '12')
        text.setAttribute('font-weight', 'bold')
        text.textContent = node.name
        group.appendChild(text)

        // Value label
        const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        valueText.setAttribute('x', node.x.toString())
        valueText.setAttribute('y', (node.y + 5).toString())
        valueText.setAttribute('text-anchor', 'middle')
        valueText.setAttribute('fill', 'white')
        valueText.setAttribute('font-size', '10')
        const displayValue = typeof node.value === 'object' 
          ? `{${Object.keys(node.value).length}}`
          : String(node.value).slice(0, 8)
        valueText.textContent = displayValue
        group.appendChild(valueText)
      }

      svg.appendChild(group)

      // Recursively draw children
      if (node.children) {
        node.children.forEach((child: any) => drawNodes(child))
      }
    }

    drawConnections(positionedData)
    drawNodes(positionedData)
  }, [chartConfig])

  // Draw bar chart
  const drawBarChart = useCallback((data: any[]) => {
    const svg = svgRef.current
    if (!svg) return

    const width = chartConfig.width
    const height = chartConfig.height
    const margin = { top: 20, right: 20, bottom: 40, left: 60 }
    const chartWidth = width - margin.left - margin.right
    const chartHeight = height - margin.top - margin.bottom

    svg.innerHTML = ''

    const maxValue = Math.max(...data.map(d => d.value))
    const barWidth = chartWidth / data.length
    
    data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * chartHeight
      const x = margin.left + index * barWidth
      const y = height - margin.bottom - barHeight

      // Bar
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      rect.setAttribute('x', (x + barWidth * 0.1).toString())
      rect.setAttribute('y', y.toString())
      rect.setAttribute('width', (barWidth * 0.8).toString())
      rect.setAttribute('height', barHeight.toString())
      rect.setAttribute('fill', chartConfig.colors[index % chartConfig.colors.length])
      rect.setAttribute('rx', '4')
      
      if (chartConfig.animate) {
        rect.style.height = '0'
        rect.style.y = (height - margin.bottom).toString()
        rect.style.transition = `height 0.5s ease-out ${index * 0.1}s, y 0.5s ease-out ${index * 0.1}s`
        setTimeout(() => {
          rect.style.height = barHeight.toString()
          rect.style.y = y.toString()
        }, 100)
      }
      
      svg.appendChild(rect)

      // Label
      if (chartConfig.showLabels) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        text.setAttribute('x', (x + barWidth / 2).toString())
        text.setAttribute('y', (height - margin.bottom + 20).toString())
        text.setAttribute('text-anchor', 'middle')
        text.setAttribute('fill', chartConfig.theme === 'dark' ? '#f3f4f6' : '#374151')
        text.setAttribute('font-size', '12')
        text.textContent = item.name
        svg.appendChild(text)

        // Value label
        const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        valueText.setAttribute('x', (x + barWidth / 2).toString())
        valueText.setAttribute('y', (y - 5).toString())
        valueText.setAttribute('text-anchor', 'middle')
        valueText.setAttribute('fill', chartConfig.theme === 'dark' ? '#f3f4f6' : '#374151')
        valueText.setAttribute('font-size', '10')
        valueText.textContent = item.value.toString()
        svg.appendChild(valueText)
      }
    })
  }, [chartConfig])

  // Draw pie chart
  const drawPieChart = useCallback((data: any[]) => {
    const svg = svgRef.current
    if (!svg) return

    const width = chartConfig.width
    const height = chartConfig.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 40

    svg.innerHTML = ''

    const total = data.reduce((sum, item) => sum + item.value, 0)
    let currentAngle = -Math.PI / 2

    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI
      const endAngle = currentAngle + sliceAngle

      // Create path for pie slice
      const largeArcFlag = sliceAngle > Math.PI ? 1 : 0
      const x1 = centerX + radius * Math.cos(currentAngle)
      const y1 = centerY + radius * Math.sin(currentAngle)
      const x2 = centerX + radius * Math.cos(endAngle)
      const y2 = centerY + radius * Math.sin(endAngle)

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ')

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', pathData)
      path.setAttribute('fill', chartConfig.colors[index % chartConfig.colors.length])
      path.setAttribute('stroke', chartConfig.theme === 'dark' ? '#374151' : '#fff')
      path.setAttribute('stroke-width', '2')

      if (chartConfig.animate) {
        path.style.opacity = '0'
        path.style.transform = 'scale(0)'
        path.style.transformOrigin = `${centerX}px ${centerY}px`
        path.style.transition = `opacity 0.3s ease-out ${index * 0.1}s, transform 0.5s ease-out ${index * 0.1}s`
        setTimeout(() => {
          path.style.opacity = '1'
          path.style.transform = 'scale(1)'
        }, 100)
      }

      svg.appendChild(path)

      // Label
      if (chartConfig.showLabels) {
        const labelAngle = currentAngle + sliceAngle / 2
        const labelRadius = radius * 0.7
        const labelX = centerX + labelRadius * Math.cos(labelAngle)
        const labelY = centerY + labelRadius * Math.sin(labelAngle)

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        text.setAttribute('x', labelX.toString())
        text.setAttribute('y', labelY.toString())
        text.setAttribute('text-anchor', 'middle')
        text.setAttribute('fill', 'white')
        text.setAttribute('font-size', '12')
        text.setAttribute('font-weight', 'bold')
        text.textContent = `${item.name} (${item.value})`
        svg.appendChild(text)
      }

      currentAngle = endAngle
    })
  }, [chartConfig])

  // Draw network visualization
  const drawNetworkVisualization = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = chartConfig.width
    canvas.height = chartConfig.height

    // Clear canvas
    ctx.fillStyle = chartConfig.theme === 'dark' ? '#111827' : '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Mock network nodes
    const nodes = [
      { id: 'user', x: canvas.width * 0.5, y: canvas.height * 0.3, radius: 15, type: 'object' },
      { id: 'profile', x: canvas.width * 0.3, y: canvas.height * 0.5, radius: 12, type: 'object' },
      { id: 'settings', x: canvas.width * 0.7, y: canvas.height * 0.5, radius: 10, type: 'object' },
      { id: 'posts', x: canvas.width * 0.2, y: canvas.height * 0.7, radius: 14, type: 'array' },
      { id: 'friends', x: canvas.width * 0.8, y: canvas.height * 0.7, radius: 13, type: 'array' },
      { id: 'name', x: canvas.width * 0.1, y: canvas.height * 0.4, radius: 8, type: 'string' },
      { id: 'email', x: canvas.width * 0.9, y: canvas.height * 0.4, radius: 8, type: 'string' }
    ]

    const connections = [
      { from: 'user', to: 'profile' },
      { from: 'user', to: 'settings' },
      { from: 'profile', to: 'posts' },
      { from: 'profile', to: 'name' },
      { from: 'settings', to: 'friends' },
      { from: 'settings', to: 'email' }
    ]

    // Draw connections
    ctx.strokeStyle = chartConfig.theme === 'dark' ? '#64748b' : '#94a3b8'
    ctx.lineWidth = 2
    connections.forEach(conn => {
      const fromNode = nodes.find(n => n.id === conn.from)
      const toNode = nodes.find(n => n.id === conn.to)
      if (fromNode && toNode) {
        ctx.beginPath()
        ctx.moveTo(fromNode.x, fromNode.y)
        ctx.lineTo(toNode.x, toNode.y)
        ctx.stroke()
      }
    })

    // Draw nodes
    const typeColors: Record<string, string> = {
      object: '#3b82f6',
      array: '#10b981',
      string: '#f59e0b',
      number: '#ef4444',
      boolean: '#8b5cf6'
    }

    nodes.forEach((node, index) => {
      const animatedRadius = chartConfig.animate 
        ? node.radius * (0.8 + 0.2 * Math.sin(animationFrame * 0.05 + index))
        : node.radius

      // Node circle
      ctx.fillStyle = typeColors[node.type] || '#6b7280'
      ctx.beginPath()
      ctx.arc(node.x, node.y, animatedRadius, 0, 2 * Math.PI)
      ctx.fill()

      // Node border
      ctx.strokeStyle = chartConfig.theme === 'dark' ? '#374151' : '#d1d5db'
      ctx.lineWidth = 2
      ctx.stroke()

      // Node label
      if (chartConfig.showLabels) {
        ctx.fillStyle = chartConfig.theme === 'dark' ? '#f3f4f6' : '#374151'
        ctx.font = 'bold 12px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(node.id, node.x, node.y - animatedRadius - 10)
      }
    })
  }, [chartConfig, animationFrame])

  // Update visualization when data or config changes
  useEffect(() => {
    switch (chartConfig.type) {
      case 'tree':
        if (selectedVisualization === 'data-structure') {
          drawTreeVisualization(sampleData['data-structure'])
        }
        break
      case 'bar':
        if (sampleData[selectedVisualization as keyof typeof sampleData]) {
          const data = sampleData[selectedVisualization as keyof typeof sampleData]
          if (Array.isArray(data)) {
            drawBarChart(data)
          }
        }
        break
      case 'pie':
        if (sampleData[selectedVisualization as keyof typeof sampleData]) {
          const data = sampleData[selectedVisualization as keyof typeof sampleData]
          if (Array.isArray(data)) {
            drawPieChart(data)
          }
        }
        break
      case 'network':
        drawNetworkVisualization()
        break
    }
  }, [chartConfig, selectedVisualization, drawTreeVisualization, drawBarChart, drawPieChart, drawNetworkVisualization, sampleData])

  const exportVisualization = useCallback(() => {
    const svg = svgRef.current
    const canvas = canvasRef.current
    
    if (svg && svg.innerHTML) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const blob = new Blob([svgData], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `visualization-${Date.now()}.svg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else if (canvas) {
      canvas.toBlob(blob => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `visualization-${Date.now()}.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-3/4 right-4 bg-violet-600 hover:bg-violet-700 text-white p-3 rounded-full shadow-lg transition-colors z-40"
        title="Advanced Visualization"
      >
        <BarChart3 className="h-5 w-5" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Advanced Visualization
          </h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={exportVisualization}
              className="px-3 py-1 text-sm bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900/20 dark:text-violet-400 rounded-md transition-colors flex items-center"
            >
              <Download className="h-4 w-4 mr-1" />
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

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
            {/* Visualization Type */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Data Source</h3>
              <div className="space-y-2">
                {[
                  { id: 'data-structure', label: 'Object Structure', icon: TreePine },
                  { id: 'performance', label: 'Performance Metrics', icon: Activity },
                  { id: 'memory-usage', label: 'Memory Usage', icon: PieChart },
                  { id: 'complexity', label: 'Complexity Analysis', icon: BarChart3 }
                ].map(option => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedVisualization(option.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center ${
                      selectedVisualization === option.id
                        ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <option.icon className="h-4 w-4 mr-2" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Type */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Visualization Type</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'tree', label: 'Tree', icon: TreePine },
                  { id: 'bar', label: 'Bar', icon: BarChart3 },
                  { id: 'pie', label: 'Pie', icon: PieChart },
                  { id: 'network', label: 'Network', icon: Network }
                ].map(chart => (
                  <button
                    key={chart.id}
                    onClick={() => setChartConfig(prev => ({ ...prev, type: chart.id as any }))}
                    className={`p-2 rounded-md text-xs transition-colors flex flex-col items-center ${
                      chartConfig.type === chart.id
                        ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}
                  >
                    <chart.icon className="h-4 w-4 mb-1" />
                    {chart.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Configuration */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dimensions
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={chartConfig.width}
                      onChange={(e) => setChartConfig(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                      placeholder="Width"
                      min="400"
                      max="1200"
                      className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <input
                      type="number"
                      value={chartConfig.height}
                      onChange={(e) => setChartConfig(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                      placeholder="Height"
                      min="300"
                      max="800"
                      className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-xs">
                    <input
                      type="checkbox"
                      checked={chartConfig.showLabels}
                      onChange={(e) => setChartConfig(prev => ({ ...prev, showLabels: e.target.checked }))}
                      className="rounded border-gray-300 dark:border-gray-600 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Show Labels</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 text-xs">
                    <input
                      type="checkbox"
                      checked={chartConfig.showLegend}
                      onChange={(e) => setChartConfig(prev => ({ ...prev, showLegend: e.target.checked }))}
                      className="rounded border-gray-300 dark:border-gray-600 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Show Legend</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 text-xs">
                    <input
                      type="checkbox"
                      checked={chartConfig.animate}
                      onChange={(e) => setChartConfig(prev => ({ ...prev, animate: e.target.checked }))}
                      className="rounded border-gray-300 dark:border-gray-600 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Animate</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Theme
                  </label>
                  <select
                    value={chartConfig.theme}
                    onChange={(e) => setChartConfig(prev => ({ ...prev, theme: e.target.value as any }))}
                    className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color Palette
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {chartConfig.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Data Info */}
            {selectedVisualization && sampleData[selectedVisualization as keyof typeof sampleData] && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Data Information</h3>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  {selectedVisualization === 'data-structure' && (
                    <>
                      <p>• Object with nested properties</p>
                      <p>• Mixed data types (string, number, array, object, boolean)</p>
                      <p>• 3 levels of nesting</p>
                      <p>• Memory usage simulation</p>
                    </>
                  )}
                  {selectedVisualization === 'performance' && (
                    <>
                      <p>• JavaScript method performance comparison</p>
                      <p>• Execution time in milliseconds</p>
                      <p>• Loop vs array method benchmarks</p>
                    </>
                  )}
                  {selectedVisualization === 'memory-usage' && (
                    <>
                      <p>• Memory allocation by data type</p>
                      <p>• Percentage distribution</p>
                      <p>• Heap usage simulation</p>
                    </>
                  )}
                  {selectedVisualization === 'complexity' && (
                    <>
                      <p>• Big O complexity analysis</p>
                      <p>• Operation count distribution</p>
                      <p>• Algorithm performance tiers</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Main Visualization Area */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {selectedVisualization.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')} Visualization
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Interactive {chartConfig.type} chart with real-time data
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.location.reload()}
                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                  title="Refresh visualization"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600">
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Visualization Container */}
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
              {chartConfig.type === 'network' ? (
                <canvas
                  ref={canvasRef}
                  className="border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                />
              ) : (
                <svg
                  ref={svgRef}
                  width={chartConfig.width}
                  height={chartConfig.height}
                  className="border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                />
              )}
            </div>

            {/* Legend */}
            {chartConfig.showLegend && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Legend</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  {selectedVisualization === 'data-structure' && [
                    { color: '#3b82f6', label: 'Object', type: 'object' },
                    { color: '#10b981', label: 'Array', type: 'array' },
                    { color: '#f59e0b', label: 'String', type: 'string' },
                    { color: '#ef4444', label: 'Number', type: 'number' },
                    { color: '#8b5cf6', label: 'Boolean', type: 'boolean' },
                    { color: '#06b6d4', label: 'Function', type: 'function' }
                  ].map(item => (
                    <div key={item.type} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}