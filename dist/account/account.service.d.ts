import { UsersService } from '../users/users.service';
import { DevicesService } from '../devices/devices.service';
import { EventsService } from '../events/events.service';
import type { RequestUser } from '../common/interfaces/request-user.interface';
import { PreferencesService } from '../preferences/preferences.service';
export declare class AccountService {
    private readonly usersService;
    private readonly devicesService;
    private readonly eventsService;
    private readonly preferencesService;
    constructor(usersService: UsersService, devicesService: DevicesService, eventsService: EventsService, preferencesService: PreferencesService);
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
        preferences: {
            schemaVersion: number;
            dayPeriods: {
                morningStartMinutes: number;
                afternoonStartMinutes: number;
                earlyEveningStartMinutes: number;
                nightStartMinutes: number;
            };
            timezoneIdentifier: string | null;
            updatedAt: Date;
        };
        devices: import("../devices/entities/device.entity").Device[];
        events: import("../events/entities/sync-event.entity").SyncEvent[];
    }>;
    deleteAccount(user: RequestUser): Promise<{
        deleted: boolean;
        deletedAt: string;
    }>;
}
