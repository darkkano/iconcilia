/** PUERTO driven — embeddings (hoy vector hash, mañana OpenAI / pgvector real). */
export interface EmbedderPort {
  embed(text: string): Promise<number[]>;
}
