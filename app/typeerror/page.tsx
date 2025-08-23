import ObjectPage from '../components/ObjectPage'

export default function TypeErrorPage() {
  return (
    <ObjectPage
      title="TypeError"
      description="Represents an error when a value is not of the expected type"
      overview="The TypeError constructor creates an error when a value is not of the expected type."
      syntax={`// TypeError examples
try {
  null.toString(); // Cannot read properties of null
} catch (error) {
  console.log(error instanceof TypeError); // true
}

try {
  const num = 42;
  num(); // Number is not a function
} catch (error) {
  console.log(error instanceof TypeError); // true
}

// Type checking
function processArray(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('Expected an array');
  }
  return arr.map(x => x * 2);
}

try {
  processArray('not an array');
} catch (error) {
  console.log(error.message); // Expected an array
}

// Property access errors
const obj = Object.freeze({ name: 'John' });

try {
  obj.name = 'Jane'; // Cannot assign to read-only property
} catch (error) {
  console.log(error instanceof TypeError); // true (in strict mode)
}`}
      useCases={[
        "Type validation",
        "Property access checking",
        "Function parameter validation",
        "Object property modification"
      ]}
    />
  )
}
