'use client'

import { useState, useCallback, useEffect } from 'react'
import { Copy, Check, ExternalLink, Play, Book, Code2 } from 'lucide-react'
import { cacheObjectPage } from './ServiceWorkerRegistration'

interface ObjectExamplesProps {
  selectedObject: string
}

export default function ObjectExamples({ selectedObject }: ObjectExamplesProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [runningExample, setRunningExample] = useState<number | null>(null)

  // Cache the current object page for offline access
  useEffect(() => {
    const cacheCurrentPage = async () => {
      const currentPath = window.location.pathname
      const objectPath = `/${selectedObject.toLowerCase()}`
      
      // Cache both current page and object-specific page
      cacheObjectPage(currentPath)
      if (currentPath !== objectPath) {
        cacheObjectPage(objectPath)
      }
    }
    
    cacheCurrentPage()
  }, [selectedObject])

  const copyToClipboard = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }, [])





  const runExample = useCallback(async (code: string, index: number) => {
    setRunningExample(index)
    try {
      // Create a safe eval function with console capture
      const originalLog = console.log
      const output: string[] = []
      console.log = (...args) => {
        output.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '))
      }
      
      // Execute the code
      new Function(code)()
      
      // Show output in an alert for now (could be improved with a modal)
      if (output.length > 0) {
        alert('Output:\n' + output.join('\n'))
      } else {
        alert('Code executed successfully (no output)')
      }
      
      // Restore original console
      console.log = originalLog
    } catch (error) {
      alert('Error: ' + (error instanceof Error ? error.message : String(error)))
    } finally {
      setRunningExample(null)
    }
  }, [])

  // Get MDN documentation link
  const getMDNLink = (objectName: string) => {
    const baseURL = 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/'
    const objectMappings: { [key: string]: string } = {
      'Object': 'Object',
      'Array': 'Array',
      'String': 'String',
      'Number': 'Number',
      'Boolean': 'Boolean',
      'Date': 'Date',
      'Math': 'Math',
      'JSON': 'JSON',
      'Promise': 'Promise',
      'Map': 'Map',
      'Set': 'Set',
      'RegExp': 'RegExp',
      'Error': 'Error',
      'Symbol': 'Symbol',
      'Proxy': 'Proxy',
      'WeakMap': 'WeakMap',
      'WeakSet': 'WeakSet',
      'AggregateError': 'AggregateError',
      'EvalError': 'EvalError',
      'RangeError': 'RangeError',
      'ReferenceError': 'ReferenceError',
      'SyntaxError': 'SyntaxError',
      'TypeError': 'TypeError',
      'URIError': 'URIError',
      'InternalError': 'InternalError',
      'SuppressedError': 'SuppressedError'
    }

    const mdnPath = objectMappings[objectName] || objectName
    return `${baseURL}${mdnPath}`
  }

  const getObjectExamples = (objectName: string) => {
    const examples: { [key: string]: { description: string; examples: string[] } } = {
      'Object': {
        description: 'The Object constructor creates an object wrapper for the given value.',
        examples: [
          `// Creating objects
const obj1 = new Object();
const obj2 = new Object({ name: 'John', age: 30 });
const obj3 = { name: 'Jane', age: 25 };

console.log(obj1); // {}
console.log(obj2); // { name: 'John', age: 30 }
console.log(obj3); // { name: 'Jane', age: 25 }`,

          `// Object methods
const person = { name: 'Alice', age: 28 };

console.log(Object.keys(person)); // ['name', 'age']
console.log(Object.values(person)); // ['Alice', 28]
console.log(Object.entries(person)); // [['name', 'Alice'], ['age', 28]]
console.log(Object.assign({}, person, { city: 'NYC' })); // { name: 'Alice', age: 28, city: 'NYC' }`,

          `// Object property descriptors
const obj = { name: 'Bob' };
const descriptor = Object.getOwnPropertyDescriptor(obj, 'name');
console.log(descriptor); // { value: 'Bob', writable: true, enumerable: true, configurable: true }

Object.defineProperty(obj, 'age', {
  value: 35,
  writable: false,
  enumerable: true,
  configurable: true
});
console.log(obj.age); // 35`,

          `// Object freezing and sealing
const mutable = { name: 'Charlie' };
Object.freeze(mutable);
mutable.name = 'David'; // This will be ignored in strict mode
console.log(mutable.name); // 'Charlie'

const sealed = { name: 'Eve' };
Object.seal(sealed);
sealed.name = 'Frank'; // This works
sealed.age = 40; // This will be ignored
console.log(sealed); // { name: 'Frank' }`
        ]
      },

      'Array': {
        description: 'The Array constructor creates Array objects.',
        examples: [
          `// Creating arrays
const arr1 = new Array();
const arr2 = new Array(3);
const arr3 = new Array(1, 2, 3);
const arr4 = [1, 2, 3, 4, 5];

console.log(arr1); // []
console.log(arr2); // [empty × 3]
console.log(arr3); // [1, 2, 3]
console.log(arr4); // [1, 2, 3, 4, 5]`,

          `// Array methods
const numbers = [1, 2, 3, 4, 5];

console.log(numbers.map(x => x * 2)); // [2, 4, 6, 8, 10]
console.log(numbers.filter(x => x > 2)); // [3, 4, 5]
console.log(numbers.reduce((sum, x) => sum + x, 0)); // 15
console.log(numbers.find(x => x > 3)); // 4
console.log(numbers.includes(3)); // true`,

          `// Array destructuring and spread
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first); // 1
console.log(second); // 2
console.log(rest); // [3, 4, 5]

const arr1 = [1, 2];
const arr2 = [3, 4];
const combined = [...arr1, ...arr2];
console.log(combined); // [1, 2, 3, 4]`,

          `// Array iteration
const fruits = ['apple', 'banana', 'orange'];

fruits.forEach((fruit, index) => {
  console.log(\`\${index}: \${fruit}\`);
});

for (const fruit of fruits) {
  console.log(fruit);
}

for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}`
        ]
      },

      'String': {
        description: 'The String constructor creates a new String object.',
        examples: [
          `// Creating strings
const str1 = new String('Hello');
const str2 = 'World';
const str3 = \`Hello \${str2}\`;

console.log(str1); // String {'Hello'}
console.log(str2); // 'World'
console.log(str3); // 'Hello World'`,

          `// String methods
const text = '  Hello World  ';

console.log(text.trim()); // 'Hello World'
console.log(text.toUpperCase()); // '  HELLO WORLD  '
console.log(text.toLowerCase()); // '  hello world  '
console.log(text.replace('World', 'JavaScript')); // '  Hello JavaScript  '
console.log(text.split(' ')); // ['', '', 'Hello', 'World', '', '']`,

          `// String searching
const sentence = 'The quick brown fox jumps over the lazy dog';

console.log(sentence.indexOf('fox')); // 16
console.log(sentence.includes('brown')); // true
console.log(sentence.startsWith('The')); // true
console.log(sentence.endsWith('dog')); // true
console.log(sentence.substring(4, 9)); // 'quick'`,

          `// String template literals
const name = 'Alice';
const age = 30;
const message = \`Hello, my name is \${name} and I am \${age} years old.\`;
console.log(message); // 'Hello, my name is Alice and I am 30 years old.'

const multiline = \`
  This is a
  multiline string
  with template literals
\`;
console.log(multiline);`
        ]
      },

      'Number': {
        description: 'The Number constructor creates a Number object.',
        examples: [
          `// Creating numbers
const num1 = new Number(42);
const num2 = 3.14159;
const num3 = Number('123');

console.log(num1); // Number {42}
console.log(num2); // 3.14159
console.log(num3); // 123`,

          `// Number methods
const num = 123.456;

console.log(num.toFixed(2)); // '123.46'
console.log(num.toPrecision(4)); // '123.5'
console.log(num.toString()); // '123.456'
console.log(num.valueOf()); // 123.456

const binary = 42;
console.log(binary.toString(2)); // '101010'
console.log(binary.toString(16)); // '2a'`,

          `// Number constants
console.log(Number.MAX_VALUE); // 1.7976931348623157e+308
console.log(Number.MIN_VALUE); // 5e-324
console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991
console.log(Number.MIN_SAFE_INTEGER); // -9007199254740991
console.log(Number.POSITIVE_INFINITY); // Infinity
console.log(Number.NEGATIVE_INFINITY); // -Infinity`,

          `// Number checking methods
console.log(Number.isInteger(42)); // true
console.log(Number.isInteger(42.5)); // false
console.log(Number.isFinite(42)); // true
console.log(Number.isFinite(Infinity)); // false
console.log(Number.isNaN(NaN)); // true
console.log(Number.isNaN(42)); // false`
        ]
      },

      'Boolean': {
        description: 'The Boolean constructor creates a Boolean object.',
        examples: [
          `// Creating booleans
const bool1 = new Boolean(true);
const bool2 = new Boolean(false);
const bool3 = true;
const bool4 = false;

console.log(bool1); // Boolean {true}
console.log(bool2); // Boolean {false}
console.log(bool3); // true
console.log(bool4); // false`,

          `// Boolean conversion
console.log(Boolean(1)); // true
console.log(Boolean(0)); // false
console.log(Boolean('hello')); // true
console.log(Boolean('')); // false
console.log(Boolean([])); // true
console.log(Boolean({})); // true
console.log(Boolean(null)); // false
console.log(Boolean(undefined)); // false`,

          `// Truthy and falsy values
const falsyValues = [false, 0, -0, 0n, '', null, undefined, NaN];
falsyValues.forEach(value => {
  console.log(\`\${value} is \${Boolean(value)}\`);
});

const truthyValues = [true, 1, -1, 'hello', [], {}, function(){}];
truthyValues.forEach(value => {
  console.log(\`\${value} is \${Boolean(value)}\`);
})`,

          `// Boolean operations
const a = true;
const b = false;

console.log(a && b); // false (AND)
console.log(a || b); // true (OR)
console.log(!a); // false (NOT)
console.log(a ? 'yes' : 'no'); // 'yes' (ternary)`
        ]
      },

      'Date': {
        description: 'The Date constructor creates a Date object.',
        examples: [
          `// Creating dates
const now = new Date();
const specificDate = new Date('2023-12-25');
const timestamp = new Date(1703462400000);

console.log(now); // Current date and time
console.log(specificDate); // 2023-12-25T00:00:00.000Z
console.log(timestamp); // Date based on timestamp`,

          `// Date methods
const date = new Date('2023-12-25T10:30:00');

console.log(date.getFullYear()); // 2023
console.log(date.getMonth()); // 11 (December, 0-indexed)
console.log(date.getDate()); // 25
console.log(date.getDay()); // 1 (Monday, 0-indexed)
console.log(date.getHours()); // 10
console.log(date.getMinutes()); // 30
console.log(date.getSeconds()); // 0`,

          `// Date formatting
const date = new Date();

console.log(date.toDateString()); // 'Mon Dec 25 2023'
console.log(date.toTimeString()); // '10:30:00 GMT+0000'
console.log(date.toISOString()); // '2023-12-25T10:30:00.000Z'
console.log(date.toLocaleDateString()); // Local date format
console.log(date.toLocaleTimeString()); // Local time format`,

          `// Date arithmetic
const date1 = new Date('2023-12-25');
const date2 = new Date('2023-12-30');

const diffTime = date2.getTime() - date1.getTime();
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

console.log(\`Difference in days: \${diffDays}\`); // 5

// Adding days
const futureDate = new Date(date1);
futureDate.setDate(date1.getDate() + 7);
console.log(futureDate); // 7 days later`
        ]
      },

      'Math': {
        description: 'The Math object provides mathematical constants and functions.',
        examples: [
          `// Math constants
console.log(Math.PI); // 3.141592653589793
console.log(Math.E); // 2.718281828459045
console.log(Math.LN2); // 0.6931471805599453
console.log(Math.LN10); // 2.302585092994046
console.log(Math.LOG2E); // 1.4426950408889634
console.log(Math.LOG10E); // 0.4342944819032518`,

          `// Math methods
console.log(Math.abs(-5)); // 5
console.log(Math.ceil(4.3)); // 5
console.log(Math.floor(4.7)); // 4
console.log(Math.round(4.5)); // 5
console.log(Math.max(1, 2, 3, 4, 5)); // 5
console.log(Math.min(1, 2, 3, 4, 5)); // 1
console.log(Math.pow(2, 3)); // 8
console.log(Math.sqrt(16)); // 4`,

          `// Trigonometric functions
console.log(Math.sin(Math.PI / 2)); // 1
console.log(Math.cos(0)); // 1
console.log(Math.tan(Math.PI / 4)); // 1
console.log(Math.asin(1)); // 1.5707963267948966
console.log(Math.acos(0)); // 1.5707963267948966
console.log(Math.atan(1)); // 0.7853981633974483`,

          `// Random numbers
console.log(Math.random()); // Random number between 0 and 1

// Random integer between min and max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log(getRandomInt(1, 10)); // Random integer between 1 and 10`
        ]
      },

      'JSON': {
        description: 'The JSON object provides methods for parsing and stringifying JSON.',
        examples: [
          `// JSON.stringify
const obj = {
  name: 'John',
  age: 30,
  city: 'New York',
  hobbies: ['reading', 'swimming']
};

const jsonString = JSON.stringify(obj);
console.log(jsonString); // '{"name":"John","age":30,"city":"New York","hobbies":["reading","swimming"]}'

// With formatting
const prettyJson = JSON.stringify(obj, null, 2);
console.log(prettyJson); // Formatted JSON`,

          `// JSON.parse
const jsonStr = '{"name":"Jane","age":25,"active":true}';
const parsedObj = JSON.parse(jsonStr);

console.log(parsedObj.name); // 'Jane'
console.log(parsedObj.age); // 25
console.log(parsedObj.active); // true`,

          `// JSON with functions and undefined
const objWithFunction = {
  name: 'Bob',
  greet: function() { return 'Hello'; },
  undefinedValue: undefined
};

// Functions and undefined are ignored
console.log(JSON.stringify(objWithFunction)); // '{"name":"Bob"}'`,

          `// JSON reviver function
const jsonStr = '{"name":"Alice","age":"30","birthDate":"1993-12-25"}';
const parsed = JSON.parse(jsonStr, (key, value) => {
  if (key === 'age') return parseInt(value);
  if (key === 'birthDate') return new Date(value);
  return value;
});

console.log(parsed.age); // 30 (number)
console.log(parsed.birthDate); // Date object`
        ]
      },

      'Promise': {
        description: 'The Promise constructor creates a Promise object.',
        examples: [
          `// Creating promises
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => resolve('Success!'), 1000);
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(() => reject('Error!'), 1000);
});

promise1.then(result => console.log(result)); // 'Success!'
promise2.catch(error => console.log(error)); // 'Error!'`,

          `// Promise chaining
new Promise((resolve) => resolve(1))
  .then(value => value + 1)
  .then(value => value * 2)
  .then(value => {
    console.log(value); // 4
    return value + 1;
  })
  .then(value => console.log(value)); // 5`,

          `// Promise.all
const promises = [
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
];

Promise.all(promises)
  .then(results => console.log(results)); // [1, 2, 3]

// Promise.race
const promises = [
  new Promise(resolve => setTimeout(() => resolve('First'), 1000)),
  new Promise(resolve => setTimeout(() => resolve('Second'), 500))
];

Promise.race(promises)
  .then(result => console.log(result)); // 'Second'`,

          `// Async/await
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Using async function
fetchData().then(data => console.log(data));`
        ]
      },

      'Map': {
        description: 'The Map constructor creates a Map object.',
        examples: [
          `// Creating maps
const map1 = new Map();
const map2 = new Map([['key1', 'value1'], ['key2', 'value2']]);

console.log(map1); // Map {}
console.log(map2); // Map {'key1' => 'value1', 'key2' => 'value2'}`,

          `// Map methods
const map = new Map();

map.set('name', 'John');
map.set('age', 30);
map.set('city', 'New York');

console.log(map.get('name')); // 'John'
console.log(map.has('age')); // true
console.log(map.size); // 3

map.delete('city');
console.log(map.has('city')); // false

map.clear();
console.log(map.size); // 0`,

          `// Map iteration
const map = new Map([
  ['name', 'Alice'],
  ['age', 25],
  ['city', 'Boston']
]);

// Using for...of
for (const [key, value] of map) {
  console.log(\`\${key}: \${value}\`);
}

// Using forEach
map.forEach((value, key) => {
  console.log(\`\${key}: \${value}\`);
});

// Getting keys, values, entries
console.log([...map.keys()]); // ['name', 'age', 'city']
console.log([...map.values()]); // ['Alice', 25, 'Boston']
console.log([...map.entries()]); // [['name', 'Alice'], ['age', 25], ['city', 'Boston']]`,

          `// Map with objects as keys
const user1 = { id: 1, name: 'John' };
const user2 = { id: 2, name: 'Jane' };

const userMap = new Map();
userMap.set(user1, 'Admin');
userMap.set(user2, 'User');

console.log(userMap.get(user1)); // 'Admin'
console.log(userMap.get(user2)); // 'User'`
        ]
      },

      'Set': {
        description: 'The Set constructor creates a Set object.',
        examples: [
          `// Creating sets
const set1 = new Set();
const set2 = new Set([1, 2, 3, 3, 4, 4, 5]);

console.log(set1); // Set {}
console.log(set2); // Set {1, 2, 3, 4, 5} (duplicates removed)`,

          `// Set methods
const set = new Set();

set.add(1);
set.add(2);
set.add(2); // Duplicate ignored
set.add(3);

console.log(set.has(1)); // true
console.log(set.size); // 3

set.delete(2);
console.log(set.has(2)); // false

set.clear();
console.log(set.size); // 0`,

          `// Set iteration
const set = new Set(['apple', 'banana', 'orange']);

// Using for...of
for (const item of set) {
  console.log(item);
}

// Using forEach
set.forEach(item => {
  console.log(item);
});

// Converting to array
const array = [...set];
console.log(array); // ['apple', 'banana', 'orange']`,

          `// Set operations
const set1 = new Set([1, 2, 3, 4]);
const set2 = new Set([3, 4, 5, 6]);

// Union
const union = new Set([...set1, ...set2]);
console.log(union); // Set {1, 2, 3, 4, 5, 6}

// Intersection
const intersection = new Set([...set1].filter(x => set2.has(x)));
console.log(intersection); // Set {3, 4}

// Difference
const difference = new Set([...set1].filter(x => !set2.has(x)));
console.log(difference); // Set {1, 2}`
        ]
      },

      'RegExp': {
        description: 'The RegExp constructor creates a regular expression object.',
        examples: [
          `// Creating regular expressions
const regex1 = new RegExp('pattern');
const regex2 = /pattern/;
const regex3 = new RegExp('hello', 'gi');

console.log(regex1); // /pattern/
console.log(regex2); // /pattern/
console.log(regex3); // /hello/gi`,

          `// RegExp methods
const text = 'Hello world, hello universe';
const regex = /hello/gi;

console.log(regex.test(text)); // true
console.log(regex.exec(text)); // ['Hello', index: 0, input: 'Hello world, hello universe']

// String methods with regex
console.log(text.match(regex)); // ['Hello', 'hello']
console.log(text.replace(regex, 'hi')); // 'hi world, hi universe'
console.log(text.search(regex)); // 0
console.log(text.split(/\\s+/)); // ['Hello', 'world,', 'hello', 'universe']`,

          `// Common patterns
const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
const phoneRegex = /^\\+?[1-9]\\d{1,14}$/;
const urlRegex = /^https?:\\/\\/[^\\s\\/$.?#].[^\\s]*$/;

console.log(emailRegex.test('user@example.com')); // true
console.log(phoneRegex.test('+1234567890')); // true
console.log(urlRegex.test('https://example.com')); // true`,

          `// Capturing groups
const text = 'John Doe, age 30, email: john@example.com';
const regex = /(\\w+)\\s+(\\w+),\\s+age\\s+(\\d+),\\s+email:\\s+(\\S+)/;

const match = text.match(regex);
if (match) {
  console.log('First name:', match[1]); // 'John'
  console.log('Last name:', match[2]); // 'Doe'
  console.log('Age:', match[3]); // '30'
  console.log('Email:', match[4]); // 'john@example.com'
}`
        ]
      },

      'Error': {
        description: 'The Error constructor creates an Error object.',
        examples: [
          `// Creating errors
const error1 = new Error('Something went wrong');
const error2 = new TypeError('Invalid type');
const error3 = new ReferenceError('Variable not defined');
const error4 = new SyntaxError('Invalid syntax');

console.log(error1.message); // 'Something went wrong'
console.log(error1.name); // 'Error'
console.log(error2.name); // 'TypeError'`,

          `// Custom error class
class CustomError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
  }
}

const customError = new CustomError('Custom error message', 'ERR001');
console.log(customError.message); // 'Custom error message'
console.log(customError.code); // 'ERR001'`,

          `// Error handling
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

try {
  const result = divide(10, 0);
  console.log(result);
} catch (error) {
  console.error('Error:', error.message); // 'Error: Division by zero'
  console.error('Stack:', error.stack);
}`,

          `// Error with stack trace
function functionA() {
  functionB();
}

function functionB() {
  functionC();
}

function functionC() {
  throw new Error('Error in function C');
}

try {
  functionA();
} catch (error) {
  console.log(error.stack);
  // Shows the call stack: functionC -> functionB -> functionA
}`
        ]
      },

      'Symbol': {
        description: 'The Symbol constructor creates a Symbol object.',
        examples: [
          `// Creating symbols
const sym1 = Symbol();
const sym2 = Symbol('description');
const sym3 = Symbol('description');

console.log(sym1); // Symbol()
console.log(sym2); // Symbol(description)
console.log(sym2 === sym3); // false (symbols are unique)`,

          `// Symbol as object property
const mySymbol = Symbol('mySymbol');
const obj = {
  [mySymbol]: 'This is a symbol property',
  regularProperty: 'This is a regular property'
};

console.log(obj[mySymbol]); // 'This is a symbol property'
console.log(obj.regularProperty); // 'This is a regular property'

// Symbol properties are not enumerable
console.log(Object.keys(obj)); // ['regularProperty']
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(mySymbol)]`,

          `// Well-known symbols
const arr = [1, 2, 3];

// Symbol.iterator
const iterator = arr[Symbol.iterator]();
console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true }

// Symbol.toStringTag
class MyClass {
  get [Symbol.toStringTag]() {
    return 'MyClass';
  }
}

const instance = new MyClass();
console.log(Object.prototype.toString.call(instance)); // '[object MyClass]'`,

          `// Symbol.for and Symbol.keyFor
const sym1 = Symbol.for('shared');
const sym2 = Symbol.for('shared');

console.log(sym1 === sym2); // true (same symbol from global registry)

console.log(Symbol.keyFor(sym1)); // 'shared'

const localSym = Symbol('local');
console.log(Symbol.keyFor(localSym)); // undefined (not in global registry)`
        ]
      },

      'Proxy': {
        description: 'The Proxy constructor creates a Proxy object.',
        examples: [
          `// Basic proxy
const target = { name: 'John', age: 30 };
const handler = {
  get(target, prop) {
    console.log(\`Getting property: \${prop}\`);
    return target[prop];
  },
  set(target, prop, value) {
    console.log(\`Setting property: \${prop} to \${value}\`);
    target[prop] = value;
    return true;
  }
};

const proxy = new Proxy(target, handler);

console.log(proxy.name); // Logs: Getting property: name, Output: 'John'
proxy.age = 31; // Logs: Setting property: age to 31`,

          `// Validation proxy
const handler = {
  set(target, prop, value) {
    if (prop === 'age' && (typeof value !== 'number' || value < 0)) {
      throw new Error('Age must be a positive number');
    }
    target[prop] = value;
    return true;
  }
};

const person = new Proxy({}, handler);

person.name = 'Alice'; // Works
person.age = 25; // Works
// person.age = -5; // Throws error: Age must be a positive number`,

          `// Logging proxy
const handler = {
  get(target, prop) {
    const value = target[prop];
    console.log(\`Accessing: \${prop} = \${value}\`);
    return value;
  },
  set(target, prop, value) {
    console.log(\`Setting: \${prop} = \${value}\`);
    target[prop] = value;
    return true;
  },
  deleteProperty(target, prop) {
    console.log(\`Deleting: \${prop}\`);
    delete target[prop];
    return true;
  }
};

const obj = new Proxy({}, handler);
obj.name = 'Bob';
console.log(obj.name);
delete obj.name;`,

          `// Function proxy
const handler = {
  apply(target, thisArg, argumentsList) {
    console.log(\`Function called with arguments: \${argumentsList}\`);
    const result = target.apply(thisArg, argumentsList);
    console.log(\`Function returned: \${result}\`);
    return result;
  }
};

function add(a, b) {
  return a + b;
}

const proxiedAdd = new Proxy(add, handler);
console.log(proxiedAdd(2, 3)); // Logs function call and return, Output: 5`
        ]
      },

      'WeakMap': {
        description: 'The WeakMap constructor creates a WeakMap object.',
        examples: [
          `// Creating WeakMap
const weakMap = new WeakMap();
const obj1 = { name: 'John' };
const obj2 = { name: 'Jane' };

weakMap.set(obj1, 'Data for John');
weakMap.set(obj2, 'Data for Jane');

console.log(weakMap.get(obj1)); // 'Data for John'
console.log(weakMap.has(obj1)); // true`,

          `// WeakMap with object keys
const cache = new WeakMap();

function expensiveOperation(obj) {
  if (cache.has(obj)) {
    return cache.get(obj);
  }
  
  const result = obj.name.toUpperCase() + ' processed';
  cache.set(obj, result);
  return result;
}

const user1 = { name: 'Alice' };
const user2 = { name: 'Bob' };

console.log(expensiveOperation(user1)); // 'ALICE processed'
console.log(expensiveOperation(user1)); // 'ALICE processed' (from cache)
console.log(expensiveOperation(user2)); // 'BOB processed'`,

          `// WeakMap limitations
const weakMap = new WeakMap();
const obj = { data: 'test' };

weakMap.set(obj, 'value');

// These methods don't exist on WeakMap
// console.log(weakMap.size); // undefined
// console.log(weakMap.keys()); // undefined
// console.log(weakMap.values()); // undefined
// console.log(weakMap.entries()); // undefined

// Only these methods are available
console.log(weakMap.get(obj)); // 'value'
console.log(weakMap.has(obj)); // true
weakMap.delete(obj);
console.log(weakMap.has(obj)); // false`,

          `// WeakMap for private data
const privateData = new WeakMap();

class User {
  constructor(name, age) {
    privateData.set(this, { name, age });
  }
  
  getName() {
    return privateData.get(this).name;
  }
  
  getAge() {
    return privateData.get(this).age;
  }
}

const user = new User('Charlie', 35);
console.log(user.getName()); // 'Charlie'
console.log(user.getAge()); // 35
// console.log(user.name); // undefined (private)`
        ]
      },

      'WeakSet': {
        description: 'The WeakSet constructor creates a WeakSet object.',
        examples: [
          `// Creating WeakSet
const weakSet = new WeakSet();
const obj1 = { name: 'John' };
const obj2 = { name: 'Jane' };

weakSet.add(obj1);
weakSet.add(obj2);

console.log(weakSet.has(obj1)); // true
console.log(weakSet.has(obj2)); // true`,

          `// WeakSet for tracking objects
const processedObjects = new WeakSet();

function processObject(obj) {
  if (processedObjects.has(obj)) {
    console.log('Object already processed');
    return;
  }
  
  console.log('Processing object:', obj.name);
  processedObjects.add(obj);
}

const user1 = { name: 'Alice' };
const user2 = { name: 'Bob' };

processObject(user1); // 'Processing object: Alice'
processObject(user1); // 'Object already processed'
processObject(user2); // 'Processing object: Bob'`,

          `// WeakSet limitations
const weakSet = new WeakSet();
const obj = { data: 'test' };

weakSet.add(obj);

// These methods don't exist on WeakSet
// console.log(weakSet.size); // undefined
// console.log(weakSet.values()); // undefined

// Only these methods are available
console.log(weakSet.has(obj)); // true
weakSet.delete(obj);
console.log(weakSet.has(obj)); // false`,

          `// WeakSet for preventing circular references
const visited = new WeakSet();

function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (visited.has(obj)) {
    return null; // Prevent circular reference
  }
  
  visited.add(obj);
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
}

const obj = { name: 'Test' };
obj.self = obj; // Circular reference

const cloned = deepClone(obj);
console.log(cloned.name); // 'Test'
console.log(cloned.self); // null (circular reference prevented)`
        ]
      },

      'AggregateError': {
        description: 'The AggregateError constructor creates an error that represents multiple errors.',
        examples: [
          `// Creating AggregateError
const errors = [
  new Error('First error'),
  new Error('Second error'),
  new TypeError('Type error')
];

const aggregateError = new AggregateError(errors, 'Multiple errors occurred');
console.log(aggregateError.message); // 'Multiple errors occurred'
console.log(aggregateError.errors); // Array of errors`,

          `// Promise.any rejection
Promise.any([
  Promise.reject(new Error('Error 1')),
  Promise.reject(new Error('Error 2')),
  Promise.reject(new Error('Error 3'))
]).catch(error => {
  console.log(error instanceof AggregateError); // true
  console.log(error.errors.length); // 3
  error.errors.forEach((e, i) => {
    console.log(\`Error \${i + 1}: \${e.message}\`);
  });
});`,

          `// Collecting validation errors
function validateData(data) {
  const errors = [];
  
  if (!data.name) {
    errors.push(new Error('Name is required'));
  }
  if (!data.email) {
    errors.push(new Error('Email is required'));
  }
  if (data.age && data.age < 0) {
    errors.push(new RangeError('Age must be positive'));
  }
  
  if (errors.length > 0) {
    throw new AggregateError(errors, 'Validation failed');
  }
  
  return true;
}

try {
  validateData({ age: -5 });
} catch (error) {
  if (error instanceof AggregateError) {
    console.log(error.message); // 'Validation failed'
    error.errors.forEach(e => console.log(e.message));
  }
}`
        ]
      },

      'EvalError': {
        description: 'The EvalError constructor creates an error regarding the eval() function.',
        examples: [
          `// EvalError (rarely thrown in modern JavaScript)
// EvalError was intended for errors with eval() but is rarely used now
const evalError = new EvalError('Eval error occurred');
console.log(evalError.name); // 'EvalError'
console.log(evalError.message); // 'Eval error occurred'
console.log(evalError instanceof Error); // true`,

          `// Custom eval error handling
function safeEval(code) {
  try {
    if (code.includes('delete') || code.includes('var')) {
      throw new EvalError('Unsafe code detected');
    }
    return eval(code);
  } catch (error) {
    if (error instanceof EvalError) {
      console.error('Eval error:', error.message);
    } else {
      console.error('Other error:', error.message);
    }
    return null;
  }
}

console.log(safeEval('2 + 2')); // 4
console.log(safeEval('delete obj')); // null (error caught)`
        ]
      },

      'RangeError': {
        description: 'The RangeError constructor creates an error when a value is not in the allowed range.',
        examples: [
          `// RangeError examples
try {
  const arr = new Array(-1); // Negative array length
} catch (error) {
  console.log(error instanceof RangeError); // true
  console.log(error.message); // Invalid array length
}

try {
  (42).toFixed(101); // Precision out of range
} catch (error) {
  console.log(error instanceof RangeError); // true
}`,

          `// Custom range validation
function setAge(age) {
  if (age < 0 || age > 150) {
    throw new RangeError(\`Age must be between 0 and 150, got \${age}\`);
  }
  return age;
}

try {
  setAge(200);
} catch (error) {
  console.log(error.message); // Age must be between 0 and 150, got 200
}`,

          `// Recursion limit
function recurse(depth = 0) {
  try {
    return recurse(depth + 1);
  } catch (error) {
    if (error instanceof RangeError) {
      console.log(\`Maximum recursion depth: \${depth}\`);
      return depth;
    }
    throw error;
  }
}

// This will hit the call stack limit
// const maxDepth = recurse();`
        ]
      },

      'ReferenceError': {
        description: 'The ReferenceError constructor creates an error when referencing a non-existent variable.',
        examples: [
          `// ReferenceError examples
try {
  console.log(nonExistentVariable);
} catch (error) {
  console.log(error instanceof ReferenceError); // true
  console.log(error.message); // nonExistentVariable is not defined
}`,

          `// Temporal dead zone with let/const
try {
  console.log(myVar); // ReferenceError
  let myVar = 5;
} catch (error) {
  console.log(error instanceof ReferenceError); // true
}`,

          `// Strict mode reference errors
function strictFunction() {
  'use strict';
  try {
    undeclaredVar = 10; // ReferenceError in strict mode
  } catch (error) {
    console.log(error instanceof ReferenceError); // true
    console.log(error.message);
  }
}

strictFunction();`
        ]
      },

      'SyntaxError': {
        description: 'The SyntaxError constructor creates an error when parsing syntactically invalid code.',
        examples: [
          `// SyntaxError examples
try {
  eval('const x = {');  // Unclosed brace
} catch (error) {
  console.log(error instanceof SyntaxError); // true
  console.log(error.message);
}`,

          `// JSON parsing errors
try {
  JSON.parse('{name: &quot;John&quot;}'); // Invalid JSON (missing quotes)
} catch (error) {
  console.log(error instanceof SyntaxError); // true
  console.log(error.message);
}

try {
  JSON.parse('{"name": "John",}'); // Trailing comma
} catch (error) {
  console.log(error instanceof SyntaxError); // true
}`,

          `// Dynamic code execution
function executeCode(code) {
  try {
    return new Function(code)();
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.log('Syntax error in code:', error.message);
      return null;
    }
    throw error;
  }
}

executeCode('return 2 + 2'); // 4
executeCode('return 2 ++ 2'); // null (syntax error)`
        ]
      },

      'TypeError': {
        description: 'The TypeError constructor creates an error when a value is not of the expected type.',
        examples: [
          `// TypeError examples
try {
  null.toString(); // Cannot read properties of null
} catch (error) {
  console.log(error instanceof TypeError); // true
}

try {
  const num = 42;
  num(); // Number is not a function
} catch (error) {
  console.log(error instanceof TypeError); // true
}`,

          `// Type checking
function processArray(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('Expected an array');
  }
  return arr.map(x => x * 2);
}

try {
  processArray('not an array');
} catch (error) {
  console.log(error.message); // Expected an array
}`,

          `// Property access errors
const obj = Object.freeze({ name: 'John' });

try {
  obj.name = 'Jane'; // Cannot assign to read-only property
} catch (error) {
  console.log(error instanceof TypeError); // true (in strict mode)
}`
        ]
      },

      'URIError': {
        description: 'The URIError constructor creates an error when URI handling functions are used incorrectly.',
        examples: [
          `// URIError examples
try {
  decodeURIComponent('%'); // Incomplete percent encoding
} catch (error) {
  console.log(error instanceof URIError); // true
  console.log(error.message);
}`,

          `// Invalid URI encoding
try {
  decodeURI('%E0%A4%A'); // Malformed URI sequence
} catch (error) {
  console.log(error instanceof URIError); // true
}`,

          `// Safe URI handling
function safeDecodeURI(uri) {
  try {
    return decodeURIComponent(uri);
  } catch (error) {
    if (error instanceof URIError) {
      console.log('Invalid URI encoding:', uri);
      return uri; // Return original string
    }
    throw error;
  }
}

console.log(safeDecodeURI('Hello%20World')); // 'Hello World'
console.log(safeDecodeURI('Invalid%')); // 'Invalid%'`
        ]
      },

      'InternalError': {
        description: 'The InternalError constructor creates an error for internal JavaScript engine errors (non-standard).',
        examples: [
          `// InternalError (Non-standard, Firefox only)
// This error is thrown when the JavaScript engine encounters an internal error

// Example that might cause InternalError in some engines:
// - Too much recursion
// - Out of memory
// - Engine bugs

// Since it's non-standard, create a polyfill
if (typeof InternalError === 'undefined') {
  class InternalError extends Error {
    constructor(message) {
      super(message);
      this.name = 'InternalError';
    }
  }
  globalThis.InternalError = InternalError;
}

const internalError = new InternalError('Internal engine error');
console.log(internalError.name); // 'InternalError'
console.log(internalError.message); // 'Internal engine error'`
        ]
      },

      'SuppressedError': {
        description: 'The SuppressedError constructor represents an error that occurs when another error is suppressed.',
        examples: [
          `// SuppressedError with using statement (Stage 3 proposal)
// This is used with the explicit resource management proposal

class SuppressedError extends Error {
  constructor(error, suppressed, message) {
    super(message);
    this.name = 'SuppressedError';
    this.error = error;
    this.suppressed = suppressed;
  }
}

// Example of error suppression scenario
function cleanup() {
  throw new Error('Cleanup error');
}

try {
  try {
    throw new Error('Main error');
  } finally {
    cleanup(); // This suppresses the main error
  }
} catch (error) {
  // In future JS, this might be a SuppressedError
  console.log(error.message); // 'Cleanup error'
}`,

          `// Manual error suppression tracking
class Resource {
  constructor(name) {
    this.name = name;
    this.closed = false;
  }
  
  close() {
    if (this.closed) {
      throw new Error(\`\${this.name} already closed\`);
    }
    this.closed = true;
  }
}

function useResources() {
  const errors = [];
  const resources = [
    new Resource('DB'),
    new Resource('File'),
    new Resource('Network')
  ];
  
  try {
    throw new Error('Processing error');
  } finally {
    resources.forEach(resource => {
      try {
        resource.close();
        resource.close(); // This will error
      } catch (error) {
        errors.push(error);
      }
    });
    
    if (errors.length > 0) {
      throw new SuppressedError(
        errors[0],
        errors.slice(1),
        'Errors during cleanup'
      );
    }
  }
}`
        ]
      }
    }

    return examples[objectName] || {
      description: `Information about ${objectName} will be added soon.`,
      examples: [
        `// Example for ${objectName}
console.log('This is a placeholder example for ${objectName}');
// More examples will be added in future updates.`
      ]
    }
  }

  const objectData = getObjectExamples(selectedObject)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <Code2 className="h-6 w-6 mr-2 text-blue-500" />
              {selectedObject}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{objectData.description}</p>
          </div>
          <div className="flex items-center space-x-3">
            <a
              href={getMDNLink(selectedObject)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-md transition-colors"
            >
              <Book className="h-4 w-4 mr-1" />
              MDN Docs
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {objectData.examples.map((example, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <Code2 className="h-4 w-4 mr-2 text-indigo-500" />
                Example {index + 1}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => runExample(example, index)}
                  disabled={runningExample === index}
                  className="flex items-center px-3 py-1.5 text-xs font-medium text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 rounded-md transition-colors disabled:opacity-50"
                >
                  <Play className="h-3 w-3 mr-1" />
                  {runningExample === index ? 'Running...' : 'Run'}
                </button>
                <button
                  onClick={() => copyToClipboard(example, index)}
                  className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-md transition-colors"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="p-4 bg-gray-900 dark:bg-gray-950 text-green-400 relative">
              <pre className="text-sm font-mono whitespace-pre-wrap overflow-x-auto leading-relaxed">
                {example}
              </pre>
              
              {/* Syntax highlighting hint */}
              <div className="absolute top-2 right-2 opacity-60">
                <div className="flex items-center text-xs text-gray-400">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-1"></div>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Additional Resources */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
            <Book className="h-4 w-4 mr-2" />
            Additional Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <a
              href={getMDNLink(selectedObject)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              MDN Documentation
            </a>
            <a
              href={`https://www.w3schools.com/jsref/jsref_${selectedObject.toLowerCase()}.asp`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              W3Schools Reference
            </a>
          </div>
          <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-md border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              💡 <strong>Tip:</strong> Click the &quot;Run&quot; button to execute examples in a safe environment. 
              Use the playground below to experiment with your own code variations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
