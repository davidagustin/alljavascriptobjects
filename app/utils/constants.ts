// Performance and optimization constants
export const PERFORMANCE = {
  CODE_EXECUTION_TIMEOUT: 5000,
  SYNTAX_HIGHLIGHT_DELAY: 100,
  AUTO_SAVE_DELAY: 1000,
  LAZY_LOAD_THRESHOLD: 0.1,
  MAX_CODE_LENGTH: 50000,
  DEBOUNCE_DELAY: 300,
  VIRTUAL_SCROLL_ITEM_HEIGHT: 40,
  CACHE_EXPIRATION: 5 * 60 * 1000, // 5 minutes
} as const

// JavaScript object metadata
export const OBJECT_METADATA = {
  Object: {
    complexity: 'intermediate',
    relatedObjects: ['Array', 'Map', 'Set', 'WeakMap', 'Function'],
    browserSupport: 'Object is supported in all JavaScript environments and browsers.',
    category: 'Fundamental',
    introduced: 'ES1',
    stability: 'stable'
  },
  String: {
    complexity: 'beginner',
    relatedObjects: ['RegExp', 'Array', 'Number', 'JSON'],
    browserSupport: 'String is supported in all JavaScript environments and browsers.',
    category: 'Text',
    introduced: 'ES1',
    stability: 'stable'
  },
  Number: {
    complexity: 'beginner',
    relatedObjects: ['BigInt', 'Math', 'parseInt', 'parseFloat'],
    browserSupport: 'Number is supported in all JavaScript environments and browsers.',
    category: 'Numbers & Math',
    introduced: 'ES1',
    stability: 'stable'
  },
  Array: {
    complexity: 'beginner',
    relatedObjects: ['Object', 'Map', 'Set', 'TypedArray'],
    browserSupport: 'Array is supported in all JavaScript environments and browsers.',
    category: 'Collections',
    introduced: 'ES1',
    stability: 'stable'
  },
  Function: {
    complexity: 'advanced',
    relatedObjects: ['Object', 'AsyncFunction', 'GeneratorFunction'],
    browserSupport: 'Function is supported in all JavaScript environments and browsers.',
    category: 'Fundamental',
    introduced: 'ES1',
    stability: 'stable'
  },
  Promise: {
    complexity: 'intermediate',
    relatedObjects: ['AsyncFunction', 'Generator', 'AsyncIterator'],
    browserSupport: 'Promise is supported in ES2015+ browsers and Node.js 0.12+.',
    category: 'Control Flow',
    introduced: 'ES2015',
    stability: 'stable'
  },
  Map: {
    complexity: 'intermediate',
    relatedObjects: ['Object', 'Set', 'WeakMap', 'Array'],
    browserSupport: 'Map is supported in ES2015+ browsers and Node.js 0.12+.',
    category: 'Collections',
    introduced: 'ES2015',
    stability: 'stable'
  },
  Set: {
    complexity: 'intermediate',
    relatedObjects: ['Array', 'Map', 'WeakSet'],
    browserSupport: 'Set is supported in ES2015+ browsers and Node.js 0.12+.',
    category: 'Collections',
    introduced: 'ES2015',
    stability: 'stable'
  },
  WeakMap: {
    complexity: 'advanced',
    relatedObjects: ['Map', 'WeakSet', 'Object'],
    browserSupport: 'WeakMap is supported in ES2015+ browsers and Node.js 0.12+.',
    category: 'Collections',
    introduced: 'ES2015',
    stability: 'stable'
  },
  WeakSet: {
    complexity: 'advanced',
    relatedObjects: ['Set', 'WeakMap', 'Object'],
    browserSupport: 'WeakSet is supported in ES2015+ browsers and Node.js 0.12+.',
    category: 'Collections',
    introduced: 'ES2015',
    stability: 'stable'
  },
  RegExp: {
    complexity: 'intermediate',
    relatedObjects: ['String', 'Array'],
    browserSupport: 'RegExp is supported in all JavaScript environments and browsers.',
    category: 'Text',
    introduced: 'ES1',
    stability: 'stable'
  },
  Date: {
    complexity: 'intermediate',
    relatedObjects: ['Number', 'String', 'Intl'],
    browserSupport: 'Date is supported in all JavaScript environments and browsers.',
    category: 'Internationalization',
    introduced: 'ES1',
    stability: 'stable'
  },
  JSON: {
    complexity: 'beginner',
    relatedObjects: ['Object', 'Array', 'String'],
    browserSupport: 'JSON is supported in all modern browsers and Node.js.',
    category: 'Data Processing',
    introduced: 'ES5',
    stability: 'stable'
  }
} as const

