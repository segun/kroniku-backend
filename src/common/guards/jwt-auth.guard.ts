import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	private readonly logger = new Logger('Auth');

	handleRequest<TUser = unknown>(
		error: unknown,
		user: TUser,
		info: unknown,
		context: ExecutionContext,
	): TUser {
		if (error || !user) {
			const request = context.switchToHttp().getRequest<Request>();
			const response = context.switchToHttp().getResponse<Response>();
			const authorization = request.header('authorization');
			const requestId = response.getHeader('x-request-id') ?? 'unknown';
			const reason = this.authenticationReason(error, info, authorization);

			this.logger.warn(
				`${requestId} ${request.method} ${request.originalUrl} JWT rejected reason=${reason} authHeader=${authorization ? 'present' : 'missing'}`,
			);

			throw error instanceof UnauthorizedException
				? error
				: new UnauthorizedException();
		}

		return user;
	}

	private authenticationReason(
		error: unknown,
		info: unknown,
		authorization: string | undefined,
	): string {
		if (!authorization) {
			return 'missing_authorization_header';
		}

		const scheme = authorization.split(/\s+/)[0]?.toLowerCase();
		if (scheme !== 'bearer') {
			return 'invalid_authorization_scheme';
		}

		const token = authorization.replace(/^Bearer\s+/i, '').trim();
		if (!token) {
			return 'empty_bearer_token';
		}

		const value = error ?? info;
		const message = value instanceof Error ? value.message : String(value ?? 'unknown_jwt_failure');
		const normalized = message.toLowerCase();
		if (normalized.includes('expired')) {
			return 'jwt_expired';
		}
		if (normalized.includes('malformed')) {
			return 'jwt_malformed';
		}
		if (normalized.includes('signature')) {
			return 'jwt_invalid_signature';
		}
		if (normalized.includes('audience')) {
			return 'jwt_invalid_audience';
		}
		if (normalized.includes('issuer')) {
			return 'jwt_invalid_issuer';
		}
		return 'jwt_rejected';
	}
}
