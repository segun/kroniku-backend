"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiModule = void 0;
const common_1 = require("@nestjs/common");
const account_controller_1 = require("../account/account.controller");
const account_service_1 = require("../account/account.service");
const app_controller_1 = require("../app.controller");
const app_service_1 = require("../app.service");
const auth_controller_1 = require("../auth/auth.controller");
const auth_service_1 = require("../auth/auth.service");
const events_service_1 = require("../events/events.service");
const search_controller_1 = require("../search/search.controller");
const search_service_1 = require("../search/search.service");
const sync_controller_1 = require("../sync/sync.controller");
const sync_service_1 = require("../sync/sync.service");
const users_service_1 = require("../users/users.service");
const devices_service_1 = require("../devices/devices.service");
const preferences_controller_1 = require("../preferences/preferences.controller");
const preferences_service_1 = require("../preferences/preferences.service");
let OpenApiModule = class OpenApiModule {
};
exports.OpenApiModule = OpenApiModule;
exports.OpenApiModule = OpenApiModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            app_controller_1.AppController,
            auth_controller_1.AuthController,
            sync_controller_1.SyncController,
            search_controller_1.SearchController,
            account_controller_1.AccountController,
            preferences_controller_1.PreferencesController,
        ],
        providers: [
            app_service_1.AppService,
            { provide: auth_service_1.AuthService, useValue: {} },
            { provide: sync_service_1.SyncService, useValue: {} },
            { provide: account_service_1.AccountService, useValue: {} },
            { provide: search_service_1.SearchService, useValue: {} },
            { provide: users_service_1.UsersService, useValue: {} },
            { provide: devices_service_1.DevicesService, useValue: {} },
            { provide: events_service_1.EventsService, useValue: {} },
            { provide: preferences_service_1.PreferencesService, useValue: {} },
        ],
    })
], OpenApiModule);
//# sourceMappingURL=openapi.module.js.map