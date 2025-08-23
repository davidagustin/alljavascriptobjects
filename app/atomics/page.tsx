import ObjectPage from '../components/ObjectPage'

export default function AtomicsPage() {
  return (
    <ObjectPage
      title="Atomics"
      description="Provides atomic operations on shared memory"
      overview="The Atomics object provides atomic operations on shared memory. It allows you to safely read and write data in shared memory locations without race conditions."
      syntax={`// Example usage of Atomics
console.log(typeof Atomics);

// Creating a shared array buffer
const buffer = new SharedArrayBuffer(1024);
const view = new Int32Array(buffer);

// Atomic operations
Atomics.store(view, 0, 42);
console.log(Atomics.load(view, 0)); // 42

// Atomic addition
Atomics.add(view, 0, 10);
console.log(Atomics.load(view, 0)); // 52

// Atomic exchange
const oldValue = Atomics.exchange(view, 0, 100);
console.log('Old value:', oldValue); // 52
console.log('New value:', Atomics.load(view, 0)); // 100`}
      useCases={[
        "Shared memory operations in Web Workers",
        "Atomic counters and flags",
        "Synchronization between threads",
        "Lock-free data structures"
      ]}
      browserSupport="Atomics is supported in modern browsers that support SharedArrayBuffer."
    />
  )
}
