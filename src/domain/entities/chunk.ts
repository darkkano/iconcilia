/**
 * CAPA: Domain
 * Un fragmento indexado en el almacén vectorial (pgvector simulado).
 */
export class Chunk {
  constructor(
    public readonly id: string,
    public readonly documentId: string,
    public readonly index: number,
    public readonly text: string,
    public readonly embedding: number[],
  ) {}
}
