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
exports.AccountController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const account_service_1 = require("./account.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const update_retrieval_opt_in_dto_1 = require("./dto/update-retrieval-opt-in.dto");
let AccountController = class AccountController {
    accountService;
    constructor(accountService) {
        this.accountService = accountService;
    }
    setRetrievalOptIn(user, dto) {
        return this.accountService.setRetrievalOptIn(user, dto.enabled);
    }
    exportData(user) {
        return this.accountService.exportData(user);
    }
    delete(user) {
        return this.accountService.deleteAccount(user);
    }
};
exports.AccountController = AccountController;
__decorate([
    (0, common_1.Patch)('retrieval-opt-in'),
    (0, swagger_1.ApiOperation)({ summary: 'Enable or disable retrieval-first natural-language search' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_retrieval_opt_in_dto_1.UpdateRetrievalOptInDto]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "setRetrievalOptIn", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, swagger_1.ApiOperation)({ summary: 'Export account data, devices, and synced events' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "exportData", null);
__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete account and all related data' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "delete", null);
exports.AccountController = AccountController = __decorate([
    (0, common_1.Controller)('account'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiTags)('account'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [account_service_1.AccountService])
], AccountController);
//# sourceMappingURL=account.controller.js.map