import ObjectPage from '../components/ObjectPage'

export default function IteratorPage() {
  return (
    <ObjectPage
      title="Iterator"
      description="The Iterator protocol defines a standard way to produce a sequence of values"
      overview="Iterator is a protocol that allows objects to define their iteration behavior, such as what values are looped over in a for...of construct. Objects implementing the Iterator protocol have a next() method that returns an object with value and done properties. This enables custom iteration logic, lazy evaluation, and creation of iterable data structures. Built-in iterables include Array, String, Map, Set, and more."
      syntax={`// === ITERATOR PROTOCOL ===
// An Iterator must have a next() method that returns { value, done }

// Basic Iterator implementation
const basicIterator = {
  current: 0,
  last: 5,
  
  next() {
    if (this.current <= this.last) {
      return { value: this.current++, done: false };
    }
    return { done: true };
  }
};

// Making an object iterable
const iterableNumbers = {
  start: 1,
  end: 10,
  
  [Symbol.iterator]() {
    let current = this.start;
    const last = this.end;
    
    return {
      next() {
        if (current <= last) {
          return { value: current++, done: false };
        }
        return { done: true };
      }
    };
  }
};

// Using for...of with custom iterator
for (const num of iterableNumbers) {
  console.log(num); // 1, 2, 3, ..., 10
}

// Manual iteration
const iterator = iterableNumbers[Symbol.iterator]();
console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }

// === GENERATOR FUNCTIONS ===
// Generators automatically implement Iterator protocol
function* numberGenerator(max) {
  for (let i = 0; i < max; i++) {
    yield i;
  }
}

// Using generator
const gen = numberGenerator(5);
for (const value of gen) {
  console.log(value); // 0, 1, 2, 3, 4
}

// Manual generator iteration
const gen2 = numberGenerator(3);
console.log(gen2.next()); // { value: 0, done: false }
console.log(gen2.next()); // { value: 1, done: false }
console.log(gen2.next()); // { value: 2, done: false }
console.log(gen2.next()); // { done: true }

// === RANGE ITERATOR ===
class Range {
  constructor(start, end, step = 1) {
    this.start = start;
    this.end = end;
    this.step = step;
  }
  
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    const step = this.step;
    
    return {
      next() {
        if ((step > 0 && current < end) || (step < 0 && current > end)) {
          const value = current;
          current += step;
          return { value, done: false };
        }
        return { done: true };
      }
    };
  }
  
  // Helper methods
  toArray() {
    return Array.from(this);
  }
  
  map(fn) {
    const result = [];
    for (const value of this) {
      result.push(fn(value));
    }
    return result;
  }
  
  filter(predicate) {
    const result = [];
    for (const value of this) {
      if (predicate(value)) {
        result.push(value);
      }
    }
    return result;
  }
}

// Using Range
const range1 = new Range(1, 10);
console.log('Range 1-10:', range1.toArray()); // [1, 2, 3, ..., 9]

const range2 = new Range(0, 20, 3);
console.log('Range 0-20 step 3:', range2.toArray()); // [0, 3, 6, 9, 12, 15, 18]

const range3 = new Range(10, 0, -2);
console.log('Range 10-0 step -2:', range3.toArray()); // [10, 8, 6, 4, 2]

// Using Range methods
const squares = range1.map(x => x * x);
console.log('Squares:', squares); // [1, 4, 9, 16, 25, 36, 49, 64, 81]

const evens = range1.filter(x => x % 2 === 0);
console.log('Evens:', evens); // [2, 4, 6, 8]

// === FIBONACCI ITERATOR ===
class FibonacciIterator {
  constructor(max = Infinity) {
    this.max = max;
  }
  
  [Symbol.iterator]() {
    let previous = 0;
    let current = 1;
    let count = 0;
    const max = this.max;
    
    return {
      next() {
        if (count >= max) {
          return { done: true };
        }
        
        const value = previous;
        const next = previous + current;
        previous = current;
        current = next;
        count++;
        
        return { value, done: false };
      }
    };
  }
}

// Using Fibonacci Iterator
const fib = new FibonacciIterator(10);
console.log('First 10 Fibonacci numbers:');
for (const num of fib) {
  console.log(num); // 0, 1, 1, 2, 3, 5, 8, 13, 21, 34
}

// === LINKED LIST ITERATOR ===
class LinkedListNode {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }
  
  add(data) {
    const node = new LinkedListNode(data);
    if (!this.head) {
      this.head = node;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = node;
    }
    this.size++;
  }
  
  [Symbol.iterator]() {
    let current = this.head;
    
    return {
      next() {
        if (current) {
          const value = current.data;
          current = current.next;
          return { value, done: false };
        }
        return { done: true };
      }
    };
  }
  
  // Reverse iterator
  reverseIterator() {
    const values = [];
    for (const value of this) {
      values.push(value);
    }
    values.reverse();
    
    let index = 0;
    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        if (index < values.length) {
          return { value: values[index++], done: false };
        }
        return { done: true };
      }
    };
  }
}

// Using LinkedList Iterator
const list = new LinkedList();
list.add('first');
list.add('second');
list.add('third');
list.add('fourth');

console.log('Forward iteration:');
for (const item of list) {
  console.log(item); // first, second, third, fourth
}

console.log('Reverse iteration:');
for (const item of list.reverseIterator()) {
  console.log(item); // fourth, third, second, first
}

// === TREE ITERATOR (Depth-First) ===
class TreeNode {
  constructor(value) {
    this.value = value;
    this.children = [];
  }
  
  addChild(value) {
    const child = new TreeNode(value);
    this.children.push(child);
    return child;
  }
  
  // Depth-first traversal iterator
  [Symbol.iterator]() {
    const stack = [this];
    
    return {
      next() {
        if (stack.length > 0) {
          const node = stack.pop();
          // Add children in reverse order for left-to-right traversal
          for (let i = node.children.length - 1; i >= 0; i--) {
            stack.push(node.children[i]);
          }
          return { value: node.value, done: false };
        }
        return { done: true };
      }
    };
  }
  
  // Breadth-first traversal iterator
  breadthFirstIterator() {
    const queue = [this];
    
    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        if (queue.length > 0) {
          const node = queue.shift();
          // Add children to end of queue
          queue.push(...node.children);
          return { value: node.value, done: false };
        }
        return { done: true };
      }
    };
  }
}

// Using Tree Iterator
const root = new TreeNode('root');
const child1 = root.addChild('child1');
const child2 = root.addChild('child2');
child1.addChild('grandchild1');
child1.addChild('grandchild2');
child2.addChild('grandchild3');

console.log('Depth-first traversal:');
for (const value of root) {
  console.log(value); // root, child1, grandchild1, grandchild2, child2, grandchild3
}

console.log('Breadth-first traversal:');
for (const value of root.breadthFirstIterator()) {
  console.log(value); // root, child1, child2, grandchild1, grandchild2, grandchild3
}

// === ITERATOR COMBINATORS ===
class IteratorCombinators {
  // Map iterator values
  static map(iterable, fn) {
    return {
      [Symbol.iterator]() {
        const iterator = iterable[Symbol.iterator]();
        let index = 0;
        
        return {
          next() {
            const result = iterator.next();
            if (result.done) {
              return result;
            }
            return { value: fn(result.value, index++), done: false };
          }
        };
      }
    };
  }
  
  // Filter iterator values
  static filter(iterable, predicate) {
    return {
      [Symbol.iterator]() {
        const iterator = iterable[Symbol.iterator]();
        let index = 0;
        
        return {
          next() {
            while (true) {
              const result = iterator.next();
              if (result.done) {
                return result;
              }
              if (predicate(result.value, index++)) {
                return result;
              }
            }
          }
        };
      }
    };
  }
  
  // Take first n values
  static take(iterable, n) {
    return {
      [Symbol.iterator]() {
        const iterator = iterable[Symbol.iterator]();
        let count = 0;
        
        return {
          next() {
            if (count >= n) {
              return { done: true };
            }
            count++;
            return iterator.next();
          }
        };
      }
    };
  }
  
  // Skip first n values
  static skip(iterable, n) {
    return {
      [Symbol.iterator]() {
        const iterator = iterable[Symbol.iterator]();
        let skipped = 0;
        
        // Skip first n values
        while (skipped < n) {
          const result = iterator.next();
          if (result.done) {
            return iterator;
          }
          skipped++;
        }
        
        return iterator;
      }
    };
  }
  
  // Chain multiple iterables
  static chain(...iterables) {
    return {
      [Symbol.iterator]() {
        let currentIndex = 0;
        let currentIterator = iterables[currentIndex][Symbol.iterator]();
        
        return {
          next() {
            while (currentIndex < iterables.length) {
              const result = currentIterator.next();
              if (!result.done) {
                return result;
              }
              currentIndex++;
              if (currentIndex < iterables.length) {
                currentIterator = iterables[currentIndex][Symbol.iterator]();
              }
            }
            return { done: true };
          }
        };
      }
    };
  }
  
  // Zip multiple iterables
  static zip(...iterables) {
    return {
      [Symbol.iterator]() {
        const iterators = iterables.map(it => it[Symbol.iterator]());
        
        return {
          next() {
            const results = iterators.map(it => it.next());
            if (results.some(r => r.done)) {
              return { done: true };
            }
            return { value: results.map(r => r.value), done: false };
          }
        };
      }
    };
  }
  
  // Enumerate (add index)
  static enumerate(iterable) {
    return {
      [Symbol.iterator]() {
        const iterator = iterable[Symbol.iterator]();
        let index = 0;
        
        return {
          next() {
            const result = iterator.next();
            if (result.done) {
              return result;
            }
            return { value: [index++, result.value], done: false };
          }
        };
      }
    };
  }
}

// Using Iterator Combinators
const range = new Range(1, 20);

// Map example
const doubled = IteratorCombinators.map(range, x => x * 2);
console.log('Doubled:', Array.from(doubled)); // [2, 4, 6, 8, ...]

// Filter example
const evenRange = IteratorCombinators.filter(range, x => x % 2 === 0);
console.log('Even numbers:', Array.from(evenRange)); // [2, 4, 6, 8, 10, 12, 14, 16, 18]

// Take example
const firstFive = IteratorCombinators.take(range, 5);
console.log('First 5:', Array.from(firstFive)); // [1, 2, 3, 4, 5]

// Skip example
const skipFive = IteratorCombinators.skip(range, 5);
console.log('Skip first 5:', Array.from(skipFive)); // [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]

// Chain example
const range1_3 = new Range(1, 4);
const range7_10 = new Range(7, 11);
const chained = IteratorCombinators.chain(range1_3, range7_10);
console.log('Chained ranges:', Array.from(chained)); // [1, 2, 3, 7, 8, 9, 10]

// Zip example
const letters = ['a', 'b', 'c', 'd', 'e'];
const numbers = new Range(1, 6);
const zipped = IteratorCombinators.zip(letters, numbers);
console.log('Zipped:');
for (const [letter, number] of zipped) {
  console.log(\`\${letter}: \${number}\`); // a: 1, b: 2, c: 3, d: 4, e: 5
}

// Enumerate example
const fruits = ['apple', 'banana', 'cherry'];
const enumerated = IteratorCombinators.enumerate(fruits);
console.log('Enumerated:');
for (const [index, fruit] of enumerated) {
  console.log(\`\${index}: \${fruit}\`); // 0: apple, 1: banana, 2: cherry
}

// === INFINITE ITERATORS ===
function* infiniteNumbers(start = 0) {
  let current = start;
  while (true) {
    yield current++;
  }
}

function* primeNumbers() {
  const isPrime = (n) => {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return false;
    }
    return true;
  };
  
  let num = 2;
  while (true) {
    if (isPrime(num)) {
      yield num;
    }
    num++;
  }
}

// Using infinite iterators (with take to avoid infinite loops)
const first10Numbers = IteratorCombinators.take(infiniteNumbers(100), 10);
console.log('10 numbers starting from 100:', Array.from(first10Numbers));

const first10Primes = IteratorCombinators.take(primeNumbers(), 10);
console.log('First 10 primes:', Array.from(first10Primes)); // [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]

// === CUSTOM COLLECTION WITH MULTIPLE ITERATORS ===
class NumberCollection {
  constructor(...numbers) {
    this.numbers = numbers;
  }
  
  // Default iterator
  [Symbol.iterator]() {
    let index = 0;
    const numbers = this.numbers;
    
    return {
      next() {
        if (index < numbers.length) {
          return { value: numbers[index++], done: false };
        }
        return { done: true };
      }
    };
  }
  
  // Reverse iterator
  reverseIterator() {
    let index = this.numbers.length - 1;
    const numbers = this.numbers;
    
    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        if (index >= 0) {
          return { value: numbers[index--], done: false };
        }
        return { done: true };
      }
    };
  }
  
  // Even numbers iterator
  evenIterator() {
    return IteratorCombinators.filter(this, x => x % 2 === 0);
  }
  
  // Odd numbers iterator
  oddIterator() {
    return IteratorCombinators.filter(this, x => x % 2 !== 0);
  }
  
  // Pairs iterator
  pairsIterator() {
    let index = 0;
    const numbers = this.numbers;
    
    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        if (index < numbers.length - 1) {
          const pair = [numbers[index], numbers[index + 1]];
          index += 2;
          return { value: pair, done: false };
        }
        return { done: true };
      }
    };
  }
}

// Using NumberCollection
const collection = new NumberCollection(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

console.log('Forward:', Array.from(collection));
console.log('Reverse:', Array.from(collection.reverseIterator()));
console.log('Even:', Array.from(collection.evenIterator()));
console.log('Odd:', Array.from(collection.oddIterator()));
console.log('Pairs:', Array.from(collection.pairsIterator()));

// === PRACTICAL EXAMPLE: CSV PARSER ===
class CSVParser {
  constructor(csvData) {
    this.lines = csvData.trim().split('\\n');
  }
  
  [Symbol.iterator]() {
    let index = 0;
    const lines = this.lines;
    
    return {
      next() {
        if (index < lines.length) {
          const line = lines[index++];
          const values = line.split(',').map(v => v.trim());
          return { value: values, done: false };
        }
        return { done: true };
      }
    };
  }
  
  withHeaders() {
    const iterator = this[Symbol.iterator]();
    const headerResult = iterator.next();
    
    if (headerResult.done) {
      return { [Symbol.iterator]: () => ({ next: () => ({ done: true }) }) };
    }
    
    const headers = headerResult.value;
    
    return {
      [Symbol.iterator]() {
        return {
          next() {
            const result = iterator.next();
            if (result.done) {
              return result;
            }
            
            const obj = {};
            headers.forEach((header, index) => {
              obj[header] = result.value[index];
            });
            
            return { value: obj, done: false };
          }
        };
      }
    };
  }
}

// Using CSVParser
const csvData = \`name,age,city
John,30,New York
Alice,25,Los Angeles
Bob,35,Chicago\`;

const parser = new CSVParser(csvData);

console.log('Raw CSV parsing:');
for (const row of parser) {
  console.log(row); // ['name', 'age', 'city'], ['John', '30', 'New York'], etc.
}

console.log('With headers:');
for (const record of parser.withHeaders()) {
  console.log(record); // { name: 'John', age: '30', city: 'New York' }, etc.
}`}
      useCases={[
        "Custom data structure iteration",
        "Lazy evaluation and infinite sequences",
        "Stream processing",
        "Tree and graph traversal",
        "Data transformation pipelines",
        "Collection filtering and mapping",
        "Pagination and batching",
        "Parser implementations",
        "Algorithm implementation",
        "Memory-efficient data processing"
      ]}
    />
  )
}
