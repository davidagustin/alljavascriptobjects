import ObjectPage from '../components/ObjectPage'

export default function SymbolPage() {
  return (
    <ObjectPage
      title="Symbol"
      description="Represents a unique identifier"
      overview="The Symbol constructor creates Symbol objects. Symbols are unique identifiers that can be used as property keys."
      syntax={`// ============ CREATING SYMBOLS ============
// Symbol([description]) - creates unique symbol
const sym1 = Symbol();
const sym2 = Symbol('description');
const sym3 = Symbol('description');

console.log(sym1); // Symbol()
console.log(sym2); // Symbol(description)
console.log(sym2 === sym3); // false (always unique, even with same description)
console.log(typeof sym1); // 'symbol'

// Symbol() is not a constructor
// new Symbol(); // TypeError: Symbol is not a constructor

// ============ SYMBOL STATIC METHODS ============

// Symbol.for(key) - gets symbol from global registry
const globalSym1 = Symbol.for('app.user');
const globalSym2 = Symbol.for('app.user');
console.log(globalSym1 === globalSym2); // true (same symbol)

// Creates if doesn't exist
const newGlobal = Symbol.for('app.new');
const sameGlobal = Symbol.for('app.new');
console.log(newGlobal === sameGlobal); // true

// Symbol.keyFor(symbol) - gets key from global registry
console.log(Symbol.keyFor(globalSym1)); // 'app.user'
console.log(Symbol.keyFor(Symbol('local'))); // undefined (not global)

// ============ SYMBOL INSTANCE METHODS ============

// toString() - returns string representation
const sym = Symbol('test');
console.log(sym.toString()); // 'Symbol(test)'
// console.log(sym + ''); // TypeError: Cannot convert Symbol to string

// valueOf() - returns primitive value
console.log(sym.valueOf()); // Symbol(test)
console.log(sym.valueOf() === sym); // true

// Symbol.prototype.description - gets description (ES2019)
const symWithDesc = Symbol('my description');
const symNoDesc = Symbol();
console.log(symWithDesc.description); // 'my description'
console.log(symNoDesc.description); // undefined

// Symbol.prototype[Symbol.toPrimitive] - converts to primitive
const symPrim = Symbol('primitive');
// console.log(+symPrim); // TypeError: Cannot convert Symbol to number
// console.log(\`\${symPrim}\`); // TypeError: Cannot convert Symbol to string

// ============ WELL-KNOWN SYMBOLS ============

// 1. Symbol.iterator - defines default iterator
class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
  
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    
    return {
      next() {
        if (current <= end) {
          return { value: current++, done: false };
        }
        return { done: true };
      }
    };
  }
}

const range = new Range(1, 5);
console.log([...range]); // [1, 2, 3, 4, 5]

for (const num of range) {
  console.log(num); // 1, 2, 3, 4, 5
}

// 2. Symbol.asyncIterator - defines async iterator
class AsyncRange {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
  
  [Symbol.asyncIterator]() {
    let current = this.start;
    const end = this.end;
    
    return {
      async next() {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (current <= end) {
          return { value: current++, done: false };
        }
        return { done: true };
      }
    };
  }
}

// Usage:
// for await (const num of new AsyncRange(1, 3)) {
//   console.log(num); // 1, 2, 3 (with delays)
// }

// 3. Symbol.hasInstance - customizes instanceof
class MyArray {
  static [Symbol.hasInstance](instance) {
    return Array.isArray(instance);
  }
}

console.log([] instanceof MyArray); // true
console.log({} instanceof MyArray); // false

// 4. Symbol.isConcatSpreadable - controls array spreading
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
arr2[Symbol.isConcatSpreadable] = false;

console.log(arr1.concat(arr2)); // [1, 2, 3, [4, 5, 6]]

const arrayLike = {
  0: 'a',
  1: 'b',
  length: 2,
  [Symbol.isConcatSpreadable]: true
};
console.log([].concat(arrayLike)); // ['a', 'b']

// 5. Symbol.species - specifies constructor for derived objects
class MyArray2 extends Array {
  static get [Symbol.species]() {
    return Array; // Use Array constructor instead of MyArray2
  }
}

const myArr = new MyArray2(1, 2, 3);
const mapped = myArr.map(x => x * 2);
console.log(mapped instanceof MyArray2); // false
console.log(mapped instanceof Array); // true

// 6. Symbol.toPrimitive - customizes type conversion
class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }
  
  [Symbol.toPrimitive](hint) {
    switch(hint) {
      case 'number':
        return this.celsius;
      case 'string':
        return \`\${this.celsius}°C\`;
      default:
        return this.celsius;
    }
  }
}

const temp = new Temperature(25);
console.log(+temp); // 25
console.log(\`Temperature: \${temp}\`); // 'Temperature: 25°C'
console.log(temp + 10); // 35

// 7. Symbol.toStringTag - customizes Object.prototype.toString
class CustomClass {
  get [Symbol.toStringTag]() {
    return 'CustomClass';
  }
}

const custom = new CustomClass();
console.log(Object.prototype.toString.call(custom)); // '[object CustomClass]'

// Built-in examples
console.log(Object.prototype.toString.call([])); // '[object Array]'
console.log(Object.prototype.toString.call(new Map())); // '[object Map]'
console.log(Object.prototype.toString.call(Promise.resolve())); // '[object Promise]'

// 8. Symbol.unscopables - excludes properties from 'with' statements
const obj = {
  foo: 1,
  bar: 2,
  [Symbol.unscopables]: {
    foo: true // Exclude 'foo' from with statement
  }
};

// with(obj) {
//   console.log(foo); // ReferenceError (if foo not defined globally)
//   console.log(bar); // 2
// }

// 9. Symbol.match - customizes String.prototype.match
class WordMatcher {
  constructor(word) {
    this.word = word;
  }
  
  [Symbol.match](string) {
    const index = string.indexOf(this.word);
    return index === -1 ? null : {
      index,
      match: this.word
    };
  }
}

const matcher = new WordMatcher('world');
console.log('hello world'.match(matcher)); // { index: 6, match: 'world' }

// 10. Symbol.matchAll - customizes String.prototype.matchAll
// 11. Symbol.replace - customizes String.prototype.replace
// 12. Symbol.search - customizes String.prototype.search
// 13. Symbol.split - customizes String.prototype.split

class CommaSplitter {
  [Symbol.split](string) {
    return string.split(',').map(s => s.trim());
  }
}

const splitter = new CommaSplitter();
console.log('a, b, c'.split(splitter)); // ['a', 'b', 'c']

// ============ SYMBOLS AS PROPERTY KEYS ============
const privateKey = Symbol('private');
const obj = {
  public: 'This is public',
  [privateKey]: 'This is private'
};

// Not enumerable in for...in
for (const key in obj) {
  console.log(key); // Only 'public'
}

// Not in Object.keys()
console.log(Object.keys(obj)); // ['public']

// Not in Object.getOwnPropertyNames()
console.log(Object.getOwnPropertyNames(obj)); // ['public']

// Not in JSON.stringify()
console.log(JSON.stringify(obj)); // '{"public":"This is public"}'

// But accessible via Object.getOwnPropertySymbols()
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(private)]

// And via Reflect.ownKeys()
console.log(Reflect.ownKeys(obj)); // ['public', Symbol(private)]

// ============ PRACTICAL PATTERNS ============

// 1. Private properties (convention, not truly private)
const _counter = Symbol('counter');
class Counter {
  constructor() {
    this[_counter] = 0;
  }
  
  increment() {
    return ++this[_counter];
  }
  
  get value() {
    return this[_counter];
  }
}

const counter = new Counter();
console.log(counter.increment()); // 1
console.log(counter.value); // 1
console.log(counter._counter); // undefined

// 2. Avoiding property name collisions
const libSymbol = Symbol.for('myLib.config');
const userObj = {
  config: 'user config',
  [libSymbol]: 'library config'
};

console.log(userObj.config); // 'user config' (no collision)
console.log(userObj[libSymbol]); // 'library config'

// 3. Meta-programming with symbols
const metadata = Symbol('metadata');

function addMetadata(obj, data) {
  obj[metadata] = data;
  return obj;
}

function getMetadata(obj) {
  return obj[metadata];
}

const annotated = addMetadata({}, { created: Date.now() });
console.log(getMetadata(annotated)); // { created: ... }

// 4. Creating enum-like constants
const Colors = Object.freeze({
  RED: Symbol('red'),
  GREEN: Symbol('green'),
  BLUE: Symbol('blue')
});

function getColorName(color) {
  switch(color) {
    case Colors.RED: return 'Red';
    case Colors.GREEN: return 'Green';
    case Colors.BLUE: return 'Blue';
    default: return 'Unknown';
  }
}

console.log(getColorName(Colors.RED)); // 'Red'
// Symbols ensure uniqueness - no accidental matches

// 5. Symbol-based event system
class EventEmitter {
  constructor() {
    this.events = new Map();
  }
  
  on(event, handler) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(handler);
  }
  
  emit(event, ...args) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(handler => handler(...args));
    }
  }
}

// Using symbols for event names prevents naming conflicts
const EVENTS = {
  READY: Symbol('ready'),
  ERROR: Symbol('error'),
  DATA: Symbol('data')
};

const emitter = new EventEmitter();
emitter.on(EVENTS.READY, () => console.log('Ready!'));
emitter.emit(EVENTS.READY); // 'Ready!'`}
      useCases={[
        "Unique property keys",
        "Private properties",
        "Well-known symbols",
        "Metaprogramming"
      ]}
    />
  )
}
