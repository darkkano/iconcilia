import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';

const EXTRACTO = `BANCO NACIONAL DE CREDITO
Estado de Cuenta ****4521
Periodo: 2026-03-01 a 2026-03-31
Moneda: USD

2026-03-01  TRANSFERENCIA ENVIADA     -1500.00
2026-03-05  PAGO NOMINA                3200.50
`;

describe('Conciliador (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /', async () => {
    const res = await request(app.getHttpServer()).get('/').expect(200);
    expect(res.body.name).toContain('Conciliador');
  });

  it('PDF desordenado válido → reconciled + statement relacional', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/documents')
      .send({ filename: 'marzo.pdf', kind: 'pdf', rawText: EXTRACTO })
      .expect(201);

    expect(res.body.document.status).toBe('reconciled');
    expect(res.body.statement.bank).toMatch(/NACIONAL/i);
    expect(res.body.statement.accountLast4).toBe('4521');
    expect(res.body.statement.movements.length).toBeGreaterThanOrEqual(2);

    const list = await request(app.getHttpServer()).get('/v1/statements').expect(200);
    expect(list.body).toHaveLength(1);
  });

  it('texto basura → rejected y statements vacío', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/documents')
      .send({ filename: 'ruido.pdf', kind: 'pdf', rawText: 'hola esto no es un extracto' })
      .expect(201);

    expect(res.body.document.status).toBe('rejected');
    expect(res.body.statement).toBeNull();
    expect(res.body.document.rejectionIssues.length).toBeGreaterThan(0);

    const list = await request(app.getHttpServer()).get('/v1/statements').expect(200);
    expect(list.body).toHaveLength(0);
  });

  it('POST /v1/query usa chunks indexados', async () => {
    await request(app.getHttpServer())
      .post('/v1/documents')
      .send({ filename: 'marzo.pdf', kind: 'pdf', rawText: EXTRACTO });

    const res = await request(app.getHttpServer())
      .post('/v1/query')
      .send({ question: 'movimientos nomina' })
      .expect(201);

    expect(res.body.hits.length).toBeGreaterThan(0);
  });
});
