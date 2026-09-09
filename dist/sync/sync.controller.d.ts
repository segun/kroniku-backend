import { SyncService } from './sync.service';
import type { RequestUser } from '../common/interfaces/request-user.interface';
import { PushSyncDto } from './dto/push-sync.dto';
import { PullSyncDto } from './dto/pull-sync.dto';
export declare class SyncController {
    private readonly syncService;
    constructor(syncService: SyncService);
    push(user: RequestUser, dto: PushSyncDto): Promise<{
        applied: import("../events/events.service").AppliedEvent[];
        conflicts: import("../events/events.service").ConflictSummary[];
        ignored: string[];
        contract: {
            payload: string;
            conflict: string;
        };
    }>;
    pull(user: RequestUser, dto: PullSyncDto): Promise<{
        events: import("../events/entities/sync-event.entity").SyncEvent[];
        cursor: string | null;
    }>;
}
