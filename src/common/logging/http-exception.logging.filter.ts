import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class HttpExceptionLoggingFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exceptions');

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const statusCode = exception instanceof HttpException ? exception.getStatus() : 500;
    const requestId = response.getHeader('x-request-id') ?? 'unknown';
    const errorMessage = exception instanceof Error ? exception.message : String(exception);
    const stack = exception instanceof Error ? exception.stack : undefined;

    this.logger.error(
      `${requestId} ${request.method} ${request.originalUrl} status=${statusCode} error=${this.safe(errorMessage)}`,
      stack,
    );

    if (exception instanceof HttpException) {
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

  private safe(value: string): string {
    return value.replace(/[\r\n]/g, '').slice(0, 500);
  }
}
