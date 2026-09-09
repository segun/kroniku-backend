import { AccountService } from './account.service';
import type { RequestUser } from '../common/interfaces/request-user.interface';
import { UpdateRetrievalOptInDto } from './dto/update-retrieval-opt-in.dto';
export declare class AccountController {
    private readonly accountService;
    constructor(accountService: AccountService);
    setRetrievalOptIn(user: RequestUser, dto: UpdateRetrievalOptInDto): Promise<{
        userId: string;
        retrievalOptIn: boolean;
        updatedAt: Date;
    }>;
    exportData(user: RequestUser): Promise<{
        exportedAt: string;
        account: {
            id: string;
            email: string;
            retrievalOptIn: boolean;
            createdAt: Date;
        };
        devices: import("../devices/entities/device.entity").Device[];
        events: import("../events/entities/sync-event.entity").SyncEvent[];
    }>;
    delete(user: RequestUser): Promise<{
        deleted: boolean;
        deletedAt: string;
    }>;
}
