import ObjectPage from '../components/ObjectPage';

export default function DecodeURIComponentPage() {
  return (
    <ObjectPage
      title="decodeURIComponent()"
      description="The decodeURIComponent() function decodes a Uniform Resource Identifier (URI) component previously created by encodeURIComponent() or by a similar routine."
      overview="decodeURIComponent() decodes a URI component by replacing each escape sequence with the character it represents. It's the reverse operation of encodeURIComponent(). Unlike decodeURI(), decodeURIComponent() decodes ALL percent-encoded characters, including those that are reserved in URIs (like /, ?, #, etc.). This makes it suitable for decoding individual URI components like query parameters, path segments, or fragment identifiers."
      syntax={`// Basic decodeURIComponent() usage
const encoded = 'Hello%20World%21';
const decoded = decodeURIComponent(encoded);
console.log(decoded); // 'Hello World!'

// Decoding special characters
const encodedSpecial = '%C3%A1%C3%A9%C3%AD%C3%B3%C3%BA';
const decodedSpecial = decodeURIComponent(encodedSpecial);
console.log(decodedSpecial); // 'áéíóú'

// Decoding international characters
const encodedIntl = '%E4%B8%AD%E6%96%87';
const decodedIntl = decodeURIComponent(encodedIntl);
console.log(decodedIntl); // '中文'

// decodeURIComponent() vs decodeURI()
const encodedComponent = 'https%3A%2F%2Fexample.com%2Fpath%3Fname%3DJohn%20Doe';
console.log(decodeURIComponent(encodedComponent)); // 'https://example.com/path?name=John Doe' (decodes everything)
console.log(decodeURI(encodedComponent)); // 'https%3A%2F%2Fexample.com%2Fpath%3Fname%3DJohn%20Doe' (doesn't decode reserved chars)

// Error handling
function safeDecodeURIComponent(component) {
  try {
    return decodeURIComponent(component);
  } catch (error) {
    if (error instanceof URIError) {
      console.error('Invalid URI component:', error.message);
      return null;
    }
    throw error;
  }
}

// Testing safe decoding
console.log(safeDecodeURIComponent('Hello%20World')); // 'Hello World'
console.log(safeDecodeURIComponent('Invalid%')); // null (invalid escape sequence)

// Query parameter decoding
function decodeQueryString(queryString) {
  const params = {};
  
  if (!queryString) return params;
  
  // Remove leading '?' if present
  const cleanQuery = queryString.startsWith('?') ? queryString.slice(1) : queryString;
  
  const pairs = cleanQuery ? cleanQuery.split('&') : [];
  
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key) {
      const decodedKey = decodeURIComponent(key);
      const decodedValue = value ? decodeURIComponent(value) : '';
      params[decodedKey] = decodedValue;
    }
  }
  
  return params;
}

// Testing query string decoding
const encodedQuery = 'name=John%20Doe&age=30&city=New%20York&special=%C3%A1%C3%A9';
const params = decodeQueryString(encodedQuery);
console.log(params); // { name: 'John Doe', age: '30', city: 'New York', special: 'áé' }

// Path segment decoding
function decodePathSegments(pathname) {
  return pathname.split('/').map(segment => {
    try {
      return decodeURIComponent(segment);
    } catch (error) {
      console.warn('Failed to decode segment:', segment, error.message);
      return segment;
    }
  });
}

// Testing path segment decoding
const encodedPath = '/users/John%20Doe/profile/%E4%B8%AD%E6%96%87';
const segments = decodePathSegments(encodedPath);
console.log(segments); // ['', 'users', 'John Doe', 'profile', '中文']

// Fragment identifier decoding
function decodeFragment(fragment) {
  if (!fragment) return '';
  
  // Remove leading '#' if present
  const cleanFragment = fragment.startsWith('#') ? fragment.slice(1) : fragment;
  
  try {
    return decodeURIComponent(cleanFragment);
  } catch (error) {
    console.warn('Failed to decode fragment:', fragment, error.message);
    return cleanFragment;
  }
}

// Testing fragment decoding
const encodedFragment = 'section%201%20with%20spaces';
const fragment = decodeFragment(encodedFragment);
console.log(fragment); // 'section 1 with spaces'

// Building a comprehensive URI component decoder
class URIComponentDecoder {
  static decodeQueryParams(queryString) {
    const params = {};
    
    if (!queryString) return params;
    
    const cleanQuery = queryString.startsWith('?') ? queryString.slice(1) : queryString;
    const pairs = cleanQuery ? cleanQuery.split('&') : [];
    
    for (const pair of pairs) {
      const [key, value] = pair.split('=');
      if (key) {
        try {
          const decodedKey = decodeURIComponent(key);
          const decodedValue = value ? decodeURIComponent(value) : '';
          params[decodedKey] = decodedValue;
        } catch (error) {
          console.warn('Failed to decode query parameter:', pair, error.message);
          params[key] = value || '';
        }
      }
    }
    
    return params;
  }
  
  static decodePathname(pathname) {
    return pathname.split('/').map(segment => {
      try {
        return decodeURIComponent(segment);
      } catch (error) {
        console.warn('Failed to decode path segment:', segment, error.message);
        return segment;
      }
    });
  }
  
  static decodeFragment(fragment) {
    if (!fragment) return '';
    
    const cleanFragment = fragment.startsWith('#') ? fragment.slice(1) : fragment;
    
    try {
      return decodeURIComponent(cleanFragment);
    } catch (error) {
      console.warn('Failed to decode fragment:', fragment, error.message);
      return cleanFragment;
    }
  }
  
  static decodeFullURL(url) {
    try {
      const urlObj = new URL(url);
      
      return {
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        port: urlObj.port,
        pathname: this.decodePathname(urlObj.pathname),
        search: urlObj.search,
        searchParams: this.decodeQueryParams(urlObj.search),
        hash: urlObj.hash,
        fragment: this.decodeFragment(urlObj.hash)
      };
    } catch (error) {
      return { error: error.message };
    }
  }
}

// Testing comprehensive decoder
const complexURL = 'https://example.com/users/John%20Doe/profile?name=John%20Doe&age=30&city=New%20York#section%201';
const decoded = URIComponentDecoder.decodeFullURL(complexURL);
console.log('Decoded URL components:', decoded);

// Form data decoding
function decodeFormData(formDataString) {
  const formData = {};
  
  if (!formDataString) return formData;
  
  const pairs = formDataString.split('&');
  
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key) {
      try {
        const decodedKey = decodeURIComponent(key);
        const decodedValue = value ? decodeURIComponent(value) : '';
        formData[decodedKey] = decodedValue;
      } catch (error) {
        console.warn('Failed to decode form data pair:', pair, error.message);
        formData[key] = value || '';
      }
    }
  }
  
  return formData;
}

// Testing form data decoding
const encodedFormData = 'username=john%20doe&email=john%40example.com&message=Hello%20World%21';
const formData = decodeFormData(encodedFormData);
console.log('Decoded form data:', formData);

// Cookie decoding
function decodeCookie(cookieString) {
  const cookies = {};
  
  if (!cookieString) return cookies;
  
  const pairs = cookieString.split(';');
  
  for (const pair of pairs) {
    const [key, value] = pair.trim().split('=');
    if (key) {
      try {
        const decodedKey = decodeURIComponent(key);
        const decodedValue = value ? decodeURIComponent(value) : '';
        cookies[decodedKey] = decodedValue;
      } catch (error) {
        console.warn('Failed to decode cookie:', pair, error.message);
        cookies[key] = value || '';
      }
    }
  }
  
  return cookies;
}

// Testing cookie decoding
const encodedCookie = 'username=john%20doe; session=abc123; theme=dark%20mode';
const cookies = decodeCookie(encodedCookie);
console.log('Decoded cookies:', cookies);

// International character handling
function handleInternationalComponent(component) {
  try {
    const decoded = decodeURIComponent(component);
    
    // Check for international characters
    const hasInternationalChars = /[^\x00-\x7F]/.test(decoded);
    
    return {
      original: component,
      decoded: decoded,
      hasInternationalChars: hasInternationalChars,
      isValid: true
    };
  } catch (error) {
    return {
      original: component,
      error: error.message,
      isValid: false
    };
  }
}

// Testing international component handling
const internationalComponents = [
  '%E4%B8%AD%E6%96%87',
  '%E3%83%97%E3%83%AD%E3%83%95%E3%82%A3%E3%83%BC%E3%83%AB',
  'Hello%20World',
  'Invalid%'
];

internationalComponents.forEach(component => {
  const result = handleInternationalComponent(component);
  console.log(result);
});`}
      useCases={[
        "Query parameter decoding",
        "Form data processing",
        "Cookie parsing",
        "Path segment decoding",
        "Fragment identifier processing",
        "URL component extraction",
        "Data restoration from encoded strings",
        "International character handling"
      ]}
    />
  );
}
