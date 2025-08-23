import ObjectPage from '../components/ObjectPage';

export default function GlobalThisPage() {
  return (
    <ObjectPage
      title="globalThis"
      description="The globalThis property contains the global this value, which is akin to the global object."
      overview="globalThis is a standardized way to access the global object across different JavaScript environments. It was introduced in ES2020 to solve the problem of accessing the global object consistently across browsers, Node.js, Web Workers, and other JavaScript environments. In browsers, globalThis refers to the Window object; in Node.js, it refers to the global object; and in Web Workers, it refers to the WorkerGlobalScope. globalThis is read-only and cannot be reassigned, making it a reliable way to access global properties and functions in cross-platform code."
      syntax={`// Basic globalThis usage
console.log(globalThis); // Window in browsers, global in Node.js

// Accessing global properties
globalThis.setTimeout(() => console.log('Hello'), 1000);
globalThis.console.log('Accessing console through globalThis');

// Setting global variables
globalThis.myGlobalVar = 'I am global';
console.log(myGlobalVar); // 'I am global'

// Cross-platform compatibility
function getGlobalObject() {
  // Old way - not reliable across environments
  if (typeof window !== 'undefined') return window;
  if (typeof global !== 'undefined') return global;
  if (typeof self !== 'undefined') return self;
  
  // New way - works everywhere
  return globalThis;
}

// Environment detection
function detectEnvironment() {
  if (globalThis.window && globalThis.document) {
    return 'browser';
  } else if (globalThis.process && globalThis.process.versions && globalThis.process.versions.node) {
    return 'node';
  } else if (globalThis.ServiceWorkerGlobalScope) {
    return 'service-worker';
  } else {
    return 'unknown';
  }
}

// Global state management
if (!globalThis.appState) {
  globalThis.appState = {
    user: null,
    theme: 'light',
    language: 'en'
  };
}

// Creating global utilities
function createGlobalUtility() {
  const global = globalThis;
  return {
    log: (...args) => global.console.log(...args),
    setTimeout: (fn, delay) => global.setTimeout(fn, delay),
    getRandomNumber: () => global.Math.random(),
    parseJSON: (str) => global.JSON.parse(str)
  };
}`}
      useCases={[
        "Cross-platform JavaScript development",
        "Accessing global objects consistently",
        "Environment detection and feature testing",
        "Global state management",
        "Creating universal utility functions",
        "Web worker communication",
        "Module system compatibility",
        "Polyfill and shim development"
      ]}
    />
  );
}
