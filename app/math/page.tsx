import ObjectPage from '../components/ObjectPage'

export default function MathPage() {
  return (
    <ObjectPage
      title="Math"
      description="Provides mathematical constants and functions"
      overview="The Math object provides mathematical constants and functions for mathematical operations."
      syntax={`// ============ MATH CONSTANTS ============
// Mathematical constants (all read-only)

console.log(Math.E);        // 2.718281828459045 - Euler's number
console.log(Math.LN10);     // 2.302585092994046 - Natural log of 10
console.log(Math.LN2);      // 0.6931471805599453 - Natural log of 2
console.log(Math.LOG10E);   // 0.4342944819032518 - Base-10 log of E
console.log(Math.LOG2E);    // 1.4426950408889634 - Base-2 log of E
console.log(Math.PI);       // 3.141592653589793 - Pi
console.log(Math.SQRT1_2);  // 0.7071067811865476 - Square root of 1/2
console.log(Math.SQRT2);    // 1.4142135623730951 - Square root of 2

// ============ BASIC ARITHMETIC METHODS ============

// Math.abs(x) - absolute value
console.log(Math.abs(-5));      // 5
console.log(Math.abs(5));       // 5
console.log(Math.abs(-3.14));   // 3.14
console.log(Math.abs(null));    // 0
console.log(Math.abs(''));      // 0
console.log(Math.abs([]));      // 0
console.log(Math.abs([2]));     // 2
console.log(Math.abs([1,2]));   // NaN

// Math.sign(x) - sign of number (-1, 0, or 1)
console.log(Math.sign(3));      // 1
console.log(Math.sign(-3));     // -1
console.log(Math.sign(0));      // 0
console.log(Math.sign(-0));     // -0
console.log(Math.sign(NaN));    // NaN
console.log(Math.sign('foo'));  // NaN
console.log(Math.sign());       // NaN

// ============ ROUNDING METHODS ============

// Math.ceil(x) - rounds up to nearest integer
console.log(Math.ceil(4.1));    // 5
console.log(Math.ceil(4.9));    // 5
console.log(Math.ceil(-4.1));   // -4
console.log(Math.ceil(-4.9));   // -4

// Math.floor(x) - rounds down to nearest integer
console.log(Math.floor(4.1));   // 4
console.log(Math.floor(4.9));   // 4
console.log(Math.floor(-4.1));  // -5
console.log(Math.floor(-4.9));  // -5

// Math.round(x) - rounds to nearest integer
console.log(Math.round(4.4));   // 4
console.log(Math.round(4.5));   // 5
console.log(Math.round(4.6));   // 5
console.log(Math.round(-4.5));  // -4 (rounds toward +∞ for .5)

// Math.trunc(x) - removes decimal part (ES2015)
console.log(Math.trunc(4.9));   // 4
console.log(Math.trunc(-4.9));  // -4
console.log(Math.trunc(0.123)); // 0
console.log(Math.trunc(-0.123));// -0

// Math.fround(x) - nearest 32-bit float representation
console.log(Math.fround(1.337));      // 1.3370000123977661
console.log(Math.fround(1.5));        // 1.5
console.log(Math.fround(NaN));        // NaN

// ============ MIN/MAX METHODS ============

// Math.max(...values) - largest value
console.log(Math.max(1, 2, 3, 4, 5));      // 5
console.log(Math.max(-1, -2, -3));         // -1
console.log(Math.max());                    // -Infinity
console.log(Math.max(1, 2, 'hello'));      // NaN

// Using with arrays
const numbers = [1, 2, 3, 4, 5];
console.log(Math.max(...numbers));          // 5
console.log(Math.max.apply(null, numbers)); // 5

// Math.min(...values) - smallest value
console.log(Math.min(1, 2, 3, 4, 5));      // 1
console.log(Math.min(-1, -2, -3));         // -3
console.log(Math.min());                    // Infinity
console.log(Math.min(...numbers));          // 1

// ============ POWER AND ROOT METHODS ============

// Math.pow(base, exponent) - base to exponent power
console.log(Math.pow(2, 3));     // 8
console.log(Math.pow(4, 0.5));   // 2
console.log(Math.pow(7, -2));    // 0.02040816326530612
console.log(Math.pow(-7, 0.5));  // NaN

// Math.sqrt(x) - square root
console.log(Math.sqrt(9));       // 3
console.log(Math.sqrt(2));       // 1.4142135623730951
console.log(Math.sqrt(1));       // 1
console.log(Math.sqrt(0));       // 0
console.log(Math.sqrt(-1));      // NaN

// Math.cbrt(x) - cube root (ES2015)
console.log(Math.cbrt(8));       // 2
console.log(Math.cbrt(27));      // 3
console.log(Math.cbrt(-8));      // -2
console.log(Math.cbrt(0));       // 0

// Math.hypot(...values) - square root of sum of squares (ES2015)
console.log(Math.hypot(3, 4));   // 5 (Pythagorean theorem)
console.log(Math.hypot(3, 4, 5)); // 7.0710678118654755
console.log(Math.hypot());       // 0
console.log(Math.hypot(NaN));    // NaN

// ============ EXPONENTIAL AND LOGARITHMIC ============

// Math.exp(x) - e^x
console.log(Math.exp(0));        // 1
console.log(Math.exp(1));        // 2.718281828459045 (e)
console.log(Math.exp(-1));       // 0.36787944117144233

// Math.expm1(x) - e^x - 1 (ES2015)
console.log(Math.expm1(0));      // 0
console.log(Math.expm1(1));      // 1.718281828459045
console.log(Math.expm1(-1));     // -0.6321205588285577

// Math.log(x) - natural logarithm (base e)
console.log(Math.log(1));        // 0
console.log(Math.log(Math.E));   // 1
console.log(Math.log(10));       // 2.302585092994046

// Math.log10(x) - base 10 logarithm (ES2015)
console.log(Math.log10(1));      // 0
console.log(Math.log10(10));     // 1
console.log(Math.log10(100));    // 2
console.log(Math.log10(1000));   // 3

// Math.log2(x) - base 2 logarithm (ES2015)
console.log(Math.log2(1));       // 0
console.log(Math.log2(2));       // 1
console.log(Math.log2(8));       // 3
console.log(Math.log2(1024));    // 10

// Math.log1p(x) - natural log of 1 + x (ES2015)
console.log(Math.log1p(0));      // 0
console.log(Math.log1p(1));      // 0.6931471805599453
console.log(Math.log1p(-1));     // -Infinity

// ============ TRIGONOMETRIC METHODS ============

// Math.sin(x) - sine (x in radians)
console.log(Math.sin(0));             // 0
console.log(Math.sin(Math.PI / 2));   // 1
console.log(Math.sin(Math.PI));       // ~0 (1.2246467991473532e-16)

// Math.cos(x) - cosine (x in radians)
console.log(Math.cos(0));             // 1
console.log(Math.cos(Math.PI / 2));   // ~0 (6.123233995736766e-17)
console.log(Math.cos(Math.PI));       // -1

// Math.tan(x) - tangent (x in radians)
console.log(Math.tan(0));             // 0
console.log(Math.tan(Math.PI / 4));   // ~1 (0.9999999999999999)
console.log(Math.tan(Math.PI));       // ~0

// ============ INVERSE TRIGONOMETRIC ============

// Math.asin(x) - arcsine (returns radians)
console.log(Math.asin(0));       // 0
console.log(Math.asin(0.5));     // 0.5235987755982989 (π/6)
console.log(Math.asin(1));       // 1.5707963267948966 (π/2)

// Math.acos(x) - arccosine (returns radians)
console.log(Math.acos(1));       // 0
console.log(Math.acos(0.5));     // 1.0471975511965979 (π/3)
console.log(Math.acos(0));       // 1.5707963267948966 (π/2)

// Math.atan(x) - arctangent (returns radians)
console.log(Math.atan(0));       // 0
console.log(Math.atan(1));       // 0.7853981633974483 (π/4)
console.log(Math.atan(Infinity)); // 1.5707963267948966 (π/2)

// Math.atan2(y, x) - arctangent of y/x (considers quadrant)
console.log(Math.atan2(1, 1));   // 0.7853981633974483 (π/4)
console.log(Math.atan2(1, 0));   // 1.5707963267948966 (π/2)
console.log(Math.atan2(0, -1));  // 3.141592653589793 (π)
console.log(Math.atan2(-1, -1)); // -2.356194490192345 (-3π/4)

// ============ HYPERBOLIC FUNCTIONS (ES2015) ============

// Math.sinh(x) - hyperbolic sine
console.log(Math.sinh(0));       // 0
console.log(Math.sinh(1));       // 1.1752011936438014
console.log(Math.sinh(-1));      // -1.1752011936438014

// Math.cosh(x) - hyperbolic cosine
console.log(Math.cosh(0));       // 1
console.log(Math.cosh(1));       // 1.5430806348152437
console.log(Math.cosh(-1));      // 1.5430806348152437

// Math.tanh(x) - hyperbolic tangent
console.log(Math.tanh(0));       // 0
console.log(Math.tanh(1));       // 0.7615941559557649
console.log(Math.tanh(Infinity)); // 1

// Math.asinh(x) - inverse hyperbolic sine
console.log(Math.asinh(0));      // 0
console.log(Math.asinh(1));      // 0.881373587019543

// Math.acosh(x) - inverse hyperbolic cosine
console.log(Math.acosh(1));      // 0
console.log(Math.acosh(2));      // 1.3169578969248166

// Math.atanh(x) - inverse hyperbolic tangent
console.log(Math.atanh(0));      // 0
console.log(Math.atanh(0.5));    // 0.5493061443340548

// ============ OTHER METHODS ============

// Math.random() - random number [0, 1)
console.log(Math.random());      // e.g., 0.7394859832145632
console.log(Math.random());      // e.g., 0.2351908475292847

// Math.clz32(x) - count leading zero bits in 32-bit binary (ES2015)
console.log(Math.clz32(1));      // 31 (0000...0001)
console.log(Math.clz32(1000));   // 22
console.log(Math.clz32(0));      // 32

// Math.imul(a, b) - 32-bit integer multiplication (ES2015)
console.log(Math.imul(2, 4));          // 8
console.log(Math.imul(-1, 8));         // -8
console.log(Math.imul(0xffffffff, 5)); // -5

// ============ PRACTICAL EXAMPLES ============

// 1. Random number utilities
function random(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

console.log(random(1, 10));        // e.g., 5.739483927
console.log(randomInt(1, 10));     // e.g., 7
console.log(randomChoice(['a', 'b', 'c'])); // e.g., 'b'

// 2. Geometric calculations
function distance(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}

console.log(distance(0, 0, 3, 4)); // 5
console.log(degreesToRadians(180)); // 3.141592653589793
console.log(radiansToDegrees(Math.PI)); // 180

// 3. Clamping and normalization
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normalize(value, min, max) {
  return (value - min) / (max - min);
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

console.log(clamp(15, 0, 10));     // 10
console.log(normalize(5, 0, 10));  // 0.5
console.log(lerp(0, 100, 0.25));   // 25

// 4. Statistics
function mean(numbers) {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

function standardDeviation(numbers) {
  const avg = mean(numbers);
  const squareDiffs = numbers.map(n => Math.pow(n - avg, 2));
  return Math.sqrt(mean(squareDiffs));
}

const data = [2, 4, 4, 4, 5, 5, 7, 9];
console.log('Mean:', mean(data)); // 5
console.log('StdDev:', standardDeviation(data)); // 2

// 5. Rounding to decimal places
function roundTo(number, decimals) {
  return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

console.log(roundTo(3.14159, 2));  // 3.14
console.log(roundTo(3.14159, 4));  // 3.1416

// 6. Check if number is integer
function isInteger(value) {
  return Math.floor(value) === value;
}

console.log(isInteger(4));         // true
console.log(isInteger(4.5));       // false`}
      useCases={[
        "Mathematical calculations",
        "Game development",
        "Data analysis",
        "Scientific computing"
      ]}
    />
  )
}
