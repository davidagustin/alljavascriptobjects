import ObjectPage from '../components/ObjectPage'

export default function JSONPage() {
  return (
    <ObjectPage
      title="JSON"
      description="Provides methods for parsing and stringifying JSON"
      overview="The JSON object provides methods for parsing and stringifying JSON data."
      syntax={`// JSON.stringify
const obj = {
  name: 'John',
  age: 30,
  city: 'New York',
  hobbies: ['reading', 'swimming']
};

const jsonString = JSON.stringify(obj);
console.log(jsonString); // '{"name":"John","age":30,"city":"New York","hobbies":["reading","swimming"]}'

// With formatting
const prettyJson = JSON.stringify(obj, null, 2);
console.log(prettyJson); // Formatted JSON

// JSON.parse
const jsonStr = '{"name":"Jane","age":25,"active":true}';
const parsedObj = JSON.parse(jsonStr);

console.log(parsedObj.name); // 'Jane'
console.log(parsedObj.age); // 25
console.log(parsedObj.active); // true

// JSON with functions and undefined
const objWithFunction = {
  name: 'Bob',
  greet: function() { return 'Hello'; },
  undefinedValue: undefined
};

// Functions and undefined are ignored
console.log(JSON.stringify(objWithFunction)); // '{"name":"Bob"}'`}
      useCases={[
        "API data serialization",
        "Configuration files",
        "Data storage",
        "Inter-process communication"
      ]}
    />
  )
}
