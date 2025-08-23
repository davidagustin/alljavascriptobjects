import ObjectPage from '../components/ObjectPage';

export default function EncodeURIPage() {
  return (
    <ObjectPage
      title="encodeURI()"
      description="The encodeURI() function encodes a URI by replacing each instance of certain characters with escape sequences representing the UTF-8 encoding of the character."
      overview="encodeURI() encodes a complete URI by replacing certain characters with escape sequences. Reserved characters (:/?#[]@!$&'()*+,;=) are NOT encoded, while non-ASCII characters are encoded using UTF-8. Spaces become %20. Use encodeURI() for complete URLs and encodeURIComponent() for URL components (query parameters, etc.). encodeURI() preserves the URL structure while encodeURIComponent() encodes everything including reserved characters. Both functions throw URIError for malformed surrogate pairs."
      syntax={`// Basic encodeURI() usage
console.log(encodeURI('https://example.com/path with spaces')); 
// 'https://example.com/path%20with%20spaces'

console.log(encodeURI('https://example.com/query?name=John Doe&age=30')); 
// 'https://example.com/query?name=John%20Doe&age=30'

// Special characters are encoded
console.log(encodeURI('https://example.com/áéíóú')); 
// 'https://example.com/%C3%A1%C3%A9%C3%AD%C3%B3%C3%BA'

// Reserved characters are preserved
console.log(encodeURI('https://example.com/path?param=value#fragment')); 
// 'https://example.com/path?param=value#fragment' (unchanged)

// encodeURI vs encodeURIComponent
const url = 'https://example.com/path?name=John Doe&age=30';

console.log(encodeURI(url));
// 'https://example.com/path?name=John%20Doe&age=30'

console.log(encodeURIComponent(url));
// 'https%3A%2F%2Fexample.com%2Fpath%3Fname%3DJohn%20Doe%26age%3D30'

// Building URLs with parameters
function buildSearchUrl(baseUrl, params) {
  const searchParams = new URLSearchParams();
  
  for (const [key, value] of Object.entries(params)) {
    searchParams.append(key, value);
  }
  
  return \`\${baseUrl}?\${searchParams.toString()}\`;
}

// Handling user input
function createUserProfileUrl(username, displayName) {
  const encodedUsername = encodeURIComponent(username);
  const encodedDisplayName = encodeURIComponent(displayName);
  
  return \`https://example.com/user/\${encodedUsername}?name=\${encodedDisplayName}\`;
}

// International URLs
const internationalUrl = encodeURI('https://example.com/用户/プロフィール');

// Practical examples
const searchParams = {
  q: 'JavaScript tutorial',
  category: 'programming',
  level: 'beginner'
};

const searchUrl = buildSearchUrl('https://example.com/search', searchParams);
console.log(searchUrl); 
// 'https://example.com/search?q=JavaScript+tutorial&category=programming&level=beginner'

console.log(createUserProfileUrl('john_doe', 'John Doe'));
// 'https://example.com/user/john_doe?name=John%20Doe'`}
      useCases={[
        "URL encoding and building",
        "Web address handling",
        "API request building",
        "Special character encoding",
        "International URL support",
        "Query parameter encoding",
        "Cross-origin resource sharing",
        "Web application routing"
      ]}
    />
  );
}
