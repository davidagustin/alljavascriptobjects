import ObjectPage from '../components/ObjectPage'

export default function Float32ArrayPage() {
  return (
    <ObjectPage
      title="Float32Array"
      description="A typed array of 32-bit floating point numbers"
      overview="The Float32Array typed array represents an array of 32-bit floating point numbers (corresponding to the C float data type) in the platform byte order."
      syntax={`// ============ CONSTRUCTOR METHODS ============
// 1. Basic constructor with length
const arr1 = new Float32Array(5);
console.log('Length constructor:', arr1); // [0, 0, 0, 0, 0]

// 2. From array-like object
const arr2 = new Float32Array([1.5, 2.5, 3.5, 4.5, 5.5]);
console.log('From array:', arr2); // [1.5, 2.5, 3.5, 4.5, 5.5]

// 3. From ArrayBuffer
const buffer = new ArrayBuffer(20); // 20 bytes = 5 float32s
const arr3 = new Float32Array(buffer);
arr3[0] = 3.14;
console.log('From buffer:', arr3); // [3.14, 0, 0, 0, 0]

// 4. From ArrayBuffer with offset and length
const arr4 = new Float32Array(buffer, 4, 3); // offset 4 bytes, length 3
console.log('With offset:', arr4); // [0, 0, 0]

// 5. From another TypedArray
const arr5 = new Float32Array(new Uint8Array([1, 2, 3, 4]));
console.log('From TypedArray:', arr5); // [1, 2, 3, 4]

// 6. From iterable
const arr6 = new Float32Array(new Set([1.1, 2.2, 3.3]));
console.log('From iterable:', arr6); // [1.1, 2.2, 3.3]

// ============ STATIC PROPERTIES ============
console.log('BYTES_PER_ELEMENT:', Float32Array.BYTES_PER_ELEMENT); // 4
console.log('Constructor name:', Float32Array.name); // "Float32Array"

// ============ STATIC METHODS ============
// Float32Array.from()
const arr7 = Float32Array.from([1, 2, 3], x => x * Math.PI);
console.log('from() with map:', arr7); // [3.14159..., 6.28318..., 9.42477...]

const arr8 = Float32Array.from({length: 3}, (_, i) => i ** 2);
console.log('from() array-like:', arr8); // [0, 1, 4]

// Float32Array.of()
const arr9 = Float32Array.of(Math.E, Math.PI, Math.SQRT2);
console.log('of():', arr9); // [2.71828..., 3.14159..., 1.41421...]

// ============ INSTANCE PROPERTIES ============
const demo = new Float32Array([1.5, 2.5, 3.5, 4.5, 5.5]);
console.log('buffer:', demo.buffer); // ArrayBuffer(20)
console.log('byteLength:', demo.byteLength); // 20
console.log('byteOffset:', demo.byteOffset); // 0
console.log('length:', demo.length); // 5

// ============ INSTANCE METHODS ============
const array = new Float32Array([1.1, 2.2, 3.3, 4.4, 5.5, 6.6, 7.7]);

// at() - access with negative indices
console.log('at(-1):', array.at(-1)); // 7.7
console.log('at(2):', array.at(2)); // 3.3

// copyWithin()
const copy1 = new Float32Array([1, 2, 3, 4, 5]);
copy1.copyWithin(0, 3); // copy from index 3 to index 0
console.log('copyWithin:', copy1); // [4, 5, 3, 4, 5]

// entries()
for (const [index, value] of array.entries()) {
  if (index < 2) console.log(\`Entry \${index}: \${value}\`);
}

// every()
const allPositive = array.every(x => x > 0);
console.log('every() positive:', allPositive); // true

// fill()
const filled = new Float32Array(5).fill(3.14);
console.log('fill():', filled); // [3.14, 3.14, 3.14, 3.14, 3.14]

const partial = new Float32Array(5).fill(2.5, 1, 4);
console.log('fill() partial:', partial); // [0, 2.5, 2.5, 2.5, 0]

// filter()
const filtered = array.filter(x => x > 3);
console.log('filter():', filtered); // [3.3, 4.4, 5.5, 6.6, 7.7]

// find()
const found = array.find(x => x > 4);
console.log('find():', found); // 4.4

// findIndex()
const foundIndex = array.findIndex(x => x > 4);
console.log('findIndex():', foundIndex); // 3

// findLast()
const foundLast = array.findLast(x => x < 5);
console.log('findLast():', foundLast); // 4.4

// findLastIndex()
const foundLastIdx = array.findLastIndex(x => x < 5);
console.log('findLastIndex():', foundLastIdx); // 3

// forEach()
array.forEach((val, idx) => {
  if (idx < 2) console.log(\`forEach \${idx}: \${val}\`);
});

// includes()
console.log('includes(3.3):', array.includes(3.3)); // true
console.log('includes(10):', array.includes(10)); // false

// indexOf()
console.log('indexOf(4.4):', array.indexOf(4.4)); // 3
console.log('indexOf(99):', array.indexOf(99)); // -1

// join()
console.log('join():', array.join(' | ')); // "1.1 | 2.2 | 3.3 | ..."

// keys()
const keys = [...array.keys()];
console.log('keys():', keys); // [0, 1, 2, 3, 4, 5, 6]

// lastIndexOf()
const dupArray = new Float32Array([1, 2, 3, 2, 1]);
console.log('lastIndexOf(2):', dupArray.lastIndexOf(2)); // 3

// map()
const mapped = array.map(x => x * 2);
console.log('map():', mapped); // [2.2, 4.4, 6.6, ...]

// reduce()
const sum = array.reduce((acc, val) => acc + val, 0);
console.log('reduce() sum:', sum.toFixed(2)); // 30.80

// reduceRight()
const rightSum = array.reduceRight((acc, val) => acc + val, 0);
console.log('reduceRight():', rightSum.toFixed(2)); // 30.80

// reverse()
const reversed = new Float32Array([1, 2, 3]).reverse();
console.log('reverse():', reversed); // [3, 2, 1]

// set()
const target = new Float32Array(8);
target.set([1.1, 2.2, 3.3]); // set at index 0
target.set([4.4, 5.5], 5); // set at index 5
console.log('set():', target); // [1.1, 2.2, 3.3, 0, 0, 4.4, 5.5, 0]

// slice()
const sliced = array.slice(2, 5);
console.log('slice(2,5):', sliced); // [3.3, 4.4, 5.5]

// some()
const hasLarge = array.some(x => x > 5);
console.log('some() > 5:', hasLarge); // true

// sort()
const unsorted = new Float32Array([3.3, 1.1, 4.4, 2.2]);
unsorted.sort();
console.log('sort():', unsorted); // [1.1, 2.2, 3.3, 4.4]

// Custom sort
unsorted.sort((a, b) => b - a); // descending
console.log('sort() desc:', unsorted); // [4.4, 3.3, 2.2, 1.1]

// subarray()
const sub = array.subarray(1, 4);
console.log('subarray(1,4):', sub); // [2.2, 3.3, 4.4]
sub[0] = 99; // modifies original!
console.log('Original modified:', array[1]); // 99

// toLocaleString()
const locale = new Float32Array([1234.5, 6789.1]);
console.log('toLocaleString():', locale.toLocaleString('de-DE'));

// toReversed()
const toRev = array.toReversed();
console.log('toReversed():', toRev); // [7.7, 6.6, 5.5, ...]

// toSorted()
const toSort = new Float32Array([3, 1, 4, 2]).toSorted();
console.log('toSorted():', toSort); // [1, 2, 3, 4]

// toString()
console.log('toString():', array.toString()); // "1.1,2.2,3.3,..."

// values()
for (const value of array.values()) {
  if (value < 3) console.log('Value:', value);
}

// with() - returns copy with element replaced
const withNew = array.with(2, 99.9);
console.log('with(2, 99.9):', withNew); // [1.1, 2.2, 99.9, ...]

// ============ PRECISION & SPECIAL VALUES ============
const precision = new Float32Array(5);
precision[0] = 1.23456789012345; // loses precision
precision[1] = Number.MAX_VALUE; // becomes Infinity
precision[2] = Number.MIN_VALUE; // becomes 0
precision[3] = NaN;
precision[4] = Infinity;

console.log('Precision loss:', precision[0]); // 1.2345678806304932
console.log('MAX_VALUE:', precision[1]); // Infinity
console.log('MIN_VALUE:', precision[2]); // 0
console.log('NaN:', precision[3]); // NaN
console.log('Infinity:', precision[4]); // Infinity

// ============ WORKING WITH DATAVIEW ============
const viewBuffer = new ArrayBuffer(16);
const floatView = new Float32Array(viewBuffer);
const dataView = new DataView(viewBuffer);

// Write with DataView, read with Float32Array
dataView.setFloat32(0, Math.PI, true); // little-endian
dataView.setFloat32(4, Math.E, false); // big-endian
console.log('From DataView:', floatView[0], floatView[1]);`}
      useCases={[
        "3D graphics and WebGL applications",
        "Audio processing and synthesis",
        "Scientific computing with moderate precision",
        "Memory-efficient storage of decimal numbers"
      ]}
    />
  )
}