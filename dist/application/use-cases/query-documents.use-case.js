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
var QueryDocumentsUseCase_1;
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EMBEDDER, VECTOR_STORE } from '../../domain/ports/tokens.js';
let QueryDocumentsUseCase = QueryDocumentsUseCase_1 = class QueryDocumentsUseCase {
    embedder;
    vectors;
    logger = new Logger(QueryDocumentsUseCase_1.name);
    constructor(embedder, vectors) {
        this.embedder = embedder;
        this.vectors = vectors;
    }
    async execute(question) {
        this.logger.log(`RAG query="${question}"`);
        const vec = await this.embedder.embed(question);
        const hits = await this.vectors.search(vec, 5);
        const context = hits.map((h) => h.chunk.text).join('\n---\n');
        const answer = hits.length === 0
            ? 'No hay documentos indexados que coincidan.'
            : `Contexto recuperado (${hits.length} chunks):\n${context}`;
        return {
            question,
            answer,
            hits: hits.map((h) => ({
                documentId: h.chunk.documentId,
                chunkIndex: h.chunk.index,
                score: Number(h.score.toFixed(4)),
                text: h.chunk.text,
            })),
        };
    }
};
QueryDocumentsUseCase = QueryDocumentsUseCase_1 = __decorate([
    Injectable(),
    __param(0, Inject(EMBEDDER)),
    __param(1, Inject(VECTOR_STORE)),
    __metadata("design:paramtypes", [Object, Object])
], QueryDocumentsUseCase);
export { QueryDocumentsUseCase };
//# sourceMappingURL=query-documents.use-case.js.map