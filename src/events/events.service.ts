import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { SyncEvent } from './entities/sync-event.entity';
import { SyncConflict } from './entities/sync-conflict.entity';
import { PushSyncEventDto } from '../sync/dto/push-sync.dto';

export interface AppliedEvent {
	eventId: string;
	version: number;
	updatedAt: Date;
}

export interface ConflictSummary {
	eventId: string;
	strategy: 'ignored_stale' | 'same_version_conflict';
	serverVersion: number;
	incomingVersion: number;
}

@Injectable()
export class EventsService {
	constructor(
		@InjectRepository(SyncEvent)
		private readonly eventsRepository: Repository<SyncEvent>,
		@InjectRepository(SyncConflict)
		private readonly conflictsRepository: Repository<SyncConflict>,
	) {}

	async applySyncBatch(userId: string, deviceId: string, events: PushSyncEventDto[]): Promise<{
		applied: AppliedEvent[];
		conflicts: ConflictSummary[];
		ignored: string[];
	}> {
		const applied: AppliedEvent[] = [];
		const conflicts: ConflictSummary[] = [];
		const ignored: string[] = [];

		for (const incoming of events) {
			const existing = await this.eventsRepository.findOne({
				where: { userId, eventId: incoming.eventId },
			});

			if (!existing) {
				const inserted = this.eventsRepository.create({
					userId,
					deviceId,
					eventId: incoming.eventId,
					version: incoming.version,
					occurredAt: incoming.occurredAt ? new Date(incoming.occurredAt) : null,
					source: incoming.source ?? null,
					title: incoming.title ?? null,
					detail: incoming.detail ?? null,
					searchText: incoming.searchText ?? null,
					contextData: incoming.contextData ?? null,
					encryptedPayload: incoming.encryptedPayload,
					payloadHash: incoming.payloadHash,
					isDeleted: incoming.isDeleted ?? false,
				});
				const saved = await this.eventsRepository.save(inserted);
				applied.push({ eventId: saved.eventId, version: saved.version, updatedAt: saved.updatedAt });
				continue;
			}

			if (incoming.version > existing.version) {
				existing.version = incoming.version;
				existing.deviceId = deviceId;
				existing.occurredAt = incoming.occurredAt ? new Date(incoming.occurredAt) : existing.occurredAt;
				existing.source = incoming.source ?? existing.source;
				existing.title = incoming.title ?? existing.title;
				existing.detail = incoming.detail ?? existing.detail;
				existing.searchText = incoming.searchText ?? existing.searchText;
				existing.contextData = incoming.contextData ?? existing.contextData;
				existing.encryptedPayload = incoming.encryptedPayload;
				existing.payloadHash = incoming.payloadHash;
				existing.isDeleted = incoming.isDeleted ?? existing.isDeleted;
				const saved = await this.eventsRepository.save(existing);
				applied.push({ eventId: saved.eventId, version: saved.version, updatedAt: saved.updatedAt });
				continue;
			}

			if (incoming.version === existing.version && incoming.payloadHash !== existing.payloadHash) {
				await this.recordConflict({
					userId,
					eventId: incoming.eventId,
					incomingDeviceId: deviceId,
					incomingVersion: incoming.version,
					serverVersion: existing.version,
					strategy: 'same_version_conflict',
					incomingPayloadHash: incoming.payloadHash,
					serverPayloadHash: existing.payloadHash,
				});
				conflicts.push({
					eventId: incoming.eventId,
					strategy: 'same_version_conflict',
					serverVersion: existing.version,
					incomingVersion: incoming.version,
				});
				continue;
			}

			if (incoming.version < existing.version) {
				await this.recordConflict({
					userId,
					eventId: incoming.eventId,
					incomingDeviceId: deviceId,
					incomingVersion: incoming.version,
					serverVersion: existing.version,
					strategy: 'ignored_stale',
					incomingPayloadHash: incoming.payloadHash,
					serverPayloadHash: existing.payloadHash,
				});
				conflicts.push({
					eventId: incoming.eventId,
					strategy: 'ignored_stale',
					serverVersion: existing.version,
					incomingVersion: incoming.version,
				});
				continue;
			}

			ignored.push(incoming.eventId);
		}

		return { applied, conflicts, ignored };
	}

