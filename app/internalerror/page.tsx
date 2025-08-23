import ObjectPage from '../components/ObjectPage';

export default function InternalErrorPage() {
  return (
    <ObjectPage
      title="InternalError"
      description="InternalError represents an error that occurs internally in the JavaScript engine. This is a non-standard error type specific to SpiderMonkey (Firefox)."
      overview="InternalError is a non-standard error type used by the SpiderMonkey JavaScript engine (Firefox) to indicate internal engine errors. It typically occurs in situations like excessive recursion beyond what RangeError handles, or when the JavaScript engine encounters an internal limitation. This error is not part of the ECMAScript specification and should not be relied upon for cross-browser compatibility. In production code, you should catch generic Error types instead."
      syntax={`// InternalError is non-standard (Firefox/SpiderMonkey only)
// It's thrown automatically by the engine in certain situations

// Example situations that may cause InternalError:

// 1. Excessive recursion (beyond normal stack limits)
function causeInternalError() {
  try {
    // This might cause InternalError in Firefox
    // or RangeError in other browsers
    function recurse() {
      recurse();
    }
    recurse();
  } catch (error) {
    if (error.name === 'InternalError') {
      console.log('InternalError caught (Firefox)');
      console.log('Message:', error.message);
    } else if (error instanceof RangeError) {
      console.log('RangeError caught (other browsers)');
      console.log('Message:', error.message);
    }
  }
}

// 2. Engine limitation example
// Some operations might hit internal engine limits
try {
  // Creating extremely deep object nesting
  let obj = {};
  let current = obj;
  for (let i = 0; i < 1000000; i++) {
    current.next = {};
    current = current.next;
  }
} catch (error) {
  console.log('Error type:', error.name);
  console.log('Message:', error.message);
}

// Cross-browser error handling pattern
function handleCrossBrowserError(fn) {
  try {
    return fn();
  } catch (error) {
    // Check for various error types
    switch (error.name) {
      case 'InternalError':
        console.log('Internal engine error (Firefox)');
        break;
      case 'RangeError':
        console.log('Range/stack error');
        break;
      case 'TypeError':
        console.log('Type error');
        break;
      default:
        console.log('Unknown error:', error.name);
    }
    
    // Log the full error
    console.error(error);
    throw error; // Re-throw if needed
  }
}

// Detecting InternalError support
function hasInternalError() {
  return typeof window !== 'undefined' && 
         typeof window.InternalError !== 'undefined';
}

console.log('InternalError supported:', hasInternalError());

// Polyfill for other browsers (not recommended for production)
if (typeof InternalError === 'undefined') {
  // Create a custom InternalError for consistency
  window.InternalError = class InternalError extends Error {
    constructor(message) {
      super(message);
      this.name = 'InternalError';
    }
  };
}

// Example: Simulating internal errors
class EngineSimulator {
  constructor() {
    this.recursionLimit = 10000;
    this.recursionCount = 0;
  }
  
  checkRecursionLimit() {
    this.recursionCount++;
    if (this.recursionCount > this.recursionLimit) {
      // In Firefox, this might be InternalError
      // In other browsers, use RangeError
      if (typeof InternalError !== 'undefined') {
        throw new InternalError('too much recursion');
      } else {
        throw new RangeError('Maximum call stack size exceeded');
      }
    }
  }
  
  reset() {
    this.recursionCount = 0;
  }
}

// Usage
const engine = new EngineSimulator();

function recursiveFunction(n) {
  engine.checkRecursionLimit();
  if (n <= 0) return 0;
  return n + recursiveFunction(n - 1);
}

try {
  engine.reset();
  const result = recursiveFunction(20000); // Will exceed limit
  console.log('Result:', result);
} catch (error) {
  console.log('Caught error:', error.name);
  console.log('Message:', error.message);
}

// Best practice: Use generic error handling
function safeOperation(operation) {
  try {
    return {
      success: true,
      result: operation()
    };
  } catch (error) {
    // Don't rely on InternalError specifically
    return {
      success: false,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    };
  }
}

// Test various operations
const operations = [
  () => { throw new Error('Standard error'); },
  () => { throw new TypeError('Type mismatch'); },
  () => { throw new RangeError('Out of range'); },
  () => { 
    if (typeof InternalError !== 'undefined') {
      throw new InternalError('Internal issue');
    } else {
      throw new Error('Internal issue (simulated)');
    }
  }
];

operations.forEach((op, index) => {
  const result = safeOperation(op);
  console.log(\`Operation \${index + 1}:\`, result);
});`}
      useCases={[
        "Debugging Firefox-specific issues",
        "Catching engine-level errors",
        "Handling excessive recursion",
        "Detecting engine limitations",
        "Development and testing",
        "Engine-specific error handling",
        "Non-production debugging",
        "Browser compatibility testing"
      ]}
      browserSupport="InternalError is NON-STANDARD and only available in Firefox (SpiderMonkey engine). Do not use in production code. Use standard Error types for cross-browser compatibility."
    />
  );
}