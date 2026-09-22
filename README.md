# Conciliador automático de documentos no estructurados — práctica hexagonal (NestJS)

```
PDF/Excel desordenado  →  visión  →  chunks + embeddings (pgvector)
                                   →  retrieve RAG  →  JSON candidato
                                   →  schema estricto  →  tabla relacional
```

Puerto: **3002** (`iaseguro` 3000, `ifraude` 3001).

---

## 1. Finalidad

Los bancos mandan extractos en **PDF o Excel desordenado**. Un `INSERT` clásico no puede leerlos: no hay columnas fijas.

**Este proyecto es el puente.** El front/ops sube el archivo (aquí, el texto crudo). Un pipeline RAG:

1. “Lee” el documento (visión/OCR simulado).
2. Lo parte en chunks y lo indexa (pgvector simulado).
3. Recupera los trozos útiles.
4. Extrae un JSON.
5. **Solo si pasa un schema estricto** lo guarda como extracto relacional (`bank`, `accountLast4`, `movements`…).

Si el JSON está incompleto: el documento queda `rejected` y **no hay fila** en statements. Así el backend no traga basura.

Hoy no hay PostgreSQL ni GPT-4 Vision reales. La finalidad de código es **practicar RAG + contrato JSON** en hexagonal.

---

## 2. Cómo se usa — endpoints

```bash
cd iconcilia
npm install
npm run start:dev
```

Base: `http://localhost:3002`

| Método | Ruta | Qué hace |
|--------|------|----------|
| `GET` | `/` | Mapa |
| `POST` | `/v1/documents` | Ingesta + pipeline RAG + schema |
| `GET` | `/v1/documents` | Lista |
| `GET` | `/v1/documents/:id` | Estado `reconciled` / `rejected` |
| `GET` | `/v1/documents/:id/chunks` | Fragmentos indexados |
| `GET` | `/v1/statements` | Extractos **ya validados** (relacional) |
| `GET` | `/v1/statements/:id` | Un extracto |
| `POST` | `/v1/query` | Pregunta RAG (no escribe tablas) |

---

### `GET /`

```bash
curl -s http://localhost:3002/
```

---

### `POST /v1/documents`

Corre el pipeline completo.

**Body**

| Campo | Tipo | Obligatorio | Qué es |
|-------|------|-------------|--------|
| `filename` | string | sí | nombre original (`marzo.pdf`) |
| `kind` | `"pdf"` \| `"excel"` | sí | tipo (elige el reader simulado) |
| `rawText` | string | sí | contenido desordenado (en prod vendría del OCR) |

**201 — conciliado**

```json
{
  "document": {
    "id": "uuid",
    "filename": "marzo.pdf",
    "kind": "pdf",
    "status": "reconciled",
    "statementId": "uuid",
    "rejectionIssues": []
  },
  "statement": {
    "bank": "NACIONAL DE CREDITO",
    "accountLast4": "4521",
    "currency": "USD",
    "movements": [
      { "date": "2026-03-01", "description": "TRANSFERENCIA ENVIADA", "amount": -1500, "type": "debit" }
    ]
  },
  "retrievedChunkIds": ["…"]
}
```

**201 — rechazado por schema** (`statement: null`, nada en `/v1/statements`):

```json
{
  "document": {
    "status": "rejected",
    "rejectionIssues": ["bank: string requerida", "movements: array con al menos 1 ítem"]
  },
  "statement": null
}
```

**400** si falta `filename`, `kind` o `rawText`.

Extracto PDF desordenado (debe terminar `reconciled`):

```bash
curl -s http://localhost:3002/v1/documents \
  -H "Content-Type: application/json" \
  -d "{\"filename\":\"marzo.pdf\",\"kind\":\"pdf\",\"rawText\":\"BANCO NACIONAL DE CREDITO\nEstado de Cuenta ****4521\nPeriodo: 2026-03-01 a 2026-03-31\nMoneda: USD\n\n2026-03-01  TRANSFERENCIA ENVIADA     -1500.00\n2026-03-05  PAGO NOMINA                3200.50\n\"}"
```

