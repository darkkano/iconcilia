import { DocumentKind } from '../../domain/entities/document.js';
export declare class ReconcileDocumentInput {
    readonly filename: string;
    readonly kind: DocumentKind;
    readonly rawText: string;
    constructor(filename: string, kind: DocumentKind, rawText: string);
}
