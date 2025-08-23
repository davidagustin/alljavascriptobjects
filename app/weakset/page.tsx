import ObjectPage from '../components/ObjectPage'

export default function WeakSetPage() {
  return (
    <ObjectPage
      title="WeakSet"
      description="Represents a collection of unique values with weak references"
      overview="The WeakSet constructor creates WeakSet objects. WeakSets are collections of unique values where values are weakly referenced."
      syntax={`// Creating WeakSet
const weakSet = new WeakSet();
const obj1 = { name: 'John' };
const obj2 = { name: 'Jane' };

weakSet.add(obj1);
weakSet.add(obj2);

console.log(weakSet.has(obj1)); // true
console.log(weakSet.has(obj2)); // true

// WeakSet for tracking objects
const processedObjects = new WeakSet();

function processObject(obj) {
  if (processedObjects.has(obj)) {
    console.log('Object already processed');
    return;
  }
  
  console.log('Processing object:', obj.name);
  processedObjects.add(obj);
}

const user1 = { name: 'Alice' };
const user2 = { name: 'Bob' };

processObject(user1); // 'Processing object: Alice'
processObject(user1); // 'Object already processed'
processObject(user2); // 'Processing object: Bob'

// WeakSet limitations
const weakSet2 = new WeakSet();
const obj = { data: 'test' };

weakSet2.add(obj);

// These methods don't exist on WeakSet
// console.log(weakSet2.size); // undefined
// console.log(weakSet2.values()); // undefined

// Only these methods are available
console.log(weakSet2.has(obj)); // true
weakSet2.delete(obj);
console.log(weakSet2.has(obj)); // false

// WeakSet for preventing circular references
const visited = new WeakSet();

function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (visited.has(obj)) {
    return null; // Prevent circular reference
  }
  
  visited.add(obj);
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
}

const obj3 = { name: 'Test' };
obj3.self = obj3; // Circular reference

const cloned = deepClone(obj3);
console.log(cloned.name); // 'Test'
console.log(cloned.self); // null (circular reference prevented)`}
      useCases={[
        "Object tracking",
        "Circular reference prevention",
        "Memory management",
        "Weak references"
      ]}
    />
  )
}
