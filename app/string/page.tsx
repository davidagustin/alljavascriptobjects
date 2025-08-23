import ObjectPage from '../components/ObjectPage'

export default function StringPage() {
  return (
    <ObjectPage
      title="String"
      description="Represents a sequence of characters with extensive text manipulation capabilities"
      overview="The String constructor creates String objects. Strings are immutable sequences of UTF-16 code units. JavaScript strings support Unicode and provide numerous methods for searching, extracting, and manipulating text."
      syntax={`// ============ CREATING STRINGS ============
// String literals - most common methods
const str1 = 'Single quotes';
const str2 = "Double quotes";
const str3 = \`Template literals with \${123} interpolation\`;

// String constructor
const str4 = new String('Hello'); // String object (wrapper)
const str5 = String(123); // Type conversion function
const str6 = String(true); // 'true'
const str7 = String(null); // 'null'
const str8 = String(undefined); // 'undefined'
const str9 = String([1,2,3]); // '1,2,3'
const str10 = String({a: 1}); // '[object Object]'

console.log(typeof str4); // 'object' (String wrapper)
console.log(typeof str5); // 'string' (primitive)

// Template literals with complex expressions
const user = { name: 'Alice', age: 30 };
const greeting = \`Hello \${user.name}, you are \${user.age > 18 ? 'adult' : 'minor'}\`;
console.log(greeting); // 'Hello Alice, you are adult'

// Multi-line strings with proper indentation
const multiline = \`
  Line 1 with indentation
  Line 2 with indentation
  Line 3 with indentation
\`.trim();

// Escaped characters
const escaped = 'Line 1\\nLine 2\\t\\tTabbed\\r\\nCarriage return';
console.log(escaped);

// Unicode literals
const unicode = '\\u0048\\u0065\\u006c\\u006c\\u006f'; // 'Hello'
const emoji = '\\uD83D\\uDE00'; // 😀 (surrogate pair)
const unicodePoint = '\\u{1F600}'; // 😀 (code point syntax)

// ============ STRING PROPERTIES ============
const text = 'Hello 🌍';
console.log(text.length); // 7 (includes surrogate pair as 2 units)

// String indexing (bracket notation)
console.log(text[0]); // 'H'
console.log(text[6]); // '🌍' (may show half of surrogate pair)

// Length with surrogate pairs
const emojiStr = '👩‍💻👨‍👩‍👧‍👦'; // Complex emojis
console.log(emojiStr.length); // Much longer due to combining characters
console.log([...emojiStr].length); // Actual visual character count

// ============ CHARACTER ACCESS METHODS ============
const accessStr = 'JavaScript 🚀';

// charAt(index) - returns character at index
console.log(accessStr.charAt(0)); // 'J'
console.log(accessStr.charAt(100)); // '' (empty string for out of bounds)
console.log(accessStr.charAt(-1)); // '' (doesn't support negative)

// charCodeAt(index) - returns UTF-16 code unit value
console.log(accessStr.charCodeAt(0)); // 74 (code for 'J')
console.log(accessStr.charCodeAt(1)); // 97 (code for 'a')
console.log('A'.charCodeAt(0)); // 65
console.log('🚀'.charCodeAt(0)); // 55357 (high surrogate)
console.log('🚀'.charCodeAt(1)); // 56960 (low surrogate)

// codePointAt(index) - returns Unicode code point (ES6)
console.log('A'.codePointAt(0)); // 65
console.log('🚀'.codePointAt(0)); // 128640 (full code point)
console.log('🚀'.codePointAt(1)); // 56960 (low surrogate if accessed directly)
console.log('😀'.codePointAt(0)); // 128512

// at(index) - supports negative indices (ES2022)
console.log(accessStr.at(0)); // 'J' (first character)
console.log(accessStr.at(-1)); // '🚀' (last character, but might be partial)
console.log(accessStr.at(-2)); // ' ' (second to last)
console.log('Hello'.at(-1)); // 'o'

// ============ SEARCHING METHODS ============
const searchText = 'The quick brown fox jumps over the lazy dog. The fox is quick.';

// indexOf(searchValue[, fromIndex]) - first occurrence
console.log(searchText.indexOf('fox')); // 16
console.log(searchText.indexOf('cat')); // -1 (not found)
console.log(searchText.indexOf('the')); // 31 (case sensitive)
console.log(searchText.indexOf('the', 35)); // 45 (search from index 35)
console.log(searchText.indexOf('')); // 0 (empty string found at start)
console.log(searchText.indexOf('', 5)); // 5 (empty string at position 5)

// lastIndexOf(searchValue[, fromIndex]) - last occurrence
console.log(searchText.lastIndexOf('fox')); // 49
console.log(searchText.lastIndexOf('o')); // 57 (last 'o')
console.log(searchText.lastIndexOf('o', 30)); // 26 (search backwards from 30)
console.log(searchText.lastIndexOf('cat')); // -1 (not found)

// includes(searchString[, position]) - boolean search (ES6)
console.log(searchText.includes('fox')); // true
console.log(searchText.includes('Fox')); // false (case sensitive)
console.log(searchText.includes('quick', 20)); // true (starts search from position 20)
console.log(searchText.includes('')); // true (empty string always included)

// startsWith(searchString[, position]) - checks beginning (ES6)
console.log(searchText.startsWith('The')); // true
console.log(searchText.startsWith('the')); // false (case sensitive)
console.log(searchText.startsWith('quick', 4)); // true (checks from position 4)
console.log(searchText.startsWith('')); // true (empty string check)

// endsWith(searchString[, endPosition]) - checks end (ES6)
console.log(searchText.endsWith('quick.')); // true
console.log(searchText.endsWith('dog')); // false (ends with '.')
console.log(searchText.endsWith('dog', 44)); // true (checks up to position 44)
console.log(searchText.endsWith('')); // true (empty string check)

// search(regexp) - regex search, returns index
console.log(searchText.search(/fox/)); // 16 (first match)
console.log(searchText.search(/Fox/i)); // 16 (case insensitive)
console.log(searchText.search(/\\d+/)); // -1 (no digits found)
console.log(searchText.search(/[aeiou]/)); // 2 ('e' at position 2)

// match(regexp) - returns match details or null
const matchResult1 = searchText.match(/fox/);
console.log(matchResult1); // ['fox', index: 16, input: '...', groups: undefined]

const matchResult2 = searchText.match(/fox/g);
console.log(matchResult2); // ['fox', 'fox'] (all matches)

const matchResult3 = searchText.match(/(\\w+)\\s+(\\w+)/);
console.log(matchResult3[0]); // 'The quick' (full match)
console.log(matchResult3[1]); // 'The' (first group)
console.log(matchResult3[2]); // 'quick' (second group)

const noMatch = searchText.match(/xyz/);
console.log(noMatch); // null

// matchAll(regexp) - returns iterator of all match objects (ES2020)
const allMatches = [...searchText.matchAll(/\\b\\w{3}\\b/g)]; // All 3-letter words
console.log(allMatches.length); // Number of 3-letter words
console.log(allMatches[0]); // First match details
console.log(allMatches.map(m => m[0])); // ['The', 'fox', 'The', 'fox']

// Using matchAll with groups
const groupMatches = [...searchText.matchAll(/(\\w+) (\\w+)/g)];
console.log(groupMatches[0][1]); // First word of first match
console.log(groupMatches[0][2]); // Second word of first match

// ============ EXTRACTION METHODS ============
const extractText = 'Hello, Beautiful World!';

// substring(start[, end]) - extracts between indices
console.log(extractText.substring(0, 5)); // 'Hello'
console.log(extractText.substring(7)); // 'Beautiful World!'
console.log(extractText.substring(7, 16)); // 'Beautiful'
console.log(extractText.substring(16, 7)); // 'Beautiful' (swaps if start > end)
console.log(extractText.substring(-5, 5)); // 'Hello' (negative treated as 0)

// substr(start[, length]) - DEPRECATED but still used
console.log(extractText.substr(0, 5)); // 'Hello'
console.log(extractText.substr(7, 9)); // 'Beautiful'
console.log(extractText.substr(-6, 5)); // 'World' (supports negative start)
console.log(extractText.substr(-6)); // 'World!' (from negative to end)

// slice(start[, end]) - extracts section (supports negative indices)
console.log(extractText.slice(0, 5)); // 'Hello'
console.log(extractText.slice(7, 16)); // 'Beautiful'
console.log(extractText.slice(7)); // 'Beautiful World!'
console.log(extractText.slice(-6)); // 'World!'
console.log(extractText.slice(-12, -7)); // 'Beautiful'
console.log(extractText.slice(5, 2)); // '' (empty if start > end)

// ============ CASE CONVERSION METHODS ============
const caseText = 'Hello WoRLD 123 ñáéíóú';

// toLowerCase() - converts to lowercase
console.log(caseText.toLowerCase()); // 'hello world 123 ñáéíóú'

// toUpperCase() - converts to uppercase  
console.log(caseText.toUpperCase()); // 'HELLO WORLD 123 ÑÁÉÍÓÚ'

// toLocaleLowerCase([locales]) - locale-aware lowercase
console.log('İstanbul'.toLocaleLowerCase()); // 'i̇stanbul' (default locale)
console.log('İstanbul'.toLocaleLowerCase('tr-TR')); // 'i̇stanbul' (Turkish)
console.log('İstanbul'.toLocaleLowerCase('en-US')); // 'i̇stanbul' (English)
console.log('ÑÁÉÍÓÚ'.toLocaleLowerCase('es-ES')); // 'ñáéíóú'

// toLocaleUpperCase([locales]) - locale-aware uppercase
console.log('istanbul'.toLocaleUpperCase('tr-TR')); // 'İSTANBUL' (Turkish İ)
console.log('istanbul'.toLocaleUpperCase('en-US')); // 'ISTANBUL' (English I)
console.log('ñáéíóú'.toLocaleUpperCase('es-ES')); // 'ÑÁÉÍÓÚ'

// ============ TRANSFORMATION METHODS ============
const transformText = 'Hello World! Hello Universe!';

// replace(searchValue, replaceValue) - replaces first occurrence
console.log(transformText.replace('Hello', 'Hi')); // 'Hi World! Hello Universe!'
console.log(transformText.replace(/Hello/g, 'Hi')); // 'Hi World! Hi Universe!'
console.log(transformText.replace(/hello/gi, 'Hi')); // 'Hi World! Hi Universe!' (case insensitive)

// Using replace with function
const replaced = transformText.replace(/\\b\\w+\\b/g, (match, offset) => {
  return match.length > 5 ? match.toUpperCase() : match;
});
console.log(replaced); // 'Hello WORLD! Hello UNIVERSE!'

// replace with groups
const timeStr = '2023-12-25';
const usFormat = timeStr.replace(/(\\d{4})-(\\d{2})-(\\d{2})/, '$2/$3/$1');
console.log(usFormat); // '12/25/2023'

// replaceAll(searchValue, replaceValue) - replaces all occurrences (ES2021)
console.log(transformText.replaceAll('Hello', 'Hi')); // 'Hi World! Hi Universe!'
console.log(transformText.replaceAll(/Hello/g, 'Hi')); // 'Hi World! Hi Universe!'
// console.log(transformText.replaceAll(/Hello/, 'Hi')); // Error: must use global flag

// split(separator[, limit]) - splits into array
const splitText = 'apple,banana,cherry,date';
console.log(splitText.split(',')); // ['apple', 'banana', 'cherry', 'date']
console.log(splitText.split(',', 2)); // ['apple', 'banana'] (limit to 2)
console.log(splitText.split('')); // ['a','p','p','l','e',',','b',...] (every character)
console.log('hello world'.split(' ')); // ['hello', 'world']
console.log('a-b_c.d'.split(/[-_.]/)); // ['a', 'b', 'c', 'd'] (regex separator)

// Special split cases
console.log(''.split('')); // [] (empty string)
console.log('abc'.split('')); // ['a', 'b', 'c']
console.log('a,b,c'.split()); // ['a,b,c'] (no separator = whole string)

// concat(...strings) - joins strings (rarely used, prefer + or template literals)
console.log('Hello'.concat(' ', 'World', '!')); // 'Hello World!'
console.log('a'.concat('b', 'c', 'd', 'e')); // 'abcde'
console.log(''.concat('a', 'b', 'c')); // 'abc'

// repeat(count) - repeats string (ES6)
console.log('abc'.repeat(3)); // 'abcabcabc'
console.log('*'.repeat(10)); // '**********'
console.log('-='.repeat(5)); // '-=-=-=-=-='
console.log('hello'.repeat(0)); // ''
// console.log('hello'.repeat(-1)); // RangeError
// console.log('hello'.repeat(Infinity)); // RangeError

// ============ WHITESPACE TRIMMING METHODS ============
const whitespaceText = '\\t  Hello World  \\n\\r  ';
const customWhitespace = '...Hello World...';

// trim() - removes whitespace from both ends (ES5)
console.log(whitespaceText.trim()); // 'Hello World'
console.log(''.trim()); // ''
console.log('   '.trim()); // ''

// trimStart() / trimLeft() - removes from start (ES2019)
console.log(whitespaceText.trimStart()); // 'Hello World  \\n\\r  '
console.log(whitespaceText.trimLeft()); // Same as trimStart (alias)

// trimEnd() / trimRight() - removes from end (ES2019)
console.log(whitespaceText.trimEnd()); // '\\t  Hello World'
console.log(whitespaceText.trimRight()); // Same as trimEnd (alias)

// Custom trimming with regex
console.log(customWhitespace.replace(/^\\.+/, '')); // 'Hello World...'
console.log(customWhitespace.replace(/\\.+$/, '')); // '...Hello World'
console.log(customWhitespace.replace(/^\\.+|\\.+$/g, '')); // 'Hello World'

// ============ PADDING METHODS ============
const shortText = 'Hi';
const numberStr = '42';

// padStart(targetLength[, padString]) - pads beginning (ES2017)
console.log(shortText.padStart(5)); // '   Hi' (default space padding)
console.log(shortText.padStart(5, '0')); // '000Hi'
console.log(shortText.padStart(10, 'abc')); // 'abcabcabHi'
console.log(shortText.padStart(1, 'x')); // 'Hi' (no padding if already longer)
console.log(numberStr.padStart(4, '0')); // '0042' (common use case)

// padEnd(targetLength[, padString]) - pads end (ES2017)
console.log(shortText.padEnd(5)); // 'Hi   ' (default space padding)
console.log(shortText.padEnd(5, '!')); // 'Hi!!!'
console.log(shortText.padEnd(8, '123')); // 'Hi123123'
console.log(shortText.padEnd(1, 'x')); // 'Hi' (no padding if already longer)

// Practical padding examples
const items = ['Item 1', 'Item 22', 'Item 333'];
items.forEach(item => {
  console.log(item.padEnd(10, '.') + ' $10.99');
});
// Item 1.... $10.99
// Item 22... $10.99
// Item 333.. $10.99

// ============ COMPARISON METHODS ============
const compareA = 'apple';
const compareB = 'banana';
const compareC = 'Apple';

// localeCompare(that[, locales[, options]]) - locale-aware comparison
console.log(compareA.localeCompare(compareB)); // -1 (a comes before b)
console.log(compareB.localeCompare(compareA)); // 1 (b comes after a)  
console.log(compareA.localeCompare('apple')); // 0 (equal)
console.log(compareA.localeCompare(compareC)); // 1 (lowercase after uppercase)

// Locale-specific sorting
const germanWords = ['Äpfel', 'Zebra', 'über'];
console.log(germanWords.sort()); // ['Zebra', 'Äpfel', 'über'] (incorrect)
console.log(germanWords.sort((a, b) => a.localeCompare(b, 'de'))); // Correct German sorting

// With options
console.log('ä'.localeCompare('z', 'en')); // -1
console.log('ä'.localeCompare('z', 'sv')); // 1 (Swedish collation)

// Case-insensitive comparison
const compareOptions = { sensitivity: 'base' };
console.log('Apple'.localeCompare('apple', 'en', compareOptions)); // 0 (ignores case)

// Numeric comparison
console.log('10'.localeCompare('2')); // -1 (string comparison)
console.log('10'.localeCompare('2', 'en', { numeric: true })); // 1 (numeric comparison)

// ============ UNICODE AND NORMALIZATION METHODS ============
// normalize([form]) - Unicode normalization (ES6)
const accent1 = 'é'; // Single character é
const accent2 = 'e\\u0301'; // e + combining acute accent
console.log(accent1 === accent2); // false (different representations)
console.log(accent1.length); // 1
console.log(accent2.length); // 2

// Normalization forms
console.log(accent1.normalize('NFC')); // Composed form (default)
console.log(accent2.normalize('NFC')); // Composed form
console.log(accent1.normalize('NFD')); // Decomposed form
console.log(accent2.normalize('NFD')); // Decomposed form

// Check equality after normalization
console.log(accent1.normalize() === accent2.normalize()); // true

// NFKC and NFKD for compatibility
const ligature = 'ﬀ'; // ff ligature
console.log(ligature.normalize('NFKC')); // 'ff'
console.log(ligature.normalize('NFKD')); // 'ff'

// ============ WELL-FORMED UNICODE METHODS ============
// isWellFormed() - checks if string is well-formed UTF-16 (ES2024)
console.log('hello'.isWellFormed()); // true
console.log('😀'.isWellFormed()); // true
// Lone surrogates make string ill-formed
const illFormed = 'hello\\uD800world'; // High surrogate without low
console.log(illFormed.isWellFormed()); // false

// toWellFormed() - fixes ill-formed UTF-16 (ES2024)
console.log(illFormed.toWellFormed()); // 'hello�world' (replacement character)

// ============ STATIC METHODS ============
// String.fromCharCode(...codeUnits) - creates from UTF-16 code units
console.log(String.fromCharCode(72, 101, 108, 108, 111)); // 'Hello'
console.log(String.fromCharCode(65, 66, 67)); // 'ABC'
console.log(String.fromCharCode(0x1F600)); // '὘0' (truncated - can't handle > 0xFFFF properly)

// String.fromCodePoint(...codePoints) - creates from Unicode code points (ES6)
console.log(String.fromCodePoint(72, 101, 108, 108, 111)); // 'Hello'
console.log(String.fromCodePoint(0x1F600)); // '😀' (correctly handles all code points)
console.log(String.fromCodePoint(0x1F600, 0x1F601, 0x1F602)); // '😀😁😂'

// String.raw(template, ...substitutions) - raw template string
console.log(String.raw\`Line 1\\nLine 2\`); // 'Line 1\\nLine 2' (literal backslash)
console.log(\`Line 1\\nLine 2\`); // Actual newline

const path = String.raw\`C:\\Users\\John\\Documents\`;
console.log(path); // 'C:\\Users\\John\\Documents' (no escaping)

// Using String.raw with substitutions
const name = 'Alice';
console.log(String.raw\`Hello \\n \${name}\`); // 'Hello \\n Alice'

// ============ ITERATOR AND SYMBOL METHODS ============
const iterableStr = 'Hi 😀 🌟';

// String implements Symbol.iterator
console.log(typeof iterableStr[Symbol.iterator]); // 'function'

// Traditional iteration (problematic with surrogate pairs)
for (let i = 0; i < iterableStr.length; i++) {
  console.log(i, iterableStr[i]); // May show broken surrogate pairs
}

// Proper iteration with for...of (handles Unicode correctly)
let index = 0;
for (const char of iterableStr) {
  console.log(index++, char); // Correctly shows emoji as single units
}

// Using iterator explicitly
const stringIterator = iterableStr[Symbol.iterator]();
console.log(stringIterator.next()); // {value: 'H', done: false}
console.log(stringIterator.next()); // {value: 'i', done: false}
console.log(stringIterator.next()); // {value: ' ', done: false}
console.log(stringIterator.next()); // {value: '😀', done: false}

// Convert to array (Unicode-aware)
console.log([...iterableStr]); // ['H', 'i', ' ', '😀', ' ', '🌟']
console.log(Array.from(iterableStr)); // Same result

// ============ CONVERSION METHODS ============
// toString() - returns string representation
const strObject = new String('Hello World');
console.log(strObject.toString()); // 'Hello World'
console.log(typeof strObject.toString()); // 'string'

// valueOf() - returns primitive string value
console.log(strObject.valueOf()); // 'Hello World'  
console.log(typeof strObject.valueOf()); // 'string'
console.log(strObject.valueOf() === strObject.toString()); // true

// toJSON() - not a native method, but used by JSON.stringify
// JSON.stringify calls toString() for strings

// ============ REGULAR EXPRESSION INTEGRATION ============
const regexText = 'The price is $25.99 and the tax is $3.90';

// Advanced regex with replace
const formatted = regexText.replace(/\\$(\\d+\\.\\d{2})/g, (match, amount) => {
  return \`USD \${amount}\`;
});
console.log(formatted); // 'The price is USD 25.99 and the tax is USD 3.90'

// Using replace with named groups (ES2018)
const dateText = '2023-12-25';
const reformatted = dateText.replace(
  /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/,
  '$<month>/$<day>/$<year>'
);
console.log(reformatted); // '12/25/2023'

// search() with complex patterns
const emailText = 'Contact us at support@example.com or sales@company.org';
const emailIndex = emailText.search(/\\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}\\b/);
console.log(emailIndex); // Index of first email

// match() with global and named groups
const phoneText = 'Call (555) 123-4567 or (555) 987-6543';
const phoneMatches = phoneText.match(/\\((\\d{3})\\)\\s(\\d{3})-(\\d{4})/g);
console.log(phoneMatches); // ['(555) 123-4567', '(555) 987-6543']

// ============ PRACTICAL UTILITY PATTERNS ============

// 1. String validation utilities
function isValidEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/.test(email);
}

function isValidPhone(phone) {
  return /^\\((\\d{3})\\)\\s\\d{3}-\\d{4}$/.test(phone);
}

function isStrongPassword(password) {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /\\d/.test(password) && 
         /[^\\w\\s]/.test(password);
}

// 2. String formatting utilities
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function titleCase(str) {
  return str.toLowerCase().replace(/\\b\\w/g, l => l.toUpperCase());
}

function kebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/\\s+/g, '-');
}

function camelCase(str) {
  return str
    .toLowerCase()
    .replace(/[-_\\s]+(.)/g, (_, char) => char.toUpperCase());
}

// 3. String analysis utilities
function wordCount(str) {
  return str.trim().split(/\\s+/).filter(word => word.length > 0).length;
}

function characterFrequency(str) {
  const freq = {};
  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }
  return freq;
}

function isPalindrome(str) {
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
}

// 4. Template and interpolation utilities
function template(str, data) {
  return str.replace(/\\{\\{(\\w+)\\}\\}/g, (match, key) => {
    return data.hasOwnProperty(key) ? data[key] : match;
  });
}

const templateStr = 'Hello {{name}}, you have {{count}} messages';
const data = { name: 'Alice', count: 5 };
console.log(template(templateStr, data)); // 'Hello Alice, you have 5 messages'

// 5. Advanced tagged template literals
function sql(strings, ...values) {
  let result = strings[0];
  values.forEach((value, i) => {
    // Basic SQL injection prevention (use proper libraries in production)
    const escaped = typeof value === 'string' 
      ? value.replace(/'/g, "''") 
      : value;
    result += escaped + strings[i + 1];
  });
  return result;
}

const userId = 123;
const userName = "O'Connor";
const query = sql\`SELECT * FROM users WHERE id = \${userId} AND name = '\${userName}'\`;
console.log(query); // SELECT * FROM users WHERE id = 123 AND name = 'O''Connor'

// 6. String builder pattern for performance
class StringBuilder {
  constructor() {
    this.strings = [];
  }
  
  append(str) {
    this.strings.push(str);
    return this;
  }
  
  toString() {
    return this.strings.join('');
  }
  
  clear() {
    this.strings = [];
    return this;
  }
}

const builder = new StringBuilder();
builder.append('Hello').append(' ').append('World').append('!');
console.log(builder.toString()); // 'Hello World!'

// 7. Internationalization examples
const messages = {
  en: 'Hello {name}, you have {count} messages',
  es: 'Hola {name}, tienes {count} mensajes',
  fr: 'Bonjour {name}, vous avez {count} messages'
};

function i18n(locale, messageKey, params) {
  let message = messages[locale] || messages.en;
  Object.keys(params).forEach(key => {
    message = message.replace(\`{\${key}}\`, params[key]);
  });
  return message;
}

console.log(i18n('es', 'greeting', { name: 'María', count: 3 }));
// 'Hola María, tienes 3 mensajes'

// 8. String comparison and similarity
function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

console.log(levenshteinDistance('kitten', 'sitting')); // 3

// 9. String hashing (simple hash function)
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash;
}

console.log(simpleHash('Hello World')); // Numeric hash

// 10. Method chaining patterns
const text = '  HELLO world  ';
const processed = text
  .trim()
  .toLowerCase()
  .split(' ')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');
console.log(processed); // 'Hello World'

// Performance note: String operations create new strings (immutable)
// For many operations, consider using arrays and join() for better performance
const parts = [];
for (let i = 0; i < 1000; i++) {
  parts.push(\`Item \${i}\`);
}
const result = parts.join(', '); // More efficient than repeated concatenation`}
      useCases={[
        "Text processing and manipulation",
        "String formatting and templates",
        "Pattern matching and validation",
        "Data parsing and extraction",
        "Internationalization and localization",
        "URL and path manipulation",
        "Regular expression operations",
        "Character encoding and decoding",
        "Text search and replace operations",
        "String comparison and sorting"
      ]}
    />
  )
}