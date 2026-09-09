import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { DevicesService } from '../devices/devices.service';
import { ProviderLoginDto } from './dto/provider-login.dto';
import { AuthIdentity } from './entities/auth-identity.entity';
import { ProviderTokenVerifierService } from './provider-token-verifier.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly devicesService: DevicesService,
		private readonly jwtService: JwtService,
		private readonly providerTokenVerifier: ProviderTokenVerifierService,
		@InjectRepository(AuthIdentity)
		private readonly identitiesRepository: Repository<AuthIdentity>,
	) {}

	async providerLogin(dto: ProviderLoginDto): Promise<{
		accessToken: string;
		user: { id: string; email: string; retrievalOptIn: boolean };
		device: { id: string; clientDeviceId: string };
		isNewAccount: boolean;
	}> {
		const verifiedIdentity = await this.providerTokenVerifier.verify(dto.provider, dto.idToken);
		let identity = await this.identitiesRepository.findOne({
			where: {
				provider: verifiedIdentity.provider,
				providerSubject: verifiedIdentity.subject,
			},
			relations: { user: true },
		});

		let isNewAccount = false;
		let user = identity?.user;
		if (!user) {
			if (!verifiedIdentity.email) {
				throw new UnauthorizedException('Apple token does not contain an email for a new account');
			}

			const existingUser = await this.usersService.findByEmail(verifiedIdentity.email);
			if (existingUser) {
				user = existingUser;
			} else {
				user = await this.usersService.create({
					email: verifiedIdentity.email,
				});
				isNewAccount = true;
			}

			identity = this.identitiesRepository.create({
				userId: user.id,
				provider: verifiedIdentity.provider,
				providerSubject: verifiedIdentity.subject,
			});
			await this.identitiesRepository.save(identity);
		}

		const device = await this.devicesService.upsertForUser(user.id, {
			clientDeviceId: dto.clientDeviceId,
			platform: dto.platform,
			appVersion: dto.appVersion,
			publicKey: dto.publicKey,
		});

		return {
			accessToken: await this.signToken(user.id, device.id, user.email),
			user: { id: user.id, email: user.email, retrievalOptIn: user.retrievalOptIn },
			device: { id: device.id, clientDeviceId: device.clientDeviceId },
			isNewAccount,
		};
	}

	private signToken(userId: string, deviceId: string, email: string): Promise<string> {
		return this.jwtService.signAsync({
			sub: userId,
			deviceId,
			email,
		});
	}
}
