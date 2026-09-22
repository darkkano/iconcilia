import { GetStatementUseCase, ListStatementsUseCase } from '../../application/use-cases/get-document.use-case.js';
import { QueryDocumentsUseCase } from '../../application/use-cases/query-documents.use-case.js';
export declare class StatementController {
    private readonly getOne;
    private readonly list;
    constructor(getOne: GetStatementUseCase, list: ListStatementsUseCase);
    findAll(): Promise<{
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
    }[]>;
    findOne(id: string): Promise<{
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
    }>;
}
export declare class QueryController {
    private readonly query;
    constructor(query: QueryDocumentsUseCase);
    ask(body: {
        question?: string;
    }): Promise<import("../../application/use-cases/query-documents.use-case.js").RagAnswer>;
}
export declare class HealthController {
    info(): {
        name: string;
        idea: string;
        endpoints: {
            'POST /v1/documents': string;
            'GET /v1/documents': string;
            'GET /v1/documents/:id': string;
            'GET /v1/documents/:id/chunks': string;
            'GET /v1/statements': string;
            'GET /v1/statements/:id': string;
            'POST /v1/query': string;
        };
        lee: string;
    };
}
