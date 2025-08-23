import ObjectPage from '../components/ObjectPage'

export default function BigUint64ArrayPage() {
  return (
    <ObjectPage
      title="BigUint64Array"
      description="A typed array of 64-bit unsigned BigInt values"
      overview="The BigUint64Array typed array represents an array of 64-bit unsigned integers in the platform byte order. Contents are initialized to 0n."
      syntax={`// Creating BigUint64Array
const arr1 = new BigUint64Array(4);
const arr2 = new BigUint64Array([100n, 200n, 300n, 400n]);
const buffer = new ArrayBuffer(32);
const arr3 = new BigUint64Array(buffer);

// Working with BigUint64Array
arr1[0] = 18446744073709551615n; // Max 64-bit unsigned
arr1[1] = 0n; // Min value
arr1[2] = 1234567890123456789n;

console.log(arr1.length); // 4
console.log(arr2[0]); // 100n

// Array methods
const sum = arr2.reduce((a, b) => a + b, 0n);
const doubled = arr2.map(x => x * 2n);`}
      useCases={[
        "Working with unsigned 64-bit integers",
        "File size calculations for very large files",
        "Memory address manipulation in WebAssembly",
        "Handling unsigned large numeric IDs"
      ]}
    />
  )
}