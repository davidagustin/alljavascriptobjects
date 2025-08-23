import ObjectPage from '../components/ObjectPage'

export default function escapePage() {
  return (
    <ObjectPage
      title="escape()"
      description="Encodes a string (deprecated)"
      overview="The escape() function encodes a string. This function is deprecated and should not be used."
      syntax={`// escape() is deprecated - use encodeURIComponent instead
// This is shown for historical reference only

console.log(escape('Hello World!')); // 'Hello%20World%21'
console.log(escape('Café')); // 'Caf%C3%A9'

// Modern alternative using encodeURIComponent
console.log(encodeURIComponent('Hello World!')); // 'Hello%20World!'
console.log(encodeURIComponent('Café')); // 'Caf%C3%A9'

// Real-world example - modern approach
function encodeString(str) {
  // Use encodeURIComponent instead of escape
  return encodeURIComponent(str);
}

function decodeString(str) {
  // Use decodeURIComponent instead of unescape
  return decodeURIComponent(str);
}

console.log(encodeString('Hello World!')); // 'Hello%20World!'
console.log(decodeString('Hello%20World!')); // 'Hello World!'`}
      useCases={[
        "Historical reference only",
        "Legacy code maintenance",
        "Migration to modern APIs",
        "Deprecated function awareness"
      ]}
    />
  )
}
