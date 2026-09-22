import { SyncEvent } from '../events/entities/sync-event.entity';
import {
  expandNaturalTerms,
  rerankNaturalResults,
  tokenizeNaturalQuery,
} from './search.service';

function makeEvent(overrides: Partial<SyncEvent>): SyncEvent {
  return {
    id: 'event-id',
    userId: 'user-id',
    user: undefined as never,
    deviceId: null,
    device: null,
    eventId: 'client-event-id',
    version: 1,
    occurredAt: new Date('2026-08-05T12:00:00.000Z'),
    source: 'manual',
    title: 'Untitled',
    detail: null,
    searchText: null,
    contextData: null,
    encryptedPayload: 'ciphertext',
    payloadHash: 'hash',
    isDeleted: false,
    createdAt: new Date('2026-08-05T12:00:00.000Z'),
    updatedAt: new Date('2026-08-05T12:00:00.000Z'),
    ...overrides,
  };
}

describe('search ranking helpers', () => {
  it('tokenizes a natural query into normalized terms', () => {
    expect(tokenizeNaturalQuery('When did I meet Mr. Fola in Victoria Island?')).toEqual([
      'when',
      'did',
      'meet',
      'mr',
      'fola',
      'in',
      'victoria',
      'island',
    ]);
  });

  it('expands common synonyms for fallback retrieval', () => {
    expect(expandNaturalTerms(['call', 'meeting'])).toEqual(
      expect.arrayContaining(['call', 'phone', 'dial', 'meeting', 'meet', 'met']),
    );
  });

  it('prefers recent exact lexical matches over older synonym-only matches', () => {
    const query = 'phone call with Sarah';
    const terms = tokenizeNaturalQuery(query);
    const referenceDate = new Date('2026-08-05T12:00:00.000Z');

    const ranked = rerankNaturalResults(
      [
        {
          event: makeEvent({
            id: 'older-call',
            title: 'Call with Sarah',
            searchText: 'phone call sarah project update',
            occurredAt: new Date('2026-05-01T12:00:00.000Z'),
          }),
          score: 0.6,
        },
        {
          event: makeEvent({
            id: 'recent-meeting',
            title: 'Meeting with Sarah',
            searchText: 'met sarah for project update',
            occurredAt: new Date('2026-08-04T12:00:00.000Z'),
          }),
          score: 0.6,
        },
      ],
      query,
      terms,
      referenceDate,
    );

    expect(ranked[0]?.event.id).toBe('older-call');
    expect(ranked[0]?.score).toBeGreaterThan(ranked[1]?.score ?? 0);
  });

  it('excludes events that omit a named person even when a generic word like "meeting" matches', () => {
    const query = 'When did I have a meeting with Ademola';
    const terms = tokenizeNaturalQuery(query);
    const referenceDate = new Date('2026-09-22T12:00:00.000Z');

    const ranked = rerankNaturalResults(
      [
        {
          event: makeEvent({
            id: 'meeting-with-ademola',
            title: 'Meeting',
            detail: 'Ademola',
            occurredAt: new Date('2026-09-10T12:00:00.000Z'),
          }),
          score: 1,
        },
        {
          event: makeEvent({
            id: 'meeting-with-someone-else',
            title: 'Meeting',
            detail: 'Chidi',
            occurredAt: new Date('2026-09-15T12:00:00.000Z'),
          }),
          score: 1,
        },
      ],
      query,
      terms,
      referenceDate,
    );

    expect(ranked).toHaveLength(1);
    expect(ranked[0]?.event.id).toBe('meeting-with-ademola');
  });
});
