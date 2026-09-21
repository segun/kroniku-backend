import type { DeepPartial, Repository } from 'typeorm';
import { EventsService } from './events.service';
import { SyncConflict } from './entities/sync-conflict.entity';
import { SyncEvent } from './entities/sync-event.entity';

describe('EventsService', () => {
  it('persists structured moment context without photo bytes', async () => {
    const updatedAt = new Date('2026-09-21T12:00:00.000Z');
    const createEvent = jest.fn(
      (value: DeepPartial<SyncEvent>): SyncEvent => value as SyncEvent,
    );
    const saveEvent = jest.fn((value: SyncEvent): Promise<SyncEvent> =>
      Promise.resolve({ ...value, updatedAt }),
    );
    const eventsRepository = {
      findOne: jest.fn().mockResolvedValue(null),
      create: createEvent,
      save: saveEvent,
    } as unknown as Repository<SyncEvent>;
    const conflictsRepository = {
      create: jest.fn(
        (value: DeepPartial<SyncConflict>): SyncConflict =>
          value as SyncConflict,
      ),
      save: jest.fn(),
    } as unknown as Repository<SyncConflict>;
    const service = new EventsService(eventsRepository, conflictsRepository);

    const contextData = {
      place: { name: 'Victoria Island', latitude: 6.4281, longitude: 3.4219 },
      weather: {
        observedAt: '2026-09-21T11:55:00.000Z',
        condition: 'Clear',
        temperatureC: 29,
      },
      motion: 'walking',
      timeSemantics: ['sunset'],
      photoReferences: [
        {
          assetIdentifier: 'photos-local-identifier',
          filename: 'IMG_1001.HEIC',
          addedAt: '2026-09-21T12:00:00.000Z',
        },
      ],
    };

    await service.applySyncBatch('user-id', 'device-id', [
      {
        eventId: 'event-id',
        version: 1,
        contextData,
        encryptedPayload: 'opaque-payload',
        payloadHash: 'payload-hash',
      },
    ]);

    expect(createEvent).toHaveBeenCalledWith(
      expect.objectContaining({ contextData }),
    );
    expect(JSON.stringify(contextData)).not.toContain('imageData');
  });
});
