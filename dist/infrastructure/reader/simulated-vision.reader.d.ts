import { DocumentKind } from '../../domain/entities/document.js';
import type { DocumentReaderPort, ReadResult } from '../../domain/ports/document-reader.port.js';
export declare class SimulatedVisionReader implements DocumentReaderPort {
    private readonly logger;
    read(input: {
        filename: string;
        kind: DocumentKind;
        rawText: string;
    }): Promise<ReadResult>;
}
