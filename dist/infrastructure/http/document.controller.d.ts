import { GetDocumentUseCase, ListChunksUseCase, ListDocumentsUseCase } from '../../application/use-cases/get-document.use-case.js';
import { ReconcileDocumentUseCase } from '../../application/use-cases/reconcile-document.use-case.js';
import { DocumentKind } from '../../domain/entities/document.js';
export declare class DocumentController {
    private readonly reconcile;
    private readonly getOne;
    private readonly list;
    private readonly chunks;
    constructor(reconcile: ReconcileDocumentUseCase, getOne: GetDocumentUseCase, list: ListDocumentsUseCase, chunks: ListChunksUseCase);
    create(body: {
        filename?: string;
        kind?: string;
        rawText?: string;
    }): Promise<{
        document: {
            id: string;
            filename: string;
            kind: DocumentKind;
            status: import("../../domain/entities/document.js").DocumentStatus;
            createdAt: string;
            statementId: string | null;
            rejectionIssues: string[];
        };
        statement: {
            id: string;
            documentId: string;
            bank: string;
            accountLast4: string;
            periodFrom: string;
            periodTo: string;
            currency: string;
            movements: {
                date: string;
                description: string;
                amount: number;
                type: import("../../domain/entities/bank-statement.js").MovementType;
            }[];
        } | null;
        retrievedChunkIds: string[];
    }>;
    findAll(): Promise<{
        id: string;
        filename: string;
        kind: DocumentKind;
        status: import("../../domain/entities/document.js").DocumentStatus;
        createdAt: string;
        statementId: string | null;
        rejectionIssues: string[];
    }[]>;
    findChunks(id: string): Promise<{
        id: string;
        index: number;
        text: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        filename: string;
        kind: DocumentKind;
        status: import("../../domain/entities/document.js").DocumentStatus;
        createdAt: string;
        statementId: string | null;
        rejectionIssues: string[];
    }>;
}
