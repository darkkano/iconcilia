import { Chunk } from '../../domain/entities/chunk.js';
import type { VectorHit, VectorStorePort } from '../../domain/ports/vector-store.port.js';
export declare class InMemoryVectorStore implements VectorStorePort {
    private readonly chunks;
    upsert(chunks: Chunk[]): Promise<void>;
    search(embedding: number[], topK: number, documentId?: string): Promise<VectorHit[]>;
    listByDocument(documentId: string): Promise<Chunk[]>;
}
