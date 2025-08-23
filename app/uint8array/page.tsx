import ObjectPage from '../components/ObjectPage';

export default function Uint8ArrayPage() {
  return (
    <ObjectPage
      title="Uint8Array"
      description="The Uint8Array typed array represents an array of 8-bit unsigned integers."
      overview="Uint8Array represents 8-bit unsigned integers with values ranging from 0 to 255. Values outside this range are clamped to the nearest valid value. Each element takes 1 byte of memory, making Uint8Array perfect for binary data processing. It's commonly used for working with file data, network protocols, and image processing. Uint8Array supports all standard Array methods and can be created from ArrayBuffer, regular arrays, or other TypedArrays. Multiple views can share the same underlying ArrayBuffer, allowing efficient memory usage."
      syntax={`// Creating Uint8Array with different constructors
const arr1 = new Uint8Array(4); // Creates array of 4 elements, all 0
const arr2 = new Uint8Array([1, 2, 3, 4]);
const arr3 = new Uint8Array(new ArrayBuffer(8));

// Setting and getting values
const arr = new Uint8Array([10, 20, 30, 40]);
console.log(arr[0]); // 10
arr[1] = 25;
console.log(arr[1]); // 25

// Values are clamped to 8-bit unsigned range (0 to 255)
arr[0] = 300; // Will be clamped to 255
console.log(arr[0]); // 255

arr[1] = -10; // Will be clamped to 0
console.log(arr[1]); // 0

// Binary data processing
const buffer = new ArrayBuffer(16);
const uint8Array = new Uint8Array(buffer);

// Fill with binary data
for (let i = 0; i < uint8Array.length; i++) {
  uint8Array[i] = i * 16;
}

// Working with strings
const text = 'Hello World';
const textEncoder = new TextEncoder();
const textBytes = textEncoder.encode(text);

// Converting back to string
const textDecoder = new TextDecoder();
const decodedText = textDecoder.decode(textBytes);

// Processing image data (simplified example)
function createImageData(width, height) {
  const data = new Uint8Array(width * height * 4); // RGBA
  
  // Fill with white pixels
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255;     // Red
    data[i + 1] = 255; // Green
    data[i + 2] = 255; // Blue
    data[i + 3] = 255; // Alpha
  }
  
  return data;
}

function setPixel(data, x, y, width, r, g, b, a = 255) {
  const index = (y * width + x) * 4;
  data[index] = r;     // Red
  data[index + 1] = g; // Green
  data[index + 2] = b; // Blue
  data[index + 3] = a; // Alpha
}

// Create a 3x3 image
const imageData = createImageData(3, 3);
setPixel(imageData, 1, 1, 3, 255, 0, 0); // Set a red pixel

// Buffer operations
const sharedBuffer = new ArrayBuffer(8);
const view = new Uint8Array(sharedBuffer);
view[0] = 1;
view[1] = 2;
view[2] = 3;
view[3] = 4;

// Create multiple views on the same buffer
const view2 = new Uint8Array(sharedBuffer, 2, 4);
view2[0] = 99; // Modifying one view affects the other
console.log(view[2]); // 99

// Converting to regular array
const regularArray = Array.from(view);

// Practical example
console.log('Text bytes:', textBytes);
console.log('Decoded text:', decodedText);
console.log('Image data length:', imageData.length);`}
      useCases={[
        "Binary data processing",
        "File data handling",
        "Network protocol implementation",
        "Image processing and manipulation",
        "Audio data processing",
        "Cryptographic operations",
        "Data compression",
        "Memory-efficient data storage"
      ]}
    />
  );
}