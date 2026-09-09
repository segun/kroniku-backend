import type { AuthProvider } from '../entities/auth-identity.entity';
export declare class ProviderLoginDto {
    provider: AuthProvider;
    idToken: string;
    clientDeviceId: string;
    platform?: string;
    appVersion?: string;
    publicKey?: string;
}
