import ObjectPage from '../components/ObjectPage'

export default function URIErrorPage() {
  return (
    <ObjectPage
      title="URIError"
      description="Represents an error when URI handling functions are used incorrectly"
      overview="The URIError constructor creates an error when URI handling functions are used incorrectly."
      syntax={`// URIError examples
try {
  decodeURIComponent('%'); // Incomplete percent encoding
} catch (error) {
  console.log(error instanceof URIError); // true
  console.log(error.message);
}

// Invalid URI encoding
try {
  decodeURI('%E0%A4%A'); // Malformed URI sequence
} catch (error) {
  console.log(error instanceof URIError); // true
}

// Safe URI handling
function safeDecodeURI(uri) {
  try {
    return decodeURIComponent(uri);
  } catch (error) {
    if (error instanceof URIError) {
      console.log('Invalid URI encoding:', uri);
      return uri; // Return original string
    }
    throw error;
  }
}

console.log(safeDecodeURI('Hello%20World')); // 'Hello World'
console.log(safeDecodeURI('Invalid%')); // 'Invalid%'`}
      useCases={[
        "URI encoding/decoding",
        "URL validation",
        "Safe URI handling",
        "Web address processing"
      ]}
    />
  )
}
