import ObjectPage from '../components/ObjectPage'

export default function AsyncFunctionPage() {
  return (
    <ObjectPage
      title="AsyncFunction"
      description="Constructor for async functions"
      overview="The AsyncFunction constructor creates a new async function object. It is similar to Function but creates async functions."
      syntax={`// Creating async function
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

const asyncFunc = new AsyncFunction('a', 'b', 'return await Promise.resolve(a + b);');

// Using the async function
asyncFunc(2, 3).then(result => {
  console.log(result); // 5
});

// Comparison with regular function
const regularFunc = new Function('a', 'b', 'return a + b;');
console.log(regularFunc(2, 3)); // 5`}
      useCases={[
        "Dynamic async function creation",
        "Code evaluation with async capabilities",
        "Runtime function generation",
        "Async code execution"
      ]}
    />
  )
}
