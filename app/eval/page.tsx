import ObjectPage from '../components/ObjectPage'

export default function evalPage() {
  return (
    <ObjectPage
      title="eval"
      description="Evaluates JavaScript code represented as a string"
      overview="The eval() function evaluates JavaScript code represented as a string."
      syntax={`// Basic eval usage
const result = eval('2 + 2');
console.log(result); // 4

// Evaluating expressions
const x = 10;
const y = 20;
const expression = 'x + y';
const result = eval(expression);
console.log(result); // 30

// Evaluating object literals
const objString = '{ name: "John", age: 30 }';
const obj = eval('(' + objString + ')');
console.log(obj.name); // "John"`}
      useCases={[
        "Dynamic code execution",
        "Expression evaluation",
        "Configuration parsing"
      ]}
    />
  )
}
