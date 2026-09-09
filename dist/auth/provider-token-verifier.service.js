"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderTokenVerifierService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const google_auth_library_1 = require("google-auth-library");
const node_crypto_1 = require("node:crypto");
const node_https_1 = require("node:https");
const jsonwebtoken_1 = require("jsonwebtoken");
let ProviderTokenVerifierService = class ProviderTokenVerifierService {
    configService;
    googleClient = new google_auth_library_1.OAuth2Client();
    appleKeysPromise;
    constructor(configService) {
        this.configService = configService;
    }
    async verify(provider, idToken) {
        if (provider === 'google') {
            return this.verifyGoogle(idToken);
        }
        return this.verifyApple(idToken);
    }
    async verifyGoogle(idToken) {
        const audience = this.requiredConfig('GOOGLE_CLIENT_ID');
        try {
            const ticket = await this.googleClient.verifyIdToken({ idToken, audience });
            const payload = ticket.getPayload();
            if (!payload?.sub || !payload.email || !payload.email_verified) {
                throw new common_1.UnauthorizedException('Google token does not contain a verified email');
            }
            return { provider: 'google', subject: payload.sub, email: payload.email.toLowerCase() };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException('Invalid Google identity token');
        }
    }
    async verifyApple(idToken) {
        const audience = this.requiredConfig('APPLE_CLIENT_ID');
        try {
            const payload = await new Promise((resolve, reject) => {
                (0, jsonwebtoken_1.verify)(idToken, this.getAppleSigningKey.bind(this), {
                    algorithms: ['RS256'],
                    issuer: 'https://appleid.apple.com',
                    audience,
                }, (error, decoded) => {
                    if (error || !decoded || typeof decoded === 'string') {
                        reject(error ?? new Error('Apple identity token payload is invalid'));
                        return;
                    }
                    resolve(decoded);
                });
            });
            const email = typeof payload.email === 'string' ? payload.email.toLowerCase() : undefined;
            const emailVerified = payload.email_verified === true || payload.email_verified === 'true';
            if (!payload.sub || (email && !emailVerified)) {
                throw new common_1.UnauthorizedException('Apple token does not contain a verified email');
            }
            return { provider: 'apple', subject: payload.sub, email };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException('Invalid Apple identity token');
        }
    }
    requiredConfig(name) {
        const value = this.configService.get(name);
        if (!value) {
            throw new common_1.UnauthorizedException(`${name} is not configured`);
        }
        return value;
    }
    getAppleSigningKey(header, callback) {
        if (!header.kid) {
            callback(new Error('Apple identity token does not include a key ID'));
            return;
        }
        this.loadAppleKeys()
            .then((keys) => {
            const key = keys[header.kid];
            if (!key) {
                callback(new Error('Apple signing key was not found'));
                return;
            }
            callback(null, key);
        })
            .catch((error) => {
            callback(error instanceof Error ? error : new Error('Apple signing keys could not be loaded'));
        });
    }
    loadAppleKeys() {
        if (!this.appleKeysPromise) {
            this.appleKeysPromise = new Promise((resolve, reject) => {
                (0, node_https_1.get)('https://appleid.apple.com/auth/keys', (response) => {
                    if (response.statusCode !== 200) {
                        response.resume();
                        reject(new Error(`Apple JWKS returned HTTP ${response.statusCode ?? 'unknown'}`));
                        return;
                    }
                    let body = '';
                    response.setEncoding('utf8');
                    response.on('data', (chunk) => {
                        body += chunk;
                    });
                    response.on('end', () => {
                        try {
                            const jwks = JSON.parse(body);
                            const keys = {};
                            for (const jwk of jwks.keys ?? []) {
                                if (jwk.kid && jwk.kty === 'RSA' && jwk.n && jwk.e) {
                                    keys[jwk.kid] = (0, node_crypto_1.createPublicKey)({ key: jwk, format: 'jwk' }).export({
                                        type: 'spki',
                                        format: 'pem',
                                    }).toString();
                                }
                            }
                            resolve(keys);
                        }
                        catch (error) {
                            reject(error);
                        }
                    });
                }).on('error', reject);
            });
        }
        return this.appleKeysPromise;
    }
};
exports.ProviderTokenVerifierService = ProviderTokenVerifierService;
exports.ProviderTokenVerifierService = ProviderTokenVerifierService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ProviderTokenVerifierService);
//# sourceMappingURL=provider-token-verifier.service.js.map