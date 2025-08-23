import ObjectPage from '../components/ObjectPage'

export default function Float64ArrayPage() {
  return (
    <ObjectPage
      title="Float64Array"
      description="A typed array of 64-bit floating point numbers"
      overview="The Float64Array typed array represents an array of 64-bit floating point numbers (corresponding to the C double data type) in the platform byte order."
      syntax={`// ============ CONSTRUCTOR METHODS ============
// 1. Basic constructor with length
const arr1 = new Float64Array(5);
console.log('Length constructor:', arr1); // [0, 0, 0, 0, 0]

// 2. From array-like object
const arr2 = new Float64Array([1.5, 2.5, 3.5, 4.5, 5.5]);
console.log('From array:', arr2); // [1.5, 2.5, 3.5, 4.5, 5.5]

// 3. From ArrayBuffer
const buffer = new ArrayBuffer(40); // 40 bytes = 5 float64s
const arr3 = new Float64Array(buffer);
arr3[0] = Math.PI;
console.log('From buffer:', arr3); // [3.141592653589793, 0, 0, 0, 0]

// 4. From ArrayBuffer with offset and length
const arr4 = new Float64Array(buffer, 8, 3); // offset 8 bytes, length 3
console.log('With offset:', arr4); // [0, 0, 0]

// 5. From another TypedArray
const arr5 = new Float64Array(new Float32Array([1.1, 2.2, 3.3]));
console.log('From TypedArray:', arr5); // [1.1, 2.2, 3.3] (precision upgraded)

// 6. From iterable
const arr6 = new Float64Array(new Set([Math.E, Math.PI, Math.SQRT2]));
console.log('From iterable:', arr6); // [2.718281828459045, 3.141592653589793, 1.4142135623730951]

// ============ STATIC PROPERTIES ============
console.log('BYTES_PER_ELEMENT:', Float64Array.BYTES_PER_ELEMENT); // 8
console.log('Constructor name:', Float64Array.name); // "Float64Array"

// ============ STATIC METHODS ============
// Float64Array.from()
const arr7 = Float64Array.from([1, 2, 3], x => x * Math.PI);
console.log('from() with map:', arr7); // [3.141592653589793, 6.283185307179586, 9.42477796076938]

const arr8 = Float64Array.from({length: 3}, (_, i) => Math.pow(2, i));
console.log('from() array-like:', arr8); // [1, 2, 4]

// Float64Array.of()
const arr9 = Float64Array.of(Number.MAX_VALUE, Number.MIN_VALUE, Number.EPSILON);
console.log('of():', arr9); // [1.7976931348623157e+308, 5e-324, 2.220446049250313e-16]

// ============ INSTANCE PROPERTIES ============
const demo = new Float64Array([1.5, 2.5, 3.5, 4.5, 5.5]);
console.log('buffer:', demo.buffer); // ArrayBuffer(40)
console.log('byteLength:', demo.byteLength); // 40
console.log('byteOffset:', demo.byteOffset); // 0
console.log('length:', demo.length); // 5

// ============ INSTANCE METHODS ============
const array = new Float64Array([1.1, 2.2, 3.3, 4.4, 5.5, 6.6, 7.7, 8.8, 9.9]);

// at() - access with negative indices
console.log('at(-1):', array.at(-1)); // 9.9
console.log('at(2):', array.at(2)); // 3.3
console.log('at(-3):', array.at(-3)); // 7.7

// copyWithin()
const copy1 = new Float64Array([1, 2, 3, 4, 5]);
copy1.copyWithin(0, 3, 5); // copy elements 3-4 to position 0
console.log('copyWithin:', copy1); // [4, 5, 3, 4, 5]

// entries()
let count = 0;
for (const [index, value] of array.entries()) {
  if (count++ < 3) console.log(\`Entry [\${index}]: \${value}\`);
}

// every()
const allPositive = array.every(x => x > 0);
const allLessThan10 = array.every(x => x < 10);
console.log('every() positive:', allPositive); // true
console.log('every() < 10:', allLessThan10); // true

// fill()
const filled = new Float64Array(5).fill(Math.PI);
console.log('fill(PI):', filled); // [3.141592653589793, 3.141592653589793, ...]

const partial = new Float64Array(5).fill(Math.E, 1, 4);
console.log('fill() partial:', partial); // [0, 2.718281828459045, 2.718281828459045, 2.718281828459045, 0]

// filter()
const filtered = array.filter(x => x > 5);
console.log('filter(>5):', filtered); // [5.5, 6.6, 7.7, 8.8, 9.9]

// find()
const found = array.find(x => x > 5);
console.log('find(>5):', found); // 5.5

// findIndex()
const foundIndex = array.findIndex(x => x > 5);
console.log('findIndex(>5):', foundIndex); // 4

// findLast()
const foundLast = array.findLast(x => x < 8);
console.log('findLast(<8):', foundLast); // 7.7

// findLastIndex()
const foundLastIdx = array.findLastIndex(x => x < 8);
console.log('findLastIndex(<8):', foundLastIdx); // 6

// forEach()
let forEachSum = 0;
array.forEach((val, idx) => {
  forEachSum += val;
  if (idx < 2) console.log(\`forEach [\${idx}]: \${val}\`);
});
console.log('forEach sum:', forEachSum);

// includes()
console.log('includes(3.3):', array.includes(3.3)); // true
console.log('includes(10):', array.includes(10)); // false
console.log('includes(NaN):', new Float64Array([NaN]).includes(NaN)); // true

// indexOf()
console.log('indexOf(4.4):', array.indexOf(4.4)); // 3
console.log('indexOf(99):', array.indexOf(99)); // -1
console.log('indexOf(2.2, 2):', array.indexOf(2.2, 2)); // -1 (search from index 2)

// join()
console.log('join():', array.join()); // "1.1,2.2,3.3,..."
console.log('join(" | "):', array.slice(0, 3).join(' | ')); // "1.1 | 2.2 | 3.3"

// keys()
const keys = [...array.keys()];
console.log('keys():', keys); // [0, 1, 2, 3, 4, 5, 6, 7, 8]

// lastIndexOf()
const dupArray = new Float64Array([1.1, 2.2, 3.3, 2.2, 1.1]);
console.log('lastIndexOf(2.2):', dupArray.lastIndexOf(2.2)); // 3
console.log('lastIndexOf(1.1):', dupArray.lastIndexOf(1.1)); // 4

// map()
const mapped = array.map(x => x * x);
console.log('map(x²):', mapped.slice(0, 3)); // [1.21, 4.84, 10.89]

const mapWithIndex = array.map((x, i) => x + i);
console.log('map(x+i):', mapWithIndex.slice(0, 3)); // [1.1, 3.2, 5.3]

// reduce()
const sum = array.reduce((acc, val) => acc + val, 0);
const product = array.slice(0, 3).reduce((acc, val) => acc * val, 1);
console.log('reduce() sum:', sum); // 49.5
console.log('reduce() product:', product.toFixed(2)); // 7.99

// reduceRight()
const rightConcat = array.slice(0, 3).reduceRight((acc, val) => acc + ',' + val, '');
console.log('reduceRight() concat:', rightConcat); // ",3.3,2.2,1.1"

// reverse()
const reversed = new Float64Array([1, 2, 3, 4, 5]).reverse();
console.log('reverse():', reversed); // [5, 4, 3, 2, 1]

// set()
const target = new Float64Array(10);
target.set([1.1, 2.2, 3.3]); // set at index 0
target.set([4.4, 5.5], 5); // set at index 5
target.set(new Float32Array([6.6, 7.7]), 8); // from Float32Array
console.log('set():', target); // [1.1, 2.2, 3.3, 0, 0, 4.4, 5.5, 0, 6.6, 7.7]

// slice()
const sliced = array.slice(2, 5);
const negSlice = array.slice(-3);
console.log('slice(2,5):', sliced); // [3.3, 4.4, 5.5]
console.log('slice(-3):', negSlice); // [7.7, 8.8, 9.9]

// some()
const hasLarge = array.some(x => x > 8);
const hasNegative = array.some(x => x < 0);
console.log('some(>8):', hasLarge); // true
console.log('some(<0):', hasNegative); // false

// sort()
const unsorted = new Float64Array([3.3, 1.1, 4.4, 2.2, 5.5]);
unsorted.sort();
console.log('sort():', unsorted); // [1.1, 2.2, 3.3, 4.4, 5.5]

// Custom sort (descending)
const customSort = new Float64Array([3.3, 1.1, 4.4, 2.2]);
customSort.sort((a, b) => b - a);
console.log('sort() desc:', customSort); // [4.4, 3.3, 2.2, 1.1]

// subarray() - creates view, not copy!
const sub = array.subarray(1, 4);
console.log('subarray(1,4):', sub); // [2.2, 3.3, 4.4]
sub[0] = 99.99; // modifies original!
console.log('Original after subarray mod:', array[1]); // 99.99

// toLocaleString()
const locale = new Float64Array([1234.567, 6789.012]);
console.log('toLocaleString("en-US"):', locale.toLocaleString('en-US'));
console.log('toLocaleString("de-DE"):', locale.toLocaleString('de-DE'));

// toReversed() - non-mutating
const toRev = array.toReversed();
console.log('toReversed():', toRev.slice(0, 3)); // [9.9, 8.8, 7.7]
console.log('Original unchanged:', array[0]); // 1.1

// toSorted() - non-mutating
const toSort = new Float64Array([3, 1, 4, 1, 5, 9, 2, 6]).toSorted();
console.log('toSorted():', toSort); // [1, 1, 2, 3, 4, 5, 6, 9]

// toString()
console.log('toString():', array.slice(0, 3).toString()); // "1.1,99.99,3.3"

// values()
let valueCount = 0;
for (const value of array.values()) {
  if (valueCount++ < 3) console.log(\`Value: \${value}\`);
}

// with() - returns copy with element replaced
const withNew = array.with(2, 999.999);
console.log('with(2, 999.999):', withNew.slice(0, 4)); // [1.1, 99.99, 999.999, 4.4]
console.log('Original unchanged:', array[2]); // 3.3

// ============ PRECISION DEMONSTRATIONS ============
const precision = new Float64Array(8);

// Maximum precision for JavaScript numbers
precision[0] = 1.23456789012345678901234567890; // Full Float64 precision
precision[1] = 0.1 + 0.2; // Classic floating point issue
precision[2] = Number.MAX_SAFE_INTEGER; // 2^53 - 1
precision[3] = Number.MIN_SAFE_INTEGER; // -(2^53 - 1)
precision[4] = Number.MAX_VALUE; // ~1.79e308
precision[5] = Number.MIN_VALUE; // ~5e-324
precision[6] = Number.EPSILON; // Smallest difference
precision[7] = Math.PI;

console.log('High precision:', precision[0]); // 1.2345678901234567
console.log('0.1 + 0.2:', precision[1]); // 0.30000000000000004
console.log('MAX_SAFE_INTEGER:', precision[2]); // 9007199254740991
console.log('MIN_SAFE_INTEGER:', precision[3]); // -9007199254740991
console.log('MAX_VALUE:', precision[4]); // 1.7976931348623157e+308
console.log('MIN_VALUE:', precision[5]); // 5e-324
console.log('EPSILON:', precision[6]); // 2.220446049250313e-16
console.log('PI:', precision[7]); // 3.141592653589793

// ============ SPECIAL VALUES ============
const special = new Float64Array([
  NaN,
  Infinity,
  -Infinity,
  -0,
  0
]);

console.log('NaN:', special[0]); // NaN
console.log('Infinity:', special[1]); // Infinity
console.log('-Infinity:', special[2]); // -Infinity
console.log('-0 === 0:', Object.is(special[3], -0)); // true
console.log('0:', special[4]); // 0

// ============ WORKING WITH DATAVIEW ============
const viewBuffer = new ArrayBuffer(32);
const floatView = new Float64Array(viewBuffer);
const dataView = new DataView(viewBuffer);

// Write with DataView, read with Float64Array
dataView.setFloat64(0, Math.PI, true); // little-endian
dataView.setFloat64(8, Math.E, false); // big-endian
dataView.setFloat64(16, Number.MAX_VALUE, true);
dataView.setFloat64(24, Number.MIN_VALUE, true);

console.log('From DataView [0]:', floatView[0]); // PI
console.log('From DataView [1]:', floatView[1]); // E (or garbled if endianness matters)
console.log('From DataView [2]:', floatView[2]); // MAX_VALUE
console.log('From DataView [3]:', floatView[3]); // MIN_VALUE`}
      useCases={[
        "High-precision scientific calculations",
        "Financial computations requiring accuracy",
        "Machine learning and data analysis",
        "Storing standard JavaScript numbers in binary format"
      ]}
    />
  )
}