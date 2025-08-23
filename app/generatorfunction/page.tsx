import ObjectPage from '../components/ObjectPage'

export default function GeneratorFunctionPage() {
  return (
    <ObjectPage
      title="GeneratorFunction"
      description="Constructor for generator functions"
      overview="The GeneratorFunction constructor creates a new generator function object."
      syntax={`// Creating generator function
const GeneratorFunction = Object.getPrototypeOf(function*(){}).constructor;

const genFunc = new GeneratorFunction(\`
  yield 1;
  yield 2;
  yield 3;
\`);

// Using the generator
function example() {
  const gen = genFunc();
  
  for (const value of gen) {
    console.log(value); // 1, 2, 3
  }
}`}
      useCases={[
        "Dynamic generator creation",
        "Runtime code generation",
        "Iteration patterns",
        "Custom generators"
      ]}
    />
  )
}
