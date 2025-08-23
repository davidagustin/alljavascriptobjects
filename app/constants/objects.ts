export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

export interface JavaScriptObject {
  name: string
  category: string
  difficulty: DifficultyLevel
  tags: string[]
  description: string
  hasExamples: boolean
  mdnUrl: string
  exampleCount: number
  deprecated?: boolean
  since?: string
  browser?: {
    chrome: string
    firefox: string
    safari: string
    edge: string
  }
}

export interface ObjectCategory {
  name: string
  description: string
  objects: string[]
  icon: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export const OBJECT_CATEGORIES: Record<string, ObjectCategory> = {
  'Fundamental': {
    name: 'Fundamental',
    description: 'Core JavaScript objects and concepts',
    icon: '🔧',
    difficulty: 'beginner',
    objects: ['Object', 'Function', 'Boolean', 'Symbol', 'undefined', 'globalThis']
  },
  'Numbers & Math': {
    name: 'Numbers & Math',
    description: 'Numeric data types and mathematical operations',
    icon: '🔢',
    difficulty: 'beginner',
    objects: ['Number', 'BigInt', 'Math', 'NaN', 'Infinity', 'isFinite()', 'isNaN()', 'parseFloat()', 'parseInt()']
  },
  'Text': {
    name: 'Text',
    description: 'String manipulation and text processing',
    icon: '📝',
    difficulty: 'beginner',
    objects: ['String', 'RegExp', 'encodeURI()', 'decodeURI()', 'encodeURIComponent()', 'decodeURIComponent()', 'escape()', 'unescape()']
  },
  'Collections': {
    name: 'Collections',
    description: 'Data structures and collection types',
    icon: '📦',
    difficulty: 'intermediate',
    objects: ['Array', 'Map', 'Set', 'WeakMap', 'WeakSet', 'WeakRef']
  },
  'Typed Arrays': {
    name: 'Typed Arrays',
    description: 'Binary data and typed array views',
    icon: '💾',
    difficulty: 'advanced',
    objects: [
      'ArrayBuffer', 'SharedArrayBuffer', 'DataView', 'TypedArray',
      'Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array',
      'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array',
      'Float64Array', 'BigInt64Array', 'BigUint64Array', 'Float16Array'
    ]
  },
  'Errors': {
    name: 'Errors',
    description: 'Error handling and exception types',
    icon: '⚠️',
    difficulty: 'intermediate',
    objects: [
      'Error', 'AggregateError', 'EvalError', 'RangeError', 'ReferenceError',
      'SyntaxError', 'TypeError', 'URIError', 'InternalError', 'SuppressedError'
    ]
  },
  'Control Flow': {
    name: 'Control Flow',
    description: 'Asynchronous programming and iteration',
    icon: '🔄',
    difficulty: 'advanced',
    objects: [
      'Promise', 'AsyncFunction', 'Generator', 'GeneratorFunction',
      'AsyncGenerator', 'AsyncGeneratorFunction', 'Iterator', 'AsyncIterator'
    ]
  },
  'Memory Management': {
    name: 'Memory Management',
    description: 'Resource management and cleanup',
    icon: '🧹',
    difficulty: 'advanced',
    objects: ['FinalizationRegistry', 'DisposableStack', 'AsyncDisposableStack']
  },
  'Meta Programming': {
    name: 'Meta Programming',
    description: 'Advanced object manipulation and reflection',
    icon: '🔮',
    difficulty: 'advanced',
    objects: ['Proxy', 'Reflect']
  },
  'Internationalization': {
    name: 'Internationalization',
    description: 'Date, time, and locale handling',
    icon: '🌍',
    difficulty: 'intermediate',
    objects: ['Intl', 'Date', 'Temporal']
  },
  'Data Processing': {
    name: 'Data Processing',
    description: 'Data serialization and atomic operations',
    icon: '⚡',
    difficulty: 'intermediate',
    objects: ['JSON', 'Atomics']
  },
  'Global Functions': {
    name: 'Global Functions',
    description: 'Built-in global functions and utilities',
    icon: '🌐',
    difficulty: 'beginner',
    objects: ['eval()']
  }
}

export const OBJECT_TAGS: Record<string, string[]> = {
  'Array': ['collection', 'iteration', 'functional', 'data-structure', 'es5'],
  'Object': ['fundamental', 'oop', 'properties', 'methods', 'es5'],
  'Promise': ['async', 'concurrent', 'es6', 'callback', 'modern'],
  'String': ['text', 'manipulation', 'regex', 'encoding', 'es5'],
  'Number': ['math', 'arithmetic', 'validation', 'parsing', 'es5'],
  'Date': ['time', 'calendar', 'formatting', 'timezone', 'es5'],
  'RegExp': ['pattern', 'matching', 'validation', 'parsing', 'es5'],
  'Map': ['collection', 'key-value', 'iteration', 'es6', 'modern'],
  'Set': ['collection', 'unique', 'iteration', 'es6', 'modern'],
  'JSON': ['serialization', 'data', 'api', 'storage', 'es5'],
  'Math': ['calculations', 'constants', 'trigonometry', 'random', 'es5'],
  'Error': ['debugging', 'exception', 'handling', 'validation', 'es5'],
  'Proxy': ['meta', 'interception', 'dynamic', 'advanced', 'es6'],
  'Symbol': ['unique', 'identifier', 'meta', 'es6', 'modern'],
  'BigInt': ['large-numbers', 'precision', 'arithmetic', 'es2020', 'modern'],
  'WeakMap': ['memory', 'garbage-collection', 'private', 'performance', 'es6'],
  'WeakSet': ['memory', 'garbage-collection', 'unique', 'performance', 'es6'],
  'ArrayBuffer': ['binary', 'memory', 'buffer', 'performance', 'es6'],
  'TypedArray': ['binary', 'numeric', 'buffer', 'performance', 'es6'],
  'Int8Array': ['binary', 'integers', 'signed', '8-bit', 'es6'],
  'Uint8Array': ['binary', 'integers', 'unsigned', '8-bit', 'es6'],
  'Float32Array': ['binary', 'floating-point', '32-bit', 'precision', 'es6'],
  'Generator': ['iterator', 'lazy', 'yield', 'es6', 'modern'],
  'AsyncGenerator': ['async', 'iterator', 'yield', 'streaming', 'es2018'],
  'Iterator': ['iteration', 'protocol', 'lazy', 'streaming', 'es6'],
  'AsyncIterator': ['async', 'iteration', 'streaming', 'protocol', 'es2018'],
  'Function': ['fundamental', 'callable', 'execution', 'scope', 'es5'],
  'Boolean': ['logical', 'true-false', 'conditional', 'primitive', 'es5'],
  'Intl': ['internationalization', 'localization', 'formatting', 'es6'],
  'Temporal': ['modern-date', 'time-zones', 'precision', 'proposal', 'future'],
  'Reflect': ['meta-programming', 'introspection', 'es6', 'proxy'],
  'Atomics': ['shared-memory', 'threading', 'concurrency', 'es2017'],
  'FinalizationRegistry': ['memory', 'cleanup', 'es2021', 'advanced'],
  'WeakRef': ['weak-reference', 'memory', 'gc', 'es2021', 'advanced'],
  'AggregateError': ['multiple-errors', 'es2021', 'modern', 'error-handling']
}

export const JAVASCRIPT_OBJECTS: JavaScriptObject[] = [
  {
    name: 'Array',
    category: 'Collections',
    difficulty: 'beginner',
    tags: OBJECT_TAGS['Array'] || [],
    description: 'A collection of elements with indexed access and powerful methods for data manipulation',
    hasExamples: true,
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
    exampleCount: 12,
    since: 'ES5',
    browser: { chrome: '1', firefox: '1', safari: '1', edge: '12' }
  },
  {
    name: 'Object',
    category: 'Fundamental',
    difficulty: 'beginner',
    tags: OBJECT_TAGS['Object'] || [],
    description: 'The fundamental building block for all JavaScript objects and data structures',
    hasExamples: true,
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object',
    exampleCount: 15,
    since: 'ES5',
    browser: { chrome: '1', firefox: '1', safari: '1', edge: '12' }
  },
  {
    name: 'Promise',
    category: 'Control Flow',
    difficulty: 'intermediate',
    tags: OBJECT_TAGS['Promise'] || [],
    description: 'Asynchronous operation handling with chainable then/catch methods',
    hasExamples: true,
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
    exampleCount: 10,
    since: 'ES6',
    browser: { chrome: '32', firefox: '29', safari: '8', edge: '12' }
  },
  {
    name: 'String',
    category: 'Text',
    difficulty: 'beginner',
    tags: OBJECT_TAGS['String'] || [],
    description: 'Text data manipulation with comprehensive string processing methods',
    hasExamples: true,
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String',
    exampleCount: 14,
    since: 'ES5',
    browser: { chrome: '1', firefox: '1', safari: '1', edge: '12' }
  },
  {
    name: 'Number',
    category: 'Numbers & Math',
    difficulty: 'beginner',
    tags: OBJECT_TAGS['Number'] || [],
    description: 'Numeric values and mathematical operations with precision handling',
    hasExamples: true,
    mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number',
    exampleCount: 8,
    since: 'ES5',
    browser: { chrome: '1', firefox: '1', safari: '1', edge: '12' }
  },
  // Add more objects as needed...
]

// Helper functions
export function getAllObjects(): string[] {
  return Object.values(OBJECT_CATEGORIES).flatMap(category => category.objects)
}

export function getObjectCategory(objectName: string): ObjectCategory | null {
  for (const category of Object.values(OBJECT_CATEGORIES)) {
    if (category.objects.includes(objectName)) {
      return category
    }
  }
  return null
}

export function getObjectsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): string[] {
  return Object.values(OBJECT_CATEGORIES)
    .filter(category => category.difficulty === difficulty)
    .flatMap(category => category.objects)
}

export function searchObjectsInCategory(categoryName: string, searchTerm: string): string[] {
  const category = OBJECT_CATEGORIES[categoryName]
  if (!category) return []
  
  return category.objects.filter(obj => 
    obj.toLowerCase().includes(searchTerm.toLowerCase())
  )
}

export function getTotalObjectsCount(): number {
  return getAllObjects().length
}

export function getObjectTags(objectName: string): string[] {
  return OBJECT_TAGS[objectName] || []
}

export function getCategoryByObject(objectName: string): string {
  for (const [categoryName, category] of Object.entries(OBJECT_CATEGORIES)) {
    if (category.objects.includes(objectName)) {
      return categoryName
    }
  }
  return 'Unknown'
}

export function getRelatedObjects(objectName: string, limit: number = 5): string[] {
  const category = getCategoryByObject(objectName)
  const categoryObj = OBJECT_CATEGORIES[category]
  if (!categoryObj) return []
  
  return categoryObj.objects
    .filter(obj => obj !== objectName)
    .slice(0, limit)
}