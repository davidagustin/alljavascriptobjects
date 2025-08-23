import ObjectPage from '../components/ObjectPage'

export default function WeakMapPage() {
  return (
    <ObjectPage
      title="WeakMap"
      description="Represents a collection of key-value pairs with weak object references"
      overview="The WeakMap constructor creates WeakMap objects. WeakMaps are collections of key-value pairs where keys must be objects and are weakly referenced, allowing for automatic garbage collection when keys are no longer referenced elsewhere. This makes WeakMaps ideal for private data storage, caching, and memory management."
      syntax={`// ============ WEAKMAP CREATION ============

// Creating WeakMap
const weakMap = new WeakMap();
const obj1 = { id: 1, name: 'John' };
const obj2 = { id: 2, name: 'Jane' };
const obj3 = { id: 3, name: 'Bob' };

// WeakMaps only accept objects as keys
weakMap.set(obj1, 'Data for John');
weakMap.set(obj2, 'Data for Jane');
weakMap.set(obj3, { role: 'admin', permissions: ['read', 'write'] });

console.log(weakMap.get(obj1)); // 'Data for John'
console.log(weakMap.has(obj1)); // true

// WeakMap with iterable constructor parameter
const pairs = [
  [obj1, 'value1'],
  [obj2, 'value2']
];
const weakMap2 = new WeakMap(pairs);
console.log(weakMap2.get(obj1)); // 'value1'

// ============ WEAKMAP INSTANCE METHODS ============

// set(key, value) - Adds or updates an entry
const cache = new WeakMap();
const userObj = { name: 'Alice' };
const productObj = { name: 'Laptop' };

cache.set(userObj, { 
  lastLogin: new Date(),
  preferences: { theme: 'dark' },
  sessionData: { token: 'abc123' }
});

cache.set(productObj, {
  price: 999,
  inventory: 50,
  lastUpdated: Date.now()
});

// Method chaining (set returns the WeakMap)
const chainedMap = new WeakMap()
  .set(obj1, 'first')
  .set(obj2, 'second')
  .set(obj3, 'third');

// get(key) - Retrieves value for key
console.log(cache.get(userObj)); // { lastLogin: ..., preferences: ..., sessionData: ... }
console.log(cache.get(productObj)); // { price: 999, inventory: 50, lastUpdated: ... }
console.log(cache.get({})); // undefined (key doesn't exist)

// has(key) - Checks if key exists
console.log(cache.has(userObj)); // true
console.log(cache.has(productObj)); // true
console.log(cache.has({})); // false

// delete(key) - Removes entry
console.log(cache.delete(userObj)); // true (successfully deleted)
console.log(cache.delete(userObj)); // false (already deleted)
console.log(cache.has(userObj)); // false

// ============ WEAKMAP LIMITATIONS ============

const limitedMap = new WeakMap();
const key = { test: 'key' };
limitedMap.set(key, 'value');

// These properties/methods DON'T exist on WeakMap:
console.log(limitedMap.size); // undefined
console.log(typeof limitedMap.keys); // undefined
console.log(typeof limitedMap.values); // undefined
console.log(typeof limitedMap.entries); // undefined
console.log(typeof limitedMap.clear); // undefined
console.log(typeof limitedMap.forEach); // undefined

// WeakMap is NOT iterable
// for (let entry of limitedMap) {} // TypeError
// [...limitedMap] // TypeError

// Only objects can be keys (not primitives)
try {
  limitedMap.set('string', 'value'); // TypeError
} catch (error) {
  console.log('Primitive keys not allowed:', error.name);
}

try {
  limitedMap.set(42, 'value'); // TypeError  
} catch (error) {
  console.log('Number keys not allowed:', error.name);
}

// ============ PRIVATE DATA PATTERN ============

// Using WeakMap for truly private instance data
const privateData = new WeakMap();
const privateMethods = new WeakMap();

class User {
  constructor(name, email, password) {
    // Store private data
    privateData.set(this, {
      name,
      email,
      password: this.#hashPassword(password),
      createdAt: new Date(),
      loginAttempts: 0,
      isLocked: false
    });
    
    // Store private methods
    privateMethods.set(this, {
      validatePassword: (inputPassword) => {
        const data = privateData.get(this);
        return data.password === this.#hashPassword(inputPassword);
      },
      
      incrementLoginAttempts: () => {
        const data = privateData.get(this);
        data.loginAttempts++;
        if (data.loginAttempts >= 3) {
          data.isLocked = true;
        }
      },
      
      resetLoginAttempts: () => {
        const data = privateData.get(this);
        data.loginAttempts = 0;
        data.isLocked = false;
      }
    });
  }
  
  #hashPassword(password) {
    // Simple hash simulation
    return btoa(password + 'salt');
  }
  
  // Public methods
  getName() {
    return privateData.get(this).name;
  }
  
  getEmail() {
    return privateData.get(this).email;
  }
  
  getCreatedAt() {
    return privateData.get(this).createdAt;
  }
  
  login(password) {
    const data = privateData.get(this);
    const methods = privateMethods.get(this);
    
    if (data.isLocked) {
      return { success: false, message: 'Account locked' };
    }
    
    if (methods.validatePassword(password)) {
      methods.resetLoginAttempts();
      return { success: true, message: 'Login successful' };
    } else {
      methods.incrementLoginAttempts();
      return { 
        success: false, 
        message: \`Invalid password. \${3 - data.loginAttempts} attempts remaining\` 
      };
    }
  }
  
  changePassword(oldPassword, newPassword) {
    const data = privateData.get(this);
    const methods = privateMethods.get(this);
    
    if (methods.validatePassword(oldPassword)) {
      data.password = this.#hashPassword(newPassword);
      return { success: true, message: 'Password changed' };
    }
    
    return { success: false, message: 'Invalid current password' };
  }
  
  getLoginAttempts() {
    return privateData.get(this).loginAttempts;
  }
  
  isAccountLocked() {
    return privateData.get(this).isLocked;
  }
}

// Usage example
const user = new User('Alice Smith', 'alice@example.com', 'secret123');
console.log(user.getName()); // 'Alice Smith'
console.log(user.getEmail()); // 'alice@example.com'

// Private data is truly inaccessible
console.log(user.name); // undefined
console.log(user.password); // undefined
console.log(user.email); // undefined

// Login attempts
console.log(user.login('wrong')); // { success: false, message: 'Invalid password. 2 attempts remaining' }
console.log(user.login('wrong')); // { success: false, message: 'Invalid password. 1 attempts remaining' }
console.log(user.login('wrong')); // { success: false, message: 'Invalid password. 0 attempts remaining' }
console.log(user.login('secret123')); // { success: false, message: 'Account locked' }

// ============ CACHING AND MEMOIZATION ============

// WeakMap for caching expensive operations
const computationCache = new WeakMap();

function expensiveComputation(obj) {
  // Check cache first
  if (computationCache.has(obj)) {
    console.log('Cache hit!');
    return computationCache.get(obj);
  }
  
  console.log('Computing...');
  // Simulate expensive operation
  const result = {
    hash: obj.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0),
    processed: obj.name.toUpperCase(),
    timestamp: Date.now(),
    complexity: obj.name.length * Math.random()
  };
  
  // Store in cache
  computationCache.set(obj, result);
  return result;
}

const data1 = { name: 'Alice' };
const data2 = { name: 'Bob' };

console.log(expensiveComputation(data1)); // Computing... then result
console.log(expensiveComputation(data1)); // Cache hit! then cached result
console.log(expensiveComputation(data2)); // Computing... then result

// Object metadata storage
const elementMetadata = new WeakMap();

class DOMElementManager {
  static setMetadata(element, metadata) {
    elementMetadata.set(element, {
      ...metadata,
      createdAt: Date.now(),
      accessCount: 0
    });
  }
  
  static getMetadata(element) {
    const metadata = elementMetadata.get(element);
    if (metadata) {
      metadata.accessCount++;
      metadata.lastAccessed = Date.now();
    }
    return metadata;
  }
  
  static updateMetadata(element, updates) {
    const existing = elementMetadata.get(element);
    if (existing) {
      elementMetadata.set(element, { ...existing, ...updates });
    }
  }
  
  static hasMetadata(element) {
    return elementMetadata.has(element);
  }
  
  static removeMetadata(element) {
    return elementMetadata.delete(element);
  }
}

// Simulated DOM elements
const div1 = { tagName: 'DIV', id: 'container' };
const span1 = { tagName: 'SPAN', className: 'highlight' };

DOMElementManager.setMetadata(div1, { 
  component: 'Container',
  props: { width: 300, height: 200 }
});

DOMElementManager.setMetadata(span1, {
  component: 'Highlight',
  props: { color: 'yellow' }
});

console.log(DOMElementManager.getMetadata(div1));
console.log(DOMElementManager.getMetadata(span1));

// ============ OBSERVER PATTERN WITH WEAKMAP ============

const observers = new WeakMap();

class Observable {
  constructor() {
    observers.set(this, new Set());
  }
  
  addObserver(observer) {
    observers.get(this).add(observer);
  }
  
  removeObserver(observer) {
    return observers.get(this).delete(observer);
  }
  
  notify(data) {
    observers.get(this).forEach(observer => {
      if (typeof observer === 'function') {
        observer(data);
      } else if (observer.update) {
        observer.update(data);
      }
    });
  }
  
  getObserverCount() {
    return observers.get(this).size;
  }
}

class Subject extends Observable {
  constructor(name) {
    super();
    this.name = name;
    this.value = null;
  }
  
  setValue(value) {
    this.value = value;
    this.notify({ name: this.name, value, timestamp: Date.now() });
  }
}

// Usage
const subject = new Subject('Temperature');

const observer1 = (data) => console.log(\`Observer 1: \${data.name} = \${data.value}\`);
const observer2 = { 
  update: (data) => console.log(\`Observer 2: Temperature changed to \${data.value}°C\`)
};

subject.addObserver(observer1);
subject.addObserver(observer2);

subject.setValue(25); // Both observers notified
console.log(\`Observer count: \${subject.getObserverCount()}\`); // 2

subject.removeObserver(observer1);
subject.setValue(30); // Only observer2 notified

// ============ WEAKMAP UTILITY FUNCTIONS ============

// Registry for tracking object relationships
function createObjectRegistry() {
  const registry = new WeakMap();
  
  return {
    register(obj, data) {
      registry.set(obj, {
        ...data,
        registeredAt: Date.now(),
        id: Math.random().toString(36).substr(2, 9)
      });
    },
    
    get(obj) {
      return registry.get(obj);
    },
    
    has(obj) {
      return registry.has(obj);
    },
    
    update(obj, updates) {
      const existing = registry.get(obj);
      if (existing) {
        registry.set(obj, { ...existing, ...updates, updatedAt: Date.now() });
        return true;
      }
      return false;
    },
    
    unregister(obj) {
      return registry.delete(obj);
    }
  };
}

// Usage
const userRegistry = createObjectRegistry();
const user1 = { name: 'Alice' };
const user2 = { name: 'Bob' };

userRegistry.register(user1, { role: 'admin', department: 'IT' });
userRegistry.register(user2, { role: 'user', department: 'Sales' });

console.log(userRegistry.get(user1)); // { role: 'admin', department: 'IT', ... }
userRegistry.update(user1, { lastLogin: Date.now() });

// Event listener cleanup helper
function createEventManager() {
  const listeners = new WeakMap();
  
  return {
    addEventListener(target, event, handler, options) {
      if (!listeners.has(target)) {
        listeners.set(target, new Map());
      }
      
      const targetListeners = listeners.get(target);
      if (!targetListeners.has(event)) {
        targetListeners.set(event, new Set());
      }
      
      targetListeners.get(event).add({ handler, options });
      
      // Simulate addEventListener
      if (target.addEventListener) {
        target.addEventListener(event, handler, options);
      }
    },
    
    removeEventListener(target, event, handler) {
      const targetListeners = listeners.get(target);
      if (targetListeners && targetListeners.has(event)) {
        const eventListeners = targetListeners.get(event);
        for (const listener of eventListeners) {
          if (listener.handler === handler) {
            eventListeners.delete(listener);
            
            // Simulate removeEventListener
            if (target.removeEventListener) {
              target.removeEventListener(event, handler);
            }
            return true;
          }
        }
      }
      return false;
    },
    
    removeAllListeners(target) {
      const targetListeners = listeners.get(target);
      if (targetListeners) {
        for (const [event, eventListeners] of targetListeners) {
          for (const { handler } of eventListeners) {
            if (target.removeEventListener) {
              target.removeEventListener(event, handler);
            }
          }
        }
        listeners.delete(target);
      }
    },
    
    getListeners(target, event) {
      const targetListeners = listeners.get(target);
      if (targetListeners && targetListeners.has(event)) {
        return Array.from(targetListeners.get(event));
      }
      return [];
    }
  };
}

// ============ MEMORY MANAGEMENT PATTERNS ============

// Automatic cleanup pattern
function createAutoCleanupManager() {
  const resources = new WeakMap();
  
  return {
    track(obj, cleanup) {
      resources.set(obj, cleanup);
      
      // Register cleanup for when object is garbage collected
      if (typeof FinalizationRegistry !== 'undefined') {
        const registry = new FinalizationRegistry((cleanup) => {
          cleanup();
        });
        registry.register(obj, cleanup);
      }
    },
    
    cleanup(obj) {
      const cleanup = resources.get(obj);
      if (cleanup) {
        cleanup();
        resources.delete(obj);
        return true;
      }
      return false;
    },
    
    isTracked(obj) {
      return resources.has(obj);
    }
  };
}

// Weak reference cache with TTL
function createTTLWeakCache(defaultTTL = 5000) {
  const cache = new WeakMap();
  const timers = new WeakMap();
  
  return {
    set(key, value, ttl = defaultTTL) {
      // Clear existing timer
      const existingTimer = timers.get(key);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }
      
      cache.set(key, value);
      
      // Set expiration timer
      const timer = setTimeout(() => {
        cache.delete(key);
        timers.delete(key);
      }, ttl);
      
      timers.set(key, timer);
    },
    
    get(key) {
      return cache.get(key);
    },
    
    has(key) {
      return cache.has(key);
    },
    
    delete(key) {
      const timer = timers.get(key);
      if (timer) {
        clearTimeout(timer);
        timers.delete(key);
      }
      return cache.delete(key);
    }
  };
}

// Usage example
const ttlCache = createTTLWeakCache(1000); // 1 second TTL
const tempObj = { data: 'temporary' };

ttlCache.set(tempObj, 'This will expire in 1 second');
console.log(ttlCache.has(tempObj)); // true

setTimeout(() => {
  console.log(ttlCache.has(tempObj)); // false (expired)
}, 1500);

// ============ DEBUGGING AND DEVELOPMENT ============

// Development helper for WeakMap debugging
function createDebugWeakMap(name = 'WeakMap') {
  const map = new WeakMap();
  const debugInfo = { name, operations: 0, keys: new Set() };
  
  return {
    set(key, value) {
      debugInfo.operations++;
      debugInfo.keys.add(key);
      console.log(\`[\${name}] SET operation #\${debugInfo.operations}\`);
      return map.set(key, value);
    },
    
    get(key) {
      debugInfo.operations++;
      const value = map.get(key);
      console.log(\`[\${name}] GET operation #\${debugInfo.operations}: \${value ? 'HIT' : 'MISS'}\`);
      return value;
    },
    
    has(key) {
      debugInfo.operations++;
      const exists = map.has(key);
      console.log(\`[\${name}] HAS operation #\${debugInfo.operations}: \${exists}\`);
      return exists;
    },
    
    delete(key) {
      debugInfo.operations++;
      const deleted = map.delete(key);
      if (deleted) {
        debugInfo.keys.delete(key);
      }
      console.log(\`[\${name}] DELETE operation #\${debugInfo.operations}: \${deleted ? 'SUCCESS' : 'FAILED'}\`);
      return deleted;
    },
    
    getDebugInfo() {
      return {
        ...debugInfo,
        approximateSize: debugInfo.keys.size
      };
    }
  };
}

// Usage
const debugMap = createDebugWeakMap('UserCache');
const testUser = { id: 1 };

debugMap.set(testUser, 'user data');
debugMap.get(testUser);
debugMap.has(testUser);
console.log(debugMap.getDebugInfo());`}
      useCases={[
        "Private data storage for classes",
        "Object caching and memoization", 
        "DOM element metadata storage",
        "Observer pattern implementation",
        "Event listener management",
        "Memory leak prevention",
        "Object lifecycle tracking",
        "Temporary object associations",
        "Garbage collection optimization",
        "Registry and relationship tracking"
      ]}
    />
  )
}