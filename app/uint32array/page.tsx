import ObjectPage from '../components/ObjectPage';

export default function Uint32ArrayPage() {
  return (
    <ObjectPage
      title="Uint32Array"
      description="The Uint32Array typed array represents an array of 32-bit unsigned integers."
      overview="Uint32Array represents 32-bit unsigned integers with values ranging from 0 to 4,294,967,295. Values outside this range will overflow. Each element takes 4 bytes of memory, making Uint32Array useful for applications requiring 32-bit unsigned integers. It's commonly used for large positive number calculations, cryptography, and other applications where 32-bit unsigned precision is needed. Uint32Array supports all standard Array methods and can be created from ArrayBuffer, regular arrays, or other TypedArrays."
      syntax={`// Creating Uint32Array with different constructors
const arr1 = new Uint32Array(4); // Creates array of 4 elements, all 0
const arr2 = new Uint32Array([1000000, 2000000, 3000000, 4000000]);
const arr3 = new Uint32Array(new ArrayBuffer(16));

// Setting and getting values
const arr = new Uint32Array([1000000, 2000000, 3000000, 4000000]);
console.log(arr[0]); // 1000000
arr[1] = 2500000;
console.log(arr[1]); // 2500000

// Values are clamped to 32-bit unsigned range (0 to 4294967295)
arr[0] = 5000000000; // Will overflow
console.log(arr[0]); // 705032704 (5000000000 % 4294967296)

arr[1] = -10; // Will overflow
console.log(arr[1]); // 4294967286 (4294967296 - 10)

// Array methods
const numbers = new Uint32Array([1000000, 2000000, 3000000, 4000000, 5000000]);
const doubled = numbers.map(x => x * 2);
const evens = numbers.filter(x => x % 2 === 0);
const sum = numbers.reduce((acc, val) => acc + val, 0);

// Buffer operations
const buffer = new ArrayBuffer(32);
const view = new Uint32Array(buffer);
view[0] = 1000000;
view[1] = 2000000;
view[2] = 3000000;
view[3] = 4000000;

// Create multiple views on the same buffer
const view2 = new Uint32Array(buffer, 8, 4); // Start at offset 8 bytes, length 4 elements
view2[0] = 999999999; // Modifying one view affects the other
console.log(view[2]); // 999999999

// Converting to regular array
const regularArray = Array.from(view);

// Large positive number calculations
function calculateLargeSum(numbers) {
  const uint32Array = new Uint32Array(numbers);
  let sum = 0;
  
  for (let i = 0; i < uint32Array.length; i++) {
    sum += uint32Array[i];
    // Check for overflow
    if (sum > 4294967295) {
      console.warn('Overflow detected in sum calculation');
    }
  }
  
  return sum;
}

// Cryptography example (simplified)
function simpleHash(data) {
  const uint32Data = new Uint32Array(data);
  let hash = 0;
  
  for (let i = 0; i < uint32Data.length; i++) {
    hash = ((hash << 5) - hash) + uint32Data[i];
    hash = hash >>> 0; // Convert to 32-bit unsigned integer
  }
  
  return hash;
}

// Example hash calculation
const testData = new Uint32Array([1, 2, 3, 4, 5]);
const hash = simpleHash(testData);
console.log('Hash:', hash);

// ID generation with Uint32Array
function generateUniqueIds(count) {
  const ids = new Uint32Array(count);
  
  for (let i = 0; i < count; i++) {
    // Generate a pseudo-random 32-bit unsigned ID
    ids[i] = Math.floor(Math.random() * 4294967296);
  }
  
  return ids;
}

// Example ID generation
const uniqueIds = generateUniqueIds(10);
console.log('Generated unique IDs:', uniqueIds);

// Performance-critical calculations
function matrixMultiplication(a, b, size) {
  const result = new Uint32Array(size * size);
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let sum = 0;
      for (let k = 0; k < size; k++) {
        sum += a[i * size + k] * b[k * size + j];
      }
      result[i * size + j] = sum;
    }
  }
  
  return result;
}

// Example matrix multiplication
const matrixSize = 2;
const matrixA = new Uint32Array([1, 2, 3, 4]);
const matrixB = new Uint32Array([5, 6, 7, 8]);
const result = matrixMultiplication(matrixA, matrixB, matrixSize);
console.log('Matrix result:', result);

// Data processing with large positive integers
function processLargeDataset(data) {
  const processed = new Uint32Array(data.length);
  
  for (let i = 0; i < data.length; i++) {
    // Apply some transformation
    processed[i] = data[i] * 2 + 1000000;
    
    // Check for overflow
    if (processed[i] > 4294967295) {
      console.warn('Overflow at index ' + i);
    }
  }
  
  return processed;
}

// Example data processing
const largeDataset = new Uint32Array([1000000, 2000000, 3000000, 4000000]);
const processed = processLargeDataset(largeDataset);
console.log('Processed data:', processed);

// Memory-efficient data storage
function createSparseArray(size, defaultValue = 0) {
  const sparse = new Uint32Array(size);
  sparse.fill(defaultValue);
  return sparse;
}

// Example sparse array
const sparse = createSparseArray(1000000, 0);
sparse[100] = 1000000;
sparse[1000] = 2000000;
sparse[10000] = 3000000;

console.log('Sparse array size:', sparse.length);
console.log('Value at index 100:', sparse[100]);

// Bit manipulation with Uint32Array
function bitwiseOperations(data) {
  const result = new Uint32Array(data.length);
  
  for (let i = 0; i < data.length; i++) {
    // Perform various bitwise operations
    result[i] = data[i] & 0xFFFFFFFF; // AND with 32-bit mask
    result[i] = result[i] | 0x0000FFFF; // OR with lower 16 bits
    result[i] = result[i] ^ 0xFFFF0000; // XOR with upper 16 bits
    result[i] = result[i] << 1; // Left shift
    result[i] = result[i] >>> 1; // Unsigned right shift
  }
  
  return result;
}

// Example bitwise operations
const bitData = new Uint32Array([1000000, 2000000, 3000000]);
const bitResult = bitwiseOperations(bitData);
console.log('Bitwise result:', bitResult);

// Performance measurement
function benchmarkUint32Array() {
  const size = 1000000;
  const data = new Uint32Array(size);
  
  // Fill with random data
  for (let i = 0; i < size; i++) {
    data[i] = Math.floor(Math.random() * 4294967296);
  }
  
  // Measure processing time
  const start = performance.now();
  
  // Simple processing: multiply all values by 2
  for (let i = 0; i < size; i++) {
    data[i] = data[i] * 2;
  }
  
  const end = performance.now();
  console.log('Processed ' + size + ' elements in ' + (end - start) + 'ms');
  
  return data;
}

// Run benchmark
const benchmarkResult = benchmarkUint32Array();

// Practical example: Timestamp storage
function storeTimestamps(events) {
  const timestamps = new Uint32Array(events.length);
  
  for (let i = 0; i < events.length; i++) {
    // Store Unix timestamp (seconds since epoch)
    timestamps[i] = Math.floor(events[i].timestamp / 1000);
  }
  
  return timestamps;
}

// Example timestamp storage
const events = [
  { id: 1, timestamp: Date.now() },
  { id: 2, timestamp: Date.now() + 1000 },
  { id: 3, timestamp: Date.now() + 2000 }
];

const eventTimestamps = storeTimestamps(events);
console.log('Event timestamps:', eventTimestamps);

// Large number arithmetic
function largeNumberArithmetic(a, b) {
  const result = new Uint32Array(4); // Store result as 4 32-bit values
  
  // Simple addition (this is a simplified example)
  const sum = a + b;
  
  // Split 64-bit result into 32-bit chunks
  result[0] = sum & 0xFFFFFFFF; // Lower 32 bits
  result[1] = (sum >>> 32) & 0xFFFFFFFF; // Upper 32 bits
  
  return result;
}

// Example large number arithmetic
const largeA = 2000000000;
const largeB = 3000000000;
const arithmeticResult = largeNumberArithmetic(largeA, largeB);
console.log('Large number arithmetic result:', arithmeticResult);`}
      useCases={[
        "Large positive integer calculations",
        "Cryptography and hashing",
        "Unique ID generation",
        "Timestamp storage",
        "Matrix operations",
        "Performance-critical applications",
        "Memory-efficient data storage",
        "Bit manipulation and large number arithmetic"
      ]}
    />
  );
}