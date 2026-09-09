import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { DevicesService } from '../devices/devices.service';
import { ProviderLoginDto } from './dto/provider-login.dto';
import { AuthIdentity } from './entities/auth-identity.entity';
import { ProviderTokenVerifierService } from './provider-token-verifier.service';
export declare class AuthService {
    private readonly usersService;
    private readonly devicesService;
    private readonly jwtService;
    private readonly providerTokenVerifier;
    private readonly identitiesRepository;
    constructor(usersService: UsersService, devicesService: DevicesService, jwtService: JwtService, providerTokenVerifier: ProviderTokenVerifierService, identitiesRepository: Repository<AuthIdentity>);
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
    private signToken;
}
