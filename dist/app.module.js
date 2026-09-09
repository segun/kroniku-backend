"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const common_module_1 = require("./common/common.module");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const devices_module_1 = require("./devices/devices.module");
const sync_module_1 = require("./sync/sync.module");
const search_module_1 = require("./search/search.module");
const account_module_1 = require("./account/account.module");
const events_module_1 = require("./events/events.module");
const user_entity_1 = require("./users/entities/user.entity");
const device_entity_1 = require("./devices/entities/device.entity");
const sync_event_entity_1 = require("./events/entities/sync-event.entity");
const sync_conflict_entity_1 = require("./events/entities/sync-conflict.entity");
const auth_identity_entity_1 = require("./auth/entities/auth-identity.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'mysql',
                    host: configService.get('MYSQL_HOST', '127.0.0.1'),
                    port: configService.get('MYSQL_PORT', 3306),
                    username: configService.get('MYSQL_USER', 'root'),
                    password: configService.get('MYSQL_PASSWORD', ''),
                    database: configService.get('MYSQL_DATABASE', 'kroniku'),
                    entities: [user_entity_1.User, device_entity_1.Device, sync_event_entity_1.SyncEvent, sync_conflict_entity_1.SyncConflict, auth_identity_entity_1.AuthIdentity],
                    synchronize: configService.get('DB_SYNC', 'false') === 'true',
                }),
            }),
            common_module_1.CommonModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            devices_module_1.DevicesModule,
            sync_module_1.SyncModule,
            search_module_1.SearchModule,
            account_module_1.AccountModule,
            events_module_1.EventsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map