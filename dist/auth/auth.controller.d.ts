import { AuthService } from './auth.service';
import { ProviderLoginDto } from './dto/provider-login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    providerLogin(dto: ProviderLoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            retrievalOptIn: boolean;
        };
        device: {
            id: string;
            clientDeviceId: string;
        };
        isNewAccount: boolean;
    }>;
}
