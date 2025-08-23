import ObjectPage from '../components/ObjectPage'

export default function AsyncGeneratorFunctionPage() {
  return (
    <ObjectPage
      title="AsyncGeneratorFunction"
      description="Constructor for async generator functions"
      overview="The AsyncGeneratorFunction constructor creates a new async generator function object."
      syntax={`// Creating async generator function
const AsyncGeneratorFunction = Object.getPrototypeOf(async function*(){}).constructor;

const asyncGenFunc = new AsyncGeneratorFunction(\`
  yield await Promise.resolve(1);
  yield await Promise.resolve(2);
  yield await Promise.resolve(3);
\`);

// Using the async generator
async function example() {
  const gen = asyncGenFunc();
  
  for await (const value of gen) {
    console.log(value); // 1, 2, 3
  }
}`}
      useCases={[
        "Dynamic async generator creation",
        "Runtime code generation",
        "Async iteration patterns",
        "Custom async generators"
      ]}
    />
  )
}
