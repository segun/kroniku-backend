"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    logger = new common_1.Logger('Auth');
    handleRequest(error, user, info, context) {
        if (error || !user) {
            const request = context.switchToHttp().getRequest();
            const response = context.switchToHttp().getResponse();
            const authorization = request.header('authorization');
            const requestId = response.getHeader('x-request-id') ?? 'unknown';
            const reason = this.authenticationReason(error, info, authorization);
            this.logger.warn(`${requestId} ${request.method} ${request.originalUrl} JWT rejected reason=${reason} authHeader=${authorization ? 'present' : 'missing'}`);
            throw error instanceof common_1.UnauthorizedException
                ? error
                : new common_1.UnauthorizedException();
        }
        return user;
    }
    authenticationReason(error, info, authorization) {
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
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map