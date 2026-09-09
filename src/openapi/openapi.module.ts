import { Module } from '@nestjs/common';
import { AccountController } from '../account/account.controller';
import { AccountService } from '../account/account.service';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { EventsService } from '../events/events.service';
import { SearchController } from '../search/search.controller';
import { SearchService } from '../search/search.service';
import { SyncController } from '../sync/sync.controller';
import { SyncService } from '../sync/sync.service';
import { UsersService } from '../users/users.service';
import { DevicesService } from '../devices/devices.service';

@Module({
  controllers: [
    AppController,
    AuthController,
    SyncController,
    SearchController,
    AccountController,
  ],
  providers: [
    AppService,
    { provide: AuthService, useValue: {} },
    { provide: SyncService, useValue: {} },
    { provide: AccountService, useValue: {} },
    { provide: SearchService, useValue: {} },
    { provide: UsersService, useValue: {} },
    { provide: DevicesService, useValue: {} },
    { provide: EventsService, useValue: {} },
  ],
})
export class OpenApiModule {}
