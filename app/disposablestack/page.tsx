import ObjectPage from '../components/ObjectPage';

export default function DisposableStackPage() {
  return (
    <ObjectPage
      title="DisposableStack"
      description="The DisposableStack object provides a way to manage multiple disposable resources and ensure they are properly cleaned up."
      overview="DisposableStack is a utility for managing multiple disposable resources (objects that implement the Disposable interface). It automatically calls the dispose() method on all registered resources when the stack itself is disposed. This is useful for managing file handles, database connections, timers, event listeners, and other resources that need cleanup. The stack follows the LIFO (Last In, First Out) order for disposal, ensuring proper cleanup order. DisposableStack is part of the ECMAScript proposal for resource management."
      syntax={`// Creating a DisposableStack
const stack = new DisposableStack();

// Adding disposable resources
const resource1 = {
  dispose() {
    console.log('Disposing resource 1');
  }
};

const resource2 = {
  dispose() {
    console.log('Disposing resource 2');
  }
};

// Register resources with the stack
stack.use(resource1);
stack.use(resource2);

// When the stack is disposed, all resources are cleaned up in reverse order
stack.dispose();
// Output:
// Disposing resource 2
// Disposing resource 1

// Using with try-finally pattern
async function processWithResources() {
  const stack = new DisposableStack();
  
  try {
    // Add resources to the stack
    const fileHandle = await stack.use(openFile('data.txt'));
    const dbConnection = await stack.use(connectToDatabase());
    const timer = await stack.use(setInterval(() => console.log('tick'), 1000));
    
    // Use the resources
    const data = await fileHandle.read();
    await dbConnection.query('SELECT * FROM users');
    
    return data;
  } finally {
    // All resources are automatically disposed
    stack.dispose();
  }
}

// File handling example
async function readMultipleFiles(fileNames) {
  const stack = new DisposableStack();
  
  try {
    const fileHandles = [];
    
    for (const fileName of fileNames) {
      const handle = await stack.use(openFile(fileName));
      fileHandles.push(handle);
    }
    
    // Read all files
    const contents = await Promise.all(
      fileHandles.map(handle => handle.read())
    );
    
    return contents;
  } finally {
    stack.dispose(); // All file handles are closed
  }
}

// Database connection management
async function executeDatabaseTransaction() {
  const stack = new DisposableStack();
  
  try {
    const connection = await stack.use(connectToDatabase());
    const transaction = await stack.use(connection.beginTransaction());
    
    // Execute queries within transaction
    await transaction.execute('INSERT INTO users (name) VALUES (?)', ['John']);
    await transaction.execute('UPDATE users SET last_login = NOW() WHERE name = ?', ['John']);
    
    await transaction.commit();
    return { success: true };
  } catch (error) {
    // Transaction will be rolled back automatically
    console.error('Transaction failed:', error);
    return { success: false, error: error.message };
  } finally {
    stack.dispose(); // Connection and transaction are cleaned up
  }
}

// Event listener management
function createEventManager() {
  const stack = new DisposableStack();
  
  const button = document.getElementById('myButton');
  const input = document.getElementById('myInput');
  
  // Add event listeners
  const buttonListener = stack.use({
    dispose() {
      button.removeEventListener('click', handleClick);
    }
  });
  
  const inputListener = stack.use({
    dispose() {
      input.removeEventListener('input', handleInput);
    }
  });
  
  button.addEventListener('click', handleClick);
  input.addEventListener('input', handleInput);
  
  function handleClick() {
    console.log('Button clicked');
  }
  
  function handleInput() {
    console.log('Input changed');
  }
  
  // Return a function to dispose all listeners
  return () => stack.dispose();
}

// Timer management
function createTimers() {
  const stack = new DisposableStack();
  
  // Create multiple timers
  const interval1 = stack.use(setInterval(() => console.log('Timer 1'), 1000));
  const interval2 = stack.use(setInterval(() => console.log('Timer 2'), 2000));
  const timeout = stack.use(setTimeout(() => console.log('Timeout'), 5000));
  
  // Return a function to clear all timers
  return () => stack.dispose();
}

// WebSocket connection management
async function createWebSocketConnection(url) {
  const stack = new DisposableStack();
  
  try {
    const socket = new WebSocket(url);
    
    // Wrap WebSocket in a disposable object
    const disposableSocket = stack.use({
      dispose() {
        if (socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      }
    });
    
    // Set up event handlers
    socket.onopen = () => console.log('WebSocket connected');
    socket.onmessage = (event) => console.log('Received:', event.data);
    socket.onerror = (error) => console.error('WebSocket error:', error);
    
    // Wait for connection to open
    await new Promise((resolve, reject) => {
      socket.onopen = resolve;
      socket.onerror = reject;
    });
    
    return socket;
  } catch (error) {
    stack.dispose(); // Clean up on error
    throw error;
  }
}

// Custom disposable resource
class DatabaseConnection {
  constructor(connectionString) {
    this.connectionString = connectionString;
    this.isConnected = false;
  }
  
  async connect() {
    console.log('Connecting to database...');
    // Simulate connection
    await new Promise(resolve => setTimeout(resolve, 100));
    this.isConnected = true;
    console.log('Connected to database');
  }
  
  async query(sql, params = []) {
    if (!this.isConnected) {
      throw new Error('Not connected to database');
    }
    console.log('Executing query:', sql, params);
    return { rows: [] };
  }
  
  dispose() {
    if (this.isConnected) {
      console.log('Disconnecting from database...');
      this.isConnected = false;
    }
  }
}

// Using custom disposable resource
async function useDatabase() {
  const stack = new DisposableStack();
  
  try {
    const db = new DatabaseConnection('postgresql://localhost/mydb');
    stack.use(db);
    
    await db.connect();
    const result = await db.query('SELECT * FROM users');
    
    return result;
  } finally {
    stack.dispose(); // Database connection is closed
  }
}

// Resource pooling with DisposableStack
class ResourcePool {
  constructor() {
    this.resources = [];
    this.stack = new DisposableStack();
  }
  
  async acquire() {
    const resource = await this.createResource();
    this.stack.use(resource);
    this.resources.push(resource);
    return resource;
  }
  
  async createResource() {
    // Simulate resource creation
    await new Promise(resolve => setTimeout(resolve, 50));
    return {
      id: Math.random().toString(36).substr(2, 9),
      dispose() {
        console.log('Disposing resource:', this.id);
      }
    };
  }
  
  dispose() {
    this.stack.dispose();
    this.resources = [];
  }
}

// Using resource pool
async function useResourcePool() {
  const pool = new ResourcePool();
  
  try {
    const resource1 = await pool.acquire();
    const resource2 = await pool.acquire();
    
    console.log('Using resources:', resource1.id, resource2.id);
    
    // Do work with resources
    await new Promise(resolve => setTimeout(resolve, 1000));
    
  } finally {
    pool.dispose(); // All resources are disposed
  }
}

// Practical example: File processing with multiple resources
async function processFilesWithResources(filePaths) {
  const stack = new DisposableStack();
  
  try {
    const results = [];
    
    for (const filePath of filePaths) {
      // Open file
      const fileHandle = await stack.use(openFile(filePath));
      
      // Create temporary output file
      const tempFile = await stack.use(createTempFile());
      
      // Process file content
      const content = await fileHandle.read();
      const processed = await processContent(content);
      
      // Write to temp file
      await tempFile.write(processed);
      
      results.push({
        input: filePath,
        output: tempFile.path,
        processed: processed
      });
    }
    
    return results;
  } finally {
    // All file handles and temp files are cleaned up
    stack.dispose();
  }
}

// Helper functions (simulated)
async function openFile(path) {
  console.log('Opening file:', path);
  return {
    async read() {
      return 'file content';
    },
    dispose() {
      console.log('Closing file:', path);
    }
  };
}

async function createTempFile() {
  const path = '/tmp/' + Math.random().toString(36).substr(2, 9);
  console.log('Creating temp file:', path);
  return {
    path,
    async write(content) {
      console.log('Writing to temp file:', path);
    },
    dispose() {
      console.log('Deleting temp file:', path);
    }
  };
}

async function processContent(content) {
  return content.toUpperCase();
}

// Example usage
const filePaths = ['file1.txt', 'file2.txt', 'file3.txt'];
processFilesWithResources(filePaths).then(results => {
  console.log('Processing complete:', results);
});`}
      useCases={[
        "Resource management and cleanup",
        "File handle management",
        "Database connection pooling",
        "Event listener cleanup",
        "Timer and interval management",
        "WebSocket connection handling",
        "Memory leak prevention",
        "Automatic resource disposal"
      ]}
    />
  );
}