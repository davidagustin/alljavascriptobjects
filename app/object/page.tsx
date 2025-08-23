import ObjectPage from '../components/ObjectPage'

export default function ObjectPageComponent() {
  return (
    <ObjectPage
      title="Object"
      description="The base object from which all JavaScript objects inherit, providing fundamental object manipulation methods"
      overview="The Object constructor creates Object objects. Objects are collections of properties and are the fundamental building blocks of JavaScript. The Object constructor provides numerous static methods for object manipulation, property management, and prototype handling."
      complexity="intermediate"
      relatedObjects={['Array', 'Map', 'Set', 'WeakMap', 'Function']}
      browserSupport="Object is supported in all JavaScript environments and browsers."
      syntax={`// === CREATING OBJECTS ===
// Object literal (preferred)
const obj1 = { name: 'John', age: 30 };

// Object constructor
const obj2 = new Object();
const obj3 = new Object({ name: 'Jane', age: 25 });
const obj4 = new Object('Hello'); // Creates String object
const obj5 = new Object(123); // Creates Number object
const obj6 = new Object(true); // Creates Boolean object

// Object.create() - create with specific prototype
const proto = { greet() { return 'Hello'; } };
const obj7 = Object.create(proto);
console.log(obj7.greet()); // 'Hello'

// Create with null prototype (no inherited properties)
const obj8 = Object.create(null);
console.log(obj8.toString); // undefined (no Object.prototype methods)

// Create with property descriptors
const obj9 = Object.create(proto, {
  name: { value: 'Alice', writable: true, enumerable: true },
  age: { value: 30, writable: false, enumerable: true }
});

// === PROPERTY EXTRACTION METHODS ===
const person = { name: 'Alice', age: 30, city: 'NYC' };

// Object.keys() - returns array of enumerable property names
console.log(Object.keys(person)); // ['name', 'age', 'city']

// Object.values() - returns array of enumerable property values
console.log(Object.values(person)); // ['Alice', 30, 'NYC']

// Object.entries() - returns array of [key, value] pairs
console.log(Object.entries(person)); // [['name', 'Alice'], ['age', 30], ['city', 'NYC']]

// Object.getOwnPropertyNames() - all own properties (including non-enumerable)
const obj = Object.create({}, {
  visible: { value: 'yes', enumerable: true },
  hidden: { value: 'no', enumerable: false }
});
console.log(Object.keys(obj)); // ['visible']
console.log(Object.getOwnPropertyNames(obj)); // ['visible', 'hidden']

// Object.getOwnPropertySymbols() - returns symbol properties
const sym1 = Symbol('id');
const sym2 = Symbol('secret');
const symObj = { [sym1]: 123, [sym2]: 'hidden', regular: 'visible' };
console.log(Object.getOwnPropertySymbols(symObj)); // [Symbol(id), Symbol(secret)]

// === PROPERTY DESCRIPTOR METHODS ===
const product = { name: 'Laptop', price: 999 };

// Object.getOwnPropertyDescriptor() - get single property descriptor
const descriptor = Object.getOwnPropertyDescriptor(product, 'name');
console.log(descriptor);
// { value: 'Laptop', writable: true, enumerable: true, configurable: true }

// Object.getOwnPropertyDescriptors() - get all property descriptors
const descriptors = Object.getOwnPropertyDescriptors(product);
console.log(descriptors);
// { name: {...}, price: {...} }

// Object.defineProperty() - define single property with descriptor
Object.defineProperty(product, 'id', {
  value: 'PROD-001',
  writable: false,
  enumerable: false,
  configurable: false
});
console.log(product.id); // 'PROD-001'
product.id = 'CHANGED'; // Silently fails (or throws in strict mode)
console.log(product.id); // 'PROD-001' (unchanged)
console.log(Object.keys(product)); // ['name', 'price'] (id not enumerable)

// Object.defineProperties() - define multiple properties
Object.defineProperties(product, {
  category: {
    value: 'Electronics',
    writable: true,
    enumerable: true,
    configurable: true
  },
  stock: {
    value: 50,
    writable: true,
    enumerable: false,
    configurable: true
  }
});

// === OBJECT COMPOSITION METHODS ===
const target = { a: 1, b: 2 };
const source1 = { b: 3, c: 4 };
const source2 = { c: 5, d: 6 };

// Object.assign() - copies enumerable properties to target
const result = Object.assign(target, source1, source2);
console.log(result); // { a: 1, b: 3, c: 5, d: 6 }
console.log(target === result); // true (modifies target)

// Common pattern: clone with assign
const clone = Object.assign({}, source1);

// Shallow copy only
const nested = { a: { b: 1 } };
const shallowCopy = Object.assign({}, nested);
shallowCopy.a.b = 2;
console.log(nested.a.b); // 2 (nested object was not cloned)

// === OBJECT TRANSFORMATION METHODS ===
const entries = [['name', 'Bob'], ['age', 35], ['city', 'LA']];

// Object.fromEntries() - creates object from entries
const fromEntries = Object.fromEntries(entries);
console.log(fromEntries); // { name: 'Bob', age: 35, city: 'LA' }

// Works with Map
const map = new Map([['key1', 'value1'], ['key2', 'value2']]);
const fromMap = Object.fromEntries(map);
console.log(fromMap); // { key1: 'value1', key2: 'value2' }

// Transform object with entries
const prices = { apple: 1.5, banana: 0.5, orange: 2 };
const doublePrices = Object.fromEntries(
  Object.entries(prices).map(([fruit, price]) => [fruit, price * 2])
);
console.log(doublePrices); // { apple: 3, banana: 1, orange: 4 }

// === OBJECT INTEGRITY METHODS ===
const config = { server: 'localhost', port: 3000 };

// Object.preventExtensions() - prevent new properties
Object.preventExtensions(config);
config.timeout = 5000; // Silently fails (or throws in strict mode)
console.log(config.timeout); // undefined
console.log(Object.isExtensible(config)); // false

// Object.seal() - prevent adding/removing properties, configure = false
const user = { name: 'Alice', role: 'admin' };
Object.seal(user);
user.name = 'Bob'; // OK - can modify existing
user.email = 'bob@example.com'; // Fails - can't add new
delete user.role; // Fails - can't delete
console.log(Object.isSealed(user)); // true

// Object.freeze() - make immutable (writable = false, sealed)
const constants = { PI: 3.14159, E: 2.71828 };
Object.freeze(constants);
constants.PI = 3; // Fails - can't modify
constants.TAU = 6.28; // Fails - can't add
delete constants.E; // Fails - can't delete
console.log(Object.isFrozen(constants)); // true

// Deep freeze implementation
function deepFreeze(obj) {
  Object.freeze(obj);
  Object.values(obj).forEach(value => {
    if (typeof value === 'object' && value !== null) {
      deepFreeze(value);
    }
  });
  return obj;
}

// === PROTOTYPE METHODS ===
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() { return \`\${this.name} makes a sound\`; };

const dog = new Animal('Rex');

// Object.getPrototypeOf() - get prototype
console.log(Object.getPrototypeOf(dog) === Animal.prototype); // true

// Object.setPrototypeOf() - set prototype (use with caution - performance)
const cat = { name: 'Whiskers' };
Object.setPrototypeOf(cat, Animal.prototype);
console.log(cat.speak()); // 'Whiskers makes a sound'

// === COMPARISON METHODS ===
// Object.is() - strict equality with special cases
console.log(Object.is(+0, -0)); // false (=== returns true)
console.log(Object.is(NaN, NaN)); // true (=== returns false)
console.log(Object.is(0, false)); // false
console.log(Object.is('5', 5)); // false

// === PROPERTY CHECKING METHODS ===
const inventory = { apples: 5, bananas: 10 };

// Object.hasOwn() - recommended over hasOwnProperty
console.log(Object.hasOwn(inventory, 'apples')); // true
console.log(Object.hasOwn(inventory, 'toString')); // false (inherited)

// Alternative to obj.hasOwnProperty() which can be overridden
const malicious = { hasOwnProperty: () => true };
console.log(malicious.hasOwnProperty('anything')); // true (wrong!)
console.log(Object.hasOwn(malicious, 'anything')); // false (correct)

// Object.prototype.hasOwnProperty() - older method
console.log(inventory.hasOwnProperty('bananas')); // true

// Object.prototype.propertyIsEnumerable()
console.log(inventory.propertyIsEnumerable('apples')); // true
Object.defineProperty(inventory, 'hidden', { value: 0, enumerable: false });
console.log(inventory.propertyIsEnumerable('hidden')); // false

// === INHERITANCE CHECKING ===
// Object.prototype.isPrototypeOf()
console.log(Animal.prototype.isPrototypeOf(dog)); // true
console.log(Object.prototype.isPrototypeOf(dog)); // true

// instanceof operator (related)
console.log(dog instanceof Animal); // true
console.log(dog instanceof Object); // true

// === STRING CONVERSION METHODS ===
const point = {
  x: 10,
  y: 20,
  toString() { return \`Point(\${this.x}, \${this.y})\`; },
  valueOf() { return this.x + this.y; }
};

// Object.prototype.toString()
console.log(point.toString()); // 'Point(10, 20)'
console.log(Object.prototype.toString.call([])); // '[object Array]'
console.log(Object.prototype.toString.call(null)); // '[object Null]'

// Object.prototype.valueOf()
console.log(point.valueOf()); // 30
console.log(point + 10); // 40 (uses valueOf)

// Object.prototype.toLocaleString()
const date = new Date();
console.log(date.toLocaleString()); // Locale-specific date string

// === ADVANCED PATTERNS ===
// Object spread (ES2018)
const original = { a: 1, b: 2, c: 3 };
const spread = { ...original, d: 4 };
console.log(spread); // { a: 1, b: 2, c: 3, d: 4 }

// Object rest
const { a, ...rest } = spread;
console.log(rest); // { b: 2, c: 3, d: 4 }

// Computed property names
const prop = 'dynamicKey';
const dynamic = { [prop]: 'value', [\`computed_\${prop}\`]: 'computed' };
console.log(dynamic); // { dynamicKey: 'value', computed_dynamicKey: 'computed' }

// Property shorthand
const name = 'John';
const age = 30;
const shorthand = { name, age }; // Same as { name: name, age: age }

// Method shorthand
const methods = {
  regular: function() { return 'regular'; },
  shorthand() { return 'shorthand'; },
  arrow: () => 'arrow'
};

// Object grouping and transformation (Manual implementation)
// Note: Object.groupBy is a Stage 3 proposal, not yet standard
const items = [
  { category: 'fruit', name: 'apple' },
  { category: 'fruit', name: 'banana' },
  { category: 'vegetable', name: 'carrot' }
];

// Manual groupBy implementation
const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = typeof key === 'function' ? key(item) : item[key];
    if (!result[group]) result[group] = [];
    result[group].push(item);
    return result;
  }, {});
};

const grouped = groupBy(items, 'category');
console.log(grouped);
// { fruit: [{...}, {...}], vegetable: [{...}] }

// Safe property access with optional chaining
const data = { user: { profile: { name: 'Alice' } } };
console.log(data.user?.profile?.name); // 'Alice'
console.log(data.user?.settings?.theme); // undefined (no error)`}
      useCases={[
        "Data structures and models",
        "Configuration and settings objects",
        "API request/response handling",
        "State management in applications",
        "Property descriptor manipulation",
        "Object composition and mixins",
        "Prototype-based inheritance",
        "Object cloning and merging",
        "Immutable object patterns",
        "Metadata and symbol properties"
      ]}
      examples={[
        {
          title: "Creating and Manipulating Objects",
          description: "Basic object creation and property manipulation",
          code: `// Creating objects
const person = { name: 'Alice', age: 30 };
const car = new Object();
car.brand = 'Toyota';
car.year = 2023;

console.log(person.name); // 'Alice'
console.log(Object.keys(car)); // ['brand', 'year']`
        },
        {
          title: "Object Inheritance with Prototype",
          description: "Using Object.create for prototype-based inheritance",
          code: `// Prototype-based inheritance
const animal = {
  speak() {
    console.log(this.name + ' makes a sound');
  }
};

const dog = Object.create(animal);
dog.name = 'Rex';
dog.breed = 'Labrador';
dog.speak(); // 'Rex makes a sound'

console.log(Object.getPrototypeOf(dog) === animal); // true`
        },
        {
          title: "Advanced Object Operations",
          description: "Property descriptors and object manipulation",
          code: `const obj = {};

// Define property with descriptor
Object.defineProperty(obj, 'secret', {
  value: 'hidden',
  writable: false,
  enumerable: false,
  configurable: false
});

console.log(obj.secret); // 'hidden'
console.log(Object.keys(obj)); // []

// Get property descriptor
const descriptor = Object.getOwnPropertyDescriptor(obj, 'secret');
console.log(descriptor.writable); // false`
        }
      ]}
    />
  )
}