Excel/CSV:

```bash
curl -s http://localhost:3002/v1/documents \
  -H "Content-Type: application/json" \
  -d "{\"filename\":\"marzo.xlsx\",\"kind\":\"excel\",\"rawText\":\"banco,cuenta,fecha,desc,monto\nBNC,4521,2026-03-01,TRANSFERENCIA,-1500\nBNC,4521,2026-03-05,NOMINA,3200.5\n\"}"
```

Basura (debe `rejected`):

```bash
curl -s http://localhost:3002/v1/documents \
  -H "Content-Type: application/json" \
  -d "{\"filename\":\"ruido.pdf\",\"kind\":\"pdf\",\"rawText\":\"hola esto no es un extracto\"}"
```

---

### `GET /v1/documents` y `GET /v1/documents/:id`

```bash
curl -s http://localhost:3002/v1/documents
curl -s http://localhost:3002/v1/documents/EL-UUID
```

**Statuses:** `received` → `indexed` → `reconciled` | `rejected`

---

### `GET /v1/documents/:id/chunks`

Los trozos que “pgvector” indexó.

```bash
curl -s http://localhost:3002/v1/documents/EL-UUID/chunks
```

---

### `GET /v1/statements`

Solo JSON que **pasó el schema**. Es el equivalente a `SELECT * FROM statements`.

```bash
curl -s http://localhost:3002/v1/statements
curl -s http://localhost:3002/v1/statements/EL-UUID
```

**404** si el id no existe.

---

### `POST /v1/query`

RAG: embede la pregunta, busca chunks similares, arma un contexto. No inserta filas.

```bash
curl -s http://localhost:3002/v1/query \
  -H "Content-Type: application/json" \
  -d '{"question":"movimientos de nomina"}'
```

```json
{
  "question": "movimientos de nomina",
  "answer": "Contexto recuperado (N chunks): …",
  "hits": [{ "documentId": "…", "chunkIndex": 1, "score": 0.82, "text": "…" }]
}
```

RAM: al reiniciar `start:dev` se vacían documentos, vectores y statements.

---

## 3. Algoritmo (`ReconcileDocumentUseCase`)

| Paso | Qué | Puerto |
|------|-----|--------|
| 1 | Leer PDF/Excel (visión) | `DocumentReaderPort` |
| 2 | Guardar documento `received` | `DocumentRepositoryPort` |
| 3 | Chunk + embed | `EmbedderPort` |
| 4 | Indexar vectores | `VectorStorePort` (pgvector) |
| 5 | Retrieve top-k | mismo vector store |
| 6 | Extraer JSON candidato | `ExtractorPort` |
| 7 | `validateStatement()` **dominio puro** | schema |
| 8a | OK → `BankStatement` relacional, status `reconciled` | `StatementRepositoryPort` |
| 8b | MAL → `rejected`, **cero** insert relacional | — |

---

## 4. Hexágono

```
DRIVING                         APPLICATION                         DRIVEN
POST /v1/documents  →  ReconcileDocumentUseCase  →  Reader, Embedder, Vector, Extractor, Repos
POST /v1/query      →  QueryDocumentsUseCase     →  Embedder, Vector
GET /v1/statements  →  Get/List                  →  StatementRepo (relacional)
```

Cambiar RAM → PostgreSQL+pgvector es `useClass` en `app.module.ts`. El schema **no se toca**.

---

## 5. Tests

```bash
npm test
npm run test:e2e
npm run build
```

---

## 6. Relación con los otros

| Proyecto | Puerto | Rol |
|----------|--------|-----|
| `iaseguro` | 3000 | Front → IA, sin PII, modelo barato/caro |
| `ifraude` | 3001 | Pago 202; fraude en cola + Circuit Breaker |
| `iconcilia` | 3002 | PDF/Excel → JSON estricto → BD relacional |
