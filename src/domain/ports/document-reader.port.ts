import { DocumentKind } from '../entities/document.js';

export interface ReadResult {
  text: string;
  pages: number;
  note: string;
}

/**
 * PUERTO driven — "visión" del PDF/Excel.
 * En producción: OCR / modelo multimodal. Aquí recibe el texto crudo del request.
 */
export interface DocumentReaderPort {
  read(input: { filename: string; kind: DocumentKind; rawText: string }): Promise<ReadResult>;
}
