var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
let InMemoryVectorStore = class InMemoryVectorStore {
    chunks = [];
    async upsert(chunks) {
        for (const chunk of chunks) {
            const i = this.chunks.findIndex((c) => c.id === chunk.id);
            if (i >= 0)
                this.chunks[i] = chunk;
            else
                this.chunks.push(chunk);
        }
    }
    async search(embedding, topK, documentId) {
        const pool = documentId
            ? this.chunks.filter((c) => c.documentId === documentId)
            : this.chunks;
        return pool
            .map((chunk) => ({ chunk, score: cosine(embedding, chunk.embedding) }))
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);
    }
    async listByDocument(documentId) {
        return this.chunks
            .filter((c) => c.documentId === documentId)
            .sort((a, b) => a.index - b.index);
    }
};
InMemoryVectorStore = __decorate([
    Injectable()
], InMemoryVectorStore);
export { InMemoryVectorStore };
function cosine(a, b) {
    let dot = 0;
    let na = 0;
    let nb = 0;
    const n = Math.min(a.length, b.length);
    for (let i = 0; i < n; i++) {
        dot += a[i] * b[i];
        na += a[i] * a[i];
        nb += b[i] * b[i];
    }
    const d = Math.sqrt(na) * Math.sqrt(nb);
    return d === 0 ? 0 : dot / d;
}
//# sourceMappingURL=in-memory-vector-store.js.map