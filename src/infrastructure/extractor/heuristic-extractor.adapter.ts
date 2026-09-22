import { Injectable, Logger } from '@nestjs/common';
import { Chunk } from '../../domain/entities/chunk.js';
import type { ExtractorPort } from '../../domain/ports/extractor.port.js';
import type { StatementCandidate } from '../../domain/statement-schema.js';

/**
 * ADAPTER driven — generación JSON (LLM/visión simulados).
 *
 * FLUJO:
 *   UseCase pasa raw + chunks RAG
 *     → regex de extracto bancario / CSV
 *     → StatementCandidate (aún no validado)
 *
 * El schema de dominio es quien acepta o rechaza.
 */
@Injectable()
export class HeuristicExtractorAdapter implements ExtractorPort {
  private readonly logger = new Logger(HeuristicExtractorAdapter.name);

  async extract(input: { rawText: string; chunks: Chunk[] }): Promise<StatementCandidate> {
    this.logger.log(`extraer JSON (RAG trajo ${input.chunks.length} chunks; parse sobre el texto leído)`);
    const text = input.rawText;
    if (looksLikeCsv(text)) {
      return fromCsv(text);
    }
    return fromMessyPdf(text);
  }
}

function looksLikeCsv(text: string): boolean {
  const first = text.split('\n').map((l) => l.trim())[0] ?? '';
  return /banco/i.test(first) && first.includes(',');
}

type MovementDraft = {
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
};

function fromCsv(text: string): StatementCandidate {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const rows = lines.slice(1).map((l) => l.split(',').map((c) => c.trim()));
  const first = rows[0] ?? [];
  const movements: MovementDraft[] = [];
  for (const cols of rows) {
    const amount = Number((cols[4] ?? '').replace(',', '.'));
    const date = toIso(cols[2] ?? '');
    if (!Number.isFinite(amount) || amount === 0 || !date) continue;
    movements.push({
      date,
      description: cols[3] || 'movimiento',
      amount,
      type: amount < 0 ? 'debit' : 'credit',
    });
  }

  return {
    bank: first[0],
    accountLast4: (first[1] ?? '').replace(/\D/g, '').slice(-4),
    periodFrom: movements[0]?.date,
    periodTo: movements[movements.length - 1]?.date,
    currency: 'USD',
    movements,
  };
}

function fromMessyPdf(text: string): StatementCandidate {
  const bank =
    text.match(/BANCO\s+([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ ]{2,})/i)?.[1]?.trim() ??
    text.match(/banco[:\s]+([^\n]+)/i)?.[1]?.trim();

  const accountLast4 =
    text.match(/\*{2,}(\d{4})/)?.[1] ??
    text.match(/cuenta[^\d]{0,20}(\d{4})/i)?.[1];

  const isoRange = text.match(
    /(\d{4}-\d{2}-\d{2}).{0,40}(\d{4}-\d{2}-\d{2})/,
  );
  const slashRange = text.match(
    /(\d{2}\/\d{2}\/\d{4}).{0,40}(\d{2}\/\d{2}\/\d{4})/,
  );

  const currencyMatch = text.match(/\b(VES|USD|EUR)\b/i);
  const currency = currencyMatch
    ? currencyMatch[1].toUpperCase()
    : /\bBs\b/i.test(text)
      ? 'VES'
      : undefined;

  const movements: Array<{
    date: string;
    description: string;
    amount: number;
    type: 'debit' | 'credit';
  }> = [];

  const lineRe =
    /^(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+(-?[\d.]+,\d{2}|-?[\d,]+\.\d{2}|-?\d+\.?\d*)\s*$/;

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    const m = line.match(lineRe);
    if (!m) continue;
    const amount = parseAmount(m[3]);
    if (amount === 0 || !Number.isFinite(amount)) continue;
    const date = toIso(m[1]);
    if (!date) continue;
    movements.push({
      date,
      description: m[2].trim(),
      amount,
      type: amount < 0 ? 'debit' : 'credit',
    });
  }

  return {
    bank,
    accountLast4,
    periodFrom: isoRange?.[1] ?? (slashRange ? toIso(slashRange[1]) : movements[0]?.date),
    periodTo:
      isoRange?.[2] ??
      (slashRange ? toIso(slashRange[2]) : movements[movements.length - 1]?.date),
    currency,
    movements,
  };
}

function parseAmount(raw: string): number {
  const t = raw.trim();
  if (t.includes(',') && t.includes('.')) {
    return Number(t.replace(/\./g, '').replace(',', '.'));
  }
  if (t.includes(',')) return Number(t.replace(',', '.'));
  return Number(t);
}

function toIso(raw: string): string | undefined {
  const s = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return undefined;
}
