import ObjectPage from '../components/ObjectPage'

export default function ArrayPage() {
  return (
    <ObjectPage
      title="Array"
      description="Represents a list-like collection of values with powerful iteration and transformation methods"
      overview="The Array constructor creates Array objects. Arrays are list-like objects with numbered indices and a length property. JavaScript arrays are resizable and can contain a mix of different data types."
      syntax={`// === CREATING ARRAYS ===
// Array literal
const arr1 = [1, 2, 3, 4, 5];

// Array constructor
const arr2 = new Array(5); // Creates array with 5 empty slots
const arr3 = new Array(1, 2, 3); // Creates [1, 2, 3]

// Array.from() - creates array from iterable or array-like object
const arr4 = Array.from('hello'); // ['h', 'e', 'l', 'l', 'o']
const arr5 = Array.from([1, 2, 3], x => x * 2); // [2, 4, 6]
const arr6 = Array.from({length: 5}, (_, i) => i); // [0, 1, 2, 3, 4]

// Array.of() - creates array from arguments
const arr7 = Array.of(7); // [7] (unlike new Array(7))
const arr8 = Array.of(1, 2, 3); // [1, 2, 3]

// === ADDING/REMOVING ELEMENTS ===
const fruits = ['apple', 'banana'];

// push() - adds to end, returns new length
console.log(fruits.push('orange')); // 3
console.log(fruits); // ['apple', 'banana', 'orange']

// pop() - removes from end, returns removed element
console.log(fruits.pop()); // 'orange'

// unshift() - adds to beginning, returns new length
console.log(fruits.unshift('mango')); // 3

// shift() - removes from beginning, returns removed element
console.log(fruits.shift()); // 'mango'

// splice() - adds/removes elements at any position
const nums = [1, 2, 3, 4, 5];
nums.splice(2, 1, 99, 88); // At index 2, remove 1, add 99, 88
console.log(nums); // [1, 2, 99, 88, 4, 5]

// === SEARCHING ELEMENTS ===
const items = [1, 2, 3, 4, 3, 5];

// indexOf() - first index of element (or -1)
console.log(items.indexOf(3)); // 2

// lastIndexOf() - last index of element
console.log(items.lastIndexOf(3)); // 4

// includes() - checks if element exists
console.log(items.includes(3)); // true

// find() - first element matching condition
console.log(items.find(x => x > 3)); // 4

// findIndex() - index of first element matching condition
console.log(items.findIndex(x => x > 3)); // 3

// findLast() - last element matching condition
console.log(items.findLast(x => x < 4)); // 3

// findLastIndex() - index of last element matching condition
console.log(items.findLastIndex(x => x < 4)); // 4

// === ITERATION METHODS ===
const numbers = [1, 2, 3, 4, 5];

// forEach() - executes function for each element
numbers.forEach((num, index, array) => {
  console.log(\`Index \${index}: \${num}\`);
});

// map() - creates new array with transformed elements
const doubled = numbers.map(x => x * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// filter() - creates new array with elements passing test
const evens = numbers.filter(x => x % 2 === 0);
console.log(evens); // [2, 4]

// reduce() - reduces array to single value
const sum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log(sum); // 15

// reduceRight() - reduce from right to left
const reversed = numbers.reduceRight((acc, curr) => {
  acc.push(curr);
  return acc;
}, []);
console.log(reversed); // [5, 4, 3, 2, 1]

// === TESTING METHODS ===
const values = [2, 4, 6, 8];

// every() - tests if all elements pass test
console.log(values.every(x => x % 2 === 0)); // true

// some() - tests if at least one element passes test
console.log(values.some(x => x > 5)); // true

// === TRANSFORMATION METHODS ===
const arr = [1, 2, 3, 4, 5];

// slice() - returns shallow copy of portion
console.log(arr.slice(1, 4)); // [2, 3, 4]
console.log(arr.slice(-2)); // [4, 5]

// concat() - merges arrays
const arr9 = [1, 2];
const arr10 = [3, 4];
console.log(arr9.concat(arr10, [5, 6])); // [1, 2, 3, 4, 5, 6]

// join() - joins elements into string
console.log(['a', 'b', 'c'].join('-')); // 'a-b-c'

// reverse() - reverses array in place
const rev = [1, 2, 3];
rev.reverse();
console.log(rev); // [3, 2, 1]

// sort() - sorts array in place
const unsorted = [3, 1, 4, 1, 5];
unsorted.sort(); // Lexicographic sort
console.log(unsorted); // [1, 1, 3, 4, 5]

// Sort with compare function
unsorted.sort((a, b) => b - a); // Descending
console.log(unsorted); // [5, 4, 3, 1, 1]

// toReversed() - returns reversed copy (doesn't mutate)
const original = [1, 2, 3];
const reversedCopy = original.toReversed();
console.log(original); // [1, 2, 3] (unchanged)
console.log(reversedCopy); // [3, 2, 1]

// toSorted() - returns sorted copy (doesn't mutate)
const unsorted2 = [3, 1, 4];
const sortedCopy = unsorted2.toSorted();
console.log(unsorted2); // [3, 1, 4] (unchanged)
console.log(sortedCopy); // [1, 3, 4]

// toSpliced() - returns spliced copy (doesn't mutate)
const orig = [1, 2, 3, 4];
const spliced = orig.toSpliced(1, 2, 99);
console.log(orig); // [1, 2, 3, 4] (unchanged)
console.log(spliced); // [1, 99, 4]

// with() - returns copy with element changed at index
const arr11 = [1, 2, 3];
const updated = arr11.with(1, 99);
console.log(arr11); // [1, 2, 3] (unchanged)
console.log(updated); // [1, 99, 3]

// === FLATTENING METHODS ===
const nested = [1, [2, 3], [4, [5, 6]]];

// flat() - flattens nested arrays
console.log(nested.flat()); // [1, 2, 3, 4, [5, 6]]
console.log(nested.flat(2)); // [1, 2, 3, 4, 5, 6]
console.log(nested.flat(Infinity)); // Flatten all levels

// flatMap() - maps then flattens one level
const sentences = ["Hello World", "How are you"];
const words = sentences.flatMap(s => s.split(' '));
console.log(words); // ['Hello', 'World', 'How', 'are', 'you']

// === FILLING METHODS ===
const empty = new Array(5);

// fill() - fills array with static value
empty.fill(0);
console.log(empty); // [0, 0, 0, 0, 0]

const partial = [1, 2, 3, 4, 5];
partial.fill(9, 2, 4); // Fill with 9 from index 2 to 4
console.log(partial); // [1, 2, 9, 9, 5]

// copyWithin() - copies part of array to another location
const copy = [1, 2, 3, 4, 5];
copy.copyWithin(0, 3); // Copy from index 3 to index 0
console.log(copy); // [4, 5, 3, 4, 5]

// === CONVERSION METHODS ===
const mixed = [1, 'two', true, null];

// toString() - converts to string
console.log(mixed.toString()); // '1,two,true,'

// toLocaleString() - locale-aware string conversion
const prices = [1234.5, 6789.1];
console.log(prices.toLocaleString('en-US', {
  style: 'currency',
  currency: 'USD'
})); // '$1,234.50,$6,789.10'

// valueOf() - returns primitive value
console.log(mixed.valueOf()); // [1, 'two', true, null]

// === ITERATOR METHODS ===
const iter = ['a', 'b', 'c'];

// entries() - returns iterator of [index, value] pairs
for (const [index, value] of iter.entries()) {
  console.log(\`\${index}: \${value}\`);
}

// keys() - returns iterator of indices
for (const key of iter.keys()) {
  console.log(key); // 0, 1, 2
}

// values() - returns iterator of values
for (const value of iter.values()) {
  console.log(value); // 'a', 'b', 'c'
}

// === STATIC METHODS ===
// Array.isArray() - checks if value is array
console.log(Array.isArray([1, 2, 3])); // true
console.log(Array.isArray('hello')); // false
console.log(Array.isArray({length: 3})); // false

// === GROUPING METHODS (Stage 3 Proposal) ===
// Note: May need polyfill in some environments
const people = [
  {name: 'Alice', age: 25},
  {name: 'Bob', age: 30},
  {name: 'Charlie', age: 25}
];

// group() - groups elements by key (when available)
// const grouped = people.group(person => person.age);
// console.log(grouped);
// { 25: [{name: 'Alice', age: 25}, {name: 'Charlie', age: 25}],
//   30: [{name: 'Bob', age: 30}] }

// === ADVANCED PATTERNS ===
// Array destructuring with rest
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first, second, rest); // 1 2 [3, 4, 5]

// Spread operator
const spread1 = [1, 2, 3];
const spread2 = [4, 5, 6];
const combined = [...spread1, ...spread2];
console.log(combined); // [1, 2, 3, 4, 5, 6]

// Array-like to Array conversion
function convertArguments() {
  const args = Array.from(arguments);
  return args.map(x => x * 2);
}
console.log(convertArguments(1, 2, 3)); // [2, 4, 6]`}
      complexity="beginner"
      relatedObjects={['Object', 'String', 'Number', 'Set', 'Map']}
      browserSupport="Array is supported in all JavaScript environments and browsers."
      useCases={[
        "Data collections and lists management",
        "Iterating and transforming data sequences",
        "Functional programming with map/filter/reduce",
        "Queue and stack implementations",
        "Matrix and multi-dimensional data structures",
        "Sorting and searching operations",
        "Data aggregation and grouping",
        "Temporary data storage and manipulation"
      ]}
      examples={[
        {
          id: "array-transformation-pipeline",
          title: "Array Transformation Pipeline",
          description: "Chain multiple array methods to transform data efficiently",
          difficulty: 'intermediate',
          tags: ['functional', 'transformation', 'chaining'],
          code: `const sales = [\n  { product: 'Laptop', price: 999, quantity: 2, category: 'Electronics' },\n  { product: 'Mouse', price: 25, quantity: 10, category: 'Electronics' },\n  { product: 'Book', price: 15, quantity: 5, category: 'Education' },\n  { product: 'Desk', price: 200, quantity: 1, category: 'Furniture' }\n]\n\n// Transform data pipeline: filter > map > reduce\nconst result = sales\n  .filter(item => item.category === 'Electronics')  // Only electronics\n  .map(item => ({\n    ...item,\n    total: item.price * item.quantity,\n    discounted: item.price * item.quantity * 0.9\n  }))\n  .reduce((acc, item) => {\n    acc.totalSales += item.total\n    acc.discountedSales += item.discounted\n    acc.items.push(item)\n    return acc\n  }, { totalSales: 0, discountedSales: 0, items: [] })\n\nconsole.log(result)\n// { totalSales: 2248, discountedSales: 2023.2, items: [...] }`
        },
        {
          id: "array-sorting-grouping",
          title: "Advanced Array Sorting and Grouping",
          description: "Sort arrays by multiple criteria and group data dynamically",
          difficulty: 'advanced',
          tags: ['sorting', 'grouping', 'algorithms'],
          code: `const employees = [\n  { name: 'Alice', department: 'Engineering', salary: 90000, experience: 3 },\n  { name: 'Bob', department: 'Marketing', salary: 65000, experience: 2 },\n  { name: 'Charlie', department: 'Engineering', salary: 85000, experience: 5 },\n  { name: 'Diana', department: 'Marketing', salary: 70000, experience: 4 }\n]\n\n// Multi-criteria sorting: department (asc), then salary (desc)\nconst sorted = employees.toSorted((a, b) => {\n  if (a.department !== b.department) {\n    return a.department.localeCompare(b.department)\n  }\n  return b.salary - a.salary\n})\n\n// Group by department using reduce\nconst grouped = employees.reduce((groups, emp) => {\n  const dept = emp.department\n  if (!groups[dept]) {\n    groups[dept] = []\n  }\n  groups[dept].push(emp)\n  return groups\n}, {})\n\nconsole.log('Sorted:', sorted)\nconsole.log('Grouped:', grouped)`
        },
        {
          id: "array-performance-optimization",
          title: "Array Performance Optimization",
          description: "Optimize array operations for large datasets and performance",
          difficulty: 'advanced',
          tags: ['performance', 'optimization', 'large-data'],
          code: `// Performance comparison: for-loop vs array methods\nconst largeArray = Array.from({ length: 1000000 }, (_, i) => i)\n\n// Fast: Traditional for loop\nfunction sumWithLoop(arr) {\n  let sum = 0\n  for (let i = 0; i < arr.length; i++) {\n    sum += arr[i]\n  }\n  return sum\n}\n\n// Slower but readable: Array.reduce\nfunction sumWithReduce(arr) {\n  return arr.reduce((sum, num) => sum + num, 0)\n}\n\n// Memory-efficient: process in chunks\nfunction processInChunks(arr, chunkSize, processor) {\n  const results = []\n  for (let i = 0; i < arr.length; i += chunkSize) {\n    const chunk = arr.slice(i, i + chunkSize)\n    results.push(processor(chunk))\n  }\n  return results\n}\n\n// Use case: process 1M items in chunks of 10k\nconst chunkResults = processInChunks(\n  largeArray, \n  10000, \n  chunk => chunk.reduce((sum, n) => sum + n, 0)\n)\n\nconsole.log('Chunk sums:', chunkResults.slice(0, 3)) // First 3 chunks`
        }
      ]}
    />
  )
}
