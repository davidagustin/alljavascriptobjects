import ObjectPage from '../components/ObjectPage'

export default function AggregateErrorPage() {
  return (
    <ObjectPage
      title="AggregateError"
      description="Represents multiple errors that occurred"
      overview="The AggregateError constructor creates an error that represents multiple errors that occurred."
      syntax={`// Creating AggregateError
const errors = [
  new Error('First error'),
  new Error('Second error'),
  new TypeError('Type error')
];

const aggregateError = new AggregateError(errors, 'Multiple errors occurred');
console.log(aggregateError.message); // 'Multiple errors occurred'
console.log(aggregateError.errors); // Array of errors

// Promise.any rejection
Promise.any([
  Promise.reject(new Error('Error 1')),
  Promise.reject(new Error('Error 2')),
  Promise.reject(new Error('Error 3'))
]).catch(error => {
  console.log(error instanceof AggregateError); // true
  console.log(error.errors.length); // 3
});`}
      useCases={[
        "Handling multiple promise rejections",
        "Collecting validation errors",
        "Error aggregation in async operations",
        "Batch operation error handling"
      ]}
    />
  )
}
