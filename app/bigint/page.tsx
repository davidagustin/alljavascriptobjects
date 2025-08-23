import ObjectPage from '../components/ObjectPage'

export default function BigIntPage() {
  return (
    <ObjectPage
      title="BigInt"
      description="Represents integers with arbitrary precision"
      overview="The BigInt object represents integers with arbitrary precision. It can safely store and operate on large integers."
      syntax={`// Creating BigInt
const bigInt1 = 123n;
const bigInt2 = BigInt(456);
const bigInt3 = BigInt('789');

console.log(bigInt1); // 123n
console.log(bigInt2); // 456n
console.log(bigInt3); // 789n

// BigInt operations
const sum = bigInt1 + bigInt2;
const product = bigInt1 * bigInt2;
const power = bigInt1 ** 3n;

console.log(sum); // 579n
console.log(product); // 56088n
console.log(power); // 1860867n

// Large numbers
const largeNumber = 2n ** 100n;
console.log(largeNumber); // 1267650600228229401496703205376n`}
      useCases={[
        "Large integer calculations",
        "Cryptographic operations",
        "Precise financial calculations",
        "ID generation for large datasets"
      ]}
    />
  )
}
