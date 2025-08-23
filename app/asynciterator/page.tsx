import ObjectPage from '../components/ObjectPage';

export default function AsyncIteratorPage() {
  return (
    <ObjectPage
      title="AsyncIterator"
      description="The AsyncIterator protocol defines a standard way to produce a sequence of values asynchronously"
      overview="AsyncIterator is a protocol that defines asynchronous iteration behavior. Objects implementing the AsyncIterator protocol have a next() method that returns a Promise which resolves to an object with value and done properties. This enables asynchronous iteration over data streams, API responses, file reads, and other async data sources. AsyncIterator works with for-await-of loops and async generator functions."
      syntax={`// AsyncIterator protocol
const asyncIterator = {
  async next() {
    return { value: 'data', done: false };
  }
};

// Async generator example
async function* asyncGenerator() {
  for (let i = 0; i < 3; i++) {
    yield i;
  }
}

// Using for-await-of
async function processData() {
  for await (const value of asyncGenerator()) {
    console.log(value); // 0, 1, 2
  }
}`}
      useCases={[
        "Streaming data processing",
        "Paginated API responses", 
        "Database cursor iteration",
        "File reading line by line",
        "WebSocket message handling",
        "Event stream processing",
        "Async data transformation",
        "Real-time data feeds"
      ]}
      browserSupport="AsyncIterator is supported in modern browsers that support async/await and Symbol.asyncIterator."
    />
  );
}