import { Document } from '../entities/document.js';
export interface DocumentRepositoryPort {
    save(doc: Document): Promise<void>;
    findById(id: string): Promise<Document | null>;
    list(): Promise<Document[]>;
}
