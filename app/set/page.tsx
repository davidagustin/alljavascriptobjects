import ObjectPage from '../components/ObjectPage'

export default function SetPage() {
  return (
    <ObjectPage
      title="Set"
      description="Represents a collection of unique values"
      overview="The Set constructor creates Set objects. Sets are collections of unique values where each value can occur only once."
      syntax={`// ============ CONSTRUCTOR ============
// Empty Set
const set1 = new Set();
console.log('Empty set:', set1); // Set(0) {}

// Set from array (duplicates removed)
const set2 = new Set([1, 2, 3, 3, 4, 4, 5]);
console.log('From array:', set2); // Set(5) {1, 2, 3, 4, 5}

// Set from string (each character)
const set3 = new Set('hello');
console.log('From string:', set3); // Set(4) {'h', 'e', 'l', 'o'}

// Set from another Set
const set4 = new Set(set2);
console.log('Copy of set:', set4); // Set(5) {1, 2, 3, 4, 5}

// Set from any iterable
const set5 = new Set(new Map([['a', 1], ['b', 2]]).keys());
console.log('From Map keys:', set5); // Set(2) {'a', 'b'}

// ============ PROPERTIES ============
const propSet = new Set([1, 2, 3, 4, 5]);

// size property
console.log('Size:', propSet.size); // 5

// Set.prototype[Symbol.toStringTag]
console.log('ToString tag:', Set.prototype[Symbol.toStringTag]); // 'Set'

// Set.prototype[Symbol.species]
console.log('Species:', Set.prototype[Symbol.species]); // Set constructor

// ============ INSTANCE METHODS ============

// add(value) - adds value, returns the Set
const addSet = new Set();
addSet.add(1);
addSet.add('string');
addSet.add(true);
addSet.add({ id: 1 });
addSet.add([1, 2, 3]);
addSet.add(null);
addSet.add(undefined);
addSet.add(NaN);

// Chaining add() calls
addSet
  .add('chain1')
  .add('chain2')
  .add('chain3');

console.log('After adds:', addSet.size); // 11

// Adding duplicates has no effect
addSet.add(1);
addSet.add('string');
console.log('After duplicate adds:', addSet.size); // Still 11

// has(value) - checks if value exists
console.log('Has 1:', addSet.has(1)); // true
console.log('Has "string":', addSet.has('string')); // true
console.log('Has NaN:', addSet.has(NaN)); // true (NaN === NaN in Set)
console.log('Has missing:', addSet.has('missing')); // false

// delete(value) - removes value, returns boolean
console.log('Delete 1:', addSet.delete(1)); // true
console.log('Delete missing:', addSet.delete('missing')); // false
console.log('Size after delete:', addSet.size); // 10

// clear() - removes all values
const clearSet = new Set([1, 2, 3]);
clearSet.clear();
console.log('After clear:', clearSet.size); // 0

// ============ ITERATION METHODS ============
const iterSet = new Set(['first', 'second', 'third', 'fourth']);

// values() - returns iterator of values
console.log('Values:');
for (const value of iterSet.values()) {
  console.log('  Value:', value);
}

// keys() - same as values() for Set
console.log('Keys (same as values):');
for (const key of iterSet.keys()) {
  console.log('  Key:', key);
}

// entries() - returns iterator of [value, value] pairs
console.log('Entries:');
for (const [value1, value2] of iterSet.entries()) {
  console.log(\`  [\${value1}, \${value2}]\`); // Both are the same
}

// forEach(callback, thisArg) - executes callback for each value
console.log('ForEach:');
iterSet.forEach((value, value2, set) => {
  console.log(\`  \${value} (size: \${set.size})\`);
});

// forEach with thisArg
const context = { prefix: '>' };
iterSet.forEach(function(value) {
  console.log(\`\${this.prefix} \${value}\`);
}, context);

// Set is directly iterable (uses values() by default)
console.log('Direct iteration:');
for (const value of iterSet) {
  console.log('  ', value);
}

// Destructuring with Sets
const [first, second, ...rest] = iterSet;
console.log('First:', first); // 'first'
console.log('Second:', second); // 'second'
console.log('Rest:', rest); // ['third', 'fourth']

// ============ VALUE EQUALITY ============
const equalSet = new Set();

// Object values are compared by reference
const obj1 = { id: 1 };
const obj2 = { id: 1 };
equalSet.add(obj1);
equalSet.add(obj2);
console.log('Same content, different objects:', equalSet.size); // 2

// NaN is considered equal to itself in Set
equalSet.add(NaN);
equalSet.add(NaN); // Not added (duplicate)
console.log('NaN equality:', equalSet.has(NaN)); // true
console.log('Size after NaN:', equalSet.size); // 3

// +0 and -0 are considered equal
equalSet.add(+0);
equalSet.add(-0); // Not added (duplicate)
console.log('Zero equality:', equalSet.has(0)); // true

// ============ CONVERSION METHODS ============
const convSet = new Set(['a', 'b', 'c', 'd']);

// Convert to Array using Array.from()
const setToArray1 = Array.from(convSet);
console.log('Array.from():', setToArray1); // ['a', 'b', 'c', 'd']

// Convert to Array using spread
const setToArray2 = [...convSet];
console.log('Spread to array:', setToArray2); // ['a', 'b', 'c', 'd']

// Convert to string
const setString = [...convSet].join(', ');
console.log('To string:', setString); // 'a, b, c, d'

// ============ SET OPERATIONS ============
const setA = new Set([1, 2, 3, 4, 5]);
const setB = new Set([4, 5, 6, 7, 8]);

// Union (A ∪ B) - all unique elements from both sets
const union = new Set([...setA, ...setB]);
console.log('Union:', union); // Set {1, 2, 3, 4, 5, 6, 7, 8}

// Intersection (A ∩ B) - elements in both sets
const intersection = new Set([...setA].filter(x => setB.has(x)));
console.log('Intersection:', intersection); // Set {4, 5}

// Difference (A - B) - elements in A but not in B
const difference = new Set([...setA].filter(x => !setB.has(x)));
console.log('Difference A-B:', difference); // Set {1, 2, 3}

// Symmetric Difference (A △ B) - elements in either but not both
const symmetricDiff = new Set([
  ...[...setA].filter(x => !setB.has(x)),
  ...[...setB].filter(x => !setA.has(x))
]);
console.log('Symmetric difference:', symmetricDiff); // Set {1, 2, 3, 6, 7, 8}

// Subset check - is A a subset of B?
function isSubset(subset, superset) {
  for (const elem of subset) {
    if (!superset.has(elem)) return false;
  }
  return true;
}

const setC = new Set([2, 3]);
console.log('Is C subset of A?', isSubset(setC, setA)); // true
console.log('Is A subset of B?', isSubset(setA, setB)); // false

// Superset check - is A a superset of B?
function isSuperset(superset, subset) {
  return isSubset(subset, superset);
}

console.log('Is A superset of C?', isSuperset(setA, setC)); // true

// ============ PRACTICAL PATTERNS ============

// 1. Remove duplicates from array
function uniqueArray(arr) {
  return [...new Set(arr)];
}

const duplicates = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4];
console.log('Unique:', uniqueArray(duplicates)); // [1, 2, 3, 4]

// 2. Check for common elements
function hasCommon(arr1, arr2) {
  const set1 = new Set(arr1);
  return arr2.some(x => set1.has(x));
}

console.log('Has common:', hasCommon([1, 2, 3], [4, 5, 6])); // false
console.log('Has common:', hasCommon([1, 2, 3], [3, 4, 5])); // true

// 3. Track unique visitors/items
class UniqueTracker {
  constructor() {
    this.items = new Set();
  }
  
  track(item) {
    const isNew = !this.items.has(item);
    this.items.add(item);
    return isNew;
  }
  
  getCount() {
    return this.items.size;
  }
  
  getItems() {
    return [...this.items];
  }
}

const tracker = new UniqueTracker();
console.log('Track A:', tracker.track('userA')); // true (new)
console.log('Track B:', tracker.track('userB')); // true (new)
console.log('Track A again:', tracker.track('userA')); // false (existing)
console.log('Unique count:', tracker.getCount()); // 2

// 4. Filter unique by property
function uniqueBy(arr, keyFn) {
  const seen = new Set();
  return arr.filter(item => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 1, name: 'Alice Duplicate' },
  { id: 3, name: 'Charlie' }
];

const uniqueUsers = uniqueBy(users, u => u.id);
console.log('Unique users:', uniqueUsers);
// [{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}, {id: 3, name: 'Charlie'}]

// 5. Implement a simple event system
class EventEmitter {
  constructor() {
    this.events = new Map();
  }
  
  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(listener);
  }
  
  off(event, listener) {
    if (this.events.has(event)) {
      this.events.get(event).delete(listener);
    }
  }
  
  emit(event, ...args) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(listener => {
        listener(...args);
      });
    }
  }
}

const emitter = new EventEmitter();
const handler1 = (data) => console.log('Handler 1:', data);
const handler2 = (data) => console.log('Handler 2:', data);

emitter.on('test', handler1);
emitter.on('test', handler2);
emitter.emit('test', 'Hello'); // Both handlers called

emitter.off('test', handler1);
emitter.emit('test', 'World'); // Only handler2 called

// 6. Set-based cache with size limit
class SetCache {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.cache = new Set();
  }
  
  add(item) {
    // Remove item if it exists (to re-add at end)
    this.cache.delete(item);
    
    // Check size limit
    if (this.cache.size >= this.maxSize) {
      // Remove oldest (first) item
      const first = this.cache.values().next().value;
      this.cache.delete(first);
    }
    
    this.cache.add(item);
  }
  
  has(item) {
    return this.cache.has(item);
  }
}

const cache = new SetCache(3);
cache.add('a');
cache.add('b');
cache.add('c');
cache.add('d'); // 'a' is evicted
console.log('Has a:', cache.has('a')); // false
console.log('Has d:', cache.has('d')); // true

// ============ SET vs ARRAY ============
// Set advantages:
// - O(1) has() vs O(n) includes()
// - Automatic duplicate prevention
// - Clear semantic meaning for unique collections
// - Better for frequent additions/deletions

// Array advantages:
// - Index-based access
// - More built-in methods (map, filter, reduce, etc.)
// - JSON serialization support
// - Ordered operations

// Performance comparison
const perfSet = new Set();
const perfArray = [];

console.time('Set add');
for (let i = 0; i < 10000; i++) {
  perfSet.add(i);
}
console.timeEnd('Set add');

console.time('Array push');
for (let i = 0; i < 10000; i++) {
  if (!perfArray.includes(i)) { // Check for uniqueness
    perfArray.push(i);
  }
}
console.timeEnd('Array push');

// Checking membership
const testValue = 5000;
console.time('Set has');
for (let i = 0; i < 1000; i++) {
  perfSet.has(testValue);
}
console.timeEnd('Set has');

console.time('Array includes');
for (let i = 0; i < 1000; i++) {
  perfArray.includes(testValue);
}
console.timeEnd('Array includes');`}
      useCases={[
        "Unique value collections",
        "Duplicate removal",
        "Set operations",
        "Data deduplication"
      ]}
    />
  )
}
