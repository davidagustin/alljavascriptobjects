import ObjectPage from '../components/ObjectPage'

export default function MapPage() {
  return (
    <ObjectPage
      title="Map"
      description="Represents a collection of key-value pairs"
      overview="The Map constructor creates Map objects. Maps are collections of key-value pairs where keys can be any value."
      syntax={`// ============ CONSTRUCTOR ============
// Empty Map
const map1 = new Map();
console.log('Empty map:', map1); // Map(0) {}

// Map from array of entries
const map2 = new Map([
  ['name', 'Alice'],
  ['age', 30],
  ['city', 'New York']
]);
console.log('From entries:', map2); // Map(3) {'name' => 'Alice', ...}

// Map from another Map
const map3 = new Map(map2);
console.log('Copy of map:', map3); // Map(3) {'name' => 'Alice', ...}

// Map from any iterable of key-value pairs
const map4 = new Map(Object.entries({ a: 1, b: 2, c: 3 }));
console.log('From object entries:', map4); // Map(3) {'a' => 1, ...}

// ============ PROPERTIES ============
const propMap = new Map([['a', 1], ['b', 2], ['c', 3]]);

// size property
console.log('Size:', propMap.size); // 3

// Map.prototype[Symbol.toStringTag]
console.log('ToString tag:', Map.prototype[Symbol.toStringTag]); // 'Map'

// ============ INSTANCE METHODS ============

// set(key, value) - adds or updates entry, returns the Map
const setMap = new Map();
setMap.set('string', 'Hello');
setMap.set(42, 'Number key');
setMap.set(true, 'Boolean key');
setMap.set({ id: 1 }, 'Object key');
setMap.set(Symbol('sym'), 'Symbol key');
setMap.set(null, 'Null key');
setMap.set(undefined, 'Undefined key');
setMap.set(NaN, 'NaN key');

// Chaining set() calls
setMap
  .set('chain1', 'first')
  .set('chain2', 'second')
  .set('chain3', 'third');

console.log('After sets:', setMap.size); // 11

// get(key) - retrieves value for key
console.log('Get string:', setMap.get('string')); // 'Hello'
console.log('Get number:', setMap.get(42)); // 'Number key'
console.log('Get boolean:', setMap.get(true)); // 'Boolean key'
console.log('Get NaN:', setMap.get(NaN)); // 'NaN key' (NaN === NaN in Map)
console.log('Get missing:', setMap.get('missing')); // undefined

// has(key) - checks if key exists
console.log('Has string:', setMap.has('string')); // true
console.log('Has 42:', setMap.has(42)); // true
console.log('Has missing:', setMap.has('missing')); // false

// delete(key) - removes entry, returns boolean
console.log('Delete result:', setMap.delete('string')); // true
console.log('Delete missing:', setMap.delete('missing')); // false
console.log('Size after delete:', setMap.size); // 10

// clear() - removes all entries
const clearMap = new Map([['a', 1], ['b', 2]]);
clearMap.clear();
console.log('After clear:', clearMap.size); // 0

// ============ ITERATION METHODS ============
const iterMap = new Map([
  ['first', 1],
  ['second', 2],
  ['third', 3],
  ['fourth', 4]
]);

// keys() - returns iterator of keys
console.log('Keys:');
for (const key of iterMap.keys()) {
  console.log('  Key:', key);
}

// values() - returns iterator of values
console.log('Values:');
for (const value of iterMap.values()) {
  console.log('  Value:', value);
}

// entries() - returns iterator of [key, value] pairs
console.log('Entries:');
for (const [key, value] of iterMap.entries()) {
  console.log(\`  [\${key}]: \${value}\`);
}

// forEach(callback, thisArg) - executes callback for each entry
console.log('ForEach:');
iterMap.forEach((value, key, map) => {
  console.log(\`  \${key} => \${value} (map size: \${map.size})\`);
});

// forEach with thisArg
const context = { prefix: '>' };
iterMap.forEach(function(value, key) {
  console.log(\`\${this.prefix} \${key}: \${value}\`);
}, context);

// Map is directly iterable (uses entries() by default)
console.log('Direct iteration:');
for (const [key, value] of iterMap) {
  console.log(\`  \${key} = \${value}\`);
}

// Destructuring with Maps
const [[firstKey, firstValue], ...rest] = iterMap;
console.log('First entry:', firstKey, firstValue); // 'first', 1
console.log('Rest entries:', rest); // [['second', 2], ['third', 3], ['fourth', 4]]

// ============ KEY EQUALITY ============
const keyMap = new Map();

// Object keys are compared by reference
const obj1 = { id: 1 };
const obj2 = { id: 1 };
keyMap.set(obj1, 'Object 1');
keyMap.set(obj2, 'Object 2');
console.log('Same content, different objects:', keyMap.size); // 2
console.log('Get obj1:', keyMap.get(obj1)); // 'Object 1'
console.log('Get obj2:', keyMap.get(obj2)); // 'Object 2'

// NaN is considered equal to itself in Map
keyMap.set(NaN, 'Not a Number 1');
keyMap.set(NaN, 'Not a Number 2'); // Overwrites previous
console.log('NaN equality:', keyMap.get(NaN)); // 'Not a Number 2'

// +0 and -0 are considered equal
keyMap.set(+0, 'Positive zero');
keyMap.set(-0, 'Negative zero'); // Overwrites
console.log('Zero equality:', keyMap.get(0)); // 'Negative zero'

// ============ CONVERSION METHODS ============
const convMap = new Map([
  ['name', 'Bob'],
  ['age', 25],
  ['city', 'Paris']
]);

// Convert to Array
const mapToArray = Array.from(convMap);
console.log('To array:', mapToArray); // [['name', 'Bob'], ['age', 25], ['city', 'Paris']]

// Convert to Array using spread
const mapSpread = [...convMap];
console.log('Spread to array:', mapSpread);

// Convert keys to Array
const keysArray = [...convMap.keys()];
console.log('Keys array:', keysArray); // ['name', 'age', 'city']

// Convert values to Array
const valuesArray = [...convMap.values()];
console.log('Values array:', valuesArray); // ['Bob', 25, 'Paris']

// Convert to Object (for string/symbol keys only)
const mapToObject = Object.fromEntries(convMap);
console.log('To object:', mapToObject); // {name: 'Bob', age: 25, city: 'Paris'}

// ============ PRACTICAL PATTERNS ============

// 1. Frequency counter
function countFrequency(items) {
  const freq = new Map();
  for (const item of items) {
    freq.set(item, (freq.get(item) || 0) + 1);
  }
  return freq;
}

const frequencies = countFrequency(['a', 'b', 'a', 'c', 'b', 'a']);
console.log('Frequencies:', frequencies); // Map {'a' => 3, 'b' => 2, 'c' => 1}

// 2. Caching/Memoization
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log('Cache hit:', key);
      return cache.get(key);
    }
    console.log('Cache miss:', key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensiveOperation = memoize((n) => {
  console.log('Computing...');
  return n * n;
});

console.log(expensiveOperation(5)); // Computing... 25
console.log(expensiveOperation(5)); // Cache hit... 25

// 3. Grouping data
function groupBy(items, keyFn) {
  const groups = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(item);
  }
  return groups;
}

const people = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 25 },
  { name: 'David', age: 30 }
];

const byAge = groupBy(people, p => p.age);
console.log('Grouped by age:', byAge);
// Map { 25 => [{name: 'Alice', age: 25}, {name: 'Charlie', age: 25}], ... }

// 4. LRU Cache implementation
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  
  get(key) {
    if (!this.cache.has(key)) return undefined;
    
    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  
  set(key, value) {
    // Remove key if exists (to update position)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    // Check capacity
    if (this.cache.size >= this.capacity) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    // Add to end (most recently used)
    this.cache.set(key, value);
  }
}

const lru = new LRUCache(3);
lru.set('a', 1);
lru.set('b', 2);
lru.set('c', 3);
lru.set('d', 4); // Evicts 'a'
console.log('LRU get b:', lru.get('b')); // 2
lru.set('e', 5); // Evicts 'c'

// 5. Private data storage
const privateData = new Map();

class Person {
  constructor(name) {
    privateData.set(this, { name, id: Math.random() });
  }
  
  getName() {
    return privateData.get(this).name;
  }
  
  getId() {
    return privateData.get(this).id;
  }
}

const person = new Person('Alice');
console.log('Person name:', person.getName());
console.log('Person ID:', person.getId());

// ============ MAP vs OBJECT ============
// Map advantages:
// - Any value as key (objects, primitives, functions)
// - Maintains insertion order
// - Direct size property
// - Better performance for frequent additions/deletions
// - Clean iteration with for...of

// Object advantages:
// - Literal syntax {}
// - Direct property access with dot notation
// - JSON serialization support
// - Prototype chain

// Performance comparison example
const mapPerf = new Map();
const objPerf = {};

// Adding entries
console.time('Map set');
for (let i = 0; i < 10000; i++) {
  mapPerf.set(\`key\${i}\`, i);
}
console.timeEnd('Map set');

console.time('Object assign');
for (let i = 0; i < 10000; i++) {
  objPerf[\`key\${i}\`] = i;
}
console.timeEnd('Object assign');

// Map preserves insertion order
const orderMap = new Map();
orderMap.set('z', 26);
orderMap.set('a', 1);
orderMap.set('m', 13);
console.log('Map order:', [...orderMap.keys()]); // ['z', 'a', 'm']`}
      useCases={[
        "Key-value data storage",
        "Caching and memoization",
        "Object property mapping",
        "Data transformation"
      ]}
    />
  )
}
