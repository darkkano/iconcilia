export type MovementType = 'debit' | 'credit';
export declare class Movement {
    readonly date: string;
    readonly description: string;
    readonly amount: number;
    readonly type: MovementType;
    constructor(date: string, description: string, amount: number, type: MovementType);
}
export declare class BankStatement {
    readonly id: string;
    readonly documentId: string;
    readonly bank: string;
    readonly accountLast4: string;
    readonly periodFrom: string;
    readonly periodTo: string;
    readonly currency: string;
    readonly movements: Movement[];
    constructor(id: string, documentId: string, bank: string, accountLast4: string, periodFrom: string, periodTo: string, currency: string, movements: Movement[]);
}
