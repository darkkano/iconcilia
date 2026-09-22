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
import { Inject, Injectable } from '@nestjs/common';
import { DocumentNotFoundError, StatementNotFoundError, } from '../../domain/errors/document.errors.js';
import { DOCUMENT_REPO, STATEMENT_REPO, VECTOR_STORE, } from '../../domain/ports/tokens.js';
let GetDocumentUseCase = class GetDocumentUseCase {
    docs;
    constructor(docs) {
        this.docs = docs;
    }
    async execute(id) {
        const doc = await this.docs.findById(id);
        if (!doc)
            throw new DocumentNotFoundError(id);
        return doc;
    }
};
GetDocumentUseCase = __decorate([
    Injectable(),
    __param(0, Inject(DOCUMENT_REPO)),
    __metadata("design:paramtypes", [Object])
], GetDocumentUseCase);
export { GetDocumentUseCase };
let ListDocumentsUseCase = class ListDocumentsUseCase {
    docs;
    constructor(docs) {
        this.docs = docs;
    }
    execute() {
        return this.docs.list();
    }
};
ListDocumentsUseCase = __decorate([
    Injectable(),
    __param(0, Inject(DOCUMENT_REPO)),
    __metadata("design:paramtypes", [Object])
], ListDocumentsUseCase);
export { ListDocumentsUseCase };
let GetStatementUseCase = class GetStatementUseCase {
    statements;
    constructor(statements) {
        this.statements = statements;
    }
    async execute(id) {
        const row = await this.statements.findById(id);
        if (!row)
            throw new StatementNotFoundError(id);
        return row;
    }
};
GetStatementUseCase = __decorate([
    Injectable(),
    __param(0, Inject(STATEMENT_REPO)),
    __metadata("design:paramtypes", [Object])
], GetStatementUseCase);
export { GetStatementUseCase };
let ListStatementsUseCase = class ListStatementsUseCase {
    statements;
    constructor(statements) {
        this.statements = statements;
    }
    execute() {
        return this.statements.list();
    }
};
ListStatementsUseCase = __decorate([
    Injectable(),
    __param(0, Inject(STATEMENT_REPO)),
    __metadata("design:paramtypes", [Object])
], ListStatementsUseCase);
export { ListStatementsUseCase };
let ListChunksUseCase = class ListChunksUseCase {
    vectors;
    constructor(vectors) {
        this.vectors = vectors;
    }
    execute(documentId) {
        return this.vectors.listByDocument(documentId);
    }
};
ListChunksUseCase = __decorate([
    Injectable(),
    __param(0, Inject(VECTOR_STORE)),
    __metadata("design:paramtypes", [Object])
], ListChunksUseCase);
export { ListChunksUseCase };
//# sourceMappingURL=get-document.use-case.js.map