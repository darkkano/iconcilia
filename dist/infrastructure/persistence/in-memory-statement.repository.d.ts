import { BankStatement } from '../../domain/entities/bank-statement.js';
import type { StatementRepositoryPort } from '../../domain/ports/statement-repository.port.js';
export declare class InMemoryStatementRepository implements StatementRepositoryPort {
    private readonly store;
    save(statement: BankStatement): Promise<void>;
    findById(id: string): Promise<BankStatement | null>;
    findByDocumentId(documentId: string): Promise<BankStatement | null>;
    list(): Promise<BankStatement[]>;
}
