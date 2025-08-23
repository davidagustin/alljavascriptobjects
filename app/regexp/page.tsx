import ObjectPage from '../components/ObjectPage'

export default function RegExpPageComponent() {
  return (
    <ObjectPage
      title="RegExp"
      description="Represents a regular expression for pattern matching in strings"
      overview="The RegExp constructor creates RegExp objects. Regular expressions are patterns used to match character combinations in strings. They provide powerful text processing capabilities including validation, extraction, replacement, and splitting operations."
      syntax={`// ============ REGEXP CREATION ============

// Literal notation (preferred for static patterns)
const regex1 = /pattern/flags;
const regex2 = /hello/gi;
const regex3 = /\\d+/;

// Constructor notation (for dynamic patterns)
const regex4 = new RegExp('pattern', 'flags');
const regex5 = new RegExp('hello', 'gi');
const dynamicPattern = new RegExp(\`\\\${userInput}\`, 'i');

console.log(regex1); // /pattern/
console.log(regex2); // /hello/gi
console.log(regex3); // /\\d+/

// ============ REGEXP FLAGS ============

const text = 'Hello World, hello universe, HELLO again';

// g - Global flag (find all matches)
const globalRegex = /hello/g;
console.log(text.match(globalRegex)); // ['hello'] (only first match without g)
console.log(text.match(/hello/gi)); // ['Hello', 'hello', 'HELLO'] (with gi)

// i - Case insensitive flag
const caseInsensitive = /hello/i;
console.log(caseInsensitive.test('HELLO')); // true

// m - Multiline flag
const multilineText = \`line1 hello\\nline2 world\\nline3 hello\`;
console.log(multilineText.match(/^line/gm)); // ['line', 'line', 'line']

// s - Dot-all flag (. matches newlines)
const dotAllText = 'hello\\nworld';
console.log(/hello.world/s.test(dotAllText)); // true
console.log(/hello.world/.test(dotAllText)); // false

// u - Unicode flag
const unicodeRegex = /\\u{1F600}/u;
console.log(unicodeRegex.test('😀')); // true

// y - Sticky flag
const stickyRegex = /\\d+/y;
const numbers = '123 456 789';
stickyRegex.lastIndex = 0;
console.log(stickyRegex.exec(numbers)); // ['123']
console.log(stickyRegex.exec(numbers)); // null (doesn't match at position 3)

// ============ REGEXP INSTANCE PROPERTIES ============

const regex = /hello/gi;
console.log(regex.flags); // 'gi'
console.log(regex.global); // true
console.log(regex.ignoreCase); // true
console.log(regex.multiline); // false
console.log(regex.source); // 'hello'
console.log(regex.sticky); // false
console.log(regex.unicode); // false
console.log(regex.dotAll); // false

// lastIndex property (mutable)
const globalTest = /\\d+/g;
const testString = '12 34 56';
console.log(globalTest.lastIndex); // 0
globalTest.exec(testString); // ['12']
console.log(globalTest.lastIndex); // 2
globalTest.exec(testString); // ['34']
console.log(globalTest.lastIndex); // 5

// ============ REGEXP INSTANCE METHODS ============

// test() - Returns boolean
const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
console.log(emailRegex.test('user@example.com')); // true
console.log(emailRegex.test('invalid-email')); // false

// exec() - Returns match array or null
const execRegex = /(\\w+)\\s+(\\d+)/;
const execResult = execRegex.exec('John 25');
console.log(execResult); 
// ['John 25', 'John', '25', index: 0, input: 'John 25', groups: undefined]

// exec() with global flag
const globalExec = /\\d+/g;
const execText = '12 34 56';
let match;
const matches = [];
while ((match = globalExec.exec(execText)) !== null) {
  matches.push(match[0]);
}
console.log(matches); // ['12', '34', '56']

// toString() - Returns string representation
console.log(/hello/gi.toString()); // '/hello/gi'

// ============ STRING METHODS WITH REGEXP ============

const testText = 'The quick brown fox jumps over the lazy dog';

// match() - Find matches
console.log(testText.match(/\\b\\w{4}\\b/g)); // ['over', 'lazy']
console.log(testText.match(/(\\w+)\\s+(\\w+)/)); // Captures groups

// matchAll() - Iterator of all matches (ES2020)
const matchAllRegex = /\\b(\\w{4})\\b/g;
const allMatches = [...testText.matchAll(matchAllRegex)];
console.log(allMatches.map(m => m[1])); // ['over', 'lazy']

// search() - Find index of first match
console.log(testText.search(/fox/)); // 16
console.log(testText.search(/cat/)); // -1 (not found)

// replace() - Replace matches
console.log(testText.replace(/fox/, 'cat')); // Replace first
console.log(testText.replace(/\\b\\w{3}\\b/g, 'XXX')); // Replace all 3-letter words

// replace() with function
const titleCase = testText.replace(/\\b\\w+\\b/g, word => 
  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
);
console.log(titleCase); // 'The Quick Brown Fox Jumps Over The Lazy Dog'

// replaceAll() - Replace all matches (ES2021)
console.log(testText.replaceAll(/\\b\\w{3}\\b/g, 'XXX'));

// split() - Split string using regex
console.log(testText.split(/\\s+/)); // Split on whitespace
console.log('a1b2c3d'.split(/\\d/)); // ['a', 'b', 'c', 'd']

// ============ COMMON REGEX PATTERNS ============

// Email validation
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;
console.log(emailPattern.test('test@example.com')); // true

// Phone number validation (US format)
const phonePattern = /^\\+?1?[-.\\s]?\\(?([0-9]{3})\\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})$/;
console.log(phonePattern.test('(555) 123-4567')); // true

// URL validation
const urlPattern = /^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&=]*)$/;
console.log(urlPattern.test('https://example.com')); // true

// Password strength (8+ chars, uppercase, lowercase, number, special)
const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/;
console.log(strongPassword.test('MyPass123!')); // true

// Credit card number (basic format)
const creditCard = /^\\d{4}[-.\\s]?\\d{4}[-.\\s]?\\d{4}[-.\\s]?\\d{4}$/;
console.log(creditCard.test('1234-5678-9012-3456')); // true

// IP address validation
const ipAddress = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
console.log(ipAddress.test('192.168.1.1')); // true

// HTML tag matching
const htmlTag = /<\\/?([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*>/g;
const html = '<div class="test"><p>Hello</p></div>';
console.log(html.match(htmlTag)); // ['<div class="test">', '<p>', '</p>', '</div>']

// ============ ADVANCED REGEX TECHNIQUES ============

// Named capture groups (ES2018)
const namedGroups = /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/;
const dateMatch = '2023-12-25'.match(namedGroups);
console.log(dateMatch.groups); // {year: '2023', month: '12', day: '25'}

// Lookahead and lookbehind assertions
const lookahead = /\\d+(?=\\s*px)/g; // Numbers followed by 'px'
console.log('10px 20em 30px'.match(lookahead)); // ['10', '30']

const lookbehind = /(?<=\\$)\\d+/g; // Numbers preceded by '$'
console.log('$100 €200 $300'.match(lookbehind)); // ['100', '300']

// Non-capturing groups
const nonCapturing = /(?:Mr|Mrs|Ms)\\.\\s+(\\w+)/;
const nameMatch = 'Mr. Smith'.match(nonCapturing);
console.log(nameMatch[1]); // 'Smith' (title not captured)

// Atomic groups and possessive quantifiers (limited browser support)
const possessive = /\\d++/; // Possessive quantifier (when supported)

// ============ REGEX UTILITY FUNCTIONS ============

// Escape special regex characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&');
}

// Create case-insensitive search
function createCaseInsensitiveSearch(term) {
  return new RegExp(escapeRegExp(term), 'gi');
}

// Extract all matches with positions
function findAllMatches(text, pattern) {
  const regex = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g');
  const matches = [];
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    matches.push({
      match: match[0],
      index: match.index,
      groups: match.slice(1),
      namedGroups: match.groups
    });
  }
  
  return matches;
}

// Validate input with multiple patterns
function validateInput(input, patterns) {
  return Object.entries(patterns).reduce((result, [name, pattern]) => {
    result[name] = pattern.test(input);
    return result;
  }, {});
}

const patterns = {
  hasNumber: /\\d/,
  hasLetter: /[a-zA-Z]/,
  hasSpecial: /[!@#$%^&*]/,
  minLength: /.{8,}/
};

console.log(validateInput('MyPass123!', patterns));
// {hasNumber: true, hasLetter: true, hasSpecial: true, minLength: true}

// Replace with position-based logic
function smartReplace(text, pattern, replacer) {
  return text.replace(pattern, (match, ...args) => {
    const groups = args.slice(0, -2);
    const offset = args[args.length - 2];
    const string = args[args.length - 1];
    
    return typeof replacer === 'function' 
      ? replacer(match, groups, offset, string)
      : replacer;
  });
}

// Highlight search terms
function highlightText(text, searchTerms) {
  const pattern = new RegExp(\`(${searchTerms.map(escapeRegExp).join('|')})\`, 'gi');
  return text.replace(pattern, '<mark>$1</mark>');
}

console.log(highlightText('Hello world', ['hello', 'world']));
// '<mark>Hello</mark> <mark>world</mark>'

// Parse structured text
function parseLogEntry(logLine) {
  const pattern = /^(?<timestamp>\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}) \\[(?<level>\\w+)\\] (?<message>.*)$/;
  const match = logLine.match(pattern);
  return match ? match.groups : null;
}

const logLine = '2023-12-25 10:30:45 [ERROR] Database connection failed';
console.log(parseLogEntry(logLine));
// {timestamp: '2023-12-25 10:30:45', level: 'ERROR', message: 'Database connection failed'}

// ============ PERFORMANCE CONSIDERATIONS ============

// Compile regex once for repeated use
const compiledRegex = /\\b\\w+\\b/g;
function countWords(text) {
  const matches = text.match(compiledRegex);
  return matches ? matches.length : 0;
}

// Use specific quantifiers instead of greedy ones when possible
const efficient = /\\d{4}/; // Better than /\\d+/ when you know the exact count
const lessEfficient = /\\d+/; // Can be slower for long digit sequences

// Anchor patterns when possible
const anchored = /^\\d{3}-\\d{2}-\\d{4}$/; // Faster than /\\d{3}-\\d{2}-\\d{4}/

// ============ INTERNATIONALIZATION ============

// Unicode property escapes (when supported)
const unicodeWord = /\\p{L}+/gu; // Matches letters in any language
const unicodeNumber = /\\p{N}+/gu; // Matches numbers in any script
const emojiRegex = /\\p{Emoji}/gu; // Matches emoji characters

const multilingual = 'Hello мир 世界 🌍';
console.log(multilingual.match(unicodeWord)); // ['Hello', 'мир', '世界']
console.log(multilingual.match(emojiRegex)); // ['🌍']`}
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