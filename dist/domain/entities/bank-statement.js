export class Movement {
    date;
    description;
    amount;
    type;
    constructor(date, description, amount, type) {
        this.date = date;
        this.description = description;
        this.amount = amount;
        this.type = type;
    }
}
export class BankStatement {
    id;
    documentId;
    bank;
    accountLast4;
    periodFrom;
    periodTo;
    currency;
    movements;
    constructor(id, documentId, bank, accountLast4, periodFrom, periodTo, currency, movements) {
        this.id = id;
        this.documentId = documentId;
        this.bank = bank;
        this.accountLast4 = accountLast4;
        this.periodFrom = periodFrom;
        this.periodTo = periodTo;
        this.currency = currency;
        this.movements = movements;
    }
}
//# sourceMappingURL=bank-statement.js.map