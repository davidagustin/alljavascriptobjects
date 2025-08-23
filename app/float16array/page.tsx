import ObjectPage from '../components/ObjectPage'

export default function Float16ArrayPage() {
  return (
    <ObjectPage
      title="Float16Array"
      description="A typed array of 16-bit floating point numbers"
      overview="The Float16Array typed array represents an array of 16-bit floating point numbers (half precision) in the platform byte order."
      syntax={`// Creating Float16Array
const arr1 = new Float16Array(4);
const arr2 = new Float16Array([1.5, 2.25, 3.75, 4.125]);
const buffer = new ArrayBuffer(8);
const arr3 = new Float16Array(buffer);

// Setting and getting values
arr1[0] = 1.5;
arr1[1] = -2.25;
arr1[2] = 0.125;
console.log(arr1[0]); // 1.5

// Array methods
const mapped = arr2.map(x => x * 2);
const filtered = arr2.filter(x => x > 2);
const sum = arr2.reduce((a, b) => a + b, 0);
console.log(sum); // 11.625`}
      useCases={[
        "Machine learning and neural network computations",
        "Graphics and shader programming",
        "Memory-efficient floating point storage",
        "Scientific computing with reduced precision requirements"
      ]}
    />
  )
}