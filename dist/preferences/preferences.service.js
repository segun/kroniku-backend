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
exports.PreferencesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_preferences_entity_1 = require("./entities/user-preferences.entity");
const DEFAULT_DAY_PERIODS = {
    morningStartMinutes: 360,
    afternoonStartMinutes: 720,
    earlyEveningStartMinutes: 960,
    nightStartMinutes: 1260,
};
let PreferencesService = class PreferencesService {
    preferencesRepository;
    constructor(preferencesRepository) {
        this.preferencesRepository = preferencesRepository;
    }
    async getPreferences(user) {
        const preferences = await this.getOrCreate(user.userId);
        return this.toResponse(preferences);
    }
    async updatePreferences(user, dto) {
        const preferences = await this.getOrCreate(user.userId);
        const dayPeriods = {
            morningStartMinutes: dto.dayPeriods?.morningStartMinutes ?? preferences.morningStartMinutes,
            afternoonStartMinutes: dto.dayPeriods?.afternoonStartMinutes ??
                preferences.afternoonStartMinutes,
            earlyEveningStartMinutes: dto.dayPeriods?.earlyEveningStartMinutes ??
                preferences.earlyEveningStartMinutes,
            nightStartMinutes: dto.dayPeriods?.nightStartMinutes ?? preferences.nightStartMinutes,
        };
        this.validateDayPeriods(dayPeriods);
        Object.assign(preferences, dayPeriods);
        if (dto.timezoneIdentifier !== undefined) {
            preferences.timezoneIdentifier = dto.timezoneIdentifier;
        }
        return this.toResponse(await this.preferencesRepository.save(preferences));
    }
    async findForUser(userId) {
        return this.preferencesRepository.findOne({ where: { userId } });
    }
    async getOrCreate(userId) {
        const existing = await this.findForUser(userId);
        if (existing) {
            return existing;
        }
        return this.preferencesRepository.save(this.preferencesRepository.create({
            userId,
            ...DEFAULT_DAY_PERIODS,
            timezoneIdentifier: null,
            schemaVersion: 1,
        }));
    }
    validateDayPeriods(dayPeriods) {
        const starts = Object.values(dayPeriods);
        if (starts.some((minutes) => minutes < 0 || minutes > 1439)) {
            throw new common_1.BadRequestException('Day period starts must be between 0 and 1439 minutes');
        }
        if (starts.some((minutes, index) => index > 0 && minutes <= starts[index - 1])) {
            throw new common_1.BadRequestException('Day period starts must be strictly increasing');
        }
    }
    toResponse(preferences) {
        return {
            schemaVersion: preferences.schemaVersion,
            dayPeriods: {
                morningStartMinutes: preferences.morningStartMinutes,
                afternoonStartMinutes: preferences.afternoonStartMinutes,
                earlyEveningStartMinutes: preferences.earlyEveningStartMinutes,
                nightStartMinutes: preferences.nightStartMinutes,
            },
            timezoneIdentifier: preferences.timezoneIdentifier,
            updatedAt: preferences.updatedAt,
        };
    }
};
exports.PreferencesService = PreferencesService;
exports.PreferencesService = PreferencesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_preferences_entity_1.UserPreferences)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PreferencesService);
//# sourceMappingURL=preferences.service.js.map