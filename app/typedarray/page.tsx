import ObjectPage from '../components/ObjectPage'

export default function TypedArrayPage() {
  return (
    <ObjectPage
      title="TypedArray"
      description="An abstract base class for all typed array constructors providing common methods and properties"
      overview="TypedArray is the abstract superclass from which all typed array classes inherit. It provides common methods and properties shared by all typed arrays including Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array, BigInt64Array, and BigUint64Array."
      syntax={`// === TYPED ARRAY TYPES ===
// TypedArray is abstract - cannot instantiate directly
// All typed arrays inherit from TypedArray.prototype

// 8-bit integers
const int8 = new Int8Array(4); // Signed: -128 to 127
const uint8 = new Uint8Array(4); // Unsigned: 0 to 255
const uint8c = new Uint8ClampedArray(4); // Clamped: 0 to 255

// 16-bit integers
const int16 = new Int16Array(4); // Signed: -32768 to 32767
const uint16 = new Uint16Array(4); // Unsigned: 0 to 65535

// 32-bit integers
const int32 = new Int32Array(4); // Signed: -2147483648 to 2147483647
const uint32 = new Uint32Array(4); // Unsigned: 0 to 4294967295

// Floating point
const float32 = new Float32Array(4); // 32-bit IEEE floating point
const float64 = new Float64Array(4); // 64-bit IEEE floating point

// BigInt arrays (ES2020)
const bigInt64 = new BigInt64Array(4); // Signed 64-bit BigInt
const bigUint64 = new BigUint64Array(4); // Unsigned 64-bit BigInt

// === COMMON CONSTRUCTOR PATTERNS ===
// All typed arrays support these constructor forms:

// 1. From length
const arr1 = new Float32Array(10); // 10 elements, initialized to 0

// 2. From array-like or iterable
const arr2 = new Int32Array([1, 2, 3, 4, 5]);
const arr3 = new Uint8Array('12345'.split('').map(x => x.charCodeAt(0)));

// 3. From ArrayBuffer
const buffer = new ArrayBuffer(16);
const arr4 = new Float32Array(buffer); // 4 floats (16 bytes / 4 bytes per float)

// 4. From ArrayBuffer with offset and length
const arr5 = new Int16Array(buffer, 4, 4); // Start at byte 4, 4 elements

// 5. From another TypedArray
const source = new Uint8Array([10, 20, 30]);
const arr6 = new Uint16Array(source); // Converts values

// === STATIC PROPERTIES ===
console.log(Int32Array.BYTES_PER_ELEMENT); // 4
console.log(Float64Array.BYTES_PER_ELEMENT); // 8
console.log(Uint8Array.BYTES_PER_ELEMENT); // 1

// === STATIC METHODS ===
// TypedArray.from() - create from iterable with mapping
const doubles = Float64Array.from([1, 2, 3], x => x * 2);
console.log(doubles); // Float64Array [2, 4, 6]

// TypedArray.of() - create from arguments
const ints = Int32Array.of(10, 20, 30, 40);
console.log(ints); // Int32Array [10, 20, 30, 40]

// === INSTANCE PROPERTIES ===
const data = new Uint16Array([100, 200, 300, 400]);

console.log(data.buffer); // Underlying ArrayBuffer
console.log(data.byteLength); // 8 (4 elements * 2 bytes)
console.log(data.byteOffset); // 0 (offset in buffer)
console.log(data.length); // 4 (number of elements)

// === COMMON METHODS (inherited by all typed arrays) ===
const numbers = new Float32Array([1.5, 2.5, 3.5, 4.5, 5.5]);

// at() - access with negative indexing
console.log(numbers.at(-1)); // 5.5

// copyWithin() - copy part within array
numbers.copyWithin(0, 3);
console.log(numbers); // [4.5, 5.5, 3.5, 4.5, 5.5]

// entries() - get iterator of [index, value]
for (const [i, v] of numbers.entries()) {
  console.log(\`[\${i}]: \${v}\`);
}

// every() - test all elements
console.log(numbers.every(x => x > 0)); // true

// fill() - fill with value
const filled = new Int8Array(5);
filled.fill(42);
console.log(filled); // [42, 42, 42, 42, 42]

// filter() - filter to new array
const large = numbers.filter(x => x > 4);
console.log(large); // Float32Array [4.5, 5.5, 4.5, 5.5]

// find() - find first matching
console.log(numbers.find(x => x > 4)); // 4.5

// findIndex() - find first index
console.log(numbers.findIndex(x => x > 4)); // 0

// findLast() - find last matching
console.log(numbers.findLast(x => x > 4)); // 5.5

// findLastIndex() - find last index
console.log(numbers.findLastIndex(x => x > 4)); // 4

// forEach() - iterate elements
numbers.forEach((v, i) => console.log(\`\${i}: \${v}\`));

// includes() - check if contains
console.log(numbers.includes(3.5)); // true

// indexOf() - find index of value
console.log(numbers.indexOf(4.5)); // 0

// join() - join to string
console.log(numbers.join(' | ')); // "4.5 | 5.5 | 3.5 | 4.5 | 5.5"

// keys() - get iterator of indices
console.log([...numbers.keys()]); // [0, 1, 2, 3, 4]

// lastIndexOf() - find last index
console.log(numbers.lastIndexOf(4.5)); // 3

// map() - transform to new array
const squared = numbers.map(x => x * x);
console.log(squared); // Float32Array [20.25, 30.25, 12.25, 20.25, 30.25]

// reduce() - reduce to single value
const sum = numbers.reduce((a, b) => a + b, 0);
console.log(sum); // 22.5

// reduceRight() - reduce from right
const diff = numbers.reduceRight((a, b) => a - b);
console.log(diff); // -7.5

// reverse() - reverse in place
const rev = new Int16Array([1, 2, 3, 4]);
rev.reverse();
console.log(rev); // [4, 3, 2, 1]

// set() - set values from array
const target = new Uint8Array(6);
target.set([1, 2, 3], 2);
console.log(target); // [0, 0, 1, 2, 3, 0]

// slice() - extract portion
const portion = numbers.slice(1, 4);
console.log(portion); // Float32Array [5.5, 3.5, 4.5]

// some() - test if any match
console.log(numbers.some(x => x > 5)); // true

// sort() - sort in place
const unsorted = new Int32Array([3, 1, 4, 1, 5]);
unsorted.sort();
console.log(unsorted); // [1, 1, 3, 4, 5]

// subarray() - create view of same buffer
const view = numbers.subarray(1, 4);
view[0] = 99;
console.log(numbers[1]); // 99 (shares buffer)

// toLocaleString() - locale string
console.log(numbers.toLocaleString()); // locale-formatted

// toReversed() - reverse to new array
const original = new Uint8Array([1, 2, 3]);
const reversed = original.toReversed();
console.log(reversed); // [3, 2, 1]
console.log(original); // [1, 2, 3] (unchanged)

// toSorted() - sort to new array
const nums = new Int8Array([3, 1, 4]);
const sorted = nums.toSorted();
console.log(sorted); // [1, 3, 4]
console.log(nums); // [3, 1, 4] (unchanged)

// toString() - convert to string
console.log(numbers.toString()); // "4.5,99,3.5,4.5,5.5"

// values() - get iterator of values
for (const value of numbers.values()) {
  console.log(value);
}

// with() - create copy with one change
const modified = numbers.with(1, 2.5);
console.log(modified); // [4.5, 2.5, 3.5, 4.5, 5.5]
console.log(numbers[1]); // 99 (unchanged)

// === BUFFER SHARING AND VIEWS ===
const sharedBuffer = new ArrayBuffer(16);

// Multiple views of same buffer
const bytes = new Uint8Array(sharedBuffer);
const shorts = new Uint16Array(sharedBuffer);
const floats = new Float32Array(sharedBuffer);

// Modifying through one view affects others
floats[0] = 3.14159;
console.log(bytes[0], bytes[1], bytes[2], bytes[3]); // Raw bytes of float

// === PERFORMANCE CONSIDERATIONS ===
// TypedArrays are much faster than regular arrays for numeric operations
const size = 1000000;
const regularArray = new Array(size).fill(0).map((_, i) => i);
const typedArray = new Float32Array(size).map((_, i) => i);

// TypedArray operations are optimized
console.time('TypedArray sum');
const typedSum = typedArray.reduce((a, b) => a + b, 0);
console.timeEnd('TypedArray sum');

console.time('Regular array sum');
const regularSum = regularArray.reduce((a, b) => a + b, 0);
console.timeEnd('Regular array sum');

// === TYPE CONVERSION ===
// Converting between typed arrays
const uint8Data = new Uint8Array([255, 128, 0]);
const uint16Data = new Uint16Array(uint8Data); // Copies and converts
console.log(uint16Data); // [255, 128, 0]

const float32Data = new Float32Array(uint8Data);
console.log(float32Data); // [255, 128, 0]

// === WEBGL AND GRAPHICS USE CASE ===
// Vertex data for 3D graphics
const vertices = new Float32Array([
  // x,    y,    z
  -1.0, -1.0,  0.0,
   1.0, -1.0,  0.0,
   0.0,  1.0,  0.0
]);

// Color data (RGBA)
const colors = new Uint8Array([
  255, 0, 0, 255,    // Red
  0, 255, 0, 255,    // Green
  0, 0, 255, 255     // Blue
]);

// Index buffer for triangles
const indices = new Uint16Array([0, 1, 2]);

// === BINARY DATA PROCESSING ===
// Reading binary file format
class BinaryReader {
  constructor(buffer) {
    this.buffer = buffer;
    this.offset = 0;
  }
  
  readUint32() {
    const view = new Uint32Array(this.buffer, this.offset, 1);
    this.offset += 4;
    return view[0];
  }
  
  readFloat32() {
    const view = new Float32Array(this.buffer, this.offset, 1);
    this.offset += 4;
    return view[0];
  }
  
  readString(length) {
    const view = new Uint8Array(this.buffer, this.offset, length);
    this.offset += length;
    return String.fromCharCode(...view);
  }
}

// Example usage
const fileBuffer = new ArrayBuffer(12);
const writer = new DataView(fileBuffer);
writer.setUint32(0, 42, true); // little-endian
writer.setFloat32(4, 3.14159, true);
writer.setUint32(8, 99, true);

const reader = new BinaryReader(fileBuffer);
console.log(reader.readUint32()); // 42
console.log(reader.readFloat32()); // 3.14159
console.log(reader.readUint32()); // 99`}
      useCases={[
        "High-performance numeric computations",
        "WebGL and 3D graphics programming",
        "Audio and video processing",
        "Binary data manipulation",
        "Network protocol implementations",
        "Image processing and computer vision",
        "Scientific computing and data analysis",
        "Game development and physics simulations",
        "Cryptography and hash computations",
        "Memory-efficient data storage"
      ]}
    />
  )
}