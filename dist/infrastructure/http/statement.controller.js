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
import { GetStatementUseCase, ListStatementsUseCase, } from '../../application/use-cases/get-document.use-case.js';
import { QueryDocumentsUseCase } from '../../application/use-cases/query-documents.use-case.js';
import { statementJson } from './json.js';
let StatementController = class StatementController {
    getOne;
    list;
    constructor(getOne, list) {
        this.getOne = getOne;
        this.list = list;
    }
    async findAll() {
        const items = await this.list.execute();
        return items.map(statementJson);
    }
    async findOne(id) {
        const row = await this.getOne.execute(id);
        return statementJson(row);
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatementController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StatementController.prototype, "findOne", null);
StatementController = __decorate([
    Controller('v1/statements'),
    __metadata("design:paramtypes", [GetStatementUseCase,
        ListStatementsUseCase])
], StatementController);
export { StatementController };
let QueryController = class QueryController {
    query;
    constructor(query) {
        this.query = query;
    }
    ask(body) {
        if (!body?.question?.trim()) {
            throw new BadRequestException('question es obligatorio.');
        }
        return this.query.execute(body.question.trim());
    }
};
__decorate([
    Post('query'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QueryController.prototype, "ask", null);
QueryController = __decorate([
    Controller('v1'),
    __metadata("design:paramtypes", [QueryDocumentsUseCase])
], QueryController);
export { QueryController };
let HealthController = class HealthController {
    info() {
        return {
            name: 'Conciliador de documentos no estructurados (práctica hexagonal)',
            idea: 'RAG: leer PDF/Excel → chunks/embeddings → extraer JSON estricto → PostgreSQL relacional.',
            endpoints: {
                'POST /v1/documents': 'Ingesta + pipeline RAG + schema',
                'GET /v1/documents': 'Lista de documentos',
                'GET /v1/documents/:id': 'Estado (reconciled | rejected)',
                'GET /v1/documents/:id/chunks': 'Fragmentos indexados (pgvector sim)',
                'GET /v1/statements': 'Extractos ya validados (tabla relacional)',
                'GET /v1/statements/:id': 'Un extracto',
                'POST /v1/query': 'Pregunta RAG sobre lo indexado',
            },
            lee: 'README.md',
        };
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "info", null);
HealthController = __decorate([
    Controller()
], HealthController);
export { HealthController };
//# sourceMappingURL=statement.controller.js.map