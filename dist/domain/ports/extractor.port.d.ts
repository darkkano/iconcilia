import { Chunk } from '../entities/chunk.js';
import { StatementCandidate } from '../statement-schema.js';
export interface ExtractorPort {
    extract(input: {
        rawText: string;
        chunks: Chunk[];
    }): Promise<StatementCandidate>;
}
