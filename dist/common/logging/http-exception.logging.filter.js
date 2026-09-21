"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionLoggingFilter = void 0;
const common_1 = require("@nestjs/common");
let HttpExceptionLoggingFilter = class HttpExceptionLoggingFilter {
    logger = new common_1.Logger('Exceptions');
    catch(exception, host) {
        const context = host.switchToHttp();
        const request = context.getRequest();
        const response = context.getResponse();
        const statusCode = exception instanceof common_1.HttpException ? exception.getStatus() : 500;
        const requestId = response.getHeader('x-request-id') ?? 'unknown';
        const errorMessage = exception instanceof Error ? exception.message : String(exception);
        const stack = exception instanceof Error ? exception.stack : undefined;
        this.logger.error(`${requestId} ${request.method} ${request.originalUrl} status=${statusCode} error=${this.safe(errorMessage)}`, stack);
        if (exception instanceof common_1.HttpException) {
            const body = exception.getResponse();
            response.status(statusCode).json(body);
            return;
        }
        response.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
            error: 'Internal Server Error',
            requestId,
        });
    }
    safe(value) {
        return value.replace(/[\r\n]/g, '').slice(0, 500);
    }
};
exports.HttpExceptionLoggingFilter = HttpExceptionLoggingFilter;
exports.HttpExceptionLoggingFilter = HttpExceptionLoggingFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionLoggingFilter);
//# sourceMappingURL=http-exception.logging.filter.js.map