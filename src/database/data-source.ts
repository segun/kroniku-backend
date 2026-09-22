import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Device } from '../devices/entities/device.entity';
import { SyncConflict } from '../events/entities/sync-conflict.entity';
import { SyncEvent } from '../events/entities/sync-event.entity';
import { User } from '../users/entities/user.entity';
import { AuthIdentity } from '../auth/entities/auth-identity.entity';

const mysqlPort = Number(process.env.MYSQL_PORT ?? 3306);

export default new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST ?? '127.0.0.1',
  port: Number.isNaN(mysqlPort) ? 3306 : mysqlPort,
  username: process.env.MYSQL_USER ?? 'kroniku',
  password: process.env.MYSQL_PASSWORD ?? 'kroniku',
  database: process.env.MYSQL_DATABASE ?? 'kroniku',
  // Keep in sync with app.module.ts's datasource config — without this, mysql2 reads/writes
  // `datetime` columns using the local system timezone instead of UTC.
  timezone: 'Z',
  entities: [User, Device, SyncEvent, SyncConflict, AuthIdentity],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: false,
});
