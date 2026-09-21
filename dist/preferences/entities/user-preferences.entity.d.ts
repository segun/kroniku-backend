import { User } from '../../users/entities/user.entity';
export declare class UserPreferences {
    userId: string;
    user: User;
    morningStartMinutes: number;
    afternoonStartMinutes: number;
    earlyEveningStartMinutes: number;
    nightStartMinutes: number;
    timezoneIdentifier: string | null;
    schemaVersion: number;
    createdAt: Date;
    updatedAt: Date;
}
