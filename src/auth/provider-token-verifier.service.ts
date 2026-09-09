import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { createPublicKey } from 'node:crypto';
import { get } from 'node:https';
import { JwtHeader, JwtPayload, verify } from 'jsonwebtoken';
import type { AuthProvider } from './entities/auth-identity.entity';

export interface VerifiedProviderIdentity {
  provider: AuthProvider;
  subject: string;
  email?: string;
}

@Injectable()
export class ProviderTokenVerifierService {
  private readonly googleClient = new OAuth2Client();
  private appleKeysPromise?: Promise<Record<string, string>>;

  constructor(private readonly configService: ConfigService) {}

  async verify(provider: AuthProvider, idToken: string): Promise<VerifiedProviderIdentity> {
    if (provider === 'google') {
      return this.verifyGoogle(idToken);
    }

    return this.verifyApple(idToken);
  }

  private async verifyGoogle(idToken: string): Promise<VerifiedProviderIdentity> {
    const audience = this.requiredConfig('GOOGLE_CLIENT_ID');
    try {
      const ticket = await this.googleClient.verifyIdToken({ idToken, audience });
      const payload = ticket.getPayload();
      if (!payload?.sub || !payload.email || !payload.email_verified) {
        throw new UnauthorizedException('Google token does not contain a verified email');
      }

      return { provider: 'google', subject: payload.sub, email: payload.email.toLowerCase() };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid Google identity token');
    }
  }

  private async verifyApple(idToken: string): Promise<VerifiedProviderIdentity> {
    const audience = this.requiredConfig('APPLE_CLIENT_ID');
    try {
      const payload = await new Promise<JwtPayload>((resolve, reject) => {
        verify(idToken, this.getAppleSigningKey.bind(this), {
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
        throw new UnauthorizedException('Apple token does not contain a verified email');
      }

      return { provider: 'apple', subject: payload.sub, email };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid Apple identity token');
    }
  }

  private requiredConfig(name: string): string {
    const value = this.configService.get<string>(name);
    if (!value) {
      throw new UnauthorizedException(`${name} is not configured`);
    }
    return value;
  }

  private getAppleSigningKey(header: JwtHeader, callback: (error: Error | null, key?: string) => void): void {
    if (!header.kid) {
      callback(new Error('Apple identity token does not include a key ID'));
      return;
    }

    this.loadAppleKeys()
      .then((keys) => {
        const key = keys[header.kid as string];
        if (!key) {
          callback(new Error('Apple signing key was not found'));
          return;
        }
        callback(null, key);
      })
      .catch((error: unknown) => {
        callback(error instanceof Error ? error : new Error('Apple signing keys could not be loaded'));
      });
  }

  private loadAppleKeys(): Promise<Record<string, string>> {
    if (!this.appleKeysPromise) {
      this.appleKeysPromise = new Promise((resolve, reject) => {
        get('https://appleid.apple.com/auth/keys', (response) => {
          if (response.statusCode !== 200) {
            response.resume();
            reject(new Error(`Apple JWKS returned HTTP ${response.statusCode ?? 'unknown'}`));
            return;
          }

          let body = '';
          response.setEncoding('utf8');
          response.on('data', (chunk: string) => {
            body += chunk;
          });
          response.on('end', () => {
            try {
              const jwks = JSON.parse(body) as {
                keys?: Array<{ kid?: string; kty?: string; n?: string; e?: string }>;
              };
              const keys: Record<string, string> = {};
              for (const jwk of jwks.keys ?? []) {
                if (jwk.kid && jwk.kty === 'RSA' && jwk.n && jwk.e) {
                  keys[jwk.kid] = createPublicKey({ key: jwk, format: 'jwk' }).export({
                    type: 'spki',
                    format: 'pem',
                  }).toString();
                }
              }
              resolve(keys);
            } catch (error) {
              reject(error);
            }
          });
        }).on('error', reject);
      });
    }

    return this.appleKeysPromise;
  }
}
