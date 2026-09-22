var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Catch, HttpStatus, } from '@nestjs/common';
import { DomainError } from '../../domain/errors/domain.error.js';
import { DocumentNotFoundError, StatementNotFoundError, } from '../../domain/errors/document.errors.js';
let DomainExceptionFilter = class DomainExceptionFilter {
    catch(exception, host) {
        const res = host.switchToHttp().getResponse();
        const notFound = exception instanceof DocumentNotFoundError ||
            exception instanceof StatementNotFoundError;
        res.status(notFound ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST).json({
            error: exception.name,
            message: exception.message,
        });
    }
};
DomainExceptionFilter = __decorate([
    Catch(DomainError)
], DomainExceptionFilter);
export { DomainExceptionFilter };
//# sourceMappingURL=domain-exception.filter.js.map