export declare class Chunk {
    readonly id: string;
    readonly documentId: string;
    readonly index: number;
    readonly text: string;
    readonly embedding: number[];
    constructor(id: string, documentId: string, index: number, text: string, embedding: number[]);
}
