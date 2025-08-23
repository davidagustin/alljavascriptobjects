'use client'

import { useState } from 'react'
import { Filter, ChevronDown } from 'lucide-react'

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void
  selectedCategory: string
}

const categories = [
  { id: 'all', name: 'All Objects', count: 51 },
  { id: 'core', name: 'Core Objects', count: 8 },
  { id: 'modern', name: 'Modern Objects', count: 8 },
  { id: 'error', name: 'Error Objects', count: 8 },
  { id: 'function', name: 'Function Objects', count: 6 },
  { id: 'typed', name: 'Typed Arrays', count: 12 },
  { id: 'global', name: 'Global Functions', count: 9 }
]

const objectCategories: { [key: string]: string } = {
  // Core Objects
  'object': 'core', 'array': 'core', 'string': 'core', 'number': 'core',
  'boolean': 'core', 'date': 'core', 'math': 'core', 'json': 'core',
  
  // Modern Objects
  'promise': 'modern', 'map': 'modern', 'set': 'modern', 'regexp': 'modern',
  'symbol': 'modern', 'proxy': 'modern', 'weakmap': 'modern', 'weakset': 'modern',
  
  // Error Objects
  'error': 'error', 'typeerror': 'error', 'referenceerror': 'error', 'syntaxerror': 'error',
  'rangeerror': 'error', 'urierror': 'error', 'evalerror': 'error', 'aggregateerror': 'error',
  
  // Function Objects
  'function': 'function', 'generator': 'function', 'generatorfunction': 'function',
  'asyncfunction': 'function', 'asyncgenerator': 'function', 'asyncgeneratorfunction': 'function',
  
  // Typed Arrays
  'arraybuffer': 'typed', 'dataview': 'typed', 'int8array': 'typed', 'uint8array': 'typed',
  'uint8clampedarray': 'typed', 'int16array': 'typed', 'uint16array': 'typed',
  'int32array': 'typed', 'uint32array': 'typed', 'float32array': 'typed',
  'float64array': 'typed', 'bigint64array': 'typed', 'biguint64array': 'typed',
  
  // Global Functions
  'parseint': 'global', 'parsefloat': 'global', 'isnan': 'global', 'isfinite': 'global',
  'encodeuri': 'global', 'decodeuri': 'global', 'encodeuricomponent': 'global',
  'decodeuricomponent': 'global', 'escape': 'global', 'unescape': 'global'
}

export default function CategoryFilter({ onCategoryChange, selectedCategory }: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return 51
    return Object.values(objectCategories).filter(cat => cat === categoryId).length
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span>
            {categories.find(cat => cat.id === selectedCategory)?.name || 'All Objects'}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                onCategoryChange(category.id)
                setIsOpen(false)
              }}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                selectedCategory === category.id ? 'bg-blue-50 text-blue-700' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{category.name}</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {getCategoryCount(category.id)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
