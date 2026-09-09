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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const device_entity_1 = require("./entities/device.entity");
let DevicesService = class DevicesService {
    devicesRepository;
    constructor(devicesRepository) {
        this.devicesRepository = devicesRepository;
    }
    async upsertForUser(userId, dto) {
        const existing = await this.devicesRepository.findOne({
            where: { userId, clientDeviceId: dto.clientDeviceId },
        });
        if (existing) {
            existing.platform = dto.platform ?? existing.platform;
            existing.appVersion = dto.appVersion ?? existing.appVersion;
            existing.publicKey = dto.publicKey ?? existing.publicKey;
            existing.lastSeenAt = new Date();
            return this.devicesRepository.save(existing);
        }
        const created = this.devicesRepository.create({
            userId,
            clientDeviceId: dto.clientDeviceId,
            platform: dto.platform ?? null,
            appVersion: dto.appVersion ?? null,
            publicKey: dto.publicKey ?? null,
            lastSeenAt: new Date(),
        });
        return this.devicesRepository.save(created);
    }
    async assertOwnership(deviceId, userId) {
        const device = await this.devicesRepository.findOne({
            where: { id: deviceId, userId },
        });
        if (!device) {
            throw new common_1.UnauthorizedException('Device token is not valid for this account');
        }
    }
    findByUserId(userId) {
        return this.devicesRepository.find({ where: { userId }, order: { createdAt: 'ASC' } });
    }
};
exports.DevicesService = DevicesService;
exports.DevicesService = DevicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(device_entity_1.Device)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DevicesService);
//# sourceMappingURL=devices.service.js.map