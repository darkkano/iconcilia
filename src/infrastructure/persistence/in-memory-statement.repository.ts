import { Injectable } from '@nestjs/common';
import { BankStatement } from '../../domain/entities/bank-statement.js';
import type { StatementRepositoryPort } from '../../domain/ports/statement-repository.port.js';

/** ADAPTER driven — tabla relacional en RAM. Mañana: PostgreSQL. */
@Injectable()
export class InMemoryStatementRepository implements StatementRepositoryPort {
  private readonly store = new Map<string, BankStatement>();

  async save(statement: BankStatement): Promise<void> {
    this.store.set(statement.id, statement);
  }

  async findById(id: string): Promise<BankStatement | null> {
    return this.store.get(id) ?? null;
  }

  async findByDocumentId(documentId: string): Promise<BankStatement | null> {
    return [...this.store.values()].find((s) => s.documentId === documentId) ?? null;
  }

  async list(): Promise<BankStatement[]> {
    return [...this.store.values()].reverse();
  }
}
