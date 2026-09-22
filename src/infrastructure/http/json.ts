import { BankStatement } from '../../domain/entities/bank-statement.js';
import { Document } from '../../domain/entities/document.js';

export function documentJson(doc: Document) {
  return {
    id: doc.id,
    filename: doc.filename,
    kind: doc.kind,
    status: doc.status,
    createdAt: doc.createdAt,
    statementId: doc.statementId,
    rejectionIssues: doc.rejectionIssues,
  };
}

export function statementJson(row: BankStatement) {
  return {
    id: row.id,
    documentId: row.documentId,
    bank: row.bank,
    accountLast4: row.accountLast4,
    periodFrom: row.periodFrom,
    periodTo: row.periodTo,
    currency: row.currency,
    movements: row.movements.map((m) => ({
      date: m.date,
      description: m.description,
      amount: m.amount,
      type: m.type,
    })),
  };
}
