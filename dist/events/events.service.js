"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sync_event_entity_1 = require("./entities/sync-event.entity");
const sync_conflict_entity_1 = require("./entities/sync-conflict.entity");
let EventsService = class EventsService {
    eventsRepository;
    conflictsRepository;
    constructor(eventsRepository, conflictsRepository) {
        this.eventsRepository = eventsRepository;
        this.conflictsRepository = conflictsRepository;
    }
    async applySyncBatch(userId, deviceId, events) {
        const applied = [];
        const conflicts = [];
        const ignored = [];
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
    pullEvents(userId, since, limit = 500) {
        const where = since ? { userId, updatedAt: (0, typeorm_2.MoreThan)(since) } : { userId };
        return this.eventsRepository.find({
            where,
            order: { updatedAt: 'ASC' },
            take: limit,
        });
    }
    searchKeyword(userId, query, limit = 20) {
        const likeQuery = `%${query.toLowerCase()}%`;
        return this.eventsRepository
            .createQueryBuilder('event')
            .where('event.userId = :userId', { userId })
            .andWhere('event.isDeleted = false')
            .andWhere("(LOWER(COALESCE(event.title, '')) LIKE :query OR LOWER(COALESCE(event.detail, '')) LIKE :query OR LOWER(COALESCE(event.searchText, '')) LIKE :query OR LOWER(COALESCE(event.source, '')) LIKE :query)", { query: likeQuery })
            .orderBy('event.occurredAt', 'DESC')
            .addOrderBy('event.updatedAt', 'DESC')
            .limit(limit)
            .getMany();
    }
    async searchNatural(userId, query, limit = 20) {
        const rows = await this.eventsRepository.query(`
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
			`, [query, userId, query, limit]);
        return rows.map((row) => ({
            event: this.eventsRepository.create({
                id: row.id,
                userId: row.userId,
                deviceId: row.deviceId ?? null,
                eventId: row.eventId,
                version: Number(row.version),
                occurredAt: row.occurredAt ? new Date(row.occurredAt) : null,
                source: row.source ?? null,
                title: row.title ?? null,
                detail: row.detail ?? null,
                searchText: row.searchText ?? null,
                encryptedPayload: row.encryptedPayload,
                payloadHash: row.payloadHash,
                isDeleted: Boolean(row.isDeleted),
                createdAt: new Date(row.createdAt),
                updatedAt: new Date(row.updatedAt),
            }),
            score: Number(row.score ?? 0),
        }));
    }
    findAllForUser(userId) {
        return this.eventsRepository.find({ where: { userId }, order: { createdAt: 'ASC' } });
    }
    async recordConflict(conflict) {
        const entity = this.conflictsRepository.create(conflict);
        await this.conflictsRepository.save(entity);
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sync_event_entity_1.SyncEvent)),
    __param(1, (0, typeorm_1.InjectRepository)(sync_conflict_entity_1.SyncConflict)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], EventsService);
//# sourceMappingURL=events.service.js.map