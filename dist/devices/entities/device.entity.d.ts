import { User } from '../../users/entities/user.entity';
export declare class Device {
    id: string;
    userId: string;
    user: User;
    clientDeviceId: string;
    platform: string | null;
    appVersion: string | null;
    publicKey: string | null;
    lastSeenAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
