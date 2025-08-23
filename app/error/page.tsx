import ObjectPage from '../components/ObjectPage'

export default function ErrorPage() {
  return (
    <ObjectPage
      title="Error"
      description="Represents an error that occurred"
      overview="The Error constructor creates Error objects. It represents an error that occurred during the execution of code."
      syntax={`// Creating errors
const error1 = new Error('Something went wrong');
const error2 = new TypeError('Invalid type');
const error3 = new ReferenceError('Variable not defined');
const error4 = new SyntaxError('Invalid syntax');

console.log(error1.message); // 'Something went wrong'
console.log(error1.name); // 'Error'
console.log(error2.name); // 'TypeError'

// Custom error class
class CustomError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
  }
}

const customError = new CustomError('Custom error message', 'ERR001');
console.log(customError.message); // 'Custom error message'
console.log(customError.code); // 'ERR001'

// Error handling
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

try {
  const result = divide(10, 0);
  console.log(result);
} catch (error) {
  console.error('Error:', error.message); // 'Error: Division by zero'
  console.error('Stack:', error.stack);
}`}
      useCases={[
        "Error handling and debugging",
        "Custom error types",
        "Input validation",
        "Exception handling"
      ]}
    />
  )
}
