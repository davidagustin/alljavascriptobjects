import ObjectPage from '../components/ObjectPage';

export default function IsNaNPage() {
  return (
    <ObjectPage
      title="isNaN()"
      description="The isNaN() function determines whether a value is NaN or not."
      overview="isNaN() is a global function that tests whether a value is NaN (Not-a-Number). Unlike Number.isNaN(), isNaN() coerces its argument to a number before testing. This means isNaN() returns true for values that are not NaN but become NaN when converted to a number (like strings that can't be parsed as numbers). For more reliable NaN checking, use Number.isNaN() which doesn't perform type coercion."
      syntax={`// Basic isNaN() usage
console.log(isNaN(NaN)); // true
console.log(isNaN(42)); // false
console.log(isNaN('hello')); // true (coerces to NaN)
console.log(isNaN('42')); // false (coerces to 42)

// isNaN() vs Number.isNaN()
console.log(isNaN('hello')); // true (coerces string to NaN)
console.log(Number.isNaN('hello')); // false (no coercion)

console.log(isNaN('')); // false (empty string coerces to 0)
console.log(Number.isNaN('')); // false

console.log(isNaN(null)); // false (null coerces to 0)
console.log(Number.isNaN(null)); // false

console.log(isNaN(undefined)); // true (undefined coerces to NaN)
console.log(Number.isNaN(undefined)); // false

console.log(isNaN(true)); // false (true coerces to 1)
console.log(isNaN(false)); // false (false coerces to 0)

// Edge cases
console.log(isNaN(Infinity)); // false
console.log(isNaN(-Infinity)); // false
console.log(isNaN(0)); // false
console.log(isNaN(-0)); // false

// Objects and arrays
console.log(isNaN({})); // true (object coerces to NaN)
console.log(isNaN([])); // false (empty array coerces to 0)
console.log(isNaN([1, 2, 3])); // true (array coerces to NaN)

// Functions
console.log(isNaN(() => {})); // true (function coerces to NaN)

// Practical examples
function validateNumericInput(value) {
  if (isNaN(value)) {
    return 'Invalid number';
  }
  return 'Valid number';
}

console.log(validateNumericInput('42')); // 'Valid number'
console.log(validateNumericInput('hello')); // 'Invalid number'
console.log(validateNumericInput('')); // 'Valid number' (empty string = 0)

// Safer validation with Number.isNaN()
function safeValidateNumericInput(value) {
  const num = Number(value);
  if (Number.isNaN(num)) {
    return 'Invalid number';
  }
  return 'Valid number';
}

console.log(safeValidateNumericInput('42')); // 'Valid number'
console.log(safeValidateNumericInput('hello')); // 'Invalid number'
console.log(safeValidateNumericInput('')); // 'Valid number' (empty string = 0)

// Form validation example
function validateFormField(value) {
  const num = parseFloat(value);
  
  if (isNaN(num)) {
    return { isValid: false, error: 'Please enter a valid number' };
  }
  
  if (num < 0) {
    return { isValid: false, error: 'Number must be positive' };
  }
  
  return { isValid: true, value: num };
}

// Testing different inputs
console.log(validateFormField('42')); // { isValid: true, value: 42 }
console.log(validateFormField('hello')); // { isValid: false, error: 'Please enter a valid number' }
console.log(validateFormField('-5')); // { isValid: false, error: 'Number must be positive' }
console.log(validateFormField('')); // { isValid: false, error: 'Please enter a valid number' }`}
      useCases={[
        "Form input validation",
        "Data type checking",
        "Mathematical operation validation",
        "API response validation",
        "User input processing",
        "Data cleaning and normalization",
        "Error handling in calculations",
        "Type coercion scenarios"
      ]}
    />
  );
}
