import { Chunk } from '../entities/chunk.js';
import { StatementCandidate } from '../statement-schema.js';

/**
 * PUERTO driven — generación del JSON (RAG: chunks recuperados + prompt).
 * El dominio NUNCA guarda este JSON sin pasar por validateStatement().
 */
export interface ExtractorPort {
  extract(input: { rawText: string; chunks: Chunk[] }): Promise<StatementCandidate>;
}
