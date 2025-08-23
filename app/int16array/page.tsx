import ObjectPage from '../components/ObjectPage';

export default function Int16ArrayPage() {
  return (
    <ObjectPage
      title="Int16Array"
      description="The Int16Array typed array represents an array of 16-bit signed integers."
      overview="Int16Array represents 16-bit signed integers with values ranging from -32,768 to 32,767. Values outside this range will overflow. Each element takes 2 bytes of memory, making Int16Array useful for audio processing and other applications requiring 16-bit integers. It supports all standard Array methods like map, filter, reduce, and can be created from ArrayBuffer, regular arrays, or other TypedArrays. Multiple views can share the same underlying ArrayBuffer, allowing efficient memory usage."
      syntax={`// Creating Int16Array with different constructors
const arr1 = new Int16Array(4); // Creates array of 4 elements, all 0
const arr2 = new Int16Array([100, 200, 300, 400]);
const arr3 = new Int16Array(new ArrayBuffer(8));

// Setting and getting values
const arr = new Int16Array([1000, 2000, 3000, 4000]);
console.log(arr[0]); // 1000
arr[1] = 2500;
console.log(arr[1]); // 2500

// Values are clamped to 16-bit signed range (-32768 to 32767)
arr[0] = 40000; // Will overflow
console.log(arr[0]); // -25536

arr[1] = -40000; // Will overflow
console.log(arr[1]); // 25536

// Array methods
const numbers = new Int16Array([100, 200, 300, 400, 500]);
const doubled = numbers.map(x => x * 2);
const evens = numbers.filter(x => x % 2 === 0);
const sum = numbers.reduce((acc, val) => acc + val, 0);

// Buffer operations
const buffer = new ArrayBuffer(16);
const view = new Int16Array(buffer);
view[0] = 1000;
view[1] = 2000;
view[2] = 3000;
view[3] = 4000;

// Create multiple views on the same buffer
const view2 = new Int16Array(buffer, 4, 4); // Start at offset 4 bytes, length 4 elements
view2[0] = 9999; // Modifying one view affects the other
console.log(view[2]); // 9999

// Converting to regular array
const regularArray = Array.from(view);

// Audio processing example
function createAudioBuffer(length, sampleRate = 44100) {
  const buffer = new Int16Array(length);
  
  // Generate a simple sine wave
  const frequency = 440; // A4 note
  const amplitude = 16384; // Half of max 16-bit value
  
  for (let i = 0; i < length; i++) {
    const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate);
    buffer[i] = Math.round(sample * amplitude);
  }
  
  return buffer;
}

// Audio mixing example
function mixAudioBuffers(buffer1, buffer2) {
  const length = Math.max(buffer1.length, buffer2.length);
  const mixed = new Int16Array(length);
  
  for (let i = 0; i < length; i++) {
    const sample1 = buffer1[i] || 0;
    const sample2 = buffer2[i] || 0;
    // Mix samples and prevent clipping
    mixed[i] = Math.max(-32768, Math.min(32767, (sample1 + sample2) / 2));
  }
  
  return mixed;
}

// Practical example
const audioData = createAudioBuffer(4410); // 0.1 second at 44.1kHz
console.log('Audio buffer length:', audioData.length);
console.log('First sample:', audioData[0]);
console.log('Sample at 100ms:', audioData[100]);`}
      useCases={[
        "Audio processing and manipulation",
        "Digital signal processing",
        "Sound synthesis",
        "Audio file format handling",
        "Real-time audio applications",
        "Music production software",
        "Voice processing",
        "Audio streaming applications"
      ]}
    />
  );
}
