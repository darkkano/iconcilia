import { Movement } from './entities/bank-statement.js';
export interface StatementCandidate {
    bank?: unknown;
    accountLast4?: unknown;
    periodFrom?: unknown;
    periodTo?: unknown;
    currency?: unknown;
    movements?: unknown;
}
export declare function validateStatement(raw: StatementCandidate): {
    ok: true;
    value: {
        bank: string;
        accountLast4: string;
        periodFrom: string;
        periodTo: string;
        currency: string;
        movements: Movement[];
    };
} | {
    ok: false;
    issues: string[];
};
