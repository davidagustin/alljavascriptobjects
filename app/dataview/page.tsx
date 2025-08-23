import ObjectPage from '../components/ObjectPage'

export default function DataViewPage() {
  return (
    <ObjectPage
      title="DataView"
      description="Provides a low-level interface for reading and writing multiple number types in a binary ArrayBuffer"
      overview="The DataView object provides a low-level interface for reading and writing multiple number types in a binary ArrayBuffer, without having to care about the platform's endianness."
      syntax={`// ============ CONSTRUCTOR ============
// 1. Basic DataView constructor
const buffer1 = new ArrayBuffer(24);
const view1 = new DataView(buffer1);
console.log('Buffer byteLength:', view1.byteLength); // 24

// 2. DataView with offset
const buffer2 = new ArrayBuffer(32);
const view2 = new DataView(buffer2, 8); // Start at byte 8
console.log('View with offset:', view2.byteOffset); // 8

// 3. DataView with offset and length
const buffer3 = new ArrayBuffer(64);
const view3 = new DataView(buffer3, 16, 24); // 24 bytes starting at 16
console.log('Offset:', view3.byteOffset, 'Length:', view3.byteLength); // 16, 24

// ============ PROPERTIES ============
const buffer = new ArrayBuffer(256);
const view = new DataView(buffer, 32, 128);

console.log('buffer:', view.buffer); // ArrayBuffer(256)
console.log('byteLength:', view.byteLength); // 128
console.log('byteOffset:', view.byteOffset); // 32

// ============ GET METHODS (Reading) ============
const readBuffer = new ArrayBuffer(64);
const readView = new DataView(readBuffer);

// First, set some test data
readView.setUint8(0, 255);
readView.setInt8(1, -128);
readView.setUint16(2, 65535, true); // little-endian
readView.setInt16(4, -32768, false); // big-endian
readView.setUint32(6, 4294967295, true);
readView.setInt32(10, -2147483648, false);
readView.setFloat32(14, Math.PI, true);
readView.setFloat64(18, Math.E, false);
readView.setBigInt64(26, 9007199254740991n, true);
readView.setBigUint64(34, 18446744073709551615n, false);

// getInt8() - signed 8-bit integer
console.log('getInt8(1):', readView.getInt8(1)); // -128

// getUint8() - unsigned 8-bit integer
console.log('getUint8(0):', readView.getUint8(0)); // 255

// getInt16() - signed 16-bit integer
console.log('getInt16(4, false):', readView.getInt16(4, false)); // -32768 (big-endian)
console.log('getInt16(4, true):', readView.getInt16(4, true)); // Different value (little-endian)

// getUint16() - unsigned 16-bit integer
console.log('getUint16(2, true):', readView.getUint16(2, true)); // 65535 (little-endian)
console.log('getUint16(2, false):', readView.getUint16(2, false)); // Different value (big-endian)

// getInt32() - signed 32-bit integer
console.log('getInt32(10, false):', readView.getInt32(10, false)); // -2147483648 (big-endian)

// getUint32() - unsigned 32-bit integer
console.log('getUint32(6, true):', readView.getUint32(6, true)); // 4294967295 (little-endian)

// getFloat32() - 32-bit float
console.log('getFloat32(14, true):', readView.getFloat32(14, true)); // ~3.14159 (little-endian)

// getFloat64() - 64-bit float
console.log('getFloat64(18, false):', readView.getFloat64(18, false)); // ~2.71828 (big-endian)

// getBigInt64() - signed 64-bit BigInt
console.log('getBigInt64(26, true):', readView.getBigInt64(26, true)); // 9007199254740991n

// getBigUint64() - unsigned 64-bit BigInt
console.log('getBigUint64(34, false):', readView.getBigUint64(34, false)); // 18446744073709551615n

// ============ SET METHODS (Writing) ============
const writeBuffer = new ArrayBuffer(128);
const writeView = new DataView(writeBuffer);

// setInt8() - signed 8-bit integer
writeView.setInt8(0, -42);
console.log('Written int8:', writeView.getInt8(0)); // -42

// setUint8() - unsigned 8-bit integer
writeView.setUint8(1, 200);
console.log('Written uint8:', writeView.getUint8(1)); // 200

// setInt16() - signed 16-bit integer
writeView.setInt16(2, -12345, true); // little-endian
writeView.setInt16(4, -12345, false); // big-endian
console.log('Written int16 LE:', writeView.getInt16(2, true)); // -12345
console.log('Written int16 BE:', writeView.getInt16(4, false)); // -12345

// setUint16() - unsigned 16-bit integer
writeView.setUint16(6, 50000, true); // little-endian
writeView.setUint16(8, 50000, false); // big-endian
console.log('Written uint16:', writeView.getUint16(6, true)); // 50000

// setInt32() - signed 32-bit integer
writeView.setInt32(10, -1234567890, true); // little-endian
writeView.setInt32(14, -1234567890, false); // big-endian
console.log('Written int32:', writeView.getInt32(10, true)); // -1234567890

// setUint32() - unsigned 32-bit integer
writeView.setUint32(18, 3000000000, true); // little-endian
writeView.setUint32(22, 3000000000, false); // big-endian
console.log('Written uint32:', writeView.getUint32(18, true)); // 3000000000

// setFloat32() - 32-bit float
writeView.setFloat32(26, Math.SQRT2, true); // little-endian
writeView.setFloat32(30, Math.LOG10E, false); // big-endian
console.log('Written float32:', writeView.getFloat32(26, true)); // ~1.41421

// setFloat64() - 64-bit float
writeView.setFloat64(34, Number.MAX_VALUE, true); // little-endian
writeView.setFloat64(42, Number.MIN_VALUE, false); // big-endian
console.log('Written float64:', writeView.getFloat64(34, true)); // 1.7976931348623157e+308

// setBigInt64() - signed 64-bit BigInt
writeView.setBigInt64(50, -9223372036854775808n, true); // Min BigInt64
writeView.setBigInt64(58, 9223372036854775807n, false); // Max BigInt64
console.log('Written BigInt64:', writeView.getBigInt64(50, true)); // -9223372036854775808n

// setBigUint64() - unsigned 64-bit BigInt
writeView.setBigUint64(66, 0n, true); // Min BigUint64
writeView.setBigUint64(74, 18446744073709551615n, false); // Max BigUint64
console.log('Written BigUint64:', writeView.getBigUint64(74, false)); // 18446744073709551615n

// ============ ENDIANNESS DEMONSTRATION ============
const endianBuffer = new ArrayBuffer(4);
const endianView = new DataView(endianBuffer);

// Write the same value with different endianness
const value = 0x12345678;
endianView.setUint32(0, value, true); // little-endian

// Read individual bytes to see the difference
console.log('Little-endian bytes:');
for (let i = 0; i < 4; i++) {
  console.log(\`Byte \${i}: 0x\${endianView.getUint8(i).toString(16).padStart(2, '0')}\`);
}
// Output: 0x78, 0x56, 0x34, 0x12 (reversed)

endianView.setUint32(0, value, false); // big-endian
console.log('Big-endian bytes:');
for (let i = 0; i < 4; i++) {
  console.log(\`Byte \${i}: 0x\${endianView.getUint8(i).toString(16).padStart(2, '0')}\`);
}
// Output: 0x12, 0x34, 0x56, 0x78 (normal order)

// ============ PRACTICAL EXAMPLES ============
// 1. Creating a binary message format
function createMessage(id, timestamp, data) {
  const buffer = new ArrayBuffer(16 + data.length);
  const view = new DataView(buffer);
  
  view.setUint32(0, id, false); // 4 bytes: Message ID
  view.setBigUint64(4, BigInt(timestamp), false); // 8 bytes: Timestamp
  view.setUint32(12, data.length, false); // 4 bytes: Data length
  
  // Write string data
  for (let i = 0; i < data.length; i++) {
    view.setUint8(16 + i, data.charCodeAt(i));
  }
  
  return buffer;
}

const msg = createMessage(42, Date.now(), "Hello");
const msgView = new DataView(msg);
console.log('Message ID:', msgView.getUint32(0, false)); // 42
console.log('Timestamp:', msgView.getBigUint64(4, false));
console.log('Data length:', msgView.getUint32(12, false)); // 5

// 2. Reading a binary structure
function readStruct(buffer) {
  const view = new DataView(buffer);
  return {
    magic: view.getUint32(0, false), // 4 bytes
    version: view.getUint16(4, false), // 2 bytes
    flags: view.getUint8(6), // 1 byte
    reserved: view.getUint8(7), // 1 byte
    payload: view.getFloat64(8, false) // 8 bytes
  };
}

// 3. Color manipulation (RGBA)
function packRGBA(r, g, b, a) {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setUint8(0, r);
  view.setUint8(1, g);
  view.setUint8(2, b);
  view.setUint8(3, a);
  return view.getUint32(0, false);
}

function unpackRGBA(packed) {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setUint32(0, packed, false);
  return {
    r: view.getUint8(0),
    g: view.getUint8(1),
    b: view.getUint8(2),
    a: view.getUint8(3)
  };
}

const packed = packRGBA(255, 128, 64, 255);
console.log('Packed color:', packed.toString(16)); // ff8040ff
console.log('Unpacked:', unpackRGBA(packed)); // {r: 255, g: 128, b: 64, a: 255}

// ============ WORKING WITH TYPED ARRAYS ============
const mixedBuffer = new ArrayBuffer(32);
const mixedView = new DataView(mixedBuffer);
const floatArray = new Float32Array(mixedBuffer, 0, 4);
const intArray = new Int32Array(mixedBuffer, 16, 4);

// Write through TypedArray
floatArray[0] = Math.PI;
floatArray[1] = Math.E;

// Read through DataView
console.log('Float via DataView:', mixedView.getFloat32(0, true)); // PI
console.log('Float via DataView:', mixedView.getFloat32(4, true)); // E

// Write through DataView
mixedView.setInt32(16, 42, true);
mixedView.setInt32(20, -42, true);

// Read through TypedArray
console.log('Int via TypedArray:', intArray[0]); // 42
console.log('Int via TypedArray:', intArray[1]); // -42`}
      useCases={[
        "Reading binary file formats",
        "Network protocol implementation",
        "Cross-platform data serialization",
        "Working with mixed-type binary data structures"
      ]}
    />
  )
}