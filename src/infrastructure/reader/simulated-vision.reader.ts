import { Injectable, Logger } from '@nestjs/common';
import { DocumentKind } from '../../domain/entities/document.js';
import type {
  DocumentReaderPort,
  ReadResult,
} from '../../domain/ports/document-reader.port.js';

/**
 * ADAPTER driven — "visión" del PDF/Excel (simulada).
 *
 * FLUJO: ReconcileUseCase.reader.read → este archivo
 * Producción: GPT-4o vision / Azure Document Intelligence / tesseract.
 */
@Injectable()
export class SimulatedVisionReader implements DocumentReaderPort {
  private readonly logger = new Logger(SimulatedVisionReader.name);

  async read(input: {
    filename: string;
    kind: DocumentKind;
    rawText: string;
  }): Promise<ReadResult> {
    const text = input.rawText.replace(/\r\n/g, '\n').trim();
    const pages =
      input.kind === 'pdf' ? Math.max(1, Math.ceil(text.length / 900)) : 1;
    const note =
      input.kind === 'pdf'
        ? 'OCR/visión simulada sobre PDF'
        : 'Parser de Excel/CSV simulado';
    this.logger.log(`${note} file=${input.filename} pages=${pages}`);
    return { text, pages, note };
  }
}
