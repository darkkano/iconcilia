var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
let InMemoryDocumentRepository = class InMemoryDocumentRepository {
    store = new Map();
    async save(doc) {
        this.store.set(doc.id, doc);
    }
    async findById(id) {
        return this.store.get(id) ?? null;
    }
    async list() {
        return [...this.store.values()].reverse();
    }
};
InMemoryDocumentRepository = __decorate([
    Injectable()
], InMemoryDocumentRepository);
export { InMemoryDocumentRepository };
//# sourceMappingURL=in-memory-document.repository.js.map