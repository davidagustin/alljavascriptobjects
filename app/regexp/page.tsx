import ObjectPage from '../components/ObjectPage'

export default function RegExpPage() {
  return (
    <ObjectPage
      title="RegExp"
      description="Represents a regular expression"
      overview="The RegExp constructor creates RegExp objects. Regular expressions are patterns used to match character combinations in strings."
      syntax={`// Creating regular expressions
const regex1 = new RegExp('pattern');
const regex2 = /pattern/;
const regex3 = new RegExp('hello', 'gi');

console.log(regex1); // /pattern/
console.log(regex2); // /pattern/
console.log(regex3); // /hello/gi

// RegExp methods
const text = 'Hello world, hello universe';
const regex = /hello/gi;

console.log(regex.test(text)); // true
console.log(regex.exec(text)); // ['Hello', index: 0, input: 'Hello world, hello universe']

// String methods with regex
console.log(text.match(regex)); // ['Hello', 'hello']
console.log(text.replace(regex, 'hi')); // 'hi world, hi universe'
console.log(text.search(regex)); // 0
console.log(text.split(/\s+/)); // ['Hello', 'world,', 'hello', 'universe']

// Common patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[1-9]\d{1,14}$/;
const urlRegex = /^https?:\/\/[^\s\/$.?#].[^\s]*$/;

console.log(emailRegex.test('user@example.com')); // true
console.log(phoneRegex.test('+1234567890')); // true
console.log(urlRegex.test('https://example.com')); // true

// Capturing groups
const text2 = 'John Doe, age 30, email: john@example.com';
const regex2 = /(\w+)\s+(\w+),\s+age\s+(\d+),\s+email:\s+(\S+)/;

const match = text2.match(regex2);
if (match) {
  console.log('First name:', match[1]); // 'John'
  console.log('Last name:', match[2]); // 'Doe'
  console.log('Age:', match[3]); // '30'
  console.log('Email:', match[4]); // 'john@example.com'
}`}
      useCases={[
        "Text pattern matching",
        "Input validation",
        "String manipulation",
        "Data extraction"
      ]}
    />
  )
}
