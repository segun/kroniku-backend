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
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const search_service_1 = require("./search.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const keyword_search_dto_1 = require("./dto/keyword-search.dto");
const natural_search_dto_1 = require("./dto/natural-search.dto");
let SearchController = class SearchController {
    searchService;
    constructor(searchService) {
        this.searchService = searchService;
    }
    keyword(user, dto) {
        return this.searchService.keyword(user, dto);
    }
    natural(user, dto) {
        return this.searchService.natural(user, dto);
    }
};
exports.SearchController = SearchController;
__decorate([
    (0, common_1.Post)('keyword'),
    (0, swagger_1.ApiOperation)({ summary: 'Run keyword search over projected text fields' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, keyword_search_dto_1.KeywordSearchDto]),
    __metadata("design:returntype", void 0)
], SearchController.prototype, "keyword", null);
__decorate([
    (0, common_1.Post)('natural'),
    (0, swagger_1.ApiOperation)({ summary: 'Run retrieval-first natural-language search (requires opt-in)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, natural_search_dto_1.NaturalSearchDto]),
    __metadata("design:returntype", void 0)
], SearchController.prototype, "natural", null);
exports.SearchController = SearchController = __decorate([
    (0, common_1.Controller)('search'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiTags)('search'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [search_service_1.SearchService])
], SearchController);
//# sourceMappingURL=search.controller.js.map