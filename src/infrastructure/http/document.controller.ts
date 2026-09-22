import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ReconcileDocumentInput } from '../../application/dto/reconcile-document.input.js';
import {
  GetDocumentUseCase,
  ListChunksUseCase,
  ListDocumentsUseCase,
} from '../../application/use-cases/get-document.use-case.js';
import { ReconcileDocumentUseCase } from '../../application/use-cases/reconcile-document.use-case.js';
import { DocumentKind } from '../../domain/entities/document.js';
import { documentJson, statementJson } from './json.js';

/**
 * ADAPTER driving
 *
 * POST /v1/documents  →  pipeline RAG completo
 * GET                  →  lista / detalle / chunks indexados
 */
@Controller('v1/documents')
export class DocumentController {
  constructor(
    private readonly reconcile: ReconcileDocumentUseCase,
    private readonly getOne: GetDocumentUseCase,
    private readonly list: ListDocumentsUseCase,
    private readonly chunks: ListChunksUseCase,
  ) {}

  @Post()
  async create(
    @Body()
    body: { filename?: string; kind?: string; rawText?: string },
  ) {
    if (!body?.filename?.trim()) {
      throw new BadRequestException('filename es obligatorio.');
    }
    if (body.kind !== 'pdf' && body.kind !== 'excel') {
      throw new BadRequestException('kind debe ser "pdf" o "excel".');
    }
    if (typeof body.rawText !== 'string') {
      throw new BadRequestException('rawText (string) es obligatorio. Simula el contenido del PDF/Excel.');
    }

    const result = await this.reconcile.execute(
      new ReconcileDocumentInput(
        body.filename.trim(),
        body.kind as DocumentKind,
        body.rawText,
      ),
    );

    return {
      document: documentJson(result.document),
      statement: result.statement ? statementJson(result.statement) : null,
      retrievedChunkIds: result.retrievedChunkIds,
    };
  }

  @Get()
  async findAll() {
    const items = await this.list.execute();
    return items.map(documentJson);
  }

  @Get(':id/chunks')
  async findChunks(@Param('id') id: string) {
    await this.getOne.execute(id);
    const chunks = await this.chunks.execute(id);
    return chunks.map((c) => ({
      id: c.id,
      index: c.index,
      text: c.text,
    }));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const doc = await this.getOne.execute(id);
    return documentJson(doc);
  }
}
