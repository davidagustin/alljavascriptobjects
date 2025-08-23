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
    />
  )
}
