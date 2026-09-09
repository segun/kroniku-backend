import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { DevicesService } from '../devices/devices.service';
import { EventsService } from '../events/events.service';
import type { RequestUser } from '../common/interfaces/request-user.interface';

@Injectable()
export class AccountService {
	constructor(
		private readonly usersService: UsersService,
		private readonly devicesService: DevicesService,
		private readonly eventsService: EventsService,
	) {}

	async setRetrievalOptIn(user: RequestUser, enabled: boolean) {
		const updated = await this.usersService.setRetrievalOptIn(user.userId, enabled);
		if (!updated) {
			throw new NotFoundException('Account not found');
		}
		return {
			userId: updated.id,
			retrievalOptIn: updated.retrievalOptIn,
			updatedAt: updated.updatedAt,
		};
	}

	async exportData(user: RequestUser) {
		const account = await this.usersService.findById(user.userId);
		if (!account) {
			throw new NotFoundException('Account not found');
		}

		const [devices, events] = await Promise.all([
			this.devicesService.findByUserId(user.userId),
			this.eventsService.findAllForUser(user.userId),
		]);

		return {
			exportedAt: new Date().toISOString(),
			account: {
				id: account.id,
				email: account.email,
				retrievalOptIn: account.retrievalOptIn,
				createdAt: account.createdAt,
			},
			devices,
			events,
		};
	}

	async deleteAccount(user: RequestUser) {
		const account = await this.usersService.findById(user.userId);
		if (!account) {
			throw new NotFoundException('Account not found');
		}

		await this.usersService.deleteById(user.userId);
		return {
			deleted: true,
			deletedAt: new Date().toISOString(),
		};
	}
}
