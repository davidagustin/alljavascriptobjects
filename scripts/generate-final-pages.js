const fs = require('fs');
const path = require('path');

// Final object data for remaining objects
const finalObjects = {
  'parseint': {
    title: 'parseInt()',
    description: 'Parses a string and returns an integer',
    overview: 'The parseInt() function parses a string argument and returns an integer of the specified radix.',
    syntax: `// Basic parseInt usage
console.log(parseInt('42')); // 42
console.log(parseInt('42.5')); // 42
console.log(parseInt('42px')); // 42
console.log(parseInt('px42')); // NaN

// With radix parameter
console.log(parseInt('1010', 2)); // 10 (binary)
console.log(parseInt('FF', 16)); // 255 (hexadecimal)
console.log(parseInt('42', 8)); // 34 (octal)

// Edge cases
console.log(parseInt('')); // NaN
console.log(parseInt('  42  ')); // 42 (trims whitespace)
console.log(parseInt('0x1A')); // 26 (hexadecimal)
console.log(parseInt('0o12')); // 0 (not octal in older browsers)

// Real-world examples
function parseNumber(input) {
  const num = parseInt(input, 10);
  return isNaN(num) ? 0 : num;
}

console.log(parseNumber('123')); // 123
console.log(parseNumber('abc')); // 0
console.log(parseNumber('12.34')); // 12`,
    useCases: [
      'String to integer conversion',
      'CSS property parsing',
      'Form input validation',
      'Number extraction from strings'
    ]
  },
  'parsefloat': {
    title: 'parseFloat()',
    description: 'Parses a string and returns a floating-point number',
    overview: 'The parseFloat() function parses a string argument and returns a floating-point number.',
    syntax: `// Basic parseFloat usage
console.log(parseFloat('42')); // 42
console.log(parseFloat('42.5')); // 42.5
console.log(parseFloat('42.5px')); // 42.5
console.log(parseFloat('px42.5')); // NaN

// Scientific notation
console.log(parseFloat('1.23e4')); // 12300
console.log(parseFloat('1.23E-2')); // 0.0123

// Edge cases
console.log(parseFloat('')); // NaN
console.log(parseFloat('  42.5  ')); // 42.5 (trims whitespace)
console.log(parseFloat('42.5.6')); // 42.5 (stops at second decimal)

// Real-world examples
function parseDecimal(input) {
  const num = parseFloat(input);
  return isNaN(num) ? 0 : num;
}

console.log(parseDecimal('123.45')); // 123.45
console.log(parseDecimal('abc')); // 0
console.log(parseDecimal('12.34.56')); // 12.34

// Currency parsing
function parseCurrency(amount) {
  return parseFloat(amount.replace(/[$,]/g, ''));
}

console.log(parseCurrency('$1,234.56')); // 1234.56`,
    useCases: [
      'String to float conversion',
      'Currency parsing',
      'Scientific notation parsing',
      'Decimal number extraction'
    ]
  },
  'isnan': {
    title: 'isNaN()',
    description: 'Determines whether a value is NaN',
    overview: 'The isNaN() function determines whether a value is NaN (Not-a-Number).',
    syntax: `// Basic isNaN usage
console.log(isNaN(NaN)); // true
console.log(isNaN(42)); // false
console.log(isNaN('42')); // false (converts to number)
console.log(isNaN('hello')); // true
console.log(isNaN(undefined)); // true

// Edge cases
console.log(isNaN('')); // false (converts to 0)
console.log(isNaN(null)); // false (converts to 0)
console.log(isNaN(true)); // false (converts to 1)
console.log(isNaN(false)); // false (converts to 0)

// Number.isNaN (more strict)
console.log(Number.isNaN(NaN)); // true
console.log(Number.isNaN('hello')); // false (doesn't convert)
console.log(Number.isNaN(42)); // false

// Real-world examples
function validateNumber(value) {
  if (isNaN(value)) {
    return 'Invalid number';
  }
  return 'Valid number';
}

console.log(validateNumber(42)); // 'Valid number'
console.log(validateNumber('abc')); // 'Invalid number'
console.log(validateNumber('42')); // 'Valid number'

// Array filtering
const numbers = [1, 2, 'three', 4, NaN, 6];
const validNumbers = numbers.filter(num => !isNaN(num));
console.log(validNumbers); // [1, 2, 4, 6]`,
    useCases: [
      'Number validation',
      'Input checking',
      'Array filtering',
      'Error handling'
    ]
  },
  'isfinite': {
    title: 'isFinite()',
    description: 'Determines whether a value is a finite number',
    overview: 'The isFinite() function determines whether a value is a finite number.',
    syntax: `// Basic isFinite usage
console.log(isFinite(42)); // true
console.log(isFinite(Infinity)); // false
console.log(isFinite(-Infinity)); // false
console.log(isFinite(NaN)); // false
console.log(isFinite('42')); // true (converts to number)
console.log(isFinite('hello')); // false

// Edge cases
console.log(isFinite('')); // true (converts to 0)
console.log(isFinite(null)); // true (converts to 0)
console.log(isFinite(undefined)); // false
console.log(isFinite(true)); // true (converts to 1)

// Number.isFinite (more strict)
console.log(Number.isFinite(42)); // true
console.log(Number.isFinite('42')); // false (doesn't convert)
console.log(Number.isFinite(Infinity)); // false

// Real-world examples
function validateFiniteNumber(value) {
  if (!isFinite(value)) {
    return 'Not a finite number';
  }
  return 'Valid finite number';
}

console.log(validateFiniteNumber(42)); // 'Valid finite number'
console.log(validateFiniteNumber(Infinity)); // 'Not a finite number'
console.log(validateFiniteNumber('abc')); // 'Not a finite number'

// Range validation
function isInRange(value, min, max) {
  return isFinite(value) && value >= min && value <= max;
}

console.log(isInRange(5, 0, 10)); // true
console.log(isInRange(Infinity, 0, 10)); // false
console.log(isInRange(-5, 0, 10)); // false`,
    useCases: [
      'Range validation',
      'Input validation',
      'Mathematical operations',
      'Boundary checking'
    ]
  },
  'encodeuri': {
    title: 'encodeURI()',
    description: 'Encodes a URI by replacing each instance of certain characters',
    overview: 'The encodeURI() function encodes a URI by replacing each instance of certain characters.',
    syntax: `// Basic encodeURI usage
const url = 'https://example.com/path with spaces';
const encoded = encodeURI(url);
console.log(encoded); // 'https://example.com/path%20with%20spaces'

// Special characters
console.log(encodeURI('Hello World!')); // 'Hello%20World!'
console.log(encodeURI('Café')); // 'Caf%C3%A9'
console.log(encodeURI('https://example.com/?q=hello world')); // 'https://example.com/?q=hello%20world'

// Reserved characters (not encoded)
console.log(encodeURI('https://example.com/path?query=value')); // 'https://example.com/path?query=value'

// Real-world examples
function buildURL(base, params) {
  const url = new URL(base);
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  
  return url.toString();
}

const apiURL = buildURL('https://api.example.com/search', {
  q: 'hello world',
  lang: 'en-US'
});
console.log(apiURL); // 'https://api.example.com/search?q=hello+world&lang=en-US'

// URL validation
function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

console.log(isValidURL('https://example.com')); // true
console.log(isValidURL('not-a-url')); // false`,
    useCases: [
      'URL encoding',
      'Web address handling',
      'API request building',
      'Special character encoding'
    ]
  },
  'decodeuri': {
    title: 'decodeURI()',
    description: 'Decodes a URI previously created by encodeURI()',
    overview: 'The decodeURI() function decodes a URI previously created by encodeURI().',
    syntax: `// Basic decodeURI usage
const encoded = 'https://example.com/path%20with%20spaces';
const decoded = decodeURI(encoded);
console.log(decoded); // 'https://example.com/path with spaces'

// Special characters
console.log(decodeURI('Hello%20World!')); // 'Hello World!'
console.log(decodeURI('Caf%C3%A9')); // 'Café'
console.log(decodeURI('https://example.com/?q=hello%20world')); // 'https://example.com/?q=hello world'

// Real-world examples
function parseURLParams(url) {
  try {
    const urlObj = new URL(url);
    const params = {};
    
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    
    return params;
  } catch (error) {
    console.error('Invalid URL:', error.message);
    return {};
  }
}

const url = 'https://example.com/search?q=hello%20world&lang=en-US';
const params = parseURLParams(url);
console.log(params); // { q: 'hello world', lang: 'en-US' }

// Safe decoding
function safeDecodeURI(uri) {
  try {
    return decodeURI(uri);
  } catch (error) {
    console.error('Decoding error:', error.message);
    return uri; // Return original if decoding fails
  }
}

console.log(safeDecodeURI('Hello%20World!')); // 'Hello World!'
console.log(safeDecodeURI('Invalid%')); // 'Invalid%' (returns original)`,
    useCases: [
      'URL decoding',
      'Parameter parsing',
      'Special character decoding',
      'Safe URI handling'
    ]
  },
  'encodeuricomponent': {
    title: 'encodeURIComponent()',
    description: 'Encodes a URI component by replacing each instance of certain characters',
    overview: 'The encodeURIComponent() function encodes a URI component by replacing each instance of certain characters.',
    syntax: `// Basic encodeURIComponent usage
const query = 'hello world';
const encoded = encodeURIComponent(query);
console.log(encoded); // 'hello%20world'

// Special characters
console.log(encodeURIComponent('Hello World!')); // 'Hello%20World!'
console.log(encodeURIComponent('Café')); // 'Caf%C3%A9'
console.log(encodeURIComponent('https://example.com')); // 'https%3A%2F%2Fexample.com'

// Difference from encodeURI
console.log(encodeURI('https://example.com')); // 'https://example.com'
console.log(encodeURIComponent('https://example.com')); // 'https%3A%2F%2Fexample.com'

// Real-world examples
function buildQueryString(params) {
  return Object.entries(params)
    .map(([key, value]) => \`\${encodeURIComponent(key)}=\${encodeURIComponent(value)}\`)
    .join('&');
}

const queryParams = {
  q: 'hello world',
  lang: 'en-US',
  category: 'programming'
};

const queryString = buildQueryString(queryParams);
console.log(queryString); // 'q=hello%20world&lang=en-US&category=programming'

// Form data encoding
function encodeFormData(data) {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  
  return formData;
}

const formData = encodeFormData({
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Hello, world!'
});`,
    useCases: [
      'Query string encoding',
      'Form data encoding',
      'Component encoding',
      'Parameter encoding'
    ]
  },
  'decodeuricomponent': {
    title: 'decodeURIComponent()',
    description: 'Decodes a URI component previously created by encodeURIComponent()',
    overview: 'The decodeURIComponent() function decodes a URI component previously created by encodeURIComponent().',
    syntax: `// Basic decodeURIComponent usage
const encoded = 'hello%20world';
const decoded = decodeURIComponent(encoded);
console.log(decoded); // 'hello world'

// Special characters
console.log(decodeURIComponent('Hello%20World!')); // 'Hello World!'
console.log(decodeURIComponent('Caf%C3%A9')); // 'Café'
console.log(decodeURIComponent('https%3A%2F%2Fexample.com')); // 'https://example.com'

// Real-world examples
function parseQueryString(queryString) {
  const params = {};
  
  queryString.split('&').forEach(pair => {
    const [key, value] = pair.split('=');
    if (key && value) {
      params[decodeURIComponent(key)] = decodeURIComponent(value);
    }
  });
  
  return params;
}

const query = 'q=hello%20world&lang=en-US&category=programming';
const params = parseQueryString(query);
console.log(params); // { q: 'hello world', lang: 'en-US', category: 'programming' }

// Safe decoding
function safeDecodeURIComponent(component) {
  try {
    return decodeURIComponent(component);
  } catch (error) {
    console.error('Decoding error:', error.message);
    return component; // Return original if decoding fails
  }
}

console.log(safeDecodeURIComponent('hello%20world')); // 'hello world'
console.log(safeDecodeURIComponent('Invalid%')); // 'Invalid%' (returns original)

// URL parameter extraction
function getURLParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get(name);
  return value ? decodeURIComponent(value) : null;
}`,
    useCases: [
      'Query string decoding',
      'Parameter extraction',
      'Component decoding',
      'Safe URI handling'
    ]
  },
  'escape': {
    title: 'escape()',
    description: 'Encodes a string (deprecated)',
    overview: 'The escape() function encodes a string. This function is deprecated and should not be used.',
    syntax: `// escape() is deprecated - use encodeURIComponent instead
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
console.log(decodeString('Hello%20World!')); // 'Hello World!'`,
    useCases: [
      'Historical reference only',
      'Legacy code maintenance',
      'Migration to modern APIs',
      'Deprecated function awareness'
    ]
  },
  'unescape': {
    title: 'unescape()',
    description: 'Decodes a string (deprecated)',
    overview: 'The unescape() function decodes a string. This function is deprecated and should not be used.',
    syntax: `// unescape() is deprecated - use decodeURIComponent instead
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
}`,
    useCases: [
      'Historical reference only',
      'Legacy code maintenance',
      'Migration to modern APIs',
      'Deprecated function awareness'
    ]
  }
};

// Generate JSX pages for final objects
Object.entries(finalObjects).forEach(([key, data]) => {
  const jsxContent = `import ObjectPage from '../components/ObjectPage'

export default function ${data.title.replace(/[()]/g, '').replace(/\s+/g, '')}Page() {
  return (
    <ObjectPage
      title="${data.title}"
      description="${data.description}"
      overview="${data.overview}"
      syntax={\`${data.syntax}\`}
      useCases={[
        ${data.useCases.map(useCase => `"${useCase}"`).join(',\n        ')}
      ]}
    />
  )
}
`;

  const dirPath = path.join(__dirname, '..', 'app', key);
  const filePath = path.join(dirPath, 'page.tsx');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  // Write the JSX file
  fs.writeFileSync(filePath, jsxContent);
  console.log(`Created: ${filePath}`);
});

console.log('Final JSX pages have been generated!');
