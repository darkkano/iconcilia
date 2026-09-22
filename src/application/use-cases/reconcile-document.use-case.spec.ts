import { ReconcileDocumentUseCase } from './reconcile-document.use-case.js';
import { ReconcileDocumentInput } from '../dto/reconcile-document.input.js';
import { Document } from '../../domain/entities/document.js';
import { BankStatement } from '../../domain/entities/bank-statement.js';
import type { DocumentReaderPort } from '../../domain/ports/document-reader.port.js';
import type { DocumentRepositoryPort } from '../../domain/ports/document-repository.port.js';
import type { EmbedderPort } from '../../domain/ports/embedder.port.js';
import type { ExtractorPort } from '../../domain/ports/extractor.port.js';
import type { StatementRepositoryPort } from '../../domain/ports/statement-repository.port.js';
import type { VectorStorePort } from '../../domain/ports/vector-store.port.js';
import { Chunk } from '../../domain/entities/chunk.js';

function build(extract: ExtractorPort['extract']) {
  const docs: Document[] = [];
  const statements: BankStatement[] = [];
  const reader: DocumentReaderPort = {
    read: async ({ rawText }) => ({ text: rawText, pages: 1, note: 'test' }),
  };
  const documents: DocumentRepositoryPort = {
    save: async (d) => {
      const i = docs.findIndex((x) => x.id === d.id);
      if (i >= 0) docs[i] = d;
      else docs.push(d);
    },
    findById: async (id) => docs.find((d) => d.id === id) ?? null,
    list: async () => docs,
  };
  const embedder: EmbedderPort = {
    embed: async () => [1, 0, 0],
  };
  const vectors: VectorStorePort = {
    upsert: async () => undefined,
    search: async () => [
      {
        chunk: new Chunk('c1', 'd1', 0, 'chunk', [1, 0, 0]),
        score: 1,
      },
    ],
    listByDocument: async () => [],
  };
  const extractor: ExtractorPort = { extract };
  const statementRepo: StatementRepositoryPort = {
    save: async (s) => {
      statements.push(s);
    },
    findById: async () => null,
    findByDocumentId: async () => null,
    list: async () => statements,
  };

  return {
    docs,
    statements,
    useCase: new ReconcileDocumentUseCase(
      reader,
      documents,
      embedder,
      vectors,
      extractor,
      statementRepo,
    ),
  };
}

const goodJson = {
  bank: 'BNC',
  accountLast4: '4521',
  periodFrom: '2026-03-01',
  periodTo: '2026-03-31',
  currency: 'USD',
  movements: [
    { date: '2026-03-01', description: 'X', amount: -10, type: 'debit' as const },
  ],
};

describe('ReconcileDocumentUseCase', () => {
  it('JSON válido → reconciled y se guarda en relacional', async () => {
    const { useCase, statements } = build(async () => goodJson);
    const result = await useCase.execute(
      new ReconcileDocumentInput('a.pdf', 'pdf', 'BANCO BNC\n****4521'),
    );
    expect(result.document.status).toBe('reconciled');
    expect(result.statement).toBeTruthy();
    expect(statements).toHaveLength(1);
  });

  it('JSON inválido → rejected y NO hay fila relacional', async () => {
    const { useCase, statements } = build(async () => ({ bank: '' }));
    const result = await useCase.execute(
      new ReconcileDocumentInput('b.pdf', 'pdf', 'texto basura hola'),
    );
    expect(result.document.status).toBe('rejected');
    expect(result.statement).toBeNull();
    expect(statements).toHaveLength(0);
    expect(result.document.rejectionIssues.length).toBeGreaterThan(0);
  });
});
