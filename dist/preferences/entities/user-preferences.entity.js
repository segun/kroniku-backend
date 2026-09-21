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
exports.UserPreferences = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let UserPreferences = class UserPreferences {
    userId;
    user;
    morningStartMinutes;
    afternoonStartMinutes;
    earlyEveningStartMinutes;
    nightStartMinutes;
    timezoneIdentifier;
    schemaVersion;
    createdAt;
    updatedAt;
};
exports.UserPreferences = UserPreferences;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'varchar', length: 36 }),
    __metadata("design:type", String)
], UserPreferences.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], UserPreferences.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 360 }),
    __metadata("design:type", Number)
], UserPreferences.prototype, "morningStartMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 720 }),
    __metadata("design:type", Number)
], UserPreferences.prototype, "afternoonStartMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 960 }),
    __metadata("design:type", Number)
], UserPreferences.prototype, "earlyEveningStartMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1260 }),
    __metadata("design:type", Number)
], UserPreferences.prototype, "nightStartMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 120, nullable: true }),
    __metadata("design:type", Object)
], UserPreferences.prototype, "timezoneIdentifier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], UserPreferences.prototype, "schemaVersion", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime' }),
    __metadata("design:type", Date)
], UserPreferences.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'datetime' }),
    __metadata("design:type", Date)
], UserPreferences.prototype, "updatedAt", void 0);
exports.UserPreferences = UserPreferences = __decorate([
    (0, typeorm_1.Entity)({ name: 'user_preferences' })
], UserPreferences);
//# sourceMappingURL=user-preferences.entity.js.map