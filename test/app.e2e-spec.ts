import { CanActivate, ExecutionContext, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AccountController } from '../src/account/account.controller';
import { AccountService } from '../src/account/account.service';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { DevicesService } from '../src/devices/devices.service';
import { EventsService } from '../src/events/events.service';
import { SearchController } from '../src/search/search.controller';
import { SearchService } from '../src/search/search.service';
import { SyncController } from '../src/sync/sync.controller';
import { SyncService } from '../src/sync/sync.service';
import { UsersService } from '../src/users/users.service';

class TestJwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    request.user = {
      userId: 'user-123',
      deviceId: 'device-123',
      email: 'ada@example.com',
    };
    return true;
  }
}

describe('HTTP contract (e2e)', () => {
  let app: INestApplication<App>;

  const usersService = {
    findById: jest.fn(),
  };

  const authService = {
    providerLogin: jest.fn(),
  };

  const accountService = {
    setRetrievalOptIn: jest.fn(),
    exportData: jest.fn(),
    deleteAccount: jest.fn(),
  };

  const syncService = {
    push: jest.fn(),
    pull: jest.fn(),
  };

  const eventsService = {
    searchKeyword: jest.fn(),
    searchNatural: jest.fn(),
  };

  const devicesService = {
    assertOwnership: jest.fn(),
  };

  beforeEach(async () => {
    usersService.findById.mockReset();
    authService.providerLogin.mockReset();
    accountService.setRetrievalOptIn.mockReset();
    accountService.exportData.mockReset();
    accountService.deleteAccount.mockReset();
    syncService.push.mockReset();
    syncService.pull.mockReset();
    eventsService.searchKeyword.mockReset();
    eventsService.searchNatural.mockReset();
    devicesService.assertOwnership.mockReset();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [
        AppController,
        AuthController,
        AccountController,
        SearchController,
        SyncController,
      ],
      providers: [
        AppService,
        { provide: AuthService, useValue: authService },
        { provide: AccountService, useValue: accountService },
        SearchService,
        { provide: SyncService, useValue: syncService },
        { provide: UsersService, useValue: usersService },
        { provide: EventsService, useValue: eventsService },
        { provide: DevicesService, useValue: devicesService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(TestJwtAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  it('GET / returns backend status', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({ service: 'kroniku-backend', status: 'ok' });
  });

  it('POST /auth/provider returns a device-bound session for Google or Apple', async () => {
    authService.providerLogin.mockResolvedValue({
      accessToken: 'provider-jwt-token',
      user: {
        id: 'user-123',
        email: 'ada@example.com',
        retrievalOptIn: false,
      },
      device: {
        id: 'device-123',
        clientDeviceId: 'ios-device-001',
      },
      isNewAccount: true,
    });

    await request(app.getHttpServer())
      .post('/auth/provider')
      .send({
        provider: 'google',
        idToken: 'google-identity-token',
        clientDeviceId: 'ios-device-001',
        platform: 'ios',
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.accessToken).toBe('provider-jwt-token');
        expect(body.isNewAccount).toBe(true);
        expect(body.user.email).toBe('ada@example.com');
      });
  });

  it('PATCH /account/retrieval-opt-in updates retrieval flag', async () => {
    accountService.setRetrievalOptIn.mockResolvedValue({
      userId: 'user-123',
      retrievalOptIn: true,
      updatedAt: '2026-08-05T10:25:44.331Z',
    });

    await request(app.getHttpServer())
      .patch('/account/retrieval-opt-in')
      .send({ enabled: true })
      .expect(200)
      .expect(({ body }) => {
        expect(body.userId).toBe('user-123');
        expect(body.retrievalOptIn).toBe(true);
      });
  });

  it('POST /sync/push returns the sync contract envelope', async () => {
    syncService.push.mockResolvedValue({
      contract: {
        payload: 'client-side encrypted blob accepted as opaque ciphertext',
        conflict: 'last-write-wins by version with server-side conflict logging',
      },
      applied: [
        {
          eventId: 'AE0EC1A4-263A-4A1C-9BA5-9A7805F72C4E',
          version: 3,
          updatedAt: '2026-08-05T10:20:33.497Z',
        },
      ],
      conflicts: [],
      ignored: [],
    });

    await request(app.getHttpServer())
      .post('/sync/push')
      .send({
        events: [
          {
            eventId: 'AE0EC1A4-263A-4A1C-9BA5-9A7805F72C4E',
            version: 3,
            occurredAt: '2026-08-05T10:15:00.000Z',
            source: 'voice',
            title: `Memory event ${'with a detailed context '.repeat(20)}`,
            detail: 'Recorded a follow-up note after the meeting.',
            searchText: 'met mr fola follow up note victoria island',
            encryptedPayload: 'base64-or-jwe-ciphertext',
            payloadHash: 'sha256:8c497a8f0b73f7d4c13c0e3c6a7d7a6f',
            isDeleted: false,
          },
        ],
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.contract.payload).toContain('opaque ciphertext');
        expect(body.applied[0].eventId).toBe('AE0EC1A4-263A-4A1C-9BA5-9A7805F72C4E');
      });
  });

  it('GET /sync/pull returns event rows and cursor', async () => {
    syncService.pull.mockResolvedValue({
      events: [
        {
          id: 'event-1',
          userId: 'user-123',
          deviceId: 'device-123',
          eventId: 'client-event-1',
          version: 3,
          occurredAt: '2026-08-05T10:15:00.000Z',
          source: 'voice',
          title: 'Met Mr. Fola',
          detail: 'Recorded a follow-up note after the meeting.',
          searchText: 'met mr fola follow up note victoria island',
          encryptedPayload: 'ciphertext',
          payloadHash: 'hash',
          isDeleted: false,
          createdAt: '2026-08-05T10:20:33.497Z',
          updatedAt: '2026-08-05T10:20:33.497Z',
        },
      ],
      cursor: '2026-08-05T10:20:33.497Z',
    });

    await request(app.getHttpServer())
      .get('/sync/pull')
      .query({ since: '2026-08-05T00:00:00.000Z' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.cursor).toBe('2026-08-05T10:20:33.497Z');
        expect(body.events).toHaveLength(1);
        expect(body.events[0].title).toBe('Met Mr. Fola');
      });
  });

  it('POST /search/natural rejects when retrieval opt-in is disabled', async () => {
    usersService.findById.mockResolvedValue({
      id: 'user-123',
      email: 'ada@example.com',
      retrievalOptIn: false,
    });

    await request(app.getHttpServer())
      .post('/search/natural')
      .send({ query: 'When did I meet Mr. Fola?' })
      .expect(403)
      .expect(({ body }) => {
        expect(body.message).toBe('Natural-language retrieval is disabled for this account');
      });
  });

  it('POST /search/natural returns ranked retrieval results when opt-in is enabled', async () => {
    usersService.findById.mockResolvedValue({
      id: 'user-123',
      email: 'ada@example.com',
      retrievalOptIn: true,
    });

    eventsService.searchNatural.mockResolvedValue([
      {
        event: {
          id: 'event-1',
          userId: 'user-123',
          deviceId: 'device-123',
          eventId: 'client-event-1',
          version: 3,
          occurredAt: new Date('2026-08-05T10:15:00.000Z'),
          source: 'voice',
          title: 'Met Mr. Fola',
          detail: 'Recorded a follow-up note after the meeting.',
          searchText: 'met mr fola follow up note victoria island',
          encryptedPayload: 'ciphertext',
          payloadHash: 'hash',
          isDeleted: false,
          createdAt: new Date('2026-08-05T10:20:33.497Z'),
          updatedAt: new Date('2026-08-05T10:20:33.497Z'),
        },
        score: 2.25,
      },
    ]);

    await request(app.getHttpServer())
      .post('/search/natural')
      .send({ query: 'When did I meet Mr. Fola in Victoria Island?', limit: 5 })
      .expect(201)
      .expect(({ body }) => {
        expect(body.mode).toBe('retrieval-first');
        expect(body.query).toBe('When did I meet Mr. Fola in Victoria Island?');
        expect(body.count).toBe(1);
        expect(body.rationale).toContain('MySQL full-text retrieval');
        expect(body.results[0].event.title).toBe('Met Mr. Fola');
        expect(body.results[0].score).toBeGreaterThan(0);
      });
  });

  it('GET /account/export returns account data envelope', async () => {
    accountService.exportData.mockResolvedValue({
      exportedAt: '2026-08-05T10:30:00.000Z',
      account: {
        id: 'user-123',
        email: 'ada@example.com',
        retrievalOptIn: true,
        createdAt: '2026-08-05T10:00:00.000Z',
      },
      devices: [
        {
          id: 'device-123',
          clientDeviceId: 'ios-device-001',
        },
      ],
      events: [],
    });

    await request(app.getHttpServer())
      .get('/account/export')
      .expect(200)
      .expect(({ body }) => {
        expect(body.account.email).toBe('ada@example.com');
        expect(body.devices).toHaveLength(1);
      });
  });

  it('DELETE /account returns deletion receipt', async () => {
    accountService.deleteAccount.mockResolvedValue({
      deleted: true,
      deletedAt: '2026-08-05T10:32:00.010Z',
    });

    await request(app.getHttpServer())
      .delete('/account')
      .expect(200)
      .expect(({ body }) => {
        expect(body.deleted).toBe(true);
        expect(body.deletedAt).toBe('2026-08-05T10:32:00.010Z');
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
