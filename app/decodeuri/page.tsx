import ObjectPage from '../components/ObjectPage';

export default function DecodeURIPage() {
  return (
    <ObjectPage
      title="decodeURI()"
      description="The decodeURI() function decodes a Uniform Resource Identifier (URI) previously created by encodeURI() or by a similar routine."
      overview="decodeURI() decodes a URI by replacing each escape sequence with the character it represents. It's the reverse operation of encodeURI(). decodeURI() can decode escape sequences created by encodeURI(), but it cannot decode escape sequences created by encodeURIComponent() for characters that are reserved in URIs. If decodeURI() encounters an invalid escape sequence, it throws a URIError."
      syntax={`// Basic decodeURI() usage
const encoded = 'https://example.com/path%20with%20spaces';
const decoded = decodeURI(encoded);
console.log(decoded); // 'https://example.com/path with spaces'

// Decoding special characters
const encodedSpecial = 'https://example.com/%C3%A1%C3%A9%C3%AD%C3%B3%C3%BA';
const decodedSpecial = decodeURI(encodedSpecial);
console.log(decodedSpecial); // 'https://example.com/áéíóú'

// Decoding international characters
const encodedIntl = 'https://example.com/%E4%B8%AD%E6%96%87';
const decodedIntl = decodeURI(encodedIntl);
console.log(decodedIntl); // 'https://example.com/中文'

// decodeURI() vs decodeURIComponent()
const encodedComponent = 'https%3A%2F%2Fexample.com%2Fpath%3Fname%3DJohn%20Doe';
console.log(decodeURI(encodedComponent)); // 'https%3A%2F%2Fexample.com%2Fpath%3Fname%3DJohn%20Doe' (doesn't decode reserved chars)
console.log(decodeURIComponent(encodedComponent)); // 'https://example.com/path?name=John Doe' (decodes everything)

// Error handling
function safeDecodeURI(uri) {
  try {
    return decodeURI(uri);
  } catch (error) {
    if (error instanceof URIError) {
      console.error('Invalid URI:', error.message);
      return null;
    }
    throw error;
  }
}

// Testing safe decoding
console.log(safeDecodeURI('https://example.com/path%20with%20spaces')); // 'https://example.com/path with spaces'
console.log(safeDecodeURI('https://example.com/invalid%')); // null (invalid escape sequence)

// URL parsing and decoding
function parseAndDecodeURL(url) {
  try {
    const decoded = decodeURI(url);
    const urlObj = new URL(decoded);
    
    return {
      protocol: urlObj.protocol,
      hostname: urlObj.hostname,
      pathname: urlObj.pathname,
      search: urlObj.search,
      hash: urlObj.hash
    };
  } catch (error) {
    return { error: error.message };
  }
}

// Testing URL parsing
const encodedURL = 'https://example.com/path%20with%20spaces?name=John%20Doe#section%201';
const parsed = parseAndDecodeURL(encodedURL);
console.log(parsed);

// Decoding query parameters
function decodeQueryParams(queryString) {
  const params = {};
  
  if (!queryString) return params;
  
  // Remove leading '?' if present
  const cleanQuery = queryString.startsWith('?') ? queryString.slice(1) : queryString;
  
  const pairs = cleanQuery.split('&');
  
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

// Testing query parameter decoding
const encodedQuery = 'name=John%20Doe&age=30&city=New%20York';
const params = decodeQueryParams(encodedQuery);
console.log(params); // { name: 'John Doe', age: '30', city: 'New York' }

// Building a URL decoder utility
class URLDecoder {
  static decodeFullURL(encodedURL) {
    try {
      const decoded = decodeURI(encodedURL);
      const url = new URL(decoded);
      
      return {
        fullURL: decoded,
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        searchParams: this.decodeSearchParams(url.search)
      };
    } catch (error) {
      return { error: error.message };
    }
  }
  
  static decodeSearchParams(searchString) {
    const params = {};
    const searchParams = new URLSearchParams(searchString);
    
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    
    return params;
  }
  
  static decodePathSegments(pathname) {
    return pathname.split('/').map(segment => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    });
  }
}

// Testing URL decoder
const complexURL = 'https://example.com/path%20with%20spaces/subfolder?name=John%20Doe&age=30#section%201';
const decoded = URLDecoder.decodeFullURL(complexURL);
console.log('Decoded URL:', decoded);

// International URL handling
function handleInternationalURL(url) {
  try {
    const decoded = decodeURI(url);
    
    // Check for international characters
    const hasInternationalChars = /[^\x00-\x7F]/.test(decoded);
    
    return {
      original: url,
      decoded: decoded,
      hasInternationalChars: hasInternationalChars,
      isValid: true
    };
  } catch (error) {
    return {
      original: url,
      error: error.message,
      isValid: false
    };
  }
}

// Testing international URL handling
const internationalURLs = [
  'https://example.com/%E4%B8%AD%E6%96%87',
  'https://example.com/%E3%83%97%E3%83%AD%E3%83%95%E3%82%A3%E3%83%BC%E3%83%AB',
  'https://example.com/invalid%'
];

internationalURLs.forEach(url => {
  const result = handleInternationalURL(url);
  console.log(result);
});`}
      useCases={[
        "URL decoding and parsing",
        "Query parameter extraction",
        "International character handling",
        "Web application routing",
        "API response processing",
        "Browser history management",
        "Link processing",
        "Data restoration from encoded URLs"
      ]}
    />
  );
}
