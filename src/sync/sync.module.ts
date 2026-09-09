import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { EventsModule } from '../events/events.module';
import { DevicesModule } from '../devices/devices.module';

@Module({
  imports: [EventsModule, DevicesModule],
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}
