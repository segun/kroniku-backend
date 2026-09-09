import { Repository } from 'typeorm';
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
export declare class EventsService {
    private readonly eventsRepository;
    private readonly conflictsRepository;
    constructor(eventsRepository: Repository<SyncEvent>, conflictsRepository: Repository<SyncConflict>);
    applySyncBatch(userId: string, deviceId: string, events: PushSyncEventDto[]): Promise<{
        applied: AppliedEvent[];
        conflicts: ConflictSummary[];
        ignored: string[];
    }>;
    pullEvents(userId: string, since?: Date, limit?: number): Promise<SyncEvent[]>;
    searchKeyword(userId: string, query: string, limit?: number): Promise<SyncEvent[]>;
    searchNatural(userId: string, query: string, limit?: number): Promise<Array<{
        event: SyncEvent;
        score: number;
    }>>;
    findAllForUser(userId: string): Promise<SyncEvent[]>;
    private recordConflict;
}
