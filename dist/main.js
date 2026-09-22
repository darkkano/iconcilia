import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    const port = process.env.PORT ?? 3002;
    await app.listen(port);
    const logger = new Logger('Bootstrap');
    logger.log(`Conciliador de documentos (práctica) → http://localhost:${port}`);
    logger.log('POST /v1/documents | GET /v1/statements | POST /v1/query');
    logger.log('Lee README.md — finalidad y catálogo de endpoints.');
}
await bootstrap();
//# sourceMappingURL=main.js.map