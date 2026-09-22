import { randomUUID } from 'node:crypto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { chunkText } from '../../domain/chunker.js';
import { BankStatement } from '../../domain/entities/bank-statement.js';
import { Chunk } from '../../domain/entities/chunk.js';
import { Document } from '../../domain/entities/document.js';
import { EmptyDocumentError } from '../../domain/errors/document.errors.js';
import type { DocumentReaderPort } from '../../domain/ports/document-reader.port.js';
import type { DocumentRepositoryPort } from '../../domain/ports/document-repository.port.js';
import type { EmbedderPort } from '../../domain/ports/embedder.port.js';
import type { ExtractorPort } from '../../domain/ports/extractor.port.js';
import type { StatementRepositoryPort } from '../../domain/ports/statement-repository.port.js';
import type { VectorStorePort } from '../../domain/ports/vector-store.port.js';
import {
  DOCUMENT_READER,
  DOCUMENT_REPO,
  EMBEDDER,
  EXTRACTOR,
  STATEMENT_REPO,
  VECTOR_STORE,
} from '../../domain/ports/tokens.js';
import { validateStatement } from '../../domain/statement-schema.js';
import { ReconcileDocumentInput } from '../dto/reconcile-document.input.js';

export interface ReconcileResult {
  document: Document;
  statement: BankStatement | null;
  retrievedChunkIds: string[];
}

/**
 * CAPA: Application — pipeline RAG de conciliación
 *
 * ALGORITMO (el orden importa):
 *   1. Reader "visión"        → texto
 *   2. Guardar Document       → received
 *   3. Chunk + embed          → VectorStore (pgvector sim)
 *   4. Indexed
 *   5. Retrieve top-k         → contexto RAG
 *   6. Extractor              → JSON candidato
 *   7. validateStatement()    → schema estricto (dominio)
 *   8. OK  → tabla relacional (Statement) + reconciled
 *      MAL → rejected, NADA se guarda en relacional
 */
@Injectable()
export class ReconcileDocumentUseCase {
  private readonly logger = new Logger(ReconcileDocumentUseCase.name);

  constructor(
    @Inject(DOCUMENT_READER) private readonly reader: DocumentReaderPort,
    @Inject(DOCUMENT_REPO) private readonly documents: DocumentRepositoryPort,
    @Inject(EMBEDDER) private readonly embedder: EmbedderPort,
    @Inject(VECTOR_STORE) private readonly vectors: VectorStorePort,
    @Inject(EXTRACTOR) private readonly extractor: ExtractorPort,
    @Inject(STATEMENT_REPO) private readonly statements: StatementRepositoryPort,
  ) {}

  async execute(input: ReconcileDocumentInput): Promise<ReconcileResult> {
    this.logger.log(`[1] Leer ${input.kind} "${input.filename}"`);
    const read = await this.reader.read({
      filename: input.filename,
      kind: input.kind,
      rawText: input.rawText,
    });
    if (!read.text.trim()) throw new EmptyDocumentError();

    const doc = new Document(
      randomUUID(),
      input.filename,
      input.kind,
      read.text,
      new Date().toISOString(),
    );
    await this.documents.save(doc);
    this.logger.log(`[2] Document ${doc.id} received`);

    const parts = chunkText(read.text);
    const chunks: Chunk[] = [];
    for (let i = 0; i < parts.length; i++) {
      const embedding = await this.embedder.embed(parts[i]);
      chunks.push(new Chunk(randomUUID(), doc.id, i, parts[i], embedding));
    }
    await this.vectors.upsert(chunks);
    doc.markIndexed();
    await this.documents.save(doc);
    this.logger.log(`[3-4] ${chunks.length} chunks indexados`);

    const queryVec = await this.embedder.embed(
      'extracto bancario movimientos cuenta periodo banco',
    );
    const hits = await this.vectors.search(queryVec, 4, doc.id);
    const retrieved = hits.map((h) => h.chunk);
    this.logger.log(`[5] RAG retrieve ${retrieved.length} chunks`);

    const candidate = await this.extractor.extract({
      rawText: read.text,
      chunks: retrieved,
    });
    this.logger.log(`[6] JSON candidato extraído`);

    const validated = validateStatement(candidate);
    if (!validated.ok) {
      this.logger.warn(`[7] Schema REJECT ${validated.issues.join(' | ')}`);
      doc.markRejected(validated.issues);
      await this.documents.save(doc);
      return { document: doc, statement: null, retrievedChunkIds: retrieved.map((c) => c.id) };
    }

    const statement = new BankStatement(
      randomUUID(),
      doc.id,
      validated.value.bank,
      validated.value.accountLast4,
      validated.value.periodFrom,
      validated.value.periodTo,
      validated.value.currency,
      validated.value.movements,
    );
    await this.statements.save(statement);
    doc.markReconciled(statement.id);
    await this.documents.save(doc);
    this.logger.log(`[8] Statement ${statement.id} guardado (relacional)`);

    return {
      document: doc,
      statement,
      retrievedChunkIds: retrieved.map((c) => c.id),
    };
  }
}
