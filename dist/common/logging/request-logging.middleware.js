"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestLoggingMiddleware = void 0;
const node_crypto_1 = require("node:crypto");
const common_1 = require("@nestjs/common");
const REQUEST_ID_HEADER = 'x-request-id';
let RequestLoggingMiddleware = class RequestLoggingMiddleware {
    logger = new common_1.Logger('HTTP');
    use(request, response, next) {
        const requestId = request.header(REQUEST_ID_HEADER) ?? (0, node_crypto_1.randomUUID)();
        const startedAt = process.hrtime.bigint();
        response.setHeader(REQUEST_ID_HEADER, requestId);
        this.logger.log(`${requestId} ${request.method} ${request.originalUrl} started ip=${request.ip ?? 'unknown'} userAgent=${this.safeUserAgent(request)}`);
        response.on('finish', () => {
            const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
            const message = `${requestId} ${request.method} ${request.originalUrl} ${response.statusCode} ${durationMs.toFixed(1)}ms`;
            if (response.statusCode >= 500) {
                this.logger.error(message);
            }
            else if (response.statusCode >= 400) {
                this.logger.warn(message);
            }
            else {
                this.logger.log(message);
            }
        });
        next();
    }
    safeUserAgent(request) {
        return (request.header('user-agent') ?? 'unknown').replace(/[\r\n]/g, '').slice(0, 200);
    }
};
exports.RequestLoggingMiddleware = RequestLoggingMiddleware;
exports.RequestLoggingMiddleware = RequestLoggingMiddleware = __decorate([
    (0, common_1.Injectable)()
], RequestLoggingMiddleware);
//# sourceMappingURL=request-logging.middleware.js.map