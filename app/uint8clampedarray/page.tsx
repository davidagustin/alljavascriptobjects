import ObjectPage from '../components/ObjectPage';

export default function Uint8ClampedArrayPage() {
  return (
    <ObjectPage
      title="Uint8ClampedArray"
      description="The Uint8ClampedArray typed array represents an array of 8-bit unsigned integers clamped to 0-255."
      overview="Uint8ClampedArray is a specialized TypedArray that stores 8-bit unsigned integers with automatic clamping. Unlike other TypedArrays, values are clamped (not wrapped) to the 0-255 range, making it perfect for image processing and Canvas operations."
      syntax="new Uint8ClampedArray(length | buffer | array | arrayBuffer, byteOffset?, length?)"
      useCases={[
        "Canvas ImageData pixel manipulation",
        "Image processing and computer vision",
        "Color value storage and processing",
        "Graphics programming and filters",
        "RGB/RGBA data handling",
        "Safe integer operations within 0-255 range"
      ]}
      complexity="intermediate"
      relatedObjects={["Uint8Array", "ArrayBuffer", "ImageData", "Canvas", "DataView"]}
      examples={[
        {
          id: "constructor-examples",
          title: "Complete Constructor Examples",
          description: "Demonstrates all the different ways to create Uint8ClampedArray instances and their clamping behavior",
          difficulty: "intermediate",
          tags: ["constructor", "clamping", "typed-arrays"],
          code: `// All ways to create Uint8ClampedArray
// 1. Create with specific length (initialized to 0)
const arr1 = new Uint8ClampedArray(4);
console.log(arr1); // Uint8ClampedArray [0, 0, 0, 0]

// 2. Create from regular array
const arr2 = new Uint8ClampedArray([10, 20, 30, 40]);
console.log(arr2); // Uint8ClampedArray [10, 20, 30, 40]

// 3. Create from ArrayBuffer
const buffer = new ArrayBuffer(8);
const arr3 = new Uint8ClampedArray(buffer);
console.log(arr3.length); // 8 (8 bytes / 1 byte per element)

// 4. Create from ArrayBuffer with offset and length
const arr4 = new Uint8ClampedArray(buffer, 2, 4); // Start at byte 2, length 4
console.log(arr4.length); // 4

// 5. Create from another TypedArray
const sourceArray = new Uint16Array([100, 200, 300]);
const arr5 = new Uint8ClampedArray(sourceArray);
console.log(arr5); // Uint8ClampedArray [100, 200, 255] (300 clamped to 255)

// 6. Create from iterable
const arr6 = new Uint8ClampedArray(new Set([50, 100, 150]));
console.log(arr6); // Uint8ClampedArray [50, 100, 150]

// CLAMPING demonstration (key difference from other TypedArrays)
const arr = new Uint8ClampedArray([100, 150, 200, 250]);
arr[0] = 300; // Will be CLAMPED to 255 (not wrapped)
console.log(arr[0]); // 255
arr[1] = -50; // Will be CLAMPED to 0 (not wrapped)
console.log(arr[1]); // 0
arr[2] = 128.7; // Will be rounded to 129
console.log(arr[2]); // 129
arr[3] = 128.2; // Will be rounded to 128
console.log(arr[3]); // 128`
        },
        {
          id: "canvas-imagedata",
          title: "Canvas ImageData and Pixel Manipulation",
          description: "Shows how Uint8ClampedArray is used in Canvas ImageData for pixel manipulation and common image processing operations",
          difficulty: "advanced",
          tags: ["canvas", "imagedata", "pixels", "image-processing"],
          code: `// Uint8ClampedArray is the standard for Canvas ImageData
class CanvasImageProcessor {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.data = new Uint8ClampedArray(width * height * 4); // RGBA format
    this.fillWithWhite();
  }
  
  fillWithWhite() {
    for (let i = 0; i < this.data.length; i += 4) {
      this.data[i] = 255;     // Red
      this.data[i + 1] = 255; // Green
      this.data[i + 2] = 255; // Blue
      this.data[i + 3] = 255; // Alpha
    }
  }
  
  setPixel(x, y, r, g, b, a = 255) {
    const index = (y * this.width + x) * 4;
    this.data[index] = r;
    this.data[index + 1] = g;
    this.data[index + 2] = b;
    this.data[index + 3] = a;
  }
  
  getPixel(x, y) {
    const index = (y * this.width + x) * 4;
    return {
      r: this.data[index],
      g: this.data[index + 1],
      b: this.data[index + 2],
      a: this.data[index + 3]
    };
  }
  
  adjustBrightness(factor) {
    const result = new CanvasImageProcessor(this.width, this.height);
    
    for (let i = 0; i < this.data.length; i += 4) {
      // Automatic clamping handles overflow!
      result.data[i] = this.data[i] * factor;     // Red
      result.data[i + 1] = this.data[i + 1] * factor; // Green
      result.data[i + 2] = this.data[i + 2] * factor; // Blue
      result.data[i + 3] = this.data[i + 3];     // Alpha unchanged
    }
    
    return result;
  }
  
  toGrayscale() {
    const result = new CanvasImageProcessor(this.width, this.height);
    
    for (let i = 0; i < this.data.length; i += 4) {
      // Standard luminance formula
      const gray = 0.299 * this.data[i] + 
                   0.587 * this.data[i + 1] + 
                   0.114 * this.data[i + 2];
      result.data[i] = gray;     // Automatically clamped
      result.data[i + 1] = gray;
      result.data[i + 2] = gray;
      result.data[i + 3] = this.data[i + 3];
    }
    
    return result;
  }
  
  invertColors() {
    const result = new CanvasImageProcessor(this.width, this.height);
    
    for (let i = 0; i < this.data.length; i += 4) {
      result.data[i] = 255 - this.data[i];         // Red
      result.data[i + 1] = 255 - this.data[i + 1]; // Green
      result.data[i + 2] = 255 - this.data[i + 2]; // Blue
      result.data[i + 3] = this.data[i + 3];       // Alpha unchanged
    }
    
    return result;
  }
}

// Create a 4x4 test image
const processor = new CanvasImageProcessor(4, 4);

// Set some colored pixels
processor.setPixel(0, 0, 255, 0, 0);   // Red
processor.setPixel(1, 0, 0, 255, 0);   // Green
processor.setPixel(2, 0, 0, 0, 255);   // Blue
processor.setPixel(3, 0, 255, 255, 0); // Yellow

console.log("Red pixel:", processor.getPixel(0, 0));

// Test brightness adjustment (values auto-clamped)
const brightened = processor.adjustBrightness(1.8);
console.log("Brightened red pixel:", brightened.getPixel(0, 0));

// Convert to grayscale
const grayscale = processor.toGrayscale();
console.log("Grayscale red pixel:", grayscale.getPixel(0, 0));

// Invert colors
const inverted = processor.invertColors();
console.log("Inverted red pixel:", inverted.getPixel(0, 0));`
        },
        {
          id: "image-filters",
          title: "Advanced Image Processing Filters",
          description: "Implements advanced image processing filters like sepia, blur, edge detection, and contrast adjustment using automatic clamping",
          difficulty: "advanced",
          tags: ["image-processing", "filters", "sepia", "blur", "edge-detection"],
          code: `// Advanced image processing filters with automatic clamping
class ImageFilter {
  static applySepia(imageData) {
    const result = new Uint8ClampedArray(imageData.length);
    
    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      
      // Sepia transformation matrix
      result[i] = (r * 0.393) + (g * 0.769) + (b * 0.189);     // Auto-clamped
      result[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168); // Auto-clamped
      result[i + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131); // Auto-clamped
      result[i + 3] = imageData[i + 3]; // Alpha unchanged
    }
    
    return result;
  }
  
  static applyBlur(imageData, width, height, radius = 1) {
    const result = new Uint8ClampedArray(imageData.length);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        let r = 0, g = 0, b = 0, count = 0;
        
        // Sample surrounding pixels
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const neighborIndex = (ny * width + nx) * 4;
              r += imageData[neighborIndex];
              g += imageData[neighborIndex + 1];
              b += imageData[neighborIndex + 2];
              count++;
            }
          }
        }
        
        result[index] = r / count;     // Auto-clamped
        result[index + 1] = g / count; // Auto-clamped
        result[index + 2] = b / count; // Auto-clamped
        result[index + 3] = imageData[index + 3];
      }
    }
    
    return result;
  }
  
  static edgeDetection(imageData, width, height) {
    const result = new Uint8ClampedArray(imageData.length);
    
    // Sobel operator kernels
    const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const index = (y * width + x) * 4;
        let gx = 0, gy = 0;
        
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const neighborIndex = ((y + dy) * width + (x + dx)) * 4;
            const gray = 0.299 * imageData[neighborIndex] + 
                         0.587 * imageData[neighborIndex + 1] + 
                         0.114 * imageData[neighborIndex + 2];
            
            const kernelIndex = (dy + 1) * 3 + (dx + 1);
            gx += gray * sobelX[kernelIndex];
            gy += gray * sobelY[kernelIndex];
          }
        }
        
        const magnitude = Math.sqrt(gx * gx + gy * gy);
        result[index] = magnitude;     // Auto-clamped
        result[index + 1] = magnitude; // Auto-clamped
        result[index + 2] = magnitude; // Auto-clamped
        result[index + 3] = 255;
      }
    }
    
    return result;
  }
  
  static adjustContrast(imageData, contrast) {
    const result = new Uint8ClampedArray(imageData.length);
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    
    for (let i = 0; i < imageData.length; i += 4) {
      result[i] = factor * (imageData[i] - 128) + 128;         // Auto-clamped
      result[i + 1] = factor * (imageData[i + 1] - 128) + 128; // Auto-clamped
      result[i + 2] = factor * (imageData[i + 2] - 128) + 128; // Auto-clamped
      result[i + 3] = imageData[i + 3];
    }
    
    return result;
  }
}

// Create test image with gradient
const testImage = new Uint8ClampedArray(16 * 4); // 4x4 image
for (let i = 0; i < 16; i++) {
  const pixelIndex = i * 4;
  const intensity = (i / 15) * 255;
  testImage[pixelIndex] = intensity;     // Red
  testImage[pixelIndex + 1] = intensity; // Green
  testImage[pixelIndex + 2] = intensity; // Blue
  testImage[pixelIndex + 3] = 255;       // Alpha
}

// Apply filters
const sepiaImage = ImageFilter.applySepia(testImage);
const blurredImage = ImageFilter.applyBlur(testImage, 4, 4);
const edgeImage = ImageFilter.edgeDetection(testImage, 4, 4);
const contrastImage = ImageFilter.adjustContrast(testImage, 50);

console.log("Original pixel 0:", testImage.slice(0, 4));
console.log("Sepia pixel 0:", sepiaImage.slice(0, 4));
console.log("Blurred pixel 0:", blurredImage.slice(0, 4));`
        }
      ]}
    />
  );
}