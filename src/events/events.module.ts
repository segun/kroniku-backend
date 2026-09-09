import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { SyncEvent } from './entities/sync-event.entity';
import { SyncConflict } from './entities/sync-conflict.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SyncEvent, SyncConflict])],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
