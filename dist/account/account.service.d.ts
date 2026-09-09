import { UsersService } from '../users/users.service';
import { DevicesService } from '../devices/devices.service';
import { EventsService } from '../events/events.service';
import type { RequestUser } from '../common/interfaces/request-user.interface';
export declare class AccountService {
    private readonly usersService;
    private readonly devicesService;
    private readonly eventsService;
    constructor(usersService: UsersService, devicesService: DevicesService, eventsService: EventsService);
    setRetrievalOptIn(user: RequestUser, enabled: boolean): Promise<{
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
    deleteAccount(user: RequestUser): Promise<{
        deleted: boolean;
        deletedAt: string;
    }>;
}
