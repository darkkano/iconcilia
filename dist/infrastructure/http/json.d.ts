import { BankStatement } from '../../domain/entities/bank-statement.js';
import { Document } from '../../domain/entities/document.js';
export declare function documentJson(doc: Document): {
    id: string;
    filename: string;
    kind: import("../../domain/entities/document.js").DocumentKind;
    status: import("../../domain/entities/document.js").DocumentStatus;
    createdAt: string;
    statementId: string | null;
    rejectionIssues: string[];
};
export declare function statementJson(row: BankStatement): {
    id: string;
    documentId: string;
    bank: string;
    accountLast4: string;
    periodFrom: string;
    periodTo: string;
    currency: string;
    movements: {
        date: string;
        description: string;
        amount: number;
        type: import("../../domain/entities/bank-statement.js").MovementType;
    }[];
};
