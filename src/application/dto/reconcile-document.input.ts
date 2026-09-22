import { DocumentKind } from '../../domain/entities/document.js';

export class ReconcileDocumentInput {
  constructor(
    public readonly filename: string,
    public readonly kind: DocumentKind,
    public readonly rawText: string,
  ) {}
}
