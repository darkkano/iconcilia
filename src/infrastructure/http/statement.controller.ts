import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import {
  GetStatementUseCase,
  ListStatementsUseCase,
} from '../../application/use-cases/get-document.use-case.js';
import { QueryDocumentsUseCase } from '../../application/use-cases/query-documents.use-case.js';
import { statementJson } from './json.js';

@Controller('v1/statements')
export class StatementController {
  constructor(
    private readonly getOne: GetStatementUseCase,
    private readonly list: ListStatementsUseCase,
  ) {}

  @Get()
  async findAll() {
    const items = await this.list.execute();
    return items.map(statementJson);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const row = await this.getOne.execute(id);
    return statementJson(row);
  }
}

@Controller('v1')
export class QueryController {
  constructor(private readonly query: QueryDocumentsUseCase) {}

  /** RAG puro: no escribe en relacional. */
  @Post('query')
  ask(@Body() body: { question?: string }) {
    if (!body?.question?.trim()) {
      throw new BadRequestException('question es obligatorio.');
    }
    return this.query.execute(body.question.trim());
  }
}

@Controller()
export class HealthController {
  @Get()
  info() {
    return {
      name: 'Conciliador de documentos no estructurados (práctica hexagonal)',
      idea: 'RAG: leer PDF/Excel → chunks/embeddings → extraer JSON estricto → PostgreSQL relacional.',
      endpoints: {
        'POST /v1/documents': 'Ingesta + pipeline RAG + schema',
        'GET /v1/documents': 'Lista de documentos',
        'GET /v1/documents/:id': 'Estado (reconciled | rejected)',
        'GET /v1/documents/:id/chunks': 'Fragmentos indexados (pgvector sim)',
        'GET /v1/statements': 'Extractos ya validados (tabla relacional)',
        'GET /v1/statements/:id': 'Un extracto',
        'POST /v1/query': 'Pregunta RAG sobre lo indexado',
      },
      lee: 'README.md',
    };
  }
}
