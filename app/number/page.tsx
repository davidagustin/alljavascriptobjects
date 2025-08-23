import ObjectPage from '../components/ObjectPage'

export default function NumberPage() {
  return (
    <ObjectPage
      title="Number"
      description="Represents numeric values with extensive methods for formatting, conversion, and validation"
      overview="The Number constructor creates Number objects. JavaScript's Number type is a double-precision 64-bit floating point format (IEEE 754). It provides methods for working with numbers, constants for important values, and static methods for number validation and parsing."
      syntax={`// ============ CREATING NUMBERS ============
// Number literals and types
const int = 42;                        // Integer
const float = 3.14159;                 // Floating point
const exp = 1.5e3;                     // Scientific notation (1500)
const negExp = 2.5e-3;                 // 0.0025
const hex = 0xFF;                      // Hexadecimal (255)
const oct = 0o77;                      // Octal (63)
const bin = 0b1111;                    // Binary (15)

// Number constructor vs function
const num1 = new Number(42);           // Number object (wrapper) - avoid
const num2 = Number('123');            // Type conversion function - preferred
const num3 = Number('0xFF');           // 255 (hex string)
const num4 = Number('0b1010');         // 10 (binary string)  
const num5 = Number('0o17');           // 15 (octal string)
const num6 = Number(true);             // 1
const num7 = Number(false);            // 0
const num8 = Number(null);             // 0
const num9 = Number(undefined);        // NaN
const num10 = Number('');              // 0
const num11 = Number('   ');           // 0
const num12 = Number('123abc');        // NaN

console.log(typeof num1);              // 'object' (wrapper)
console.log(typeof num2);              // 'number' (primitive)
console.log(num1 == 42);               // true (type coercion)
console.log(num1 === 42);              // false (different types)

// Numeric separators (ES2021) - for readability only
const million = 1_000_000;            // 1000000
const binary = 0b1111_0000_1111_0000; // 61680
const hex = 0xFF_EC_DE_5E;            // 4293844574
const decimal = 123_456.789_012;      // 123456.789012

// ============ NUMBER CONSTANTS ============
// Value limits and ranges
console.log(Number.MAX_VALUE);         // 1.7976931348623157e+308 (largest positive)
console.log(Number.MIN_VALUE);         // 5e-324 (smallest positive, closest to 0)
console.log(Number.MAX_SAFE_INTEGER);  // 9007199254740991 (2^53 - 1)
console.log(Number.MIN_SAFE_INTEGER);  // -9007199254740991 (-(2^53 - 1))

// Special numeric values
console.log(Number.POSITIVE_INFINITY); // Infinity
console.log(Number.NEGATIVE_INFINITY); // -Infinity
console.log(Number.NaN);               // NaN (Not a Number)

// Machine epsilon - smallest representable positive number
console.log(Number.EPSILON);           // 2.220446049250313e-16
console.log(1 + Number.EPSILON === 1); // false
console.log(1 + Number.EPSILON/2 === 1); // true

// ============ INSTANCE METHODS ============
const num = 123.456789;
const largeNum = 1234567.89;
const smallNum = 0.000123456;

// toFixed([digits]) - format with fixed decimal places
console.log(num.toFixed());            // '123' (no decimal places)
console.log(num.toFixed(0));           // '123' (explicit 0)
console.log(num.toFixed(2));           // '123.46' (rounds)
console.log(num.toFixed(4));           // '123.4568'
console.log(num.toFixed(8));           // '123.45678900' (pads with zeros)
console.log((1.005).toFixed(2));       // '1.00' (rounding quirk due to binary representation)
console.log((1.235).toFixed(2));       // '1.24' (proper rounding)
console.log((-1.23).toFixed(1));       // '-1.2'
console.log((1e21).toFixed(2));        // '1000000000000000000000.00'

// toPrecision([precision]) - format with significant digits
console.log(num.toPrecision());        // '123.456789' (no change)
console.log(num.toPrecision(1));       // '1e+2' (scientific when needed)
console.log(num.toPrecision(3));       // '123'
console.log(num.toPrecision(4));       // '123.5'
console.log(num.toPrecision(6));       // '123.457'
console.log(smallNum.toPrecision(2));  // '0.00012'
console.log(smallNum.toPrecision(3));  // '0.000123'
console.log(largeNum.toPrecision(4));  // '1.235e+6'
console.log((0.00001).toPrecision(1)); // '1e-5'

// toExponential([fractionDigits]) - exponential (scientific) notation
console.log(num.toExponential());      // '1.23456789e+2'
console.log(num.toExponential(0));     // '1e+2'
console.log(num.toExponential(2));     // '1.23e+2'
console.log(num.toExponential(4));     // '1.2346e+2'
console.log(smallNum.toExponential()); // '1.23456e-4'
console.log(largeNum.toExponential(3)); // '1.235e+6'
console.log((0).toExponential(2));     // '0.00e+0'

// toString([radix]) - convert to string with optional base (2-36)
console.log(num.toString());           // '123.456789'
console.log((255).toString(2));        // '11111111' (binary)
console.log((255).toString(8));        // '377' (octal)
console.log((255).toString(16));       // 'ff' (hexadecimal)
console.log((255).toString(36));       // '73' (base 36, uses digits 0-9 + letters a-z)
console.log((42).toString(5));         // '132' (base 5)
console.log((-42).toString(16));       // '-2a'
console.log((3.14).toString());        // '3.14' (decimals work)

// toLocaleString([locales], [options]) - locale-aware formatting
console.log(num.toLocaleString());                    // '123.457' (default locale)
console.log(num.toLocaleString('en-US'));             // '123.457' (US English)
console.log(num.toLocaleString('de-DE'));             // '123,457' (German)
console.log(num.toLocaleString('fr-FR'));             // '123,457' (French)
console.log(num.toLocaleString('en-IN'));             // '123.457' (Indian English)
console.log(largeNum.toLocaleString('en-US'));        // '1,234,567.89'
console.log(largeNum.toLocaleString('de-DE'));        // '1.234.567,89'

// Currency formatting
const price = 1234.5;
console.log(price.toLocaleString('en-US', {
  style: 'currency',
  currency: 'USD'
})); // '$1,234.50'

console.log(price.toLocaleString('de-DE', {
  style: 'currency', 
  currency: 'EUR'
})); // '1.234,50 €'

console.log(price.toLocaleString('ja-JP', {
  style: 'currency',
  currency: 'JPY'
})); // '¥1,235'

console.log(price.toLocaleString('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 3,
  maximumFractionDigits: 3
})); // '$1,234.500'

// Percentage formatting
const percent = 0.125;
console.log(percent.toLocaleString('en-US', {
  style: 'percent'
})); // '12%'

console.log(percent.toLocaleString('en-US', {
  style: 'percent',
  minimumFractionDigits: 1
})); // '12.5%'

console.log(percent.toLocaleString('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})); // '12.50%'

// Unit formatting (modern browsers)
const distance = 1500;
console.log(distance.toLocaleString('en-US', {
  style: 'unit',
  unit: 'meter'
})); // '1,500 m'

console.log(distance.toLocaleString('en-US', {
  style: 'unit', 
  unit: 'kilometer',
  unitDisplay: 'long'
})); // '1.5 kilometers'

// Compact notation (modern browsers)
const bigNumber = 1234567890;
console.log(bigNumber.toLocaleString('en-US', {
  notation: 'compact'
})); // '1.2B'

console.log(bigNumber.toLocaleString('en-US', {
  notation: 'compact',
  compactDisplay: 'long'
})); // '1.2 billion'

// valueOf() - returns primitive number value
const numObj = new Number(42);
console.log(numObj.valueOf());         // 42
console.log(typeof numObj);            // 'object'
console.log(typeof numObj.valueOf());  // 'number'
console.log(numObj.valueOf() === 42);  // true

// ============ STATIC METHODS ============

// Number.isInteger(value) - checks if value is integer
console.log(Number.isInteger(42));     // true
console.log(Number.isInteger(42.0));   // true (42.0 === 42)
console.log(Number.isInteger(42.1));   // false
console.log(Number.isInteger(-42));    // true
console.log(Number.isInteger('42'));   // false (no coercion)
console.log(Number.isInteger(NaN));    // false
console.log(Number.isInteger(Infinity)); // false
console.log(Number.isInteger(true));   // false

// Number.isFinite(value) - checks if finite number (not ±Infinity or NaN)
console.log(Number.isFinite(42));      // true
console.log(Number.isFinite(42.1));    // true
console.log(Number.isFinite(0));       // true
console.log(Number.isFinite(-1));      // true
console.log(Number.isFinite(Infinity)); // false
console.log(Number.isFinite(-Infinity)); // false
console.log(Number.isFinite(NaN));     // false
console.log(Number.isFinite('42'));    // false (no coercion)
console.log(Number.isFinite(null));    // false (no coercion)

// Compare with global isFinite (with coercion)
console.log(isFinite('42'));           // true (coerces '42' to 42)
console.log(Number.isFinite('42'));    // false (no coercion)

// Number.isNaN(value) - strict NaN check (no coercion)
console.log(Number.isNaN(NaN));        // true
console.log(Number.isNaN(42));         // false
console.log(Number.isNaN('NaN'));      // false (no coercion)
console.log(Number.isNaN(undefined));  // false (no coercion)
console.log(Number.isNaN('hello'));    // false
console.log(Number.isNaN(0 / 0));      // true (results in NaN)
console.log(Number.isNaN(Math.sqrt(-1))); // true

// Compare with global isNaN (with coercion)
console.log(isNaN('hello'));           // true (coerces 'hello' to NaN)
console.log(Number.isNaN('hello'));    // false (no coercion)

// Number.isSafeInteger(value) - checks if safe integer
console.log(Number.isSafeInteger(42)); // true
console.log(Number.isSafeInteger(0));  // true
console.log(Number.isSafeInteger(-42)); // true
console.log(Number.isSafeInteger(Number.MAX_SAFE_INTEGER)); // true
console.log(Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 1)); // false
console.log(Number.isSafeInteger(Number.MIN_SAFE_INTEGER)); // true
console.log(Number.isSafeInteger(Number.MIN_SAFE_INTEGER - 1)); // false
console.log(Number.isSafeInteger(42.1)); // false (not integer)
console.log(Number.isSafeInteger('42')); // false (no coercion)
console.log(Number.isSafeInteger(Infinity)); // false

// Number.parseFloat(string) - parse string to float
console.log(Number.parseFloat('3.14')); // 3.14
console.log(Number.parseFloat('3.14159some')); // 3.14159 (stops at non-digit)
console.log(Number.parseFloat('   3.14   ')); // 3.14 (ignores whitespace)
console.log(Number.parseFloat('3.14e2')); // 314 (scientific notation)
console.log(Number.parseFloat('3.14e-2')); // 0.0314
console.log(Number.parseFloat('some3.14')); // NaN (must start with number)
console.log(Number.parseFloat('')); // NaN
console.log(Number.parseFloat('Infinity')); // Infinity
console.log(Number.parseFloat('-Infinity')); // -Infinity
console.log(Number.parseFloat('NaN')); // NaN

// Same as global parseFloat
console.log(parseFloat('3.14') === Number.parseFloat('3.14')); // true

// Number.parseInt(string[, radix]) - parse string to integer
console.log(Number.parseInt('42'));     // 42
console.log(Number.parseInt('42.7'));   // 42 (truncates decimal)
console.log(Number.parseInt('42some')); // 42 (stops at non-digit)
console.log(Number.parseInt('   42   ')); // 42 (ignores whitespace)
console.log(Number.parseInt('some42')); // NaN (must start with number)
console.log(Number.parseInt('')); // NaN

// With radix (base)
console.log(Number.parseInt('101010', 2)); // 42 (binary)
console.log(Number.parseInt('52', 8));     // 42 (octal)
console.log(Number.parseInt('2A', 16));    // 42 (hexadecimal)
console.log(Number.parseInt('16', 36));    // 42 (base 36)
console.log(Number.parseInt('FF', 16));    // 255
console.log(Number.parseInt('0xFF', 16));  // 255 (0x prefix ignored)

// Radix edge cases
console.log(Number.parseInt('10', 2));     // 2 (binary)
console.log(Number.parseInt('10', 8));     // 8 (octal)
console.log(Number.parseInt('10', 10));    // 10 (decimal)
console.log(Number.parseInt('10', 16));    // 16 (hex)
console.log(Number.parseInt('Z', 36));     // 35 (Z is 35 in base 36)

// Same as global parseInt
console.log(parseInt('42') === Number.parseInt('42')); // true

// ============ SPECIAL VALUES AND EDGE CASES ============

// Infinity operations
console.log(1 / 0);                    // Infinity
console.log(-1 / 0);                   // -Infinity
console.log(Number.MAX_VALUE * 2);     // Infinity (overflow)
console.log(Infinity + 1);             // Infinity
console.log(Infinity + Infinity);      // Infinity
console.log(Infinity - Infinity);      // NaN
console.log(Infinity / Infinity);      // NaN
console.log(Infinity * 0);             // NaN
console.log(Infinity * -1);            // -Infinity
console.log(Math.abs(Infinity));       // Infinity
console.log(Math.abs(-Infinity));      // Infinity

// NaN operations and properties
console.log(0 / 0);                    // NaN
console.log(Infinity - Infinity);      // NaN
console.log(Math.sqrt(-1));            // NaN
console.log(Math.log(-1));             // NaN
console.log(Number('hello'));          // NaN
console.log(NaN === NaN);              // false (unique property!)
console.log(NaN == NaN);               // false
console.log(NaN !== NaN);              // true
console.log(NaN + 1);                  // NaN (NaN propagates)
console.log(NaN * 0);                  // NaN
console.log(Math.min(NaN, 5));         // NaN
console.log(Math.max(NaN, 5));         // NaN

// Testing for NaN
console.log(Number.isNaN(NaN));        // true (recommended)
console.log(Object.is(NaN, NaN));      // true
const val = NaN;
console.log(val !== val);              // true (NaN is only value not equal to itself)

// Floating point precision issues
console.log(0.1 + 0.2);                // 0.30000000000000004 (not 0.3!)
console.log(0.1 + 0.2 === 0.3);        // false
console.log(0.3 - 0.2);                // 0.09999999999999998
console.log(0.3 - 0.2 === 0.1);        // false

// Safe precision comparison
function almostEqual(a, b, epsilon = Number.EPSILON) {
  return Math.abs(a - b) < epsilon;
}
console.log(almostEqual(0.1 + 0.2, 0.3)); // true
console.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON); // true

// Large number precision loss
console.log(9007199254740992);          // 9007199254740992
console.log(9007199254740993);          // 9007199254740992 (lost precision!)
console.log(9007199254740992 === 9007199254740993); // true (both become same)
console.log(Number.MAX_SAFE_INTEGER);   // 9007199254740991
console.log(Number.MAX_SAFE_INTEGER + 1); // 9007199254740992
console.log(Number.MAX_SAFE_INTEGER + 2); // 9007199254740992 (same as +1)

// Underflow to zero
console.log(Number.MIN_VALUE / 2);      // 0 (underflow)
console.log(1e-400);                    // 0 (too small)

// ============ ADVANCED OPERATIONS AND UTILITIES ============

// Safe arithmetic operations
function safeAdd(a, b) {
  if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b)) {
    throw new Error('Arguments must be safe integers');
  }
  const result = a + b;
  if (!Number.isSafeInteger(result)) {
    throw new Error('Result exceeds safe integer range');
  }
  return result;
}

function safeMultiply(a, b) {
  const result = a * b;
  if (!Number.isSafeInteger(result)) {
    throw new Error('Result exceeds safe integer range');
  }
  return result;
}

// Precision-aware rounding
function roundToPrecision(num, precision) {
  const factor = Math.pow(10, precision);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

console.log(roundToPrecision(0.1 + 0.2, 1));    // 0.3
console.log(roundToPrecision(1.005, 2));         // 1.01 (handles rounding edge case)
console.log(roundToPrecision(1.235, 2));         // 1.24

// Currency calculations with proper rounding
function currencyAdd(a, b) {
  return Math.round((a + b) * 100) / 100;
}

function currencyMultiply(amount, rate) {
  return Math.round(amount * rate * 100) / 100;
}

console.log(currencyAdd(0.1, 0.2));              // 0.3
console.log(currencyMultiply(19.99, 1.08));      // 21.59

// Number validation and sanitization
function validateNumber(value, options = {}) {
  const {
    allowInfinity = false,
    allowNaN = false,
    mustBeInteger = false,
    mustBeSafe = false,
    min = -Infinity,
    max = Infinity
  } = options;
  
  const num = Number(value);
  const result = { valid: true, value: num, errors: [] };
  
  if (Number.isNaN(num) && !allowNaN) {
    result.valid = false;
    result.errors.push('Value is not a number');
  }
  
  if (!Number.isFinite(num) && !allowInfinity) {
    result.valid = false;
    result.errors.push('Value must be finite');
  }
  
  if (mustBeInteger && !Number.isInteger(num)) {
    result.valid = false;
    result.errors.push('Value must be an integer');
  }
  
  if (mustBeSafe && !Number.isSafeInteger(num)) {
    result.valid = false;
    result.errors.push('Value must be a safe integer');
  }
  
  if (num < min) {
    result.valid = false;
    result.errors.push(\`Value must be at least \${min}\`);
  }
  
  if (num > max) {
    result.valid = false;
    result.errors.push(\`Value must be at most \${max}\`);
  }
  
  return result;
}

// Number parsing with validation
function parseNumber(str, radix) {
  if (typeof str !== 'string') {
    return { success: false, error: 'Input must be string' };
  }
  
  const trimmed = str.trim();
  if (trimmed === '') {
    return { success: false, error: 'Empty string' };
  }
  
  let num;
  if (radix !== undefined) {
    if (!Number.isInteger(radix) || radix < 2 || radix > 36) {
      return { success: false, error: 'Invalid radix' };
    }
    num = Number.parseInt(trimmed, radix);
  } else {
    // Try parseInt first for integers, then parseFloat
    const intResult = Number.parseInt(trimmed, 10);
    const floatResult = Number.parseFloat(trimmed);
    
    // Use integer if it matches the full string
    if (intResult.toString() === trimmed) {
      num = intResult;
    } else {
      num = floatResult;
    }
  }
  
  if (Number.isNaN(num)) {
    return { success: false, error: 'Could not parse as number' };
  }
  
  return { success: true, value: num };
}

// Random number generation
function randomInt(min, max) {
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new Error('Min and max must be integers');
  }
  if (min > max) {
    [min, max] = [max, min];
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, precision = 2) {
  if (min > max) {
    [min, max] = [max, min];
  }
  const random = Math.random() * (max - min) + min;
  return Number(random.toFixed(precision));
}

// Comprehensive number formatting
const NumberFormatters = {
  currency(num, currency = 'USD', locale = 'en-US') {
    return num.toLocaleString(locale, {
      style: 'currency',
      currency: currency
    });
  },
  
  percent(num, precision = 1, locale = 'en-US') {
    return num.toLocaleString(locale, {
      style: 'percent',
      minimumFractionDigits: precision,
      maximumFractionDigits: precision
    });
  },
  
  compact(num, locale = 'en-US') {
    return num.toLocaleString(locale, {
      notation: 'compact',
      maximumFractionDigits: 1
    });
  },
  
  scientific(num, precision = 2) {
    return num.toExponential(precision);
  },
  
  ordinal(num) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const remainder = num % 100;
    const suffix = suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0];
    return num + suffix;
  },
  
  fileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return \`\${size.toFixed(unitIndex === 0 ? 0 : 1)} \${units[unitIndex]}\`;
  },
  
  duration(ms) {
    const units = [
      { name: 'ms', value: 1 },
      { name: 's', value: 1000 },
      { name: 'm', value: 60000 },
      { name: 'h', value: 3600000 },
      { name: 'd', value: 86400000 }
    ];
    
    for (let i = units.length - 1; i >= 0; i--) {
      if (ms >= units[i].value) {
        const value = ms / units[i].value;
        return \`\${value.toFixed(value < 10 ? 1 : 0)}\${units[i].name}\`;
      }
    }
    
    return \`\${ms}ms\`;
  }
};

// Examples of formatters
console.log(NumberFormatters.currency(1234.56));        // '$1,234.56'
console.log(NumberFormatters.currency(1234.56, 'EUR', 'de-DE')); // '1.234,56 €'
console.log(NumberFormatters.percent(0.1567));          // '15.7%'
console.log(NumberFormatters.compact(1234567));         // '1.2M'
console.log(NumberFormatters.scientific(1234567));      // '1.23e+6'
console.log(NumberFormatters.ordinal(21));              // '21st'
console.log(NumberFormatters.ordinal(22));              // '22nd'
console.log(NumberFormatters.ordinal(23));              // '23rd'
console.log(NumberFormatters.ordinal(24));              // '24th'
console.log(NumberFormatters.fileSize(1536));           // '1.5 KB'
console.log(NumberFormatters.fileSize(1073741824));     // '1.0 GB'
console.log(NumberFormatters.duration(1500));           // '1.5s'
console.log(NumberFormatters.duration(90000));          // '1.5m'

// Mathematical utility functions
const MathUtils = {
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },
  
  lerp(start, end, t) {
    return start + (end - start) * t;
  },
  
  normalize(value, min, max) {
    return (value - min) / (max - min);
  },
  
  map(value, inMin, inMax, outMin, outMax) {
    const normalized = this.normalize(value, inMin, inMax);
    return this.lerp(outMin, outMax, normalized);
  },
  
  isPowerOfTwo(n) {
    return Number.isInteger(n) && n > 0 && (n & (n - 1)) === 0;
  },
  
  gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  },
  
  lcm(a, b) {
    return Math.abs(a * b) / this.gcd(a, b);
  },
  
  factorial(n) {
    if (!Number.isInteger(n) || n < 0) {
      throw new Error('Factorial requires non-negative integer');
    }
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  },
  
  fibonacci(n) {
    if (!Number.isInteger(n) || n < 0) {
      throw new Error('Fibonacci requires non-negative integer');
    }
    if (n <= 1) return n;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
      [a, b] = [b, a + b];
    }
    return b;
  }
};

// Performance considerations and tips
console.log('=== Performance Tips ===');

// Use Number.isInteger instead of % operator for integer checks
console.time('isInteger');
for (let i = 0; i < 100000; i++) {
  Number.isInteger(Math.random() * 100);
}
console.timeEnd('isInteger');

console.time('modulo check');
for (let i = 0; i < 100000; i++) {
  const n = Math.random() * 100;
  n % 1 === 0;
}
console.timeEnd('modulo check');

// Avoid repeated Number() calls in loops
const strings = ['1', '2', '3', '4', '5'];
console.time('Number() in loop');
let sum = 0;
for (const str of strings) {
  sum += Number(str);
}
console.timeEnd('Number() in loop');

console.time('pre-convert');
const numbers = strings.map(Number);
sum = 0;
for (const num of numbers) {
  sum += num;
}
console.timeEnd('pre-convert');`}
      complexity="beginner"
      relatedObjects={['Math', 'BigInt', 'String', 'parseInt', 'parseFloat']}
      browserSupport="Number is supported in all JavaScript environments and browsers."
      useCases={[
        "Numeric calculations and arithmetic",
        "Currency and financial calculations", 
        "Data formatting and display",
        "Input validation and sanitization",
        "Mathematical operations and algorithms",
        "Statistical computations",
        "Scientific notation handling",
        "Locale-specific number formatting",
        "Precision-critical calculations",
        "Random number generation",
        "Unit conversions and measurements",
        "Performance optimization with numbers",
        "Binary and hexadecimal operations",
        "Safe integer operations",
        "Floating point precision handling"
      ]}
      examples={[
        {
          id: "number-validation-parsing",
          title: "Number Validation and Parsing",
          description: "Validate and parse various numeric inputs safely",
          difficulty: 'intermediate',
          tags: ['validation', 'parsing', 'error-handling'],
          code: `// Comprehensive number validation function\nfunction validateAndParseNumber(input, options = {}) {\n  const { allowFloat = true, min = -Infinity, max = Infinity } = options\n  \n  // Convert to number\n  const num = Number(input)\n  \n  // Check if it's a valid number\n  if (Number.isNaN(num)) {\n    throw new Error('Invalid number')\n  }\n  \n  // Check if integer is required\n  if (!allowFloat && !Number.isInteger(num)) {\n    throw new Error('Integer required')\n  }\n  \n  // Check range\n  if (num < min || num > max) {\n    throw new Error(\`Number must be between \${min} and \${max}\`)\n  }\n  \n  return num\n}\n\nconsole.log(validateAndParseNumber('42.5'))     // 42.5\nconsole.log(validateAndParseNumber('42.5', { allowFloat: false })) // Error\nconsole.log(validateAndParseNumber('100', { min: 0, max: 50 }))    // Error`
        },
        {
          id: "currency-formatting-locales",
          title: "Currency Formatting with Locales",
          description: "Format numbers as currency for different locales and regions",
          difficulty: 'beginner',
          tags: ['formatting', 'currency', 'locales', 'i18n'],
          code: `const price = 1234.56\n\n// US Dollar\nconsole.log(price.toLocaleString('en-US', {\n  style: 'currency',\n  currency: 'USD'\n})) // $1,234.56\n\n// Euro (German)\nconsole.log(price.toLocaleString('de-DE', {\n  style: 'currency',\n  currency: 'EUR'\n})) // 1.234,56 €\n\n// Japanese Yen\nconsole.log(price.toLocaleString('ja-JP', {\n  style: 'currency',\n  currency: 'JPY'\n})) // ¥1,235\n\n// Percentage\nconst rate = 0.0875\nconsole.log(rate.toLocaleString('en-US', {\n  style: 'percent',\n  minimumFractionDigits: 2\n})) // 8.75%`
        },
        {
          id: "safe-floating-point-operations",
          title: "Safe Floating Point Operations",
          description: "Handle floating point precision issues in calculations",
          difficulty: 'advanced',
          tags: ['precision', 'floating-point', 'mathematics', 'edge-cases'],
          code: `// The infamous floating point problem\nconsole.log(0.1 + 0.2)         // 0.30000000000000004\nconsole.log(0.1 + 0.2 === 0.3) // false\n\n// Safe comparison using epsilon\nfunction almostEqual(a, b, epsilon = Number.EPSILON) {\n  return Math.abs(a - b) < epsilon\n}\n\nconsole.log(almostEqual(0.1 + 0.2, 0.3)) // true\n\n// Safe rounding for currency\nfunction currencyRound(amount) {\n  return Math.round((amount + Number.EPSILON) * 100) / 100\n}\n\nconsole.log(currencyRound(0.1 + 0.2))  // 0.3\nconsole.log(currencyRound(1.005))      // 1.01\n\n// Safe arithmetic operations\nclass SafeMath {\n  static add(a, b) {\n    return currencyRound(a + b)\n  }\n  \n  static multiply(a, b) {\n    return currencyRound(a * b)\n  }\n}\n\nconsole.log(SafeMath.add(0.1, 0.2))      // 0.3\nconsole.log(SafeMath.multiply(19.99, 1.08)) // 21.59`
        }
      ]}
    />
  )
}