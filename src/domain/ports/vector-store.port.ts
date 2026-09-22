import { Chunk } from '../entities/chunk.js';

export interface VectorHit {
  chunk: Chunk;
  score: number;
}

/**
 * PUERTO driven — pgvector simulado.
 * upsert chunks + búsqueda por similitud de embedding.
 */
export interface VectorStorePort {
  upsert(chunks: Chunk[]): Promise<void>;
  search(embedding: number[], topK: number, documentId?: string): Promise<VectorHit[]>;
  listByDocument(documentId: string): Promise<Chunk[]>;
}
