import { BankStatement } from '../entities/bank-statement.js';
export interface StatementRepositoryPort {
    save(statement: BankStatement): Promise<void>;
    findById(id: string): Promise<BankStatement | null>;
    findByDocumentId(documentId: string): Promise<BankStatement | null>;
    list(): Promise<BankStatement[]>;
}
