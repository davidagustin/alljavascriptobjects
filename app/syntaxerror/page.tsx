import ObjectPage from '../components/ObjectPage'

export default function SyntaxErrorPage() {
  return (
    <ObjectPage
      title="SyntaxError"
      description="Represents an error when parsing syntactically invalid code"
      overview="The SyntaxError constructor creates an error when parsing syntactically invalid code."
      syntax={`// SyntaxError examples
try {
  eval('const x = {');  // Unclosed brace
} catch (error) {
  console.log(error instanceof SyntaxError); // true
  console.log(error.message);
}

// JSON parsing errors
try {
  JSON.parse('{name: "John"}'); // Invalid JSON (missing quotes)
} catch (error) {
  console.log(error instanceof SyntaxError); // true
  console.log(error.message);
}

try {
  JSON.parse('{"name": "John",}'); // Trailing comma
} catch (error) {
  console.log(error instanceof SyntaxError); // true
}

// Dynamic code execution
function executeCode(code) {
  try {
    return new Function(code)();
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.log('Syntax error in code:', error.message);
      return null;
    }
    throw error;
  }
}

executeCode('return 2 + 2'); // 4
executeCode('return 2 ++ 2'); // null (syntax error)`}
      useCases={[
        "Code validation",
        "JSON parsing",
        "Dynamic code execution",
        "Syntax checking"
      ]}
    />
  )
}
