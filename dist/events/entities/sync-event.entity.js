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
exports.SyncEvent = void 0;
const typeorm_1 = require("typeorm");
const device_entity_1 = require("../../devices/entities/device.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let SyncEvent = class SyncEvent {
    id;
    userId;
    user;
    deviceId;
    device;
    eventId;
    version;
    occurredAt;
    source;
    title;
    detail;
    searchText;
    encryptedPayload;
    payloadHash;
    isDeleted;
    createdAt;
    updatedAt;
};
exports.SyncEvent = SyncEvent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SyncEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], SyncEvent.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], SyncEvent.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], SyncEvent.prototype, "deviceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => device_entity_1.Device, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'deviceId' }),
    __metadata("design:type", Object)
], SyncEvent.prototype, "device", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 80 }),
    __metadata("design:type", String)
], SyncEvent.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], SyncEvent.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], SyncEvent.prototype, "occurredAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 80, nullable: true }),
    __metadata("design:type", Object)
], SyncEvent.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], SyncEvent.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], SyncEvent.prototype, "detail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], SyncEvent.prototype, "searchText", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], SyncEvent.prototype, "encryptedPayload", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 128 }),
    __metadata("design:type", String)
], SyncEvent.prototype, "payloadHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], SyncEvent.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime' }),
    __metadata("design:type", Date)
], SyncEvent.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'datetime' }),
    __metadata("design:type", Date)
], SyncEvent.prototype, "updatedAt", void 0);
exports.SyncEvent = SyncEvent = __decorate([
    (0, typeorm_1.Entity)({ name: 'sync_events' }),
    (0, typeorm_1.Unique)(['userId', 'eventId'])
], SyncEvent);
//# sourceMappingURL=sync-event.entity.js.map