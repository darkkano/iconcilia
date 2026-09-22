import { validateStatement } from './statement-schema.js';

describe('validateStatement (schema estricto)', () => {
  const valid = {
    bank: 'BNC',
    accountLast4: '4521',
    periodFrom: '2026-03-01',
    periodTo: '2026-03-31',
    currency: 'USD',
    movements: [
      {
        date: '2026-03-01',
        description: 'TRANSFERENCIA',
        amount: -1500,
        type: 'debit',
      },
    ],
  };

  it('acepta un extracto completo', () => {
    const r = validateStatement(valid);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.movements).toHaveLength(1);
  });

  it('rechaza sin bank ni movements — no pasaría a PostgreSQL', () => {
    const r = validateStatement({ currency: 'USD' });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.issues.some((i) => i.startsWith('bank'))).toBe(true);
      expect(r.issues.some((i) => i.startsWith('movements'))).toBe(true);
    }
  });

  it('rechaza accountLast4 que no sean 4 dígitos', () => {
    const r = validateStatement({ ...valid, accountLast4: '45' });
    expect(r.ok).toBe(false);
  });
});
