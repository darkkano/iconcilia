import { Injectable } from '@nestjs/common';
import type { EmbedderPort } from '../../domain/ports/embedder.port.js';

const DIM = 24;

/**
 * ADAPTER driven — embedding local (hash de tokens).
 * Mañana: text-embedding-3 / modelo ONNX. El use case no cambia.
 */
@Injectable()
export class HashEmbedderAdapter implements EmbedderPort {
  async embed(text: string): Promise<number[]> {
    const v = Array.from({ length: DIM }, () => 0);
    const tokens = text.toLowerCase().split(/\W+/).filter(Boolean);
    for (const token of tokens) {
      let h = 0;
      for (let i = 0; i < token.length; i++) {
        h = (h * 31 + token.charCodeAt(i)) >>> 0;
      }
      v[h % DIM] += 1;
    }
    const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
    return v.map((x) => x / norm);
  }
}
