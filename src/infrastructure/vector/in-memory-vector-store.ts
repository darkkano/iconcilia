import { Injectable } from '@nestjs/common';
import { Chunk } from '../../domain/entities/chunk.js';
import type { VectorHit, VectorStorePort } from '../../domain/ports/vector-store.port.js';

/**
 * ADAPTER driven — pgvector simulado (cosine similarity en RAM).
 * Mañana: PostgreSQL `embedding vector(24)` + `ORDER BY embedding <=> $1`.
 */
@Injectable()
export class InMemoryVectorStore implements VectorStorePort {
  private readonly chunks: Chunk[] = [];

  async upsert(chunks: Chunk[]): Promise<void> {
    for (const chunk of chunks) {
      const i = this.chunks.findIndex((c) => c.id === chunk.id);
      if (i >= 0) this.chunks[i] = chunk;
      else this.chunks.push(chunk);
    }
  }

  async search(
    embedding: number[],
    topK: number,
    documentId?: string,
  ): Promise<VectorHit[]> {
    const pool = documentId
      ? this.chunks.filter((c) => c.documentId === documentId)
      : this.chunks;
    return pool
      .map((chunk) => ({ chunk, score: cosine(embedding, chunk.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  async listByDocument(documentId: string): Promise<Chunk[]> {
    return this.chunks
      .filter((c) => c.documentId === documentId)
      .sort((a, b) => a.index - b.index);
  }
}

function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const d = Math.sqrt(na) * Math.sqrt(nb);
  return d === 0 ? 0 : dot / d;
}
