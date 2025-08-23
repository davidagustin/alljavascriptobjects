import ObjectPage from '../components/ObjectPage';

export default function Int32ArrayPage() {
  return (
    <ObjectPage
      title="Int32Array"
      description="The Int32Array typed array represents an array of 32-bit signed integers."
      overview="Int32Array represents 32-bit signed integers with values ranging from -2,147,483,648 to 2,147,483,647. Values outside this range will overflow. Each element takes 4 bytes of memory, making Int32Array useful for applications requiring 32-bit signed integers. It's commonly used for large integer calculations, cryptography, and other applications where 32-bit precision is needed. Int32Array supports all standard Array methods and can be created from ArrayBuffer, regular arrays, or other TypedArrays."
      syntax={`// Creating Int32Array with different constructors
const arr1 = new Int32Array(4); // Creates array of 4 elements, all 0
const arr2 = new Int32Array([1000000, 2000000, 3000000, 4000000]);
const arr3 = new Int32Array(new ArrayBuffer(16));

// Setting and getting values
const arr = new Int32Array([1000000, 2000000, 3000000, 4000000]);
console.log(arr[0]); // 1000000
arr[1] = 2500000;
console.log(arr[1]); // 2500000

// Values are clamped to 32-bit signed range (-2147483648 to 2147483647)
arr[0] = 3000000000; // Will overflow
console.log(arr[0]); // -1294967296 (overflow)

arr[1] = -3000000000; // Will overflow
console.log(arr[1]); // 1294967296 (overflow)

// Array methods
const numbers = new Int32Array([1000000, 2000000, 3000000, 4000000, 5000000]);
const doubled = numbers.map(x => x * 2);
const evens = numbers.filter(x => x % 2 === 0);
const sum = numbers.reduce((acc, val) => acc + val, 0);

// Buffer operations
const buffer = new ArrayBuffer(32);
const view = new Int32Array(buffer);
view[0] = 1000000;
view[1] = 2000000;
view[2] = 3000000;
view[3] = 4000000;

// Create multiple views on the same buffer
const view2 = new Int32Array(buffer, 8, 4); // Start at offset 8 bytes, length 4 elements
view2[0] = 999999999; // Modifying one view affects the other
console.log(view[2]); // 999999999

// Converting to regular array
const regularArray = Array.from(view);

// Large number calculations
function calculateLargeSum(numbers) {
  const int32Array = new Int32Array(numbers);
  let sum = 0;
  
  for (let i = 0; i < int32Array.length; i++) {
    sum += int32Array[i];
    // Check for overflow
    if (sum > 2147483647 || sum < -2147483648) {
      console.warn('Overflow detected in sum calculation');
    }
  }
  
  return sum;
}

// Cryptography example (simplified)
function simpleHash(data) {
  const int32Data = new Int32Array(data);
  let hash = 0;
  
  for (let i = 0; i < int32Data.length; i++) {
    hash = ((hash << 5) - hash) + int32Data[i];
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return hash;
}

// Example hash calculation
const testData = new Int32Array([1, 2, 3, 4, 5]);
const hash = simpleHash(testData);
console.log('Hash:', hash);

// Performance-critical calculations
function matrixMultiplication(a, b, size) {
  const result = new Int32Array(size * size);
  
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
const matrixA = new Int32Array([1, 2, 3, 4]);
const matrixB = new Int32Array([5, 6, 7, 8]);
const result = matrixMultiplication(matrixA, matrixB, matrixSize);
console.log('Matrix result:', result);

// Data processing with large integers
function processLargeDataset(data) {
  const processed = new Int32Array(data.length);
  
  for (let i = 0; i < data.length; i++) {
    // Apply some transformation
    processed[i] = data[i] * 2 + 1000000;
    
    // Check for overflow
    if (processed[i] > 2147483647 || processed[i] < -2147483648) {
      console.warn('Overflow at index ' + i);
    }
  }
  
  return processed;
}

// Example data processing
const largeDataset = new Int32Array([1000000, 2000000, 3000000, 4000000]);
const processed = processLargeDataset(largeDataset);
console.log('Processed data:', processed);

// Memory-efficient data storage
function createSparseArray(size, defaultValue = 0) {
  const sparse = new Int32Array(size);
  sparse.fill(defaultValue);
  return sparse;
}

// Example sparse array
const sparse = createSparseArray(1000000, -1);
sparse[100] = 1000000;
sparse[1000] = 2000000;
sparse[10000] = 3000000;

console.log('Sparse array size:', sparse.length);
console.log('Value at index 100:', sparse[100]);

// Bit manipulation with Int32Array
function bitwiseOperations(data) {
  const result = new Int32Array(data.length);
  
  for (let i = 0; i < data.length; i++) {
    // Perform various bitwise operations
    result[i] = data[i] & 0xFFFFFFFF; // AND with 32-bit mask
    result[i] = result[i] | 0x0000FFFF; // OR with lower 16 bits
    result[i] = result[i] ^ 0xFFFF0000; // XOR with upper 16 bits
    result[i] = result[i] << 1; // Left shift
    result[i] = result[i] >> 1; // Right shift
  }
  
  return result;
}

// Example bitwise operations
const bitData = new Int32Array([1000000, 2000000, 3000000]);
const bitResult = bitwiseOperations(bitData);
console.log('Bitwise result:', bitResult);

// Performance measurement
function benchmarkInt32Array() {
  const size = 1000000;
  const data = new Int32Array(size);
  
  // Fill with random data
  for (let i = 0; i < size; i++) {
    data[i] = Math.floor(Math.random() * 2147483647);
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
const benchmarkResult = benchmarkInt32Array();

// Practical example: ID generation
function generateIds(count) {
  const ids = new Int32Array(count);
  
  for (let i = 0; i < count; i++) {
    // Generate a pseudo-random 32-bit ID
    ids[i] = Math.floor(Math.random() * 2147483647);
  }
  
  return ids;
}

// Example ID generation
const userIds = generateIds(10);
console.log('Generated user IDs:', userIds);`}
      useCases={[
        "Large integer calculations",
        "Cryptography and hashing",
        "Matrix operations",
        "Performance-critical applications",
        "Memory-efficient data storage",
        "Bit manipulation",
        "ID generation",
        "High-precision mathematical operations"
      ]}
    />
  );
}