import ObjectPage from '../components/ObjectPage';

export default function InfinityPage() {
  return (
    <ObjectPage
      title="Infinity"
      description="The global Infinity property is a numeric value representing infinity."
      overview="Infinity is a global property that represents positive infinity, a value greater than any finite number. It's the result of mathematical operations like division by zero (1/0) and is used to represent unbounded values in algorithms. Infinity has special properties: it's greater than any finite number, it's not equal to itself in some contexts, and mathematical operations with Infinity follow specific rules. Negative infinity (-Infinity) represents negative infinity. Both Infinity and -Infinity are useful for representing unbounded values, sentinel values in algorithms, and handling edge cases in mathematical computations."
      syntax={`// Basic Infinity usage
console.log(Infinity); // Infinity
console.log(-Infinity); // -Infinity

// Infinity is greater than any other number
console.log(Infinity > 1000000); // true
console.log(Infinity > Number.MAX_VALUE); // true

// Mathematical operations with Infinity
console.log(Infinity + 1); // Infinity
console.log(Infinity - 1); // Infinity
console.log(Infinity * 2); // Infinity
console.log(Infinity / 2); // Infinity
console.log(Infinity + Infinity); // Infinity
console.log(Infinity - Infinity); // NaN
console.log(Infinity * Infinity); // Infinity
console.log(Infinity / Infinity); // NaN

// Division by zero results in Infinity
console.log(1 / 0); // Infinity
console.log(-1 / 0); // -Infinity
console.log(0 / 0); // NaN

// Checking for Infinity
console.log(Number.isFinite(Infinity)); // false
console.log(isFinite(Infinity)); // false

// Using Infinity for algorithm boundaries
function findMinimum(arr) {
  let min = Infinity;
  for (const num of arr) {
    if (num < min) {
      min = num;
    }
  }
  return min === Infinity ? null : min;
}

function findMaximum(arr) {
  let max = -Infinity;
  for (const num of arr) {
    if (num > max) {
      max = num;
    }
  }
  return max === -Infinity ? null : max;
}

// Error handling with Infinity
function safeDivide(a, b) {
  if (b === 0) {
    if (a > 0) return Infinity;
    if (a < 0) return -Infinity;
    return NaN; // 0 / 0
  }
  return a / b;
}

// Math functions with Infinity
console.log(Math.abs(Infinity)); // Infinity
console.log(Math.abs(-Infinity)); // Infinity
console.log(Math.min(1, 2, 3, Infinity)); // 1
console.log(Math.max(1, 2, 3, Infinity)); // Infinity`}
      useCases={[
        "Algorithm boundary values and sentinels",
        "Mathematical computations and limits",
        "Error handling in division operations",
        "Finding minimum and maximum values",
        "Sorting algorithms with sentinel values",
        "Data validation and range checking",
        "Mathematical function implementations",
        "Performance optimization in loops"
      ]}
    />
  );
}
