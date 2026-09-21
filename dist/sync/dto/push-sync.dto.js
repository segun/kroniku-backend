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
exports.PushSyncDto = exports.PushSyncEventDto = exports.SyncEventContextDto = exports.SyncPhotoReferenceDto = exports.SyncWeatherDto = exports.SyncPlaceDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class SyncPlaceDto {
    name;
    latitude;
    longitude;
}
exports.SyncPlaceDto = SyncPlaceDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], SyncPlaceDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], SyncPlaceDto.prototype, "latitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], SyncPlaceDto.prototype, "longitude", void 0);
class SyncWeatherDto {
    observedAt;
    condition;
    temperatureC;
}
exports.SyncWeatherDto = SyncWeatherDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], SyncWeatherDto.prototype, "observedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], SyncWeatherDto.prototype, "condition", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SyncWeatherDto.prototype, "temperatureC", void 0);
class SyncPhotoReferenceDto {
    assetIdentifier;
    filename;
    addedAt;
}
exports.SyncPhotoReferenceDto = SyncPhotoReferenceDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], SyncPhotoReferenceDto.prototype, "assetIdentifier", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], SyncPhotoReferenceDto.prototype, "filename", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], SyncPhotoReferenceDto.prototype, "addedAt", void 0);
class SyncEventContextDto {
    place;
    weather;
    motion;
    timeSemantics;
    photoReferences;
}
exports.SyncEventContextDto = SyncEventContextDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SyncPlaceDto),
    __metadata("design:type", SyncPlaceDto)
], SyncEventContextDto.prototype, "place", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SyncWeatherDto),
    __metadata("design:type", SyncWeatherDto)
], SyncEventContextDto.prototype, "weather", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['driving', 'walking', 'running', 'cycling', 'stationary']),
    __metadata("design:type", String)
], SyncEventContextDto.prototype, "motion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MaxLength)(80, { each: true }),
    __metadata("design:type", Array)
], SyncEventContextDto.prototype, "timeSemantics", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SyncPhotoReferenceDto),
    __metadata("design:type", Array)
], SyncEventContextDto.prototype, "photoReferences", void 0);
class PushSyncEventDto {
    eventId;
    version;
    occurredAt;
    source;
    title;
    detail;
    searchText;
    contextData;
    encryptedPayload;
    payloadHash;
    isDeleted;
}
exports.PushSyncEventDto = PushSyncEventDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], PushSyncEventDto.prototype, "eventId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PushSyncEventDto.prototype, "version", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PushSyncEventDto.prototype, "occurredAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], PushSyncEventDto.prototype, "source", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PushSyncEventDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PushSyncEventDto.prototype, "detail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PushSyncEventDto.prototype, "searchText", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SyncEventContextDto),
    __metadata("design:type", SyncEventContextDto)
], PushSyncEventDto.prototype, "contextData", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PushSyncEventDto.prototype, "encryptedPayload", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(128),
    __metadata("design:type", String)
], PushSyncEventDto.prototype, "payloadHash", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PushSyncEventDto.prototype, "isDeleted", void 0);
class PushSyncDto {
    events;
}
exports.PushSyncDto = PushSyncDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PushSyncEventDto),
    __metadata("design:type", Array)
], PushSyncDto.prototype, "events", void 0);
//# sourceMappingURL=push-sync.dto.js.map