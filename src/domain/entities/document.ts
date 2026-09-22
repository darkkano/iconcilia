/**
 * CAPA: Domain / Entidad
 *
 * FLUJO:
 *   POST HTTP            →  new Document (received)
 *   Reader + chunk/embed →  indexed
 *   Extractor + schema   →  reconciled | rejected
 */
export type DocumentKind = 'pdf' | 'excel';
export type DocumentStatus = 'received' | 'indexed' | 'reconciled' | 'rejected';

export class Document {
  constructor(
    public readonly id: string,
    public readonly filename: string,
    public readonly kind: DocumentKind,
    public readonly rawText: string,
    public readonly createdAt: string,
    public status: DocumentStatus = 'received',
    public rejectionIssues: string[] = [],
    public statementId: string | null = null,
  ) {}

  markIndexed(): void {
    this.status = 'indexed';
  }

  markReconciled(statementId: string): void {
    this.status = 'reconciled';
    this.statementId = statementId;
    this.rejectionIssues = [];
  }

  markRejected(issues: string[]): void {
    this.status = 'rejected';
    this.rejectionIssues = issues;
    this.statementId = null;
  }
}
