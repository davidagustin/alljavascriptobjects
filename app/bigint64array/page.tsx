import ObjectPage from '../components/ObjectPage'

export default function BigInt64ArrayPage() {
  return (
    <ObjectPage
      title="BigInt64Array"
      description="A typed array of 64-bit signed BigInt values"
      overview="The BigInt64Array typed array represents an array of 64-bit signed integers in the platform byte order. Contents are initialized to 0n."
      syntax={`// Creating BigInt64Array
const arr1 = new BigInt64Array(4);
const arr2 = new BigInt64Array([1n, 2n, 3n, 4n]);
const buffer = new ArrayBuffer(32);
const arr3 = new BigInt64Array(buffer);

// Working with BigInt64Array
arr1[0] = 123n;
arr1[1] = -456n;
arr1[2] = 9007199254740991n; // Max safe integer as BigInt

console.log(arr1.length); // 4
console.log(arr2[0]); // 1n

// Array methods
arr2.forEach(val => console.log(val));
const mapped = arr2.map(x => x * 2n);`}
      useCases={[
        "Large integer calculations beyond Number.MAX_SAFE_INTEGER",
        "Cryptographic operations requiring 64-bit integers",
        "High-precision timestamp storage",
        "Binary data processing with large integer values"
      ]}
    />
  )
}