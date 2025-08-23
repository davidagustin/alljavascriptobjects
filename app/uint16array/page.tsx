import ObjectPage from '../components/ObjectPage';

export default function Uint16ArrayPage() {
  return (
    <ObjectPage
      title="Uint16Array"
      description="The Uint16Array typed array represents an array of 16-bit unsigned integers."
      overview="Uint16Array represents 16-bit unsigned integers with values ranging from 0 to 65,535. Values outside this range will overflow. Each element takes 2 bytes of memory, making Uint16Array useful for applications requiring 16-bit unsigned integers. It's commonly used for audio processing, network protocols, and other applications where 16-bit precision is needed. Uint16Array supports all standard Array methods and can be created from ArrayBuffer, regular arrays, or other TypedArrays."
      syntax={`// Creating Uint16Array with different constructors
const arr1 = new Uint16Array(4); // Creates array of 4 elements, all 0
const arr2 = new Uint16Array([100, 200, 300, 400]);
const arr3 = new Uint16Array(new ArrayBuffer(8));

// Setting and getting values
const arr = new Uint16Array([1000, 2000, 3000, 4000]);
console.log(arr[0]); // 1000
arr[1] = 2500;
console.log(arr[1]); // 2500

// Values are clamped to 16-bit unsigned range (0 to 65535)
arr[0] = 70000; // Will overflow
console.log(arr[0]); // 4464 (70000 % 65536)

arr[1] = -10; // Will overflow
console.log(arr[1]); // 65526 (65536 - 10)

// Array methods
const numbers = new Uint16Array([100, 200, 300, 400, 500]);
const doubled = numbers.map(x => x * 2);
const evens = numbers.filter(x => x % 2 === 0);
const sum = numbers.reduce((acc, val) => acc + val, 0);

// Buffer operations
const buffer = new ArrayBuffer(16);
const view = new Uint16Array(buffer);
view[0] = 1000;
view[1] = 2000;
view[2] = 3000;
view[3] = 4000;

// Create multiple views on the same buffer
const view2 = new Uint16Array(buffer, 4, 4); // Start at offset 4 bytes, length 4 elements
view2[0] = 9999; // Modifying one view affects the other
console.log(view[2]); // 9999

// Converting to regular array
const regularArray = Array.from(view);

// Audio processing example
function createAudioBuffer(length, sampleRate = 44100) {
  const buffer = new Uint16Array(length);
  
  // Generate a simple sine wave
  const frequency = 440; // A4 note
  const amplitude = 32767; // Max 16-bit unsigned value
  
  for (let i = 0; i < length; i++) {
    const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate);
    buffer[i] = Math.round((sample + 1) * amplitude / 2); // Convert to unsigned
  }
  
  return buffer;
}

// Audio mixing example
function mixAudioBuffers(buffer1, buffer2) {
  const length = Math.max(buffer1.length, buffer2.length);
  const mixed = new Uint16Array(length);
  
  for (let i = 0; i < length; i++) {
    const sample1 = buffer1[i] || 32767; // Default to middle value
    const sample2 = buffer2[i] || 32767;
    // Mix samples and prevent overflow
    mixed[i] = Math.max(0, Math.min(65535, (sample1 + sample2) / 2));
  }
  
  return mixed;
}

// Network protocol handling
class NetworkPacket {
  constructor(data) {
    this.data = new Uint16Array(data);
    this.position = 0;
  }
  
  readUint16() {
    const value = this.data[this.position];
    this.position++;
    return value;
  }
  
  writeUint16(value) {
    this.data[this.position] = value;
    this.position++;
  }
  
  getPacket() {
    return this.data.slice(0, this.position);
  }
}

// Example network packet
const packetData = new Uint16Array(10);
const packet = new NetworkPacket(packetData);

packet.writeUint16(0x1234); // Packet type
packet.writeUint16(0x5678); // Sequence number
packet.writeUint16(0x9ABC); // Data length
packet.writeUint16(0xDEF0); // Checksum

console.log('Packet:', packet.getPacket());

// Image processing with 16-bit depth
function create16BitImageData(width, height) {
  const data = new Uint16Array(width * height);
  
  // Fill with gradient
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const value = Math.round((x / width) * 65535);
      data[y * width + x] = value;
    }
  }
  
  return data;
}

// Histogram calculation
function calculateHistogram(data) {
  const histogram = new Array(256).fill(0);
  
  for (let i = 0; i < data.length; i++) {
    // Convert 16-bit to 8-bit for histogram
    const bucket = Math.floor(data[i] / 256);
    histogram[bucket]++;
  }
  
  return histogram;
}

// Data compression example
function compressData(data) {
  const compressed = [];
  let currentValue = data[0];
  let count = 1;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i] === currentValue && count < 65535) {
      count++;
    } else {
      compressed.push(count, currentValue);
      currentValue = data[i];
      count = 1;
    }
  }
  
  compressed.push(count, currentValue);
  return new Uint16Array(compressed);
}

// Data decompression
function decompressData(compressed) {
  const decompressed = [];
  
  for (let i = 0; i < compressed.length; i += 2) {
    const count = compressed[i];
    const value = compressed[i + 1];
    
    for (let j = 0; j < count; j++) {
      decompressed.push(value);
    }
  }
  
  return new Uint16Array(decompressed);
}

// Practical example
const audioData = createAudioBuffer(4410); // 0.1 second at 44.1kHz
console.log('Audio buffer length:', audioData.length);
console.log('First sample:', audioData[0]);
console.log('Sample at 100ms:', audioData[100]);

// Test compression
const testData = new Uint16Array([1, 1, 1, 2, 2, 3, 3, 3, 3, 4]);
const compressed = compressData(testData);
const decompressed = decompressData(compressed);

console.log('Original:', testData);
console.log('Compressed:', compressed);
console.log('Decompressed:', decompressed);

// Performance measurement
function benchmarkUint16Array() {
  const size = 1000000;
  const data = new Uint16Array(size);
  
  // Fill with random data
  for (let i = 0; i < size; i++) {
    data[i] = Math.floor(Math.random() * 65536);
  }
  
  // Measure processing time
  const start = performance.now();
  
  // Simple processing: double all values
  for (let i = 0; i < size; i++) {
    data[i] = data[i] * 2;
  }
  
  const end = performance.now();
  console.log('Processed ' + size + ' elements in ' + (end - start) + 'ms');
  
  return data;
}

// Run benchmark
const processedData = benchmarkUint16Array();`}
      useCases={[
        "Audio processing and manipulation",
        "Network protocol implementation",
        "Image processing with 16-bit depth",
        "Data compression algorithms",
        "Performance-critical applications",
        "Binary data handling",
        "Memory-efficient data storage",
        "High-precision calculations"
      ]}
    />
  );
}