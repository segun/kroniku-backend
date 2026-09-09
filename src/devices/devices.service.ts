import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { Device } from './entities/device.entity';

@Injectable()
export class DevicesService {
	constructor(
		@InjectRepository(Device)
		private readonly devicesRepository: Repository<Device>,
	) {}

	async upsertForUser(userId: string, dto: RegisterDeviceDto): Promise<Device> {
		const existing = await this.devicesRepository.findOne({
			where: { userId, clientDeviceId: dto.clientDeviceId },
		});

		if (existing) {
			existing.platform = dto.platform ?? existing.platform;
			existing.appVersion = dto.appVersion ?? existing.appVersion;
			existing.publicKey = dto.publicKey ?? existing.publicKey;
			existing.lastSeenAt = new Date();
			return this.devicesRepository.save(existing);
		}

		const created = this.devicesRepository.create({
			userId,
			clientDeviceId: dto.clientDeviceId,
			platform: dto.platform ?? null,
			appVersion: dto.appVersion ?? null,
			publicKey: dto.publicKey ?? null,
			lastSeenAt: new Date(),
		});
		return this.devicesRepository.save(created);
	}

	async assertOwnership(deviceId: string, userId: string): Promise<void> {
		const device = await this.devicesRepository.findOne({
			where: { id: deviceId, userId },
		});
		if (!device) {
			throw new UnauthorizedException('Device token is not valid for this account');
		}
	}

	findByUserId(userId: string): Promise<Device[]> {
		return this.devicesRepository.find({ where: { userId }, order: { createdAt: 'ASC' } });
	}
}
