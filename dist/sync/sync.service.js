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
exports.SyncService = void 0;
const common_1 = require("@nestjs/common");
const events_service_1 = require("../events/events.service");
const devices_service_1 = require("../devices/devices.service");
let SyncService = class SyncService {
    eventsService;
    devicesService;
    constructor(eventsService, devicesService) {
        this.eventsService = eventsService;
        this.devicesService = devicesService;
    }
    async push(user, dto) {
        await this.devicesService.assertOwnership(user.deviceId, user.userId);
        const result = await this.eventsService.applySyncBatch(user.userId, user.deviceId, dto.events);
        return {
            contract: {
                payload: 'client-side encrypted blob accepted as opaque ciphertext',
                conflict: 'last-write-wins by version with server-side conflict logging',
            },
            ...result,
        };
    }
    async pull(user, dto) {
        await this.devicesService.assertOwnership(user.deviceId, user.userId);
        const since = dto.since ? new Date(dto.since) : undefined;
        const events = await this.eventsService.pullEvents(user.userId, since);
        return {
            events,
            cursor: events.length > 0 ? events[events.length - 1].updatedAt.toISOString() : dto.since ?? null,
        };
    }
};
exports.SyncService = SyncService;
exports.SyncService = SyncService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [events_service_1.EventsService,
        devices_service_1.DevicesService])
], SyncService);
//# sourceMappingURL=sync.service.js.map