import { randomUUID } from 'node:crypto';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

const REQUEST_ID_HEADER = 'x-request-id';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const requestId = request.header(REQUEST_ID_HEADER) ?? randomUUID();
    const startedAt = process.hrtime.bigint();
    response.setHeader(REQUEST_ID_HEADER, requestId);

    this.logger.log(
      `${requestId} ${request.method} ${request.originalUrl} started ip=${request.ip ?? 'unknown'} userAgent=${this.safeUserAgent(request)}`,
    );

    response.on('finish', () => {
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      const message = `${requestId} ${request.method} ${request.originalUrl} ${response.statusCode} ${durationMs.toFixed(1)}ms`;
      if (response.statusCode >= 500) {
        this.logger.error(message);
      } else if (response.statusCode >= 400) {
        this.logger.warn(message);
      } else {
        this.logger.log(message);
      }
    });

    next();
  }

  private safeUserAgent(request: Request): string {
    return (request.header('user-agent') ?? 'unknown').replace(/[\r\n]/g, '').slice(0, 200);
  }
}
