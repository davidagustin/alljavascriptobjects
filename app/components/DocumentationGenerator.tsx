'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { FileText, Download, Code, BookOpen, Layers, Settings, Eye, Copy, Check, Loader } from 'lucide-react'

interface DocumentationConfig {
  format: 'markdown' | 'html' | 'json' | 'pdf'
  includeExamples: boolean
  includeUseCases: boolean
  includeBrowserSupport: boolean
  includeComplexity: boolean
  includeRelatedObjects: boolean
  categories: string[]
  outputStyle: 'comprehensive' | 'concise' | 'reference'
  customTemplate: string
}

interface ObjectMetadata {
  name: string
  category: string
  description: string
  overview: string
  syntax: string
  useCases: string[]
  browserSupport: string
  complexity: 'Beginner' | 'Intermediate' | 'Advanced'
  relatedObjects: string[]
  examples: Array<{
    title: string
    code: string
    explanation: string
  }>
}

interface GeneratedDoc {
  content: string
  format: string
  filename: string
  size: number
  timestamp: number
}

export default function DocumentationGenerator() {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<DocumentationConfig>({
    format: 'markdown',
    includeExamples: true,
    includeUseCases: true,
    includeBrowserSupport: true,
    includeComplexity: false,
    includeRelatedObjects: false,
    categories: [],
    outputStyle: 'comprehensive',
    customTemplate: ''
  })
  const [selectedObjects, setSelectedObjects] = useState<string[]>([])
  const [generatedDocs, setGeneratedDocs] = useState<GeneratedDoc[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewContent, setPreviewContent] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'config' | 'objects' | 'template' | 'preview' | 'output'>('config')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // Mock data for JavaScript objects
  const objectsData: ObjectMetadata[] = useMemo(() => [
    {
      name: 'Array',
      category: 'Collections',
      description: 'Arrays are list-like objects for storing multiple values in a single variable',
      overview: 'The Array object is a global object used to construct arrays. Arrays are high-level, list-like objects that can store multiple values of different types.',
      syntax: 'const arr = [1, 2, 3];\nconst arr2 = new Array(1, 2, 3);',
      useCases: ['Data storage', 'List manipulation', 'Iteration', 'Data transformation'],
      browserSupport: 'Supported in all browsers',
      complexity: 'Beginner',
      relatedObjects: ['Set', 'Map', 'TypedArray'],
      examples: [
        {
          title: 'Basic Array Operations',
          code: 'const fruits = ["apple", "banana"];\nfruits.push("orange");\nconsole.log(fruits.length);',
          explanation: 'Creates an array and adds elements to it'
        }
      ]
    },
    {
      name: 'Promise',
      category: 'Control Flow',
      description: 'Promises represent the eventual completion or failure of an asynchronous operation',
      overview: 'A Promise is a proxy for a value not necessarily known when the promise is created. It allows you to associate handlers with an asynchronous action\'s eventual success value or failure reason.',
      syntax: 'const promise = new Promise((resolve, reject) => {\n  // async operation\n});',
      useCases: ['Async operations', 'HTTP requests', 'File operations', 'Database queries'],
      browserSupport: 'ES6+, IE not supported',
      complexity: 'Intermediate',
      relatedObjects: ['async/await', 'fetch', 'AsyncFunction'],
      examples: [
        {
          title: 'Basic Promise Usage',
          code: 'const fetchData = () => new Promise((resolve) => {\n  setTimeout(() => resolve("data"), 1000);\n});\n\nfetchData().then(console.log);',
          explanation: 'Creates and uses a simple promise with setTimeout'
        }
      ]
    },
    {
      name: 'Map',
      category: 'Collections',
      description: 'Map objects hold key-value pairs and remember insertion order',
      overview: 'The Map object holds key-value pairs and remembers the original insertion order of the keys. Any value (both objects and primitive values) may be used as either a key or a value.',
      syntax: 'const map = new Map();\nconst map2 = new Map([[key1, value1], [key2, value2]]);',
      useCases: ['Key-value storage', 'Caching', 'Object relationships', 'Data indexing'],
      browserSupport: 'ES6+, not in IE8 and below',
      complexity: 'Intermediate',
      relatedObjects: ['Set', 'WeakMap', 'Object'],
      examples: [
        {
          title: 'Map Operations',
          code: 'const userRoles = new Map();\nuserRoles.set("john", "admin");\nuserRoles.set("jane", "user");\nconsole.log(userRoles.get("john"));',
          explanation: 'Creates a map to store user roles and retrieves values'
        }
      ]
    }
  ], [])

  const categories = useMemo(() => {
    const cats = Array.from(new Set(objectsData.map(obj => obj.category)))
    return cats.sort()
  }, [objectsData])

  const filteredObjects = useMemo(() => {
    return objectsData.filter(obj => 
      config.categories.length === 0 || config.categories.includes(obj.category)
    )
  }, [objectsData, config.categories])

  const generateMarkdown = useCallback((objects: ObjectMetadata[]): string => {
    let markdown = `# JavaScript Objects Documentation\n\n`
    markdown += `Generated on: ${new Date().toLocaleDateString()}\n\n`
    markdown += `Total Objects: ${objects.length}\n\n`

    // Table of Contents
    markdown += `## Table of Contents\n\n`
    objects.forEach((obj, index) => {
      markdown += `${index + 1}. [${obj.name}](#${obj.name.toLowerCase()})\n`
    })
    markdown += `\n---\n\n`

    objects.forEach((obj) => {
      markdown += `## ${obj.name}\n\n`
      markdown += `**Category:** ${obj.category}\n\n`
      markdown += `**Description:** ${obj.description}\n\n`
      
      if (config.includeComplexity) {
        markdown += `**Complexity:** ${obj.complexity}\n\n`
      }

      markdown += `### Overview\n\n${obj.overview}\n\n`

      markdown += `### Syntax\n\n\`\`\`javascript\n${obj.syntax}\n\`\`\`\n\n`

      if (config.includeUseCases && obj.useCases.length > 0) {
        markdown += `### Use Cases\n\n`
        obj.useCases.forEach(useCase => {
          markdown += `- ${useCase}\n`
        })
        markdown += `\n`
      }

      if (config.includeExamples && obj.examples.length > 0) {
        markdown += `### Examples\n\n`
        obj.examples.forEach((example, index) => {
          markdown += `#### ${example.title}\n\n`
          markdown += `\`\`\`javascript\n${example.code}\n\`\`\`\n\n`
          markdown += `${example.explanation}\n\n`
        })
      }

      if (config.includeBrowserSupport) {
        markdown += `### Browser Support\n\n${obj.browserSupport}\n\n`
      }

      if (config.includeRelatedObjects && obj.relatedObjects.length > 0) {
        markdown += `### Related Objects\n\n`
        obj.relatedObjects.forEach(related => {
          markdown += `- ${related}\n`
        })
        markdown += `\n`
      }

      markdown += `---\n\n`
    })

    return markdown
  }, [config])

  const generateHTML = useCallback((objects: ObjectMetadata[]): string => {
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JavaScript Objects Documentation</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 0; padding: 2rem; max-width: 1200px; margin: 0 auto; }
        h1, h2, h3 { color: #2563eb; }
        h1 { border-bottom: 3px solid #2563eb; padding-bottom: 0.5rem; }
        h2 { border-bottom: 2px solid #e5e7eb; padding-bottom: 0.25rem; margin-top: 3rem; }
        h3 { color: #1f2937; margin-top: 2rem; }
        .meta { background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; }
        .category { background: #dbeafe; color: #1e40af; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; display: inline-block; }
        .complexity { background: #fee2e2; color: #991b1b; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; display: inline-block; }
        pre { background: #1f2937; color: #f9fafb; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; }
        code { background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-family: 'Monaco', 'Menlo', monospace; }
        pre code { background: none; padding: 0; }
        ul { padding-left: 1.5rem; }
        li { margin: 0.5rem 0; }
        .toc { background: #f9fafb; border: 1px solid #e5e7eb; padding: 1.5rem; border-radius: 0.5rem; margin: 2rem 0; }
        .toc a { text-decoration: none; color: #2563eb; }
        .toc a:hover { text-decoration: underline; }
        .example { background: #fefce8; border-left: 4px solid #facc15; padding: 1rem; margin: 1rem 0; }
        hr { border: none; height: 2px; background: linear-gradient(90deg, #2563eb, transparent); margin: 3rem 0; }
    </style>
</head>
<body>`

    html += `
    <h1>JavaScript Objects Documentation</h1>
    <div class="meta">
        <strong>Generated on:</strong> ${new Date().toLocaleDateString()}<br>
        <strong>Total Objects:</strong> ${objects.length}<br>
        <strong>Format:</strong> HTML Documentation
    </div>`

    // Table of Contents
    html += `<div class="toc"><h2>Table of Contents</h2><ul>`
    objects.forEach((obj, index) => {
      html += `<li><a href="#${obj.name.toLowerCase()}">${index + 1}. ${obj.name}</a></li>`
    })
    html += `</ul></div>`

    objects.forEach((obj) => {
      html += `<h2 id="${obj.name.toLowerCase()}">${obj.name}</h2>`
      html += `<div class="meta">`
      html += `<span class="category">${obj.category}</span>`
      if (config.includeComplexity) {
        html += ` <span class="complexity">${obj.complexity}</span>`
      }
      html += `<br><br><strong>Description:</strong> ${obj.description}`
      html += `</div>`

      html += `<h3>Overview</h3><p>${obj.overview}</p>`

      html += `<h3>Syntax</h3><pre><code>${obj.syntax}</code></pre>`

      if (config.includeUseCases && obj.useCases.length > 0) {
        html += `<h3>Use Cases</h3><ul>`
        obj.useCases.forEach(useCase => {
          html += `<li>${useCase}</li>`
        })
        html += `</ul>`
      }

      if (config.includeExamples && obj.examples.length > 0) {
        html += `<h3>Examples</h3>`
        obj.examples.forEach((example) => {
          html += `<div class="example">`
          html += `<h4>${example.title}</h4>`
          html += `<pre><code>${example.code}</code></pre>`
          html += `<p>${example.explanation}</p>`
          html += `</div>`
        })
      }

      if (config.includeBrowserSupport) {
        html += `<h3>Browser Support</h3><p>${obj.browserSupport}</p>`
      }

      if (config.includeRelatedObjects && obj.relatedObjects.length > 0) {
        html += `<h3>Related Objects</h3><ul>`
        obj.relatedObjects.forEach(related => {
          html += `<li>${related}</li>`
        })
        html += `</ul>`
      }

      html += `<hr>`
    })

    html += `</body></html>`
    return html
  }, [config])

  const generateJSON = useCallback((objects: ObjectMetadata[]): string => {
    const jsonDoc = {
      metadata: {
        generatedOn: new Date().toISOString(),
        totalObjects: objects.length,
        format: 'JSON',
        configuration: config
      },
      objects: objects.map(obj => ({
        name: obj.name,
        category: obj.category,
        description: obj.description,
        overview: config.outputStyle === 'concise' ? obj.description : obj.overview,
        syntax: obj.syntax,
        ...(config.includeUseCases && { useCases: obj.useCases }),
        ...(config.includeExamples && { examples: obj.examples }),
        ...(config.includeBrowserSupport && { browserSupport: obj.browserSupport }),
        ...(config.includeComplexity && { complexity: obj.complexity }),
        ...(config.includeRelatedObjects && { relatedObjects: obj.relatedObjects })
      }))
    }
    return JSON.stringify(jsonDoc, null, 2)
  }, [config])

  const generateDocumentation = useCallback(async () => {
    setIsGenerating(true)
    
    // Simulate generation time
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const objectsToDocument = selectedObjects.length > 0 
      ? objectsData.filter(obj => selectedObjects.includes(obj.name))
      : filteredObjects

    let content = ''
    let filename = ''
    
    switch (config.format) {
      case 'markdown':
        content = generateMarkdown(objectsToDocument)
        filename = `js-objects-doc-${Date.now()}.md`
        break
      case 'html':
        content = generateHTML(objectsToDocument)
        filename = `js-objects-doc-${Date.now()}.html`
        break
      case 'json':
        content = generateJSON(objectsToDocument)
        filename = `js-objects-doc-${Date.now()}.json`
        break
      default:
        content = generateMarkdown(objectsToDocument)
        filename = `js-objects-doc-${Date.now()}.md`
    }

    const doc: GeneratedDoc = {
      content,
      format: config.format,
      filename,
      size: new Blob([content]).size,
      timestamp: Date.now()
    }

    setGeneratedDocs(prev => [doc, ...prev.slice(0, 9)])
    setPreviewContent(content)
    setActiveTab('output')
    setIsGenerating(false)
  }, [config, selectedObjects, objectsData, filteredObjects, generateMarkdown, generateHTML, generateJSON])

  const downloadDoc = useCallback((doc: GeneratedDoc) => {
    const blob = new Blob([doc.content], { 
      type: doc.format === 'html' ? 'text/html' : 
           doc.format === 'json' ? 'application/json' : 'text/markdown' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = doc.filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  const copyToClipboard = useCallback(async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [])

  const toggleObjectSelection = useCallback((objectName: string) => {
    setSelectedObjects(prev => 
      prev.includes(objectName) 
        ? prev.filter(name => name !== objectName)
        : [...prev, objectName]
    )
  }, [])

  const selectAllObjects = useCallback(() => {
    setSelectedObjects(filteredObjects.map(obj => obj.name))
  }, [filteredObjects])

  const clearSelection = useCallback(() => {
    setSelectedObjects([])
  }, [])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors z-40"
        title="Open Documentation Generator"
      >
        <FileText className="h-5 w-5" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Documentation Generator
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          {[
            { id: 'config', label: 'Configuration', icon: Settings },
            { id: 'objects', label: 'Objects', icon: Layers },
            { id: 'template', label: 'Template', icon: Code },
            { id: 'preview', label: 'Preview', icon: Eye },
            { id: 'output', label: 'Generated Docs', icon: BookOpen }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-sm font-medium flex items-center space-x-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-white dark:bg-gray-800 dark:text-purple-400'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {activeTab === 'config' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Format Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Output Format
                  </label>
                  <select
                    value={config.format}
                    onChange={(e) => setConfig(prev => ({ ...prev, format: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="markdown">Markdown (.md)</option>
                    <option value="html">HTML (.html)</option>
                    <option value="json">JSON (.json)</option>
                    <option value="pdf">PDF (.pdf) - Coming Soon</option>
                  </select>
                </div>

                {/* Output Style */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Output Style
                  </label>
                  <select
                    value={config.outputStyle}
                    onChange={(e) => setConfig(prev => ({ ...prev, outputStyle: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="comprehensive">Comprehensive</option>
                    <option value="concise">Concise</option>
                    <option value="reference">Reference Only</option>
                  </select>
                </div>
              </div>

              {/* Include Options */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Include in Documentation</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'includeExamples', label: 'Code Examples' },
                    { key: 'includeUseCases', label: 'Use Cases' },
                    { key: 'includeBrowserSupport', label: 'Browser Support' },
                    { key: 'includeComplexity', label: 'Complexity Level' },
                    { key: 'includeRelatedObjects', label: 'Related Objects' }
                  ].map(option => (
                    <label key={option.key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={config[option.key as keyof DocumentationConfig] as boolean}
                        onChange={(e) => setConfig(prev => ({ ...prev, [option.key]: e.target.checked }))}
                        className="rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Filter by Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={config.categories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setConfig(prev => ({ ...prev, categories: [...prev.categories, category] }))
                          } else {
                            setConfig(prev => ({ ...prev, categories: prev.categories.filter(c => c !== category) }))
                          }
                        }}
                        className="rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex justify-end">
                <button
                  onClick={generateDocumentation}
                  disabled={isGenerating}
                  className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isGenerating ? <Loader className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                  <span>{isGenerating ? 'Generating...' : 'Generate Documentation'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'objects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Select Objects ({selectedObjects.length} selected)
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={selectAllObjects}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 rounded-md"
                  >
                    Select All
                  </button>
                  <button
                    onClick={clearSelection}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-md"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredObjects.map(obj => (
                  <div
                    key={obj.name}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedObjects.includes(obj.name)
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                    onClick={() => toggleObjectSelection(obj.name)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{obj.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{obj.category}</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{obj.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            obj.complexity === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                            obj.complexity === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                            'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                            {obj.complexity}
                          </span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedObjects.includes(obj.name)}
                        onChange={() => toggleObjectSelection(obj.name)}
                        className="ml-3 rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'template' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Custom Template</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Define a custom template for documentation generation. Use placeholders like {`{{name}}`}, {`{{description}}`}, etc.
                </p>
                <textarea
                  value={config.customTemplate}
                  onChange={(e) => setConfig(prev => ({ ...prev, customTemplate: e.target.value }))}
                  placeholder={`# {{name}}

**Category:** {{category}}
**Description:** {{description}}

## Overview
{{overview}}

## Syntax
\`\`\`javascript
{{syntax}}
\`\`\`

{{#if includeUseCases}}
## Use Cases
{{#each useCases}}
- {{this}}
{{/each}}
{{/if}}`}
                  rows={15}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                />
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Available Placeholders:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <div>• {`{{name}}`} - Object name</div>
                  <div>• {`{{category}}`} - Object category</div>
                  <div>• {`{{description}}`} - Short description</div>
                  <div>• {`{{overview}}`} - Detailed overview</div>
                  <div>• {`{{syntax}}`} - Code syntax</div>
                  <div>• {`{{useCases}}`} - Array of use cases</div>
                  <div>• {`{{browserSupport}}`} - Browser support info</div>
                  <div>• {`{{complexity}}`} - Complexity level</div>
                  <div>• {`{{examples}}`} - Code examples</div>
                  <div>• {`{{relatedObjects}}`} - Related objects</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Preview</h3>
                <button
                  onClick={() => {
                    const objectsToPreview = selectedObjects.length > 0 
                      ? objectsData.filter(obj => selectedObjects.includes(obj.name)).slice(0, 1)
                      : filteredObjects.slice(0, 1)
                    const preview = generateMarkdown(objectsToPreview)
                    setPreviewContent(preview)
                  }}
                  className="px-3 py-1 text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-400 rounded-md"
                >
                  Generate Preview
                </button>
              </div>
              
              {previewContent ? (
                <div className="border border-gray-200 dark:border-gray-600 rounded-md">
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview (first object)</span>
                  </div>
                  <pre className="p-4 overflow-x-auto text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                    {previewContent.slice(0, 2000)}{previewContent.length > 2000 ? '\n...\n[Content truncated for preview]' : ''}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Click "Generate Preview" to see a sample of your documentation</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'output' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Generated Documentation</h3>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {generatedDocs.length} documents
                </span>
              </div>
              
              {generatedDocs.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No documentation generated yet</p>
                  <p className="text-sm">Configure settings and click "Generate Documentation"</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedDocs.map((doc, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">{doc.filename}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>Format: {doc.format.toUpperCase()}</span>
                            <span>Size: {(doc.size / 1024).toFixed(1)} KB</span>
                            <span>Generated: {new Date(doc.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => copyToClipboard(doc.content, index)}
                            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                            title="Copy to clipboard"
                          >
                            {copiedIndex === index ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => downloadDoc(doc)}
                            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                            title="Download file"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-900 max-h-64 overflow-y-auto">
                        <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                          {doc.content.slice(0, 1000)}{doc.content.length > 1000 ? '\n...\n[Content truncated - download or copy to see full content]' : ''}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}