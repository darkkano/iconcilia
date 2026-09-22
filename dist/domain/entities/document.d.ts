export type DocumentKind = 'pdf' | 'excel';
export type DocumentStatus = 'received' | 'indexed' | 'reconciled' | 'rejected';
export declare class Document {
    readonly id: string;
    readonly filename: string;
    readonly kind: DocumentKind;
    readonly rawText: string;
    readonly createdAt: string;
    status: DocumentStatus;
    rejectionIssues: string[];
    statementId: string | null;
    constructor(id: string, filename: string, kind: DocumentKind, rawText: string, createdAt: string, status?: DocumentStatus, rejectionIssues?: string[], statementId?: string | null);
    markIndexed(): void;
    markReconciled(statementId: string): void;
    markRejected(issues: string[]): void;
}
