import ObjectPage from '../components/ObjectPage';

export default function ParseFloatPage() {
  return (
    <ObjectPage
      title="parseFloat()"
      description="The parseFloat() function parses a string argument and returns a floating point number."
      overview="parseFloat() parses a string and returns a floating point number. Leading and trailing whitespace is ignored, and parsing stops at the first invalid character. It supports scientific notation (e.g., '1.23e4') but does not support hexadecimal, octal, or binary notation. parseFloat() is more permissive than the Number() constructor and returns NaN if the string cannot be converted to a number. Always validate the result with isNaN() for robust parsing."
      syntax={`// Basic parseFloat() usage
console.log(parseFloat('42')); // 42
console.log(parseFloat('42.9')); // 42.9
console.log(parseFloat('42.9px')); // 42.9 (ignores non-numeric suffix)
console.log(parseFloat('42.9.5')); // 42.9 (stops at second decimal point)

// Scientific notation
console.log(parseFloat('1.23e4')); // 12300
console.log(parseFloat('1.23E-2')); // 0.0123

// Leading and trailing whitespace
console.log(parseFloat('  42.5  ')); // 42.5
console.log(parseFloat('\\t\\n42.5\\r')); // 42.5

// Hexadecimal and other bases are not supported
console.log(parseFloat('0xFF')); // 0 (stops at 'x')
console.log(parseFloat('0o10')); // 0 (stops at 'o')

// Edge cases
console.log(parseFloat('hello')); // NaN
console.log(parseFloat('')); // NaN
console.log(parseFloat('   ')); // NaN
console.log(parseFloat('42abc')); // 42
console.log(parseFloat('abc42')); // NaN

// Converting user input
function getFloatFromUser(input) {
  const num = parseFloat(input);
  if (isNaN(num)) {
    throw new Error('Invalid number');
  }
  return num;
}

// Parsing CSS values
function parseCSSValue(value) {
  const num = parseFloat(value);
  const unit = value.replace(/[0-9.-]/g, '').trim();
  return { value: num, unit };
}

// Currency parsing
function parseCurrency(value) {
  // Remove currency symbols and commas
  const cleanValue = value.replace(/[$,€£¥]/g, '').replace(/,/g, '');
  return parseFloat(cleanValue);
}

// Practical examples
console.log(parseCSSValue('42.5px')); // { value: 42.5, unit: 'px' }
console.log(parseCSSValue('100.0%')); // { value: 100, unit: '%' }
console.log(parseCurrency('$1,234.56')); // 1234.56
console.log(parseCurrency('€99.99')); // 99.99`}
      useCases={[
        "String to float conversion",
        "Currency parsing",
        "Scientific notation parsing",
        "Decimal number extraction",
        "CSS value parsing",
        "User input validation",
        "Data cleaning and normalization",
        "Mathematical expression parsing"
      ]}
    />
  );
}
