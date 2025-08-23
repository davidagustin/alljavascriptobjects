import ObjectPage from '../components/ObjectPage'

export default function FunctionPage() {
  return (
    <ObjectPage
      title="Function"
      description="Constructor for function objects"
      overview="The Function constructor creates a new Function object. It allows you to create functions dynamically."
      syntax={`// Creating functions
const func1 = new Function('a', 'b', 'return a + b;');
const func2 = new Function('return "Hello World";');

console.log(func1(2, 3)); // 5
console.log(func2()); // 'Hello World'

// Function with multiple parameters
const sum = new Function('...args', 'return args.reduce((a, b) => a + b, 0);');
console.log(sum(1, 2, 3, 4, 5)); // 15

// Function with closure
const multiplier = new Function('x', 'return function(y) { return x * y; };');
const double = multiplier(2);
console.log(double(5)); // 10

// Function properties
console.log(func1.name); // 'anonymous'
console.log(func1.length); // 2 (number of parameters)`}
      useCases={[
        "Dynamic function creation",
        "Code evaluation",
        "Runtime function generation",
        "Metaprogramming"
      ]}
    />
  )
}