// Object categories with improved organization
export const OBJECT_CATEGORIES = {
  'Fundamental': {
    objects: ['Object', 'Function', 'Boolean', 'Symbol'],
    description: 'Core JavaScript objects that form the foundation of the language',
    color: 'blue'
  },
  'Numbers & Math': {
    objects: ['Number', 'BigInt', 'Math', 'NaN', 'Infinity', 'isFinite()', 'isNaN()', 'parseFloat()', 'parseInt()'],
    description: 'Numeric operations and mathematical functions',
    color: 'green'
  },
  'Text': {
    objects: ['String', 'RegExp'],
    description: 'String manipulation and pattern matching',
    color: 'purple'
  },
  'Collections': {
    objects: ['Array', 'Map', 'Set', 'WeakMap', 'WeakSet', 'WeakRef'],
    description: 'Data structures for storing and organizing data',
    color: 'orange'
  },
  'Typed Arrays': {
    objects: ['ArrayBuffer', 'SharedArrayBuffer', 'DataView', 'TypedArray', 
             'Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 
             'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array', 
             'Float64Array', 'BigInt64Array', 'BigUint64Array', 'Float16Array'],
    description: 'Binary data manipulation and typed array structures',
    color: 'indigo'
  },
  'Errors': {
    objects: ['Error', 'AggregateError', 'EvalError', 'RangeError', 'ReferenceError', 
             'SyntaxError', 'TypeError', 'URIError', 'InternalError', 'SuppressedError'],
    description: 'Error handling and exception types',
    color: 'red'
  },
  'Control Flow': {
    objects: ['Promise', 'AsyncFunction', 'Generator', 'GeneratorFunction', 
             'AsyncGenerator', 'AsyncGeneratorFunction', 'Iterator', 'AsyncIterator'],
    description: 'Asynchronous operations and control flow management',
    color: 'cyan'
  },
  'Memory Management': {
    objects: ['FinalizationRegistry', 'DisposableStack', 'AsyncDisposableStack'],
    description: 'Memory management and resource cleanup',
    color: 'pink'
  },
  'Meta Programming': {
    objects: ['Proxy', 'Reflect'],
    description: 'Runtime code manipulation and introspection',
    color: 'yellow'
  },
  'Internationalization': {
    objects: ['Intl', 'Date', 'Temporal'],
    description: 'Locale-aware operations and date/time handling',
    color: 'teal'
  },
  'Data Processing': {
    objects: ['JSON', 'Atomics'],
    description: 'Data serialization and atomic operations',
    color: 'gray'
  },
  'Global Functions': {
    objects: ['globalThis', 'eval()', 'decodeURI()', 'decodeURIComponent()', 
             'encodeURI()', 'encodeURIComponent()', 'escape()', 'unescape()', 'undefined'],
    description: 'Global utility functions and values',
    color: 'slate'
  }
} as const

// Common code patterns and snippets
export const CODE_SNIPPETS = {
  Object: [
    {
      title: 'Property Enumeration',
      code: `const obj = { a: 1, b: 2, c: 3 };
console.log(Object.keys(obj)); // ['a', 'b', 'c']
console.log(Object.values(obj)); // [1, 2, 3]
console.log(Object.entries(obj)); // [['a', 1], ['b', 2], ['c', 3]]`
    },
    {
      title: 'Object Cloning',
      code: `const original = { a: 1, b: { c: 2 } };
const shallow = Object.assign({}, original);
const spread = { ...original };
const deep = JSON.parse(JSON.stringify(original));`
    }
  ],
  String: [
    {
      title: 'String Manipulation',
      code: `const str = 'Hello World';
console.log(str.toLowerCase()); // 'hello world'
console.log(str.replace('World', 'JavaScript')); // 'Hello JavaScript'
console.log(str.split(' ')); // ['Hello', 'World']`
    },
    {
      title: 'Template Literals',
      code: `const name = 'Alice';
const age = 30;
const message = \`Hello, my name is \${name} and I'm \${age} years old.\`;
console.log(message);`
    }
  ],
  Array: [
    {
      title: 'Array Methods',
      code: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log(doubled, evens, sum);`
    }
  ]
} as const

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = [
  { key: 'Ctrl/Cmd + K', description: 'Focus search' },
  { key: 'Ctrl/Cmd + Enter', description: 'Run code' },
  { key: 'Ctrl/Cmd + Shift + F', description: 'Format code' },
  { key: 'Ctrl/Cmd + /', description: 'Toggle theme' },
  { key: 'Esc', description: 'Close dialogs' },
  { key: 'Tab', description: 'Navigate sections' }
] as const

// Theme colors
export const THEME_COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a'
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712'
  }
} as const

// Cache keys
export const CACHE_KEYS = {
  VISITED_OBJECTS: 'visited_objects',
  FAVORITE_OBJECTS: 'favorite_objects',
  USER_CODE: 'user_code_',
  THEME_PREFERENCE: 'theme_preference',
  SETTINGS: 'app_settings',
  STUDY_PROGRESS: 'study_progress'
} as const

// Error messages
export const ERROR_MESSAGES = {
  CODE_EXECUTION_TIMEOUT: 'Code execution timed out. Please check for infinite loops.',
  CODE_EXECUTION_ERROR: 'An error occurred while executing your code.',
  COPY_FAILED: 'Failed to copy code to clipboard.',
  INVALID_CODE: 'Invalid JavaScript code provided.',
  STORAGE_ERROR: 'Failed to save data. Please check browser storage permissions.',
  NETWORK_ERROR: 'Network error occurred. Please check your connection.'
} as const