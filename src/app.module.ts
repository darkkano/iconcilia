import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import {
  GetDocumentUseCase,
  GetStatementUseCase,
  ListChunksUseCase,
  ListDocumentsUseCase,
  ListStatementsUseCase,
} from './application/use-cases/get-document.use-case.js';
import { QueryDocumentsUseCase } from './application/use-cases/query-documents.use-case.js';
import { ReconcileDocumentUseCase } from './application/use-cases/reconcile-document.use-case.js';
import {
  DOCUMENT_READER,
  DOCUMENT_REPO,
  EMBEDDER,
  EXTRACTOR,
  STATEMENT_REPO,
  VECTOR_STORE,
} from './domain/ports/tokens.js';
import { HashEmbedderAdapter } from './infrastructure/embeddings/hash-embedder.adapter.js';
import { HeuristicExtractorAdapter } from './infrastructure/extractor/heuristic-extractor.adapter.js';
import { DomainExceptionFilter } from './infrastructure/http/domain-exception.filter.js';
import { DocumentController } from './infrastructure/http/document.controller.js';
import {
  HealthController,
  QueryController,
  StatementController,
} from './infrastructure/http/statement.controller.js';
import { InMemoryDocumentRepository } from './infrastructure/persistence/in-memory-document.repository.js';
import { InMemoryStatementRepository } from './infrastructure/persistence/in-memory-statement.repository.js';
import { SimulatedVisionReader } from './infrastructure/reader/simulated-vision.reader.js';
import { InMemoryVectorStore } from './infrastructure/vector/in-memory-vector-store.js';

/**
 * ENCHUFE del hexágono.
 * Vector RAM → pgvector: cambia VECTOR_STORE + EMBEDDER.
 * Extractor regex → GPT-4o vision: cambia EXTRACTOR + DOCUMENT_READER.
 */
@Module({
  controllers: [
    HealthController,
    DocumentController,
    StatementController,
    QueryController,
  ],
  providers: [
    ReconcileDocumentUseCase,
    QueryDocumentsUseCase,
    GetDocumentUseCase,
    ListDocumentsUseCase,
    GetStatementUseCase,
    ListStatementsUseCase,
    ListChunksUseCase,
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
    { provide: DOCUMENT_REPO, useClass: InMemoryDocumentRepository },
    { provide: STATEMENT_REPO, useClass: InMemoryStatementRepository },
    { provide: VECTOR_STORE, useClass: InMemoryVectorStore },
    { provide: EMBEDDER, useClass: HashEmbedderAdapter },
    { provide: DOCUMENT_READER, useClass: SimulatedVisionReader },
    { provide: EXTRACTOR, useClass: HeuristicExtractorAdapter },
  ],
})
export class AppModule {}
