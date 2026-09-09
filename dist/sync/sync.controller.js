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
exports.SyncController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sync_service_1 = require("./sync.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const push_sync_dto_1 = require("./dto/push-sync.dto");
const pull_sync_dto_1 = require("./dto/pull-sync.dto");
let SyncController = class SyncController {
    syncService;
    constructor(syncService) {
        this.syncService = syncService;
    }
    push(user, dto) {
        return this.syncService.push(user, dto);
    }
    pull(user, dto) {
        return this.syncService.pull(user, dto);
    }
};
exports.SyncController = SyncController;
__decorate([
    (0, common_1.Post)('push'),
    (0, swagger_1.ApiOperation)({ summary: 'Push encrypted event batch with conflict handling' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, push_sync_dto_1.PushSyncDto]),
    __metadata("design:returntype", void 0)
], SyncController.prototype, "push", null);
__decorate([
    (0, common_1.Get)('pull'),
    (0, swagger_1.ApiOperation)({ summary: 'Pull incremental sync changes since optional cursor date' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pull_sync_dto_1.PullSyncDto]),
    __metadata("design:returntype", void 0)
], SyncController.prototype, "pull", null);
exports.SyncController = SyncController = __decorate([
    (0, common_1.Controller)('sync'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiTags)('sync'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [sync_service_1.SyncService])
], SyncController);
//# sourceMappingURL=sync.controller.js.map