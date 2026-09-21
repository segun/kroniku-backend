import type { RequestUser } from '../common/interfaces/request-user.interface';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { PreferencesService } from './preferences.service';
export declare class PreferencesController {
    private readonly preferencesService;
    constructor(preferencesService: PreferencesService);
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
}
