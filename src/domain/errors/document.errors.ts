import { DomainError } from './domain.error.js';

export class DocumentNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Documento no encontrado: ${id}`);
  }
}

export class StatementNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Extracto no encontrado: ${id}`);
  }
}

export class EmptyDocumentError extends DomainError {
  constructor() {
    super('El documento no tiene texto para conciliar.');
  }
}

/**
 * El JSON extraído no pasó el schema estricto.
 * NO se guarda en la tabla relacional.
 */
export class SchemaValidationError extends DomainError {
  constructor(public readonly issues: string[]) {
    super(`JSON rechazado por schema: ${issues.join('; ')}`);
  }
}
