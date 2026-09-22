import { BankStatement } from '../../domain/entities/bank-statement.js';
import { Document } from '../../domain/entities/document.js';
import { Chunk } from '../../domain/entities/chunk.js';
import type { DocumentRepositoryPort } from '../../domain/ports/document-repository.port.js';
import type { StatementRepositoryPort } from '../../domain/ports/statement-repository.port.js';
import type { VectorStorePort } from '../../domain/ports/vector-store.port.js';
export declare class GetDocumentUseCase {
    private readonly docs;
    constructor(docs: DocumentRepositoryPort);
    execute(id: string): Promise<Document>;
}
export declare class ListDocumentsUseCase {
    private readonly docs;
    constructor(docs: DocumentRepositoryPort);
    execute(): Promise<Document[]>;
}
export declare class GetStatementUseCase {
    private readonly statements;
    constructor(statements: StatementRepositoryPort);
    execute(id: string): Promise<BankStatement>;
}
export declare class ListStatementsUseCase {
    private readonly statements;
    constructor(statements: StatementRepositoryPort);
    execute(): Promise<BankStatement[]>;
}
export declare class ListChunksUseCase {
    private readonly vectors;
    constructor(vectors: VectorStorePort);
    execute(documentId: string): Promise<Chunk[]>;
}
