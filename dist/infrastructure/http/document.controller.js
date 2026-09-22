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
import { BadRequestException, Body, Controller, Get, Param, Post, } from '@nestjs/common';
import { ReconcileDocumentInput } from '../../application/dto/reconcile-document.input.js';
import { GetDocumentUseCase, ListChunksUseCase, ListDocumentsUseCase, } from '../../application/use-cases/get-document.use-case.js';
import { ReconcileDocumentUseCase } from '../../application/use-cases/reconcile-document.use-case.js';
import { documentJson, statementJson } from './json.js';
let DocumentController = class DocumentController {
    reconcile;
    getOne;
    list;
    chunks;
    constructor(reconcile, getOne, list, chunks) {
        this.reconcile = reconcile;
        this.getOne = getOne;
        this.list = list;
        this.chunks = chunks;
    }
    async create(body) {
        if (!body?.filename?.trim()) {
            throw new BadRequestException('filename es obligatorio.');
        }
        if (body.kind !== 'pdf' && body.kind !== 'excel') {
            throw new BadRequestException('kind debe ser "pdf" o "excel".');
        }
        if (typeof body.rawText !== 'string') {
            throw new BadRequestException('rawText (string) es obligatorio. Simula el contenido del PDF/Excel.');
        }
        const result = await this.reconcile.execute(new ReconcileDocumentInput(body.filename.trim(), body.kind, body.rawText));
        return {
            document: documentJson(result.document),
            statement: result.statement ? statementJson(result.statement) : null,
            retrievedChunkIds: result.retrievedChunkIds,
        };
    }
    async findAll() {
        const items = await this.list.execute();
        return items.map(documentJson);
    }
    async findChunks(id) {
        await this.getOne.execute(id);
        const chunks = await this.chunks.execute(id);
        return chunks.map((c) => ({
            id: c.id,
            index: c.index,
            text: c.text,
        }));
    }
    async findOne(id) {
        const doc = await this.getOne.execute(id);
        return documentJson(doc);
    }
};
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "create", null);
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "findAll", null);
__decorate([
    Get(':id/chunks'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "findChunks", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "findOne", null);
DocumentController = __decorate([
    Controller('v1/documents'),
    __metadata("design:paramtypes", [ReconcileDocumentUseCase,
        GetDocumentUseCase,
        ListDocumentsUseCase,
        ListChunksUseCase])
], DocumentController);
export { DocumentController };
//# sourceMappingURL=document.controller.js.map