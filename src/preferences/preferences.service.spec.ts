import type { RequestUser } from '../common/interfaces/request-user.interface';
import { UserPreferences } from './entities/user-preferences.entity';
import { PreferencesService } from './preferences.service';

const user: RequestUser = {
  userId: 'user-id',
  deviceId: 'device-id',
  email: 'user@example.com',
};

function makeRepository(existing: UserPreferences | null = null) {
  return {
    findOne: jest.fn().mockResolvedValue(existing),
    create: jest.fn((value: Partial<UserPreferences>) => value),
    save: jest.fn(async (value: UserPreferences) => ({
      ...value,
      updatedAt: value.updatedAt ?? new Date('2026-09-10T00:00:00.000Z'),
    })),
  };
}

describe('PreferencesService', () => {
  it('returns the default schedule for a user without stored preferences', async () => {
    const repository = makeRepository();
    const service = new PreferencesService(repository as never);

    await expect(service.getPreferences(user)).resolves.toMatchObject({
      schemaVersion: 1,
      dayPeriods: {
        morningStartMinutes: 360,
        afternoonStartMinutes: 720,
        earlyEveningStartMinutes: 960,
        nightStartMinutes: 1260,
      },
    });
  });

  it('merges partial updates and rejects non-increasing schedules', async () => {
    const existing = {
      userId: user.userId,
      morningStartMinutes: 360,
      afternoonStartMinutes: 720,
      earlyEveningStartMinutes: 960,
      nightStartMinutes: 1260,
      timezoneIdentifier: null,
      schemaVersion: 1,
      updatedAt: new Date('2026-09-10T00:00:00.000Z'),
    } as UserPreferences;
    const repository = makeRepository(existing);
    const service = new PreferencesService(repository as never);

    await expect(
      service.updatePreferences(user, {
        dayPeriods: { afternoonStartMinutes: 600 },
      }),
    ).resolves.toMatchObject({
      dayPeriods: expect.objectContaining({ afternoonStartMinutes: 600 }),
    });

    await expect(
      service.updatePreferences(user, {
        dayPeriods: { morningStartMinutes: 720 },
      }),
    ).rejects.toThrow('strictly increasing');
  });
});
