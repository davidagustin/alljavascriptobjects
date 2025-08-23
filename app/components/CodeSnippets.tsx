'use client'

import { useState, useEffect } from 'react'
import { Save, FolderOpen, Trash2, Plus, Code, Copy, Edit3 } from 'lucide-react'

interface CodeSnippet {
  id: string
  name: string
  code: string
  objectName: string
  createdAt: string
  updatedAt: string
}

interface CodeSnippetsProps {
  currentCode: string
  selectedObject: string
  onLoadSnippet: (code: string) => void
}

export default function CodeSnippets({ currentCode, selectedObject, onLoadSnippet }: CodeSnippetsProps) {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showSnippetsList, setShowSnippetsList] = useState(false)
  const [newSnippetName, setNewSnippetName] = useState('')
  const [editingSnippet, setEditingSnippet] = useState<CodeSnippet | null>(null)

  useEffect(() => {
    loadSnippets()
  }, [])

  const loadSnippets = () => {
    const saved = localStorage.getItem('code-snippets')
    if (saved) {
      try {
        setSnippets(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading snippets:', error)
      }
    }
  }

  const saveSnippets = (newSnippets: CodeSnippet[]) => {
    localStorage.setItem('code-snippets', JSON.stringify(newSnippets))
    setSnippets(newSnippets)
  }

  const saveCurrentCode = () => {
    if (!newSnippetName.trim()) return

    const newSnippet: CodeSnippet = {
      id: Date.now().toString(),
      name: newSnippetName.trim(),
      code: currentCode,
      objectName: selectedObject,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const updatedSnippets = [...snippets, newSnippet]
    saveSnippets(updatedSnippets)
    setNewSnippetName('')
    setShowSaveDialog(false)
  }

  const deleteSnippet = (id: string) => {
    const updatedSnippets = snippets.filter(s => s.id !== id)
    saveSnippets(updatedSnippets)
  }

  const updateSnippet = (id: string, updates: Partial<CodeSnippet>) => {
    const updatedSnippets = snippets.map(s => 
      s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
    )
    saveSnippets(updatedSnippets)
  }

  const copySnippet = (snippet: CodeSnippet) => {
    navigator.clipboard.writeText(snippet.code)
  }

  const filteredSnippets = snippets.filter(s => 
    s.objectName === selectedObject || selectedObject === 'Object'
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <Code className="h-5 w-5 mr-2" />
          Code Snippets
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSnippetsList(!showSnippetsList)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            title="View snippets"
          >
            <FolderOpen className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowSaveDialog(true)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            title="Save current code"
          >
            <Save className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Save Code Snippet
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Snippet Name
                </label>
                <input
                  type="text"
                  value={newSnippetName}
                  onChange={(e) => setNewSnippetName(e.target.value)}
                  placeholder="Enter snippet name..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  autoFocus
                />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={saveCurrentCode}
                  disabled={!newSnippetName.trim()}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowSaveDialog(false)
                    setNewSnippetName('')
                  }}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Snippets List */}
      {showSnippetsList && (
        <div className="space-y-3">
          {filteredSnippets.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Code className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm">No snippets saved yet</p>
              <p className="text-xs mt-1">Save your code examples for quick access</p>
            </div>
          ) : (
            filteredSnippets.map((snippet) => (
              <div
                key={snippet.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      {snippet.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {snippet.objectName} • {new Date(snippet.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onLoadSnippet(snippet.code)}
                      className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      title="Load snippet"
                    >
                      <FolderOpen className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => copySnippet(snippet)}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      title="Copy code"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => setEditingSnippet(snippet)}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      title="Edit snippet"
                    >
                      <Edit3 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => deleteSnippet(snippet.id)}
                      className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      title="Delete snippet"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-900 rounded p-2">
                  <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-hidden">
                    {snippet.code.length > 100 
                      ? `${snippet.code.substring(0, 100)}...` 
                      : snippet.code
                    }
                  </pre>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Edit Dialog */}
      {editingSnippet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Edit Snippet
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Snippet Name
                </label>
                <input
                  type="text"
                  value={editingSnippet.name}
                  onChange={(e) => setEditingSnippet({ ...editingSnippet, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Code
                </label>
                <textarea
                  value={editingSnippet.code}
                  onChange={(e) => setEditingSnippet({ ...editingSnippet, code: e.target.value })}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    updateSnippet(editingSnippet.id, editingSnippet)
                    setEditingSnippet(null)
                  }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditingSnippet(null)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
