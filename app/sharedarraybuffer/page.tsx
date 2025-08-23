import ObjectPage from '../components/ObjectPage';

export default function SharedArrayBufferPage() {
  return (
    <ObjectPage
      title="SharedArrayBuffer"
      description="The SharedArrayBuffer object is used to represent a generic, fixed-length raw binary data buffer that can be used to create a view on shared memory."
      overview="SharedArrayBuffer allows sharing memory between the main thread and web workers. The buffer can be accessed by multiple threads simultaneously, making it useful for high-performance computing and real-time applications. Use Atomics for thread-safe operations on SharedArrayBuffer. SharedArrayBuffer requires cross-origin isolation headers (COOP/COEP) for security reasons. The buffer size is fixed and cannot be resized. Multiple TypedArrays can view the same SharedArrayBuffer, and changes in one view are immediately visible in other views."
      syntax={`// Creating a SharedArrayBuffer
const sharedBuffer = new SharedArrayBuffer(1024); // 1KB shared buffer
console.log(sharedBuffer.byteLength); // 1024

// Creating views on the shared buffer
const uint8View = new Uint8Array(sharedBuffer);
const int32View = new Int32Array(sharedBuffer);

// Writing data to the shared buffer
uint8View[0] = 42;
int32View[0] = 123456;

console.log(uint8View[0]); // 42
console.log(int32View[0]); // 123456

// Multiple views share the same underlying memory
uint8View[0] = 100;
console.log(int32View[0]); // Value changes because they share memory

// Example of sharing SharedArrayBuffer with a worker
// Main thread
const buffer = new SharedArrayBuffer(1024);
const sharedArray = new Int32Array(buffer);

// Initialize the shared array
sharedArray[0] = 0;
sharedArray[1] = 0;

// Send the SharedArrayBuffer to a worker
// worker.postMessage({ buffer: sharedBuffer }, [sharedBuffer]);

// The worker can now access the same memory
// In the worker:
// self.onmessage = function(e) {
//   const sharedArray = new Int32Array(e.data.buffer);
//   sharedArray[0] = 42; // This change is visible in the main thread
// };

// SharedArrayBuffer works with Atomics for thread-safe operations
const atomicBuffer = new SharedArrayBuffer(1024);
const atomicArray = new Int32Array(atomicBuffer);

// Initialize
atomicArray[0] = 0;

// Atomic operations ensure thread safety
// In one thread/worker:
// Atomics.add(atomicArray, 0, 10); // Atomically add 10

// In another thread/worker:
// Atomics.sub(atomicArray, 0, 5); // Atomically subtract 5

// The result is predictable: 0 + 10 - 5 = 5

// Atomic compare and exchange
const oldValue = Atomics.compareExchange(atomicArray, 0, 0, 100);
console.log(oldValue); // 0 (if the value was 0)
console.log(atomicArray[0]); // 100

// Atomic load and store
const currentValue = Atomics.load(atomicArray, 0);
console.log(currentValue); // 100

Atomics.store(atomicArray, 0, 200);
console.log(atomicArray[0]); // 200

// Practical example
const dataBuffer = new SharedArrayBuffer(256);
const dataView = new Uint8Array(dataBuffer);

// Fill with some data
for (let i = 0; i < dataView.length; i++) {
  dataView[i] = i;
}

console.log('Buffer size:', dataBuffer.byteLength);
console.log('First few values:', dataView.slice(0, 5));`}
      useCases={[
        "High-performance computing",
        "Real-time data processing",
        "Web worker communication",
        "Shared memory applications",
        "Multi-threaded JavaScript",
        "Performance-critical applications",
        "Data streaming",
        "Concurrent data access"
      ]}
    />
  );
}
