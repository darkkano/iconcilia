export class Chunk {
    id;
    documentId;
    index;
    text;
    embedding;
    constructor(id, documentId, index, text, embedding) {
        this.id = id;
        this.documentId = documentId;
        this.index = index;
        this.text = text;
        this.embedding = embedding;
    }
}
//# sourceMappingURL=chunk.js.map