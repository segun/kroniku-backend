import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { UsersModule } from '../users/users.module';
import { DevicesModule } from '../devices/devices.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [UsersModule, DevicesModule, EventsModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
