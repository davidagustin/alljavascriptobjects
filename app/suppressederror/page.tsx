import ObjectPage from '../components/ObjectPage';

export default function SuppressedErrorPage() {
  return (
    <ObjectPage
      title="SuppressedError"
      description="The SuppressedError represents an error that occurs when an error is suppressed during the disposal of resources using the Explicit Resource Management API."
      overview="SuppressedError is part of the Explicit Resource Management proposal (Stage 3). It occurs when an error happens during resource disposal and another error was already thrown. The original error is stored in the 'error' property while the disposal error is in the 'suppressed' property. This ensures no errors are lost when using 'using' declarations or DisposableStack. SuppressedError helps maintain error context in resource cleanup scenarios."
      syntax={`// SuppressedError with using declarations (Stage 3 proposal)
// Note: This requires JavaScript engine support for the using keyword

// Basic SuppressedError creation
const originalError = new Error("Original error");
const suppressedError = new Error("Error during cleanup");
const suppressed = new SuppressedError(suppressedError, originalError, "Resource disposal failed");

console.log(suppressed.error); // Error: Original error
console.log(suppressed.suppressed); // Error: Error during cleanup
console.log(suppressed.message); // "Resource disposal failed"

// Simulating disposal with errors
class DatabaseConnection {
  constructor(url) {
    this.url = url;
    this.connected = true;
    console.log(\`Connected to \${url}\`);
  }
  
  query(sql) {
    if (!this.connected) {
      throw new Error("Connection is closed");
    }
    // Simulate query error
    if (sql.includes("ERROR")) {
      throw new Error("Query failed: " + sql);
    }
    return "Query result";
  }
  
  [Symbol.dispose]() {
    console.log("Disposing connection...");
    // Simulate disposal error
    if (Math.random() > 0.5) {
      throw new Error("Failed to close connection properly");
    }
    this.connected = false;
    console.log("Connection closed");
  }
}

// Using with DisposableStack
function handleWithDisposableStack() {
  const stack = new DisposableStack();
  
  try {
    const conn = stack.use(new DatabaseConnection("db://localhost"));
    
    // This will throw an error
    conn.query("SELECT ERROR FROM table");
  } catch (error) {
    if (error instanceof SuppressedError) {
      console.error("Original error:", error.error);
      console.error("Suppressed error:", error.suppressed);
    } else {
      console.error("Error:", error);
    }
  } finally {
    // Disposal happens here
    stack.dispose();
  }
}

// Manual SuppressedError handling pattern
class ResourceManager {
  constructor() {
    this.resources = [];
  }
  
  addResource(resource) {
    this.resources.push(resource);
  }
  
  dispose() {
    let originalError = null;
    const disposalErrors = [];
    
    for (const resource of this.resources) {
      try {
        if (typeof resource[Symbol.dispose] === 'function') {
          resource[Symbol.dispose]();
        } else if (typeof resource.dispose === 'function') {
          resource.dispose();
        } else if (typeof resource.close === 'function') {
          resource.close();
        }
      } catch (error) {
        if (!originalError) {
          originalError = error;
        } else {
          disposalErrors.push(error);
        }
      }
    }
    
    if (originalError) {
      if (disposalErrors.length > 0) {
        // Create SuppressedError chain
        let suppressed = originalError;
        for (const error of disposalErrors) {
          suppressed = new SuppressedError(error, suppressed, "Multiple disposal errors");
        }
        throw suppressed;
      }
      throw originalError;
    }
  }
}

// Example usage
const manager = new ResourceManager();
manager.addResource({ dispose: () => console.log("Resource 1 disposed") });
manager.addResource({ dispose: () => { throw new Error("Resource 2 disposal failed"); } });
manager.addResource({ dispose: () => { throw new Error("Resource 3 disposal failed"); } });

try {
  manager.dispose();
} catch (error) {
  if (error instanceof SuppressedError) {
    console.log("Caught SuppressedError");
    let current = error;
    while (current) {
      console.log("Error:", current.message);
      current = current.suppressed;
    }
  }
}

// Error recovery pattern
function processWithRecovery() {
  let primaryError = null;
  let cleanupError = null;
  
  try {
    // Main operation that might fail
    throw new Error("Primary operation failed");
  } catch (error) {
    primaryError = error;
  } finally {
    try {
      // Cleanup that might also fail
      throw new Error("Cleanup failed");
    } catch (error) {
      cleanupError = error;
    }
  }
  
  if (primaryError && cleanupError) {
    throw new SuppressedError(cleanupError, primaryError, "Operation failed with cleanup error");
  } else if (primaryError) {
    throw primaryError;
  } else if (cleanupError) {
    throw cleanupError;
  }
}

try {
  processWithRecovery();
} catch (error) {
  if (error instanceof SuppressedError) {
    console.log("Both operations failed:");
    console.log("- Primary:", error.error.message);
    console.log("- Cleanup:", error.suppressed.message);
  }
}`}
      useCases={[
        "Explicit Resource Management",
        "DisposableStack error handling",
        "Using declaration cleanup errors",
        "Database connection cleanup",
        "File handle disposal",
        "Network resource cleanup",
        "Transaction rollback errors",
        "Multi-resource disposal patterns"
      ]}
      browserSupport="SuppressedError is part of the Explicit Resource Management proposal (Stage 3). Check browser compatibility as it may not be available in all environments yet."
    />
  );
}