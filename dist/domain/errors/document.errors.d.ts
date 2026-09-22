import { DomainError } from './domain.error.js';
export declare class DocumentNotFoundError extends DomainError {
    constructor(id: string);
}
export declare class StatementNotFoundError extends DomainError {
    constructor(id: string);
}
export declare class EmptyDocumentError extends DomainError {
    constructor();
}
export declare class SchemaValidationError extends DomainError {
    readonly issues: string[];
    constructor(issues: string[]);
}
