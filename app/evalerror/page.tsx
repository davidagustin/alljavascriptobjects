import ObjectPage from '../components/ObjectPage'

export default function EvalErrorPage() {
  return (
    <ObjectPage
      title="EvalError"
      description="Represents an error that occurs during eval() execution"
      overview="The EvalError constructor creates an error that occurs during the execution of eval()."
      syntax={`// EvalError (rarely thrown in modern JavaScript)
// EvalError was intended for errors with eval() but is rarely used now
const evalError = new EvalError('Eval error occurred');
console.log(evalError.name); // 'EvalError'
console.log(evalError.message); // 'Eval error occurred'
console.log(evalError instanceof Error); // true

// Custom eval error handling
function safeEval(code) {
  try {
    if (code.includes('delete') || code.includes('var')) {
      throw new EvalError('Unsafe code detected');
    }
    return eval(code);
  } catch (error) {
    if (error instanceof EvalError) {
      console.error('Eval error:', error.message);
    } else {
      console.error('Other error:', error.message);
    }
    return null;
  }
}

console.log(safeEval('2 + 2')); // 4
console.log(safeEval('delete obj')); // null (error caught)`}
      useCases={[
        "Eval error handling",
        "Code security validation",
        "Dynamic code execution",
        "Error type checking"
      ]}
    />
  )
}
