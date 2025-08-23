import ObjectPage from '../components/ObjectPage'

export default function AsyncDisposableStackPage() {
  return (
    <ObjectPage
      title="AsyncDisposableStack"
      description="Manages a stack of async disposable resources for deterministic cleanup"
      overview="AsyncDisposableStack is part of the Explicit Resource Management proposal (Stage 3). It provides a way to manage multiple async resources that need cleanup, ensuring they are disposed in reverse order of acquisition (LIFO). This is the async version of DisposableStack, designed for resources that require asynchronous cleanup like database connections, network streams, or async file operations."
      syntax={`// === ASYNCDISPOSABLESTACK BASICS ===
// Note: AsyncDisposableStack is a Stage 3 proposal, may require polyfill

// Creating an AsyncDisposableStack
const stack = new AsyncDisposableStack();

// === ASYNC DISPOSABLE RESOURCES ===
// Resources must have Symbol.asyncDispose method
class AsyncFileHandle {
  constructor(filename) {
    this.filename = filename;
    this.isOpen = true;
    console.log(\`Opening \${filename}\`);
  }
  
  async [Symbol.asyncDispose]() {
    if (this.isOpen) {
      console.log(\`Async closing \${this.filename}\`);
      // Simulate async cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
      this.isOpen = false;
      console.log(\`Closed \${this.filename}\`);
    }
  }
  
  async read() {
    if (!this.isOpen) throw new Error('File is closed');
    // Simulate async read
    await new Promise(resolve => setTimeout(resolve, 50));
    return \`Contents of \${this.filename}\`;
  }
  
  async write(data) {
    if (!this.isOpen) throw new Error('File is closed');
    // Simulate async write
    await new Promise(resolve => setTimeout(resolve, 50));
    console.log(\`Writing to \${this.filename}: \${data}\`);
  }
}

// Adding async resources to the stack
async function useAsyncResources() {
  const stack = new AsyncDisposableStack();
  
  const file1 = stack.use(new AsyncFileHandle('data.txt'));
  const file2 = stack.use(new AsyncFileHandle('config.json'));
  const file3 = stack.use(new AsyncFileHandle('log.txt'));
  
  // Use the resources
  await file1.write('Hello');
  const content = await file2.read();
  console.log(content);
  
  // Resources are disposed in reverse order (LIFO)
  await stack.disposeAsync();
  // Output:
  // Async closing log.txt
  // Closed log.txt
  // Async closing config.json
  // Closed config.json
  // Async closing data.txt
  // Closed data.txt
}

// === DEFER METHOD FOR ASYNC CALLBACKS ===
async function asyncDeferExample() {
  const resources = new AsyncDisposableStack();
  
  resources.defer(async () => {
    console.log('Starting async cleanup task 1');
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('Finished async cleanup task 1');
  });
  
  resources.defer(async () => {
    console.log('Starting async cleanup task 2');
    await new Promise(resolve => setTimeout(resolve, 50));
    console.log('Finished async cleanup task 2');
  });
  
  resources.defer(async () => {
    console.log('Starting async cleanup task 3');
    await new Promise(resolve => setTimeout(resolve, 75));
    console.log('Finished async cleanup task 3');
  });
  
  // Callbacks execute in reverse order
  await resources.disposeAsync();
  // Output:
  // Starting async cleanup task 3
  // Finished async cleanup task 3
  // Starting async cleanup task 2
  // Finished async cleanup task 2
  // Starting async cleanup task 1
  // Finished async cleanup task 1
}

// === ADOPT METHOD FOR ASYNC CLEANUP ===
async function asyncAdoptExample() {
  const stack = new AsyncDisposableStack();
  
  // Adopt a value with an async disposal callback
  const connection = { 
    id: 'db-001', 
    active: true,
    query: async (sql) => {
      console.log(\`Executing: \${sql}\`);
      await new Promise(resolve => setTimeout(resolve, 100));
      return 'Query results';
    }
  };
  
  stack.adopt(connection, async (conn) => {
    console.log(\`Starting close for connection \${conn.id}\`);
    await new Promise(resolve => setTimeout(resolve, 200));
    conn.active = false;
    console.log(\`Connection \${conn.id} closed\`);
  });
  
  // Use the connection
  const result = await connection.query('SELECT * FROM users');
  console.log(result);
  
  await stack.disposeAsync();
}

// === DATABASE CONNECTION POOL ===
class AsyncDatabaseConnection {
  constructor(connectionString) {
    this.connectionString = connectionString;
    this.connected = false;
    this.transactionActive = false;
  }
  
  async connect() {
    console.log(\`Connecting to \${this.connectionString}...\`);
    await new Promise(resolve => setTimeout(resolve, 500));
    this.connected = true;
    console.log(\`Connected to \${this.connectionString}\`);
  }
  
  async [Symbol.asyncDispose]() {
    if (this.transactionActive) {
      await this.rollback();
    }
    if (this.connected) {
      console.log(\`Disconnecting from \${this.connectionString}...\`);
      await new Promise(resolve => setTimeout(resolve, 300));
      this.connected = false;
      console.log(\`Disconnected from \${this.connectionString}\`);
    }
  }
  
  async beginTransaction() {
    if (!this.connected) throw new Error('Not connected');
    console.log('Beginning transaction');
    await new Promise(resolve => setTimeout(resolve, 100));
    this.transactionActive = true;
  }
  
  async commit() {
    if (!this.transactionActive) throw new Error('No active transaction');
    console.log('Committing transaction');
    await new Promise(resolve => setTimeout(resolve, 150));
    this.transactionActive = false;
  }
  
  async rollback() {
    if (!this.transactionActive) return;
    console.log('Rolling back transaction');
    await new Promise(resolve => setTimeout(resolve, 100));
    this.transactionActive = false;
  }
  
  async query(sql) {
    if (!this.connected) throw new Error('Not connected');
    console.log(\`Executing query: \${sql}\`);
    await new Promise(resolve => setTimeout(resolve, 200));
    return \`Results for: \${sql}\`;
  }
}

// Using AsyncDisposableStack for transaction management
async function performAsyncDatabaseOperation() {
  const resources = new AsyncDisposableStack();
  
  try {
    // Create and connect to database
    const db = new AsyncDatabaseConnection('postgres://localhost');
    await db.connect();
    resources.use(db);
    
    // Begin transaction
    await db.beginTransaction();
    resources.defer(async () => {
      if (db.transactionActive) {
        console.log('Transaction cleanup: rolling back');
        await db.rollback();
      }
    });
    
    // Perform operations
    const result1 = await db.query('INSERT INTO users VALUES (1, "Alice")');
    const result2 = await db.query('UPDATE users SET name = "Bob" WHERE id = 2');
    
    // Commit on success
    await db.commit();
    console.log('Transaction completed successfully');
    
  } finally {
    // Ensure cleanup happens
    await resources.disposeAsync();
  }
}

// === NETWORK STREAM HANDLER ===
class AsyncNetworkStream {
  constructor(url) {
    this.url = url;
    this.stream = null;
    this.reader = null;
  }
  
  async open() {
    console.log(\`Opening stream to \${this.url}\`);
    // Simulate async stream opening
    await new Promise(resolve => setTimeout(resolve, 300));
    this.stream = { active: true };
    this.reader = { 
      read: async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
        return \`Data chunk from \${this.url}\`;
      }
    };
    console.log(\`Stream opened to \${this.url}\`);
  }
  
  async [Symbol.asyncDispose]() {
    if (this.reader) {
      console.log(\`Closing reader for \${this.url}\`);
      await new Promise(resolve => setTimeout(resolve, 100));
      this.reader = null;
    }
    if (this.stream) {
      console.log(\`Closing stream to \${this.url}\`);
      await new Promise(resolve => setTimeout(resolve, 200));
      this.stream = null;
      console.log(\`Stream closed for \${this.url}\`);
    }
  }
  
  async read() {
    if (!this.reader) throw new Error('Stream not open');
    return await this.reader.read();
  }
}

// Multiple async stream management
async function handleMultipleStreams() {
  const stack = new AsyncDisposableStack();
  
  try {
    // Open multiple streams
    const stream1 = new AsyncNetworkStream('https://api1.example.com');
    await stream1.open();
    stack.use(stream1);
    
    const stream2 = new AsyncNetworkStream('https://api2.example.com');
    await stream2.open();
    stack.use(stream2);
    
    const stream3 = new AsyncNetworkStream('https://api3.example.com');
    await stream3.open();
    stack.use(stream3);
    
    // Read from streams
    const data1 = await stream1.read();
    const data2 = await stream2.read();
    const data3 = await stream3.read();
    
    console.log('Data received from all streams');
    
  } finally {
    // All streams closed in reverse order
    await stack.disposeAsync();
  }
}

// === ASYNC CACHE WITH CLEANUP ===
class AsyncCacheWithCleanup {
  constructor() {
    this.cache = new Map();
    this.pendingWrites = [];
  }
  
  async [Symbol.asyncDispose]() {
    console.log('Flushing cache to storage...');
    
    // Flush all pending writes
    if (this.pendingWrites.length > 0) {
      await Promise.all(this.pendingWrites);
      this.pendingWrites = [];
    }
    
    // Persist cache to storage
    for (const [key, value] of this.cache.entries()) {
      console.log(\`Persisting \${key} to storage\`);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Clear cache
    this.cache.clear();
    console.log('Cache flushed and cleared');
  }
  
  async set(key, value) {
    this.cache.set(key, value);
    
    // Async write-through
    const writePromise = new Promise(async (resolve) => {
      await new Promise(r => setTimeout(r, 100));
      console.log(\`Async write-through for \${key}\`);
      resolve();
    });
    
    this.pendingWrites.push(writePromise);
  }
  
  get(key) {
    return this.cache.get(key);
  }
}

// === ERROR HANDLING WITH ASYNC DISPOSAL ===
class AsyncFailingResource {
  constructor(name, shouldFail = false) {
    this.name = name;
    this.shouldFail = shouldFail;
    console.log(\`Created async resource: \${name}\`);
  }
  
  async [Symbol.asyncDispose]() {
    console.log(\`Starting disposal of \${this.name}\`);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (this.shouldFail) {
      throw new Error(\`Failed to dispose \${this.name}\`);
    }
    
    console.log(\`Successfully disposed \${this.name}\`);
  }
}

async function handleAsyncDisposalErrors() {
  const stack = new AsyncDisposableStack();
  
  try {
    stack.use(new AsyncFailingResource('resource1', false));
    stack.use(new AsyncFailingResource('resource2', true)); // Will fail
    stack.use(new AsyncFailingResource('resource3', false));
    
    // Use resources...
    
    await stack.disposeAsync();
  } catch (error) {
    // Aggregates all disposal errors
    console.log('Disposal failed:', error);
    // All resources are still attempted to be disposed
  }
}

// === MOVE METHOD FOR OWNERSHIP TRANSFER ===
async function asyncMoveExample() {
  const stack1 = new AsyncDisposableStack();
  
  const file1 = stack1.use(new AsyncFileHandle('file1.txt'));
  const file2 = stack1.use(new AsyncFileHandle('file2.txt'));
  
  // Transfer ownership to new stack
  const stack2 = new AsyncDisposableStack();
  const movedStack = stack2.use(stack1.move());
  
  // Original stack is now empty
  console.log(stack1.disposed); // true
  
  // New stack owns the resources
  await stack2.disposeAsync();
}

// === WORKER THREAD MANAGEMENT ===
class AsyncWorkerThread {
  constructor(workerScript) {
    this.workerScript = workerScript;
    this.worker = null;
  }
  
  async start() {
    console.log(\`Starting worker: \${this.workerScript}\`);
    await new Promise(resolve => setTimeout(resolve, 200));
    this.worker = { 
      active: true,
      postMessage: (msg) => console.log(\`Worker received: \${msg}\`)
    };
    console.log(\`Worker started: \${this.workerScript}\`);
  }
  
  async [Symbol.asyncDispose]() {
    if (this.worker) {
      console.log(\`Terminating worker: \${this.workerScript}\`);
      await new Promise(resolve => setTimeout(resolve, 300));
      this.worker.active = false;
      this.worker = null;
      console.log(\`Worker terminated: \${this.workerScript}\`);
    }
  }
  
  postMessage(message) {
    if (!this.worker) throw new Error('Worker not started');
    this.worker.postMessage(message);
  }
}

// === USING AWAIT STATEMENT (FUTURE SYNTAX) ===
// Proposed 'using await' statement for automatic async resource management
/*
// Future JavaScript syntax (not yet available)
{
  await using const file = new AsyncFileHandle('data.txt');
  await using const db = new AsyncDatabaseConnection('postgres://localhost');
  
  await db.connect();
  await file.write('Hello');
  const data = await file.read();
  
} // Automatic async disposal here
*/

// Practical example combining multiple concepts
async function complexAsyncResourceManagement() {
  const mainStack = new AsyncDisposableStack();
  
  try {
    // Database connection
    const db = new AsyncDatabaseConnection('postgres://primary');
    await db.connect();
    mainStack.use(db);
    
    // Cache with cleanup
    const cache = mainStack.use(new AsyncCacheWithCleanup());
    
    // Worker threads
    const worker1 = new AsyncWorkerThread('worker1.js');
    await worker1.start();
    mainStack.use(worker1);
    
    const worker2 = new AsyncWorkerThread('worker2.js');
    await worker2.start();
    mainStack.use(worker2);
    
    // Network streams
    const apiStream = new AsyncNetworkStream('https://api.example.com');
    await apiStream.open();
    mainStack.use(apiStream);
    
    // Perform operations
    await db.beginTransaction();
    
    // Defer transaction cleanup
    mainStack.defer(async () => {
      if (db.transactionActive) {
        await db.rollback();
      }
    });
    
    // Use all resources
    worker1.postMessage('Process data');
    worker2.postMessage('Analyze results');
    
    const apiData = await apiStream.read();
    cache.set('apiData', apiData);
    
    const dbResult = await db.query('SELECT * FROM data');
    cache.set('dbResult', dbResult);
    
    await db.commit();
    
    console.log('All operations completed successfully');
    
  } finally {
    // Everything cleaned up in reverse order
    await mainStack.disposeAsync();
  }
}

// Run example
// complexAsyncResourceManagement().catch(console.error);`}
      useCases={[
        "Async database connection management",
        "Network stream cleanup",
        "Async file handle management",
        "Worker thread lifecycle",
        "WebSocket connection management",
        "Async transaction handling",
        "Cloud resource cleanup",
        "Async cache flushing",
        "Message queue cleanup",
        "Async lock management"
      ]}
    />
  )
}
