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
  entities: [User, Device, SyncEvent, SyncConflict, AuthIdentity],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: false,
});
