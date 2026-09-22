import { DocumentKind } from '../entities/document.js';
export interface ReadResult {
    text: string;
    pages: number;
    note: string;
}
export interface DocumentReaderPort {
    read(input: {
        filename: string;
        kind: DocumentKind;
        rawText: string;
    }): Promise<ReadResult>;
}
