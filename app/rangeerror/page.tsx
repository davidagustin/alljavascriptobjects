import ObjectPage from '../components/ObjectPage'

export default function RangeErrorPage() {
  return (
    <ObjectPage
      title="RangeError"
      description="Creates an error when a value is not in the allowed range"
      overview="The RangeError constructor creates an error when a value is not in the allowed range or set."
      syntax={`// RangeError examples
try {
  const arr = new Array(-1); // Negative array length
} catch (error) {
  console.log(error instanceof RangeError); // true
  console.log(error.message); // Invalid array length
}

try {
  (42).toFixed(101); // Precision out of range
} catch (error) {
  console.log(error instanceof RangeError); // true
}

// Custom range validation
function setAge(age) {
  if (age < 0 || age > 150) {
    throw new RangeError(\`Age must be between 0 and 150, got \${age}\`);
  }
  return age;
}

try {
  setAge(200);
} catch (error) {
  console.log(error.message); // Age must be between 0 and 150, got 200
}`}
      useCases={[
        "Array length validation",
        "Number precision limits",
        "Custom range validation",
        "Parameter bounds checking"
      ]}
    />
  )
}
