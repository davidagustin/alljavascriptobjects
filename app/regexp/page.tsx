import ObjectPage from '../components/ObjectPage'

export default function RegExpPageComponent() {
  return (
    <ObjectPage
      title="RegExp"
      description="Represents a regular expression for pattern matching in strings"
      overview="The RegExp constructor creates RegExp objects. Regular expressions are patterns used to match character combinations in strings. They provide powerful text processing capabilities including validation, extraction, replacement, and splitting operations."
      syntax={`// Literal notation (preferred for static patterns)
const regex1 = /pattern/flags;
const regex2 = /hello/gi;
const regex3 = /\\d+/;

// Constructor notation (for dynamic patterns)
const regex4 = new RegExp('pattern', 'flags');
const regex5 = new RegExp('hello', 'gi');

// RegExp flags
const globalRegex = /hello/g;      // Global flag
const caseInsensitive = /hello/i;  // Case insensitive
const multiline = /^line/gm;       // Multiline flag
const unicode = /\\u{1F600}/u;     // Unicode flag
const sticky = /\\d+/y;            // Sticky flag
const dotAll = /hello.world/s;     // Dot-all flag

// Instance properties
const regex = /hello/gi;
console.log(regex.flags);        // 'gi'
console.log(regex.global);       // true
console.log(regex.ignoreCase);   // true
console.log(regex.source);       // 'hello'
console.log(regex.lastIndex);    // 0 (mutable)

// Instance methods
const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
console.log(emailRegex.test('user@example.com')); // true

const execRegex = /(\\w+)\\s+(\\d+)/;
const result = execRegex.exec('John 25');
console.log(result); // ['John 25', 'John', '25', index: 0, input: 'John 25']

// String methods with RegExp
const text = 'The quick brown fox jumps over the lazy dog';
console.log(text.match(/\\b\\w{4}\\b/g));     // ['over', 'lazy']
console.log(text.search(/fox/));              // 16
console.log(text.replace(/fox/, 'cat'));      // Replace first
console.log(text.replace(/\\b\\w{3}\\b/g, 'XXX')); // Replace all 3-letter words

// Common patterns
const patterns = {
  email: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
  phone: /^\\+?[1-9]\\d{1,14}$/,
  url: /^https?:\\/\\/[^\\s/$.?#].[^\\s]*$/i,
  date: /^\\d{4}-\\d{2}-\\d{2}$/,
  time: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
};

// Validation example
function validateInput(input, pattern) {
  return pattern.test(input);
}

console.log(validateInput('user@example.com', patterns.email)); // true
console.log(validateInput('invalid-email', patterns.email));    // false`}
      useCases={[
        "Input validation (email, phone, password)",
        "Text parsing and extraction",
        "Find and replace operations",
        "Data cleaning and formatting",
        "Log file analysis",
        "URL routing and pattern matching",
        "Syntax highlighting",
        "Form field validation",
        "Search and filtering",
        "Template processing"
      ]}
    />
  )
}