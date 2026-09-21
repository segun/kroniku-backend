import { Device } from '../../devices/entities/device.entity';
import { User } from '../../users/entities/user.entity';
import type { SyncEventContextDto } from '../../sync/dto/push-sync.dto';
export declare class SyncEvent {
    id: string;
    userId: string;
    user: User;
    deviceId: string | null;
    device: Device | null;
    eventId: string;
    version: number;
    occurredAt: Date | null;
    source: string | null;
    title: string | null;
    detail: string | null;
    searchText: string | null;
    contextData: SyncEventContextDto | null;
    encryptedPayload: string;
    payloadHash: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
