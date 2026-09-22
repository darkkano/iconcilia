export class Document {
    id;
    filename;
    kind;
    rawText;
    createdAt;
    status;
    rejectionIssues;
    statementId;
    constructor(id, filename, kind, rawText, createdAt, status = 'received', rejectionIssues = [], statementId = null) {
        this.id = id;
        this.filename = filename;
        this.kind = kind;
        this.rawText = rawText;
        this.createdAt = createdAt;
        this.status = status;
        this.rejectionIssues = rejectionIssues;
        this.statementId = statementId;
    }
    markIndexed() {
        this.status = 'indexed';
    }
    markReconciled(statementId) {
        this.status = 'reconciled';
        this.statementId = statementId;
        this.rejectionIssues = [];
    }
    markRejected(issues) {
        this.status = 'rejected';
        this.rejectionIssues = issues;
        this.statementId = null;
    }
}
//# sourceMappingURL=document.js.map