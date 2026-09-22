import type { EmbedderPort } from '../../domain/ports/embedder.port.js';
export declare class HashEmbedderAdapter implements EmbedderPort {
    embed(text: string): Promise<number[]>;
}
