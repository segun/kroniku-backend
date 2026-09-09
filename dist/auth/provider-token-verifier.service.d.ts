import { ConfigService } from '@nestjs/config';
import type { AuthProvider } from './entities/auth-identity.entity';
export interface VerifiedProviderIdentity {
    provider: AuthProvider;
    subject: string;
    email?: string;
}
export declare class ProviderTokenVerifierService {
    private readonly configService;
    private readonly googleClient;
    private appleKeysPromise?;
    constructor(configService: ConfigService);
    verify(provider: AuthProvider, idToken: string): Promise<VerifiedProviderIdentity>;
    private verifyGoogle;
    private verifyApple;
    private requiredConfig;
    private getAppleSigningKey;
    private loadAppleKeys;
}
