export interface EmbedderPort {
    embed(text: string): Promise<number[]>;
}
