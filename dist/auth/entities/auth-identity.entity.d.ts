import { User } from '../../users/entities/user.entity';
export type AuthProvider = 'google' | 'apple';
export declare class AuthIdentity {
    id: string;
    userId: string;
    user: User;
    provider: AuthProvider;
    providerSubject: string;
    createdAt: Date;
}
