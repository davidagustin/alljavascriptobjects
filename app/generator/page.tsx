import ObjectPage from '../components/ObjectPage'

export default function GeneratorPage() {
  return (
    <ObjectPage
      title="Generator"
      description="Represents a generator function"
      overview="The Generator object represents a generator function. Generators are functions that can be paused and resumed."
      syntax={`// Generator function
function* generator() {
  yield 1;
  yield 2;
  yield 3;
}

// Using generator
const gen = generator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }

// Generator with for...of
function* numberGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

for (const num of numberGenerator()) {
  console.log(num); // 1, 2, 3
}

// Generator with parameters
function* fibonacci() {
  let [prev, curr] = [0, 1];
  while (true) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

const fib = fibonacci();
console.log(fib.next().value); // 1
console.log(fib.next().value); // 1
console.log(fib.next().value); // 2
console.log(fib.next().value); // 3`}
      useCases={[
        "Iteration control",
        "Memory efficient sequences",
        "Infinite sequences",
        "Stateful iteration"
      ]}
    />
  )
}
