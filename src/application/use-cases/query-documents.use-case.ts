import { Inject, Injectable, Logger } from '@nestjs/common';
import type { EmbedderPort } from '../../domain/ports/embedder.port.js';
import type { VectorHit, VectorStorePort } from '../../domain/ports/vector-store.port.js';
import { EMBEDDER, VECTOR_STORE } from '../../domain/ports/tokens.js';

export interface RagAnswer {
  question: string;
  answer: string;
  hits: Array<{ documentId: string; chunkIndex: number; score: number; text: string }>;
}

/**
 * CAPA: Application — pregunta sobre documentos ya indexados (solo retrieve).
 * No escribe en la tabla relacional.
 */
@Injectable()
export class QueryDocumentsUseCase {
  private readonly logger = new Logger(QueryDocumentsUseCase.name);

  constructor(
    @Inject(EMBEDDER) private readonly embedder: EmbedderPort,
    @Inject(VECTOR_STORE) private readonly vectors: VectorStorePort,
  ) {}

  async execute(question: string): Promise<RagAnswer> {
    this.logger.log(`RAG query="${question}"`);
    const vec = await this.embedder.embed(question);
    const hits: VectorHit[] = await this.vectors.search(vec, 5);
    const context = hits.map((h) => h.chunk.text).join('\n---\n');
    const answer =
      hits.length === 0
        ? 'No hay documentos indexados que coincidan.'
        : `Contexto recuperado (${hits.length} chunks):\n${context}`;
    return {
      question,
      answer,
      hits: hits.map((h) => ({
        documentId: h.chunk.documentId,
        chunkIndex: h.chunk.index,
        score: Number(h.score.toFixed(4)),
        text: h.chunk.text,
      })),
    };
  }
}
