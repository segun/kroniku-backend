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
exports.SyncConflict = void 0;
const typeorm_1 = require("typeorm");
const device_entity_1 = require("../../devices/entities/device.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let SyncConflict = class SyncConflict {
    id;
    userId;
    user;
    eventId;
    incomingDeviceId;
    incomingDevice;
    incomingVersion;
    serverVersion;
    strategy;
    incomingPayloadHash;
    serverPayloadHash;
    createdAt;
};
exports.SyncConflict = SyncConflict;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SyncConflict.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], SyncConflict.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], SyncConflict.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 80 }),
    __metadata("design:type", String)
], SyncConflict.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], SyncConflict.prototype, "incomingDeviceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => device_entity_1.Device, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'incomingDeviceId' }),
    __metadata("design:type", Object)
], SyncConflict.prototype, "incomingDevice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], SyncConflict.prototype, "incomingVersion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], SyncConflict.prototype, "serverVersion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 40 }),
    __metadata("design:type", String)
], SyncConflict.prototype, "strategy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 128, nullable: true }),
    __metadata("design:type", Object)
], SyncConflict.prototype, "incomingPayloadHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 128, nullable: true }),
    __metadata("design:type", Object)
], SyncConflict.prototype, "serverPayloadHash", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime' }),
    __metadata("design:type", Date)
], SyncConflict.prototype, "createdAt", void 0);
exports.SyncConflict = SyncConflict = __decorate([
    (0, typeorm_1.Entity)({ name: 'sync_conflicts' })
], SyncConflict);
//# sourceMappingURL=sync-conflict.entity.js.map