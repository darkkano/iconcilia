var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ReconcileDocumentUseCase_1;
import { randomUUID } from 'node:crypto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { chunkText } from '../../domain/chunker.js';
import { BankStatement } from '../../domain/entities/bank-statement.js';
import { Chunk } from '../../domain/entities/chunk.js';
import { Document } from '../../domain/entities/document.js';
import { EmptyDocumentError } from '../../domain/errors/document.errors.js';
import { DOCUMENT_READER, DOCUMENT_REPO, EMBEDDER, EXTRACTOR, STATEMENT_REPO, VECTOR_STORE, } from '../../domain/ports/tokens.js';
import { validateStatement } from '../../domain/statement-schema.js';
let ReconcileDocumentUseCase = ReconcileDocumentUseCase_1 = class ReconcileDocumentUseCase {
    reader;
    documents;
    embedder;
    vectors;
    extractor;
    statements;
    logger = new Logger(ReconcileDocumentUseCase_1.name);
    constructor(reader, documents, embedder, vectors, extractor, statements) {
        this.reader = reader;
        this.documents = documents;
        this.embedder = embedder;
        this.vectors = vectors;
        this.extractor = extractor;
        this.statements = statements;
    }
    async execute(input) {
        this.logger.log(`[1] Leer ${input.kind} "${input.filename}"`);
        const read = await this.reader.read({
            filename: input.filename,
            kind: input.kind,
            rawText: input.rawText,
        });
        if (!read.text.trim())
            throw new EmptyDocumentError();
        const doc = new Document(randomUUID(), input.filename, input.kind, read.text, new Date().toISOString());
        await this.documents.save(doc);
        this.logger.log(`[2] Document ${doc.id} received`);
        const parts = chunkText(read.text);
        const chunks = [];
        for (let i = 0; i < parts.length; i++) {
            const embedding = await this.embedder.embed(parts[i]);
            chunks.push(new Chunk(randomUUID(), doc.id, i, parts[i], embedding));
        }
        await this.vectors.upsert(chunks);
        doc.markIndexed();
        await this.documents.save(doc);
        this.logger.log(`[3-4] ${chunks.length} chunks indexados`);
        const queryVec = await this.embedder.embed('extracto bancario movimientos cuenta periodo banco');
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
        const statement = new BankStatement(randomUUID(), doc.id, validated.value.bank, validated.value.accountLast4, validated.value.periodFrom, validated.value.periodTo, validated.value.currency, validated.value.movements);
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
};
ReconcileDocumentUseCase = ReconcileDocumentUseCase_1 = __decorate([
    Injectable(),
    __param(0, Inject(DOCUMENT_READER)),
    __param(1, Inject(DOCUMENT_REPO)),
    __param(2, Inject(EMBEDDER)),
    __param(3, Inject(VECTOR_STORE)),
    __param(4, Inject(EXTRACTOR)),
    __param(5, Inject(STATEMENT_REPO)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], ReconcileDocumentUseCase);
export { ReconcileDocumentUseCase };
//# sourceMappingURL=reconcile-document.use-case.js.map