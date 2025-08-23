import ObjectPage from '../components/ObjectPage'

export default function parseintPage() {
  return (
    <ObjectPage
      title="parseint"
      description="Parses a string and returns an integer"
      overview="The parseInt() function parses a string argument and returns an integer of the specified radix."
      syntax={`// Basic parseInt usage
console.log(parseInt('42')); // 42
console.log(parseInt('10.5')); // 10

// Parsing with radix
console.log(parseInt('1010', 2)); // 10 (binary)
console.log(parseInt('FF', 16)); // 255 (hexadecimal)

// Parsing with non-numeric characters
console.log(parseInt('42abc')); // 42
console.log(parseInt('abc42')); // NaN`}
      useCases={[
        "String to integer conversion",
        "Base conversion",
        "Input validation"
      ]}
    />
  )
}
