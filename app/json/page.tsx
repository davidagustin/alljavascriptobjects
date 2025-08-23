import ObjectPage from '../components/ObjectPage'

export default function JSONPage() {
  return (
    <ObjectPage
      title="JSON"
      description="Provides methods for parsing and stringifying JSON data with advanced options"
      overview="The JSON object provides static methods for parsing JSON strings into JavaScript objects and stringifying JavaScript objects into JSON strings. JSON (JavaScript Object Notation) is a lightweight data-interchange format that's easy for humans to read and write."
      syntax={`// ============ JSON.stringify() ============
// Basic stringification
const obj = {
  name: 'John',
  age: 30,
  city: 'New York',
  active: true,
  hobbies: ['reading', 'swimming'],
  address: {
    street: '123 Main St',
    zipCode: '10001'
  }
};

console.log(JSON.stringify(obj));
// '{"name":"John","age":30,"city":"New York","active":true,"hobbies":["reading","swimming"],"address":{"street":"123 Main St","zipCode":"10001"}}'

// Formatted JSON (pretty printing)
console.log(JSON.stringify(obj, null, 2)); // 2 spaces indentation
console.log(JSON.stringify(obj, null, 4)); // 4 spaces indentation
console.log(JSON.stringify(obj, null, '\t')); // Tab indentation
console.log(JSON.stringify(obj, null, '  ')); // Custom indentation string

// Result with 2 spaces:
// {
//   "name": "John",
//   "age": 30,
//   "city": "New York",
//   "active": true,
//   "hobbies": [
//     "reading",
//     "swimming"
//   ],
//   "address": {
//     "street": "123 Main St",
//     "zipCode": "10001"
//   }
// }

// ============ JSON.stringify() WITH REPLACER ============

// Using replacer function
const objWithSensitive = {
  username: 'john_doe',
  password: 'secret123',
  email: 'john@example.com',
  age: 30,
  apiKey: 'abc-123-def'
};

// Filter out sensitive data
const filtered = JSON.stringify(objWithSensitive, (key, value) => {
  if (key === 'password' || key === 'apiKey') {
    return undefined; // Exclude from JSON
  }
  if (key === 'email') {
    return '[REDACTED]'; // Replace with placeholder
  }
  if (typeof value === 'number') {
    return String(value); // Convert numbers to strings
  }
  return value; // Keep original value
});
console.log(filtered);
// '{"username":"john_doe","email":"[REDACTED]","age":"30"}'

// Using replacer array (whitelist properties)
const whitelisted = JSON.stringify(objWithSensitive, ['username', 'email', 'age']);
console.log(whitelisted);
// '{"username":"john_doe","email":"john@example.com","age":30}'

// Transform values during stringification
const transformedData = {
  date: new Date('2024-12-25'),
  regex: /test/gi,
  func: function() { return 'hello'; },
  undef: undefined,
  sym: Symbol('test'),
  num: 42.123456,
  bigint: 123n
};

const transformed = JSON.stringify(transformedData, (key, value) => {
  if (value instanceof Date) {
    return { __type: 'Date', value: value.toISOString() };
  }
  if (value instanceof RegExp) {
    return { __type: 'RegExp', source: value.source, flags: value.flags };
  }
  if (typeof value === 'function') {
    return { __type: 'Function', name: value.name, source: value.toString() };
  }
  if (typeof value === 'symbol') {
    return { __type: 'Symbol', description: value.description };
  }
  if (typeof value === 'number' && !Number.isInteger(value)) {
    return Number(value.toFixed(2)); // Round to 2 decimals
  }
  if (typeof value === 'bigint') {
    return { __type: 'BigInt', value: value.toString() };
  }
  return value;
}, 2);

console.log(transformed);

// ============ JSON.parse() ============
// Basic parsing
const jsonStr = '{"name":"Jane","age":25,"active":true,"skills":["JavaScript","Python"]}';
const parsed = JSON.parse(jsonStr);

console.log(parsed.name);     // 'Jane'
console.log(parsed.age);      // 25
console.log(parsed.active);   // true
console.log(parsed.skills);   // ['JavaScript', 'Python']
console.log(typeof parsed);   // 'object'

// Parse arrays
const jsonArray = '[1, 2, 3, "hello", true, null]';
const parsedArray = JSON.parse(jsonArray);
console.log(parsedArray);     // [1, 2, 3, 'hello', true, null]

// Parse primitive values
console.log(JSON.parse('42'));        // 42
console.log(JSON.parse('"hello"'));   // 'hello'
console.log(JSON.parse('true'));      // true
console.log(JSON.parse('null'));      // null
console.log(JSON.parse('false'));     // false

// ============ JSON.parse() WITH REVIVER ============

// Using reviver function to transform values during parsing
const jsonWithDates = '{"name":"John","birthDate":"2024-12-25T10:30:00.000Z","lastLogin":"2024-01-15T14:20:00.000Z","count":42}';

const revived = JSON.parse(jsonWithDates, (key, value) => {
  // Convert ISO date strings to Date objects
  if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
    return new Date(value);
  }
  // Convert all numbers to strings for this example
  if (typeof value === 'number') {
    return String(value);
  }
  return value;
});

console.log(revived.birthDate instanceof Date); // true
console.log(revived.count);                     // '42' (string)

// Reviver with custom type restoration
const customTypesJson = '{"date":{"__type":"Date","value":"2024-12-25T10:30:00.000Z"},"regex":{"__type":"RegExp","source":"test","flags":"gi"},"bigint":{"__type":"BigInt","value":"123456789012345678901234567890"}}';

const restored = JSON.parse(customTypesJson, (key, value) => {
  if (value && typeof value === 'object' && value.__type) {
    switch (value.__type) {
      case 'Date':
        return new Date(value.value);
      case 'RegExp':
        return new RegExp(value.source, value.flags);
      case 'BigInt':
        return BigInt(value.value);
      case 'Symbol':
        return Symbol(value.description);
      default:
        return value;
    }
  }
  return value;
});

console.log(restored.date instanceof Date);     // true
console.log(restored.regex instanceof RegExp);  // true
console.log(typeof restored.bigint);            // 'bigint'

// ============ JSON LIMITATIONS AND SPECIAL CASES ============

// Values that are omitted in JSON.stringify()
const omittedValues = {
  func: function() { return 'test'; },    // Functions are omitted
  undef: undefined,                       // undefined is omitted
  sym: Symbol('test'),                    // Symbols are omitted
  date: new Date(),                       // Dates become strings
  regex: /test/g,                         // RegExp becomes {}
  num: NaN,                               // NaN becomes null
  inf: Infinity,                          // Infinity becomes null
  negInf: -Infinity,                      // -Infinity becomes null
  bigint: 123n,                          // BigInt throws TypeError
  valid: 'kept'
};

// Remove BigInt to avoid error
delete omittedValues.bigint;
console.log(JSON.stringify(omittedValues));
// '{"date":"2024-12-25T10:30:45.500Z","regex":{},"num":null,"inf":null,"negInf":null,"valid":"kept"}'

// Arrays with special values
const arrayWithSpecial = [
  function() { return 'test'; },  // becomes null
  undefined,                      // becomes null
  Symbol('test'),                 // becomes null
  new Date(),                     // becomes string
  /test/g,                        // becomes {}
  NaN,                            // becomes null
  Infinity,                       // becomes null
  'normal value'
];

console.log(JSON.stringify(arrayWithSpecial));
// '[null,null,null,"2024-12-25T10:30:45.500Z",{},null,null,"normal value"]'

// ============ CIRCULAR REFERENCE HANDLING ============

// Circular references cause TypeError
const circularObj = { name: 'test' };
circularObj.self = circularObj;

// This would throw: TypeError: Converting circular structure to JSON
// console.log(JSON.stringify(circularObj));

// Custom circular reference handler
function stringifyWithCircularRefs(obj, space) {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular Reference]';
      }
      seen.add(value);
    }
    return value;
  }, space);
}

console.log(stringifyWithCircularRefs(circularObj, 2));
// {
//   "name": "test",
//   "self": "[Circular Reference]"
// }

// ============ ERROR HANDLING ============

// JSON.parse error handling
function safeJsonParse(jsonString, defaultValue = null) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON Parse Error:', error.message);
    return defaultValue;
  }
}

console.log(safeJsonParse('{"valid": "json"}')); // { valid: 'json' }
console.log(safeJsonParse('{invalid json}')); // null (with error logged)
console.log(safeJsonParse('undefined')); // null (with error logged)

// JSON.stringify error handling
function safeJsonStringify(obj, replacer, space) {
  try {
    return JSON.stringify(obj, replacer, space);
  } catch (error) {
    console.error('JSON Stringify Error:', error.message);
    // Try with circular reference handler
    return stringifyWithCircularRefs(obj, space);
  }
}

// ============ PRACTICAL UTILITY FUNCTIONS ============

// Deep clone using JSON (limited but fast)
function jsonDeepClone(obj) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.error('Cannot clone object:', error.message);
    return null;
  }
}

const originalObj = {
  name: 'test',
  nested: { value: 42 },
  array: [1, 2, 3]
};

const cloned = jsonDeepClone(originalObj);
cloned.nested.value = 100;
console.log(originalObj.nested.value); // 42 (unchanged)
console.log(cloned.nested.value); // 100 (modified)

// Compare objects using JSON
function jsonEqual(obj1, obj2) {
  try {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  } catch {
    return false;
  }
}

console.log(jsonEqual({a: 1, b: 2}, {a: 1, b: 2})); // true
console.log(jsonEqual({a: 1, b: 2}, {b: 2, a: 1})); // false (different order)

// Stable JSON stringify (consistent property order)
function stableStringify(obj, space) {
  return JSON.stringify(obj, Object.keys(obj).sort(), space);
}

console.log(stableStringify({b: 2, a: 1})); // '{"a":1,"b":2}'
console.log(stableStringify({a: 1, b: 2})); // '{"a":1,"b":2}' (same result)

// JSON size calculation
function getJsonSize(obj) {
  try {
    return new Blob([JSON.stringify(obj)]).size;
  } catch {
    return 0;
  }
}

console.log(getJsonSize({name: 'test'})); // Size in bytes

// Extract specific paths from JSON
function getJsonPath(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

const complexObj = {
  user: {
    profile: {
      name: 'John',
      settings: {
        theme: 'dark'
      }
    }
  }
};

console.log(getJsonPath(complexObj, 'user.profile.name')); // 'John'
console.log(getJsonPath(complexObj, 'user.profile.settings.theme')); // 'dark'
console.log(getJsonPath(complexObj, 'user.missing.path')); // undefined

// JSON schema validation (basic)
function validateJsonSchema(obj, schema) {
  for (const [key, expectedType] of Object.entries(schema)) {
    const value = obj[key];
    
    if (value === undefined) {
      return { valid: false, error: \`Missing required field: \${key}\` };
    }
    
    if (typeof value !== expectedType) {
      return { valid: false, error: \`Field \${key} should be \${expectedType}, got \${typeof value}\` };
    }
  }
  
  return { valid: true };
}

const userSchema = {
  name: 'string',
  age: 'number',
  active: 'boolean'
};

console.log(validateJsonSchema({ name: 'John', age: 30, active: true }, userSchema));
// { valid: true }

console.log(validateJsonSchema({ name: 'John', age: '30', active: true }, userSchema));
// { valid: false, error: 'Field age should be number, got string' }

// JSON diff (simple version)
function jsonDiff(obj1, obj2) {
  const differences = {};
  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
  
  for (const key of allKeys) {
    if (!(key in obj1)) {
      differences[key] = { type: 'added', value: obj2[key] };
    } else if (!(key in obj2)) {
      differences[key] = { type: 'removed', value: obj1[key] };
    } else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
      differences[key] = { 
        type: 'changed', 
        old: obj1[key], 
        new: obj2[key] 
      };
    }
  }
  
  return Object.keys(differences).length > 0 ? differences : null;
}

const obj1 = { a: 1, b: 2, c: 3 };
const obj2 = { a: 1, b: 3, d: 4 };

console.log(jsonDiff(obj1, obj2));
// {
//   b: { type: 'changed', old: 2, new: 3 },
//   c: { type: 'removed', value: 3 },
//   d: { type: 'added', value: 4 }
// }

// Flatten JSON object
function flattenJson(obj, prefix = '', separator = '.') {
  const flattened = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? \`\${prefix}\${separator}\${key}\` : key;
    
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(flattened, flattenJson(value, newKey, separator));
    } else {
      flattened[newKey] = value;
    }
  }
  
  return flattened;
}

const nestedObj = {
  user: {
    name: 'John',
    profile: {
      age: 30,
      settings: {
        theme: 'dark'
      }
    }
  },
  status: 'active'
};

console.log(flattenJson(nestedObj));
// {
//   'user.name': 'John',
//   'user.profile.age': 30,
//   'user.profile.settings.theme': 'dark',
//   'status': 'active'
// }

// Unflatten JSON object
function unflattenJson(obj, separator = '.') {
  const unflattened = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const keys = key.split(separator);
    let current = unflattened;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in current)) {
        current[k] = {};
      }
      current = current[k];
    }
    
    current[keys[keys.length - 1]] = value;
  }
  
  return unflattened;
}

const flatObj = {
  'user.name': 'John',
  'user.profile.age': 30,
  'user.profile.settings.theme': 'dark',
  'status': 'active'
};

console.log(unflattenJson(flatObj));
// Reconstructs the original nested structure

// ============ PERFORMANCE CONSIDERATIONS ============

// Measure JSON operations performance
function measureJsonPerformance() {
  const largeObj = {};
  for (let i = 0; i < 10000; i++) {
    largeObj[\`key\${i}\`] = {
      id: i,
      name: \`Item \${i}\`,
      data: Array(100).fill(i),
      timestamp: new Date().toISOString()
    };
  }
  
  console.time('JSON.stringify');
  const jsonString = JSON.stringify(largeObj);
  console.timeEnd('JSON.stringify');
  
  console.time('JSON.parse');
  const parsed = JSON.parse(jsonString);
  console.timeEnd('JSON.parse');
  
  console.log(\`JSON size: \${jsonString.length} characters\`);
  console.log(\`Parsed object has \${Object.keys(parsed).length} keys\`);
}

// measureJsonPerformance();

// ============ WORKING WITH APIS ============

// Simulate API response handling
async function fetchAndParseJson(url) {
  try {
    // Simulated fetch (replace with actual fetch)
    const response = {
      ok: true,
      json: () => Promise.resolve('{"users":[{"id":1,"name":"John"},{"id":2,"name":"Jane"}]}')
    };
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const jsonText = await response.json();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
}

// Prepare data for API submission
function prepareApiData(formData) {
  // Convert form data to API-ready format
  const prepared = {
    ...formData,
    timestamp: new Date().toISOString(),
    version: '1.0'
  };
  
  // Remove empty values
  for (const [key, value] of Object.entries(prepared)) {
    if (value === '' || value === null || value === undefined) {
      delete prepared[key];
    }
  }
  
  return JSON.stringify(prepared);
}

console.log(prepareApiData({ 
  name: 'John', 
  email: 'john@example.com', 
  phone: '', 
  age: null 
}));

// ============ DEBUGGING AND INSPECTION ============

// Pretty print JSON with colors (for console)
function prettyPrintJson(obj) {
  const jsonString = JSON.stringify(obj, null, 2);
  console.log(jsonString);
  
  // Return formatted for further use
  return jsonString;
}

// JSON validation with detailed errors
function validateJson(jsonString) {
  try {
    JSON.parse(jsonString);
    return { valid: true, error: null };
  } catch (error) {
    const match = error.message.match(/position (\\d+)/);
    const position = match ? parseInt(match[1]) : -1;
    
    return {
      valid: false,
      error: error.message,
      position,
      context: position >= 0 ? {
        before: jsonString.substring(Math.max(0, position - 10), position),
        after: jsonString.substring(position, position + 10)
      } : null
    };
  }
}

console.log(validateJson('{"valid": "json"}'));
// { valid: true, error: null }

console.log(validateJson('{"invalid": json}'));
// { valid: false, error: 'Unexpected token j...', position: 12, context: {...} }

// Minify JSON (remove whitespace)
function minifyJson(obj) {
  return JSON.stringify(obj); // Already minified by default
}

// Format JSON for readable display
function formatJsonForDisplay(obj, maxDepth = 3, currentDepth = 0) {
  if (currentDepth >= maxDepth) {
    return '[Object...]';
  }
  
  if (Array.isArray(obj)) {
    if (obj.length > 5) {
      return \`[...(\${obj.length} items)]\`;
    }
    return \`[\${obj.map(item => formatJsonForDisplay(item, maxDepth, currentDepth + 1)).join(', ')}]\`;
  }
  
  if (obj && typeof obj === 'object') {
    const keys = Object.keys(obj);
    if (keys.length > 5) {
      return \`{...(\${keys.length} keys)}\`;
    }
    const formatted = keys.map(key => 
      \`\${key}: \${formatJsonForDisplay(obj[key], maxDepth, currentDepth + 1)}\`
    ).join(', ');
    return \`{\${formatted}}\`;
  }
  
  return JSON.stringify(obj);
}`}
      useCases={[
        "API data serialization and transmission",
        "Configuration file management",
        "Data storage and persistence",
        "Inter-process communication",
        "Object cloning and deep copying",
        "Data validation and schema checking",
        "Log formatting and structured logging",
        "State management in applications",
        "Data transformation and mapping",
        "Browser storage (localStorage/sessionStorage)",
        "Error reporting and debugging",
        "Data migration and import/export",
        "Template and configuration templating",
        "Performance monitoring and analytics",
        "Cross-platform data exchange"
      ]}
    />
  )
}