import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { DomainError } from '../../domain/errors/domain.error.js';
import {
  DocumentNotFoundError,
  StatementNotFoundError,
} from '../../domain/errors/document.errors.js';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<{
      status: (code: number) => { json: (body: unknown) => void };
    }>();

    const notFound =
      exception instanceof DocumentNotFoundError ||
      exception instanceof StatementNotFoundError;

    res.status(notFound ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST).json({
      error: exception.name,
      message: exception.message,
    });
  }
}
