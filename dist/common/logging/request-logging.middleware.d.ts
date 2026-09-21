import { NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
export declare class RequestLoggingMiddleware implements NestMiddleware {
    private readonly logger;
    use(request: Request, response: Response, next: NextFunction): void;
    private safeUserAgent;
}
