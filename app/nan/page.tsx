import ObjectPage from '../components/ObjectPage';

export default function NaNPage() {
  return (
    <ObjectPage
      title="NaN"
      description="The global NaN property is a value representing Not-A-Number."
      overview="NaN (Not-a-Number) is a special numeric value that represents an undefined or unrepresentable mathematical result. It's the result of invalid mathematical operations like dividing zero by zero, taking the square root of a negative number, or converting non-numeric strings to numbers. NaN has unique properties: it's not equal to itself (NaN !== NaN), it's falsy in boolean contexts, and it propagates through mathematical operations. Use Number.isNaN() to check for NaN values reliably."
      syntax={`// Basic NaN usage
console.log(NaN); // NaN

// NaN is not equal to itself
console.log(NaN === NaN); // false
console.log(NaN !== NaN); // true

// Checking for NaN
console.log(Number.isNaN(NaN)); // true (recommended)
console.log(isNaN(NaN)); // true (coerces values)
console.log(Object.is(NaN, NaN)); // true

// Operations that result in NaN
console.log(0 / 0); // NaN
console.log(Infinity - Infinity); // NaN
console.log(Math.sqrt(-1)); // NaN
console.log(parseInt('hello')); // NaN
console.log('hello' * 5); // NaN

// NaN in arrays and objects
const arr = [1, 2, NaN, 4, 5];
console.log(arr.includes(NaN)); // true
console.log(arr.findIndex(x => Number.isNaN(x))); // 2

// Safe number parsing
function safeParseNumber(input) {
  const num = Number(input);
  if (Number.isNaN(num)) {
    throw new Error(\`Cannot parse '\${input}' as a number\`);
  }
  return num;
}

// Data validation with NaN handling
function validateNumericData(data) {
  return data.filter(x => !Number.isNaN(Number(x)));
}`}
      useCases={[
        "Error handling in mathematical operations",
        "Data validation and cleaning",
        "Safe number parsing from user input",
        "Statistical calculations with missing data",
        "API response validation",
        "Form input validation",
        "Database query result processing",
        "Financial calculations with invalid inputs"
      ]}
    />
  );
}
