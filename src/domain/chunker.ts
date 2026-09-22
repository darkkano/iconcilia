/**
 * CAPA: Domain / función pura
 * Parte el texto en trozos para el índice vectorial.
 */
export function chunkText(text: string, size = 280): string[] {
  const lines = text
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const chunks: string[] = [];
  let buf = '';
  for (const line of lines) {
    const next = buf ? `${buf}\n${line}` : line;
    if (next.length > size && buf) {
      chunks.push(buf);
      buf = line;
    } else {
      buf = next;
    }
  }
  if (buf) chunks.push(buf);
  return chunks.length > 0 ? chunks : [text.trim()].filter(Boolean);
}
