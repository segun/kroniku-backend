import { Device } from '../../devices/entities/device.entity';
import { User } from '../../users/entities/user.entity';
export declare class SyncConflict {
    id: string;
    userId: string;
    user: User;
    eventId: string;
    incomingDeviceId: string | null;
    incomingDevice: Device | null;
    incomingVersion: number;
    serverVersion: number;
    strategy: 'ignored_stale' | 'same_version_conflict';
    incomingPayloadHash: string | null;
    serverPayloadHash: string | null;
    createdAt: Date;
}
