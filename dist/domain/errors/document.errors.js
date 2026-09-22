import { DomainError } from './domain.error.js';
export class DocumentNotFoundError extends DomainError {
    constructor(id) {
        super(`Documento no encontrado: ${id}`);
    }
}
export class StatementNotFoundError extends DomainError {
    constructor(id) {
        super(`Extracto no encontrado: ${id}`);
    }
}
export class EmptyDocumentError extends DomainError {
    constructor() {
        super('El documento no tiene texto para conciliar.');
    }
}
export class SchemaValidationError extends DomainError {
    issues;
    constructor(issues) {
        super(`JSON rechazado por schema: ${issues.join('; ')}`);
        this.issues = issues;
    }
}
//# sourceMappingURL=document.errors.js.map