	pullEvents(userId: string, since?: Date, limit = 500): Promise<SyncEvent[]> {
		const where = since ? { userId, updatedAt: MoreThan(since) } : { userId };
		return this.eventsRepository.find({
			where,
			order: { updatedAt: 'ASC' },
			take: limit,
		});
	}

	searchKeyword(userId: string, query?: string, limit = 20, source?: string): Promise<SyncEvent[]> {
		const trimmedQuery = query?.trim();

		const builder = this.eventsRepository
			.createQueryBuilder('event')
			.where('event.userId = :userId', { userId })
			.andWhere('event.isDeleted = false');

		if (trimmedQuery) {
			builder.andWhere(
				"(LOWER(COALESCE(event.title, '')) LIKE :query OR LOWER(COALESCE(event.detail, '')) LIKE :query OR LOWER(COALESCE(event.searchText, '')) LIKE :query OR LOWER(COALESCE(event.source, '')) LIKE :query)",
				{ query: `%${trimmedQuery.toLowerCase()}%` },
			);
		}

		if (source) {
			builder.andWhere('event.source = :source', { source });
		}

		return builder
			.orderBy('event.occurredAt', 'DESC')
			.addOrderBy('event.updatedAt', 'DESC')
			.limit(limit)
			.getMany();
	}

	async searchNatural(userId: string, query: string, limit = 20): Promise<Array<{ event: SyncEvent; score: number }>> {
		const rows = await this.eventsRepository.query(
			`
			SELECT
			  id,
			  userId,
			  deviceId,
			  eventId,
			  version,
			  occurredAt,
			  source,
			  title,
			  detail,
			  searchText,
			  contextData,
			  encryptedPayload,
			  payloadHash,
			  isDeleted,
			  createdAt,
			  updatedAt,
			  MATCH(title, detail, searchText, source) AGAINST (? IN NATURAL LANGUAGE MODE) AS score
			FROM sync_events
			WHERE userId = ?
			  AND isDeleted = 0
			  AND MATCH(title, detail, searchText, source) AGAINST (? IN NATURAL LANGUAGE MODE)
			ORDER BY score DESC, occurredAt DESC, updatedAt DESC
			LIMIT ?
			`,
			[query, userId, query, limit],
		);

		return rows.map((row: Record<string, unknown>) => ({
			event: this.eventsRepository.create({
				id: row.id as string,
				userId: row.userId as string,
				deviceId: (row.deviceId as string | null) ?? null,
				eventId: row.eventId as string,
				version: Number(row.version),
				occurredAt: row.occurredAt ? new Date(row.occurredAt as string) : null,
				source: (row.source as string | null) ?? null,
				title: (row.title as string | null) ?? null,
				detail: (row.detail as string | null) ?? null,
				searchText: (row.searchText as string | null) ?? null,
				contextData: (row.contextData as SyncEvent['contextData']) ?? null,
				encryptedPayload: row.encryptedPayload as string,
				payloadHash: row.payloadHash as string,
				isDeleted: Boolean(row.isDeleted),
				createdAt: new Date(row.createdAt as string),
				updatedAt: new Date(row.updatedAt as string),
			}),
			score: Number(row.score ?? 0),
		}));
	}

	findAllForUser(userId: string): Promise<SyncEvent[]> {
		return this.eventsRepository.find({ where: { userId }, order: { createdAt: 'ASC' } });
	}

	private async recordConflict(conflict: Partial<SyncConflict>): Promise<void> {
		const entity = this.conflictsRepository.create(conflict);
		await this.conflictsRepository.save(entity);
	}
}
