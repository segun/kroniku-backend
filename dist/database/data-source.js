"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const typeorm_1 = require("typeorm");
const device_entity_1 = require("../devices/entities/device.entity");
const sync_conflict_entity_1 = require("../events/entities/sync-conflict.entity");
const sync_event_entity_1 = require("../events/entities/sync-event.entity");
const user_entity_1 = require("../users/entities/user.entity");
const auth_identity_entity_1 = require("../auth/entities/auth-identity.entity");
const mysqlPort = Number(process.env.MYSQL_PORT ?? 3306);
exports.default = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.MYSQL_HOST ?? '127.0.0.1',
    port: Number.isNaN(mysqlPort) ? 3306 : mysqlPort,
    username: process.env.MYSQL_USER ?? 'kroniku',
    password: process.env.MYSQL_PASSWORD ?? 'kroniku',
    database: process.env.MYSQL_DATABASE ?? 'kroniku',
    entities: [user_entity_1.User, device_entity_1.Device, sync_event_entity_1.SyncEvent, sync_conflict_entity_1.SyncConflict, auth_identity_entity_1.AuthIdentity],
    migrations: ['src/database/migrations/*{.ts,.js}'],
    synchronize: false,
    logging: false,
});
//# sourceMappingURL=data-source.js.map