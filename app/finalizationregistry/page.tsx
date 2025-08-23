import ObjectPage from '../components/ObjectPage';

export default function FinalizationRegistryPage() {
  return (
    <ObjectPage
      title="FinalizationRegistry"
      description="FinalizationRegistry allows you to request a callback when an object is garbage collected."
      overview="FinalizationRegistry provides a way to register callbacks that will be executed after an object has been garbage collected. This is useful for cleanup operations like closing file handles, releasing resources, or logging. The callback receives a 'held value' that was associated with the object. FinalizationRegistry should be used sparingly as it can impact performance and the callback timing is non-deterministic. It's part of the WeakRefs proposal and works together with WeakRef for advanced memory management scenarios."
      syntax={`// Creating a FinalizationRegistry
const registry = new FinalizationRegistry((heldValue) => {
  console.log(\`Object with held value "\${heldValue}" was garbage collected\`);
});

// Registering objects for cleanup
let obj = { data: "important" };
registry.register(obj, "cleanup-id-1");

// Register with unregister token
let obj2 = { data: "temporary" };
const token = {};
registry.register(obj2, "cleanup-id-2", token);

// Later, you can unregister if needed
registry.unregister(token);

// Practical example: Resource cleanup
class ResourceManager {
  constructor() {
    this.resources = new Map();
    this.cleanupRegistry = new FinalizationRegistry((resourceId) => {
      console.log(\`Cleaning up resource: \${resourceId}\`);
      this.cleanup(resourceId);
    });
  }
  
  allocate(id, data) {
    const resource = { id, data, allocated: Date.now() };
    this.resources.set(id, new WeakRef(resource));
    this.cleanupRegistry.register(resource, id, resource);
    return resource;
  }
  
  cleanup(id) {
    // Perform cleanup operations
    console.log(\`Resource \${id} has been garbage collected\`);
    this.resources.delete(id);
  }
  
  get(id) {
    const ref = this.resources.get(id);
    if (ref) {
      const resource = ref.deref();
      if (resource) {
        return resource;
      } else {
        // Resource was garbage collected
        this.resources.delete(id);
      }
    }
    return null;
  }
}

// Cache with automatic cleanup
class AutoCleanupCache {
  constructor() {
    this.cache = new Map();
    this.registry = new FinalizationRegistry((key) => {
      console.log(\`Cache entry "\${key}" was garbage collected\`);
      this.cache.delete(key);
    });
  }
  
  set(key, value) {
    // Store a weak reference to the value
    const ref = new WeakRef(value);
    this.cache.set(key, ref);
    
    // Register for cleanup notification
    this.registry.register(value, key, value);
  }
  
  get(key) {
    const ref = this.cache.get(key);
    if (ref) {
      const value = ref.deref();
      if (value) {
        return value;
      } else {
        // Value was garbage collected
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
}

// File handle manager
class FileHandleManager {
  constructor() {
    this.handles = new Map();
    this.registry = new FinalizationRegistry((fileInfo) => {
      console.log(\`Auto-closing file: \${fileInfo.path}\`);
      this.closeFile(fileInfo);
    });
  }
  
  openFile(path) {
    const handle = {
      path,
      fd: Math.random(), // Simulated file descriptor
      opened: new Date()
    };
    
    const wrapper = {
      handle,
      read() {
        console.log(\`Reading from \${path}\`);
        return "file contents";
      },
      write(data) {
        console.log(\`Writing to \${path}: \${data}\`);
      }
    };
    
    this.handles.set(path, handle);
    this.registry.register(wrapper, { path, fd: handle.fd }, wrapper);
    
    return wrapper;
  }
  
  closeFile(fileInfo) {
    // Simulate file closing
    console.log(\`Closed file descriptor \${fileInfo.fd} for \${fileInfo.path}\`);
    this.handles.delete(fileInfo.path);
  }
}

// Usage examples
const manager = new ResourceManager();
let resource = manager.allocate("db-connection-1", { host: "localhost" });
console.log("Allocated:", resource);

// Resource will be cleaned up when garbage collected
resource = null; // Make eligible for GC

// Cache example
const cache = new AutoCleanupCache();
let data = { large: "data object" };
cache.set("key1", data);
console.log("Cached:", cache.get("key1"));
data = null; // Original reference removed

// File handle example
const fileManager = new FileHandleManager();
let file = fileManager.openFile("/tmp/test.txt");
file.write("Hello World");
file = null; // File handle will be auto-closed when GC'd

// Note: Garbage collection timing is non-deterministic
// These callbacks will run at some point after objects become unreachable
console.log("Objects registered for finalization");`}
      useCases={[
        "Automatic resource cleanup",
        "Memory leak detection",
        "Cache management",
        "File handle management",
        "Database connection cleanup",
        "WebGL resource management",
        "Native module cleanup",
        "Debugging and profiling"
      ]}
      browserSupport="FinalizationRegistry is supported in modern browsers but should be used carefully as it can impact performance. Not available in older browsers."
    />
  );
}