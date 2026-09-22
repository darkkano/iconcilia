import { Document } from '../../domain/entities/document.js';
import type { DocumentRepositoryPort } from '../../domain/ports/document-repository.port.js';
export declare class InMemoryDocumentRepository implements DocumentRepositoryPort {
    private readonly store;
    save(doc: Document): Promise<void>;
    findById(id: string): Promise<Document | null>;
    list(): Promise<Document[]>;
}
