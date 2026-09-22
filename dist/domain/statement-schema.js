import { Movement } from './entities/bank-statement.js';
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const CURRENCIES = new Set(['VES', 'USD', 'EUR']);
export function validateStatement(raw) {
    const issues = [];
    const bank = asNonEmptyString(raw.bank);
    if (!bank)
        issues.push('bank: string requerida');
    const accountLast4 = asNonEmptyString(raw.accountLast4);
    if (!accountLast4 || !/^\d{4}$/.test(accountLast4)) {
        issues.push('accountLast4: exactamente 4 dígitos');
    }
    const periodFrom = asNonEmptyString(raw.periodFrom);
    if (!periodFrom || !DATE_RE.test(periodFrom))
        issues.push('periodFrom: YYYY-MM-DD');
    const periodTo = asNonEmptyString(raw.periodTo);
    if (!periodTo || !DATE_RE.test(periodTo))
        issues.push('periodTo: YYYY-MM-DD');
    const currency = asNonEmptyString(raw.currency)?.toUpperCase();
    if (!currency || !CURRENCIES.has(currency)) {
        issues.push('currency: VES | USD | EUR');
    }
    if (!Array.isArray(raw.movements) || raw.movements.length < 1) {
        issues.push('movements: array con al menos 1 ítem');
    }
    const movements = [];
    if (Array.isArray(raw.movements)) {
        raw.movements.forEach((item, i) => {
            const row = (item ?? {});
            const date = asNonEmptyString(row.date);
            if (!date || !DATE_RE.test(date))
                issues.push(`movements[${i}].date: YYYY-MM-DD`);
            const description = asNonEmptyString(row.description);
            if (!description)
                issues.push(`movements[${i}].description: requerida`);
            const amount = typeof row.amount === 'number' && Number.isFinite(row.amount) ? row.amount : null;
            if (amount === null || amount === 0) {
                issues.push(`movements[${i}].amount: number ≠ 0`);
            }
            const type = asNonEmptyString(row.type);
            if (type !== 'debit' && type !== 'credit') {
                issues.push(`movements[${i}].type: debit | credit`);
            }
            if (date && DATE_RE.test(date) && description && amount && (type === 'debit' || type === 'credit')) {
                movements.push(new Movement(date, description, amount, type));
            }
        });
    }
    if (issues.length > 0)
        return { ok: false, issues };
    return {
        ok: true,
        value: {
            bank: bank,
            accountLast4: accountLast4,
            periodFrom: periodFrom,
            periodTo: periodTo,
            currency: currency,
            movements,
        },
    };
}
function asNonEmptyString(v) {
    if (typeof v !== 'string')
        return null;
    const t = v.trim();
    return t.length > 0 ? t : null;
}
//# sourceMappingURL=statement-schema.js.map