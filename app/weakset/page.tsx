import ObjectPage from '../components/ObjectPage'

export default function WeakSetPage() {
  return (
    <ObjectPage
      title="WeakSet"
      description="Represents a collection of unique object values with weak references"
      overview="The WeakSet constructor creates WeakSet objects. WeakSets are collections of unique object values where objects are weakly referenced, allowing for automatic garbage collection when objects are no longer referenced elsewhere. This makes WeakSets ideal for object tracking, circular reference prevention, and memory management."
      syntax={`// ============ WEAKSET CREATION ============

// Creating WeakSet
const weakSet = new WeakSet();
const obj1 = { id: 1, name: 'John' };
const obj2 = { id: 2, name: 'Jane' };
const obj3 = { id: 3, name: 'Bob' };

// WeakSets only accept objects as values
weakSet.add(obj1);
weakSet.add(obj2);
weakSet.add(obj3);

console.log(weakSet.has(obj1)); // true
console.log(weakSet.has(obj2)); // true

// WeakSet with iterable constructor parameter
const objects = [obj1, obj2];
const weakSet2 = new WeakSet(objects);
console.log(weakSet2.has(obj1)); // true

// Creating WeakSet with array elements
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const arr3 = [7, 8, 9];

const arraySet = new WeakSet([arr1, arr2, arr3]);
console.log(arraySet.has(arr1)); // true

// ============ WEAKSET INSTANCE METHODS ============

// add(value) - Adds an object to the set
const tracker = new WeakSet();
const userObj = { name: 'Alice', id: 1 };
const productObj = { name: 'Laptop', id: 101 };
const orderObj = { orderId: 'ORD-123', userId: 1 };

tracker.add(userObj);
tracker.add(productObj);
tracker.add(orderObj);

// Method chaining (add returns the WeakSet)
const chainedSet = new WeakSet()
  .add(obj1)
  .add(obj2)
  .add(obj3);

// has(value) - Checks if object exists in set
console.log(tracker.has(userObj)); // true
console.log(tracker.has(productObj)); // true
console.log(tracker.has({})); // false (different object)

// delete(value) - Removes object from set
console.log(tracker.delete(userObj)); // true (successfully deleted)
console.log(tracker.delete(userObj)); // false (already deleted)
console.log(tracker.has(userObj)); // false

// ============ WEAKSET LIMITATIONS ============

const limitedSet = new WeakSet();
const obj = { test: 'value' };
limitedSet.add(obj);

// These properties/methods DON'T exist on WeakSet:
console.log(limitedSet.size); // undefined
console.log(typeof limitedSet.keys); // undefined
console.log(typeof limitedSet.values); // undefined
console.log(typeof limitedSet.entries); // undefined
console.log(typeof limitedSet.clear); // undefined
console.log(typeof limitedSet.forEach); // undefined

// WeakSet is NOT iterable
// for (let value of limitedSet) {} // TypeError
// [...limitedSet] // TypeError

// Only objects can be values (not primitives)
try {
  limitedSet.add('string'); // TypeError
} catch (error) {
  console.log('Primitive values not allowed:', error.name);
}

try {
  limitedSet.add(42); // TypeError
} catch (error) {
  console.log('Number values not allowed:', error.name);
}

try {
  limitedSet.add(null); // TypeError
} catch (error) {
  console.log('Null values not allowed:', error.name);
}

// ============ OBJECT TRACKING PATTERNS ============

// Track processed objects to avoid duplicate work
const processedObjects = new WeakSet();

function processUser(user) {
  if (processedObjects.has(user)) {
    console.log(\`User \${user.name} already processed\`);
    return { skipped: true, reason: 'already processed' };
  }
  
  console.log(\`Processing user: \${user.name}\`);
  
  // Simulate processing work
  const result = {
    processed: true,
    timestamp: Date.now(),
    userId: user.id,
    processedData: \`Processed: \${user.name}\`
  };
  
  // Mark as processed
  processedObjects.add(user);
  
  return result;
}

// Usage example
const user1 = { id: 1, name: 'Alice' };
const user2 = { id: 2, name: 'Bob' };
const user3 = { id: 3, name: 'Charlie' };

console.log(processUser(user1)); // Processing user: Alice
console.log(processUser(user2)); // Processing user: Bob  
console.log(processUser(user1)); // User Alice already processed
console.log(processUser(user3)); // Processing user: Charlie

// Batch processing with tracking
function batchProcessUsers(users) {
  const results = {
    processed: [],
    skipped: [],
    errors: []
  };
  
  users.forEach(user => {
    try {
      const result = processUser(user);
      if (result.skipped) {
        results.skipped.push({ user, result });
      } else {
        results.processed.push({ user, result });
      }
    } catch (error) {
      results.errors.push({ user, error: error.message });
    }
  });
  
  return results;
}

const userBatch = [user1, user2, user3, user1, user2]; // user1 and user2 repeated
const batchResults = batchProcessUsers(userBatch);
console.log('Batch results:', batchResults);

// ============ CIRCULAR REFERENCE PREVENTION ============

// Use WeakSet to prevent infinite recursion during deep operations
const visitedObjects = new WeakSet();

function deepClone(obj, visited = new WeakSet()) {
  // Handle primitives and null
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Prevent circular references
  if (visited.has(obj)) {
    console.log('Circular reference detected, returning null');
    return null;
  }
  
  // Mark object as visited
  visited.add(obj);
  
  // Handle arrays
  if (Array.isArray(obj)) {
    const clonedArray = obj.map(item => deepClone(item, visited));
    visited.delete(obj); // Clean up after processing
    return clonedArray;
  }
  
  // Handle objects
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], visited);
    }
  }
  
  visited.delete(obj); // Clean up after processing
  return cloned;
}

// Test with circular reference
const parentObj = { name: 'Parent' };
const childObj = { name: 'Child', parent: parentObj };
parentObj.child = childObj; // Circular reference

const clonedObj = deepClone(parentObj);
console.log('Cloned object:', clonedObj);
console.log('Circular reference handled:', clonedObj.child.parent === null);

// Stringify with circular reference handling
function safeStringify(obj, visited = new WeakSet()) {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  
  if (visited.has(obj)) {
    return '"[Circular Reference]"';
  }
  
  visited.add(obj);
  
  if (Array.isArray(obj)) {
    const items = obj.map(item => safeStringify(item, visited));
    visited.delete(obj);
    return \`[\${items.join(',')}]\`;
  }
  
  const pairs = Object.entries(obj).map(([key, value]) => 
    \`"\${key}":\${safeStringify(value, visited)}\`
  );
  
  visited.delete(obj);
  return \`{\${pairs.join(',')}}\`;
}

console.log('Safe stringify:', safeStringify(parentObj));

// ============ DOM ELEMENT MANAGEMENT ============

// Track DOM elements for cleanup or processing
const trackedElements = new WeakSet();
const elementHandlers = new WeakMap(); // Store handlers separately

class DOMElementTracker {
  static trackElement(element, metadata = {}) {
    trackedElements.add(element);
    elementHandlers.set(element, {
      ...metadata,
      trackedAt: Date.now(),
      interactions: 0
    });
  }
  
  static isTracked(element) {
    return trackedElements.has(element);
  }
  
  static untrackElement(element) {
    const wasTracked = trackedElements.delete(element);
    if (wasTracked) {
      elementHandlers.delete(element);
    }
    return wasTracked;
  }
  
  static recordInteraction(element) {
    if (trackedElements.has(element)) {
      const handler = elementHandlers.get(element);
      if (handler) {
        handler.interactions++;
        handler.lastInteraction = Date.now();
      }
    }
  }
  
  static getElementData(element) {
    return elementHandlers.get(element);
  }
  
  // Cleanup all event listeners for tracked elements
  static cleanupTrackedElements() {
    // Note: In real DOM usage, you'd iterate through actual DOM elements
    // This is a simulation showing the pattern
    console.log('Cleaning up tracked elements...');
    
    // In practice, you'd need to maintain a separate collection
    // for iteration since WeakSet is not iterable
  }
}

// Simulate DOM elements
const buttonElement = { tagName: 'BUTTON', id: 'submit-btn' };
const inputElement = { tagName: 'INPUT', type: 'text' };
const divElement = { tagName: 'DIV', className: 'container' };

// Track elements
DOMElementTracker.trackElement(buttonElement, { 
  component: 'SubmitButton',
  eventHandlers: ['click', 'focus']
});

DOMElementTracker.trackElement(inputElement, {
  component: 'TextInput',
  eventHandlers: ['change', 'input', 'blur']
});

// Check tracking
console.log(DOMElementTracker.isTracked(buttonElement)); // true
console.log(DOMElementTracker.isTracked(divElement)); // false

// Record interactions
DOMElementTracker.recordInteraction(buttonElement);
DOMElementTracker.recordInteraction(buttonElement);
DOMElementTracker.recordInteraction(inputElement);

console.log('Button data:', DOMElementTracker.getElementData(buttonElement));
console.log('Input data:', DOMElementTracker.getElementData(inputElement));

// ============ OBJECT VALIDATION AND FILTERING ============

// Use WeakSet to track valid/invalid objects
const validatedObjects = new WeakSet();
const invalidObjects = new WeakSet();

function validateUser(user) {
  // Check if already validated
  if (validatedObjects.has(user)) {
    return { valid: true, cached: true };
  }
  
  if (invalidObjects.has(user)) {
    return { valid: false, cached: true };
  }
  
  // Validation logic
  const isValid = user && 
                  typeof user.name === 'string' && 
                  user.name.length > 0 &&
                  typeof user.id === 'number' &&
                  user.id > 0;
  
  // Cache validation result
  if (isValid) {
    validatedObjects.add(user);
  } else {
    invalidObjects.add(user);
  }
  
  return { valid: isValid, cached: false };
}

// Filter valid objects from array
function filterValidUsers(users) {
  return users.filter(user => {
    const validation = validateUser(user);
    return validation.valid;
  });
}

// Test data
const users = [
  { id: 1, name: 'Alice' },     // valid
  { id: 2, name: '' },          // invalid (empty name)
  { id: 0, name: 'Bob' },       // invalid (id <= 0)
  { name: 'Charlie' },          // invalid (no id)
  { id: 3, name: 'David' },     // valid
  null,                         // invalid
  { id: 1, name: 'Alice' }      // same object as first, should use cache
];

const validUsers = filterValidUsers(users);
console.log('Valid users:', validUsers.length);

// Test caching
console.log(validateUser(users[0])); // First validation
console.log(validateUser(users[0])); // Should be cached

// ============ MEMORY LEAK PREVENTION ============

// Observer pattern with automatic cleanup
class EventEmitter {
  constructor() {
    this.activeListeners = new WeakSet();
    this.listenerMap = new WeakMap();
  }
  
  addListener(listenerObj) {
    if (typeof listenerObj !== 'object') {
      throw new Error('Listener must be an object');
    }
    
    this.activeListeners.add(listenerObj);
    
    if (!this.listenerMap.has(listenerObj)) {
      this.listenerMap.set(listenerObj, {
        addedAt: Date.now(),
        eventCount: 0,
        lastEvent: null
      });
    }
  }
  
  removeListener(listenerObj) {
    const removed = this.activeListeners.delete(listenerObj);
    if (removed) {
      this.listenerMap.delete(listenerObj);
    }
    return removed;
  }
  
  hasListener(listenerObj) {
    return this.activeListeners.has(listenerObj);
  }
  
  emit(eventData) {
    // Note: Since WeakSet is not iterable, in practice you'd need
    // to maintain a separate iterable collection or use a different approach
    console.log(\`Event emitted: \${JSON.stringify(eventData)}\`);
    
    // This is a conceptual example - in practice you'd track listeners differently
    // while still using WeakSet for memory management benefits
  }
}

// Usage
const emitter = new EventEmitter();
const listener1 = { 
  name: 'DatabaseLogger',
  handle: (data) => console.log('DB:', data)
};
const listener2 = {
  name: 'FileLogger', 
  handle: (data) => console.log('File:', data)
};

emitter.addListener(listener1);
emitter.addListener(listener2);

console.log(emitter.hasListener(listener1)); // true
emitter.removeListener(listener1);
console.log(emitter.hasListener(listener1)); // false

// ============ CACHE INVALIDATION PATTERNS ============

// Use WeakSet to track cache invalidation
const cacheValidItems = new WeakSet();
const cacheInvalidItems = new WeakSet();

class CacheManager {
  static markValid(item) {
    cacheValidItems.add(item);
    cacheInvalidItems.delete(item);
  }
  
  static markInvalid(item) {
    cacheInvalidItems.add(item);
    cacheValidItems.delete(item);
  }
  
  static isValid(item) {
    return cacheValidItems.has(item);
  }
  
  static isInvalid(item) {
    return cacheInvalidItems.has(item);
  }
  
  static invalidateRelated(item, relatedItems = []) {
    // Invalidate the item itself
    this.markInvalid(item);
    
    // Invalidate related items
    relatedItems.forEach(related => this.markInvalid(related));
  }
  
  static getCacheStatus(item) {
    if (this.isValid(item)) return 'valid';
    if (this.isInvalid(item)) return 'invalid';
    return 'unknown';
  }
}

// Usage example
const product1 = { id: 1, name: 'Laptop', price: 999 };
const product2 = { id: 2, name: 'Mouse', price: 25 };
const category = { id: 1, name: 'Electronics', products: [product1, product2] };

// Initially mark items as valid
CacheManager.markValid(product1);
CacheManager.markValid(product2);
CacheManager.markValid(category);

console.log('Product1 status:', CacheManager.getCacheStatus(product1)); // valid

// Invalidate product and related category
CacheManager.invalidateRelated(product1, [category]);

console.log('Product1 status:', CacheManager.getCacheStatus(product1)); // invalid
console.log('Category status:', CacheManager.getCacheStatus(category)); // invalid
console.log('Product2 status:', CacheManager.getCacheStatus(product2)); // valid

// ============ WEAKSET UTILITY FUNCTIONS ============

// Create a tracking utility
function createObjectTracker(name = 'ObjectTracker') {
  const trackedSet = new WeakSet();
  const metadata = new WeakMap();
  
  return {
    track(obj, data = {}) {
      trackedSet.add(obj);
      metadata.set(obj, {
        ...data,
        trackedAt: Date.now(),
        trackedBy: name
      });
    },
    
    untrack(obj) {
      const wasTracked = trackedSet.delete(obj);
      if (wasTracked) {
        metadata.delete(obj);
      }
      return wasTracked;
    },
    
    isTracked(obj) {
      return trackedSet.has(obj);
    },
    
    getMetadata(obj) {
      return metadata.get(obj);
    },
    
    updateMetadata(obj, updates) {
      if (trackedSet.has(obj)) {
        const current = metadata.get(obj);
        metadata.set(obj, { ...current, ...updates, updatedAt: Date.now() });
        return true;
      }
      return false;
    }
  };
}

// Usage
const userTracker = createObjectTracker('UserTracker');
const sessionTracker = createObjectTracker('SessionTracker');

const user = { id: 1, name: 'Alice' };
const session = { id: 'sess_123', userId: 1 };

userTracker.track(user, { role: 'admin', department: 'IT' });
sessionTracker.track(session, { loginTime: Date.now(), ip: '192.168.1.1' });

console.log(userTracker.isTracked(user)); // true
console.log(userTracker.getMetadata(user)); // {role: 'admin', department: 'IT', ...}

userTracker.updateMetadata(user, { lastActivity: Date.now() });
console.log(userTracker.getMetadata(user)); // Updated metadata

// Object relationship tracker
function createRelationshipTracker() {
  const parents = new WeakSet();
  const children = new WeakSet();
  const relationships = new WeakMap();
  
  return {
    setParent(obj, parent) {
      parents.add(parent);
      children.add(obj);
      
      if (!relationships.has(obj)) {
        relationships.set(obj, { parents: new Set(), children: new Set() });
      }
      if (!relationships.has(parent)) {
        relationships.set(parent, { parents: new Set(), children: new Set() });
      }
      
      relationships.get(obj).parents.add(parent);
      relationships.get(parent).children.add(obj);
    },
    
    isParent(obj) {
      return parents.has(obj);
    },
    
    isChild(obj) {
      return children.has(obj);
    },
    
    getRelationships(obj) {
      return relationships.get(obj) || { parents: new Set(), children: new Set() };
    },
    
    hasRelationship(obj) {
      return relationships.has(obj);
    }
  };
}

// Multi-state object tracker
function createStateTracker(states = ['active', 'inactive', 'processing']) {
  const stateSets = {};
  states.forEach(state => {
    stateSets[state] = new WeakSet();
  });
  
  return {
    setState(obj, state) {
      if (!states.includes(state)) {
        throw new Error(\`Invalid state: \${state}\`);
      }
      
      // Remove from all other states
      Object.values(stateSets).forEach(set => set.delete(obj));
      
      // Add to new state
      stateSets[state].add(obj);
    },
    
    getState(obj) {
      for (const state of states) {
        if (stateSets[state].has(obj)) {
          return state;
        }
      }
      return null;
    },
    
    hasState(obj, state) {
      return stateSets[state] && stateSets[state].has(obj);
    },
    
    removeFromAllStates(obj) {
      Object.values(stateSets).forEach(set => set.delete(obj));
    }
  };
}

// Usage
const stateTracker = createStateTracker(['draft', 'published', 'archived']);
const article1 = { id: 1, title: 'Article 1' };
const article2 = { id: 2, title: 'Article 2' };

stateTracker.setState(article1, 'draft');
stateTracker.setState(article2, 'published');

console.log(stateTracker.getState(article1)); // 'draft'
console.log(stateTracker.hasState(article2, 'published')); // true

stateTracker.setState(article1, 'published');
console.log(stateTracker.getState(article1)); // 'published'

// ============ DEBUGGING AND DEVELOPMENT ============

// Debug WeakSet operations (for development)
function createDebugWeakSet(name = 'WeakSet') {
  const set = new WeakSet();
  const debugInfo = { 
    name, 
    operations: 0, 
    adds: 0, 
    deletes: 0, 
    checks: 0,
    objects: new Set() // For debugging only - tracks object references
  };
  
  return {
    add(obj) {
      debugInfo.operations++;
      debugInfo.adds++;
      debugInfo.objects.add(obj);
      console.log(\`[\${name}] ADD operation #\${debugInfo.operations}\`);
      return set.add(obj);
    },
    
    has(obj) {
      debugInfo.operations++;
      debugInfo.checks++;
      const exists = set.has(obj);
      console.log(\`[\${name}] HAS operation #\${debugInfo.operations}: \${exists}\`);
      return exists;
    },
    
    delete(obj) {
      debugInfo.operations++;
      debugInfo.deletes++;
      const deleted = set.delete(obj);
      if (deleted) {
        debugInfo.objects.delete(obj);
      }
      console.log(\`[\${name}] DELETE operation #\${debugInfo.operations}: \${deleted ? 'SUCCESS' : 'FAILED'}\`);
      return deleted;
    },
    
    getDebugInfo() {
      return {
        ...debugInfo,
        approximateSize: debugInfo.objects.size
      };
    },
    
    // Development only - don't use in production
    _getTrackedObjects() {
      return Array.from(debugInfo.objects);
    }
  };
}

// Usage
const debugSet = createDebugWeakSet('ProcessingTracker');
const testObj1 = { id: 1 };
const testObj2 = { id: 2 };

debugSet.add(testObj1);
debugSet.add(testObj2);
debugSet.has(testObj1);
debugSet.delete(testObj1);
debugSet.has(testObj1);

console.log('Debug info:', debugSet.getDebugInfo());`}
      useCases={[
        "Object processing tracking",
        "Circular reference prevention",
        "DOM element lifecycle management",
        "Object validation and filtering",
        "Memory leak prevention",
        "Cache invalidation tracking",
        "Event listener cleanup",
        "State management for objects",
        "Object relationship tracking",
        "Garbage collection optimization"
      ]}
    />
  )
}