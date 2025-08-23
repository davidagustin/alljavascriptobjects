import ObjectPage from '../components/ObjectPage'

export default function ReflectPage() {
  return (
    <ObjectPage
      title="Reflect"
      description="Provides methods for interceptable JavaScript operations"
      overview="The Reflect object provides methods for interceptable JavaScript operations. These methods are the same as those of proxy handlers."
      syntax={`// ============ REFLECT STATIC METHODS ============
// Reflect provides 13 static methods that correspond to Proxy handler traps

// ============ 1. Reflect.get() ============
// Reflect.get(target, propertyKey[, receiver])
const obj = { 
  name: 'John', 
  age: 30,
  get greeting() {
    return \`Hello, I'm \${this.name}\`;
  }
};

console.log(Reflect.get(obj, 'name')); // 'John'
console.log(Reflect.get(obj, 'age')); // 30
console.log(Reflect.get(obj, 'greeting')); // "Hello, I'm John"

// With receiver - changes 'this' in getters
const receiver = { name: 'Alice' };
console.log(Reflect.get(obj, 'greeting', receiver)); // "Hello, I'm Alice"

// Accessing inherited properties
const child = Object.create(obj);
console.log(Reflect.get(child, 'name')); // 'John' (inherited)

// ============ 2. Reflect.set() ============
// Reflect.set(target, propertyKey, value[, receiver])
const target = {
  value: 0,
  set setter(val) {
    this.value = val * 2;
  }
};

console.log(Reflect.set(target, 'value', 10)); // true
console.log(target.value); // 10

console.log(Reflect.set(target, 'setter', 5)); // true
console.log(target.value); // 10 (setter multiplies by 2)

// With receiver - changes 'this' in setters
const recv = { value: 0 };
Reflect.set(target, 'setter', 7, recv);
console.log(recv.value); // 14 (setter applied to recv)
console.log(target.value); // 10 (unchanged)

// Returns false if property is non-writable
const frozen = Object.freeze({ prop: 1 });
console.log(Reflect.set(frozen, 'prop', 2)); // false

// ============ 3. Reflect.has() ============
// Reflect.has(target, propertyKey) - same as 'in' operator
const hasObj = { prop: 1 };
const hasChild = Object.create(hasObj);

console.log(Reflect.has(hasObj, 'prop')); // true
console.log(Reflect.has(hasObj, 'toString')); // true (inherited)
console.log(Reflect.has(hasChild, 'prop')); // true (inherited)
console.log(Reflect.has(hasObj, 'missing')); // false

// Works with arrays
const arr = [1, 2, 3];
console.log(Reflect.has(arr, 0)); // true
console.log(Reflect.has(arr, 'length')); // true

// Works with symbols
const sym = Symbol('key');
const symObj = { [sym]: 'value' };
console.log(Reflect.has(symObj, sym)); // true

// ============ 4. Reflect.deleteProperty() ============
// Reflect.deleteProperty(target, propertyKey) - same as delete operator
const delObj = { a: 1, b: 2, c: 3 };

console.log(Reflect.deleteProperty(delObj, 'b')); // true
console.log(delObj); // { a: 1, c: 3 }

// Returns true even if property doesn't exist
console.log(Reflect.deleteProperty(delObj, 'missing')); // true

// Returns false for non-configurable properties
const nonConfig = {};
Object.defineProperty(nonConfig, 'fixed', {
  value: 42,
  configurable: false
});
console.log(Reflect.deleteProperty(nonConfig, 'fixed')); // false

// ============ 5. Reflect.construct() ============
// Reflect.construct(target, argumentsList[, newTarget])
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

// Basic construction
const person1 = Reflect.construct(Person, ['Alice', 30]);
console.log(person1.name, person1.age); // 'Alice', 30
console.log(person1 instanceof Person); // true

// With different newTarget (changes prototype)
class Employee {}
const person2 = Reflect.construct(Person, ['Bob', 25], Employee);
console.log(person2.name); // 'Bob'
console.log(person2 instanceof Person); // false
console.log(person2 instanceof Employee); // true

// With built-in constructors
const date = Reflect.construct(Date, [2023, 0, 1]);
console.log(date instanceof Date); // true

// ============ 6. Reflect.apply() ============
// Reflect.apply(target, thisArgument, argumentsList)
function greet(greeting, punctuation) {
  return \`\${greeting}, \${this.name}\${punctuation}\`;
}

const context = { name: 'World' };
const result = Reflect.apply(greet, context, ['Hello', '!']);
console.log(result); // 'Hello, World!'

// With Math functions
const numbers = [5, 6, 2, 3, 7];
const max = Reflect.apply(Math.max, null, numbers);
console.log(max); // 7

// With array methods
const array = [1, 2, 3];
Reflect.apply(Array.prototype.push, array, [4, 5, 6]);
console.log(array); // [1, 2, 3, 4, 5, 6]

// ============ 7. Reflect.defineProperty() ============
// Reflect.defineProperty(target, propertyKey, descriptor)
const defObj = {};

// Returns boolean instead of throwing
const success1 = Reflect.defineProperty(defObj, 'prop1', {
  value: 42,
  writable: true,
  enumerable: true,
  configurable: true
});
console.log(success1); // true
console.log(defObj.prop1); // 42

// Define getter/setter
const success2 = Reflect.defineProperty(defObj, 'prop2', {
  get() { return this._prop2 || 0; },
  set(val) { this._prop2 = val * 2; },
  enumerable: true,
  configurable: true
});
defObj.prop2 = 10;
console.log(defObj.prop2); // 20

// Fails on non-extensible objects
Object.preventExtensions(defObj);
const success3 = Reflect.defineProperty(defObj, 'prop3', { value: 1 });
console.log(success3); // false

// ============ 8. Reflect.getOwnPropertyDescriptor() ============
// Reflect.getOwnPropertyDescriptor(target, propertyKey)
const descObj = { prop: 'value' };
Object.defineProperty(descObj, 'hidden', {
  value: 'secret',
  enumerable: false
});

const desc1 = Reflect.getOwnPropertyDescriptor(descObj, 'prop');
console.log(desc1); 
// { value: 'value', writable: true, enumerable: true, configurable: true }

const desc2 = Reflect.getOwnPropertyDescriptor(descObj, 'hidden');
console.log(desc2);
// { value: 'secret', writable: false, enumerable: false, configurable: false }

const desc3 = Reflect.getOwnPropertyDescriptor(descObj, 'missing');
console.log(desc3); // undefined

// ============ 9. Reflect.getPrototypeOf() ============
// Reflect.getPrototypeOf(target)
const proto = { inherited: true };
const protoObj = Object.create(proto);

console.log(Reflect.getPrototypeOf(protoObj) === proto); // true
console.log(Reflect.getPrototypeOf([]) === Array.prototype); // true
console.log(Reflect.getPrototypeOf(Object.create(null))); // null

// With classes
class Base {}
class Derived extends Base {}
const instance = new Derived();
console.log(Reflect.getPrototypeOf(instance) === Derived.prototype); // true

// ============ 10. Reflect.setPrototypeOf() ============
// Reflect.setPrototypeOf(target, prototype)
const setProtoObj = { original: true };
const newProto = { newProp: 'added' };

console.log(Reflect.setPrototypeOf(setProtoObj, newProto)); // true
console.log(setProtoObj.newProp); // 'added' (inherited)

// Returns false if object is non-extensible
const frozen = Object.freeze({});
console.log(Reflect.setPrototypeOf(frozen, {})); // false

// Setting to null
const nullProto = {};
console.log(Reflect.setPrototypeOf(nullProto, null)); // true
console.log(Reflect.getPrototypeOf(nullProto)); // null

// ============ 11. Reflect.isExtensible() ============
// Reflect.isExtensible(target)
const extObj = {};
console.log(Reflect.isExtensible(extObj)); // true

Object.preventExtensions(extObj);
console.log(Reflect.isExtensible(extObj)); // false

const sealed = Object.seal({});
console.log(Reflect.isExtensible(sealed)); // false

const frozen2 = Object.freeze({});
console.log(Reflect.isExtensible(frozen2)); // false

// ============ 12. Reflect.preventExtensions() ============
// Reflect.preventExtensions(target)
const preventObj = { existing: 1 };
console.log(Reflect.preventExtensions(preventObj)); // true
console.log(Reflect.isExtensible(preventObj)); // false

// Can't add new properties
preventObj.newProp = 2;
console.log(preventObj.newProp); // undefined (in strict mode would throw)

// Can still modify existing properties
preventObj.existing = 2;
console.log(preventObj.existing); // 2

// ============ 13. Reflect.ownKeys() ============
// Reflect.ownKeys(target) - returns all own property keys (strings and symbols)
const sym1 = Symbol('sym1');
const sym2 = Symbol('sym2');
const keysObj = {
  str1: 1,
  str2: 2,
  [sym1]: 3,
  [sym2]: 4
};

// Define non-enumerable property
Object.defineProperty(keysObj, 'hidden', {
  value: 5,
  enumerable: false
});

const allKeys = Reflect.ownKeys(keysObj);
console.log(allKeys); // ['str1', 'str2', 'hidden', Symbol(sym1), Symbol(sym2)]

// Compare with other methods
console.log(Object.keys(keysObj)); // ['str1', 'str2'] (only enumerable strings)
console.log(Object.getOwnPropertyNames(keysObj)); // ['str1', 'str2', 'hidden']
console.log(Object.getOwnPropertySymbols(keysObj)); // [Symbol(sym1), Symbol(sym2)]

// ============ PRACTICAL PATTERNS WITH REFLECT ============

// 1. Safe property access with default values
function safeGet(obj, prop, defaultValue) {
  return Reflect.has(obj, prop) ? Reflect.get(obj, prop) : defaultValue;
}

const config = { timeout: 5000 };
console.log(safeGet(config, 'timeout', 3000)); // 5000
console.log(safeGet(config, 'retries', 3)); // 3 (default)

// 2. Deep property setter
function deepSet(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((curr, key) => {
    if (!Reflect.has(curr, key)) {
      Reflect.set(curr, key, {});
    }
    return Reflect.get(curr, key);
  }, obj);
  return Reflect.set(target, lastKey, value);
}

const data = {};
deepSet(data, 'user.profile.name', 'Alice');
console.log(data); // { user: { profile: { name: 'Alice' } } }

// 3. Method borrowing
function borrowMethod(source, method, target, ...args) {
  return Reflect.apply(source[method], target, args);
}

const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
const joined = borrowMethod(Array.prototype, 'join', arrayLike, '-');
console.log(joined); // 'a-b-c'

// 4. Conditional property definition
function defineIf(obj, prop, descriptor, condition) {
  if (condition) {
    return Reflect.defineProperty(obj, prop, descriptor);
  }
  return false;
}

const user = {};
defineIf(user, 'admin', { value: true }, process.env.NODE_ENV === 'development');

// 5. Property copier with filtering
function copyProperties(source, target, filter = () => true) {
  const keys = Reflect.ownKeys(source);
  for (const key of keys) {
    if (filter(key, source)) {
      const descriptor = Reflect.getOwnPropertyDescriptor(source, key);
      Reflect.defineProperty(target, key, descriptor);
    }
  }
  return target;
}

const original = { a: 1, b: 2, _private: 3 };
const copy = copyProperties(original, {}, key => !key.startsWith('_'));
console.log(copy); // { a: 1, b: 2 }

// ============ REFLECT vs DIRECT OPERATIONS ============
// Advantages of Reflect:
// 1. Returns boolean for success/failure instead of throwing
// 2. Consistent API for metaprogramming
// 3. Works well with Proxy handlers
// 4. More functional programming style

// Comparison examples:
const testObj = {};

// Direct: throws in strict mode if fails
// testObj.prop = 1;

// Reflect: returns boolean
const success = Reflect.set(testObj, 'prop', 1);
console.log(success); // true

// Direct: operator
// delete testObj.prop;

// Reflect: method call
const deleted = Reflect.deleteProperty(testObj, 'prop');
console.log(deleted); // true

// Direct: awkward with computed properties
// const has = 'prop' in testObj;

// Reflect: consistent method call
const hasProp = Reflect.has(testObj, 'prop');
console.log(hasProp); // false`}
      useCases={[
        "Property access and modification",
        "Function invocation",
        "Object construction",
        "Metaprogramming"
      ]}
    />
  )
}
