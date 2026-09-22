import { BankStatement } from '../../domain/entities/bank-statement.js';
import { Document } from '../../domain/entities/document.js';
import type { DocumentReaderPort } from '../../domain/ports/document-reader.port.js';
import type { DocumentRepositoryPort } from '../../domain/ports/document-repository.port.js';
import type { EmbedderPort } from '../../domain/ports/embedder.port.js';
import type { ExtractorPort } from '../../domain/ports/extractor.port.js';
import type { StatementRepositoryPort } from '../../domain/ports/statement-repository.port.js';
import type { VectorStorePort } from '../../domain/ports/vector-store.port.js';
import { ReconcileDocumentInput } from '../dto/reconcile-document.input.js';
export interface ReconcileResult {
    document: Document;
    statement: BankStatement | null;
    retrievedChunkIds: string[];
}
export declare class ReconcileDocumentUseCase {
    private readonly reader;
    private readonly documents;
    private readonly embedder;
    private readonly vectors;
    private readonly extractor;
    private readonly statements;
    private readonly logger;
    constructor(reader: DocumentReaderPort, documents: DocumentRepositoryPort, embedder: EmbedderPort, vectors: VectorStorePort, extractor: ExtractorPort, statements: StatementRepositoryPort);
    execute(input: ReconcileDocumentInput): Promise<ReconcileResult>;
}
