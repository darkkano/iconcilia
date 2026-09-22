export type MovementType = 'debit' | 'credit';

export class Movement {
  constructor(
    public readonly date: string,
    public readonly description: string,
    public readonly amount: number,
    public readonly type: MovementType,
  ) {}
}

/**
 * CAPA: Domain / agregado relacional
 * Solo se persiste si el schema estricto pasó.
 *
 * FLUJO:
 *   ExtractorPort → objeto suelto (JSON candidato)
 *   validateStatement() → BankStatement  |  SchemaValidationError
 *   StatementRepository.save
 */
export class BankStatement {
  constructor(
    public readonly id: string,
    public readonly documentId: string,
    public readonly bank: string,
    public readonly accountLast4: string,
    public readonly periodFrom: string,
    public readonly periodTo: string,
    public readonly currency: string,
    public readonly movements: Movement[],
  ) {}
}
