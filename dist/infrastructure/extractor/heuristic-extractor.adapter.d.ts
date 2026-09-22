import { Chunk } from '../../domain/entities/chunk.js';
import type { ExtractorPort } from '../../domain/ports/extractor.port.js';
import type { StatementCandidate } from '../../domain/statement-schema.js';
export declare class HeuristicExtractorAdapter implements ExtractorPort {
    private readonly logger;
    extract(input: {
        rawText: string;
        chunks: Chunk[];
    }): Promise<StatementCandidate>;
}
