export declare class UpdateDayPeriodsDto {
    morningStartMinutes?: number;
    afternoonStartMinutes?: number;
    earlyEveningStartMinutes?: number;
    nightStartMinutes?: number;
}
export declare class UpdatePreferencesDto {
    dayPeriods?: UpdateDayPeriodsDto;
    timezoneIdentifier?: string | null;
}
