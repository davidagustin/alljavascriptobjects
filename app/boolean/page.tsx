import ObjectPage from '../components/ObjectPage'

export default function BooleanPage() {
  return (
    <ObjectPage
      title="Boolean"
      description="Represents a logical entity"
      overview="The Boolean constructor creates Boolean objects. It represents a logical entity and can have two values: true or false."
      syntax={`// Creating booleans
const bool1 = new Boolean(true);
const bool2 = new Boolean(false);
const bool3 = true;
const bool4 = false;

console.log(bool1); // Boolean {true}
console.log(bool2); // Boolean {false}
console.log(bool3); // true
console.log(bool4); // false

// Boolean conversion
console.log(Boolean(1)); // true
console.log(Boolean(0)); // false
console.log(Boolean('hello')); // true
console.log(Boolean('')); // false
console.log(Boolean([])); // true
console.log(Boolean({})); // true
console.log(Boolean(null)); // false
console.log(Boolean(undefined)); // false

// Boolean operations
const a = true;
const b = false;
console.log(a && b); // false (AND)
console.log(a || b); // true (OR)
console.log(!a); // false (NOT)`}
      useCases={[
        "Conditional logic",
        "Data validation",
        "Feature flags",
        "State management"
      ]}
    />
  )
}
