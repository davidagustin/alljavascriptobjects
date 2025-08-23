import ObjectPage from '../components/ObjectPage';

export default function WeakRefPage() {
  return (
    <ObjectPage
      title="WeakRef"
      description="WeakRef allows you to hold a weak reference to an object without preventing it from being garbage collected."
      overview="WeakRef creates a weak reference to an object, allowing the object to be garbage collected if there are no other strong references to it. This is useful for caches, observers, and other scenarios where you want to reference an object without keeping it alive. The deref() method returns the object if it still exists, or undefined if it has been garbage collected. WeakRef should be used carefully as garbage collection timing is non-deterministic and varies between JavaScript engines."
      syntax={`// Creating a WeakRef
let obj = { data: "important", size: 1000 };
const weakRef = new WeakRef(obj);

// Accessing the referenced object
const referenced = weakRef.deref();
if (referenced) {
  console.log("Object still exists:", referenced.data);
} else {
  console.log("Object has been garbage collected");
}

// Object can be garbage collected when no strong references exist
obj = null; // Remove strong reference
// At some point, the object may be garbage collected
// and weakRef.deref() will return undefined

// Practical cache implementation
class WeakCache {
  constructor() {
    this.cache = new Map();
  }
  
  set(key, value) {
    this.cache.set(key, new WeakRef(value));
  }
  
  get(key) {
    const ref = this.cache.get(key);
    if (ref) {
      const value = ref.deref();
      if (value) {
        return value;
      } else {
        // Object was garbage collected, clean up
        this.cache.delete(key);
        return undefined;
      }
    }
    return undefined;
  }
  
  has(key) {
    const ref = this.cache.get(key);
    if (ref) {
      const value = ref.deref();
      if (value) {
        return true;
      } else {
        this.cache.delete(key);
        return false;
      }
    }
    return false;
  }
  
  delete(key) {
    return this.cache.delete(key);
  }
  
  clear() {
    this.cache.clear();
  }
  
  // Clean up entries with collected objects
  cleanup() {
    for (const [key, ref] of this.cache.entries()) {
      if (!ref.deref()) {
        this.cache.delete(key);
      }
    }
  }
}

// Observer pattern with weak references
class WeakObservable {
  constructor() {
    this.observers = [];
  }
  
  subscribe(observer) {
    this.observers.push(new WeakRef(observer));
  }
  
  notify(data) {
    // Clean up collected observers while notifying
    this.observers = this.observers.filter(ref => {
      const observer = ref.deref();
      if (observer) {
        observer.update(data);
        return true;
      }
      return false; // Remove collected observers
    });
  }
  
  getObserverCount() {
    // Count only living observers
    return this.observers.filter(ref => ref.deref()).length;
  }
}

// DOM element reference manager
class DOMRefManager {
  constructor() {
    this.elements = new Map();
  }
  
  register(id, element) {
    this.elements.set(id, new WeakRef(element));
  }
  
  get(id) {
    const ref = this.elements.get(id);
    if (ref) {
      const element = ref.deref();
      if (element && document.contains(element)) {
        return element;
      } else {
        // Element was removed from DOM or collected
        this.elements.delete(id);
        return null;
      }
    }
    return null;
  }
}

// Large object pool with weak references
class ObjectPool {
  constructor(factory, maxSize = 10) {
    this.factory = factory;
    this.maxSize = maxSize;
    this.available = [];
    this.inUse = new Set();
  }
  
  acquire() {
    // Try to get from available pool
    while (this.available.length > 0) {
      const ref = this.available.pop();
      const obj = ref.deref();
      if (obj) {
        this.inUse.add(obj);
        return obj;
      }
      // Object was collected, continue to next
    }
    
    // Create new object
    const obj = this.factory();
    this.inUse.add(obj);
    return obj;
  }
  
  release(obj) {
    if (this.inUse.has(obj)) {
      this.inUse.delete(obj);
      if (this.available.length < this.maxSize) {
        this.available.push(new WeakRef(obj));
      }
      // If pool is full, let object be garbage collected
    }
  }
  
  getStats() {
    const availableCount = this.available.filter(ref => ref.deref()).length;
    return {
      inUse: this.inUse.size,
      available: availableCount,
      total: this.inUse.size + availableCount
    };
  }
}

// Usage examples
const cache = new WeakCache();
let largeData = { array: new Array(1000000).fill(0) };
cache.set("data1", largeData);
console.log("Cached:", cache.has("data1")); // true
largeData = null; // Allow garbage collection

const observable = new WeakObservable();
let observer1 = { update: (data) => console.log("Observer 1:", data) };
let observer2 = { update: (data) => console.log("Observer 2:", data) };
observable.subscribe(observer1);
observable.subscribe(observer2);
observable.notify("Hello"); // Both observers notified
observer1 = null; // Allow observer1 to be collected

// Object pool example
const pool = new ObjectPool(() => ({
  data: new Array(1000).fill(0),
  process: function() { console.log("Processing..."); }
}), 5);

const obj1 = pool.acquire();
const obj2 = pool.acquire();
obj1.process();
pool.release(obj1);
console.log("Pool stats:", pool.getStats());

// Combining with FinalizationRegistry
class ManagedCache {
  constructor() {
    this.cache = new Map();
    this.registry = new FinalizationRegistry((key) => {
      console.log(\`Cleaning up cache key: \${key}\`);
      this.cache.delete(key);
    });
  }
  
  set(key, value) {
    const ref = new WeakRef(value);
    this.cache.set(key, ref);
    this.registry.register(value, key, value);
  }
  
  get(key) {
    const ref = this.cache.get(key);
    if (ref) {
      return ref.deref();
    }
    return undefined;
  }
}

console.log("WeakRef examples initialized");`}
      useCases={[
        "Memory-efficient caching",
        "Observer pattern implementation",
        "DOM element references",
        "Object pooling",
        "Event listener management",
        "Large data structure references",
        "Preventing memory leaks",
        "Resource lifecycle management"
      ]}
      browserSupport="WeakRef is supported in modern browsers but should be used carefully. Garbage collection behavior is non-deterministic and varies between JavaScript engines."
    />
  );
}