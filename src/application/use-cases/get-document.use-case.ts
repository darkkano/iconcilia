import { Inject, Injectable } from '@nestjs/common';
import { BankStatement } from '../../domain/entities/bank-statement.js';
import { Document } from '../../domain/entities/document.js';
import { Chunk } from '../../domain/entities/chunk.js';
import {
  DocumentNotFoundError,
  StatementNotFoundError,
} from '../../domain/errors/document.errors.js';
import type { DocumentRepositoryPort } from '../../domain/ports/document-repository.port.js';
import type { StatementRepositoryPort } from '../../domain/ports/statement-repository.port.js';
import type { VectorStorePort } from '../../domain/ports/vector-store.port.js';
import {
  DOCUMENT_REPO,
  STATEMENT_REPO,
  VECTOR_STORE,
} from '../../domain/ports/tokens.js';

@Injectable()
export class GetDocumentUseCase {
  constructor(
    @Inject(DOCUMENT_REPO) private readonly docs: DocumentRepositoryPort,
  ) {}

  async execute(id: string): Promise<Document> {
    const doc = await this.docs.findById(id);
    if (!doc) throw new DocumentNotFoundError(id);
    return doc;
  }
}

@Injectable()
export class ListDocumentsUseCase {
  constructor(
    @Inject(DOCUMENT_REPO) private readonly docs: DocumentRepositoryPort,
  ) {}

  execute(): Promise<Document[]> {
    return this.docs.list();
  }
}

@Injectable()
export class GetStatementUseCase {
  constructor(
    @Inject(STATEMENT_REPO) private readonly statements: StatementRepositoryPort,
  ) {}

  async execute(id: string): Promise<BankStatement> {
    const row = await this.statements.findById(id);
    if (!row) throw new StatementNotFoundError(id);
    return row;
  }
}

@Injectable()
export class ListStatementsUseCase {
  constructor(
    @Inject(STATEMENT_REPO) private readonly statements: StatementRepositoryPort,
  ) {}

  execute(): Promise<BankStatement[]> {
    return this.statements.list();
  }
}

@Injectable()
export class ListChunksUseCase {
  constructor(
    @Inject(VECTOR_STORE) private readonly vectors: VectorStorePort,
  ) {}

  execute(documentId: string): Promise<Chunk[]> {
    return this.vectors.listByDocument(documentId);
  }
}
