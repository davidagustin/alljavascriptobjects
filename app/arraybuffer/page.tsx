import ObjectPage from '../components/ObjectPage'

export default function ArrayBufferPage() {
  return (
    <ObjectPage
      title="ArrayBuffer"
      description="Represents a fixed-length raw binary data buffer"
      overview="The ArrayBuffer object represents a fixed-length raw binary data buffer. It cannot be read or written to directly."
      syntax={`// Creating ArrayBuffer
const buffer = new ArrayBuffer(16);
console.log(buffer.byteLength); // 16

// Using DataView to access buffer
const view = new DataView(buffer);
view.setInt32(0, 42);
console.log(view.getInt32(0)); // 42

// Using TypedArray
const intArray = new Int32Array(buffer);
intArray[0] = 100;
console.log(intArray[0]); // 100`}
      useCases={[
        "Binary data handling",
        "File and network data processing",
        "WebGL and Web Audio APIs",
        "Low-level memory operations"
      ]}
    />
  )
}
