import ObjectPage from '../components/ObjectPage'

export default function ReferenceErrorPage() {
  return (
    <ObjectPage
      title="ReferenceError"
      description="Represents an error when referencing a non-existent variable"
      overview="The ReferenceError constructor creates an error when referencing a non-existent variable."
      syntax={`// ReferenceError examples
try {
  console.log(nonExistentVariable);
} catch (error) {
  console.log(error instanceof ReferenceError); // true
  console.log(error.message); // nonExistentVariable is not defined
}

// Temporal dead zone with let/const
try {
  console.log(myVar); // ReferenceError
  let myVar = 5;
} catch (error) {
  console.log(error instanceof ReferenceError); // true
}

// Strict mode reference errors
function strictFunction() {
  'use strict';
  try {
    undeclaredVar = 10; // ReferenceError in strict mode
  } catch (error) {
    console.log(error instanceof ReferenceError); // true
    console.log(error.message);
  }
}

strictFunction();`}
      useCases={[
        "Variable existence checking",
        "Strict mode enforcement",
        "Temporal dead zone handling",
        "Debugging undefined variables"
      ]}
    />
  )
}
