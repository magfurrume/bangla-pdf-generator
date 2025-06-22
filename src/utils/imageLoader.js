// src/utils/imageLoader.js
import fs from 'fs/promises';
import path from 'path';
import { Buffer } from 'buffer';

export class ImageLoader {
  static async load(source) {
    // Handle Buffer input
    if (source instanceof Uint8Array || Buffer.isBuffer(source)) {
      return this.bufferToDataURL(source);
    }

    // Handle string input
    if (typeof source === 'string') {
      // Already a data URL
      if (source.startsWith('data:')) return source;
      
      // Convert to absolute path and then to Base64
      return this.loadFromFile(source);
    }

    throw new Error('Unsupported image source type');
  }

  static async loadFromFile(filePath) {
    try {
      const absolutePath = path.resolve(filePath);
      const data = await fs.readFile(absolutePath);
      const ext = path.extname(filePath).slice(1).toLowerCase() || 'png';
      return `data:image/${ext};base64,${data.toString('base64')}`;
    } catch (error) {
      throw new Error(`Image load failed: ${error.message}`);
    }
  }

  static bufferToDataURL(buffer) {
    return `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`;
  }
}