import ObjectPage from '../components/ObjectPage';

export default function IsFinitePage() {
  return (
    <ObjectPage
      title="isFinite()"
      description="The isFinite() function determines whether a value is a finite number."
      overview="isFinite() is a global function that tests whether a value is a finite number. It returns false for NaN, Infinity, -Infinity, and values that become NaN when converted to a number. It returns true for finite numbers, including zero, negative numbers, and values that can be converted to finite numbers. Unlike Number.isFinite(), isFinite() coerces its argument to a number before testing."
      syntax={`// Basic isFinite() usage
console.log(isFinite(42)); // true
console.log(isFinite(Infinity)); // false
console.log(isFinite(-Infinity)); // false
console.log(isFinite(NaN)); // false
console.log(isFinite(0)); // true
console.log(isFinite(-0)); // true

// String coercion
console.log(isFinite('42')); // true (coerces to 42)
console.log(isFinite('hello')); // false (coerces to NaN)
console.log(isFinite('')); // true (coerces to 0)
console.log(isFinite('Infinity')); // false (coerces to Infinity)

// isFinite() vs Number.isFinite()
console.log(isFinite('42')); // true (coerces string to number)
console.log(Number.isFinite('42')); // false (no coercion)

console.log(isFinite('hello')); // false (coerces to NaN)
console.log(Number.isFinite('hello')); // false (no coercion)

console.log(isFinite(null)); // true (null coerces to 0)
console.log(Number.isFinite(null)); // false (no coercion)

console.log(isFinite(undefined)); // false (undefined coerces to NaN)
console.log(Number.isFinite(undefined)); // false (no coercion)

console.log(isFinite(true)); // true (true coerces to 1)
console.log(Number.isFinite(true)); // false (no coercion)

console.log(isFinite(false)); // true (false coerces to 0)
console.log(Number.isFinite(false)); // false (no coercion)

// Edge cases
console.log(isFinite(Number.MAX_VALUE)); // true
console.log(isFinite(Number.MIN_VALUE)); // true
console.log(isFinite(Number.MAX_SAFE_INTEGER)); // true
console.log(isFinite(Number.MIN_SAFE_INTEGER)); // true

// Objects and arrays
console.log(isFinite({})); // false (object coerces to NaN)
console.log(isFinite([])); // true (empty array coerces to 0)
console.log(isFinite([1, 2, 3])); // false (array coerces to NaN)

// Functions
console.log(isFinite(() => {})); // false (function coerces to NaN)

// Practical examples
function validateFiniteNumber(value) {
  if (!isFinite(value)) {
    return 'Value is not a finite number';
  }
  return 'Value is a finite number';
}

console.log(validateFiniteNumber(42)); // 'Value is a finite number'
console.log(validateFiniteNumber(Infinity)); // 'Value is not a finite number'
console.log(validateFiniteNumber('hello')); // 'Value is not a finite number'
console.log(validateFiniteNumber('42')); // 'Value is a finite number'

// Safer validation with Number.isFinite()
function safeValidateFiniteNumber(value) {
  if (!Number.isFinite(value)) {
    return 'Value is not a finite number';
  }
  return 'Value is a finite number';
}

console.log(safeValidateFiniteNumber(42)); // 'Value is a finite number'
console.log(safeValidateFiniteNumber('42')); // 'Value is not a finite number'
console.log(safeValidateFiniteNumber(Infinity)); // 'Value is not a finite number'

// Mathematical operation validation
function safeMathOperation(a, b, operation) {
  if (!isFinite(a) || !isFinite(b)) {
    return { result: null, error: 'Inputs must be finite numbers' };
  }
  
  let result;
  switch (operation) {
    case 'add':
      result = a + b;
      break;
    case 'subtract':
      result = a - b;
      break;
    case 'multiply':
      result = a * b;
      break;
    case 'divide':
      if (b === 0) {
        return { result: null, error: 'Division by zero' };
      }
      result = a / b;
      break;
    default:
      return { result: null, error: 'Unknown operation' };
  }
  
  if (!isFinite(result)) {
    return { result: null, error: 'Result is not finite' };
  }
  
  return { result, error: null };
}

// Testing mathematical operations
console.log(safeMathOperation(10, 5, 'add')); // { result: 15, error: null }
console.log(safeMathOperation(10, 0, 'divide')); // { result: null, error: 'Division by zero' }
console.log(safeMathOperation(Infinity, 5, 'add')); // { result: null, error: 'Inputs must be finite numbers' }
console.log(safeMathOperation('hello', 5, 'add')); // { result: null, error: 'Inputs must be finite numbers' }

// Data validation example
function validateNumericData(data) {
  const results = {
    valid: [],
    invalid: [],
    infinite: [],
    nan: []
  };

  data.forEach((item, index) => {
    const num = Number(item);
    
    if (Number.isNaN(num)) {
      results.nan.push({ index, value: item });
    } else if (!isFinite(num)) {
      results.infinite.push({ index, value: item });
    } else {
      results.valid.push({ index, value: item, number: num });
    }
  });

  return results;
}

// Testing data validation
const testData = ['42', 'hello', 'Infinity', '0', '-5', 'NaN', '3.14'];
const validation = validateNumericData(testData);
console.log('Validation results:', validation);

// Range validation
function validateNumberInRange(value, min, max) {
  const num = Number(value);
  
  if (!isFinite(num)) {
    return { isValid: false, error: 'Value is not a finite number' };
  }
  
  if (num < min || num > max) {
    return { isValid: false, error: \`Value must be between \${min} and \${max}\` };
  }
  
  return { isValid: true, value: num };
}

// Testing range validation
console.log(validateNumberInRange('42', 0, 100)); // { isValid: true, value: 42 }
console.log(validateNumberInRange('150', 0, 100)); // { isValid: false, error: 'Value must be between 0 and 100' }
console.log(validateNumberInRange('hello', 0, 100)); // { isValid: false, error: 'Value is not a finite number' }
console.log(validateNumberInRange('Infinity', 0, 100)); // { isValid: false, error: 'Value is not a finite number' }`}
      useCases={[
        "Mathematical operation validation",
        "Input range checking",
        "Data validation and cleaning",
        "API response validation",
        "Form input validation",
        "Error handling in calculations",
        "Financial calculations",
        "Scientific computing"
      ]}
    />
  );
}
