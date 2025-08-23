import ObjectPage from '../components/ObjectPage'

export default function ProxyPage() {
  return (
    <ObjectPage
      title="Proxy"
      description="Creates a proxy object that can intercept and customize operations"
      overview="The Proxy constructor creates a proxy object that can intercept and customize fundamental operations for objects."
      syntax={`// ============ CONSTRUCTOR ============
// new Proxy(target, handler)
const target = { name: 'John', age: 30 };
const handler = {}; // Empty handler - proxy acts as pass-through
const proxy = new Proxy(target, handler);

console.log(proxy.name); // 'John' - direct pass-through

// ============ ALL PROXY HANDLER TRAPS ============

// 1. get() - intercepts property access
const getHandler = {
  get(target, property, receiver) {
    console.log(\`Getting: \${String(property)}\`);
    
    // Custom behavior for specific properties
    if (property === 'fullInfo') {
      return \`\${target.name} is \${target.age} years old\`;
    }
    
    // Default behavior using Reflect
    return Reflect.get(target, property, receiver);
  }
};

const getProxy = new Proxy({ name: 'Alice', age: 25 }, getHandler);
console.log(getProxy.name); // Getting: name -> 'Alice'
console.log(getProxy.fullInfo); // Getting: fullInfo -> 'Alice is 25 years old'

// 2. set() - intercepts property assignment
const setHandler = {
  set(target, property, value, receiver) {
    console.log(\`Setting: \${String(property)} = \${value}\`);
    
    // Validation
    if (property === 'age' && (typeof value !== 'number' || value < 0)) {
      throw new TypeError('Age must be a positive number');
    }
    
    // Track changes
    if (target[property] !== value) {
      console.log(\`Changed \${String(property)} from \${target[property]} to \${value}\`);
    }
    
    return Reflect.set(target, property, value, receiver);
  }
};

const setProxy = new Proxy({ age: 20 }, setHandler);
setProxy.age = 25; // Setting: age = 25, Changed age from 20 to 25
// setProxy.age = -5; // Throws TypeError

// 3. has() - intercepts 'in' operator
const hasHandler = {
  has(target, property) {
    console.log(\`Checking existence of: \${String(property)}\`);
    
    // Hide private properties
    if (typeof property === 'string' && property.startsWith('_')) {
      return false;
    }
    
    return Reflect.has(target, property);
  }
};

const hasProxy = new Proxy({ public: 1, _private: 2 }, hasHandler);
console.log('public' in hasProxy); // Checking existence... true
console.log('_private' in hasProxy); // Checking existence... false (hidden)

// 4. deleteProperty() - intercepts delete operations
const deleteHandler = {
  deleteProperty(target, property) {
    console.log(\`Deleting: \${String(property)}\`);
    
    // Prevent deletion of certain properties
    if (property === 'id') {
      console.log('Cannot delete id property');
      return false;
    }
    
    return Reflect.deleteProperty(target, property);
  }
};

const deleteProxy = new Proxy({ id: 1, temp: 'removable' }, deleteHandler);
delete deleteProxy.temp; // Deleting: temp (succeeds)
delete deleteProxy.id; // Deleting: id, Cannot delete id property (fails)

// 5. ownKeys() - intercepts Object.keys(), Object.getOwnPropertyNames(), etc.
const ownKeysHandler = {
  ownKeys(target) {
    console.log('Getting own keys');
    
    // Filter out private properties
    return Reflect.ownKeys(target).filter(
      key => typeof key !== 'string' || !key.startsWith('_')
    );
  }
};

const keysProxy = new Proxy({ a: 1, b: 2, _private: 3 }, ownKeysHandler);
console.log(Object.keys(keysProxy)); // Getting own keys -> ['a', 'b']

// 6. getOwnPropertyDescriptor() - intercepts Object.getOwnPropertyDescriptor()
const descriptorHandler = {
  getOwnPropertyDescriptor(target, property) {
    console.log(\`Getting descriptor for: \${String(property)}\`);
    
    // Hide private properties
    if (typeof property === 'string' && property.startsWith('_')) {
      return undefined;
    }
    
    return Reflect.getOwnPropertyDescriptor(target, property);
  }
};

const descProxy = new Proxy({ public: 1, _private: 2 }, descriptorHandler);
console.log(Object.getOwnPropertyDescriptor(descProxy, 'public')); // Returns descriptor
console.log(Object.getOwnPropertyDescriptor(descProxy, '_private')); // undefined

// 7. defineProperty() - intercepts Object.defineProperty()
const defineHandler = {
  defineProperty(target, property, descriptor) {
    console.log(\`Defining property: \${String(property)}\`);
    
    // Prevent defining certain properties
    if (property === 'forbidden') {
      console.log('Cannot define forbidden property');
      return false;
    }
    
    return Reflect.defineProperty(target, property, descriptor);
  }
};

const defineProxy = new Proxy({}, defineHandler);
Object.defineProperty(defineProxy, 'allowed', { value: 42 }); // Works
// Object.defineProperty(defineProxy, 'forbidden', { value: 13 }); // Fails

// 8. getPrototypeOf() - intercepts Object.getPrototypeOf()
const protoHandler = {
  getPrototypeOf(target) {
    console.log('Getting prototype');
    return Reflect.getPrototypeOf(target);
  }
};

const protoProxy = new Proxy({}, protoHandler);
console.log(Object.getPrototypeOf(protoProxy)); // Getting prototype -> Object.prototype

// 9. setPrototypeOf() - intercepts Object.setPrototypeOf()
const setProtoHandler = {
  setPrototypeOf(target, proto) {
    console.log('Setting prototype');
    
    // Prevent prototype changes
    if (Object.isFrozen(target)) {
      return false;
    }
    
    return Reflect.setPrototypeOf(target, proto);
  }
};

const setProtoProxy = new Proxy({}, setProtoHandler);
Object.setPrototypeOf(setProtoProxy, Array.prototype); // Setting prototype

// 10. isExtensible() - intercepts Object.isExtensible()
const extensibleHandler = {
  isExtensible(target) {
    console.log('Checking if extensible');
    return Reflect.isExtensible(target);
  }
};

const extProxy = new Proxy({}, extensibleHandler);
console.log(Object.isExtensible(extProxy)); // Checking if extensible -> true

// 11. preventExtensions() - intercepts Object.preventExtensions()
const preventHandler = {
  preventExtensions(target) {
    console.log('Preventing extensions');
    return Reflect.preventExtensions(target);
  }
};

const preventProxy = new Proxy({}, preventHandler);
Object.preventExtensions(preventProxy); // Preventing extensions

// 12. apply() - intercepts function calls (for function targets)
const applyHandler = {
  apply(target, thisArg, argumentsList) {
    console.log(\`Calling function with args: \${argumentsList}\`);
    
    // Pre-processing
    const processedArgs = argumentsList.map(arg => 
      typeof arg === 'string' ? arg.toUpperCase() : arg
    );
    
    // Call original function
    const result = Reflect.apply(target, thisArg, processedArgs);
    
    // Post-processing
    return result + '!';
  }
};

function greet(name) {
  return \`Hello, \${name}\`;
}

const funcProxy = new Proxy(greet, applyHandler);
console.log(funcProxy('world')); // Calling function... -> 'Hello, WORLD!'

// 13. construct() - intercepts 'new' operator (for constructor functions)
const constructHandler = {
  construct(target, argumentsList, newTarget) {
    console.log(\`Constructing with args: \${argumentsList}\`);
    
    // Add timestamp to all instances
    const instance = Reflect.construct(target, argumentsList, newTarget);
    instance.createdAt = Date.now();
    
    return instance;
  }
};

class User {
  constructor(name) {
    this.name = name;
  }
}

const UserProxy = new Proxy(User, constructHandler);
const user = new UserProxy('Bob'); // Constructing with args: Bob
console.log(user.name, user.createdAt); // 'Bob', timestamp

// ============ REVOCABLE PROXY ============
const revocable = Proxy.revocable(
  { data: 'sensitive' },
  {
    get(target, prop) {
      console.log(\`Accessing: \${String(prop)}\`);
      return target[prop];
    }
  }
);

console.log(revocable.proxy.data); // 'sensitive'
revocable.revoke(); // Revoke access
// console.log(revocable.proxy.data); // TypeError: Cannot perform 'get' on a proxy that has been revoked

// ============ PRACTICAL PATTERNS ============

// 1. Observable object
function observable(target, onChange) {
  return new Proxy(target, {
    set(obj, prop, value) {
      const oldValue = obj[prop];
      const result = Reflect.set(obj, prop, value);
      if (oldValue !== value) {
        onChange(prop, oldValue, value);
      }
      return result;
    }
  });
}

const state = observable(
  { count: 0 },
  (prop, old, val) => console.log(\`\${prop}: \${old} -> \${val}\`)
);

state.count++; // count: 0 -> 1
state.count = 5; // count: 1 -> 5

// 2. Auto-vivifying nested objects
function autoVivify() {
  return new Proxy({}, {
    get(target, property) {
      if (!(property in target)) {
        target[property] = autoVivify();
      }
      return target[property];
    }
  });
}

const nested = autoVivify();
nested.a.b.c.d = 'deep value'; // Creates all intermediate objects
console.log(nested.a.b.c.d); // 'deep value'

// 3. Negative array indices
function negativeArray(arr) {
  return new Proxy(arr, {
    get(target, prop) {
      if (!isNaN(prop)) {
        const index = Number(prop);
        if (index < 0) {
          return target[target.length + index];
        }
      }
      return target[prop];
    }
  });
}

const arr = negativeArray([1, 2, 3, 4, 5]);
console.log(arr[-1]); // 5
console.log(arr[-2]); // 4

// 4. Singleton enforcement
function singleton(Class) {
  let instance;
  return new Proxy(Class, {
    construct(target, args) {
      if (!instance) {
        instance = Reflect.construct(target, args);
      }
      return instance;
    }
  });
}

const SingletonClass = singleton(class {
  constructor(name) {
    this.name = name;
  }
});

const s1 = new SingletonClass('First');
const s2 = new SingletonClass('Second');
console.log(s1 === s2); // true
console.log(s1.name); // 'First'

// 5. Type-safe object
function typeSafe(schema) {
  return new Proxy({}, {
    set(target, prop, value) {
      if (prop in schema) {
        const type = schema[prop];
        if (typeof value !== type) {
          throw new TypeError(\`\${String(prop)} must be \${type}, got \${typeof value}\`);
        }
      }
      return Reflect.set(target, prop, value);
    }
  });
}

const typed = typeSafe({
  name: 'string',
  age: 'number',
  active: 'boolean'
});

typed.name = 'Alice'; // OK
typed.age = 30; // OK
// typed.age = '30'; // TypeError

// 6. Method chaining proxy
function chainable(obj) {
  return new Proxy(obj, {
    get(target, prop) {
      const value = target[prop];
      if (typeof value === 'function') {
        return function(...args) {
          const result = value.apply(target, args);
          return result === undefined ? proxy : result;
        };
      }
      return value;
    }
  });
  
  const proxy = new Proxy(obj, this.get);
  return proxy;
}

const calc = chainable({
  value: 0,
  add(n) { this.value += n; },
  multiply(n) { this.value *= n; },
  getValue() { return this.value; }
});

const result = calc.add(5).multiply(2).add(3).getValue();
console.log(result); // 13

// 7. Virtual properties
const virtualProps = new Proxy({
  firstName: 'John',
  lastName: 'Doe'
}, {
  get(target, prop) {
    if (prop === 'fullName') {
      return \`\${target.firstName} \${target.lastName}\`;
    }
    return target[prop];
  },
  set(target, prop, value) {
    if (prop === 'fullName') {
      const [first, last] = value.split(' ');
      target.firstName = first;
      target.lastName = last;
      return true;
    }
    return Reflect.set(target, prop, value);
  }
});

console.log(virtualProps.fullName); // 'John Doe'
virtualProps.fullName = 'Jane Smith';
console.log(virtualProps.firstName); // 'Jane'
console.log(virtualProps.lastName); // 'Smith'`}
      useCases={[
        "Property access logging",
        "Data validation",
        "Virtual properties",
        "Method interception"
      ]}
    />
  )
}
