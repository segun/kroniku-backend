"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const devices_service_1 = require("../devices/devices.service");
const events_service_1 = require("../events/events.service");
const preferences_service_1 = require("../preferences/preferences.service");
let AccountService = class AccountService {
    usersService;
    devicesService;
    eventsService;
    preferencesService;
    constructor(usersService, devicesService, eventsService, preferencesService) {
        this.usersService = usersService;
        this.devicesService = devicesService;
        this.eventsService = eventsService;
        this.preferencesService = preferencesService;
    }
    async setRetrievalOptIn(user, enabled) {
        const updated = await this.usersService.setRetrievalOptIn(user.userId, enabled);
        if (!updated) {
            throw new common_1.NotFoundException('Account not found');
        }
        return {
            userId: updated.id,
            retrievalOptIn: updated.retrievalOptIn,
            updatedAt: updated.updatedAt,
        };
    }
    async exportData(user) {
        const account = await this.usersService.findById(user.userId);
        if (!account) {
            throw new common_1.NotFoundException('Account not found');
        }
        const [devices, events, preferences] = await Promise.all([
            this.devicesService.findByUserId(user.userId),
            this.eventsService.findAllForUser(user.userId),
            this.preferencesService.getPreferences(user),
        ]);
        return {
            exportedAt: new Date().toISOString(),
            account: {
                id: account.id,
                email: account.email,
                retrievalOptIn: account.retrievalOptIn,
                createdAt: account.createdAt,
            },
            preferences,
            devices,
            events,
        };
    }
    async deleteAccount(user) {
        const account = await this.usersService.findById(user.userId);
        if (!account) {
            throw new common_1.NotFoundException('Account not found');
        }
        await this.usersService.deleteById(user.userId);
        return {
            deleted: true,
            deletedAt: new Date().toISOString(),
        };
    }
};
exports.AccountService = AccountService;
exports.AccountService = AccountService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        devices_service_1.DevicesService,
        events_service_1.EventsService,
        preferences_service_1.PreferencesService])
], AccountService);
//# sourceMappingURL=account.service.js.map