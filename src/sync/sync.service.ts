import { Injectable } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import type { RequestUser } from '../common/interfaces/request-user.interface';
import { PushSyncDto } from './dto/push-sync.dto';
import { PullSyncDto } from './dto/pull-sync.dto';
import { DevicesService } from '../devices/devices.service';

@Injectable()
export class SyncService {
	constructor(
		private readonly eventsService: EventsService,
		private readonly devicesService: DevicesService,
	) {}

	async push(user: RequestUser, dto: PushSyncDto) {
		await this.devicesService.assertOwnership(user.deviceId, user.userId);

		const result = await this.eventsService.applySyncBatch(
			user.userId,
			user.deviceId,
			dto.events,
		);

		return {
			contract: {
				payload: 'client-side encrypted blob accepted as opaque ciphertext',
				conflict: 'last-write-wins by version with server-side conflict logging',
			},
			...result,
		};
	}

	async pull(user: RequestUser, dto: PullSyncDto) {
		await this.devicesService.assertOwnership(user.deviceId, user.userId);
		const since = dto.since ? new Date(dto.since) : undefined;
		const events = await this.eventsService.pullEvents(user.userId, since);
		return {
			events,
			cursor: events.length > 0 ? events[events.length - 1].updatedAt.toISOString() : dto.since ?? null,
		};
	}
}
