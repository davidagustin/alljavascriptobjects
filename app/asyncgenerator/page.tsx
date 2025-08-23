import ObjectPage from '../components/ObjectPage'

export default function AsyncGeneratorPage() {
  return (
    <ObjectPage
      title="AsyncGenerator"
      description="Represents an async generator function"
      overview="The AsyncGenerator object represents an async generator function. It combines async/await with generator functionality."
      syntax={`// Async generator function
async function* asyncGenerator() {
  yield await Promise.resolve(1);
  yield await Promise.resolve(2);
  yield await Promise.resolve(3);
}

// Using async generator
async function example() {
  const gen = asyncGenerator();
  
  for await (const value of gen) {
    console.log(value); // 1, 2, 3
  }
}

// Manual iteration
async function manualIteration() {
  const gen = asyncGenerator();
  let result;
  
  while (!(result = await gen.next()).done) {
    console.log(result.value);
  }
}`}
      useCases={[
        "Async data streaming",
        "Incremental data processing",
        "Async iteration patterns",
        "Backpressure handling"
      ]}
    />
  )
}
