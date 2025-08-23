import ObjectPage from '../components/ObjectPage';

export default function EncodeURIComponentPage() {
  return (
    <ObjectPage
      title="encodeURIComponent()"
      description="The encodeURIComponent() function encodes a Uniform Resource Identifier (URI) component by replacing each instance of certain characters with escape sequences representing the UTF-8 encoding of the character."
      overview="encodeURIComponent() encodes a URI component by replacing certain characters with escape sequences. Unlike encodeURI(), encodeURIComponent() encodes ALL characters that are not alphanumeric, including reserved URI characters like /, ?, #, etc. This makes it suitable for encoding individual URI components like query parameters, path segments, or fragment identifiers. The function uses UTF-8 encoding for non-ASCII characters."
      syntax={`// Basic encodeURIComponent() usage
console.log(encodeURIComponent('Hello World!')); // 'Hello%20World!'
console.log(encodeURIComponent('John Doe')); // 'John%20Doe'
console.log(encodeURIComponent('user@example.com')); // 'user%40example.com'

// Encoding special characters
console.log(encodeURIComponent('áéíóú')); // '%C3%A1%C3%A9%C3%AD%C3%B3%C3%BA'
console.log(encodeURIComponent('中文')); // '%E4%B8%AD%E6%96%87'
console.log(encodeURIComponent('プロフィール')); // '%E3%83%97%E3%83%AD%E3%83%95%E3%82%A3%E3%83%BC%E3%83%AB'

// encodeURIComponent() vs encodeURI()
const url = 'https://example.com/path?name=John Doe&age=30';

console.log(encodeURI(url)); 
// 'https://example.com/path?name=John%20Doe&age=30' (preserves URI structure)

console.log(encodeURIComponent(url)); 
// 'https%3A%2F%2Fexample.com%2Fpath%3Fname%3DJohn%20Doe%26age%3D30' (encodes everything)

// Building query parameters
function buildQueryString(params) {
  const pairs = [];
  
  for (const [key, value] of Object.entries(params)) {
    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(value);
    pairs.push(\`\${encodedKey}=\${encodedValue}\`);
  }
  
  return pairs.join('&');
}

// Testing query string building
const queryParams = {
  name: 'John Doe',
  age: '30',
  city: 'New York',
  special: 'áéíóú'
};

const queryString = buildQueryString(queryParams);
console.log(queryString); // 'name=John%20Doe&age=30&city=New%20York&special=%C3%A1%C3%A9%C3%AD%C3%B3%C3%BA'

// Building URLs with parameters
function buildURL(baseURL, params) {
  const queryString = buildQueryString(params);
  return \`\${baseURL}?\${queryString}\`;
}

// Testing URL building
const baseURL = 'https://api.example.com/search';
const searchParams = {
  q: 'JavaScript tutorial',
  category: 'programming',
  level: 'beginner'
};

const fullURL = buildURL(baseURL, searchParams);
console.log(fullURL); 
// 'https://api.example.com/search?q=JavaScript%20tutorial&category=programming&level=beginner'

// Form data encoding
function encodeFormData(formData) {
  const pairs = [];
  
  for (const [key, value] of Object.entries(formData)) {
    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(value);
    pairs.push(\`\${encodedKey}=\${encodedValue}\`);
  }
  
  return pairs.join('&');
}

// Testing form data encoding
const formData = {
  username: 'john_doe',
  email: 'john@example.com',
  message: 'Hello World!',
  special: 'áéíóú'
};

const encodedFormData = encodeFormData(formData);
console.log(encodedFormData); 
// 'username=john_doe&email=john%40example.com&message=Hello%20World!&special=%C3%A1%C3%A9%C3%AD%C3%B3%C3%BA'

// Cookie encoding
function encodeCookie(name, value, options = {}) {
  let cookie = \`\${encodeURIComponent(name)}=\${encodeURIComponent(value)}\`;
  
  if (options.expires) {
    cookie += \`; expires=\${options.expires.toUTCString()}\`;
  }
  
  if (options.path) {
    cookie += \`; path=\${encodeURIComponent(options.path)}\`;
  }
  
  if (options.domain) {
    cookie += \`; domain=\${encodeURIComponent(options.domain)}\`;
  }
  
  if (options.secure) {
    cookie += '; secure';
  }
  
  if (options.httpOnly) {
    cookie += '; httpOnly';
  }
  
  return cookie;
}

// Testing cookie encoding
const cookie = encodeCookie('user_preferences', 'theme=dark&language=en', {
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
  path: '/',
  secure: true
});

console.log(cookie); 
// 'user_preferences=theme%3Ddark%26language%3Den; expires=...; path=%2F; secure'

// Path segment encoding
function encodePathSegment(segment) {
  return encodeURIComponent(segment);
}

// Testing path segment encoding
const pathSegments = ['users', 'John Doe', 'profile', 'áéíóú'];
const encodedSegments = pathSegments.map(encodePathSegment);
const path = '/' + encodedSegments.join('/');

console.log(path); // '/users/John%20Doe/profile/%C3%A1%C3%A9%C3%AD%C3%B3%C3%BA'

// Fragment identifier encoding
function encodeFragment(fragment) {
  return encodeURIComponent(fragment);
}

// Testing fragment encoding
const fragment = 'section 1 with spaces and special chars: áéíóú';
const encodedFragment = encodeFragment(fragment);
console.log(encodedFragment); // 'section%201%20with%20spaces%20and%20special%20chars%3A%20%C3%A1%C3%A9%C3%AD%C3%B3%C3%BA'

// Building a comprehensive URL encoder
class URLComponentEncoder {
  static encodeQueryParams(params) {
    const pairs = [];
    
    for (const [key, value] of Object.entries(params)) {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(value);
      pairs.push(\`\${encodedKey}=\${encodedValue}\`);
    }
    
    return pairs.join('&');
  }
  
  static encodePathSegments(segments) {
    return segments.map(segment => encodeURIComponent(segment));
  }
  
  static encodeFragment(fragment) {
    return encodeURIComponent(fragment);
  }
  
  static buildURL(baseURL, params = {}, fragment = '') {
    let url = baseURL;
    
    if (Object.keys(params).length > 0) {
      const queryString = this.encodeQueryParams(params);
      url += \`?\${queryString}\`;
    }
    
    if (fragment) {
      const encodedFragment = this.encodeFragment(fragment);
      url += \`#\${encodedFragment}\`;
    }
    
    return url;
  }
}

// Testing comprehensive URL encoder
const baseURL2 = 'https://api.example.com/users';
const userParams = {
  name: 'John Doe',
  role: 'admin',
  preferences: 'theme=dark&language=en'
};
const fragment2 = 'section 1 with spaces';

const fullURL2 = URLComponentEncoder.buildURL(baseURL2, userParams, fragment2);
console.log(fullURL2); 
// 'https://api.example.com/users?name=John%20Doe&role=admin&preferences=theme%3Ddark%26language%3Den#section%201%20with%20spaces'

// International character handling
function encodeInternationalText(text) {
  try {
    const encoded = encodeURIComponent(text);
    
    // Check if encoding was successful
    const decoded = decodeURIComponent(encoded);
    const isReversible = decoded === text;
    
    return {
      original: text,
      encoded: encoded,
      isReversible: isReversible,
      isValid: true
    };
  } catch (error) {
    return {
      original: text,
      error: error.message,
      isValid: false
    };
  }
}

// Testing international text encoding
const internationalTexts = [
  'Hello World',
  'áéíóú',
  '中文',
  'プロフィール',
  'Привет мир',
  'مرحبا بالعالم'
];

internationalTexts.forEach(text => {
  const result = encodeInternationalText(text);
  console.log(result);
});

// Safe encoding with error handling
function safeEncodeURIComponent(component) {
  try {
    return encodeURIComponent(component);
  } catch (error) {
    console.error('Failed to encode component:', component, error.message);
    return component; // Return original if encoding fails
  }
}

// Testing safe encoding
console.log(safeEncodeURIComponent('Hello World!')); // 'Hello%20World!'
console.log(safeEncodeURIComponent('áéíóú')); // '%C3%A1%C3%A9%C3%AD%C3%B3%C3%BA'

// Building search URLs
function buildSearchURL(baseURL, searchTerm, filters = {}) {
  const params = {
    q: searchTerm,
    ...filters
  };
  
  return URLComponentEncoder.buildURL(baseURL, params);
}

// Testing search URL building
const searchURL = buildSearchURL(
  'https://example.com/search',
  'JavaScript tutorial',
  {
    category: 'programming',
    level: 'beginner',
    language: 'en'
  }
);

console.log(searchURL); 
// 'https://example.com/search?q=JavaScript%20tutorial&category=programming&level=beginner&language=en'`}
      useCases={[
        "Query parameter encoding",
        "Form data submission",
        "Cookie value encoding",
        "Path segment encoding",
        "Fragment identifier encoding",
        "URL component building",
        "International character handling",
        "API request building"
      ]}
    />
  );
}
