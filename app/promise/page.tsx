import ObjectPage from '../components/ObjectPage'

export default function PromisePage() {
  return (
    <ObjectPage
      title="Promise"
      description="Represents the eventual completion of an asynchronous operation with comprehensive methods for handling async workflows"
      overview="The Promise constructor creates Promise objects representing the eventual completion (or failure) of an asynchronous operation. Promises provide a clean way to handle asynchronous code with methods for chaining, error handling, and combining multiple async operations. They form the foundation of modern JavaScript async/await syntax and are essential for managing API calls, file operations, timers, and any other asynchronous work."
      syntax={`// ============ CONSTRUCTOR ============
// Basic Promise constructor
const promise1 = new Promise((resolve, reject) => {
  // Executor function runs immediately
  console.log('Executor running');
  setTimeout(() => resolve('Success!'), 1000);
});

// Promise with immediate resolution
const promise2 = new Promise((resolve, reject) => {
  resolve('Immediate value');
});

// Promise with rejection
const promise3 = new Promise((resolve, reject) => {
  reject(new Error('Something went wrong'));
});

// Promise that uses both resolve and reject
const promise4 = new Promise((resolve, reject) => {
  const random = Math.random();
  if (random > 0.5) {
    resolve(\`Success: \${random}\`);
  } else {
    reject(\`Failed: \${random}\`);
  }
});

// ============ STATIC METHODS ============

// Promise.resolve() - creates resolved promise
const resolved1 = Promise.resolve('Direct value');
const resolved2 = Promise.resolve([1, 2, 3]);
const resolved3 = Promise.resolve(Promise.resolve('Nested')); // Flattens
console.log('Resolved:', await resolved1); // 'Direct value'

// Promise.reject() - creates rejected promise
const rejected1 = Promise.reject('Error message');
const rejected2 = Promise.reject(new Error('Error object'));
const rejected3 = Promise.reject({ code: 404, message: 'Not found' });

// Promise.all() - waits for all promises
const all1 = Promise.all([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
]);
console.log('All results:', await all1); // [1, 2, 3]

// Promise.all with mixed timing
const all2 = Promise.all([
  new Promise(resolve => setTimeout(() => resolve('First'), 300)),
  new Promise(resolve => setTimeout(() => resolve('Second'), 100)),
  new Promise(resolve => setTimeout(() => resolve('Third'), 200))
]);
console.log('All ordered:', await all2); // ['First', 'Second', 'Third']

// Promise.all fails fast on first rejection
const all3 = Promise.all([
  Promise.resolve('OK'),
  Promise.reject('Failed'),
  Promise.resolve('Also OK')
]).catch(err => console.log('All failed:', err)); // 'Failed'

// Promise.allSettled() - waits for all, doesn't fail fast
const allSettled1 = Promise.allSettled([
  Promise.resolve('Success'),
  Promise.reject('Error'),
  Promise.resolve('Another success')
]);
console.log('All settled:', await allSettled1);
// [{status: 'fulfilled', value: 'Success'},
//  {status: 'rejected', reason: 'Error'},
//  {status: 'fulfilled', value: 'Another success'}]

// Promise.any() - resolves with first success
const any1 = Promise.any([
  Promise.reject('Error 1'),
  Promise.reject('Error 2'),
  Promise.resolve('Success!'),
  Promise.resolve('Also success')
]);
console.log('Any result:', await any1); // 'Success!'

// Promise.any with all rejections throws AggregateError
const any2 = Promise.any([
  Promise.reject('Error 1'),
  Promise.reject('Error 2'),
  Promise.reject('Error 3')
]).catch(err => {
  console.log('All rejected:', err.errors); // ['Error 1', 'Error 2', 'Error 3']
});

// Promise.race() - settles with first to settle (resolve or reject)
const race1 = Promise.race([
  new Promise(resolve => setTimeout(() => resolve('Slow'), 1000)),
  new Promise(resolve => setTimeout(() => resolve('Fast'), 100)),
  new Promise(resolve => setTimeout(() => resolve('Medium'), 500))
]);
console.log('Race winner:', await race1); // 'Fast'

// Race with rejection
const race2 = Promise.race([
  new Promise((_, reject) => setTimeout(() => reject('Quick fail'), 50)),
  new Promise(resolve => setTimeout(() => resolve('Slow success'), 100))
]).catch(err => console.log('Race failed:', err)); // 'Quick fail'

// ============ INSTANCE METHODS ============

// then() - handles resolution
const thenExample = new Promise(resolve => resolve(10));
thenExample
  .then(value => {
    console.log('First then:', value); // 10
    return value * 2;
  })
  .then(value => {
    console.log('Second then:', value); // 20
    return value * 2;
  })
  .then(value => {
    console.log('Third then:', value); // 40
  });

// then() with two handlers (onFulfilled, onRejected)
const dualThen = new Promise((resolve, reject) => {
  Math.random() > 0.5 ? resolve('OK') : reject('Error');
});
dualThen.then(
  value => console.log('Success:', value),
  error => console.log('Failed:', error)
);

// catch() - handles rejection
const catchExample = new Promise((_, reject) => reject('Error!'));
catchExample
  .catch(error => {
    console.log('Caught:', error); // 'Error!'
    return 'Recovered';
  })
  .then(value => console.log('After catch:', value)); // 'Recovered'

// catch() in chain
Promise.resolve(10)
  .then(value => {
    throw new Error('Chain error');
  })
  .catch(error => {
    console.log('Chain caught:', error.message); // 'Chain error'
    return 'Handled';
  })
  .then(value => console.log('Continues:', value)); // 'Handled'

// finally() - runs regardless of outcome
const finallyExample = new Promise((resolve, reject) => {
  Math.random() > 0.5 ? resolve('Success') : reject('Failure');
});

finallyExample
  .then(value => console.log('Resolved:', value))
  .catch(error => console.log('Rejected:', error))
  .finally(() => {
    console.log('Cleanup - always runs');
    // finally doesn't receive or change the value
  });

// finally() preserves value/error
Promise.resolve('Value')
  .finally(() => {
    console.log('Finally 1');
    return 'ignored'; // Return value ignored
  })
  .then(value => console.log('Still:', value)); // 'Value'

// ============ CHAINING PATTERNS ============

// Sequential processing
function sequential() {
  return Promise.resolve(1)
    .then(value => value + 1) // 2
    .then(value => value * 2) // 4
    .then(value => value ** 2) // 16
    .then(value => {
      console.log('Final:', value);
      return value;
    });
}

// Branching chains
const base = Promise.resolve(100);
const branch1 = base.then(v => v * 2); // 200
const branch2 = base.then(v => v / 2); // 50
Promise.all([branch1, branch2]).then(console.log); // [200, 50]

// Error propagation
Promise.resolve('Start')
  .then(value => {
    throw new Error('Step 1 error');
  })
  .then(value => {
    // Skipped due to error
    console.log('Never runs');
  })
  .then(value => {
    // Also skipped
    console.log('Also never runs');
  })
  .catch(error => {
    console.log('Caught at end:', error.message);
    return 'Recovered';
  })
  .then(value => {
    console.log('After recovery:', value); // 'Recovered'
  });

// ============ ASYNC/AWAIT PATTERNS ============

// Basic async function
async function basicAsync() {
  const result = await Promise.resolve('Async value');
  console.log(result); // 'Async value'
  return result;
}

// Error handling with try/catch
async function withErrorHandling() {
  try {
    const result = await Promise.reject('Async error');
  } catch (error) {
    console.log('Async caught:', error); // 'Async error'
  }
}

// Sequential async operations
async function sequentialAsync() {
  const val1 = await Promise.resolve(10);
  const val2 = await Promise.resolve(val1 * 2);
  const val3 = await Promise.resolve(val2 + 5);
  return val3; // 25
}

// Parallel async operations
async function parallelAsync() {
  // Don't await immediately - start all at once
  const p1 = Promise.resolve(10);
  const p2 = Promise.resolve(20);
  const p3 = Promise.resolve(30);
  
  // Now await all together
  const [r1, r2, r3] = await Promise.all([p1, p2, p3]);
  return r1 + r2 + r3; // 60
}

// ============ ADVANCED PATTERNS ============

// Promise wrapper for callbacks
function promisify(fn) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };
}

// Timeout promise
function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Promise with timeout
function promiseWithTimeout(promise, ms) {
  return Promise.race([
    promise,
    timeout(ms).then(() => {
      throw new Error('Timeout');
    })
  ]);
}

// Retry pattern
async function retry(fn, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await timeout(delay);
      console.log(\`Retry \${i + 1}/\${retries}\`);
    }
  }
}

// Sequential promise execution
async function runSequential(promises) {
  const results = [];
  for (const promise of promises) {
    results.push(await promise);
  }
  return results;
}

// Batched promise execution
async function runBatched(items, batchSize, processor) {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }
  return results;
}

// Promise queue with concurrency limit
class PromiseQueue {
  constructor(concurrency = 2) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }
  
  add(promiseFactory) {
    return new Promise((resolve, reject) => {
      this.queue.push({ promiseFactory, resolve, reject });
      this.process();
    });
  }
  
  async process() {
    if (this.running >= this.concurrency || this.queue.length === 0) {
      return;
    }
    
    this.running++;
    const { promiseFactory, resolve, reject } = this.queue.shift();
    
    try {
      const result = await promiseFactory();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      this.process();
    }
  }
}

// Usage examples
const queue = new PromiseQueue(2);
for (let i = 0; i < 5; i++) {
  queue.add(() => 
    timeout(Math.random() * 1000).then(() => \`Task \${i} done\`)
  ).then(console.log);
}

// ============ PROMISE STATES ============
// Promises have three states: pending, fulfilled, rejected
const pending = new Promise(() => {}); // Never settles
const fulfilled = Promise.resolve('value');
const rejected = Promise.reject('error');

// State inspection (not standard, but useful pattern)
function inspectPromise(promise) {
  const pending = { state: 'pending' };
  const inspect = Promise.race([promise, pending]);
  
  return inspect
    .then(
      value => value === pending ? 'pending' : { state: 'fulfilled', value },
      reason => ({ state: 'rejected', reason })
    );
}

// ============ PRACTICAL EXAMPLES ============

// 1. API fetch with error handling
async function fetchWithRetry(url, options = {}) {
  const { retries = 3, timeout = 5000, ...fetchOptions } = options;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }
      
      return await response.json();
    } catch (error) {
      console.log(\`Attempt \${attempt} failed:\`, error.message);
      
      if (attempt === retries) {
        throw new Error(\`Failed after \${retries} attempts: \${error.message}\`);
      }
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, attempt - 1) * 1000)
      );
    }
  }
}

// Example usage
fetchWithRetry('https://api.example.com/data')
  .then(data => console.log('API data:', data))
  .catch(error => console.error('API failed:', error));

// 2. File processing pipeline
async function processFiles(filePaths) {
  const results = [];
  
  for (const filePath of filePaths) {
    try {
      // Simulate file operations
      const content = await readFile(filePath);
      const processed = await processContent(content);
      const saved = await saveResult(processed, filePath + '.processed');
      
      results.push({ filePath, success: true, size: processed.length });
    } catch (error) {
      results.push({ filePath, success: false, error: error.message });
    }
  }
  
  return results;
}

// Helper functions (simulated)
function readFile(path) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) {
        resolve(\`Content of \${path}\`);
      } else {
        reject(new Error(\`Failed to read \${path}\`));
      }
    }, 100);
  });
}

function processContent(content) {
  return Promise.resolve(content.toUpperCase());
}

function saveResult(data, path) {
  return new Promise(resolve => {
    setTimeout(() => resolve(\`Saved to \${path}\`), 50);
  });
}

// 3. Parallel data fetching with fallbacks
async function fetchMultipleWithFallback(primaryUrls, fallbackUrls) {
  const results = await Promise.allSettled(
    primaryUrls.map(async (url, index) => {
      try {
        return await fetch(url).then(r => r.json());
      } catch (error) {
        console.log(\`Primary \${url} failed, trying fallback\`);
        return await fetch(fallbackUrls[index]).then(r => r.json());
      }
    })
  );
  
  return results.map((result, index) => ({
    index,
    success: result.status === 'fulfilled',
    data: result.status === 'fulfilled' ? result.value : null,
    error: result.status === 'rejected' ? result.reason : null
  }));
}

// 4. Rate-limited API calls
class RateLimiter {
  constructor(requestsPerSecond) {
    this.interval = 1000 / requestsPerSecond;
    this.lastRequest = 0;
    this.queue = [];
    this.processing = false;
  }
  
  async request(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.processQueue();
    });
  }
  
  async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequest;
      
      if (timeSinceLastRequest < this.interval) {
        await new Promise(resolve => 
          setTimeout(resolve, this.interval - timeSinceLastRequest)
        );
      }
      
      const { fn, resolve, reject } = this.queue.shift();
      this.lastRequest = Date.now();
      
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }
    
    this.processing = false;
  }
}

// Usage
const rateLimiter = new RateLimiter(2); // 2 requests per second

for (let i = 0; i < 5; i++) {
  rateLimiter.request(() => 
    fetch(\`/api/data/\${i}\`).then(r => r.json())
  ).then(data => console.log(\`Data \${i}:\`, data));
}

// 5. Promise-based event system
class EventPromise {
  constructor(target, eventType, options = {}) {
    this.target = target;
    this.eventType = eventType;
    this.options = options;
  }
  
  once() {
    return new Promise((resolve, reject) => {
      const handler = (event) => {
        cleanup();
        resolve(event);
      };
      
      const errorHandler = (error) => {
        cleanup();
        reject(error);
      };
      
      const cleanup = () => {
        this.target.removeEventListener(this.eventType, handler);
        if (this.options.timeout) {
          clearTimeout(timeoutId);
        }
      };
      
      this.target.addEventListener(this.eventType, handler, { once: true });
      
      if (this.options.timeout) {
        const timeoutId = setTimeout(() => {
          cleanup();
          reject(new Error(\`Event timeout: \${this.eventType}\`));
        }, this.options.timeout);
      }
    });
  }
  
  async *stream() {
    while (true) {
      yield await this.once();
    }
  }
}

// Usage (in browser environment)
// const clickPromise = new EventPromise(document.button, 'click');
// clickPromise.once().then(event => console.log('Button clicked!'));

// 6. Async iterator with promises
async function* asyncGenerator(items, processAsync) {
  for (const item of items) {
    yield await processAsync(item);
  }
}

// Process items one by one
async function processSequentially(items) {
  const results = [];
  for await (const result of asyncGenerator(items, async (item) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return item * 2;
  })) {
    results.push(result);
    console.log('Processed:', result);
  }
  return results;
}

// 7. Promise-based cache with TTL
class PromiseCache {
  constructor(ttl = 5000) {
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  async get(key, factory) {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.promise;
    }
    
    const promise = factory();
    this.cache.set(key, {
      promise,
      timestamp: Date.now()
    });
    
    // Clean up on resolution
    promise.finally(() => {
      const entry = this.cache.get(key);
      if (entry && entry.promise === promise) {
        setTimeout(() => this.cache.delete(key), this.ttl);
      }
    });
    
    return promise;
  }
  
  clear() {
    this.cache.clear();
  }
  
  has(key) {
    const cached = this.cache.get(key);
    return cached && Date.now() - cached.timestamp < this.ttl;
  }
}

// Usage
const cache = new PromiseCache(3000); // 3 second TTL

async function expensiveOperation(id) {
  console.log(\`Computing expensive operation for \${id}\`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return \`Result for \${id}\`;
}

// These will use cache if called within 3 seconds
cache.get('user:123', () => expensiveOperation('123'))
  .then(result => console.log('First call:', result));

cache.get('user:123', () => expensiveOperation('123'))
  .then(result => console.log('Second call (cached):', result));

// 8. Distributed promise coordination
class PromiseCoordinator {
  constructor() {
    this.promises = new Map();
    this.completions = new Map();
  }
  
  register(id, promise) {
    this.promises.set(id, promise);
    
    promise
      .then(result => this.completions.set(id, { success: true, result }))
      .catch(error => this.completions.set(id, { success: false, error }));
    
    return promise;
  }
  
  async waitForAll() {
    const results = await Promise.allSettled([...this.promises.values()]);
    return new Map([...this.promises.keys()].map((id, index) => [
      id, results[index]
    ]));
  }
  
  async waitForAny() {
    const [id] = await Promise.race(
      [...this.promises.entries()].map(async ([id, promise]) => {
        await promise;
        return id;
      })
    );
    return { id, result: this.completions.get(id) };
  }
  
  getStatus() {
    return {
      total: this.promises.size,
      completed: this.completions.size,
      pending: this.promises.size - this.completions.size
    };
  }
}

// Usage
const coordinator = new PromiseCoordinator();
coordinator.register('task1', timeout(100).then(() => 'Task 1 done'));
coordinator.register('task2', timeout(200).then(() => 'Task 2 done'));
coordinator.register('task3', timeout(300).then(() => 'Task 3 done'));

coordinator.waitForAll().then(results => {
  console.log('All tasks completed:', results);
});`}
      useCases={[
        "Asynchronous HTTP requests and API calls",
        "File system operations and data processing",
        "Event handling and user interactions",
        "Database transactions and queries", 
        "Image and media loading",
        "Timer-based operations and delays",
        "Parallel task execution and coordination",
        "Error handling and retry mechanisms",
        "Caching and memoization patterns",
        "Real-time data streaming",
        "Microservice communication",
        "Resource cleanup and disposal"
      ]}
    />
  )
}
