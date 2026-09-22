import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { LogLevel } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DevicesModule } from './devices/devices.module';
import { SyncModule } from './sync/sync.module';
import { SearchModule } from './search/search.module';
import { AccountModule } from './account/account.module';
import { EventsModule } from './events/events.module';
import { User } from './users/entities/user.entity';
import { Device } from './devices/entities/device.entity';
import { SyncEvent } from './events/entities/sync-event.entity';
import { SyncConflict } from './events/entities/sync-conflict.entity';
import { AuthIdentity } from './auth/entities/auth-identity.entity';
import { UserPreferences } from './preferences/entities/user-preferences.entity';
import { PreferencesModule } from './preferences/preferences.module';
import { NamedPlace } from './places/entities/named-place.entity';
import { PlacesModule } from './places/places.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql' as const,
        host: configService.get<string>('MYSQL_HOST', '127.0.0.1'),
        port: configService.get<number>('MYSQL_PORT', 3306),
        username: configService.get<string>('MYSQL_USER', 'root'),
        password: configService.get<string>('MYSQL_PASSWORD', ''),
        database: configService.get<string>('MYSQL_DATABASE', 'kroniku'),
        // Without this, mysql2 reads/writes `datetime` columns using the Node process's local
        // system timezone instead of UTC, silently shifting every timestamp by that offset.
        timezone: 'Z',
        entities: [User, Device, SyncEvent, SyncConflict, AuthIdentity, UserPreferences, NamedPlace],
        synchronize: configService.get<string>('DB_SYNC', 'false') === 'true',
        logging: configService
          .get<string>('DB_LOGGING', 'error,warn')
          .split(',')
          .map((level) => level.trim())
          .filter((level): level is LogLevel =>
            ['query', 'schema', 'error', 'warn', 'info', 'log', 'migration'].includes(level),
          ),
      }),
    }),
    CommonModule,
    UsersModule,
    AuthModule,
    DevicesModule,
    SyncModule,
    SearchModule,
    AccountModule,
    EventsModule,
    PreferencesModule,
    PlacesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
