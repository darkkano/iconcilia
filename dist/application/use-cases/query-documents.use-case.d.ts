import type { EmbedderPort } from '../../domain/ports/embedder.port.js';
import type { VectorStorePort } from '../../domain/ports/vector-store.port.js';
export interface RagAnswer {
    question: string;
    answer: string;
    hits: Array<{
        documentId: string;
        chunkIndex: number;
        score: number;
        text: string;
    }>;
}
export declare class QueryDocumentsUseCase {
    private readonly embedder;
    private readonly vectors;
    private readonly logger;
    constructor(embedder: EmbedderPort, vectors: VectorStorePort);
    execute(question: string): Promise<RagAnswer>;
}
