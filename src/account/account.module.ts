import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { UsersModule } from '../users/users.module';
import { DevicesModule } from '../devices/devices.module';
import { EventsModule } from '../events/events.module';
import { PreferencesModule } from '../preferences/preferences.module';

@Module({
  imports: [UsersModule, DevicesModule, EventsModule, PreferencesModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
