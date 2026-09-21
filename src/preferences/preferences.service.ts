import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { RequestUser } from '../common/interfaces/request-user.interface';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UserPreferences } from './entities/user-preferences.entity';

const DEFAULT_DAY_PERIODS = {
  morningStartMinutes: 360,
  afternoonStartMinutes: 720,
  earlyEveningStartMinutes: 960,
  nightStartMinutes: 1260,
};

@Injectable()
export class PreferencesService {
  constructor(
    @InjectRepository(UserPreferences)
    private readonly preferencesRepository: Repository<UserPreferences>,
  ) {}

  async getPreferences(user: RequestUser) {
    const preferences = await this.getOrCreate(user.userId);
    return this.toResponse(preferences);
  }

  async updatePreferences(user: RequestUser, dto: UpdatePreferencesDto) {
    const preferences = await this.getOrCreate(user.userId);
    const dayPeriods = {
      morningStartMinutes:
        dto.dayPeriods?.morningStartMinutes ?? preferences.morningStartMinutes,
      afternoonStartMinutes:
        dto.dayPeriods?.afternoonStartMinutes ??
        preferences.afternoonStartMinutes,
      earlyEveningStartMinutes:
        dto.dayPeriods?.earlyEveningStartMinutes ??
        preferences.earlyEveningStartMinutes,
      nightStartMinutes:
        dto.dayPeriods?.nightStartMinutes ?? preferences.nightStartMinutes,
    };

    this.validateDayPeriods(dayPeriods);
    Object.assign(preferences, dayPeriods);
    if (dto.timezoneIdentifier !== undefined) {
      preferences.timezoneIdentifier = dto.timezoneIdentifier;
    }

    return this.toResponse(await this.preferencesRepository.save(preferences));
  }

  async findForUser(userId: string): Promise<UserPreferences | null> {
    return this.preferencesRepository.findOne({ where: { userId } });
  }

  private async getOrCreate(userId: string): Promise<UserPreferences> {
    const existing = await this.findForUser(userId);
    if (existing) {
      return existing;
    }

    return this.preferencesRepository.save(
      this.preferencesRepository.create({
        userId,
        ...DEFAULT_DAY_PERIODS,
        timezoneIdentifier: null,
        schemaVersion: 1,
      }),
    );
  }

  private validateDayPeriods(dayPeriods: typeof DEFAULT_DAY_PERIODS): void {
    const starts = Object.values(dayPeriods);
    if (starts.some((minutes) => minutes < 0 || minutes > 1439)) {
      throw new BadRequestException(
        'Day period starts must be between 0 and 1439 minutes',
      );
    }
    if (
      starts.some((minutes, index) => index > 0 && minutes <= starts[index - 1])
    ) {
      throw new BadRequestException(
        'Day period starts must be strictly increasing',
      );
    }
  }

  private toResponse(preferences: UserPreferences) {
    return {
      schemaVersion: preferences.schemaVersion,
      dayPeriods: {
        morningStartMinutes: preferences.morningStartMinutes,
        afternoonStartMinutes: preferences.afternoonStartMinutes,
        earlyEveningStartMinutes: preferences.earlyEveningStartMinutes,
        nightStartMinutes: preferences.nightStartMinutes,
      },
      timezoneIdentifier: preferences.timezoneIdentifier,
      updatedAt: preferences.updatedAt,
    };
  }
}
