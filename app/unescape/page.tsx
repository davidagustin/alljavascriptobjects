import ObjectPage from '../components/ObjectPage'

export default function unescapePage() {
  return (
    <ObjectPage
      title="unescape()"
      description="Decodes a string (deprecated)"
      overview="The unescape() function decodes a string. This function is deprecated and should not be used."
      syntax={`// unescape() is deprecated - use decodeURIComponent instead
// This is shown for historical reference only

console.log(unescape('Hello%20World%21')); // 'Hello World!'
console.log(unescape('Caf%C3%A9')); // 'Café'

// Modern alternative using decodeURIComponent
console.log(decodeURIComponent('Hello%20World!')); // 'Hello World!'
console.log(decodeURIComponent('Caf%C3%A9')); // 'Café'

// Real-world example - modern approach
function safeDecode(str) {
  try {
    return decodeURIComponent(str);
  } catch (error) {
    console.error('Decoding error:', error.message);
    return str; // Return original if decoding fails
  }
}

console.log(safeDecode('Hello%20World!')); // 'Hello World!'
console.log(safeDecode('Invalid%')); // 'Invalid%' (returns original)

// Migration example
function migrateFromUnescape(encodedString) {
  // Old way (deprecated)
  // return unescape(encodedString);
  
  // New way
  return decodeURIComponent(encodedString);
}`}
      useCases={[
        "Historical reference only",
        "Legacy code maintenance",
        "Migration to modern APIs",
        "Deprecated function awareness"
      ]}
    />
  )
}
