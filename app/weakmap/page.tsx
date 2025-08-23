import ObjectPage from '../components/ObjectPage'

export default function WeakMapPage() {
  return (
    <ObjectPage
      title="WeakMap"
      description="Represents a collection of key-value pairs with weak references"
      overview="The WeakMap constructor creates WeakMap objects. WeakMaps are collections of key-value pairs where keys are weakly referenced."
      syntax={`// Creating WeakMap
const weakMap = new WeakMap();
const obj1 = { name: 'John' };
const obj2 = { name: 'Jane' };

weakMap.set(obj1, 'Data for John');
weakMap.set(obj2, 'Data for Jane');

console.log(weakMap.get(obj1)); // 'Data for John'
console.log(weakMap.has(obj1)); // true

// WeakMap with object keys
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
console.log(expensiveOperation(user2)); // 'BOB processed'

// WeakMap limitations
const weakMap2 = new WeakMap();
const obj = { data: 'test' };

weakMap2.set(obj, 'value');

// These methods don't exist on WeakMap
// console.log(weakMap2.size); // undefined
// console.log(weakMap2.keys()); // undefined
// console.log(weakMap2.values()); // undefined
// console.log(weakMap2.entries()); // undefined

// Only these methods are available
console.log(weakMap2.get(obj)); // 'value'
console.log(weakMap2.has(obj)); // true
weakMap2.delete(obj);
console.log(weakMap2.has(obj)); // false

// WeakMap for private data
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
// console.log(user.name); // undefined (private)`}
      useCases={[
        "Private data storage",
        "Object caching",
        "Memory management",
        "Weak references"
      ]}
    />
  )
}
