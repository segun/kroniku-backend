import { Repository } from 'typeorm';
import type { RequestUser } from '../common/interfaces/request-user.interface';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UserPreferences } from './entities/user-preferences.entity';
export declare class PreferencesService {
    private readonly preferencesRepository;
    constructor(preferencesRepository: Repository<UserPreferences>);
    getPreferences(user: RequestUser): Promise<{
        schemaVersion: number;
        dayPeriods: {
            morningStartMinutes: number;
            afternoonStartMinutes: number;
            earlyEveningStartMinutes: number;
            nightStartMinutes: number;
        };
        timezoneIdentifier: string | null;
        updatedAt: Date;
    }>;
    updatePreferences(user: RequestUser, dto: UpdatePreferencesDto): Promise<{
        schemaVersion: number;
        dayPeriods: {
            morningStartMinutes: number;
            afternoonStartMinutes: number;
            earlyEveningStartMinutes: number;
            nightStartMinutes: number;
        };
        timezoneIdentifier: string | null;
        updatedAt: Date;
    }>;
    findForUser(userId: string): Promise<UserPreferences | null>;
    private getOrCreate;
    private validateDayPeriods;
    private toResponse;
}
